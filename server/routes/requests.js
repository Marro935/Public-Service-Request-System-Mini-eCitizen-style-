import { Router } from 'express';
import { executeQuery } from '../config/db.js';

const router = Router();

// Helper to generate unique tracking number: EC-2026-XXXX
function generateTrackingNumber() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `EC-${new Date().getFullYear()}-${randomDigits}`;
}

// GET /api/requests - List service requests
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, citizen_id, search } = req.query;
    let sql = 'SELECT * FROM service_requests WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (category && category !== 'all') {
      sql += ' AND category_id = ?';
      params.push(category);
    }
    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (citizen_id) {
      sql += ' AND citizen_id = ?';
      params.push(citizen_id);
    }
    if (search) {
      sql += ' AND (tracking_number LIKE ? OR title LIKE ? OR description LIKE ? OR location_address LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    sql += ' ORDER BY created_at DESC';

    const requests = await executeQuery(sql, params);
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/requests/:trackingNumber - Get single request with its timeline
router.get('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const rows = await executeQuery(
      'SELECT * FROM service_requests WHERE tracking_number = ? OR id = ?',
      [trackingNumber, isNaN(trackingNumber) ? 0 : parseInt(trackingNumber, 10)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    const request = rows[0];

    // Fetch timeline events
    const timeline = await executeQuery(
      'SELECT * FROM request_timeline WHERE request_id = ? ORDER BY created_at ASC',
      [request.id]
    );

    request.timeline = timeline;
    return res.json({ success: true, data: request });
  } catch (error) {
    console.error('Error fetching request details:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/requests - Submit new citizen request
router.post('/', async (req, res) => {
  try {
    const {
      citizen_id,
      citizen_name,
      citizen_phone,
      category_id,
      category_name,
      title,
      description,
      location_address,
      sub_county,
      latitude,
      longitude,
      priority,
      image_url
    } = req.body;

    if (!title || !description || !category_id || !location_address) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and location address are required.'
      });
    }

    let trackingNumber;
    let isUnique = false;
    while (!isUnique) {
      trackingNumber = generateTrackingNumber();
      const existing = await executeQuery('SELECT id FROM service_requests WHERE tracking_number = ?', [trackingNumber]);
      if (existing.length === 0) isUnique = true;
    }

    const insertResult = await executeQuery(
      `INSERT INTO service_requests 
       (tracking_number, citizen_id, citizen_name, citizen_phone, category_id, category_name, 
        title, description, location_address, sub_county, latitude, longitude, priority, 
        status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        trackingNumber,
        citizen_id || 1,
        citizen_name || 'Anonymous Citizen',
        citizen_phone || null,
        category_id,
        category_name || category_id,
        title,
        description,
        location_address,
        sub_county || 'Central Ward',
        latitude || -1.286389,
        longitude || 36.817223,
        priority || 'medium',
        image_url || null
      ]
    );

    const requestId = insertResult.insertId;

    // Add initial timeline event
    await executeQuery(
      `INSERT INTO request_timeline (request_id, actor_name, actor_role, action, notes)
       VALUES (?, ?, 'Citizen', 'Request Submitted', 'Citizen registered civic report.')`,
      [requestId, citizen_name || 'Citizen']
    );

    // Create notification
    if (citizen_id) {
      await executeQuery(
        `INSERT INTO notifications (user_id, title, message, tracking_number)
         VALUES (?, 'Request Received', ?, ?)`,
        [citizen_id, `Your request ${trackingNumber} has been logged and assigned to review.`, trackingNumber]
      );
    }

    const createdRecord = {
      id: requestId,
      tracking_number: trackingNumber,
      status: 'pending',
      title,
      category_name: category_name || category_id,
      created_at: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: createdRecord
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/requests/:id/status - Update Status (Pending -> In Progress -> Resolved / Rejected)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, actor_name, actor_role, assigned_officer_name, assigned_department } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of ${validStatuses.join(', ')}` });
    }

    const resolvedAtSql = status === 'resolved' ? 'NOW()' : 'NULL';

    await executeQuery(
      `UPDATE service_requests 
       SET status = ?, 
           assigned_officer_name = COALESCE(?, assigned_officer_name),
           assigned_department = COALESCE(?, assigned_department),
           resolved_at = ${status === 'resolved' ? 'NOW()' : 'resolved_at'}
       WHERE id = ?`,
      [status, assigned_officer_name || null, assigned_department || null, id]
    );

    // Add timeline audit event
    const actionLabel = `Status changed to ${status.replace('_', ' ').toUpperCase()}`;
    await executeQuery(
      `INSERT INTO request_timeline (request_id, actor_name, actor_role, action, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [id, actor_name || 'Admin', actor_role || 'Municipal Admin', actionLabel, notes || `Status updated to ${status}.`]
    );

    return res.json({
      success: true,
      message: `Request status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/requests/:id/feedback - Citizen ratings & reviews
router.post('/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, citizen_name } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
    }

    await executeQuery(
      'UPDATE service_requests SET citizen_rating = ?, citizen_feedback = ? WHERE id = ?',
      [rating, feedback || null, id]
    );

    await executeQuery(
      `INSERT INTO request_timeline (request_id, actor_name, actor_role, action, notes)
       VALUES (?, ?, 'Citizen', ?, ?)`,
      [id, citizen_name || 'Citizen', `Citizen Rated ${rating} Stars`, feedback || 'Service rated by citizen.']
    );

    return res.json({ success: true, message: 'Feedback recorded successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
