import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ListModels() {
  const list = await openai.models.list();
  const modelIds = list.data.map(model => model.id); // Extract model IDs
  return modelIds;
}

export async function GET(req: NextRequest) {
  const modelIds = await ListModels();
  console.log(modelIds);
  return NextResponse.json({ modelIds }); // Return the model IDs as JSON
}
