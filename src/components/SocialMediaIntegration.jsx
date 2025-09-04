import React, { useState, useEffect } from 'react'
import { Link, Unlink, AlertCircle, CheckCircle, ExternalLink, Settings } from 'lucide-react'
import { socialMediaService } from '../services/databaseService'
import { socialMediaAuth } from '../services/socialMediaService'
import { useAuth } from '../contexts/AuthContext'

const SocialMediaIntegration = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadSocialAccounts()
    }
  }, [user])

  const loadSocialAccounts = async () => {
    try {
      setLoading(true)
      const accountsData = await socialMediaService.getUserSocialAccounts(user.id)
      setAccounts(accountsData || [])
    } catch (error) {
      console.error('Error loading social accounts:', error)
      setError('Failed to load social media accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform) => {
    try {
      setConnecting(platform)
      setError(null)

      // Generate state for OAuth security
      const state = socialMediaAuth.generateState()
      localStorage.setItem(`${platform}_oauth_state`, state)

      // In a real app, these would be environment variables
      const clientId = platform === 'tiktok' 
        ? import.meta.env.VITE_TIKTOK_CLIENT_ID || 'your-tiktok-client-id'
        : import.meta.env.VITE_INSTAGRAM_CLIENT_ID || 'your-instagram-client-id'

      const redirectUri = `${window.location.origin}/auth/callback/${platform}`

      // For demo purposes, we'll simulate the connection
      if (clientId.includes('your-')) {
        console.warn(`${platform} client ID not configured, simulating connection`)
        await simulateConnection(platform)
        return
      }

      // Get OAuth URL and redirect
      const authUrl = socialMediaAuth.getAuthUrl(platform, clientId, redirectUri, state)
      window.location.href = authUrl

    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error)
      setError(`Failed to connect to ${platform}`)
      setConnecting(null)
    }
  }

  const simulateConnection = async (platform) => {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockAccountData = {
      user_id: user.id,
      platform: platform,
      account_username: platform === 'tiktok' ? '@test_tiktok' : '@test_instagram',
      access_token: `mock_${platform}_token_${Date.now()}`,
      refresh_token: `mock_${platform}_refresh_${Date.now()}`,
      is_connected: true
    }

    await socialMediaService.connectSocialAccount(mockAccountData)
    await loadSocialAccounts()
    setConnecting(null)
  }

  const handleDisconnect = async (platform) => {
    try {
      await socialMediaService.disconnectSocialAccount(user.id, platform)
      await loadSocialAccounts()
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error)
      setError(`Failed to disconnect from ${platform}`)
    }
  }

  const getAccountByPlatform = (platform) => {
    return accounts.find(account => account.platform === platform)
  }

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Connect your TikTok account to auto-post video ads',
      icon: '🎵',
      color: 'bg-black',
      textColor: 'text-white'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Connect your Instagram account to auto-post image ads',
      icon: '📸',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social media accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Social Media Integration
        </h1>
        <p className="text-gray-600">
          Connect your social media accounts to automatically post your ad variations
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {platforms.map((platform) => {
          const account = getAccountByPlatform(platform.id)
          const isConnected = account?.is_connected
          const isConnecting = connecting === platform.id

          return (
            <div
              key={platform.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center text-2xl`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {platform.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {platform.description}
                    </p>
                    {isConnected && account.account_username && (
                      <p className="text-sm text-success font-medium mt-1">
                        Connected as {account.account_username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isConnected ? (
                    <>
                      <div className="flex items-center text-success">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      <button
                        onClick={() => handleDisconnect(platform.id)}
                        className="flex items-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting}
                      className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                        isConnecting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Link className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isConnected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 text-success font-medium">Active</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Connected:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(account.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Connected accounts will be used for auto-posting your approved ad variations</li>
              <li>• We recommend using test accounts to avoid posting to your main profiles</li>
              <li>• You can disconnect accounts at any time without affecting your existing ads</li>
              <li>• All posts will include your specified captions and call-to-action text</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Need Help?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Check our documentation for detailed setup instructions
            </p>
          </div>
          <button className="flex items-center px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Docs
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaIntegration
