import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { message, userContext } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `You are a helpful AI assistant for Meatloaf, a platform that helps people build credit through rent payments and eventually achieve homeownership. You assist users with questions about credit building, rent reporting, homeownership milestones, and using the Meatloaf platform.

${userContext?.userType ? `The user is a ${userContext.userType}.` : ''}
${userContext?.name ? `Their name is ${userContext.name}.` : ''}
${userContext?.properties?.length ? `They have ${userContext.properties.length} properties listed.` : ''}
${userContext?.applications?.length ? `They have ${userContext.applications.length} rental applications.` : ''}

Be concise, friendly, and encouraging. Help users understand how to improve their credit score, navigate the homeownership journey, and make the most of the Meatloaf platform.`

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    })

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    const reply = textBlock?.text ?? "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
