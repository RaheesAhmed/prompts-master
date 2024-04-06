"use client";

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
      const response = await axios.post('/api/batch', { prompts });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error in batch testing prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Batch Test Prompts</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        {prompts.map((prompt, index) => (
          <div key={index} className="flex gap-3 mb-2">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              value={prompt}
              onChange={(e) => handlePromptChange(index, e.target.value)}
              placeholder={`Prompt ${index + 1}`}
            />
            {prompts.length > 1 && (
              <button
                type="button"
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                onClick={() => setPrompts(prompts.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            onClick={handleAddPrompt}
          >
            Add Prompt
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test Prompts'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-10 p-6 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Batch Test Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-1">Prompt {index + 1}:</h3>
                <p className="bg-gray-100 p-3 rounded">{result.prompt}</p>
                <h3 className="font-semibold text-lg mt-3 mb-1">Response:</h3>
                <p className="bg-gray-100 p-3 rounded">{result.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


