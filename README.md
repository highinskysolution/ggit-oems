# GG Institute of Technology (GGIT)
### Online Examination Management System (OEMS 2.0)
**Bachelor of Computer Applications (BCA) - Semester Software Engineering Project**
*Standard IEEE 830-1998 SRS Compliant Full-Stack Prototype*

---

## 📌 Project Overview
The **GG Institute of Technology (GGIT) Online Examination Management System** is an enterprise-grade, responsive 3-tier MERN stack (MongoDB, Express.js, React, Node.js) web application engineered for university examinations. Featuring real-time synchronized countdown testing, AI anti-cheating window monitors, automated grading, and instant academic transcripts.

---

## 👥 Pre-Seeded Evaluation Accounts & Roles

| Role | Email | Password | Identifier / Details |
| :--- | :--- | :--- | :--- |
| **Faculty / Teacher** | `teacher@oems.com` | `admin123` | Computer Applications Dept |
| **Student Candidate 1** | `student1@oems.com` | `pass123` | Roll No: `BCA2024001` |
| **Student Candidate 2** | `student2@oems.com` | `pass123` | Roll No: `BCA2024002` |
| **Administrator** | `admin@oems.com` | `admin123` | System Governance & Audits |

> ⚡ **Quick Switch:** The Landing Page and Navbar include **1-Click Demo Login** buttons for instantaneous evaluator testing.

---

## 🚀 Key Modules & IEEE 830 Features

### 1. Student Management (`FR-SM-01` to `FR-SM-04`)
- Secure registration and JWT + bcrypt authentication.
- Student Dashboard displaying active tests, pass/fail status, and exam history logs.

### 2. Question Bank & Authoring (`FR-QB-01` to `FR-QB-04`)
- Subject catalog management (DBMS, Software Engineering, etc.).
- Categorized MCQ authoring with 4 candidate options, difficulty tags (`Easy`, `Medium`, `Hard`), and verified answer keys.
- Search and multi-criteria filtering.

### 3. Online Examination Room (`FR-OE-01` to `FR-OE-05`)
- Exam Lobby with instructions and single-attempt policy enforcement.
- Synchronized live countdown timer (`MM:SS`) with visual urgency color alerts.
- Single-question navigator with `Previous`, `Next`, `Mark for Review`, and `Clear Selection`.
- 4-State Interactive Question Palette (Green = Answered, Yellow = Review, Gray = Unanswered, Ring = Current).
- Auto-submission trigger at `00:00:00`.
- LocalStorage response caching to protect against connection loss (`NFR-04`).

### 4. Automated Evaluation & Analytics (`FR-RE-01` to `FR-RE-04`)
- Automated backend grading comparing student selections with database keys.
- Instant scorecards with circular progress gauge, pass/fail badges, and question-by-question review.
- Printable academic marksheet format (`window.print()`).
- Faculty Analytics dashboard with class pass rates, high/low scores, and individual student answer sheet inspector.

---

## 🛠️ Technology Stack
- **Frontend:** React 18 (Vite), Tailwind CSS, Lucide React, Canvas Confetti, Axios.
- **Backend:** Node.js, Express.js (REST API architecture).
- **Database:** MongoDB (Mongoose ODM) with automated fallback to `mongodb-memory-server` for zero-setup execution.
- **Security:** JSON Web Tokens (JWT) and `bcryptjs` password hashing.

---

## 🏃 How to Run Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000` (API Health: `http://localhost:5000/api/health`)*

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*
