"use client"

import { useState } from 'react';
import axios from 'axios';

export default function PromptVariations() {
  const [basePrompt, setBasePrompt] = useState('');
  const [variations, setVariations] = useState(['']);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVariation = () => {
    setVariations([...variations, '']);
  };

  const handleVariationChange = (index, value) => {
    const newVariations = [...variations];
    newVariations[index] = value;
    setVariations(newVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/test-prompt-variations', { basePrompt, variations });
      setResults(response.data);
    } catch (error) {
      console.error('Error testing prompt variations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Prompt Variations</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
          placeholder="Base Prompt"
        />
        {variations.map((variation, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            value={variation}
            onChange={(e) => handleVariationChange(index, e.target.value)}
            placeholder={`Variation ${index + 1}`}
          />
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-2"
          onClick={handleAddVariation}
        >
          Add Variation
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          disabled={isLoading}
        >
          Test Variations
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Variation Test Results</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">Prompt Variation {index + 1}:</h3>
              <p>{result.prompt}</p>
              <h3 className="font-bold">Response:</h3>
              <p>{result.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
