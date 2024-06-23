import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Graph3D from './components/Graph3d';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      <Navbar />
      <div className="relative flex flex-col md:flex-row items-center justify-center min-h-screen">
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center z-10 py-8 md:py-0 md:static px-8 md:px-16">
          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold text-left relative md:static">
            Welcome to learnbackprop!
          </h1>
          <p className="mt-4 text-sm sm:text-md md:text-lg lg:text-xl text-center">
            Learn backpropagation visually and interactively
          </p>
        </div>
        <div className="w-full md:w-1/2 h-[600px] flex items-center justify-center md:static absolute inset-0">
          <Graph3D />
        </div>
      </div>
    </div>
  );
}
