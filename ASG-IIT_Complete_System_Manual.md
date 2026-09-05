# 🏛️ ASG-IIT — Online Examination Management System (OEMS 2.0)
## Complete System Operation Manual & User Handbook
**Autonomous Science & Graduate Institute of Information Technology**  
*Office of the Controller of Examinations • NAAC 'A+' Grade • AICTE Approved*

---

## 📑 Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Portal Navigation & Route Directory](#2-portal-navigation--route-directory)
3. [Master Administrator Gateway & Credentials](#3-master-administrator-gateway--credentials)
4. [Faculty Examiner Portal & Operations Guide](#4-faculty-examiner-portal--operations-guide)
5. [Student Candidate Directory (10 Official Accounts)](#5-student-candidate-directory-10-official-accounts)
6. [Student Candidate Registration Workflow](#6-student-candidate-registration-workflow)
7. [Live Examination Room, Anti-Cheating & Auto-Submit](#7-live-examination-room-anti-cheating--auto-submit)
8. [Automated Grading, Transcripts & Marksheet Printing](#8-automated-grading-transcripts--marksheet-printing)
9. [Academic Subjects & Curriculum Guide](#9-academic-subjects--curriculum-guide)
10. [Troubleshooting & Support FAQs](#10-troubleshooting--support-faqs)

---

## 1. System Overview & Architecture

The **ASG-IIT Online Examination Management System (OEMS 2.0)** is an enterprise-grade, responsive 3-tier MERN stack application engineered for high-stakes university assessments.

### Core Architectural Highlights:
- **Frontend Layer:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend API Layer:** Node.js, Express.js REST API with JWT session tokens and bcrypt password encryption.
- **Database Layer:** MongoDB (Mongoose ODM) with automated fallback to `mongodb-memory-server` for zero-setup execution.
- **Academic Integrity Engine:** Real-time synchronized countdown timers, single-attempt locking (IEEE 830 `FR-OE-02`), window blur/tab switch violation detection, and auto-submission at `00:00:00`.

---

## 2. Portal Navigation & Route Directory

| Interface | Direct URL | Target Role | Key Features |
| :--- | :--- | :--- | :--- |
| **Main Landing Page** | `/` | Public / All | Institutional branding, portal cards, system overview |
| **Dual Login Portal** | `/login` | Students & Faculty | Role-separated Cyan (Student) & Purple (Faculty) tabs |
| **Candidate Registration** | `/register` | New Students | Self-service registration with unique Roll No validation |
| **Secret Admin Gateway** | `/admin/login` | Master Admins | Master Key protected Controller of Examinations login |
| **Student Assessment Terminal** | `/student/dashboard` | Students | Active exams, exam lobby links, past marksheet history |
| **Live Proctored Room** | `/student/exam/:id/take`| Students | Timed test, 4-state question palette, anti-cheating monitor |
| **Academic Marksheet** | `/student/results/:id` | Students & Faculty | Instant score breakdown, grade rating, printable marksheet |
| **Faculty Console** | `/teacher/dashboard` | Faculty | MCQ authoring, question pack builder, class analytics |
| **Admin Activity Terminal** | `/admin/dashboard` | Master Admins | Real-time user logs, login timestamps, faculty authoring |

---

## 3. Master Administrator Gateway & Credentials

### 🔑 Master Key Protocol
Administrator login strictly requires an authorized **Admin Master Key**:
- **Primary Master Key:** `ASG-IIT-ADMIN-2026`
- **Backward Compatible Key:** `GGIT-ADMIN-2026`

### 👑 System Administrators (Controller of Examinations)

| # | Administrator Name | Official Email | Password | Master Key | Department |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | **Gagan Moolya (Admin)** | `admin@oems.com` | `admin123` | `ASG-IIT-ADMIN-2026` | Controller of Examinations |
| 2 | **Shreyas Jha (Admin)** | `shreyas.admin@oems.com` | `admin123` | `ASG-IIT-ADMIN-2026` | Examination Control Division |
| 3 | **Akash Gupta (Admin)** | `akash.admin@oems.com` | `admin123` | `ASG-IIT-ADMIN-2026` | Examination Control Division |

### 🛠️ Administrator Step-by-Step Guide:
1. Navigate to `/admin/login`.
2. Enter your administrator email and password.
3. Click **Auto-fill Key** or type `ASG-IIT-ADMIN-2026`.
4. Submit to access the **System User Access & Login Activity Terminal**.
5. Audit registered candidates and faculty in real-time with last-login timestamps.
6. Click **Authorize Faculty** to provision new instructor accounts.

---

## 4. Faculty Examiner Portal & Operations Guide

### 👨‍🏫 Official Faculty Examiner Account
- **Faculty Name:** Dr. Lt. MRUNALI SAWANT
- **Official Email:** `sawantmrunali@gmail.com`
- **Password:** `123456`
- **Department:** Department of Computer Applications (BCA)
- **Portal URL:** `/login` → Click **Faculty / Teacher Portal** tab

### 📝 Examiner Operations Workflow:
1. **MCQ Authoring:** Open the **Question Bank** tab, select a subject, provide question text, 4 options, designate the correct option (0–3), and assign difficulty (`Easy`, `Medium`, `Hard`).
2. **Instant Question Packs:** Use the **Generate Question Pack** button to automatically populate 5 curriculum-aligned MCQs per topic with verified answer keys.
3. **Live Exam Scheduling:** Open **Create Exam**, select subject, specify test title, duration in minutes, passing threshold marks, select questions from the repository, and publish.
4. **Class Analytics & Proctoring Inspection:** Under **Submissions & Analytics**, review aggregate pass rates, high/low scores, and inspect individual student answer sheets along with proctoring violation counts.

---

## 5. Student Candidate Directory (10 Official Accounts)

All 10 student candidates are seeded with password: **`123456`**. Students can log in using either their **University Roll Number** or **Email Address**.

| # | Student Full Name | University Roll No | Email Address | Password | Department | Year |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: |
| 1 | **Aarav Sharma** | `BCA202601` | `aarav.sharma@gmail.com` | `123456` | BCA | SY |
| 2 | **Riya Patel** | `BCA202602` | `riya.patel@gmail.com` | `123456` | BCA | SY |
| 3 | **Aditya Mehta** | `BCA202603` | `aditya.mehta@gmail.com` | `123456` | BCA | TY |
| 4 | **Sneha Joshi** | `BCA202604` | `sneha.joshi@gmail.com` | `123456` | BCA | FY |
| 5 | **Rohan Verma** | `IT202601` | `rohan.verma@gmail.com` | `123456` | BSc IT | SY |
| 6 | **Ananya Singh** | `IT202602` | `ananya.singh@gmail.com` | `123456` | BSc IT | TY |
| 7 | **Kunal Shah** | `AI202601` | `kunal.shah@gmail.com` | `123456` | AI | FY |
| 8 | **Priya Desai** | `AI202602` | `priya.desai@gmail.com` | `123456` | AI | SY |
| 9 | **Yash Gupta** | `BCA202605` | `yash.gupta@gmail.com` | `123456` | BCA | FY |
| 10 | **Neha Kulkarni** | `BCA202606` | `neha.kulkarni@gmail.com` | `123456` | BCA | TY |

---

## 6. Student Candidate Registration Workflow

New students can register an account at `/register`:
1. **Department & Academic Year:** Select BCA, BSc IT, or AI and FY, SY, or TY.
2. **Full Name & Institutional Email:** Enter official candidate name and email (e.g. `candidate@gmail.com` or `name@asg-iit.edu`).
3. **Unique Roll Number:** Enter a unique university identifier (e.g. `BCA202610`). The system enforces non-repetition validation.
4. **Password:** Set a secure password (min 6 characters).
5. Upon registration, candidates are immediately redirected to their student dashboard.

---

## 7. Live Examination Room, Anti-Cheating & Auto-Submit

### ⏱️ Synchronized Countdown Timer
- Synchronized client-server timer counting down in `MM:SS`.
- Color turns amber at 10 minutes and pulsing red at 5 minutes.
- **Auto-Submission (`FR-OE-03`):** Submits chosen answers automatically when the timer reaches `00:00:00`.

### 🎨 4-State Interactive Question Palette
- **Green:** Answered question.
- **Yellow:** Flagged for review.
- **Gray:** Unanswered question.
- **Cyan Ring:** Currently active question.

### 🚨 AI Window Proctoring & Anti-Cheating Guard (`FR-OE-05`)
- Active listener detects **tab switching, window blurring, minimizing, or copying questions**.
- Violations trigger an immediate security warning modal and log the violation counter in the official transcript audit record.

### 💾 Response Caching (`NFR-04`)
- Candidate answers are cached in browser `localStorage` in real-time, safeguarding against accidental reloads or connection drops.

---

## 8. Automated Grading, Transcripts & Marksheet Printing

### 📊 ASG-IIT Grade Evaluation Scale

| Percentage Range | Grade Letter | Academic Classification | Status |
| :---: | :---: | :--- | :---: |
| **90% – 100%** | `O` | Outstanding | Pass (Distinction) |
| **80% – 89%** | `A+` | Excellent | Pass (First Class Distinction) |
| **70% – 79%** | `A` | Very Good | Pass (First Class) |
| **60% – 69%** | `B+` | Good | Pass (Higher Second Class) |
| **50% – 59%** | `B` | Above Average | Pass (Second Class) |
| **40% – 49%** | `C` | Pass Threshold | Pass |
| **Below 40%** | `F` | Fail | Re-appear Required |

### 🖨️ Marksheet Printing
Students can click **Print Official Marksheet** on `/student/results/:id` to generate a verified semester grade report with Controller of Examinations digital verification signatures.

---

## 9. Academic Subjects & Curriculum Guide

| Subject Code | Subject Title | Department | Semester |
| :---: | :--- | :---: | :---: |
| `BCA301` | Database Management Systems (DBMS) | BCA | Sem III |
| `BCA302` | Software Engineering & System Design | BCA | Sem III |
| `BCA303` | Java Enterprise & Object-Oriented Programming | BCA | Sem III |
| `IT301` | Computer Networks & Cloud Infrastructure | BSc IT | Sem III |
| `IT302` | Web Technologies & Full-Stack Development | BSc IT | Sem III |
| `AI301` | Artificial Intelligence & Machine Learning Foundations | AI | Sem III |

---

## 10. Troubleshooting & Support FAQs

- **Forgot Admin Key?** Default master key is `ASG-IIT-ADMIN-2026` (or `GGIT-ADMIN-2026`). You can also click the "Auto-fill Key" link on `/admin/login`.
- **Duplicate Roll Number Error?** Every student roll number must be unique across the entire institution. Use an unused roll number like `BCA202607`.
- **Database Connection Fallback:** If MongoDB Atlas is unavailable, the backend automatically transitions to an in-memory database with zero downtime.
- **Examination Cell Helpdesk:** `coe@asg-iit.edu.in` | Phone: `+91 (022) 2854-9900` (Mon–Sat, 9 AM – 5 PM).
