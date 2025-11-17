import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect, useState } from 'react'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import JobPostingPage from './pages/JobPostingPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPage from './pages/InterviewPage'
import InterviewResultPage from './pages/InterviewResultPage'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [userData, setUserData] = useState(null)

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !isAuthenticated) {
      fetchUser()
    }
  }, [])

  // Vercel 백엔드 API 연동 테스트 (컴포넌트 렌더링 시 데이터 가져오기)
  useEffect(() => {
    // 상대 경로를 사용하여 Vercel이 /api 경로를 올바르게 라우팅하도록 함
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => {
        console.log('백엔드에서 받아온 데이터:', data)
        setUserData(data.user)
      })
      .catch((error) => {
        console.error('API 호출 에러:', error)
      })
  }, [])

  return (
    <div>
      {/* Vercel 백엔드 연동 테스트 - 화면에 사용자 데이터 표시 */}
      {userData && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: '#4CAF50', 
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 9999,
          fontSize: '14px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
            백엔드 연결 성공! 사용자: {userData}
          </h1>
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/job-postings" element={<JobPostingPage />} />
          <Route path="/cover-letters" element={<CoverLetterPage />} />
        </Route>

        {/* Interview Routes (without sidebar for better UX) */}
        <Route
          path="/interview/:sessionId"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:sessionId/result"
          element={
            <ProtectedRoute>
              <InterviewResultPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
