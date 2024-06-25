"use client";
import { useState, useEffect } from 'react';
import Card from './Card';

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [transitionDirection, setTransitionDirection] = useState(''); // State to track transition direction

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const response = await fetch('/chapters.json');
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        } else {
          console.error('Failed to load chapters.json');
        }
      } catch (error) {
        console.error('Error loading chapters.json', error);
      }
    };

    loadChapters();
  }, []);

  const nextSlide = () => {
    setTransitionDirection('next');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setTransitionDirection('prev');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center pt-20 overflow-hidden">
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl p-4 bg-gray-800 bg-opacity-50 rounded-full z-50"
      >
        &#10094;
      </button>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex ? 'translate-x-0' :
              (transitionDirection === 'next' && index === (currentIndex + 1) % slides.length) ? 'translate-x-full' :
              (transitionDirection === 'prev' && index === (currentIndex - 1 + slides.length) % slides.length) ? '-translate-x-full' :
              (transitionDirection === 'next' && index === (currentIndex - 1 + slides.length) % slides.length) ? '-translate-x-full' :
              (transitionDirection === 'prev' && index === (currentIndex + 1) % slides.length) ? 'translate-x-full' :
              'hidden'
            } flex items-center justify-center`}
            style={{
              transform: `translateX(${index === currentIndex ? 0 : (index > currentIndex ? 100 : -100)}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <Card 
              chapterNumber={index + 1} // Derive chapter number from index
              chapterTitle={slide.chapterTitle} 
              chapterDescription={slide.chapterDescription}
              topics={slide.topics}
            />
          </div>
        ))}
      </div>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl p-4 bg-gray-800 bg-opacity-50 rounded-full z-50"
      >
        &#10095;
      </button>
    </div>
  );
};

export default CustomCarousel;
