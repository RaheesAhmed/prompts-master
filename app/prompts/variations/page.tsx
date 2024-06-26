"use client";

import { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';

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
      const response = await axios.post('http://localhost:3000/api/variations', { basePrompt, variations });
      setResults(response.data);
    } catch (error) {
      console.error('Error testing prompt variations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response) => {
    return response.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form and other content remain unchanged */}
      <h1 className="text-2xl font-bold">Test Prompt Variations</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="basePrompt" className="block font-semibold">Base Prompt:</label>
        <textarea
          id="basePrompt"
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>

        <label htmlFor="variations" className="block font-semibold mt-4">Variations:</label>
        {variations.map((variation, index) => (
          <div key={index} className="relative">
            <textarea
              value={variation}
              onChange={(e) => handleVariationChange(index, e.target.value)}
              className="w-full p-2 border rounded"
              required
            ></textarea>
            {index === variations.length - 1 && (
              <button
                type="button"
                onClick={handleAddVariation}
                className="absolute top-0 right-0 p-2"
              >
                <FaPlus />
              </button>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white font-semibold p-2 rounded flex items-center"
        >
          {isLoading ? (
            <TailSpin className="animate-spin mr-2" />
          ) : (
            <FaCheck className="mr-2" />
          )}
          Test Variations
        </button>
      </form>

      

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Variation Test Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow">
                <h3 className="font-bold">Prompt Variation {index + 1}:</h3>
                <p className="bg-gray-100 p-2 rounded mb-4">{result.prompt}</p>
                <h3 className="font-bold mt-2">Response:</h3>
                <div className="bg-blue-100 p-2 rounded">
                  {formatResponse(result.response)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
