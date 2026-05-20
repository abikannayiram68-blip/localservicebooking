// Migration 001: Create initial tables
const migration001 = {
  name: '001_create_initial_tables',
  up: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      estimated_duration VARCHAR(50),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_providers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      skill_type VARCHAR(100) NOT NULL,
      availability_status ENUM('available', 'busy', 'offline') DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      service_id INT NOT NULL,
      provider_id INT,
      booking_date DATE NOT NULL,
      address TEXT NOT NULL,
      status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
      FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS booking_statuses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id INT NOT NULL,
      status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL,
      changed_by INT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  down: `
    DROP TABLE IF EXISTS booking_statuses;
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS service_providers;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS migrations;
  `
};

// Migration 002: Add profile_photo to users
const migration002 = {
  name: '002_add_profile_photo_to_users',
  up: `
    ALTER TABLE users ADD COLUMN profile_photo VARCHAR(500) DEFAULT NULL;
  `,
  down: `
    ALTER TABLE users DROP COLUMN profile_photo;
  `
};

// Migration 003: Add rating to service_providers
const migration003 = {
  name: '003_add_rating_to_service_providers',
  up: `
    ALTER TABLE service_providers ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00;
  `,
  down: `
    ALTER TABLE service_providers DROP COLUMN rating;
  `
};

// Seed default admin and services
const seed = {
  name: '004_seed_default_data',
  up: `
    INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@servicebook.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      password = VALUES(password),
      role = 'admin';

    INSERT IGNORE INTO services (name, description, price, estimated_duration) VALUES
    ('Plumbing', 'Fix leaks, pipes, and drainage issues at your home.', 499.00, '2-3 hours'),
    ('Electrical Repair', 'Wiring, switch, and appliance electrical fixes.', 599.00, '1-2 hours'),
    ('Home Cleaning', 'Deep cleaning of your entire home.', 799.00, '4-5 hours'),
    ('AC Repair', 'Servicing, gas refill, and repair of air conditioners.', 699.00, '2-3 hours'),
    ('Carpentry', 'Furniture repair, installation, and custom woodwork.', 549.00, '3-4 hours'),
    ('Painting', 'Interior and exterior wall painting services.', 1299.00, '1-2 days');

    INSERT IGNORE INTO service_providers (name, phone, skill_type, availability_status) VALUES
    ('Ravi Kumar', '9876543210', 'Plumbing', 'available'),
    ('Suresh Babu', '9876543211', 'Electrical Repair', 'available'),
    ('Meena Devi', '9876543212', 'Home Cleaning', 'available'),
    ('Arjun Raj', '9876543213', 'AC Repair', 'busy'),
    ('Murugan S', '9876543214', 'Carpentry', 'available');
  `,
  down: `
    DELETE FROM service_providers;
    DELETE FROM services;
    DELETE FROM users WHERE email = 'admin@servicebook.com';
  `
};

module.exports = [migration001, migration002, migration003, seed];
