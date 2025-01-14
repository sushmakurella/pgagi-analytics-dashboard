// app/page.tsx
import React from 'react';

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

const HomePage = async () => {
  //const apiKey = 'c8d9d76f8fb548f180507e1555d0a8de'; // Use environment variable for security
  //const url = `https://newsapi.org/v2/everything?apiKey=${apiKey}`; // No filters applied
  const url='https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=c8d9d76f8fb548f180507e1555d0a8de';
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();
  //console.log(data);

  if (data.status !== 'ok') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error fetching data: {data.message}</p>
      </div>
    );
  }

  const articles: Article[] = data.articles;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">News Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h2>
              <p className="text-gray-600 text-sm mb-4">{article.description}</p>
              <p className="text-gray-500 text-xs">
                Published by {article.source.name} on{' '}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
