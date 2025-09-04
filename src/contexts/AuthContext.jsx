import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('adremix_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login - in real app, this would call your backend
    const mockUser = {
      id: 1,
      email,
      subscriptionTier: 'pro',
      testTikTokAccount: '@test_tiktok',
      testIGAccount: '@test_instagram'
    }
    
    setUser(mockUser)
    localStorage.setItem('adremix_user', JSON.stringify(mockUser))
    return mockUser
  }

  const register = async (email, password) => {
    // Mock registration
    const mockUser = {
      id: Date.now(),
      email,
      subscriptionTier: 'basic',
      testTikTokAccount: '',
      testIGAccount: ''
    }
    
    setUser(mockUser)
    localStorage.setItem('adremix_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adremix_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}