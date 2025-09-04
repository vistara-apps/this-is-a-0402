import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AuthModal from './components/AuthModal'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage onShowAuth={() => setShowAuth(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}
      </div>
    </AuthProvider>
  )
}

export default App