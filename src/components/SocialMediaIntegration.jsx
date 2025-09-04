import React, { useState, useEffect } from 'react'
import { Link, Unlink, CheckCircle, AlertCircle, Settings, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const SocialMediaIntegration = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      connected: false,
      username: null,
      followers: null,
      color: 'bg-black',
      textColor: 'text-white'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      connected: false,
      username: null,
      followers: null,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white'
    }
  ])
  
  const [loading, setLoading] = useState({})

  const handleConnect = async (platformId) => {
    setLoading(prev => ({ ...prev, [platformId]: true }))
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful connection
      setAccounts(prev => prev.map(account => 
        account.id === platformId 
          ? {
              ...account,
              connected: true,
              username: `@test_${platformId}_user`,
              followers: Math.floor(Math.random() * 10000) + 1000
            }
          : account
      ))
      
      toast.success(`Successfully connected to ${platformId.charAt(0).toUpperCase() + platformId.slice(1)}!`)
    } catch (error) {
      toast.error(`Failed to connect to ${platformId}. Please try again.`)
    } finally {
      setLoading(prev => ({ ...prev, [platformId]: false }))
    }
  }

  const handleDisconnect = async (platformId) => {
    setLoading(prev => ({ ...prev, [platformId]: true }))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAccounts(prev => prev.map(account => 
        account.id === platformId 
          ? {
              ...account,
              connected: false,
              username: null,
              followers: null
            }
          : account
      ))
      
      toast.success(`Disconnected from ${platformId.charAt(0).toUpperCase() + platformId.slice(1)}`)
    } catch (error) {
      toast.error(`Failed to disconnect from ${platformId}. Please try again.`)
    } finally {
      setLoading(prev => ({ ...prev, [platformId]: false }))
    }
  }

  const AccountCard = ({ account }) => {
    const isLoading = loading[account.id]
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg ${account.color} flex items-center justify-center text-2xl`}>
              {account.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
              {account.connected && account.username && (
                <p className="text-sm text-gray-600">{account.username}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {account.connected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
            <span className={`text-sm font-medium ${
              account.connected ? 'text-green-600' : 'text-gray-500'
            }`}>
              {account.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
        
        {account.connected && account.followers && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Followers</span>
              <span className="font-medium text-gray-900">
                {account.followers.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {account.connected ? (
            <>
              <button
                onClick={() => handleDisconnect(account.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin mr-2" />
                ) : (
                  <Unlink className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Disconnecting...' : 'Disconnect'}
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </>
          ) : (
            <button
              onClick={() => handleConnect(account.id)}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center px-4 py-2 ${account.color} ${account.textColor} rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Link className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Connecting...' : `Connect ${account.name}`}
            </button>
          )}
        </div>
      </div>
    )
  }

  const connectedCount = accounts.filter(account => account.connected).length

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Social Media Integrations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your social media accounts to automatically post your generated ads
          </p>
        </div>
        
        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Connection Status
              </h2>
              <p className="text-gray-600">
                {connectedCount} of {accounts.length} platforms connected
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${(connectedCount / accounts.length) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round((connectedCount / accounts.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
        
        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help Connecting?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Developer Accounts</h3>
                <p className="text-gray-600 text-sm">
                  You'll need developer accounts for each platform to enable API access.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Grant Permissions</h3>
                <p className="text-gray-600 text-sm">
                  Allow posting permissions when connecting your accounts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Test Your Connection</h3>
                <p className="text-gray-600 text-sm">
                  We recommend testing with a few posts before running campaigns.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-blue-200">
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View detailed setup guide
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaIntegration
