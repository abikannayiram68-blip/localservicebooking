SERVICE BOOKING
LOCAL SERVICE BOOKING FROM YOUR HOME

A simple full-stack web app where users can book home services like:

Electrician
Plumber
Cleaner
AC Repair
Carpenter



Technologies Used
Backend
Node.js
Express.js
MySQL




Frontend
React.js
Axios
React Router v6


Authentication
JWT
bcryptjs
Project Folder Structure
local-service-booking/
- backend/
- frontend/
- README.md
- Postman Collection
Backend Setup
cd backend

npm install
Configure Environment File
cp .env.example .env

Update your MySQL database details inside .env.

Run Database Migration
npm run migrate

This will:

Create database tables
Add default admin account
Add sample services
Start Backend Server
npm run dev

Backend runs on:

http://localhost:5000
Frontend Setup
cd frontend

npm install
npm start

Frontend runs on:

http://localhost:3000
Default Admin Login
Email	Password
admin@servicebook.com	password
Main Features
User Features
Register & Login
View available services
Book services
View booking history
Cancel bookings
Admin Features
Manage bookings
Add/Edit/Delete services
Manage service providers
Update booking status
Database Tables
users
services
service_providers
bookings
booking_statuses
Validation Rules
Booking date should not be past date
Phone number must be valid
Password minimum 6 characters
Users can cancel only their own bookings
Completed bookings cannot be cancelled
API Testing

Import the Postman collection:

ServiceBook.postman_collection.json

Login first to get JWT token automatically.

Git Commit Format
feat: add booking feature
fix: prevent invalid booking date
chore: update database migration
