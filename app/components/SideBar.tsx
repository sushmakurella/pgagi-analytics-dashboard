"use client";

import React, { useState } from "react";
import { FaCloud, FaNewspaper, FaChartLine } from "react-icons/fa";
import Weather from "./WeatherAPI";
import News from "./NewsAPI";
import Stocks from "./StocksAPI";

interface SidebarProps {
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const [activeComponent, setActiveComponent] = useState<string>("weather");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`w-1/5 p-4 sm:p-6 shadow-lg top-0 left-0 z-50 mt-2 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Weather Button */}
          <button
            onClick={() => setActiveComponent("weather")}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition duration-300 ${
              activeComponent === "weather"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
            }`}
          >
            <FaCloud
              className="text-xl sm:text-2xl md:text-3xl"
              aria-label="Weather Icon"
            />
            <span className="text-sm sm:text-lg md:text-xl font-semibold">
              Weather Forecast
            </span>
          </button>

          {/* News Button */}
          <button
            onClick={() => setActiveComponent("news")}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition duration-300 ${
              activeComponent === "news"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-white dark:hover:bg-green-600"
            }`}
          >
            <FaNewspaper
              className="text-xl sm:text-2xl md:text-3xl"
              aria-label="News Icon"
            />
            <span className="text-sm sm:text-lg md:text-xl font-semibold">
              News Updates
            </span>
          </button>

          {/* Stock Button */}
          <button
            onClick={() => setActiveComponent("stocks")}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition duration-300 ${
              activeComponent === "stocks"
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-600"
            }`}
          >
            <FaChartLine
              className="text-xl sm:text-2xl md:text-3xl"
              aria-label="Stocks Icon"
            />
            <span className="text-sm sm:text-lg md:text-xl font-semibold">
              Stock Forecast
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 ml-auto p-4 sm:p-6 h-screen overflow-y-auto no-scrollbar">
        {activeComponent === "weather" && <Weather isDarkMode={isDarkMode} />}
        {activeComponent === "news" && <News isDarkMode={isDarkMode} />}
        {activeComponent === "stocks" && <Stocks isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
};

export default Sidebar;
