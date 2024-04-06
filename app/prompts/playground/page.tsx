'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [systemMessage, setSystemMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [maxToken, setmaxToken] = useState(50);
    const [responseType, setresponseType] = useState('text');



  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => setModels(data.modelIds));
  }, []);


  const setResponseType = (value) => {
    setresponseType(value);
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/playground', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        systemMessage: systemMessage,
        userMessage: userMessage,
        temperature: temperature,
        maxTokens: maxToken,
        responseType: responseType
      }),
    });
    const data = await res.json();
    setResponse(data.response);
  };


  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
        <div className="flex gap-2">
          <label htmlFor="modelSelect" className="p-2.5 block text-sm font-medium text-gray-900">Model:</label>
          <select
            id="modelSelect"
            className="p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setSelectedModel(e.target.value)}
            value={selectedModel}
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-900">Temperature:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-32"
          />
          <span className="text-sm font-medium text-gray-900">{temperature}</span>
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-900">Max Tokens:</label>
          <input
            type="input"
           
            value={maxToken}
            onChange={(e) => setmaxToken(e.target.value)}
            className="w-32"
          />
          <span className="text-sm font-medium text-gray-900">{maxToken}</span>
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-900">Format:</label>
          <select
            value={responseType}
            onChange={(e) => setResponseType(e.target.value)}
            className="p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
      
      </div>
      
      
      <div className="grid grid-cols-3 gap-4">
  {/* System Prompt Column */}
  <div className="p-6 border border-gray-300 rounded shadow">
    <label className="block mb-2 text-sm font-medium text-gray-900">System Prompt</label>
    <textarea
      className="block w-full p-2.5 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 h-48"
      placeholder="Input system message here"
      value={systemMessage}
      onChange={(e) => setSystemMessage(e.target.value)}
    />
  </div>

  {/* User Column */}
  <div className="p-6 border border-gray-300 rounded shadow">
    <label className="block mb-2 text-sm font-medium text-gray-900">User</label>
    <textarea
      className="block w-full p-2.5 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 h-48"
      placeholder="New Message"
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
    />
  </div>

  {/* Response Column */}
  <div className="p-6 border border-gray-300 rounded shadow">
    <label className="block mb-2 text-sm font-medium text-gray-900">Response</label>
    <div className="p-4 border border-dashed rounded h-48">{response}</div>
  </div>
</div>

<div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mt-4 mb-4"
          >
            Run
          </button>
        </div>
    </div>
  );
}