import { Router } from 'express';
import { executeQuery } from '../config/db.js';

const router = Router();

// GET /api/analytics - Summary counts & metrics
router.get('/', async (req, res) => {
  try {
    // 1. Overall counts
    const counts = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as open_cases
      FROM service_requests
    `);

    const summary = counts[0] || {
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
      open_cases: 0
    };

    const resolutionRate = summary.total > 0 
      ? Math.round((summary.resolved / summary.total) * 100) 
      : 0;

    // 2. Category distribution
    const categoryBreakdown = await executeQuery(`
      SELECT 
        category_id,
        category_name,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
      FROM service_requests
      GROUP BY category_id, category_name
      ORDER BY count DESC
    `);

    // 3. Priority distribution
    const priorityBreakdown = await executeQuery(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM service_requests
      GROUP BY priority
      ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low')
    `);

    // 4. Sub-county / Ward distribution
    const locationBreakdown = await executeQuery(`
      SELECT 
        sub_county,
        COUNT(*) as count
      FROM service_requests
      GROUP BY sub_county
      ORDER BY count DESC
      LIMIT 6
    `);

    return res.json({
      success: true,
      data: {
        total: Number(summary.total),
        open_cases: Number(summary.open_cases),
        pending: Number(summary.pending),
        in_progress: Number(summary.in_progress),
        resolved: Number(summary.resolved),
        rejected: Number(summary.rejected),
        resolution_rate: resolutionRate,
        categoryBreakdown,
        priorityBreakdown,
        locationBreakdown
      }
    });
  } catch (error) {
    console.error('Error in analytics:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
