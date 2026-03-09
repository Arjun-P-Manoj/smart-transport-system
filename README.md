# AI Transit - Smart City Transport System

<div align="center">

![AI Transit Logo](./frontend/public/logo.png)

**A comprehensive AI-powered smart city transportation platform with facial recognition, real-time journey tracking, and secure wallet management.**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 📋 Overview

AI Transit is an intelligent transportation management system designed for smart cities. It provides seamless journey booking, real-time tracking, passenger management, and driver coordination with advanced security features including facial recognition and OTP-based authentication.

The platform supports multiple user roles including **passengers**, **drivers**, and **administrators**, each with specialized dashboards and features.

---

## ✨ Features

### 🎯 Core Features

- **User Authentication**
  - Email/Password registration and login
  - OTP verification via email
  - Facial recognition for secure login
  - Role-based access control

- **Passenger Management**
  - Browse available buses and journeys
  - Real-time bus tracking and status updates
  - Seamless journey booking
  - Passenger dashboard with booking history

- **Driver Management**
  - Driver profile and document management
  - Active journey management
  - Real-time location sharing
  - Performance analytics

- **Journey & Booking System**
  - Create and manage bus routes
  - Real-time journey status tracking
  - Booking management and cancellation
  - Seat availability tracking

- **Digital Wallet**
  - Secure payment processing
  - Transaction history
  - Balance management
  - Multiple payment options

- **Admin Dashboard**
  - User and driver management
  - Bus fleet management
  - Journey monitoring
  - Revenue analytics and reports
  - Real-time activity tracking

- **AI & Security**
  - Facial recognition for user authentication
  - Secure OTP-based verification
  - JWT token-based authorization

---

## 🛠 Tech Stack

### Backend
- **Framework**: Python Flask
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Flask-Mail (Gmail SMTP)
- **CORS**: Flask-CORS
- **ML/AI**: Python-based facial recognition
- **Environment**: Python 3.8+

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: React-Toastify
- **Node**: v16+

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** and pip
- **Node.js 16+** and npm
- **PostgreSQL 12+**
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
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
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=postgres
DB_HOST=localhost

# Security
SECRET_KEY=your-secret-key-here

# Email Configuration
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password

# Server Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb your_database_name

# Run migrations (if applicable)
# python manage.py db upgrade
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file if needed
touch .env
```

---

## 🎯 Usage

### Running the Backend

```bash
cd backend
source venv/bin/activate  # macOS/Linux
python app.py
```

The backend server will start at `http://localhost:5000`

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
# Set FLASK_ENV to production
export FLASK_ENV=production
python app.py
```

---

## 📁 Project Structure

```
smart-transport-system/
├── backend/
│   ├── app.py                          # Flask application entry point
│   ├── extensions.py                   # Flask extensions initialization
│   ├── config/
│   │   └── config.py                   # Configuration settings
│   ├── controllers/                    # Business logic layer
│   │   ├── auth_controller.py
│   │   ├── face_controller.py          # Facial recognition logic
│   │   ├── journey_controller.py
│   │   ├── driver_controller.py
│   │   ├── passenger_controller.py
│   │   ├── wallet_controller.py
│   │   ├── dashboard_controller.py
│   │   └── admin_dashboard_controller.py
│   ├── routes/                         # API endpoints
│   ├── db/
│   │   └── database.py                 # Database models and connections
│   ├── middleware/
│   │   └── auth.py                     # Authentication middleware
│   ├── ml/                             # Machine Learning modules
│   │   ├── face_encode.py              # Facial encoding
│   │   └── face_verify.py              # Facial verification
│   └── utils/                          # Utility functions
│       ├── email_otp_service.py        # Email OTP handling
│       └── ml_runner.py                # ML integration

├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # Main application component
│   │   ├── main.jsx                    # Entry point
│   │   ├── admin/                      # Admin dashboard
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── layout/
│   │   ├── pages/                      # User pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── FaceLogin.jsx
│   │   │   └── passenger.jsx
│   │   ├── components/                 # Reusable components
│   │   └── assets/                     # Images and static files
│   ├── package.json
│   ├── vite.config.js
│   └── index.html

└── README.md
```

---

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/face/login` - Facial recognition login

### Journey Routes
- `GET /api/journeys` - Get all journeys
- `POST /api/journeys/create` - Create new journey
- `GET /api/journeys/<id>` - Get journey details
- `PUT /api/journeys/<id>` - Update journey

### Passenger Routes
- `GET /api/passengers/<id>` - Get passenger profile
- `POST /api/passengers/book` - Book a journey
- `GET /api/passengers/<id>/bookings` - Get passenger bookings

### Driver Routes
- `GET /api/drivers/<id>` - Get driver profile
- `GET /api/drivers/<id>/journeys` - Get driver's journeys

### Wallet Routes
- `GET /api/wallet/<user_id>` - Get wallet balance
- `POST /api/wallet/transaction` - Create transaction
- `GET /api/wallet/<user_id>/history` - Get transaction history

### Dashboard Routes
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/admin/dashboard/stats` - Get admin statistics

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email-based one-time password for account verification
- **Facial Recognition**: AI-powered biometric authentication
- **Role-Based Access Control (RBAC)**: Different permission levels for users, drivers, and admins
- **CORS Protection**: Restricted cross-origin requests
- **Password Hashing**: Secure password storage

---

## 🧪 Testing

```bash
# Frontend linting
cd frontend
npm run lint

# Run tests (if configured)
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Add meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

**AI Transit Development Team**

---

## 📧 Support

For support, email support@aitransit.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Mobile app for iOS/Android
- [ ] Real-time bus location tracking on map
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Integration with payment gateways
- [ ] AI-based route optimization
- [ ] Carbon footprint tracking
- [ ] Community features and ratings

---

<div align="center">

**Made with ❤️ for Smart Cities**

⭐ If you found this helpful, please consider giving it a star!

</div>
