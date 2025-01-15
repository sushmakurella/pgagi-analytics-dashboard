"use client";

import React from "react";

const DefaultComponent = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-500`}
    >
      <div className="text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 max-w-md">
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
