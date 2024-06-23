"use client";
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`w-full p-4 flex justify-between items-center transition-colors duration-300 ${isScrolled ? 'bg-black bg-opacity-75' : 'bg-transparent'}`}>
      <div className="text-2xl font-bold pl-6 hover:text-gray-400 transition-colors duration-300">learnbackprop</div>
      <div className="hidden md:flex space-x-8 pr-6">
        <a href="#home" className="hover:text-gray-400 transition-colors duration-300">Home</a>
        <a href="#chapters" className="hover:text-gray-400 transition-colors duration-300">Chapters</a>
      </div>
      <div className="md:hidden flex items-center pr-4">
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-full bg-black bg-opacity-75 text-white">
          <a href="#home" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">Home</a>
          <a href="#about" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">About</a>
          <a href="#features" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">Features</a>
          <a href="#contact" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">Contact</a>
        </div>
      )}
    </nav>
  );
}
