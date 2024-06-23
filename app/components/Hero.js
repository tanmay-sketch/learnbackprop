"use client"
import React from 'react';

export default function Hero() {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <div className="w-full md:w-1/2 flex items-center justify-center z-10 py-8 md:py-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center">Welcome to learnbackprop!</h1>
      </div>
    </div>
  );
}
