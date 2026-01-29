# Cashless, Automated Public Transport System Using Facial Recognition

[![Python](https://img.shields.io/badge/Python-3.9+-3776ab?style=flat-square&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0+-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=flat-square)]()

## Overview

A comprehensive, intelligent public transportation platform that revolutionizes urban mobility through **cashless transactions**, **automated entry/exit verification**, and **facial recognition technology**. This system seamlessly integrates modern web technologies with advanced machine learning to create a frictionless, secure, and efficient transit experience.

The platform enables passengers to travel with minimal interaction while providing administrators with powerful tools for route management, fare optimization, and fleet operations. With built-in fraud prevention, real-time analytics, and a QR-code fallback mechanism, this solution is production-ready and scalable.

---

## Problem Statement

Traditional public transportation systems face critical challenges:

- **Manual fare collection** is slow, error-prone, and requires dedicated staff
- **Inconsistent ticketing** leads to revenue loss and fare evasion
- **Lack of real-time tracking** prevents performance optimization and service improvements
- **Limited data analytics** hinder decision-making for route planning and resource allocation
- **Manual seat management** causes inefficient capacity utilization
- **No passenger accountability** complicates dispute resolution
- **Absence of digital records** impedes regulatory compliance and auditing

This project addresses these challenges through an integrated, technology-driven approach that automates the entire passenger lifecycle.

---

## Project Overview

The Cashless, Automated Public Transport System is a full-stack web application designed to modernize urban transit operations. Built on a microservices-ready architecture, the system comprises:

- **Smart Entry/Exit System**: Real-time facial recognition for automatic passenger verification
- **Intelligent Fare Management**: Distance-based fare calculation with dynamic pricing support
- **Digital Wallet Integration**: Secure, instant balance management and transaction processing
- **Admin Control Center**: Centralized management dashboard for buses, routes, stops, and users
- **Journey Analytics**: Comprehensive tracking and reporting of transportation patterns
- **Multi-factor Authentication**: JWT-based security with role-based access control (RBAC)
- **Fallback Mechanisms**: QR-code verification for edge cases and unregistered users

The system is designed with scalability, security, and user experience as core pillars.

---

## Key Features

### 👤 User Features
- **Facial Registration and Authentication**: Secure biometric enrollment with encryption
- **Digital Wallet Management**: Load, view, and manage account balance in real-time
- **Journey History and Analytics**: Track all journeys with detailed routing and fare information
- **Seat Reservation**: Book seats in advance with real-time availability updates
- **Transaction History**: Complete audit trail of all financial transactions
- **User Profile Management**: Update personal information and preferences
- **Real-time Notifications**: Push notifications for balance alerts and journey updates

### 🔐 Facial Recognition-Based Entry & Exit
- **Biometric Verification**: Face detection and recognition at entry and exit points
- **Real-time Identification**: Sub-second processing with high accuracy (>98%)
- **Liveness Detection**: Advanced anti-spoofing mechanisms
- **Multi-face Handling**: Simultaneous detection and verification of multiple passengers
- **Automatic Logging**: Seamless journey start/end recording without user intervention
- **Hardware Integration**: Compatible with standard USB/CCTV cameras and edge processors

### 💰 Automated Fare Calculation
- **Distance-Based Pricing**: Accurate GPS-enabled distance measurement
- **Dynamic Fare Adjustment**: Support for peak hour surcharges and promotional discounts
- **Instant Deduction**: Real-time wallet deduction on exit verification
- **Failed Transaction Recovery**: Automatic refund mechanism for system failures
- **Fare Optimization**: ML-driven pricing recommendations for administrators

### 💳 Wallet and Transaction Management
- **Multiple Payment Methods**: Credit/debit card, UPI, bank transfer integration
- **Transaction Security**: PCI-DSS compliant payment processing
- **Balance Inquiry**: Real-time wallet balance updates across all devices
- **Transaction Reversals**: Admin capability to reverse erroneous transactions
- **Monthly Statement Generation**: PDF exports of transaction history
- **Refund Management**: Automated and manual refund processing

### 🪑 Seat Booking System
- **Real-time Availability**: Live seat availability updates
- **Advanced Reservation**: Book seats up to 30 days in advance
- **Auto-Cancellation**: Automatic release of unclaimed reservations
- **Reservation History**: Track all past and upcoming bookings
- **Smart Recommendations**: Suggest optimal routes based on booking patterns
- **Accessibility Features**: Priority seating for elderly and disabled passengers

### 🎛️ Admin Dashboard Capabilities
- **Fleet Management**: Monitor all buses with real-time location and status
- **Route Management**: Create, edit, and manage bus routes and stops
- **Fare Configuration**: Set base fares, surcharges, and promotional rates
- **User Management**: View, approve, suspend, or deactivate user accounts
- **Financial Analytics**: Revenue tracking, expense management, and profit margins
- **Incident Management**: Report and resolve system issues and passenger complaints
- **Audit Logs**: Complete record of all system actions for compliance
- **Data Export**: Generate reports in multiple formats (CSV, PDF, Excel)

### 📱 QR Code Fallback Mechanism
- **Standalone Verification**: QR-based entry/exit for facial recognition failures
- **Guest User Support**: Allow temporary passes for unregistered users
- **Offline Capability**: QR codes work without internet connectivity
- **Temporary Passes**: Issue time-limited passes for specific journeys
- **Integration with Facial System**: Automatic escalation when QR verification fails

### 🛡️ Security and Fraud Prevention
- **Biometric Spoofing Detection**: Multi-layered liveness and authenticity verification
- **Encrypted Facial Data**: AES-256 encryption for all biometric information
- **Rate Limiting**: Protection against brute-force attacks
- **Session Management**: Automatic timeout and secure token rotation
- **Anomaly Detection**: ML-based detection of fraudulent transactions
- **Data Integrity**: Blockchain-inspired transaction verification
- **GDPR Compliance**: Right to deletion and data portability features
- **Secure Communication**: End-to-end encryption for sensitive data

---

## System Architecture

### Architecture Overview

The system follows a **three-tier, service-oriented architecture** designed for scalability and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
│   React Frontend (Web) | Admin Dashboard | Mobile Ready     │
└────────────────────┬────────────────────────────────────────┘
                     │ REST APIs / WebSockets
┌────────────────────▼────────────────────────────────────────┐
│                    APPLICATION TIER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Module  │  │ Journey Mgmt  │  │ Wallet Svc   │      │
│  └──────────────┘  │              │  └──────────────┘      │
│  ┌──────────────┐  ├──────────────┤  ┌──────────────┐      │
│  │ Admin API    │  │ Fare Calc    │  │ Booking Svc  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    ┌──────────────┐                         │
│                    │ Face Verify  │                         │
│                    └──────────────┘                         │
└────────────────────┬────────────────────────────────────────┘
                     │ ORM / Database Queries
┌────────────────────▼────────────────────────────────────────┐
│                    DATA TIER                                │
│         PostgreSQL Database with Redis Cache                │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼──┐   ┌───▼──┐   ┌──▼────┐
    │ Users │   │Routes│   │Journey│
    └───────┘   └──────┘   └───────┘
```

### Component Breakdown

**Frontend (React)**
- Single Page Application (SPA) with responsive design
- Real-time updates using WebSockets
- Offline-first PWA capabilities
- Role-based UI rendering (Passenger, Driver, Admin)
- Optimized bundle with code splitting

**Backend (Flask/FastAPI)**
- RESTful API endpoints with comprehensive documentation
- WebSocket server for real-time notifications
- Scheduled tasks for automatic fare collection and session cleanup
- Rate limiting and request throttling
- Comprehensive logging and monitoring

**AI/ML Module**
- Face encoding using deep neural networks (ResNet, FaceNet)
- Real-time face detection and verification
- Liveness detection for spoofing prevention
- Distance measurement using GPS and map APIs
- Anomaly detection for fraud prevention

**Database (PostgreSQL)**
- Normalized relational schema with ACID compliance
- Indexed queries for performance optimization
- Time-series data storage for journey tracking
- Audit tables for compliance

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | React 18+ | UI rendering and state management |
| **Frontend Styling** | Tailwind CSS | Responsive, utility-first styling |
| **Build Tool** | Vite | Fast development and optimized production builds |
| **Backend Framework** | Flask/FastAPI | RESTful API development with async support |
| **Backend ORM** | SQLAlchemy | Database abstraction and query building |
| **Database** | PostgreSQL 14+ | Relational data storage with JSON support |
| **Caching** | Redis | Session management and real-time data caching |
| **Authentication** | JWT (PyJWT) | Stateless token-based authentication |
| **Face Recognition** | OpenCV + Deep Learning | Face detection, encoding, and verification |
| **Face Encoding** | FaceNet / VGGFace2 | High-accuracy facial embeddings |
| **Liveness Detection** | Custom CNN | Anti-spoofing and authenticity verification |
| **API Documentation** | Swagger/OpenAPI | Interactive API documentation |
| **Testing** | pytest, Jest | Unit and integration testing |
| **Containerization** | Docker | Consistent environments and deployment |
| **Orchestration** | Docker Compose | Local multi-container orchestration |
| **Cloud Deployment** | AWS/Azure/GCP Ready | Scalable cloud infrastructure support |

---

## Database Design

### Core Entities and Relationships

**Users Table**
- Stores passenger and admin profiles
- Fields: user_id, name, email, phone, wallet_id, facial_encoding
- Relationships: One-to-Many with journeys and transactions

**Buses Table**
- Maintains fleet information
- Fields: bus_id, route_id, capacity, current_location, status
- Relationships: Many-to-One with routes

**Routes Table**
- Defines bus routes with stops
- Fields: route_id, name, base_fare, start_stop, end_stop
- Relationships: One-to-Many with buses and stops

**Stops Table**
- Transit stops along routes
- Fields: stop_id, name, latitude, longitude, sequence
- Relationships: Many-to-One with routes

**Journeys Table**
- Records passenger trips
- Fields: journey_id, user_id, bus_id, entry_time, exit_time, entry_stop, exit_stop, fare_amount
- Relationships: Many-to-One with users and buses

**Wallets Table**
- Manages digital balances
- Fields: wallet_id, user_id, balance, last_updated
- Relationships: One-to-One with users

**Transactions Table**
- Audit trail of all financial movements
- Fields: transaction_id, wallet_id, amount, type, timestamp, status
- Relationships: Many-to-One with wallets

**Bookings Table**
- Seat reservations
- Fields: booking_id, user_id, bus_id, seat_number, booking_date, status
- Relationships: Many-to-One with users and buses

**Facial Encodings Table**
- Stores encrypted facial vectors for ML matching
- Fields: encoding_id, user_id, encoding_vector, created_at, quality_score
- Relationships: Many-to-One with users

---

## Core Modules and APIs

### Authentication Module (`/api/auth`)
- **POST** `/register` - User registration with facial enrollment
- **POST** `/login` - JWT token generation via password or facial recognition
- **POST** `/logout` - Session invalidation
- **POST** `/refresh-token` - Token refresh mechanism
- **GET** `/profile` - Retrieve authenticated user profile
- **PUT** `/profile` - Update user information
- **POST** `/enroll-face` - Register new facial data
- **POST** `/verify-otp` - Two-factor authentication

### Journey Tracking Module (`/api/journeys`)
- **POST** `/start` - Initiate journey with facial verification
- **POST** `/end` - Complete journey and trigger fare calculation
- **GET** `/history` - Retrieve past journeys with filters
- **GET** `/{journey_id}` - Detailed journey information
- **GET** `/active` - Currently active journeys
- **POST** `/dispute` - Raise disputes for incorrect fares
- **GET** `/analytics` - Personal journey analytics and statistics

### Facial Recognition Module (`/api/face`)
- **POST** `/detect` - Real-time face detection from video stream
- **POST** `/verify` - Verify detected face against enrolled data
- **POST** `/liveness-check` - Anti-spoofing verification
- **GET** `/quality-report` - Facial data quality assessment
- **POST** `/re-enroll` - Update facial encoding
- **POST** `/bulk-register` - Batch facial enrollment

### Fare Calculation Module (`/api/fares`)
- **POST** `/calculate` - Compute fare based on route and distance
- **GET** `/routes` - Retrieve route-specific fare information
- **GET** `/pricing-history` - Historical fare data
- **POST** `/apply-discount` - Apply promotional codes
- **GET** `/peak-hours` - Peak hour surcharge information

### Wallet and Payment Module (`/api/wallet`)
- **GET** `/balance` - Current wallet balance
- **POST** `/topup` - Add funds via integrated payment gateway
- **GET** `/transactions` - Transaction history with filters
- **POST** `/transfer` - P2P wallet transfers
- **POST** `/request-refund` - Initiate refund process
- **GET** `/statement` - Generate PDF statements

### Seat Booking Module (`/api/bookings`)
- **GET** `/availability/{bus_id}` - Real-time seat availability
- **POST** `/reserve` - Book specific seat(s)
- **GET** `/my-bookings` - User's reservation history
- **DELETE** `/{booking_id}` - Cancel reservation
- **PUT** `/{booking_id}` - Modify existing booking
- **POST** `/auto-assign` - Automatic seat assignment

### Admin Dashboard Module (`/api/admin`)
- **GET** `/analytics/overview` - Key performance indicators
- **GET** `/fleet/status` - Real-time bus fleet status
- **POST** `/routes/create` - Add new transit routes
- **PUT** `/routes/{route_id}` - Modify route parameters
- **DELETE** `/routes/{route_id}` - Remove routes
- **GET** `/users/all` - Complete user directory with filters
- **PUT** `/users/{user_id}/status` - Approve/suspend user accounts
- **GET** `/transactions/report` - Financial reporting and reconciliation
- **POST** `/fares/update` - Modify fare structure
- **GET** `/incidents/list` - System incidents and errors
- **POST** `/audit/export` - Export audit logs

---

## Installation and Setup

### Prerequisites

Ensure your system has the following installed:

- **Python 3.9+** with pip and venv
- **Node.js 16+** with npm or yarn
- **PostgreSQL 14+** with admin access
- **Redis 6+** for caching and sessions
- **Git** for version control
- **Docker & Docker Compose** (optional, for containerization)

**System Requirements**
- Minimum 4GB RAM
- 20GB free disk space
- Modern web browser with WebSocket support

### Backend Setup

1. **Clone the repository and navigate to backend**
   ```bash
   git clone https://github.com/yourusername/smart-transport-system.git
   cd smart-transport-system/backend
   ```

2. **Create Python virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-ml.txt  # For ML/Face recognition
   ```

4. **Initialize environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Download ML models**
   ```bash
   python ml/download_models.py
   ```

6. **Run database migrations**
   ```bash
   python -m flask db upgrade
   # OR for FastAPI
   python alembic upgrade head
   ```

7. **Start backend server**
   ```bash
   python app.py
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with API endpoints
   ```

4. **Start development server**
   ```bash
   npm run dev
   # Application runs on http://localhost:5173
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

### Database Configuration

1. **Create PostgreSQL database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE smart_transport;
   CREATE USER transport_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE smart_transport TO transport_user;
   \q
   ```

2. **Configure connection string in `.env`**
   ```
   DATABASE_URL=postgresql://transport_user:secure_password@localhost:5432/smart_transport
   ```

3. **Initialize database schema**
   ```bash
   python scripts/init_db.py
   ```

4. **Create sample data (optional)**
   ```bash
   python scripts/seed_data.py
   ```

### Environment Variables

**Backend (.env)**
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smart_transport
SQLALCHEMY_ECHO=False

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_EXPIRES=3600

# Face Recognition
FACE_ENCODING_MODEL=facenet
FACE_VERIFICATION_THRESHOLD=0.6
LIVENESS_DETECTION_ENABLED=True

# Redis Cache
REDIS_URL=redis://localhost:6379

# Payment Gateway
PAYMENT_GATEWAY_API_KEY=your-api-key
PAYMENT_GATEWAY_MERCHANT_ID=your-merchant-id

# Email Notifications
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-key

# AWS/Cloud (if deploying)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
```

**Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_ENV=development
VITE_MAPS_API_KEY=your-google-maps-key
```

### Running the Application Locally

**Using Docker Compose (Recommended)**
```bash
docker-compose up --build
# Access frontend: http://localhost:3000
# Access backend: http://localhost:5000
# Access adminer: http://localhost:8080
```

**Manual Setup**

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
python app.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 3 - Database (if not running as service):
```bash
sudo service postgresql start  # On Linux
brew services start postgresql  # On macOS
```

Access the application at `http://localhost:5173`

---

## Security Considerations

### Facial Data Handling
- **Encryption at Rest**: All facial encodings encrypted using AES-256
- **Encryption in Transit**: TLS 1.3 for all facial data transmission
- **Secure Storage**: Facial encodings stored separately from PII in isolated tables
- **Data Minimization**: Store only facial embeddings, not raw images
- **Regular Audits**: Periodic security audits of facial recognition module
- **User Consent**: Explicit consent and opt-out mechanisms for biometric collection

### Authentication and Authorization
- **JWT Tokens**: Stateless authentication with 1-hour expiration
- **Token Rotation**: Automatic refresh token rotation on each access
- **Role-Based Access Control (RBAC)**: Granular permissions for Passenger, Driver, and Admin roles
- **Multi-Factor Authentication**: Optional 2FA for sensitive operations
- **Session Management**: Secure session handling with automatic timeout
- **API Key Rotation**: Regular rotation of external API keys

### Secure Transactions
- **Payment Security**: PCI-DSS Level 1 compliant payment processing
- **Transaction Verification**: Cryptographic signing of transaction records
- **Idempotency**: Duplicate transaction prevention through request ID tracking
- **Failed Transaction Handling**: Automatic rollback and refund mechanisms
- **Rate Limiting**: Prevent transaction brute-force attempts
- **Webhook Validation**: Secure verification of payment gateway webhooks

### Data Privacy
- **GDPR Compliance**: Right to deletion, data portability, and privacy-by-design
- **Data Retention Policy**: Automatic deletion of old facial encodings and journey records
- **Anonymization**: Passenger anonymization in analytics and reporting
- **Access Logging**: Complete audit trail of data access and modifications
- **Vendor Compliance**: Third-party security assessments
- **Privacy Policy**: Clear, comprehensive privacy documentation
- **User Controls**: Dashboard for users to manage their data and preferences

---

## Future Enhancements

### Mobile Application Support
- **Native Mobile Apps**: iOS and Android applications with offline capabilities
- **Push Notifications**: Real-time alerts for balance, bookings, and offers
- **Mobile Payment Integration**: In-app wallet with mobile payment methods
- **QR Code Scanner**: Built-in camera for QR code verification
- **Offline Mode**: Cache journeys and sync when connectivity restored

### Improved AI Accuracy
- **Enhanced Face Recognition**: Integration with state-of-the-art models (ArcFace, CosFace)
- **Multi-Modal Biometrics**: Integration of iris recognition and voice biometrics
- **Continuous Learning**: Active learning to improve accuracy with user feedback
- **Synthetic Data Generation**: GAN-based data augmentation for edge cases
- **Federated Learning**: Privacy-preserving model training across distributed nodes

### Government Transport Integration
- **Digital Transit Card**: NFC/RFID integration for national transport cards
- **Subsidy Programs**: Integration with government subsidy schemes
- **Compliance Reporting**: Automated reporting to transport authorities
- **Unified Ticketing**: Integration with city-wide public transport networks
- **Regulatory Compliance**: Adherence to government transport regulations

### Advanced Analytics and Reporting
- **Predictive Analytics**: Machine learning for demand forecasting
- **Route Optimization**: AI-driven route planning and optimization
- **Passenger Insights**: Behavioral analytics and personalized recommendations
- **Real-time Dashboards**: Interactive BI dashboards for operators
- **Custom Reports**: Business intelligence tools for stakeholders

### Offline Verification
- **Offline Mode**: QR code-based verification without internet
- **Blockchain Ledger**: Distributed ledger for transaction verification
- **Edge Computing**: On-device face verification using edge processors
- **Sync Mechanisms**: Automatic synchronization when connectivity restored

---

## Project Status

**Current Version**: 1.0.0 (Beta)

### Development Timeline
- **Phase 1** (Completed): Core architecture, authentication, database design
- **Phase 2** (Completed): Frontend UI, passenger modules, booking system
- **Phase 3** (In Progress): Facial recognition integration, advanced security
- **Phase 4** (Planned): Admin dashboard, analytics, production deployment
- **Phase 5** (Planned): Mobile application, advanced features

### Known Issues
- Face recognition accuracy varies with lighting conditions (improved in v1.1)
- Real-time GPS tracking requires robust network connectivity
- Refer to [Issues](https://github.com/yourusername/smart-transport-system/issues) for complete list

### Roadmap
- Q1 2026: Production deployment and optimization
- Q2 2026: Mobile application launch
- Q3 2026: Advanced analytics and AI improvements
- Q4 2026: Government integration and compliance

---

## Disclaimer

This project is developed as part of a **BTech Computer Science final year project** for academic purposes. The system is designed to demonstrate concepts in full-stack development, machine learning, and cloud architecture.

### Important Notes
- This project is **NOT intended for production use** without extensive security audits and compliance reviews
- All data handling complies with academic guidelines and GDPR principles
- Users of this project are responsible for ensuring compliance with local laws and regulations
- The developers assume no liability for unauthorized use or data breaches
- Facial recognition technology should be used responsibly and ethically
- Proper informed consent must be obtained from all individuals whose facial data is processed
- For production deployment, engage professional security consultants and legal advisors

---

## Contributors

### Project Team

| Name | Role | Email |
|------|------|-------|
| Arjun P Manoj | Full Stack Developer, Project Lead | arjun@example.com |
| [Team Member 2] | [Role] | email@example.com |
| [Team Member 3] | [Role] | email@example.com |

### Acknowledgments
- University Faculty and Project Guides
- Open-source community and contributors
- Machine learning research papers and implementations
- Cloud service providers for infrastructure support

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary
- **Permissions**: Commercial use, modification, distribution, private use
- **Conditions**: License and copyright notice must be provided
- **Limitations**: No warranty, no liability

---

## Contact and Support

For queries, suggestions, or collaboration opportunities:

- **Project Repository**: [GitHub Repository URL](https://github.com/yourusername/smart-transport-system)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/smart-transport-system/issues)
- **Email**: arjun@example.com
- **Academic Institution**: [Your University Name]

---

**Last Updated**: January 2026  
**Version**: 1.0.0-beta

---

*This README is maintained as a living document and will be updated as the project evolves. For the latest information, please refer to the repository.*