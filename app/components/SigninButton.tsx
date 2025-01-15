"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaMoon, FaSun } from "react-icons/fa";
import AboutComponent from "./About";
import DefaultComponent from "./Default";
import Sidebar from "./SideBar";
const Navbar = () => {
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // State to toggle AboutComponent visibility

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout); // Toggle visibility of AboutComponent
  };
  if(session && session.user)
  console.log(session.user.image);

  return (
    <div className={`${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}>
      {/* Navbar */}
      <nav
        className={`flex items-center justify-between px-6 py-4 shadow-lg ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-teal-100 to-teal-50 text-gray-900"
        }`}
      >
        {/* Always Display QuickView */}
        <h1 className="text-2xl font-bold">QuickView</h1>

        {/* Right Side */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* About Button */}
          <button
            onClick={toggleAbout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            About
          </button>

          {/* User Authentication */}
          {session && session.user ? (
            <div className="relative z-50">
              {/* Profile Picture */}
              <img
                src={
                  "https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-4 px-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        "https://banner2.cleanpng.com/20180327/ssq/kisspng-computer-icons-user-profile-avatar-profile-5ab9e3b05772c0.6947928615221318883582.jpg"
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <p className="mt-2 font-semibold">{session.user.name}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => signIn()}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </nav>

      {/* About Component - Below Navbar, shown when the button is clicked */}
      {showAbout && <AboutComponent isDarkMode={isDarkMode} />}
      {/* Conditionally Render Sidebar When Signed In */}
      {session && session.user ? (
        <Sidebar isDarkMode={isDarkMode} />
      ):<DefaultComponent isDarkMode={isDarkMode} />}
    </div>
  );
};

export default Navbar;
