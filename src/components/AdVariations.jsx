import React, { useState } from 'react'
import { Check, Send, Eye, Heart, MessageCircle, Share } from 'lucide-react'

const AdVariations = ({ variations, productData, onPostAds }) => {
  const [selectedVariations, setSelectedVariations] = useState([])
  const [posting, setPosting] = useState(false)

  const toggleVariation = (index) => {
    setSelectedVariations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handlePostAds = async () => {
    if (selectedVariations.length === 0) return
    
    setPosting(true)
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const selectedAds = selectedVariations.map(index => variations[index])
    onPostAds(selectedAds)
    setPosting(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Generated Ad Variations
        </h1>
        <p className="text-lg text-gray-600">
          Review and select the ad variations you want to post to your test accounts
        </p>
      </div>

      {/* Product Summary */}
      <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={productData?.imagePreview}
              alt={productData?.productName}
              className="w-full max-w-xs rounded-lg shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">{productData?.productName}</h3>
            <p className="text-gray-600">{productData?.productDescription}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Platform: {productData?.platform}</span>
              {productData?.targetAudience && (
                <span>Audience: {productData?.targetAudience}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ad Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {variations.map((variation, index) => (
          <div key={index} className="bg-surface rounded-lg shadow-card overflow-hidden">
            {/* Mock Phone Frame */}
            <div className="bg-black p-4">
              <div className="bg-surface rounded-lg overflow-hidden max-w-sm mx-auto" style={{ aspectRatio: '9/16' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                    <span className="font-medium text-sm">@your_brand</span>
                  </div>
                  <button className="text-gray-400">•••</button>
                </div>

                {/* Image */}
                <div className="relative">
                  <img
                    src={variation.imageUrl || productData?.imagePreview}
                    alt="Ad variation"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <h3 className="font-bold text-lg mb-2">{variation.headline}</h3>
                      <p className="text-sm opacity-90">{variation.description}</p>
                    </div>
                  </div>
                </div>

                {/* Engagement */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Heart className="w-6 h-6 text-red-500" />
                      <MessageCircle className="w-6 h-6 text-gray-600" />
                      <Share className="w-6 h-6 text-gray-600" />
                    </div>
                    <Eye className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">{Math.floor(Math.random() * 1000) + 100} likes</p>
                </div>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Variation {index + 1}</h3>
                <button
                  onClick={() => toggleVariation(index)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedVariations.includes(index)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {selectedVariations.includes(index) && <Check className="w-4 h-4" />}
                  <span>{selectedVariations.includes(index) ? 'Selected' : 'Select'}</span>
                </button>
              </div>
              
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Headline:</span> {variation.headline}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Copy:</span> {variation.adText}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">CTA:</span> {variation.cta}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Actions */}
      <div className="bg-surface rounded-lg shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to post?</h3>
            <p className="text-gray-600">
              {selectedVariations.length} variation{selectedVariations.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          
          <button
            onClick={handlePostAds}
            disabled={selectedVariations.length === 0 || posting}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {posting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting Ads...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Post Selected Ads</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdVariations