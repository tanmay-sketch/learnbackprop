import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex justify-between space-x-12">
        <p className="mb-0">Tanmay Grandhisiri</p>
        <div className="flex space-x-8">
          <a
            href="https://www.linkedin.com/in/tanmay-grandhisiri/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-2xl hover:text-blue-500 transition-colors duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/tanmay-sketch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-2xl hover:text-gray-500 transition-colors duration-300"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
