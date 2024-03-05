"use client";

import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './prompts.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/improve-prompt', { originalPrompt: prompt },
        { headers: { 'Content-Type': 'application/json' } }
        );
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      
      <form id="promptForm" onSubmit={handleSubmit}>
     
        <div className="flex items-center bg-white border shadow-lg rounded-lg overflow-hidden p-4 space-x-4">
          <textarea
            className="w-full h-12 p-2 text-gray-700 rounded-lg focus:outline-none"
            placeholder="Type your message here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button type="submit" className="text-blue-500 hover:text-blue-700 focus:outline-none">
            <FontAwesomeIcon icon={faPaperPlane} size="2x" />
          </button>
        </div>
        
      </form>
      {isLoading ? (
        <div className="skeleton-loader">Loading...</div>
      ) : (
        result && (
          <div className="flex flex-wrap justify-center">
          <div className="result-card w-full md:w-1/3 p-2">
            <h5>Original Prompt and Response</h5>
            <div className="chat-container">
              <div className="chat-message prompt-message">{result.originalPrompt}</div>
              <div className="chat-message response-message">{result.originalResponse}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center w-full md:w-2/3">
            {result.improvedPrompts.map((improvedPrompt:any, index:any) => (
              <div key={index} className="result-card improved-section w-full md:w-1/2 p-2">
                <h5>Improved Prompt and Response v{index + 1}</h5>
                <div className="chat-container">
                  <div className="chat-message prompt-message">{improvedPrompt}</div>
                  <div className="chat-message response-message">{result.improvedResponses[index]}</div>
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
