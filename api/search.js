// ============================================
// API KEYS - Authorized Keys
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123', 
  'TEST_KEY_456',
  'OSINT_MASTER_KEY'
];

// ============================================
// API Key Validation
// ============================================
function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// MAIN API HANDLER
// ============================================
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // API KEY AUTHENTICATION
  // ============================================
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'] || req.query.api_key;
  
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

  // ============================================
  // QUERY PARAMETER CHECK
  // ============================================
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter',
      message: 'Use: /api/search?q=YOUR_QUERY',
      example: '/api/search?q=8651369225',
      developer: 'Abhay Singh'
    });
  }

  try {
    // ============================================
    // SOURCE API SCRAPE
    // ============================================
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`📡 Query: ${q}`);
    console.log(`🕐 Time: ${new Date().toISOString()}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OSINT-Bot/1.0)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Source API returned ${response.status}`);
    }
    
    const sourceData = await response.json();
    
    // ============================================
    // EXTRACT DATA - Channel & Developer Remove
    // ============================================
    const extractedData = sourceData.data || [];
    
    // ============================================
    // FINAL RESPONSE - Sirf Developer: Abhay Singh
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      developer_contact: 'tg-@darkdeveloper2',
      query: q,
      timestamp: new Date().toISOString(),
      total_results: extractedData.length,
      data: extractedData
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      query: q,
      developer: 'Abhay Singh'
    });
  }
}
