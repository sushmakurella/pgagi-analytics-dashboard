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

const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=c8d9d76f8fb548f180507e1555d0a8de`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch articles.');
      }

      // Filter out articles without images
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
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">News Categories</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg shadow-md ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
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
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
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
                  >
                    {article.title}
                  </a>
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {article.description}
                </p>
                <p className="text-gray-500 text-xs">
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

export default HomePage;
