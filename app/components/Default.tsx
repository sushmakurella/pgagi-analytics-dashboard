"use client";

import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DefaultComponent = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white" : "bg-gray-200 text-gray-900"
      } transition duration-500`}
    >
      <div className={`text-center p-8 rounded-xl shadow-lg max-w-md
        ${
        isDarkMode ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900"
      }`}>
        <h1 className="text-3xl font-semibold mb-4">Welcome to QuickView!</h1>
        <p className="text-lg mb-6">
          This is your one-stop platform for weather, news, and stock market
          updates. You can toggle between light and dark modes to suit your
          preferences.
        </p>

        {/* Display the dark mode or light mode toggle button */}
        

        <div className="mt-8">
          <p className="text-md text-gray-500 dark:text-gray-400">
            Explore the latest updates with a by clicking signIn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultComponent;
