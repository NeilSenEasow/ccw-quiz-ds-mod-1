import React, { useState, useEffect } from 'react';
import { Brain, Trophy, RotateCcw, PlayCircle, Target, Award, Clock, LightbulbIcon } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { QuizOption } from './components/QuizOption';
import type { QuizState, Question } from './types';
import questionsData from './data/questions.json';

function App() {
  const [showHome, setShowHome] = useState(true);
  const [questions] = useState<Question[]>(questionsData.questions);
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    showResults: false,
    isAnswered: false,
    selectedAnswer: null,
  });

  const handleStartQuiz = () => {
    setShowHome(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (state.isAnswered) return;

    const currentQuestion = questions[state.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    setState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      isAnswered: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, answerIndex],
    }));

    setTimeout(() => {
      if (state.currentQuestion === questions.length - 1) {
        setState((prev) => ({ ...prev, showResults: true }));
      } else {
        setState((prev) => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          isAnswered: false,
          selectedAnswer: null,
        }));
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      showResults: false,
      isAnswered: false,
      selectedAnswer: null,
    });
    setShowHome(true);
  };

  if (showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Brain className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Knowledge Quest</h1>
          <p className="text-lg text-gray-600 mb-8">Test your knowledge with our interactive quiz!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">10 Questions</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Instant Feedback</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Time Your Pace</h3>
            </div>
          </div>
          
          <button
            onClick={handleStartQuiz}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            Start Quiz
            <div className="absolute -inset-0.5 bg-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition"></div>
          </button>
        </div>
      </div>
    );
  }

  if (state.showResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {state.score}/{questions.length}
            </p>
            <p className="text-gray-600 mb-8">
              You got {state.score} questions correct out of {questions.length}!
            </p>
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[state.currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">Quiz Game</h1>
          </div>
          <div className="text-sm text-gray-500">
            Question {state.currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <ProgressBar
          current={state.currentQuestion + 1}
          total={questions.length}
        />

        <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`transition-all duration-500 ease-in-out ${state.isAnswered ? 'lg:translate-x-[-2rem]' : ''}`}>
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <QuizOption
                  key={index}
                  option={option}
                  index={index}
                  selected={state.selectedAnswer === index}
                  correct={
                    state.isAnswered
                      ? index === currentQuestion.correctAnswer
                      : null
                  }
                  disabled={state.isAnswered}
                  onSelect={() => handleAnswerSelect(index)}
                />
              ))}
            </div>
          </div>

          <div 
            className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-500 ease-in-out transform ${
              state.isAnswered 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-full opacity-0'
            }`}
          >
            {state.isAnswered && (
              <div className="space-y-4">
                <div className="flex items-center text-blue-600">
                  <LightbulbIcon className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Explanation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;