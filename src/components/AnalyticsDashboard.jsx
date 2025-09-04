import React, { useState } from 'react'
import { BarChart3, TrendingUp, Eye, MousePointer, Heart, Calendar } from 'lucide-react'

const AnalyticsDashboard = ({ ads }) => {
  const [timeRange, setTimeRange] = useState('7d')

  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0)
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const totalEngagement = ads.reduce((sum, ad) => sum + ad.engagement, 0)
  const avgCTR = ads.length > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0

  const getPerformanceColor = (metric, value) => {
    if (metric === 'views' && value > 500) return 'text-success'
    if (metric === 'ctr' && value > 3) return 'text-success'
    if (metric === 'engagement' && value > 15) return 'text-success'
    return 'text-gray-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">Track your ad performance and optimize campaigns</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-xs text-success">+12% vs last period</p>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{totalClicks.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Clicks</p>
            <p className="text-xs text-success">+8% vs last period</p>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{totalEngagement}%</p>
            <p className="text-sm text-gray-600">Avg Engagement</p>
            <p className="text-xs text-success">+15% vs last period</p>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-900">{avgCTR}%</p>
            <p className="text-sm text-gray-600">Click-through Rate</p>
            <p className="text-xs text-success">+5% vs last period</p>
          </div>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="bg-surface rounded-lg shadow-card p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No ads posted yet</h3>
          <p className="text-gray-600 mb-6">
            Start by uploading a product and generating ad variations to see analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* Performance Chart */}
          <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {ads.slice(0, 7).map((ad, index) => {
                const maxViews = Math.max(...ads.map(a => a.views))
                const height = (ad.views / maxViews) * 100
                
                return (
                  <div key={ad.id} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-accent rounded-t-sm"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">Ad {index + 1}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ad Performance Table */}
          <div className="bg-surface rounded-lg shadow-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Ad Performance Details</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-gray-200">
                  {ads.map((ad, index) => {
                    const ctr = ((ad.clicks / ad.views) * 100).toFixed(2)
                    
                    return (
                      <tr key={ad.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-medium text-sm">
                              {index + 1}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{ad.headline}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{ad.adText}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                            {ad.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ad.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ad.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={getPerformanceColor('ctr', parseFloat(ctr))}>
                            {ctr}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={getPerformanceColor('engagement', ad.engagement)}>
                            {ad.engagement}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsDashboard