# Healthcare Wellness Portal Backend - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```powershell
cp .env.example .env
```

Edit `.env` and update the following:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Your frontend URL for CORS

### 3. Start MongoDB

**Local MongoDB:**
```powershell
mongod
```

**Or use MongoDB Atlas** (cloud database) - update MONGODB_URI in .env with your connection string.

### 4. Seed the Database (Optional)

Add sample health tips to the database:
```powershell
npm run seed
```

### 5. Start the Development Server

```powershell
npm run dev
```

The server will start on `http://localhost:5000`

### 6. Test the API

Open your browser or use a tool like Postman/Thunder Client:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Healthcare Wellness Portal API is running",
  "timestamp": "2025-11-18T..."
}
```

## Quick Test Flow

### 1. Register a Patient
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "patient@test.com",
  "password": "password123",
  "role": "patient",
  "firstName": "John",
  "lastName": "Doe",
  "dataUsageConsent": true
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "patient@test.com",
  "password": "password123"
}
```

Save the `token` from the response.

### 3. Create a Goal (use the token)
```bash
POST http://localhost:5000/api/goals
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "goalType": "steps",
  "targetValue": 10000,
  "unit": "steps",
  "description": "Daily step goal"
}
```

### 4. Log Goal Progress
```bash
POST http://localhost:5000/api/goals/GOAL_ID/log
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "actualValue": 8500
}
```

### 5. Get Dashboard
```bash
GET http://localhost:5000/api/goals/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

## Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── authController.js
│   ├── profileController.js
│   ├── goalController.js
│   ├── reminderController.js
│   ├── providerController.js
│   └── healthTipController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── auditLog.js      # Action logging
│   └── errorHandler.js  # Error handling
├── models/              # Database schemas
│   ├── User.js
│   ├── WellnessGoal.js
│   ├── GoalLog.js
│   ├── PreventiveCareReminder.js
│   ├── ProviderPatientAssignment.js
│   ├── HealthTip.js
│   └── AuditLog.js
├── routes/             # API endpoints
├── .env               # Environment variables
├── .env.example      # Environment template
├── server.js         # App entry point
├── seed.js          # Database seeder
└── package.json
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with sample data

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity (if using MongoDB Atlas)

### Port Already in Use
- Change PORT in .env file
- Kill process using port 5000: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`

### JWT Token Invalid
- Make sure JWT_SECRET is set in .env
- Token might be expired (default: 7 days)
- Re-login to get a new token

## Next Steps

1. Connect the frontend to this backend
2. Test all API endpoints
3. Implement additional features as needed
4. Set up production deployment

## Support

For issues or questions, check the README.md file or review the API documentation.
