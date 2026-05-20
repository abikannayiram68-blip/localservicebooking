require('dotenv').config();
const mysql = require('mysql2/promise');
const migrations = require('./migrations');

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'local_service_booking'}\``);
    await connection.query(`USE \`${process.env.DB_NAME || 'local_service_booking'}\``);

    // Create migrations tracking table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const migration of migrations) {
      const [rows] = await connection.query('SELECT id FROM migrations WHERE name = ?', [migration.name]);
      if (rows.length === 0) {
        console.log(`▶  Running migration: ${migration.name}`);
        await connection.query(migration.up);
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [migration.name]);
        console.log(`✅ Completed: ${migration.name}`);
      } else {
        console.log(`⏩ Skipped (already ran): ${migration.name}`);
      }
    }

    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Default admin credentials:');
    console.log('   Email: admin@servicebook.com');
    console.log('   Password: password\n');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();
