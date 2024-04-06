import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getResponses(prompts) {
  try {
    const completions = await Promise.all(
      prompts.map((prompt) =>
        openai.chat.completions.create({
          model: "gpt-3.5-turbo-16k",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        })
      )
    );

    return completions.map(
      (completion) => completion.choices[0].message.content
    );
  } catch (error) {
    console.error("Error getting responses:", error);
    throw new Error("Error in OpenAI Completion");
  }
}


export  async function POST(req:NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompts } = await req.json();
console.log(prompts)
    const responses = await getResponses(prompts);
console.log(responses)

const results = prompts.map((prompt, index) => ({
  prompt,
  response: responses[index],
}));
    return new NextResponse(JSON.stringify({ results }), {
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