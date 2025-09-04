# Ad Remix AI - API Documentation

This document outlines the complete API integration requirements and implementation details for the Ad Remix AI application.

## 📋 Table of Contents

1. [OpenAI Integration](#openai-integration)
2. [Supabase Database](#supabase-database)
3. [TikTok API](#tiktok-api)
4. [Instagram API](#instagram-api)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Security Considerations](#security-considerations)

## 🤖 OpenAI Integration

### Configuration
```javascript
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})
```

### Ad Generation API
**Endpoint**: `/v1/chat/completions`
**Method**: `POST`

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "You are an expert ad copywriter specializing in social media ads..."
    },
    {
      role: "user",
      content: `Create 5 ad variations for: ${productData.productName}...`
    }
  ],
  temperature: 0.8,
  max_tokens: 2000,
})
```

### Image Generation API
**Endpoint**: `/v1/images/generations`
**Method**: `POST`

```javascript
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "Create a high-quality, eye-catching social media ad image...",
  n: 1,
  size: "1024x1024",
  quality: "standard",
})
```

### Rate Limits
- **GPT-4**: 500 requests/day (Tier 1)
- **DALL-E 3**: 50 images/day (Tier 1)
- **Cost**: ~$0.01 per ad generation, ~$0.04 per image

## 🗄️ Supabase Database

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'basic',
  test_tiktok_account VARCHAR(255),
  test_ig_account VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Ads Table
```sql
CREATE TABLE ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  ad_text TEXT NOT NULL,
  headline VARCHAR(255),
  cta VARCHAR(100),
  platform VARCHAR(50) NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  is_posted BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Operations

#### User Management
```javascript
// Create user
const { data, error } = await supabase
  .from('users')
  .insert([userData])
  .select()
  .single()

// Get user by ID
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

#### Ad Management
```javascript
// Create ad
const { data, error } = await supabase
  .from('ads')
  .insert([adData])
  .select()
  .single()

// Get user ads with filtering
const { data, error } = await supabase
  .from('ads')
  .select('*')
  .eq('user_id', userId)
  .eq('platform', platform)
  .order('created_at', { ascending: false })
```

## 🎵 TikTok API

### Authentication Flow

#### Step 1: Authorization URL
```javascript
const authUrl = `https://www.tiktok.com/auth/authorize/?${new URLSearchParams({
  client_key: clientId,
  response_type: 'code',
  scope: 'user.info.basic,video.upload',
  redirect_uri: redirectUri,
  state: state
})}`
```

#### Step 2: Token Exchange
```javascript
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
```

### Video Upload API

#### Initialize Upload
```javascript
const initResponse = await fetch('https://open-api.tiktok.com/share/video/upload/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    video: {
      video_url: videoUrl,
      caption: caption,
      privacy_level: 'SELF_ONLY',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false
    }
  })
})
```

### Rate Limits
- **API Calls**: 1000 requests/day per app
- **Video Uploads**: 100 uploads/day per user
- **User Info**: 100 requests/hour

## 📸 Instagram API

### Authentication Flow

#### Step 1: Authorization URL
```javascript
const authUrl = `https://api.instagram.com/oauth/authorize?${new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  scope: 'user_profile,user_media',
  response_type: 'code',
  state: state
})}`
```

#### Step 2: Token Exchange
```javascript
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
```

### Media Upload API

#### Create Media Container
```javascript
const createResponse = await fetch(`https://graph.instagram.com/me/media`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image_url: imageUrl,
    caption: caption,
    access_token: accessToken
  })
})
```

#### Publish Media
```javascript
const publishResponse = await fetch(`https://graph.instagram.com/me/media_publish`, {
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
```

### Rate Limits
- **API Calls**: 200 requests/hour per user
- **Media Uploads**: 50 uploads/day per user
- **User Data**: 100 requests/hour

## 🔐 Authentication Flow

### OAuth State Management
```javascript
// Generate secure state parameter
const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Store state in localStorage
localStorage.setItem(`${platform}_oauth_state`, state)

// Validate state on callback
const validateState = (receivedState, expectedState) => {
  return receivedState === expectedState
}
```

### Token Storage
```javascript
// Store tokens securely
const storeTokens = async (platform, tokens) => {
  await supabase
    .from('social_media_accounts')
    .upsert({
      user_id: userId,
      platform: platform,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: new Date(Date.now() + tokens.expiresIn * 1000),
      is_connected: true
    })
}
```

## ⚠️ Error Handling

### API Error Responses
```javascript
const handleApiError = (error, context) => {
  const errorMap = {
    401: 'Authentication failed - please reconnect your account',
    403: 'Permission denied - check your app permissions',
    429: 'Rate limit exceeded - please try again later',
    500: 'Server error - please try again',
    default: 'An unexpected error occurred'
  }
  
  const message = errorMap[error.status] || errorMap.default
  console.error(`${context} error:`, error)
  
  return {
    success: false,
    error: message,
    details: error.message
  }
}
```

### Retry Logic
```javascript
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

## 🚦 Rate Limiting

### Implementation
```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map()
  }
  
  async checkLimit(key) {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }
    
    const userRequests = this.requests.get(key)
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded')
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
  }
}

// Usage
const openaiLimiter = new RateLimiter(100, 60000) // 100 requests per minute
await openaiLimiter.checkLimit(userId)
```

## 🔒 Security Considerations

### API Key Management
- Store API keys in environment variables
- Never expose keys in client-side code
- Use different keys for development/production
- Rotate keys regularly

### Data Validation
```javascript
const validateAdData = (data) => {
  const schema = {
    productName: { required: true, maxLength: 255 },
    productDescription: { required: true, maxLength: 1000 },
    platform: { required: true, enum: ['tiktok', 'instagram'] }
  }
  
  // Validation logic here
}
```

### CORS Configuration
```javascript
// Supabase CORS settings
const corsOptions = {
  origin: process.env.VITE_APP_URL,
  credentials: true,
  optionsSuccessStatus: 200
}
```

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own ads" 
ON ads FOR ALL 
USING (auth.uid() = user_id);
```

## 📊 Monitoring & Analytics

### API Usage Tracking
```javascript
const trackApiUsage = async (userId, endpoint, status) => {
  await supabase
    .from('api_usage')
    .insert({
      user_id: userId,
      endpoint: endpoint,
      status: status,
      timestamp: new Date().toISOString()
    })
}
```

### Performance Monitoring
```javascript
const measureApiPerformance = async (fn, context) => {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    console.log(`${context} completed in ${duration}ms`)
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`${context} failed after ${duration}ms:`, error)
    throw error
  }
}
```

## 🧪 Testing

### API Mocking
```javascript
// Mock OpenAI for testing
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mock ad content' } }]
      })
    }
  }
}
```

### Integration Tests
```javascript
describe('Ad Generation API', () => {
  test('should generate ad variations', async () => {
    const productData = {
      productName: 'Test Product',
      productDescription: 'Test Description',
      platform: 'tiktok'
    }
    
    const variations = await generateAdVariations(productData)
    expect(variations).toHaveLength(5)
    expect(variations[0]).toHaveProperty('headline')
    expect(variations[0]).toHaveProperty('adText')
  })
})
```

---

This documentation provides a comprehensive guide for implementing all API integrations required for the Ad Remix AI application. Each section includes practical code examples and best practices for production deployment.
