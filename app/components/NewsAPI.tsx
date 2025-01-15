'use client';

import React, { useState, useEffect } from 'react';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface NewsAPIProps {
  isDarkMode: boolean;
}

const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

const NewsAPI: React.FC<NewsAPIProps> = ({ isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY?? "";
      console.log(NEWS_API_KEY+" hhhh");
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch articles.');
      }

      const articlesWithImages = data.articles.filter(
        (article: Article) => article.urlToImage
      );
      setArticles(articlesWithImages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategory);
  }, [selectedCategory]);

  return (
    <div
      className={`min-h-screen py-8 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <h1 className="text-4xl font-bold text-center mb-8">News Categories</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ${
              selectedCategory === category
                ? isDarkMode
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center">
          <p>Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md overflow-hidden flex flex-col transition duration-300 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold mb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    {article.title}
                  </a>
                </h2>
                <p className="text-sm mb-4">
                  {article.description}
                </p>
                <p className="text-xs">
                  Published by {article.source.name} on{' '}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center">
          <p>No articles found for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default NewsAPI;
