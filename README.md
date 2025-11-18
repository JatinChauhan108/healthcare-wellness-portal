# Healthcare Wellness & Preventive Care Portal

A full-stack Healthcare MVP built using **React**, **Express.js**, and **MongoDB**, featuring secure authentication, wellness tracking, preventive care reminders, and provider compliance monitoring.

---

## Overview

This project implements a **Healthcare Wellness & Preventive Care Portal** focused on:

- Tracking daily wellness metrics (steps, sleep, active time)
- Managing preventive care reminders
- Allowing patients to update their health profile
- Enabling providers to view patient compliance
- Ensuring secure and privacy-aware data handling

This MVP demonstrates healthcare UX, role-based authentication, and clean full-stack architecture.

---

## Features

### Secure Authentication
- JWT-based login system  
- Role-based routing (Patient / Provider)  
- Protected API endpoints  
- Password hashing (bcrypt)  

### Patient Features
- Dashboard showing:
  - Steps
  - Sleep hours
  - Active minutes
- Preventive care reminders
- Profile management
- Daily goals tracking

### Provider Features
- Provider dashboard
- View assigned patients
- Compliance overview (On Track / At Risk / Overdue)
- Preventive reminder visibility

### Public Features
- Public Health Information page  
- Accessible without login  

---

## User Flow

```ini
User Flow

Landing Page
    ↓
Registration → Login
    ↓
JWT Role-based Redirect

IF Patient:
    Patient Dashboard
        ↓
    View Stats (steps, sleep, active time)
        ↓
    Preventive Reminders
        ↓
    Edit Profile
        ↓
    Goal Tracker
        ↓
    Logout

IF Provider:
    Provider Dashboard
        ↓
    Patient List
        ↓
    Patient Compliance Overview
        ↓
    View Preventive Reminders
        ↓
    Logout

Public Health Information Page (accessible anytime)
```


---

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing

### Database
- MongoDB Atlas

---

## Architecture

React Frontend
↓ (Axios)
Express REST API
↓
MongoDB Atlas


**Architecture Principles**
- Clean separation of concerns  
- Stateless REST API  
- Secure RBAC (Role-Based Access Control)  
- Scalable and modular folder structure  

---

## Frontend Structure

```ini
frontend/
├── public/
│
└── src/
    ├── App.js
    ├── index.js
    │
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── PatientDashboard.jsx
    │   ├── ProviderDashboard.jsx
    │   └── HealthInfo.jsx
    │
    ├── components/
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    └── utils/
        └── api.js
```



---

## Backend Structure

```ini
backend/
│── controllers/
│── models/
│── routes/
│
│── middleware/
│     ├── auth.js
│     ├── roleCheck.js
│
│── server.js
└── package.json
```

---

## API Overview

### Auth Routes

| Method | Route | Description |
|--------|--------|-------------|
| POST | `/auth/register` | Register patient or provider |
| POST | `/auth/login` | Login + generate JWT |
| GET  | `/auth/me` | Get authenticated user |

---

### Patient Routes

| Method | Route | Description |
|--------|--------|-------------|
| GET  | `/patient/dashboard` | Stats, reminders, goals |
| GET  | `/patient/profile` | View profile |
| PUT  | `/patient/profile` | Update profile |
| POST | `/patient/metrics` | Add daily metrics |
| POST | `/patient/goals` | Add daily goal entry |

---

### Provider Routes

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/provider/patients` | List all assigned patients |
| GET | `/provider/patients/:id` | View specific patient metrics |

---


