// ============================================
// API KEYS
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123',
  'TEST_KEY_456'
];

function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// CLEAN FUNCTION - Sirf Channel aur Developer remove karega
// ============================================
function removeChannelAndDeveloper(dataArray) {
  if (!Array.isArray(dataArray)) return [];
  
  return dataArray.filter(item => {
    if (typeof item !== 'string') return true;
    
    const lowerItem = item.toLowerCase();
    
    // Remove channel line
    if (lowerItem.includes('channel:') || lowerItem.includes('📢')) return false;
    
    // Remove developer line  
    if (lowerItem.includes('developer:') || lowerItem.includes('👨‍💻')) return false;
    
    // Remove separator line
    if (lowerItem.includes('---')) return false;
    
    // Keep everything else (passwords, emails, comments, dates, everything!)
    return true;
  });
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
      message: 'Please provide API key in header: X-API-Key or query: ?api_key=YOUR_KEY',
      developer: 'Abhay Singh'
    });
  }
  
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key',
      message: 'The API key you provided is not valid',
      developer: 'Abhay Singh'
    });
  }

  // Query Check
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
    // Source API URL
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`📡 Query: ${q}`);
    console.log(`🕐 Time: ${new Date().toISOString()}`);
    
    // Fetch from source
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Source API returned ${response.status}`);
    }
    
    const sourceData = await response.json();
    
    // Get raw data array
    const rawData = sourceData.data || [];
    
    // REMOVE ONLY CHANNEL & DEVELOPER LINES
    const cleanedData = removeChannelAndDeveloper(rawData);
    
    // Count how many lines removed
    const removedCount = rawData.length - cleanedData.length;
    
    // Extract passwords (optional - helpful for users)
    const passwords = cleanedData.filter(item => 
      typeof item === 'string' && item.toLowerCase().startsWith('password:')
    );
    
    // Extract emails (optional - helpful for users)
    const emails = cleanedData.filter(item => 
      typeof item === 'string' && 
      (item.toLowerCase().includes('email:') || item.toLowerCase().includes('@gmail'))
    );
    
    // ============================================
    // FINAL RESPONSE - Clean data only
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      query: q,
      timestamp: new Date().toISOString(),
      statistics: {
        total_raw: rawData.length,
        channel_dev_removed: removedCount,
        total_results: cleanedData.length,
        password_count: passwords.length,
        email_count: emails.length
      },
      data: cleanedData,
      passwords: passwords,
      emails: emails
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      query: q,
      developer: 'Abhay Singh'
    });
  }
}
