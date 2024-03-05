"use client"

// pages/batch-test.js
import { useState } from 'react';
import axios from 'axios';

export default function BatchTest() {
  const [prompts, setPrompts] = useState(['']);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPrompt = () => {
    setPrompts([...prompts, '']);
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/batch-test-prompts', { prompts });
      setResults(response.data);
    } catch (error) {
      console.error('Error in batch testing prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Batch Test Prompts</h1>
      <form onSubmit={handleSubmit}>
        {prompts.map((prompt, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            value={prompt}
            onChange={(e) => handlePromptChange(index, e.target.value)}
            placeholder={`Prompt ${index + 1}`}
          />
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-2"
          onClick={handleAddPrompt}
        >
          Add Prompt
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          disabled={isLoading}
        >
          Test Prompts
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Batch Test Results</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">Prompt {index + 1}:</h3>
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
