"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PromptLibrary() {
  const [useCase, setUseCase] = useState("");
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    if (useCase) {
      axios
        .get(`http://localhost:8000/get-prompts/${useCase}`)
        .then((response) => setPrompts(response.data))
        .catch((error) => console.error("Error fetching prompts:", error));
    }
  }, [useCase]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prompt Library</h1>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
      >
        <option value="">Select a Use Case</option>
        <option value="Travel Planning">Travel Planning</option>
        <option value="Product Reviews">Product Reviews</option>
        <option value="Story Writing">Story Writing</option>
      </select>

      {prompts.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Prompts for {useCase}</h2>
          <ul className="list-disc pl-5">
            {prompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
