"use client";
import React from 'react';

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full flex flex-col items-center justify-center z-20 py-8 md:py-0 px-4 md:px-16">
        <h1 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-center">
          Welcome to learnbackprop!
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-center">
          Learn backpropagation visually and interactively
        </h3>
      </div>
    </div>
  );
}
