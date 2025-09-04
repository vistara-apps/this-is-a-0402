// Mock AI service for generating ad variations
// In a real implementation, this would call OpenAI API

const mockAdVariations = [
  {
    headline: "Transform Your Life Today!",
    description: "Discover the power of innovation",
    adText: "Ready to level up? This game-changing product will revolutionize your daily routine. Don't miss out on the future! 🚀 #Innovation #LifeHack",
    cta: "Shop Now",
    platform: "tiktok",
    imageUrl: null // Will use product image
  },
  {
    headline: "The Secret Everyone's Talking About",
    description: "Join thousands of satisfied customers",
    adText: "✨ What if I told you there's a better way? This incredible product has helped over 10,000 people achieve their goals. Your turn! #GameChanger",
    cta: "Get Yours",
    platform: "tiktok",
    imageUrl: null
  },
  {
    headline: "You Won't Believe This Result",
    description: "See the difference in just days",
    adText: "Before vs After will shock you! 😱 This amazing product delivers results that seemed impossible. Ready to be amazed? #Transformation #Results",
    cta: "Try Now",
    platform: "tiktok",
    imageUrl: null
  },
  {
    headline: "Limited Time: 50% Off!",
    description: "Exclusive offer for smart shoppers",
    adText: "⏰ FLASH SALE ALERT! Smart shoppers are grabbing this deal fast. Premium quality at half the price - but only for 24 hours! #Sale #Limited",
    cta: "Claim Deal",
    platform: "instagram",
    imageUrl: null
  },
  {
    headline: "Why Everyone's Switching",
    description: "The smarter choice is obvious",
    adText: "🔥 Trending Now! While others stick to the old way, smart people are switching to this revolutionary solution. Join the movement! #Trending #Smart",
    cta: "Join Now",
    platform: "instagram",
    imageUrl: null
  }
]

export const generateAdVariations = async (productData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // In a real implementation, you would call OpenAI API here:
  /*
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  })

  const response = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are an expert ad copywriter specializing in social media ads for TikTok and Instagram..."
      },
      {
        role: "user", 
        content: `Create 5 ad variations for: ${productData.productName}. Description: ${productData.productDescription}. Target audience: ${productData.targetAudience || 'General'}. Platform: ${productData.platform}`
      }
    ]
  })
  */

  // Return mock variations customized for the product
  return mockAdVariations.map(variation => ({
    ...variation,
    headline: variation.headline.replace('Transform Your Life', `Transform Your ${productData.productName} Experience`),
    platform: productData.platform === 'both' ? (Math.random() > 0.5 ? 'tiktok' : 'instagram') : productData.platform
  })).slice(0, 5)
}
