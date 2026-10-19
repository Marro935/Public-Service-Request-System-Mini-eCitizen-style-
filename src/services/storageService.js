// ====================================================================
// eCitizen Unified Data Service Layer
// Bridges REST API (Express + MySQL) with persistent localStorage fallback
// ====================================================================

import {
  INITIAL_CATEGORIES,
  INITIAL_REQUESTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_KEYS = {
  REQUESTS: 'ecitizen_requests_v1',
  USERS: 'ecitizen_users_v1',
  NOTIFICATIONS: 'ecitizen_notifications_v1',
  CURRENT_USER: 'ecitizen_current_user_v1',
  THEME: 'ecitizen_theme_mode'
};

// Check if backend API is reachable
let isBackendAvailable = null;

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      isBackendAvailable = true;
      return true;
    }
  } catch (err) {
    isBackendAvailable = false;
  }
  isBackendAvailable = false;
  return false;
}

// LocalStorage helpers
function getLocalItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return defaultValue;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// Initialize seed data in LocalStorage if empty
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    setLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in user is Citizen Jane Doe
    setLocalItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

// Reset storage to original demo state
export function resetStorageToDemo() {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  return true;
}

// Generate human-readable civic tracking number: EC-2026-XXXX
export function generateTrackingNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EC-${year}-${rand}`;
}

// ====================================================================
// Requests CRUD Operations
// ====================================================================

export async function fetchRequests(filters = {}) {
  // If backend available, try it
  if (isBackendAvailable) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.citizen_id) params.append('citizen_id', filters.citizen_id);

      const res = await fetch(`${API_BASE_URL}/requests?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend fetch failed, falling back to local storage.');
    }
  }

  // Fallback: LocalStorage
  let requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);

  if (filters.citizen_id) {
    requests = requests.filter(r => Number(r.citizen_id) === Number(filters.citizen_id));
  }
  if (filters.status && filters.status !== 'all') {
    requests = requests.filter(r => r.status === filters.status);
  }
  if (filters.category && filters.category !== 'all') {
    requests = requests.filter(r => r.category_id === filters.category);
  }
  if (filters.priority && filters.priority !== 'all') {
    requests = requests.filter(r => r.priority === filters.priority);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    requests = requests.filter(r => 
      r.tracking_number.toLowerCase().includes(s) ||
      r.title.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s) ||
      r.location_address.toLowerCase().includes(s) ||
      (r.citizen_name && r.citizen_name.toLowerCase().includes(s))
    );
  }

  return requests;
}

export async function fetchRequestByTracking(trackingNumber) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${encodeURIComponent(trackingNumber)}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend fetch error, using local fallback.');
    }
  }

  const requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const found = requests.find(r => 
    r.tracking_number.toUpperCase() === trackingNumber.trim().toUpperCase() ||
    String(r.id) === String(trackingNumber).trim()
  );

  return found || null;
}

export async function createServiceRequest(requestData) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend create failed, fallback to local storage.');
    }
  }

  const requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const newTracking = generateTrackingNumber();
  const now = new Date().toISOString();

  const newRecord = {
    id: Date.now(),
    tracking_number: newTracking,
    citizen_id: requestData.citizen_id || 1,
    citizen_name: requestData.citizen_name || 'Anonymous Citizen',
    citizen_phone: requestData.citizen_phone || '',
    category_id: requestData.category_id,
    category_name: requestData.category_name,
    title: requestData.title,
    description: requestData.description,
    location_address: requestData.location_address,
    sub_county: requestData.sub_county || 'Central Ward / CBD',
    latitude: requestData.latitude || -1.286389,
    longitude: requestData.longitude || 36.817223,
    priority: requestData.priority || 'medium',
    status: 'pending',
    image_url: requestData.image_url || null,
    assigned_officer_id: null,
    assigned_officer_name: null,
    assigned_department: requestData.assigned_department || 'Municipal Public Works',
    citizen_rating: null,
    citizen_feedback: null,
    created_at: now,
    updated_at: now,
    timeline: [
      {
        id: Date.now() + 1,
        actor_name: requestData.citizen_name || 'Citizen',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Initial request logged through public service portal.',
        created_at: now
      }
    ]
  };

  requests.unshift(newRecord);
  setLocalItem(STORAGE_KEYS.REQUESTS, requests);

  // Add notification
  const notifications = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  notifications.unshift({
    id: Date.now(),
    user_id: newRecord.citizen_id,
    title: 'Request Submitted',
    message: `Your request ${newTracking} has been registered and is pending review.`,
    tracking_number: newTracking,
    is_read: false,
    created_at: now
  });
  setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifications);

  return newRecord;
}

