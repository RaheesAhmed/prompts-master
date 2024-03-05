import React from 'react';

const Header = () => {
  return (
    <nav className="bg-gray-100 pt-5 shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a className="font-bold text-xl text-gray-800 hover:text-gray-600 transition-colors" href="/">
          <span className="text-blue-500">Prompts</span>Master!
        </a>
        <div className="flex items-center space-x-4">
          <a href="/prompts" className="text-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg transition-all">Test Prompts</a>
          <a href="/prompts/analyze" className="text-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg transition-all">Analyze</a>
          <a href="/prompts/batch" className="text-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg transition-all">Batch Test</a>
          <a href="/prompts/variations" className="text-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg transition-all">Prompts Variations</a>
          <a href="/prompts/templates" className="text-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg transition-all">Prompts Templates</a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
