import { NextResponse } from 'next/server'
import { generateReportSummary } from '@/lib/ai/gemini'

export async function POST(req: Request) {
  try {
    const { issueType, description } = await req.json()

    if (!issueType || !description) {
      return NextResponse.json({ error: 'Issue type and description are required' }, { status: 400 })
    }

    const analysis = await generateReportSummary(issueType, description)

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to analyze report' }, { status: 500 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
