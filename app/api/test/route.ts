import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getImprovedPrompt(originalPrompt, systemMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Improve this prompt: ${originalPrompt}` },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw new Error('Error in OpenAI Completion');
  }
}

async function getResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting response:', error);
    throw new Error('Error in OpenAI Completion');
  }
}

export  async function POST(req, res) {
  
    const { originalPrompt } = await req.json();
    if (!originalPrompt) {
      return new NextResponse('Invalid request. Please provide a prompt.', { status: 400 });
    }

    try {
      const systemMessages = [
        // Version 1: Detailed, Specific, and Comprehensive
        "You are an assistant with a keen eye for detail. Your primary task is to refine this prompt by infusing it with additional depth and specificity. Strive to provide exhaustive and accurate information, underlining the importance of thoroughness and factual correctness. Enhance the prompt by weaving in pertinent details, examples, and explanations that not only enrich the understanding of the topic but also anchor the discussion in concrete information. Your goal is to transform the prompt into a meticulously crafted query that leaves no room for ambiguity, thereby facilitating a well-rounded and informed response.",
  
        // Version 2: Engaging, Detailed, and Creatively Enhanced
        "You are a multifaceted and skilled assistant, recognized for your ability to refine and amplify prompts. Your mission is to revamp the given prompt, pushing it towards its maximum potential. Concentrate on rendering the prompt clearer, more enlightening, and irresistibly engaging. Guarantee that the improved prompt presents a query or instruction that is both comprehensive and precise, stimulating detailed and reflective answers. While upholding factual accuracy and relevance, sprinkle elements of creativity or an intriguing twist where fitting to transform the prompt into a beacon of both information and interest. Depending on the prompt's inherent requirements—be it technical precision, narrative richness, or a splash of creative zest—customize your enhancement to summon deep and enlightening responses.",
      ];

      const originalResponse = await getResponse(originalPrompt);

      const improvedPrompts = await Promise.all(
        systemMessages.map((message) => getImprovedPrompt(originalPrompt, message))
      );

      const improvedResponses = await Promise.all(
        improvedPrompts.map((improvedPrompt) => getResponse(improvedPrompt))
      );

      return new NextResponse(
        JSON.stringify({
          originalPrompt,
          originalResponse,
          improvedPrompts,
          improvedResponses,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error:', error);
      return new NextResponse('An error occurred while processing your request.', { status: 500 });
    }
  
}
