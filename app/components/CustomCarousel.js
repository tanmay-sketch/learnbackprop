"use client";
import { useState, useEffect } from 'react';
import Card from './Card';

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);

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
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center pt-20">
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl p-4 bg-gray-800 bg-opacity-50 rounded-full z-50"
      >
        &#10094;
      </button>
      <div className="w-full h-full flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            } flex items-center justify-center`}
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