export async function updateRequestStatus(id, updatePayload) {
  const { status, notes, actor_name, actor_role, assigned_officer_name, assigned_department } = updatePayload;

  if (isBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Backend update failed, updating local storage.');
    }
  }

  const requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const index = requests.findIndex(r => r.id === Number(id));
  if (index === -1) return false;

  const now = new Date().toISOString();
  const current = requests[index];

  const updated = {
    ...current,
    status: status || current.status,
    assigned_officer_name: assigned_officer_name !== undefined ? assigned_officer_name : current.assigned_officer_name,
    assigned_department: assigned_department !== undefined ? assigned_department : current.assigned_department,
    updated_at: now,
    resolved_at: status === 'resolved' ? now : current.resolved_at
  };

  const actionText = `Status changed to ${status.replace('_', ' ').toUpperCase()}`;
  const newTimelineEvent = {
    id: Date.now(),
    actor_name: actor_name || 'Municipal Officer',
    actor_role: actor_role || 'Staff',
    action: actionText,
    notes: notes || `Case transitioned to ${status}.`,
    created_at: now
  };

  updated.timeline = [...(current.timeline || []), newTimelineEvent];
  requests[index] = updated;
  setLocalItem(STORAGE_KEYS.REQUESTS, requests);

  // Add notification for citizen
  const notifications = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  notifications.unshift({
    id: Date.now(),
    user_id: current.citizen_id,
    title: `Request ${status.toUpperCase()}`,
    message: `Your report ${current.tracking_number} status updated to: ${status.replace('_', ' ')}.`,
    tracking_number: current.tracking_number,
    is_read: false,
    created_at: now
  });
  setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifications);

  return true;
}

export async function submitCitizenFeedback(id, { rating, feedback, citizen_name }) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback, citizen_name })
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Backend feedback failed, using local fallback.');
    }
  }

  const requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const index = requests.findIndex(r => r.id === Number(id));
  if (index === -1) return false;

  const now = new Date().toISOString();
  const current = requests[index];

  const updated = {
    ...current,
    citizen_rating: rating,
    citizen_feedback: feedback,
    updated_at: now
  };

  updated.timeline = [
    ...(current.timeline || []),
    {
      id: Date.now(),
      actor_name: citizen_name || 'Citizen',
      actor_role: 'Citizen',
      action: `Citizen Rated ${rating} Stars`,
      notes: feedback || 'Citizen satisfaction feedback recorded.',
      created_at: now
    }
  ];

  requests[index] = updated;
  setLocalItem(STORAGE_KEYS.REQUESTS, requests);
  return true;
}

// ====================================================================
// Analytics Metrics
// ====================================================================

export async function fetchAnalytics() {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend analytics failed, using local computations.');
    }
  }

  const requests = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const in_progress = requests.filter(r => r.status === 'in_progress').length;
  const resolved = requests.filter(r => r.status === 'resolved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  const open_cases = pending + in_progress;
  const resolution_rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Breakdown by category
  const catMap = {};
  INITIAL_CATEGORIES.forEach(c => {
    catMap[c.id] = { category_id: c.id, category_name: c.name, count: 0, resolved_count: 0 };
  });

  requests.forEach(r => {
    if (!catMap[r.category_id]) {
      catMap[r.category_id] = { category_id: r.category_id, category_name: r.category_name, count: 0, resolved_count: 0 };
    }
    catMap[r.category_id].count += 1;
    if (r.status === 'resolved') catMap[r.category_id].resolved_count += 1;
  });

  const categoryBreakdown = Object.values(catMap).sort((a, b) => b.count - a.count);

  // Breakdown by priority
  const priorityBreakdown = [
    { priority: 'urgent', count: requests.filter(r => r.priority === 'urgent').length },
    { priority: 'high', count: requests.filter(r => r.priority === 'high').length },
    { priority: 'medium', count: requests.filter(r => r.priority === 'medium').length },
    { priority: 'low', count: requests.filter(r => r.priority === 'low').length }
  ];

  // Breakdown by location
  const locMap = {};
  requests.forEach(r => {
    const loc = r.sub_county || 'Unspecified';
    locMap[loc] = (locMap[loc] || 0) + 1;
  });
  const locationBreakdown = Object.entries(locMap)
    .map(([sub_county, count]) => ({ sub_county, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    open_cases,
    pending,
    in_progress,
    resolved,
    rejected,
    resolution_rate,
    categoryBreakdown,
    priorityBreakdown,
    locationBreakdown
  };
}

// ====================================================================
// Export to CSV
// ====================================================================

export function exportRequestsToCSV(requests) {
  const headers = [
    'Tracking Number',
    'Date Submitted',
    'Citizen Name',
    'Phone',
    'Category',
    'Title',
    'Priority',
    'Status',
    'Location Address',
    'Sub-County',
    'Assigned Officer',
    'Citizen Rating'
  ];

  const rows = requests.map(r => [
    `"${r.tracking_number}"`,
    `"${new Date(r.created_at).toLocaleDateString()}"`,
    `"${(r.citizen_name || '').replace(/"/g, '""')}"`,
    `"${r.citizen_phone || ''}"`,
    `"${(r.category_name || '').replace(/"/g, '""')}"`,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${r.priority}"`,
    `"${r.status}"`,
    `"${(r.location_address || '').replace(/"/g, '""')}"`,
    `"${(r.sub_county || '').replace(/"/g, '""')}"`,
    `"${(r.assigned_officer_name || 'Unassigned').replace(/"/g, '""')}"`,
    `"${r.citizen_rating || 'N/A'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ecitizen_service_requests_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
