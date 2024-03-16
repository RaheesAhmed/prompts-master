"use client";

import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './prompts.css';

interface Result {
  improvedPrompts: string[];
  improvedResponses: string[];
  originalPrompt: string;
  originalResponse: string;
}

export default function Home() {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const variables = userPrompt.match(/{{(.*?)}}/g)?.map((v) => v.slice(2, -2)) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/improve-prompt', { originalPrompt: userPrompt },
        { headers: { 'Content-Type': 'application/json' } }
        );
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariableClick = (variable) => {
    const value = window.prompt(`Enter value for ${variable}:`);
    if (value) {
      setUserPrompt(userPrompt.replace(new RegExp(`{{${variable}}}`, 'g'), value));
    }
  };

  return (
    <div className="container mt-5">
      <form id="promptForm" onSubmit={handleSubmit}>
        <div className="flex items-center bg-white border shadow-lg rounded-lg overflow-hidden p-4 space-x-4">
          <textarea
            className="w-full h-12 p-2 text-gray-700 rounded-lg focus:outline-none"
            placeholder="Type your message here..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          ></textarea>
          <button type="submit" className="text-blue-500 hover:text-blue-700 focus:outline-none">
            <FontAwesomeIcon icon={faPaperPlane} size="2x" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {[...new Set(variables)].map((variable, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer"
              onClick={() => handleVariableClick(variable)}
            >
              {variable}
            </span>
          ))}
        </div>
      </form>
      {isLoading ? (
        <div className="skeleton-loader">Loading...</div>
      ) : (
        result && (
          <div className="flex flex-wrap justify-center mt-4">
            <div className="result-card w-full md:w-1/3 p-2 bg-white shadow-lg rounded-lg overflow-hidden">
              <h5 className="font-bold text-lg mb-2">Original Prompt and Response</h5>
              <div className="chat-container">
                <div className="chat-message prompt-message bg-gray-100 p-2 rounded">{result.originalPrompt}</div>
                <div className="chat-message response-message bg-blue-100 p-2 rounded mt-2">{result.originalResponse}</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center w-full md:w-2/3">
              {result.improvedPrompts.map((improvedPrompt, index) => (
                <div key={index} className="result-card improved-section w-full md:w-1/2 p-2 bg-white shadow-lg rounded-lg overflow-hidden m-2">
                  <h5 className="font-bold text-lg mb-2">Improved Prompt and Response v{index + 1}</h5>
                  <div className="chat-container">
                    <div className="chat-message prompt-message bg-gray-100 p-2 rounded">{improvedPrompt}</div>
                    <div className="chat-message response-message bg-blue-100 p-2 rounded mt-2">{result.improvedResponses[index]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
