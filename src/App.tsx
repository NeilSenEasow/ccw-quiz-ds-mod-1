import React, { useState, useEffect } from 'react';
import { Brain, Trophy, RotateCcw, PlayCircle, Target, Award, Clock } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { QuizOption } from './components/QuizOption';
import type { QuizState, Question } from './types';

function App() {
  const initialState: QuizState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    showResults: false,
    isAnswered: false,
    selectedAnswer: null,
  };

  const [state, setState] = useState<QuizState>(initialState);
  const [showHome, setShowHome] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/src/data/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

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
    }, 1500);
  };

  const resetQuiz = () => {
    setState(initialState);
    setShowHome(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white lg:pr-12">
            <div className="flex items-center mb-8">
              <Brain className="w-12 h-12 lg:w-16 lg:h-16 text-white mr-4" />
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold">Quiz Master</h1>
            </div>
            <p className="text-xl lg:text-2xl xl:text-3xl mb-8 text-blue-100">
              Test your knowledge with our interactive quiz game. Challenge yourself with questions from various topics!
            </p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-blue-200 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl">10 Questions</h3>
                  <p className="text-blue-200">Carefully curated</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-200 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl">Instant Results</h3>
                  <p className="text-blue-200">Get feedback instantly</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-200 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl">Quick & Fun</h3>
                  <p className="text-blue-200">5 minutes challenge</p>
                </div>
              </div>
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-blue-200 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg lg:text-xl">Track Progress</h3>
                  <p className="text-blue-200">See your score</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHome(false)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg lg:text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <PlayCircle className="w-6 h-6 mr-2" />
              Start Now
              <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform group-hover:translate-y-0" />
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/10 p-6 rounded-xl"
                      style={{ opacity: 1 - i * 0.2 }}
                    >
                      <div className="h-4 w-3/4 bg-white/20 rounded mb-4" />
                      <div className="space-y-2">
                        {[...Array(4)].map((_, j) => (
                          <div
                            key={j}
                            className="h-10 bg-white/10 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
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

        <div className="my-8">
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
      </div>
    </div>
  );
}

export default App;