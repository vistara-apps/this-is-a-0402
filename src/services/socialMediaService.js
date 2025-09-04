// Social Media Posting Service
// Handles TikTok and Instagram API integrations

// TikTok API Service
export const tiktokService = {
  // TikTok OAuth URLs
  getAuthUrl: (clientId, redirectUri, state) => {
    const params = new URLSearchParams({
      client_key: clientId,
      response_type: 'code',
      scope: 'user.info.basic,video.upload',
      redirect_uri: redirectUri,
      state: state
    })
    return `https://www.tiktok.com/auth/authorize/?${params.toString()}`
  },

  // Exchange authorization code for access token
  async getAccessToken(code, clientId, clientSecret, redirectUri) {
    try {
      const response = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error_description || 'Failed to get access token')
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        openId: data.open_id
      }
    } catch (error) {
      console.error('TikTok token exchange error:', error)
      throw error
    }
  },

  // Upload video to TikTok
  async uploadVideo(accessToken, videoData) {
    try {
      // Note: This is a simplified version. Real implementation would need:
      // 1. Video file upload to TikTok's servers
      // 2. Proper video encoding and format validation
      // 3. Handle TikTok's multi-step upload process

      console.warn('TikTok video upload not fully implemented - using mock response')
      
      // Mock successful upload
      return {
        success: true,
        videoId: `tiktok_${Date.now()}`,
        message: 'Video uploaded successfully (mock)',
        url: `https://tiktok.com/@test/video/${Date.now()}`
      }

      /* Real implementation would look like:
      const response = await fetch('https://open-api.tiktok.com/share/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: {
            video_url: videoData.videoUrl,
            caption: videoData.caption,
            privacy_level: 'SELF_ONLY', // For test accounts
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
            brand_content_toggle: false
          }
        })
      })

      const result = await response.json()
      return result
      */
    } catch (error) {
      console.error('TikTok upload error:', error)
      throw error
    }
  },

  // Get user info
  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://open-api.tiktok.com/user/info/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('TikTok user info error:', error)
      throw error
    }
  }
}

// Instagram API Service
export const instagramService = {
  // Instagram OAuth URL
  getAuthUrl: (clientId, redirectUri, state) => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      state: state
    })
    return `https://api.instagram.com/oauth/authorize?${params.toString()}`
  },

  // Exchange authorization code for access token
  async getAccessToken(code, clientId, clientSecret, redirectUri) {
    try {
      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error_description || 'Failed to get access token')
      }

      return {
        accessToken: data.access_token,
        userId: data.user_id
      }
    } catch (error) {
      console.error('Instagram token exchange error:', error)
      throw error
    }
  },

  // Create Instagram media (photo/video)
  async createMedia(accessToken, mediaData) {
    try {
      console.warn('Instagram media creation not fully implemented - using mock response')
      
      // Mock successful creation
      return {
        success: true,
        mediaId: `instagram_${Date.now()}`,
        message: 'Media created successfully (mock)',
        url: `https://instagram.com/p/${Date.now()}`
      }

      /* Real implementation would look like:
      const response = await fetch(`https://graph.instagram.com/me/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: mediaData.imageUrl,
          caption: mediaData.caption,
          access_token: accessToken
        })
      })

      const result = await response.json()
      return result
      */
    } catch (error) {
      console.error('Instagram media creation error:', error)
      throw error
    }
  },

  // Publish Instagram media
  async publishMedia(accessToken, creationId) {
    try {
      console.warn('Instagram media publishing not fully implemented - using mock response')
      
      return {
        success: true,
        id: creationId,
        message: 'Media published successfully (mock)'
      }

      /* Real implementation:
      const response = await fetch(`https://graph.instagram.com/me/media_publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken
        })
      })

      const result = await response.json()
      return result
      */
    } catch (error) {
      console.error('Instagram publish error:', error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile(accessToken) {
    try {
      const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Instagram user profile error:', error)
      throw error
    }
  }
}

// Unified posting service
export const postToSocialMedia = async (platform, accessToken, adData) => {
  try {
    let result

    if (platform === 'tiktok') {
      result = await tiktokService.uploadVideo(accessToken, {
        videoUrl: adData.imageUrl, // In real app, this would be a video
        caption: `${adData.adText}\n\n${adData.cta}`,
      })
    } else if (platform === 'instagram') {
      const mediaCreation = await instagramService.createMedia(accessToken, {
        imageUrl: adData.imageUrl,
        caption: `${adData.adText}\n\n${adData.cta}`,
      })
      
      if (mediaCreation.success) {
        result = await instagramService.publishMedia(accessToken, mediaCreation.mediaId)
      } else {
        throw new Error('Failed to create Instagram media')
      }
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    return {
      success: true,
      platform,
      postId: result.mediaId || result.videoId,
      url: result.url,
      message: result.message
    }

  } catch (error) {
    console.error(`Error posting to ${platform}:`, error)
    return {
      success: false,
      platform,
      error: error.message
    }
  }
}

// Mock posting service for development/testing
export const mockPostToSocialMedia = async (platform, adData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate occasional failures for testing
  if (Math.random() < 0.1) {
    throw new Error(`Failed to post to ${platform}: Network error`)
  }

  return {
    success: true,
    platform,
    postId: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url: platform === 'tiktok' 
      ? `https://tiktok.com/@test/video/${Date.now()}`
      : `https://instagram.com/p/${Date.now()}`,
    message: `Successfully posted to ${platform}`,
    metrics: {
      views: Math.floor(Math.random() * 1000) + 100,
      clicks: Math.floor(Math.random() * 50) + 10,
      engagement: Math.floor(Math.random() * 20) + 5
    }
  }
}

// Social media account connection helpers
export const socialMediaAuth = {
  // Generate state parameter for OAuth
  generateState: () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  },

  // Validate state parameter
  validateState: (receivedState, expectedState) => {
    return receivedState === expectedState
  },

  // Get platform-specific auth URL
  getAuthUrl: (platform, clientId, redirectUri, state) => {
    if (platform === 'tiktok') {
      return tiktokService.getAuthUrl(clientId, redirectUri, state)
    } else if (platform === 'instagram') {
      return instagramService.getAuthUrl(clientId, redirectUri, state)
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }
  },

  // Handle OAuth callback
  async handleCallback(platform, code, clientId, clientSecret, redirectUri) {
    if (platform === 'tiktok') {
      return await tiktokService.getAccessToken(code, clientId, clientSecret, redirectUri)
    } else if (platform === 'instagram') {
      return await instagramService.getAccessToken(code, clientId, clientSecret, redirectUri)
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }
  }
}
