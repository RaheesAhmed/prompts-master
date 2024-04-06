import Sentiment from "sentiment";
import compromise from "compromise";
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
const sentimentAnalyzer = new Sentiment();

async function analyzeSentiment(text) {
  const result = sentimentAnalyzer.analyze(text);
  return result.score;
}

async function extractKeywords(text) {
  const doc = compromise(text);
  return doc.nouns().out("array");
}

async function categorizeTopic(text) {
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

export  async function POST(req:NextApiRequest, res:NextResponse) {
 
    const { text } = req.json();

    if (!text) {
      return NextResponse.json("Please provide text for analysis.");
    }

    try {
      const sentiment =await analyzeSentiment(text);
      const keywords =await extractKeywords(text);
      const topics =await categorizeTopic(text);

      return  NextResponse.json({
        sentiment,
        keywords,
        topics,
      });
    } catch (error) {
      console.error("Error analyzing response:", error);
      return new NextResponse("An error occurred while analyzing the response.");
    }
  
}
