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
// MAIN HANDLER - RAW RESPONSE
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
      message: 'Please provide API key in header: X-API-Key',
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
    console.log(`🔗 URL: ${targetUrl}`);
    console.log(`🕐 Time: ${new Date().toISOString()}`);
    
    // Fetch from source
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible)',
        'Accept': 'application/json'
      }
    });
    
    // Get RAW response from source
    const sourceData = await response.json();
    
    // ============================================
    // SEND EXACT SOURCE RESPONSE
    // Jo bhi source se aaya, wahi bhej rahe hain
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      query: q,
      timestamp: new Date().toISOString(),
      
      // EXACT SOURCE RESPONSE - BILKUL WAISA KA WAISA
      source_url: targetUrl,
      source_status: response.status,
      source_data: sourceData
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
