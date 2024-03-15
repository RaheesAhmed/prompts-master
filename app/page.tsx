"use client"

import Head from 'next/head';

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-300">
      <Head>
        <title>PromptMaster: LLM Prompt Evaluation Tool</title>
        <meta name="description" content="Elevate Your LLM Prompts to Perfection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-text mb-8">
          Welcome to <span className="text-primary">PromptMaster!</span>
        </h1>

        <p className="text-lg text-center text-secondaryText mb-12">
          Elevate Your LLM Prompts to Perfection
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-cardbg p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-text">Prompt Evaluation</h2>
            <p className="text-secondaryText">Test your prompts with various LLMs, including GPT-3, GPT-4, and more.</p>
          </div>

          <div className="bg-cardbg p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-text">Performance Metrics</h2>
            <p className="text-secondaryText">Get detailed insights into the effectiveness of your prompts with our comprehensive metrics.</p>
          </div>

          <div className="bg-cardbg p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-text">Test Case Management</h2>
            <p className="text-secondaryText">Define and manage test cases to ensure your prompts cover all critical scenarios.</p>
          </div>

          <div className="bg-cardbg p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-text">Real-time Feedback</h2>
            <p className="text-secondaryText">Receive instant feedback on your prompts to make quick and informed adjustments.</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href='/prompts' className="bg-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90">Get Started</a>
        </div>
      </main>
    </div>
  );
}
