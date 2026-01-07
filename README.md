# 🚍 Smart Transport System using Face Recognition

A full-stack **cashless public transport system** that uses **facial recognition** for secure user authentication and automated wallet-based fare management.

This project integrates **Machine Learning**, **Backend APIs**, **Database Design**, and a **Modern Frontend UI** into a single working system.

---

## 📌 Project Overview

The Smart Transport System replaces traditional ticketing methods with **face-based authentication**.  
Users register once with their face and personal details. During travel, authentication is done using **real-time facial recognition**, enabling seamless and secure access.

---

## 🎯 Objectives

- Eliminate physical tickets and passes
- Enable fast and contactless authentication
- Maintain a secure wallet-based transport system
- Demonstrate real-world use of biometric authentication

---

## 🧠 Key Features

### 🔐 User Registration
- User enters basic details (name, contact)
- Face is captured using webcam
- Facial embeddings are generated and stored in database

### 👤 Face Login / Verification
- Live face capture during login
- Facial embedding compared with database
- Access granted if similarity threshold is satisfied

### 💳 Wallet System
- Each user has a wallet
- Initial balance is auto-created on registration
- Can be extended for automated fare deduction

### 🧩 Modular Architecture
- Frontend, backend, ML, and database layers are clearly separated
- Database is the **single source of truth**

---

## 🛠️ Technologies Used

### Frontend
- React (Vite)
- Tailwind CSS
- React Router

### Backend
- Flask (Python)
- REST APIs
- Subprocess-based ML execution

### Machine Learning
- OpenCV
- face_recognition (dlib-based)
- NumPy

### Database
- PostgreSQL

---

## 🗂️ Project Structure

```
smart-transport-system/
│
├── backend/
│   ├── app.py                # Flask backend APIs
│   └── requirements.txt
│
├── ml/
│   ├── face_encode.py        # Face registration logic
│   └── face_verify.py        # Face verification logic
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── database/
│   └── schema.sql            # Database schema
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Design

### Tables Used

#### `users`
Stores user personal details.

```
user_id (PK)
name
contact
created_at
```

#### `face_database`
Stores facial embeddings linked to users.

```
face_id (PK)
user_id (FK)
embedding (FLOAT[])
created_at
```

#### `wallet`
Stores user wallet balance.

```
wallet_id (PK)
user_id (FK)
balance
```

---

## 🔄 System Architecture

```
React Frontend
     ↓
Flask Backend API
     ↓
Face Recognition Module
     ↓
PostgreSQL Database
```

---

## ▶️ How to Run the Project

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 2️⃣ Database Setup

```bash
psql smart_transport
\i database/schema.sql
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Face Authentication Flow

### Registration
1. User submits details from UI
2. Backend triggers `face_encode.py`
3. Camera captures face
4. Face embedding stored in database

### Login
1. User clicks “Verify Face”
2. Backend triggers `face_verify.py`
3. Live face captured
4. Compared against DB embeddings
5. Closest match below threshold → access granted

---

## ⚠️ Known Limitations

- Camera access is backend-controlled (local deployment)
- Single-face registration per user
- Accuracy depends on lighting and pose

---

## 🚀 Future Enhancements

- Multiple embeddings per user
- Face anti-spoofing (liveness detection)
- Real-time fare deduction
- Admin dashboard
- Cloud deployment

---

## 🎓 Academic Relevance

This project demonstrates:
- Biometric authentication
- Secure data storage
- ML integration with backend systems
- Full-stack application development
- Real-world problem solving

---

## 👨‍💻 Author

**Arjun P Manoj**  
B.Tech Computer Science  
Christ College of Engineering, Irinjalakuda  
KTU University

---

## 📜 License

This project is developed for **academic purposes**.
