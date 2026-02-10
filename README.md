# Smart Transport System

<div align="center">

[![Flask](https://img.shields.io/badge/Flask-3.0-green?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow?style=flat-square&logo=python)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)](LICENSE)

A comprehensive intelligent transport management system featuring facial recognition authentication, real-time journey tracking, multi-user roles, and an advanced admin dashboard.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture) • [API Documentation](#api-documentation)

</div>

---

## 📋 Overview

Smart Transport System is a full-stack web application designed to revolutionize urban transportation management. It combines modern web technologies with machine learning to provide seamless passenger and driver experiences while offering administrators powerful insights and control over the entire transport network.

### Key Highlights
- 🔐 **Facial Recognition Authentication** - Secure login using face verification
- 🚌 **Journey Management** - Real-time tracking and scheduling of transport routes
- 💳 **Integrated Wallet System** - Cashless payment and balance management
- 📊 **Admin Dashboard** - Comprehensive analytics and control panel
- 👥 **Multi-Role Support** - Dedicated interfaces for passengers, drivers, and administrators
- 🎯 **Route Optimization** - Efficient journey planning and management

---

## ✨ Features

### For Passengers
- Secure facial recognition authentication
- Browse and book available journeys
- Real-time journey tracking
- Digital wallet for payments
- View transaction history
- Rate and review journeys

### For Drivers
- Dashboard with assigned routes
- Passenger management
- Earnings tracking
- Journey history and analytics
- Real-time notifications

### For Administrators
- Comprehensive system analytics
- User and driver management
- Transport/bus inventory management
- Journey monitoring and control
- Transaction and wallet management
- Revenue analytics and reports
- System activity tracking

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python 3.8+)
- **Database**: PostgreSQL
- **Authentication**: JWT + Facial Recognition
- **CORS**: Flask-CORS for cross-origin requests
- **ML**: Face encoding and verification (OpenCV/face_recognition)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7.2
- **Routing**: React Router 7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Toastify

### Development Tools
- **Linting**: ESLint
- **TypeScript Support**: Available
- **Hot Reload**: Vite with HMR

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** - Backend runtime
- **Node.js 16+** - Frontend development
- **npm or yarn** - Package manager
- **PostgreSQL 12+** - Database
- **Git** - Version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-transport-system.git
cd smart-transport-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with configuration
cp .env.example .env
# Update .env with your database credentials and SECRET_KEY
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
yarn install
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DB_HOST=localhost
DB_NAME=smart_transport
DB_USER=postgres
DB_PASSWORD=your-db-password

# CORS
CORS_ORIGIN=http://localhost:5173

# Face Recognition (optional)
FACE_RECOGNITION_MODEL=hog
```

### Frontend Configuration (vite.config.js)

The frontend is pre-configured to connect to `http://localhost:5050` for API calls. Modify as needed for your deployment environment.

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend server will run on `http://localhost:5050`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend can be deployed using WSGI servers like Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5050 app:app
```

---

## 📁 Project Structure

```
smart-transport-system/
├── backend/
│   ├── app.py                          # Flask application entry point
│   ├── config/
│   │   └── config.py                  # Configuration management
│   ├── controllers/                   # Business logic layer
│   │   ├── auth_controller.py         # Authentication logic
│   │   ├── driver_controller.py       # Driver management
│   │   ├── passenger_controller.py    # Passenger management
│   │   ├── journey_controller.py      # Journey management
│   │   ├── wallet_controller.py       # Wallet/Payment logic
│   │   ├── dashboard_controller.py    # User dashboard
│   │   ├── admin_dashboard_controller.py  # Admin analytics
│   │   └── face_controller.py         # Facial recognition
│   ├── routes/                        # API route definitions
│   ├── middleware/
│   │   └── auth.py                   # Authentication middleware
│   ├── ml/                            # Machine learning modules
│   │   ├── face_encode.py            # Face encoding
│   │   └── face_verify.py            # Face verification
│   ├── db/
│   │   └── database.py               # Database connection
│   └── utils/
│       └── ml_runner.py              # ML utility functions
│
└── frontend/
    ├── src/
    │   ├── App.jsx                    # Root component
    │   ├── main.jsx                   # Entry point
    │   ├── pages/                     # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── FaceLogin.jsx
    │   │   ├── Register.jsx
    │   │   ├── DriverDashboard.jsx
    │   │   ├── passenger.jsx
    │   │   ├── passengerBus.jsx
    │   │   └── dashboard.tsx
    │   ├── admin/                     # Admin portal
    │   │   ├── pages/                 # Admin pages
    │   │   ├── components/            # Reusable UI components
    │   │   ├── layout/                # Admin layout
    │   │   └── api/                   # Admin API calls
    │   ├── components/                # Shared components
    │   └── assets/                    # Static assets
    ├── package.json                   # Frontend dependencies
    ├── vite.config.js                 # Vite configuration
    └── eslint.config.js               # Linting configuration
```

---

## 🔌 API Endpoints Overview

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-face` - Facial recognition login
- `POST /auth/logout` - User logout

### Journeys
- `GET /api/journeys` - List all journeys
- `POST /api/journeys` - Create new journey
- `GET /api/journeys/<id>` - Get journey details
- `PUT /api/journeys/<id>` - Update journey

### Passengers
- `GET /api/passengers/profile` - Get passenger profile
- `GET /api/passengers/bookings` - List user bookings
- `POST /api/passengers/book` - Book a journey

### Drivers
- `GET /api/drivers/dashboard` - Driver dashboard data
- `GET /api/drivers/trips` - List driver trips

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/topup` - Top-up wallet
- `GET /api/wallet/transactions` - Transaction history

### Admin Dashboard
- `GET /admin/dashboard` - System overview
- `GET /admin/users` - User management
- `GET /admin/journeys` - Journey management
- `GET /admin/transactions` - Transaction reports

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Facial Recognition**: Multi-factor biometric security
- **CORS Protection**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data management
- **Password Hashing**: Secure password storage (bcrypt)
- **SQL Injection Prevention**: Parameterized queries

---

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:
- **Users** - System users (passengers, drivers, admins)
- **Journeys** - Transport routes and schedules
- **Bookings** - User journey bookings
- **Transactions** - Payment records
- **Wallets** - User digital wallets
- **Drivers** - Driver profiles and statistics
- **Buses** - Vehicle information

---

## 🤖 Machine Learning Integration

### Face Recognition Features
- **Face Encoding** - Converts facial images to numerical vectors
- **Face Verification** - Validates faces against stored encodings
- **Real-time Processing** - Fast inference for authentication

The ML module uses industry-standard libraries for reliable facial recognition.

---

## 📱 Supported Browsers

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🚀 Deployment

### Heroku
```bash
# Create Procfile
echo "web: gunicorn -w 4 -b 0.0.0.0:\$PORT app:app" > Procfile
heroku create your-app-name
git push heroku main
```

### Docker
```bash
docker build -t smart-transport .
docker run -p 5050:5050 smart-transport
```

### AWS/GCP/Azure
See individual cloud provider documentation for Flask and React deployment.

---

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

### Code Quality
```bash
# Linting
cd frontend
npm run lint

# Backend linting
cd backend
flake8 .
```

---

## 📝 Environment Variables Guide

| Variable | Purpose | Example |
|----------|---------|---------|
| `SECRET_KEY` | Flask session key | `your-secret-key` |
| `DB_HOST` | Database host | `localhost` |
| `DB_NAME` | Database name | `smart_transport` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your-password` |
| `CORS_ORIGIN` | Frontend origin | `http://localhost:5173` |
| `FLASK_ENV` | Environment type | `development` or `production` |

---
