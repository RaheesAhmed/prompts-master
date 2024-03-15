"use client"

import { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

export default function Analyze() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/analyze-response', { text });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  let sentimentData;
  if (result && result.sentimentScores) {
    sentimentData = {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          label: 'Sentiment Score',
          data: [result.sentimentScores.positive, result.sentimentScores.neutral, result.sentimentScores.negative],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(201, 203, 207, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(201, 203, 207, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analyze Text</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter your prompt to analyze"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          type="submit"
          disabled={isLoading}
        >
          Analyze
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Analysis Result</h2>
          {sentimentData && (
            <div className="my-4">
              <Bar data={sentimentData} options={{ responsive: true }} />
            </div>
          )}
          <p>Keywords: {result.keywords.join(', ')}</p>
          <p>Topics: {result.topics.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
