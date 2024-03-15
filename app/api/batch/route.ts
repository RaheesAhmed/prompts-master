import  getResponses from "@/app/api/test/route.ts"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
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
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
