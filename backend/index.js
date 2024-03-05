import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import Cors from "cors";
import Sentiment from "sentiment";
import compromise from "compromise";

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

const app = express();
const sentimentAnalyzer = new Sentiment();
app.use(Cors());
app.use(express.json());
app.use(express.static("public"));
const responseCache = {};

function analyzeSentiment(text) {
  const result = sentimentAnalyzer.analyze(text);
  return result.score;
}

function extractKeywords(text) {
  const doc = compromise(text);
  return doc.nouns().out("array");
}

function categorizeTopic(text) {
  const topics = [
    "Technology",
    "Health",
    "Environment",
    "Education",
    "Politics",
  ];
  const doc = compromise(text);
  const foundTopics = topics.filter((topic) => doc.has(topic));
  return foundTopics.length > 0 ? foundTopics : ["General"];
}

app.post("/analyze-response", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Please provide text for analysis.");
  }

  try {
    const sentiment = analyzeSentiment(text);
    const keywords = extractKeywords(text);
    const topics = categorizeTopic(text);

    res.json({
      sentiment,
      keywords,
      topics,
    });
  } catch (error) {
    console.error("Error analyzing response:", error);
    res.status(500).send("An error occurred while analyzing the response.");
  }
});

const promptLibrary = {
  "Travel Planning": [
    "Suggest a travel itinerary for a 5-day trip to {{location}}.",
    "What are the top attractions to visit in {{location}}?",
    "Provide a packing list for a trip to {{location}} in {{season}}.",
  ],
  "Product Reviews": [
    "Write a review for {{product}} highlighting its features and performance.",
    "Compare {{product1}} and {{product2}} in terms of durability and price.",
  ],
  "Story Writing": [
    "Start a story with the sentence: {{openingSentence}}",
    "Write a short story that includes the following elements: {{elements}}",
  ],
};

app.get("/get-prompts/:useCase", (req, res) => {
  const { useCase } = req.params;

  if (!promptLibrary[useCase]) {
    return res.status(404).send("Use case not found in the prompt library.");
  }

  res.json(promptLibrary[useCase]);
});

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
app.post("/batch-test-prompts", async (req, res) => {
  const { prompts } = req.body;

  if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
    return res
      .status(400)
      .send("Please provide an array of prompts for batch testing.");
  }

  try {
    const responses = await getResponses(prompts);

    const results = prompts.map((prompt, index) => ({
      prompt,
      response: responses[index],
    }));

    res.json(results);
  } catch (error) {
    console.error("Error in batch testing prompts:", error);
    res.status(500).send("An error occurred while batch testing prompts.");
  }
});

async function getResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting response:", error);
    throw new Error("Error in OpenAI Completion");
  }
}

async function getImprovedPrompt(originalPrompt, systemMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Improve this prompt: ${originalPrompt}` },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error improving prompt:", error);
    throw new Error("Error in OpenAI Completion");
  }
}

function generatePromptVariations(basePrompt, variations) {
  return variations.map((variation) => {
    return basePrompt.replace("{{variation}}", variation);
  });
}

app.post("/test-prompt-variations", async (req, res) => {
  const { basePrompt, variations } = req.body;

  if (!basePrompt || !variations || variations.length === 0) {
    return res
      .status(400)
      .send("Please provide a base prompt and a list of variations.");
  }

  try {
    const variedPrompts = generatePromptVariations(basePrompt, variations);
    const responses = await Promise.all(
      variedPrompts.map((prompt) => getResponse(prompt))
    );

    const results = variedPrompts.map((prompt, index) => {
      return { prompt, response: responses[index] };
    });

    res.json(results);
  } catch (error) {
    console.error("Error testing prompt variations:", error);
    res.status(500).send("An error occurred while testing prompt variations.");
  }
});

app.post("/improve-prompt", async (req, res) => {
  const originalPrompt = req.body.originalPrompt;
  console.log("Original Prompt:", originalPrompt);

  //if prompt is empty send error message to client side kindly enter a prompt first
  if (originalPrompt == "") {
    return res.status(400).send("Please enter a prompt.");
  }

  // Check cache
  if (responseCache[originalPrompt]) {
    return res.json(responseCache[originalPrompt]);
  }
  if (!originalPrompt) {
    return res.status(400).send("Invalid request. Please provide a prompt.");
  }

  try {
    const systemMessages = [
      // Version 1: Detailed and Specific
      "You are a detailed-oriented assistant. Your task is to improve this prompt by adding depth and specificity. Focus on providing comprehensive and precise information, ensuring thoroughness and factual accuracy. Enhance the prompt with relevant details, examples, and explanations that deepen understanding of the topic.",
      // Version 2: Engaging and Detailed
      "You are a versatile and skilled assistant, adept at refining and enhancing prompts. Your objective is to take the provided prompt and elevate it to its fullest potential. Focus on making the prompt clearer, more informative, and engaging. Ensure that the improved prompt provides a comprehensive and precise query or instruction, encouraging detailed and thoughtful responses. While maintaining factual accuracy and relevance, inject a degree of creativity or intrigue where appropriate to make the prompt not only informative but also captivating. Adapt your approach based on the nature of the prompt, whether it requires technical detail, narrative depth, or creative flair, and tailor it to evoke rich and insightful responses.",
    ];

    const originalResponse = await getResponse(originalPrompt); // Get response for the original prompt

    const improvedPrompts = await Promise.all(
      systemMessages.map((message) =>
        getImprovedPrompt(originalPrompt, message)
      )
    );

    const improvedResponses = await Promise.all(
      improvedPrompts.map(
        (improvedPrompt) => getResponse(improvedPrompt) // Get responses for the improved prompts
      )
    );

    // Cache the response
    responseCache[originalPrompt] = {
      originalPrompt,
      originalResponse,
      improvedPrompts,
      improvedResponses,
    };

    res.json(responseCache[originalPrompt]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
