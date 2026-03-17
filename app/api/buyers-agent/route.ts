import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { messages, propertyContext, buyerContext } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const propertySection = propertyContext?.address
      ? `
CURRENT PROPERTY BEING ANALYZED:
- Address: ${propertyContext.address}
- List Price: ${propertyContext.listPrice ? `$${Number(propertyContext.listPrice).toLocaleString()}` : 'Not provided'}
- Days on Market: ${propertyContext.daysOnMarket ?? 'Not provided'}
- Bedrooms: ${propertyContext.bedrooms ?? 'Not provided'}
- Bathrooms: ${propertyContext.bathrooms ?? 'Not provided'}
- Year Built: ${propertyContext.yearBuilt ?? 'Not provided'}
- Property Type: ${propertyContext.propertyType ?? 'Not provided'}
- HOA: ${propertyContext.hoa ? `$${propertyContext.hoa}/month` : 'None / Not provided'}
- Estimated traditional buyer agent commission (2.5%): ${propertyContext.listPrice ? `$${Math.round(Number(propertyContext.listPrice) * 0.025).toLocaleString()}` : 'N/A'}
`
      : 'No property details provided yet. Ask the buyer to fill in property details on the left panel.'

    const buyerSection = buyerContext?.budget
      ? `
BUYER PROFILE:
- Budget: $${Number(buyerContext.budget).toLocaleString()}
- Name: ${buyerContext.name ?? 'Not provided'}
`
      : ''

    const systemPrompt = `You are an expert AI buyers agent for Meatloaf, a platform helping people achieve homeownership. Your job is to help buyers save money, negotiate smart, and avoid costly mistakes — acting as their personal buyers agent at zero cost to them (saving them the typical 2.5–3% commission).

${propertySection}
${buyerSection}

YOUR EXPERTISE:
- Offer strategy: recommend offer prices based on days on market, list price trends, and market conditions
- Negotiation: what to ask for (closing cost credits, repairs, appliances, rate buydowns, price reductions)
- Red flags: identify warning signs in listings (flipped properties with cosmetic-only updates, high DOM, unusual disclosures)
- True cost analysis: help buyers understand mortgage payments, taxes, insurance, HOA, and maintenance costs
- Inspection guidance: which contingencies to keep, what to inspect carefully
- Closing cost credits: how to negotiate seller concessions
- Commission savings: remind buyers they're saving thousands vs. a traditional agent

OFFER STRATEGY GUIDELINES (use these as starting points):
- DOM 0–14 days: market is hot, offer at or near list price, minimal contingencies
- DOM 15–30 days: slight negotiation room, offer 1–3% below list
- DOM 31–60 days: offer 3–5% below list, ask for closing cost credits
- DOM 60+ days: significant negotiation leverage, offer 5–10% below list, ask for repairs + credits
- Price reductions in history: additional 1–2% negotiation room per reduction

TONE: Confident, direct, and on the buyer's side. Be specific with numbers. Don't hedge excessively — give real recommendations like a seasoned agent would. Keep responses concise and actionable.`

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    const reply = textBlock?.text ?? "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error('Buyers agent API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
