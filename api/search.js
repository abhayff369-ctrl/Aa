// ============================================
// API KEYS - Authorized Keys
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123',
  'TEST_KEY_456',
  'MASTER_KEY_789'
];

// ============================================
// Check API Key Function
// ============================================
function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// Remove Channel, Developer & Separator Lines
// ============================================
function cleanData(dataArray) {
  if (!Array.isArray(dataArray)) return [];
  
  return dataArray.filter(item => {
    if (typeof item !== 'string') return true;
    
    const lowerItem = item.toLowerCase();
    
    // Remove channel line
    if (lowerItem.includes('channel:') || lowerItem.includes('📢')) return false;
    
    // Remove developer line  
    if (lowerItem.includes('developer:') || lowerItem.includes('👨‍💻')) return false;
    
    // Remove separator line
    if (lowerItem.includes('---') || lowerItem.includes('-----------------------------------')) return false;
    
    // Keep everything else
    return true;
  });
}

// ============================================
// MAIN API HANDLER
// ============================================
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // API KEY AUTHENTICATION
  // ============================================
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key Required',
      message: 'Please provide API key in header: X-API-Key or query: ?api_key=YOUR_KEY',
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official'
    });
  }
  
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key',
      message: 'The API key you provided is not valid',
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official'
    });
  }

  // ============================================
  // QUERY PARAMETER CHECK
  // ============================================
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter',
      message: 'Use: /api/search?q=YOUR_QUERY',
      example: '/api/search?q=vishalboss',
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official'
    });
  }

  try {
    // ============================================
    // SOURCE API URL
    // ============================================
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`[${new Date().toISOString()}] Query: ${q}`);
    console.log(`[${new Date().toISOString()}] Fetching: ${targetUrl}`);
    
    // ============================================
    // FETCH FROM SOURCE API
    // ============================================
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    // Check if source API responded
    if (!response.ok) {
      throw new Error(`Source API returned status: ${response.status}`);
    }
    
    // Get source data
    const sourceData = await response.json();
    
    // Get raw data array
    const rawData = sourceData.data || [];
    
    // Clean data - remove channel, developer, separator
    const cleanedData = cleanData(rawData);
    
    // Extract passwords
    const passwords = cleanedData.filter(item => 
      typeof item === 'string' && item.toLowerCase().startsWith('password:')
    );
    
    // Extract emails
    const emails = cleanedData.filter(item => 
      typeof item === 'string' && 
      (item.toLowerCase().includes('email:') || item.toLowerCase().includes('@gmail') || item.toLowerCase().includes('@yahoo'))
    );
    
    // Extract phone numbers
    const phones = cleanedData.filter(item => 
      typeof item === 'string' && 
      (item.toLowerCase().includes('mobile:') || item.toLowerCase().includes('phone:') || item.match(/mobile: \d{10}/))
    );
    
    // ============================================
    // SEND FINAL RESPONSE
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      api_version: '2.0.0',
      query: q,
      timestamp: new Date().toISOString(),
      statistics: {
        total_raw: rawData.length,
        removed_channel_dev: rawData.length - cleanedData.length,
        total_clean_results: cleanedData.length,
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
    console.error(`[${new Date().toISOString()}] Error:`, error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data',
      message: error.message,
      query: q,
      timestamp: new Date().toISOString(),
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      suggestion: 'Try a different query or check if source API is working'
    });
  }
}
