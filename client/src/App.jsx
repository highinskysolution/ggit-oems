import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ExamLobbyPage from './pages/ExamLobbyPage';
import LiveExamRoomPage from './pages/LiveExamRoomPage';
import ScorecardPage from './pages/ScorecardPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Candidate & Faculty Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Secret Administrator Key Gateway */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/access" element={<AdminLoginPage />} />

              {/* Student Portal Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/exam/:id/lobby" element={<ExamLobbyPage />} />
                <Route path="/student/exam/:id/take" element={<LiveExamRoomPage />} />
                <Route path="/student/results/:id" element={<ScorecardPage />} />
              </Route>

              {/* Teacher / Faculty Portal Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              </Route>

              {/* Administrator Portal Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Fallback & Not Found */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
