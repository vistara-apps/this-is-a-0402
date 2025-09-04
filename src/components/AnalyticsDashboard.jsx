import React, { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, Eye, MousePointer, Heart, Calendar, Filter, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const AnalyticsDashboard = ({ ads = [] }) => {
  const [dateRange, setDateRange] = useState('7d')
  const [platformFilter, setPlatformFilter] = useState('all')

  // Filter ads based on selected criteria
  const filteredAds = useMemo(() => {
    let filtered = [...ads]

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(ad => ad.platform === platformFilter)
    }

    // Date range filter
    const now = new Date()
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    }[dateRange] || 7

    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
    filtered = filtered.filter(ad => new Date(ad.createdAt) >= cutoffDate)

    return filtered
  }, [ads, dateRange, platformFilter])

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalViews = filteredAds.reduce((sum, ad) => sum + (ad.views || 0), 0)
    const totalClicks = filteredAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
    const totalEngagement = filteredAds.reduce((sum, ad) => sum + (ad.engagement || 0), 0)
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0

    return {
      totalAds: filteredAds.length,
      totalViews,
      totalClicks,
      totalEngagement,
      ctr
    }
  }, [filteredAds])

  // Platform breakdown
  const platformStats = useMemo(() => {
    const stats = {}
    filteredAds.forEach(ad => {
      if (!stats[ad.platform]) {
        stats[ad.platform] = { count: 0, views: 0, clicks: 0, engagement: 0 }
      }
      stats[ad.platform].count++
      stats[ad.platform].views += ad.views || 0
      stats[ad.platform].clicks += ad.clicks || 0
      stats[ad.platform].engagement += ad.engagement || 0
    })
    return stats
  }, [filteredAds])

  // Performance over time data
  const performanceData = useMemo(() => {
    const dailyStats = {}
    filteredAds.forEach(ad => {
      const date = new Date(ad.createdAt).toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { date, views: 0, clicks: 0, engagement: 0 }
      }
      dailyStats[date].views += ad.views || 0
      dailyStats[date].clicks += ad.clicks || 0
      dailyStats[date].engagement += ad.engagement || 0
    })

    return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredAds])

  // Platform pie chart data
  const platformChartData = useMemo(() => {
    return Object.entries(platformStats).map(([platform, stats]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      value: stats.views,
      color: platform === 'tiktok' ? '#000000' : '#E1306C'
    }))
  }, [platformStats])

  // Top performing ads
  const topAds = useMemo(() => {
    return [...filteredAds]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
  }, [filteredAds])

  const MetricCard = ({ title, value, icon: Icon, change, color = 'text-gray-600' }) => (
    <div className="bg-white rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold ${color} mt-1`}>{value}</p>
          {change && (
            <p className="text-sm text-success mt-1">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  )

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">
          Create and post some ads to see your performance analytics here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your ad performance across platforms</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Ads"
          value={metrics.totalAds}
          icon={BarChart3}
          change="+12% from last period"
        />
        <MetricCard
          title="Total Views"
          value={metrics.totalViews.toLocaleString()}
          icon={Eye}
          change="+8% from last period"
          color="text-blue-600"
        />
        <MetricCard
          title="Total Clicks"
          value={metrics.totalClicks.toLocaleString()}
          icon={MousePointer}
          change="+15% from last period"
          color="text-green-600"
        />
        <MetricCard
          title="CTR"
          value={`${metrics.ctr}%`}
          icon={TrendingUp}
          change="+3% from last period"
          color="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(252, 78%, 60%)" 
                  strokeWidth={2}
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(142, 76%, 36%)" 
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform Performance & Top Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {Object.entries(platformStats).map(([platform, stats]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    platform === 'tiktok' ? 'bg-black' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}></div>
                  <span className="font-medium capitalize">{platform}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{stats.views.toLocaleString()} views</p>
                  <p className="text-sm text-gray-600">{stats.count} ads</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Ads</h3>
          <div className="space-y-4">
            {topAds.map((ad, index) => (
              <div key={ad.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {ad.productName}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{ad.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{(ad.views || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {filteredAds.slice(0, 10).map((ad) => (
            <div key={ad.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  ad.platform === 'tiktok' ? 'bg-black' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}></div>
                <div>
                  <p className="font-medium">{ad.productName}</p>
                  <p className="text-sm text-gray-600">
                    Posted {new Date(ad.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-medium">{(ad.views || 0).toLocaleString()}</p>
                  <p className="text-gray-600">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{(ad.clicks || 0).toLocaleString()}</p>
                  <p className="text-gray-600">Clicks</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{(ad.engagement || 0).toLocaleString()}</p>
                  <p className="text-gray-600">Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard

