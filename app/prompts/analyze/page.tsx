"use client"

import { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { TailSpin } from 'react-loader-spinner';

interface SentimentScores {
  positive: number;
  neutral: number;
  negative: number;
}

interface Result {
  sentiment: number;
  keywords: string[];
  topics: string[];
  emotions: string[];
  entities: {
    organizations: string[];
    people: string[];
    places: string[];
  };
}

export default function Analyze() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/analyze', { text });
      console.log(response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analyze Text</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-500"
          placeholder="Enter your prompt to analyze"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          type="submit"
          disabled={isLoading}
        >
          Analyze
        </button>
      </form>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <TailSpin color="#3B82F6" height={30} width={30} />
        </div>
      )}
      {result && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Keywords</h2>
            <ul className="list-disc pl-5 space-y-1">
              {result.keywords.map((keyword, index) => (
                <li key={index} className="text-gray-700">{keyword}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Topics</h2>
            <ul className="list-disc pl-5 space-y-1">
              {result.topics.map((topic, index) => (
                <li key={index} className="text-gray-700">{topic}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Emotions</h2>
            <ul className="list-disc pl-5 space-y-1">
              {result.emotions.map((emotion, index) => (
                <li key={index} className="text-gray-700">{emotion}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Entities</h2>
      <div>
        <h3 className="font-semibold">Organizations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {result.entities.organizations.map((org, index) => (
            <li key={index} className="text-gray-700">{org}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">People</h3>
        <ul className="list-disc pl-5 space-y-1">
          {result.entities.people.map((person, index) => (
            <li key={index} className="text-gray-700">{person}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Places</h3>
        <ul className="list-disc pl-5 space-y-1">
          {result.entities.places.map((place, index) => (
            <li key={index} className="text-gray-700">{place}</li>
          ))}
        </ul>
      </div>
    </div>
          
        </div>
      </div>
      )}
    </div>
  );
}
