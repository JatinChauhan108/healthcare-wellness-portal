# Healthcare Wellness Portal - Backend

A comprehensive Express.js backend for the Healthcare Wellness Portal with MongoDB database.

## Features

### 1. **Secure Authentication System**
- JWT-based authentication with token expiration
- Password hashing using bcryptjs
- Role-based access control (Patient/Provider)
- Session management with audit logging

### 2. **Patient Dashboard**
- View wellness goals progress (steps, water intake, sleep, exercise)
- Track preventive care reminders
- Daily health tips
- Personal health profile management

### 3. **Profile Management**
- View and edit personal information
- Manage health information (allergies, medications)
- Privacy and data usage consent tracking
- Password update functionality

### 4. **Goal Tracker**
- Create custom wellness goals
- Log daily progress (steps, water intake, etc.)
- View progress history and trends
- Dashboard with goal completion statistics

### 5. **Healthcare Provider View**
- View assigned patients list
- Monitor patient compliance status (Goal Met, Missed Preventive Checkup, etc.)
- Track patient goal progress
- Manage preventive care reminders for patients

### 6. **Privacy & Security**
- Comprehensive audit logging for user actions
- Data access tracking
- Consent management during registration
- Secure password storage

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **Validation:** express-validator
- **Logging:** morgan

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS

3. **Start MongoDB:**
   Make sure MongoDB is running on your system or use a cloud MongoDB service (MongoDB Atlas).

4. **Run the server:**
   
   Development mode with auto-restart:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (patient or provider)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/logout` - Logout user (requires authentication)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Update password
- `GET /api/profile/audit-logs` - Get user's audit logs

### Wellness Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/log` - Log goal progress
- `GET /api/goals/:id/logs` - Get goal progress logs
- `GET /api/goals/dashboard` - Get goals dashboard

### Preventive Care Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `PUT /api/reminders/:id/complete` - Mark reminder as completed
- `DELETE /api/reminders/:id` - Delete reminder

### Provider (Provider role only)
- `GET /api/provider/patients` - Get assigned patients with compliance status
- `POST /api/provider/patients` - Assign patient to provider
- `GET /api/provider/patients/:patientId` - Get patient details
- `DELETE /api/provider/patients/:patientId` - Unassign patient

### Health Tips
- `GET /api/health-tips` - Get health tips (public)
- `GET /api/health-tips/daily` - Get daily health tip (public)
- `POST /api/health-tips` - Create health tip (provider only)
- `PUT /api/health-tips/:id` - Update health tip (provider only)
- `DELETE /api/health-tips/:id` - Delete health tip (provider only)

## Database Models

### User
Core user model with authentication and profile information.

### WellnessGoal
Goals for patients (steps, water intake, sleep, etc.).

### GoalLog
Daily logs of goal progress.

### PreventiveCareReminder
Reminders for checkups, vaccinations, screenings.

### ProviderPatientAssignment
Relationship between providers and their assigned patients.

### HealthTip
Health tips and wellness advice.

### AuditLog
Comprehensive logging of user actions for privacy and security.

## Example Usage

### Register a Patient
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepass123",
  "role": "patient",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "123-456-7890",
  "dateOfBirth": "1990-01-01",
  "dataUsageConsent": true
}
```

### Create a Wellness Goal
```bash
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "goalType": "steps",
  "targetValue": 10000,
  "unit": "steps",
  "description": "Daily step goal"
}
```

### Log Goal Progress
```bash
POST /api/goals/:goalId/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "actualValue": 8500,
  "notes": "Rainy day, didn't walk much"
}
```

## Security Features

1. **Password Hashing** - All passwords are hashed using bcryptjs before storage
2. **JWT Authentication** - Secure token-based authentication
3. **Role-Based Access** - Different permissions for patients and providers
4. **Audit Logging** - All sensitive actions are logged
5. **Input Validation** - Request validation using express-validator
6. **CORS Configuration** - Controlled cross-origin access

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── profileController.js
│   ├── goalController.js
│   ├── reminderController.js
│   ├── providerController.js
│   └── healthTipController.js
├── middleware/        # Custom middleware
│   ├── auth.js
│   ├── auditLog.js
│   └── errorHandler.js
├── models/           # Mongoose schemas
│   ├── User.js
│   ├── WellnessGoal.js
│   ├── GoalLog.js
│   ├── PreventiveCareReminder.js
│   ├── ProviderPatientAssignment.js
│   ├── HealthTip.js
│   └── AuditLog.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── goalRoutes.js
│   ├── reminderRoutes.js
│   ├── providerRoutes.js
│   └── healthTipRoutes.js
├── .env.example     # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js        # Application entry point
```

## Development

Run in development mode with auto-restart:
```bash
npm run dev
```

## License

ISC
