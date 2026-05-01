// ============================================
// API KEYS
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123',
  'FULL_ACCESS_VISHAL_BOSS'
];

function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// MAIN HANDLER
// ============================================
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API Key Check
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key Required',
      message: 'Please provide API key in header: X-API-Key or query: ?api_key=KEY',
      developer: 'Abhay Singh'
    });
  }
  
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key',
      developer: 'Abhay Singh'
    });
  }

  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter "q"',
      example: '/api/search?q=vishalboss',
      developer: 'Abhay Singh'
    });
  }

  try {
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`📡 Query: ${q}`);
    console.log(`🔗 URL: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Source API returned ${response.status}`);
    }
    
    const sourceData = await response.json();
    
    // ============================================
    // FIX: Handle BOTH object and array responses
    // ============================================
    let rawData = [];
    
    if (Array.isArray(sourceData)) {
      // Source returned direct array
      rawData = sourceData;
    } else if (sourceData.data && Array.isArray(sourceData.data)) {
      // Source returned object with data array
      rawData = sourceData.data;
    } else {
      // Unknown format, try to get anything
      rawData = [];
    }
    
    // Remove first 3 lines (channel, developer, separator)
    const cleanedData = rawData.filter((item, index) => {
      if (typeof item !== 'string') return true;
      const lowerItem = item.toLowerCase();
      // Skip first 3 items (channel, developer, separator)
      if (index < 3) return false;
      // Also skip if contains channel/developer (just in case)
      if (lowerItem.includes('channel:') || lowerItem.includes('📢')) return false;
      if (lowerItem.includes('developer:') || lowerItem.includes('👨‍💻')) return false;
      if (lowerItem.includes('---')) return false;
      return true;
    });
    
    // Extract passwords
    const passwords = cleanedData.filter(item => 
      typeof item === 'string' && item.toLowerCase().startsWith('password:')
    );
    
    // Extract emails
    const emails = cleanedData.filter(item => 
      typeof item === 'string' && 
      (item.toLowerCase().includes('email:') || item.includes('@gmail') || item.includes('@yahoo'))
    );
    
    // Extract phones
    const phones = cleanedData.filter(item => 
      typeof item === 'string' && 
      (item.toLowerCase().includes('mobile:') || item.toLowerCase().includes('phone:'))
    );
    
    // ============================================
    // FINAL RESPONSE
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      api_version: '3.0.0',
      query: q,
      timestamp: new Date().toISOString(),
      statistics: {
        total_raw: rawData.length,
        removed_first_lines: rawData.length - cleanedData.length,
        total_results: cleanedData.length,
        passwords_found: passwords.length,
        emails_found: emails.length,
        phones_found: phones.length
      },
      data: cleanedData,
      passwords: passwords,
      emails: emails,
      phones: phones
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      query: q,
      developer: 'Abhay Singh',
      timestamp: new Date().toISOString()
    });
  }
}
