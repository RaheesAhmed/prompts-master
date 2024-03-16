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

function detectEmotions(text) {
  // Simple emotion detection based on keywords
  const emotions = {
    happy: ["happy", "joy", "glad", "excited"],
    sad: ["sad", "depressed", "unhappy", "sorrow"],
    angry: ["angry", "mad", "furious", "rage"],
    surprised: ["surprised", "amazed", "shocked", "astonished"],
    fear: ["fear", "scared", "terrified", "anxious"],
  };

  const detectedEmotions = [];
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }

  return detectedEmotions.length > 0 ? detectedEmotions : ["neutral"];
}

function extractEntities(text) {
  const doc = compromise(text);
  return {
    people: doc.people().out("array"),
    places: doc.places().out("array"),
    organizations: doc.organizations().out("array"),
  };
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
    const emotions = detectEmotions(text);
    const entities = extractEntities(text);

    res.json({
      sentiment,
      keywords,
      topics,
      emotions,
      entities,
    });
  } catch (error) {
    console.error("Error analyzing response:", error);
    res.status(500).send("An error occurred while analyzing the response.");
  }
});

const promptLibrary = {
  "Travel Planning": [
    "Suggest a detailed itinerary for a 7-day trip to {{location}}, including accommodations, dining, and transportation options.",
    "List the top 5 must-visit attractions in {{location}} and explain why they are notable.",
    "Provide a comprehensive packing list for a two-week stay in {{location}} during {{season}}, considering local weather and cultural norms.",
    "Recommend the best modes of transportation within {{location}} for tourists, including cost and convenience factors.",
    "Outline a day-by-day travel itinerary for {{location}} that includes both popular and off-the-beaten-path attractions.",
  ],
  "Product Reviews": [
    "Write an in-depth review of {{product}}, focusing on its specifications, usability, and comparison with similar products.",
    "Evaluate {{product1}} versus {{product2}} in terms of features, user experience, and overall value for money.",
    "Summarize customer feedback on {{product}}, highlighting common praises and concerns.",
    "Provide a detailed analysis of the cost versus benefits for purchasing {{product}}, including a long-term outlook.",
    "Craft a comparative review of {{product1}}, {{product2}}, and {{product3}}, ranking them in terms of performance, price, and reliability.",
  ],
  "Story Writing": [
    "Begin a story with the sentence: {{openingSentence}}, and develop a plot that revolves around a mystery.",
    "Compose a short story incorporating the following elements: {{elements}}, with a focus on a dramatic climax and resolution.",
    "Write a compelling story opener using {{openingSentence}}, and introduce a conflict within the first three sentences.",
    "Create a narrative that includes {{elements}}, ensuring that each element is crucial to the story's progression and outcome.",
    "Draft a story starting with {{openingSentence}} that explores themes of redemption and forgiveness, including a surprising twist.",
  ],
  "Essay Writing": [
    "Write an essay on the impact of social media on mental health, discussing both positive and negative effects.",
    "Compose an argumentative essay on the topic of {{topic}}, presenting both sides of the argument and supporting your stance with evidence.",
    "Discuss the role of technology in modern education, highlighting its benefits and potential drawbacks.",
    "Analyze the impact of climate change on {{region}} and propose sustainable solutions to mitigate its effects.",
    "Write a persuasive essay on the importance of {{topic}} in today's society, providing compelling reasons and real-life examples.",
  ],
  "Code Review": [
    "Conduct a code review for the following code snippet, identifying potential bugs, inefficiencies, and areas for improvement.",
    "Review the code for {{project}}, focusing on its structure, readability, and adherence to best practices.",
    "Evaluate the performance of the code snippet in terms of speed, memory usage, and scalability.",
    "Identify security vulnerabilities in the code and propose measures to enhance its resilience against potential threats.",
    "Assess the codebase for {{project}} and suggest refactoring opportunities to enhance maintainability and extensibility.",
  ],
  "Interview Preparation": [
    "Prepare a list of common interview questions for the role of {{jobTitle}}, along with suggested responses and talking points.",
    "Craft a compelling elevator pitch for a candidate applying for the position of {{jobTitle}}, emphasizing their unique skills and experiences.",
    "Create a mock interview scenario for the role of {{jobTitle}}, including both technical and behavioral questions.",
    "Develop a structured response to the question: 'Tell me about yourself' tailored to the role of {{jobTitle}}.",
    "Compile a list of industry-specific questions to assess a candidate's knowledge and expertise in the field of {{industry}}.",
  ],
  "Academic Research": [
    "Conduct a literature review on the topic of {{researchTopic}}, summarizing key findings and identifying research gaps.",
    "Propose a research methodology for investigating the impact of {{variable}} on {{outcome}} in the context of {{industry}}.",
    "Analyze the existing data on {{researchTopic}} and present a statistical overview of the trends and patterns observed.",
    "Develop a research survey to gather insights on {{researchTopic}} from a diverse sample population.",
    "Write an abstract for a research paper on {{researchTopic}}, outlining the objectives, methodology, and expected contributions.",
  ],
  "Code Generation": [
    "Generate a semantic HTML and CSS component for a {{component}} with {{features}}.",
    "Create a RESTful API using Node.js to manage {{resource}} with CRUD operations.",
    "Develop a Python script to automate the extraction of data from {{source}} and save it to {{format}}.",
  ],
  "Creative Writing": [
    "Write a poem inspired by the theme of {{theme}}, using vivid imagery and metaphorical language.",
    "Compose a short story set in a dystopian future where {{scenario}} has become a reality.",
    "Craft a dialogue between two characters who are at odds with each other, exploring their conflicting perspectives and emotions.",
  ],
  "Web Development": [
    "Design a responsive web page layout using Flexbox that adapts to {{devices}}.",
    "Implement dynamic content loading in a React app to improve performance for {{contentType}}.",
  ],
  "Social Media Management": [
    "Create a content calendar for {{platform}} outlining the types of posts, frequency, and target audience for each.",
    "Develop a social media marketing strategy to promote {{product}} and engage with potential customers.",
  ],
  "Marketing Copywriting": [
    "Write a compelling tagline for {{product}} that captures its unique value proposition in a concise and memorable manner.",
    "Craft a persuasive product description for {{product}} that highlights its key features and benefits.",
  ],
  "Data Analysis": [
    "Analyze the dataset on {{topic}} and identify trends, outliers, and correlations to derive actionable insights.",
    "Create visualizations to present the findings of the data analysis on {{topic}} in an accessible and informative manner.",
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
      // Version 1: Detailed, Specific, and Comprehensive
      "You are an assistant with a keen eye for detail. Your primary task is to refine this prompt by infusing it with additional depth and specificity. Strive to provide exhaustive and accurate information, underlining the importance of thoroughness and factual correctness. Enhance the prompt by weaving in pertinent details, examples, and explanations that not only enrich the understanding of the topic but also anchor the discussion in concrete information. Your goal is to transform the prompt into a meticulously crafted query that leaves no room for ambiguity, thereby facilitating a well-rounded and informed response.",

      // Version 2: Engaging, Detailed, and Creatively Enhanced
      "You are a multifaceted and skilled assistant, recognized for your ability to refine and amplify prompts. Your mission is to revamp the given prompt, pushing it towards its maximum potential. Concentrate on rendering the prompt clearer, more enlightening, and irresistibly engaging. Guarantee that the improved prompt presents a query or instruction that is both comprehensive and precise, stimulating detailed and reflective answers. While upholding factual accuracy and relevance, sprinkle elements of creativity or an intriguing twist where fitting to transform the prompt into a beacon of both information and interest. Depending on the prompt's inherent requirements—be it technical precision, narrative richness, or a splash of creative zest—customize your enhancement to summon deep and enlightening responses.",
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
