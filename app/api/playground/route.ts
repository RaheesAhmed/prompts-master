import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  try {
    const {
      model,
      systemMessage,
      userMessage,
      temperature,
      maxTokens,
      responseType
    } = await req.json();

    console.log('Request received:', {
      model,
      systemMessage,
      userMessage,
      temperature,
      maxTokens,
      responseType
    });

    const maxToken = parseInt(maxTokens);
    const temp = parseFloat(temperature);

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: temp,
      max_tokens: maxToken,
    });

    let formattedResponse;
    // Handle formatting based on responseType if necessary
    switch (responseType) {
      case 'json':
        formattedResponse = JSON.stringify(response, null, 2);
        break;
      // Add cases for other responseTypes if needed
      default:
        formattedResponse = response.choices[0].message.content;
    }

    return new NextResponse(JSON.stringify({ response: formattedResponse }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'An error occurred while processing your request.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
