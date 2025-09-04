import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Target, Zap, BarChart3, ArrowRight, Play, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LandingPage = ({ onShowAuth }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      onShowAuth()
    }
  }

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Product Analysis",
      description: "Upload your product image and let AI analyze the best marketing angles"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Ad Generation",
      description: "Generate 3-5 unique ad variations with compelling copy and visuals"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Auto-Posting",
      description: "Automatically post to your test TikTok and Instagram accounts"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Track views, clicks, and engagement to optimize your campaigns"
    }
  ]

  const pricingTiers = [
    {
      name: "Basic",
      price: "$19",
      period: "/month",
      features: ["10 ad variations/month", "Basic analytics", "1 test account", "Email support"],
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      features: ["50 ad variations/month", "Advanced analytics", "3 test accounts", "Priority support", "A/B testing"],
      popular: true
    },
    {
      name: "Unlimited",
      price: "$99",
      period: "/month",
      features: ["Unlimited ad variations", "Real-time analytics", "Unlimited accounts", "24/7 support", "Custom integrations"],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative z-10 bg-surface/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Ad Remix AI</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={onShowAuth}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-semibold text-gray-900 mb-6 animate-fade-in">
              Generate ad variations and
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> auto-post</span> to social media
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Quickly create and test different ad variations on TikTok/IG to optimize ad performance using AI. 
              Stop wasting time on manual ad creation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <button
                onClick={handleGetStarted}
                className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-card"
              >
                <span>Start Creating Ads</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Everything you need to optimize your ads
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered generation to automated posting and analytics, we've got your ad optimization covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your ad testing needs. All plans include our core AI features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`relative p-8 rounded-lg border-2 ${tier.popular ? 'border-primary bg-primary/5' : 'border-gray-200 bg-surface'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-semibold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600 ml-1">{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    tier.popular 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Ad Remix AI</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2024 Ad Remix AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage