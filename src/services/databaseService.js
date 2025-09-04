import { supabase } from './supabaseClient'

// User Management
export const userService = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}

// Ad Management
export const adService = {
  async createAd(adData) {
    const { data, error } = await supabase
      .from('ads')
      .insert([adData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserAds(userId, options = {}) {
    let query = supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options.platform) {
      query = query.eq('platform', options.platform)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  async updateAdMetrics(adId, metrics) {
    const { data, error } = await supabase
      .from('ads')
      .update(metrics)
      .eq('id', adId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteAd(adId) {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)
    
    if (error) throw error
  },

  async getAdAnalytics(userId, dateRange = {}) {
    let query = supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)

    if (dateRange.start) {
      query = query.gte('created_at', dateRange.start)
    }

    if (dateRange.end) {
      query = query.lte('created_at', dateRange.end)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data
  }
}

// Ad Variations Management
export const adVariationService = {
  async saveVariations(variations) {
    const { data, error } = await supabase
      .from('ad_variations')
      .insert(variations)
      .select()
    
    if (error) throw error
    return data
  },

  async getUserVariations(userId) {
    const { data, error } = await supabase
      .from('ad_variations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateVariationSelection(variationId, isSelected) {
    const { data, error } = await supabase
      .from('ad_variations')
      .update({ is_selected: isSelected })
      .eq('id', variationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteVariations(userId, olderThan) {
    const { error } = await supabase
      .from('ad_variations')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', olderThan)
    
    if (error) throw error
  }
}

// Subscription Management
export const subscriptionService = {
  async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getUserSubscription(userId) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert([subscriptionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSubscription(subscriptionId, updates) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Social Media Account Management
export const socialMediaService = {
  async getUserSocialAccounts(userId) {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async connectSocialAccount(accountData) {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .upsert([accountData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async disconnectSocialAccount(userId, platform) {
    const { error } = await supabase
      .from('social_media_accounts')
      .update({ 
        is_connected: false, 
        access_token: null, 
        refresh_token: null 
      })
      .eq('user_id', userId)
      .eq('platform', platform)
    
    if (error) throw error
  },

  async updateSocialAccountTokens(accountId, tokens) {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .update(tokens)
      .eq('id', accountId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Analytics and Reporting
export const analyticsService = {
  async getDashboardStats(userId, dateRange = {}) {
    const ads = await adService.getAdAnalytics(userId, dateRange)
    
    const stats = {
      totalAds: ads.length,
      totalViews: ads.reduce((sum, ad) => sum + (ad.views || 0), 0),
      totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
      totalEngagement: ads.reduce((sum, ad) => sum + (ad.engagement || 0), 0),
      averageCTR: 0,
      platformBreakdown: {},
      performanceOverTime: []
    }

    // Calculate average CTR
    if (stats.totalViews > 0) {
      stats.averageCTR = (stats.totalClicks / stats.totalViews * 100).toFixed(2)
    }

    // Platform breakdown
    ads.forEach(ad => {
      if (!stats.platformBreakdown[ad.platform]) {
        stats.platformBreakdown[ad.platform] = {
          count: 0,
          views: 0,
          clicks: 0,
          engagement: 0
        }
      }
      stats.platformBreakdown[ad.platform].count++
      stats.platformBreakdown[ad.platform].views += ad.views || 0
      stats.platformBreakdown[ad.platform].clicks += ad.clicks || 0
      stats.platformBreakdown[ad.platform].engagement += ad.engagement || 0
    })

    // Performance over time (group by day)
    const dailyStats = {}
    ads.forEach(ad => {
      const date = new Date(ad.created_at).toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { date, views: 0, clicks: 0, engagement: 0 }
      }
      dailyStats[date].views += ad.views || 0
      dailyStats[date].clicks += ad.clicks || 0
      dailyStats[date].engagement += ad.engagement || 0
    })

    stats.performanceOverTime = Object.values(dailyStats).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )

    return stats
  },

  async getTopPerformingAds(userId, limit = 10) {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('views', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}
