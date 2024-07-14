"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <nav className={`fixed w-full top-0 left-0 z-50 p-4 transition-colors duration-300 ${isScrolled ? 'bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-400 transition-colors duration-300">
          learnbackprop
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-gray-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/#chapters" className="hover:text-gray-400 transition-colors duration-300">
            Chapters
          </Link>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className={`md:hidden absolute top-16 right-0 w-full text-white z-30 transition-colors duration-300 ${isScrolled ? 'bg-gray-900 bg-opacity-90 backdrop-blur-md' : 'bg-black bg-opacity-75'}`}>
          <Link href="/" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">
            Home
          </Link>
          <Link href="/#chapters" className="block px-4 py-2 hover:bg-gray-800 transition-colors duration-300">
            Chapters
          </Link>
        </div>
      )}
    </nav>
  );
}
