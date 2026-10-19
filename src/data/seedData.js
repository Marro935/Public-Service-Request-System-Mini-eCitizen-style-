// ====================================================================
// eCitizen Seed Data - Categories, Sample Tickets & Municipal Users
// ====================================================================

export const INITIAL_CATEGORIES = [
  {
    id: 'streetlighting',
    name: 'Streetlighting & Electrical',
    department: 'Department of Energy & Public Lighting',
    sla_days: 2,
    description: 'Dark zones, unlit bulbs, flickering fixtures, fallen poles',
    icon: 'Lightbulb',
    color: '#f59e0b'
  },
  {
    id: 'water_sewerage',
    name: 'Water Supply & Sewerage',
    department: 'Water & Sanitation Directorate',
    sla_days: 1,
    description: 'Underground main bursts, low water pressure, open manholes',
    icon: 'Droplets',
    color: '#0284c7'
  },
  {
    id: 'garbage_waste',
    name: 'Waste Management & Cleansing',
    department: 'Environment & Sanitation Board',
    sla_days: 3,
    description: 'Overflowing community bins, illegal waste dumping, market cleaning',
    icon: 'Trash2',
    color: '#059669'
  },
  {
    id: 'roads_transport',
    name: 'Road Hazards & Potholes',
    department: 'Roads, Bridges & Infrastructure',
    sla_days: 5,
    description: 'Deep road potholes, broken guardrails, missing storm drain grates',
    icon: 'AlertTriangle',
    color: '#ea580c'
  },
  {
    id: 'parks_trees',
    name: 'Public Parks & Dangerous Trees',
    department: 'Urban Forestry & Green Spaces',
    sla_days: 4,
    description: 'Fallen branches on roads, hazardous dead trees, park maintenance',
    icon: 'Trees',
    color: '#16a34a'
  },
  {
    id: 'public_health',
    name: 'Public Health & Pest Control',
    department: 'Directorate of Public Health',
    sla_days: 2,
    description: 'Stagnant water pools, mosquito breeding vectors, sanitation compliance',
    icon: 'ShieldAlert',
    color: '#dc2626'
  }
];

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Jane Wanjiku Doe',
    email: 'citizen@ecitizen.go.ke',
    password: 'password123',
    phone: '+254 712 345 678',
    national_id: 'ID-29481920',
    role: 'citizen',
    department: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Officer Peter Kamau',
    email: 'officer@ecitizen.go.ke',
    password: 'password123',
    phone: '+254 722 890 123',
    national_id: 'ID-18392019',
    role: 'officer',
    department: 'Department of Energy & Public Lighting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Eng. Alice Muthoni',
    email: 'admin@ecitizen.go.ke',
    password: 'password123',
    phone: '+254 733 456 789',
    national_id: 'ID-10293847',
    role: 'admin',
    department: 'Municipal Executive Directorate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const SUB_COUNTIES = [
  'Central Ward / CBD',
  'Westlands Sub-County',
  'Parklands & Highridge',
  'Kilimani & Kileleshwa',
  'Langata Ward',
  'Kasarani Sub-County',
  'Embakasi North',
  'Dagoretti South'
];

export const INITIAL_REQUESTS = [
  {
    id: 1,
    tracking_number: 'EC-2026-1042',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'streetlighting',
    category_name: 'Streetlighting & Electrical',
    title: 'Damaged Streetlight Pole Leaning on Pedestrian Walkway',
    description: 'The municipal streetlight post #114 is knocked askew and completely unlit at night, creating a hazardous dark spot near the busy commuter bus terminal.',
    location_address: 'Kenyatta Avenue, Near Central Bus Terminus',
    sub_county: 'Central Ward / CBD',
    latitude: -1.286389,
    longitude: 36.817223,
    priority: 'high',
    status: 'in_progress',
    image_url: '/sample-streetlight.jpg',
    assigned_officer_id: 2,
    assigned_officer_name: 'Officer Peter Kamau',
    assigned_department: 'Department of Energy & Public Lighting',
    citizen_rating: null,
    citizen_feedback: null,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 101,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Initial citizen request registered via eCitizen web portal with site photography.',
        created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        id: 102,
        actor_name: 'Eng. Alice Muthoni',
        actor_role: 'Admin',
        action: 'Assigned to Energy & Lighting Dept',
        notes: 'Assigned priority HIGH due to heavy pedestrian foot traffic after dark.',
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      },
      {
        id: 103,
        actor_name: 'Officer Peter Kamau',
        actor_role: 'Officer',
        action: 'Status changed to In Progress',
        notes: 'Field reconnaissance completed. Replacement LED luminaire fixture dispatched from regional depot.',
        created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 2,
    tracking_number: 'EC-2026-1043',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'water_sewerage',
    category_name: 'Water Supply & Sewerage',
    title: 'Main Water Supply Pipe Burst Causing Road Flooding',
    description: 'Underground high pressure water main fractured near Oak Street sidewalk. Clean potable water is spewing across two vehicle lanes and entering commercial storefronts.',
    location_address: 'Oak Street & 4th Avenue junction, Westlands',
    sub_county: 'Westlands Sub-County',
    latitude: -1.265833,
    longitude: 36.804722,
    priority: 'urgent',
    status: 'pending',
    image_url: '/sample-waterleak.jpg',
    assigned_officer_id: null,
    assigned_officer_name: null,
    assigned_department: 'Water & Sanitation Directorate',
    citizen_rating: null,
    citizen_feedback: null,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 201,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Urgent leak reported with live flood photos. Emergency shutoff requested.',
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 3,
    tracking_number: 'EC-2026-1044',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'garbage_waste',
    category_name: 'Waste Management & Cleansing',
    title: 'Uncollected Waste Skips and Overcrowded Recycling Bins',
    description: 'Council communal refuse containers are overfilled with cardboard boxes and domestic bags awaiting collection truck on Market Road.',
    location_address: 'Market Road, Highridge Commercial Strip',
    sub_county: 'Parklands & Highridge',
    latitude: -1.259722,
    longitude: 36.821944,
    priority: 'medium',
    status: 'resolved',
    image_url: '/sample-garbage.jpg',
    assigned_officer_id: 2,
    assigned_officer_name: 'Officer Peter Kamau',
    assigned_department: 'Environment & Sanitation Board',
    citizen_rating: 5,
    citizen_feedback: 'Prompt cleanup! The collection crew arrived at 8:00 AM and left the walkway spotless. Excellent civic service!',
    resolved_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 301,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Reported overflowing garbage bins.',
        created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
      },
      {
        id: 302,
        actor_name: 'Eng. Alice Muthoni',
        actor_role: 'Admin',
        action: 'Sanitation Truck #12 Dispatched',
        notes: 'Scheduled for morning collection cycle.',
        created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      },
      {
        id: 303,
        actor_name: 'Officer Peter Kamau',
        actor_role: 'Officer',
        action: 'Status changed to Resolved',
        notes: 'All waste cleared, pavement swept, and new bins placed.',
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: 304,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Citizen Rated 5 Stars',
        notes: 'Prompt cleanup! The collection crew arrived at 8:00 AM and left the walkway spotless.',
        created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 4,
    tracking_number: 'EC-2026-1045',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'roads_transport',
    category_name: 'Road Hazards & Potholes',
    title: 'Severe Crater Pothole Near Primary School Crossing',
    description: 'Large asphalt crater measuring approximately 1.5m wide and 15cm deep causing vehicle rim damage and sudden braking near school crosswalk.',
    location_address: 'Langata Road, Opposite St. Marys School',
    sub_county: 'Langata Ward',
    latitude: -1.332500,
    longitude: 36.758333,
    priority: 'high',
    status: 'in_progress',
    image_url: null,
    assigned_officer_id: 2,
    assigned_officer_name: 'Officer Peter Kamau',
    assigned_department: 'Roads, Bridges & Infrastructure',
    citizen_rating: null,
    citizen_feedback: null,
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 401,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Hazardous road condition reported.',
        created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      },
      {
        id: 402,
        actor_name: 'Officer Peter Kamau',
        actor_role: 'Officer',
        action: 'Status changed to In Progress',
        notes: 'Road safety cones placed around crater. Cold asphalt patch scheduled.',
        created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 5,
    tracking_number: 'EC-2026-1046',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'parks_trees',
    category_name: 'Public Parks & Dangerous Trees',
    title: 'Heavy Acacia Branch Broken and Obstructing Power Line',
    description: 'During yesterday afternoon gale wind storm, large branch snapped and is resting against power lines along Arboretum Drive.',
    location_address: 'Arboretum Drive, Entrance Gate B',
    sub_county: 'Kilimani & Kileleshwa',
    latitude: -1.278333,
    longitude: 36.808611,
    priority: 'urgent',
    status: 'pending',
    image_url: null,
    assigned_officer_id: null,
    assigned_officer_name: null,
    assigned_department: 'Urban Forestry & Green Spaces',
    citizen_rating: null,
    citizen_feedback: null,
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 501,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Tree branch touching overhead electrical feeder reported.',
        created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 6,
    tracking_number: 'EC-2026-1047',
    citizen_id: 1,
    citizen_name: 'Jane Wanjiku Doe',
    citizen_phone: '+254 712 345 678',
    category_id: 'public_health',
    category_name: 'Public Health & Pest Control',
    title: 'Stagnant Green Runoff Pool Causing Mosquito Swarms',
    description: 'Blocked side drainage ditch has created stagnant murky water pool near open food stalls, creating significant malaria & dengue vector risk.',
    location_address: 'Kasarani Mwiki Road, Stage 4',
    sub_county: 'Kasarani Sub-County',
    latitude: -1.222222,
    longitude: 36.898889,
    priority: 'medium',
    status: 'resolved',
    image_url: null,
    assigned_officer_id: 2,
    assigned_officer_name: 'Officer Peter Kamau',
    assigned_department: 'Directorate of Public Health',
    citizen_rating: 4,
    citizen_feedback: 'Health inspector came out with larvicide treatment and unblocked the culvert. Very satisfied.',
    resolved_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 601,
        actor_name: 'Jane Wanjiku Doe',
        actor_role: 'Citizen',
        action: 'Request Submitted',
        notes: 'Public health concern logged.',
        created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString()
      },
      {
        id: 602,
        actor_name: 'Officer Peter Kamau',
        actor_role: 'Officer',
        action: 'Status changed to Resolved',
        notes: 'Culvert excavated, larvicide applied to eliminate breeding grounds.',
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    user_id: 1,
    title: 'Field Officer Dispatched',
    message: 'Officer Peter Kamau was assigned to your Streetlight request EC-2026-1042.',
    tracking_number: 'EC-2026-1042',
    is_read: false,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 1,
    title: 'Service Request Resolved',
    message: 'Your Waste Management request EC-2026-1044 has been successfully resolved.',
    tracking_number: 'EC-2026-1044',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];
