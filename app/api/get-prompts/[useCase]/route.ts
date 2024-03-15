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
  
  export default function handler(req, res) {
    if (req.method === "GET") {
      const { useCase } = req.query;
  
      if (!promptLibrary[useCase]) {
        return res.status(404).send("Use case not found in the prompt library.");
      }
  
      res.json(promptLibrary[useCase]);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  