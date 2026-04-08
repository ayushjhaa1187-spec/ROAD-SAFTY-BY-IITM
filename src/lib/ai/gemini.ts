import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export async function generateReportSummary(issueType: string, description: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
      You are an AI assistant for RoadWatch, a civic road safety platform.
      A citizen has reported a road issue.
      
      Issue Type: ${issueType}
      User Description: ${description}
      
      Tasks:
      1. Generate a professional "Official Complaint Summary" (max 3 sentences).
      2. Suggest a severity level based on the description (low, medium, high, critical).
      3. Identify the likely responsible government department (e.g., Public Works Department, Municipal Corporation, Traffic Police).
      
      Return the response in JSON format:
      {
        "summary": "...",
        "suggested_severity": "...",
        "responsible_department": "..."
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from potential markdown formatting
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch (error) {
    console.error('Gemini AI Error:', error)
    return null
  }
}
