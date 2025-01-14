"use client";

import React from "react";

// Define the props type for AboutComponent
interface AboutComponentProps {
  isDarkMode: boolean;
}

const AboutComponent: React.FC<AboutComponentProps> = ({ isDarkMode }) => {
  return (
    <div
      className={`py-12 px-6 sm:px-12 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl font-extrabold text-center ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          About QuickView
        </h2>
        <p
          className={`mt-4 text-lg text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-700"
          }`}
        >
          QuickView is a comprehensive dashboard offering quick access to vital
          information on weather updates, news trends, and stock market data. It
          is designed for ease of use and to keep you informed at all times.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Weather Dashboard */}
          <div
            className={`rounded-lg p-6 shadow-xl transform transition-all duration-500 hover:scale-105 ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-blue-100 text-gray-800 hover:bg-blue-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-teal-300" : "text-blue-800"
              }`}
            >
              Weather Dashboard
            </h3>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Get real-time weather data from across the globe. Stay updated
              with temperature, humidity, and other essential metrics in one
              glance.
            </p>
          </div>

          {/* News API */}
          <div
            className={`rounded-lg p-6 shadow-xl transform transition-all duration-500 hover:scale-105 ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-yellow-100 text-gray-800 hover:bg-yellow-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-pink-500" : "text-yellow-800"
              }`}
            >
              News API
            </h3>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Stay informed with the latest headlines and news articles from
              multiple trusted sources. Keep track of what's happening around
              the world.
            </p>
          </div>

          {/* Stocks Dashboard */}
          <div
            className={`rounded-lg p-6 shadow-xl transform transition-all duration-500 hover:scale-105 ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-green-100 text-gray-800 hover:bg-green-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-yellow-200" : "text-green-800"
              }`}
            >
              Stocks Dashboard
            </h3>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Monitor live stock prices and market trends. Make better investment
              decisions with real-time stock data.
            </p>
          </div>
        </div>

        {/* About Website Section */}
        <div
          className={`mt-12 text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-700"
          }`}
        >
          <p className="text-lg">
            QuickView is designed to be a one-stop platform for all your vital
            information needs. From weather to stocks and news, we've got you
            covered!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
