import React, { useState, useEffect } from 'react'
import { Check, Crown, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const SubscriptionManager = () => {
  const [currentPlan, setCurrentPlan] = useState('basic')
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 19,
      description: 'Perfect for getting started',
      features: [
        '50 ad variations per month',
        '10 auto-posts per month',
        'Basic analytics',
        'Email support',
        '2 social media accounts'
      ],
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      description: 'For growing businesses',
      features: [
        '200 ad variations per month',
        '50 auto-posts per month',
        'Advanced analytics',
        'Priority support',
        '5 social media accounts',
        'A/B testing',
        'Custom templates'
      ],
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 99,
      description: 'For agencies and enterprises',
      features: [
        'Unlimited ad variations',
        'Unlimited auto-posts',
        'Premium analytics',
        '24/7 phone support',
        'Unlimited social accounts',
        'White-label options',
        'API access',
        'Custom integrations'
      ],
      icon: Crown,
      color: 'text-gold-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ]

  const handleUpgrade = async (planId) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentPlan(planId)
      toast.success(`Successfully upgraded to ${plans.find(p => p.id === planId)?.name} plan!`)
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const PlanCard = ({ plan }) => {
    const Icon = plan.icon
    const isCurrentPlan = currentPlan === plan.id
    
    return (
      <div className={`relative rounded-xl border-2 p-6 ${
        plan.popular 
          ? 'border-primary shadow-lg scale-105' 
          : isCurrentPlan 
            ? `${plan.borderColor} bg-gray-50` 
            : 'border-gray-200'
      }`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.bgColor} mb-4`}>
            <Icon className={`w-6 h-6 ${plan.color}`} />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          
          {isCurrentPlan ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scale your ad generation and social media automation with our flexible pricing plans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">
                You'll receive notifications when approaching your limits. You can upgrade your plan or wait for the next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All new users get a 7-day free trial with full access to Pro features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
