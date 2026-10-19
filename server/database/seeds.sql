-- ====================================================================
-- eCitizen Seed Data - Categories, Users, Tickets & Audit Events
-- ====================================================================

USE `ecitizen_db`;

-- 1. Seed Categories
INSERT INTO `service_categories` (`id`, `name`, `department`, `sla_days`, `description`, `icon`) VALUES
('streetlighting', 'Streetlighting & Electrical', 'Department of Energy & Lighting', 2, 'Faulty bulbs, exposed cables, knocked poles', 'Lightbulb'),
('water_sewerage', 'Water Supply & Sewerage', 'Water and Sanitation Board', 1, 'Pipe bursts, supply disruption, open manholes', 'Droplets'),
('garbage_waste', 'Waste Management & Sanitation', 'Environment & Cleansing Services', 3, 'Illegal dumping, uncollected skips, market litter', 'Trash2'),
('roads_transport', 'Road Hazards & Potholes', 'Roads & Infrastructure Directorate', 5, 'Damaged pavement, missing road signs, sinkholes', 'AlertTriangle'),
('parks_trees', 'Public Parks & Dangerous Trees', 'Parks & Urban Forestry', 4, 'Fallen limbs, overgrown branches blocking roads', 'Trees'),
('public_health', 'Public Health & Pest Control', 'Public Health Directorate', 2, 'Stagnant wastewater, food vendor violations', 'ShieldAlert');

-- 2. Seed Users (Password for all demo accounts: 'password123')
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `national_id`, `role`, `department`) VALUES
(1, 'Jane Wanjiku Doe', 'citizen@ecitizen.go.ke', '$2a$10$w8/0mKzQeB1oP.hP3VdC6uWb4b2c1f0b0a8e4e7d9c6b8a2e4f0g1', '+254 712 345 678', 'ID-29481920', 'citizen', NULL),
(2, 'Officer Peter Kamau', 'officer@ecitizen.go.ke', '$2a$10$w8/0mKzQeB1oP.hP3VdC6uWb4b2c1f0b0a8e4e7d9c6b8a2e4f0g1', '+254 722 890 123', 'ID-18392019', 'officer', 'Department of Energy & Lighting'),
(3, 'Eng. Alice Muthoni', 'admin@ecitizen.go.ke', '$2a$10$w8/0mKzQeB1oP.hP3VdC6uWb4b2c1f0b0a8e4e7d9c6b8a2e4f0g1', '+254 733 456 789', 'ID-10293847', 'admin', 'Municipal Executive Directorate');

-- 3. Seed Service Requests
INSERT INTO `service_requests` 
(`id`, `tracking_number`, `citizen_id`, `citizen_name`, `citizen_phone`, `category_id`, `category_name`, `title`, `description`, `location_address`, `sub_county`, `latitude`, `longitude`, `priority`, `status`, `image_url`, `assigned_officer_id`, `assigned_officer_name`, `assigned_department`, `citizen_rating`, `citizen_feedback`, `resolved_at`, `created_at`) 
VALUES
(1, 'EC-2026-1042', 1, 'Jane Wanjiku Doe', '+254 712 345 678', 'streetlighting', 'Streetlighting & Electrical', 'Damaged Streetlight Pole Leaning on Pedestrian Walkway', 'The Victorian street lighting unit #114 is damaged and unlit at night, creating a hazardous dark spot near the bus stop.', 'Kenyatta Avenue, Near Central Bus Terminus', 'Central District', -1.286389, 36.817223, 'high', 'in_progress', '/sample-streetlight.jpg', 2, 'Officer Peter Kamau', 'Department of Energy & Lighting', NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(2, 'EC-2026-1043', 1, 'Jane Wanjiku Doe', '+254 712 345 678', 'water_sewerage', 'Water Supply & Sewerage', 'Main Water Supply Pipe Burst Causing Road Flooding', 'A high-pressure underground pipe burst on Oak Street sidewalk. Clean potable water is gushing across two road lanes.', 'Oak Street & 4th Avenue junction, Westlands', 'Westlands', -1.265833, 36.804722, 'urgent', 'pending', '/sample-waterleak.jpg', NULL, NULL, 'Water and Sanitation Board', NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR)),

(3, 'EC-2026-1044', 1, 'Jane Wanjiku Doe', '+254 712 345 678', 'garbage_waste', 'Waste Management & Sanitation', 'Uncollected Waste Skips and Overcrowded Recycling Bins', 'Council recycling dumpsters are overflowing with cardboard and household bags. Need collection vehicle dispatch.', 'Market Road, Highridge Commercial Strip', 'Parklands', -1.259722, 36.821944, 'medium', 'resolved', '/sample-garbage.jpg', 2, 'Officer Peter Kamau', 'Environment & Cleansing Services', 5, 'Prompt cleanup! The collection crew arrived at 8:00 AM and left the walkway spotless. Excellent civic service!', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

(4, 'EC-2026-1045', 1, 'Jane Wanjiku Doe', '+254 712 345 678', 'roads_transport', 'Road Hazards & Potholes', 'Deep Asphalt Pothole Near Primary School Crossing', 'Large pothole measuring approx 1.5m wide and 15cm deep causing severe vehicle tire punctures during rush hour.', 'Langata Road, Opp. St. Marys School', 'Langata', -1.332500, 36.758333, 'high', 'in_progress', NULL, 2, 'Officer Peter Kamau', 'Roads & Infrastructure Directorate', NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 4. Seed Request Timelines
INSERT INTO `request_timeline` (`request_id`, `actor_name`, `actor_role`, `action`, `notes`, `is_internal`, `created_at`) VALUES
(1, 'Jane Wanjiku Doe', 'Citizen', 'Request Submitted', 'Initial citizen report registered through mobile portal.', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'System Router', 'System', 'Automated Triage', 'Routed to Department of Energy & Lighting based on category.', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'Eng. Alice Muthoni', 'Admin', 'Officer Assigned', 'Assigned to field technician Officer Peter Kamau.', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Officer Peter Kamau', 'Officer', 'Status changed to In Progress', 'Site inspection completed. Replacement luminaire fixture dispatched from depot.', FALSE, DATE_SUB(NOW(), INTERVAL 12 HOUR)),

(2, 'Jane Wanjiku Doe', 'Citizen', 'Request Submitted', 'Citizen uploaded photo proof of active water main rupture.', FALSE, DATE_SUB(NOW(), INTERVAL 5 HOUR)),

(3, 'Jane Wanjiku Doe', 'Citizen', 'Request Submitted', 'Reported overflowing recycling bins.', FALSE, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 'Eng. Alice Muthoni', 'Admin', 'Work Order Dispatched', 'Dispatching sanitation truck #12 for afternoon route.', FALSE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 'Officer Peter Kamau', 'Officer', 'Status changed to Resolved', 'All dumpsters emptied and sanitized. Area photographed and approved.', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'Jane Wanjiku Doe', 'Citizen', 'Citizen Rated 5 Stars', 'Prompt cleanup! The collection crew arrived at 8:00 AM and left the walkway spotless.', FALSE, DATE_SUB(NOW(), INTERVAL 18 HOUR));

-- 5. Seed Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `tracking_number`, `is_read`, `created_at`) VALUES
(1, 'Request In Progress', 'Officer Peter Kamau was assigned to your Streetlight report EC-2026-1042.', 'EC-2026-1042', FALSE, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(1, 'Service Request Resolved', 'Your Waste Management request EC-2026-1044 was marked Resolved. Please rate the service.', 'EC-2026-1044', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY));
