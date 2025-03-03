import React from 'react';
import { Brain, Target, Award, Clock, PlayCircle } from 'lucide-react';

const Home = ({ onStart }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
      <div className="flex justify-center mb-6">
        <Brain className="w-16 h-16 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">DBMS Module 1 Quiz</h1>
      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
      >
        <PlayCircle className="w-6 h-6 mr-2" />
        Start Quiz
      </button>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
    <h3 className="font-semibold text-gray-800">{title}</h3>
  </div>
);

export default Home;
