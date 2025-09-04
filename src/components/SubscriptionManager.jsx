import React, { useState, useEffect } from 'react'
import { Crown, Check, X, CreditCard, AlertCircle } from 'lucide-react'
import { subscriptionService } from '../services/databaseService'
import { useAuth } from '../contexts/AuthContext'

const SubscriptionManager = () => {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    loadSubscriptionData()
  }, [user])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionService.getSubscriptionPlans(),
        user ? subscriptionService.getUserSubscription(user.id) : null
      ])
      
      setPlans(plansData || [])
      setCurrentSubscription(subscriptionData)
    } catch (error) {
      console.error('Error loading subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId) => {
    if (!user) return

    try {
      setUpgrading(true)
      setSelectedPlan(planId)

      // In a real app, this would integrate with Stripe, PayPal, etc.
      // For now, we'll simulate the upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const subscriptionData = {
        user_id: user.id,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      if (currentSubscription) {
        await subscriptionService.updateSubscription(currentSubscription.id, subscriptionData)
      } else {
        await subscriptionService.createSubscription(subscriptionData)
      }

      await loadSubscriptionData()
      
    } catch (error) {
      console.error('Error upgrading subscription:', error)
    } finally {
      setUpgrading(false)
      setSelectedPlan(null)
    }
  }

  const getPlanFeatures = (features) => {
    if (!features) return []
    
    const featureList = []
    if (features.analytics) featureList.push('Advanced Analytics')
    if (features.basic_support) featureList.push('Basic Support')
    if (features.priority_support) featureList.push('Priority Support')
    if (features.advanced_targeting) featureList.push('Advanced Targeting')
    if (features.custom_branding) featureList.push('Custom Branding')
    
    return featureList
  }

  const isCurrentPlan = (planId) => {
    return currentSubscription?.plan_id === planId
  }

  const getPlanLimits = (plan) => {
    return {
      adVariations: plan.ad_variations_limit === -1 ? 'Unlimited' : plan.ad_variations_limit,
      autoPosts: plan.auto_posts_limit === -1 ? 'Unlimited' : plan.auto_posts_limit
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the full power of AI-driven ad creation and optimization
        </p>
      </div>

      {currentSubscription && (
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Current Plan: {currentSubscription.subscription_plans?.name}</h3>
                <p className="text-white/80">
                  Next billing: {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${currentSubscription.subscription_plans?.price}/mo</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const limits = getPlanLimits(plan)
          const features = getPlanFeatures(plan.features)
          const isCurrent = isCurrentPlan(plan.id)
          const isPopular = plan.name === 'Pro'

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-8 ${
                isPopular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isCurrent ? 'bg-primary/5 border-primary' : 'bg-white'}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ad Variations</span>
                  <span className="font-medium">{limits.adVariations}/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Auto Posts</span>
                  <span className="font-medium">{limits.autoPosts}/month</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || upgrading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : upgrading && selectedPlan === plan.id
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : isPopular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : upgrading && selectedPlan === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    {currentSubscription ? 'Upgrade' : 'Get Started'}
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Need help choosing?</p>
            <p>
              Start with the Basic plan and upgrade anytime as your needs grow. 
              All plans include our core AI ad generation features and analytics dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
