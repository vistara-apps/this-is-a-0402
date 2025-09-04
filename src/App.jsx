import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AuthModal from './components/AuthModal'
import SubscriptionManager from './components/SubscriptionManager'
import SocialMediaIntegration from './components/SocialMediaIntegration'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage onShowAuth={() => setShowAuth(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscription" element={<SubscriptionManager />} />
          <Route path="/integrations" element={<SocialMediaIntegration />} />
        </Routes>
        
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App
