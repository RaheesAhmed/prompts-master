import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    const { basePrompt, variations } = req.json();

    if (!basePrompt || !variations || variations.length === 0) {
        return NextResponse.json({ error: 'Please provide a base prompt and a list of variations.' }, { status: 400 });
    }

    const variedPrompts = generatePromptVariations(basePrompt, variations);
    const responses = await Promise.all(
      variedPrompts.map((prompt) => getResponse(prompt))
    );

    const results = variedPrompts.map((prompt, index) => {
      return { prompt, response: responses[index] };
    });

    return NextResponse.json({ results });
}


function generatePromptVariations(basePrompt, variations) {
    return variations.map((variation) => {
      return basePrompt.replace("{{variation}}", variation);
    });
  }