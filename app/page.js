import Head from 'next/head';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Graph3D from './components/Graph3d';
import CustomCarousel from './components/CustomCarousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      <Head>
        <title>learnbackprop</title>
        <meta name="description" content="Learn backpropagation step by step" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div id="home" className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-4 md:px-12">
        <Hero />
        <div className="w-full md:w-1/2 h-[600px] flex items-center justify-center md:static absolute inset-0 z-10">
          <Graph3D />
        </div>
      </div>
      <div id="chapters" className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-black via-gray-900 to-blue">
        <CustomCarousel />
      </div>
    </div>
  );
}
