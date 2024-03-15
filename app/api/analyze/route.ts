import Sentiment from "sentiment";
import compromise from "compromise";

const sentimentAnalyzer = new Sentiment();

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

export default async function handler(req, res) {
  if (req.method === "POST") {
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
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
