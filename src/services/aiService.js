import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key',
  dangerouslyAllowBrowser: true,
})

// Mock variations as fallback
const mockAdVariations = [
  {
    headline: "Transform Your Life Today!",
    description: "Discover the power of innovation",
    adText: "Ready to level up? This game-changing product will revolutionize your daily routine. Don't miss out on the future! 🚀 #Innovation #LifeHack",
    cta: "Shop Now",
    platform: "tiktok",
    imageUrl: null
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
  try {
    // Check if OpenAI API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-api-key') {
      console.warn('OpenAI API key not configured, using mock data')
      return generateMockVariations(productData)
    }

    const systemPrompt = `You are an expert ad copywriter specializing in social media ads for TikTok and Instagram. 
    
    Your task is to create compelling ad variations that:
    - Hook viewers in the first 3 seconds
    - Use platform-specific language and trends
    - Include relevant emojis and hashtags
    - Have clear, action-oriented CTAs
    - Match the platform's tone (TikTok: casual, trendy; Instagram: polished, aspirational)
    
    Return exactly 5 ad variations in JSON format with this structure:
    {
      "variations": [
        {
          "headline": "Catchy headline (max 60 chars)",
          "description": "Brief description (max 100 chars)",
          "adText": "Full ad copy with emojis and hashtags (max 280 chars)",
          "cta": "Call to action (max 20 chars)",
          "platform": "tiktok or instagram"
        }
      ]
    }`

    const userPrompt = `Create 5 ad variations for:
    Product: ${productData.productName}
    Description: ${productData.productDescription}
    Target Audience: ${productData.targetAudience || 'General consumers'}
    Platform: ${productData.platform === 'both' ? 'mix of TikTok and Instagram' : productData.platform}
    
    Make each variation unique with different angles (problem/solution, social proof, urgency, transformation, trending).`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    const parsed = JSON.parse(content)
    
    if (parsed.variations && Array.isArray(parsed.variations)) {
      return parsed.variations.map(variation => ({
        ...variation,
        imageUrl: null, // Will use product image
        platform: productData.platform === 'both' ? 
          (Math.random() > 0.5 ? 'tiktok' : 'instagram') : 
          productData.platform
      }))
    }

    throw new Error('Invalid response format from OpenAI')

  } catch (error) {
    console.error('Error generating AI ad variations:', error)
    console.log('Falling back to mock variations')
    return generateMockVariations(productData)
  }
}

const generateMockVariations = (productData) => {
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const variations = mockAdVariations.map(variation => ({
        ...variation,
        headline: variation.headline.replace('Transform Your Life', `Transform Your ${productData.productName} Experience`),
        platform: productData.platform === 'both' ? 
          (Math.random() > 0.5 ? 'tiktok' : 'instagram') : 
          productData.platform
      })).slice(0, 5)
      
      resolve(variations)
    }, 2000)
  })
}

// Image generation service
export const generateAdImage = async (productData, adVariation) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-api-key') {
      console.warn('OpenAI API key not configured, cannot generate images')
      return null
    }

    const prompt = `Create a high-quality, eye-catching social media ad image for ${productData.productName}. 
    Style: ${adVariation.platform === 'tiktok' ? 'vibrant, trendy, mobile-first' : 'polished, aspirational, Instagram-worthy'}
    Theme: ${adVariation.headline}
    Include: Product showcase, modern design, ${adVariation.platform === 'tiktok' ? 'bold colors' : 'aesthetic colors'}
    Avoid: Text overlays, logos, watermarks
    Aspect ratio: ${adVariation.platform === 'tiktok' ? '9:16 vertical' : '1:1 square'}`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: adVariation.platform === 'tiktok' ? "1024x1792" : "1024x1024",
      quality: "standard",
    })

    return response.data[0].url

  } catch (error) {
    console.error('Error generating ad image:', error)
    return null
  }
}
