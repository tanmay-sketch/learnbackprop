"use client";
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomCarousel from './components/CustomCarousel';
import Footer from './components/Footer';
import MLPAnimation from './components/MLPAnimation';  // Import the MLP animation component

export default function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            window.history.pushState({}, '', `#${id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      <Navbar />
      <section id="home" className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-4 md:px-12">
        <Hero />
        <div className="w-full md:w-1/2 h-[800px] flex items-center justify-center md:static absolute inset-0 z-10">
          <MLPAnimation />
        </div>
      </section>
      <section id="chapters" className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-black via-gray-900 to-blue">
        <CustomCarousel />
      </section>
      <Footer />
    </div>
  );
}
