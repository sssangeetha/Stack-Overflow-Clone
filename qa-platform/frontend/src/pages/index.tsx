import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { questionApi } from '@/services/api';

interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  vote_count: number;
  answer_count: number;
  view_count: number;
  username: string;
  created_at: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await questionApi.getAll();
      console.log('Loaded questions:', data);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Developer Q&A</h1>
          <Link href="/questions/ask">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Ask Question
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">All Questions</h2>
            <p className="text-gray-600 mt-1">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>

          {loading && (
            <div className="p-12 text-center text-gray-500">
              Loading questions...
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No questions yet. Be the first to ask!</p>
              <Link href="/questions/ask">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Ask Question
                </button>
              </Link>
            </div>
          )}

          {!loading && !error && questions.length > 0 && (
            <div className="divide-y">
              {questions.map((question) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Stats */}
                    <div className="flex flex-col items-center gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{question.vote_count || 0}</div>
                        <div className="text-gray-500">votes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{question.answer_count || 0}</div>
                        <div className="text-gray-500">answers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{question.view_count || 0}</div>
                        <div className="text-gray-500">views</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Link href={`/questions/${question.id}`}>
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer mb-2">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {question.body.substring(0, 200)}...
                      </p>
                      
                      {/* Tags */}
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span>asked by {question.username || 'Anonymous'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}