import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DashboardHeader from '../components/DashboardHeader'
import ProductUpload from '../components/ProductUpload'
import AdVariations from '../components/AdVariations'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { generateAdVariations } from '../services/aiService'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload')
  const [productData, setProductData] = useState(null)
  const [adVariations, setAdVariations] = useState([])
  const [generatingAds, setGeneratingAds] = useState(false)
  const [ads, setAds] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    // Load existing ads from localStorage
    const savedAds = localStorage.getItem('adremix_ads')
    if (savedAds) {
      setAds(JSON.parse(savedAds))
    }
  }, [])

  const handleProductUpload = async (data) => {
    setProductData(data)
    setGeneratingAds(true)
    
    try {
      const variations = await generateAdVariations(data)
      setAdVariations(variations)
      setActiveTab('variations')
    } catch (error) {
      console.error('Error generating ad variations:', error)
    } finally {
      setGeneratingAds(false)
    }
  }

  const handlePostAds = (selectedVariations) => {
    const newAds = selectedVariations.map(variation => ({
      id: Date.now() + Math.random(),
      ...variation,
      userId: user.id,
      productName: productData.productName,
      productDescription: productData.productDescription,
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000) + 100,
      clicks: Math.floor(Math.random() * 50) + 10,
      engagement: Math.floor(Math.random() * 20) + 5,
      isPosted: true
    }))

    const updatedAds = [...ads, ...newAds]
    setAds(updatedAds)
    localStorage.setItem('adremix_ads', JSON.stringify(updatedAds))
    setActiveTab('analytics')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {activeTab === 'upload' && (
          <ProductUpload 
            onUpload={handleProductUpload}
            loading={generatingAds}
          />
        )}
        
        {activeTab === 'variations' && (
          <AdVariations 
            variations={adVariations}
            productData={productData}
            onPostAds={handlePostAds}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard ads={ads} />
        )}
      </main>
    </div>
  )
}

export default Dashboard