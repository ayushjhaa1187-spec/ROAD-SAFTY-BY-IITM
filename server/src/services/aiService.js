const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

/**
 * Generates a formal complaint summary from raw inputs.
 */
const generateComplaint = async ({ issueText, defects, location }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      You are an AI Road Risk Analyst. Generate a professional government complaint for the following road issue:
      
      User Input: ${issueText}
      Computer Vision Detections: ${JSON.stringify(defects)}
      Location: ${location}
      
      Requirements:
      1. Use a formal tone suitable for a Municipal Commissioner or PWD head.
      2. Group the observations into technical categories.
      3. Highlight immediate safety risks.
      4. Suggest a resolution priority.
      
      Return as JSON with keys: 'complaint_text', 'priority', 'department_suggested'.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('AI Service Error (Complaint):', error);
    throw error;
  }
};

/**
 * Estimates risk level based on defects and context.
 */
const estimateRiskLevel = async ({ defects, roadType, proximityContext }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Estimate the safety risk level for a road segment with:
      Defects: ${JSON.stringify(defects)}
      Road Type: ${roadType}
      Proximity context: ${proximityContext} (e.g., near school, hospital, heavy traffic)
      
      Return as JSON with:
      - 'risk_score': (0-100)
      - 'risk_level': (low, medium, high, critical)
      - 'explanation': (A brief technical justification)
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('AI Service Error (Risk):', error);
    throw error;
  }
};

/**
 * Law Lookup logic for DriveLegal.
 */
const lookupTrafficLaw = async ({ location, question, ruleContext }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Answer the traffic law query based on the location and context.
      Location: ${location}
      Question: ${question}
      Retrieved rules from DB: ${JSON.stringify(ruleContext)}
      
      Requirements:
      1. Explain the specific section and fine applicable.
      2. Keep it in plain English for a common citizen.
      3. Reference the specific legal code (e.g., MV Act Section 184).
      
      Return as JSON with: 'answer', 'references', 'fine_amount'.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('AI Service Error (Law):', error);
    throw error;
  }
};

/**
 * Emergency Triage explanation for RoadSoS.
 */
const explainSOSRecommendation = async ({ incident, facilities }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Explain why these facilities are recommended for this road incident.
      Incident: ${JSON.stringify(incident)}
      Nearby Facilities: ${JSON.stringify(facilities)}
      
      Provide a concise summary explaining the triage priority.
    `;

    const result = await model.generateContent(prompt);
    return { explanation: result.response.text() };
  } catch (error) {
    console.error('AI Service Error (SOS):', error);
    throw error;
  }
};

module.exports = {
  generateComplaint,
  estimateRiskLevel,
  lookupTrafficLaw,
  explainSOSRecommendation
};
