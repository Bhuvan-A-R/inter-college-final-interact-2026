import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import bgImage from "../components/images/GATBGIMG.png";

export default function NotFoundPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${bgImage.src})`
      }}
    >
      
      {/* Dark/color overlay to make text pop over the photo */}
      <div className="absolute inset-0 bg-gat-midnight/30 pointer-events-none" />

      {/* Main Content Card */}
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-lg rounded-3xl border border-gat-blue/10 shadow-2xl p-8 md:p-16 text-center relative z-10 flex flex-col items-center">
        
        {/* Logos Container */}
        {/* <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-10 w-full">
          <div className="relative w-48 h-24 md:w-64 md:h-32">
            <Image 
              src="/gat-logos/gatsketch.png" 
              alt="GAT Sketch Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden md:block w-px h-24 bg-gat-blue/20"></div>
          <div className="relative w-48 h-24 md:w-64 md:h-32">
            <Image 
              src="/gat-logos/INTERACT2K26.png" 
              alt="Interact 2K26 Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div> */}

        {/* 404 Text */}
        <div className="mb-4 relative">
          <h1 className="text-8xl md:text-[9rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-gat-midnight via-gat-blue to-gat-blue/70">
            404
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gat-midnight mb-4">
          Oops! You've drifted into the unknown.
        </h2>
        
        <p className="text-lg text-gat-steel max-w-lg mx-auto mb-8">
          The page you're looking for might have been moved, renamed, or is temporarily out of service during the festival preparations.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-widest uppercase text-white transition-all bg-gat-midnight rounded-full hover:bg-gat-blue hover:shadow-lg hover:-translate-y-1 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-gat-blue focus:ring-offset-2"
        >
          Return to Home
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

      </div>
    </div>
  );
}
