-- ====================================================================
-- eCitizen Public Service Request System - MySQL Database Schema
-- Version: 1.0.0
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `ecitizen_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `ecitizen_db`;

-- 1. Users Table (Citizens, Department Field Officers, Municipal Admins)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `national_id` VARCHAR(50) DEFAULT NULL,
  `role` ENUM('citizen', 'officer', 'admin') NOT NULL DEFAULT 'citizen',
  `department` VARCHAR(100) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Service Categories Reference Table
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `sla_days` INT DEFAULT 3,
  `description` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'Wrench'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Public Service Requests Table
CREATE TABLE IF NOT EXISTS `service_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_number` VARCHAR(30) NOT NULL UNIQUE,
  `citizen_id` INT NOT NULL,
  `citizen_name` VARCHAR(120) NOT NULL,
  `citizen_phone` VARCHAR(40) DEFAULT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `category_name` VARCHAR(120) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location_address` VARCHAR(255) NOT NULL,
  `sub_county` VARCHAR(100) NOT NULL,
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `status` ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
  `image_url` VARCHAR(500) DEFAULT NULL,
  `assigned_officer_id` INT DEFAULT NULL,
  `assigned_officer_name` VARCHAR(120) DEFAULT NULL,
  `assigned_department` VARCHAR(100) DEFAULT NULL,
  `citizen_rating` INT DEFAULT NULL,
  `citizen_feedback` TEXT DEFAULT NULL,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_requests_tracking` (`tracking_number`),
  INDEX `idx_requests_status` (`status`),
  INDEX `idx_requests_citizen` (`citizen_id`),
  INDEX `idx_requests_category` (`category_id`),
  INDEX `idx_requests_priority` (`priority`),
  CONSTRAINT `fk_requests_user` FOREIGN KEY (`citizen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Status History & Audit Timeline
CREATE TABLE IF NOT EXISTS `request_timeline` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `request_id` INT NOT NULL,
  `actor_name` VARCHAR(120) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(150) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `is_internal` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_timeline_request` (`request_id`),
  CONSTRAINT `fk_timeline_request` FOREIGN KEY (`request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `tracking_number` VARCHAR(30) DEFAULT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
