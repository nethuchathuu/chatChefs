import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import chefGif from './assets/chefGif.gif'; // Adjust if needed

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center text-white text-center px-4 overflow-hidden pt-32">

      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-4 drop-shadow-lg flex items-center gap-2"
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          🍽️
        </motion.span>
        Welcome to ChatChefs
      </motion.h1>

      {/* Typewriter Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="text-lg mb-8 max-w-md"
      >
        <Typewriter
          words={[
            'Add your ingredients...',
            'Get delicious recipes!',
            'Chat with your cooking assistant!',
          ]}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={60}
          deleteSpeed={40}
          delaySpeed={1600}
        />
      </motion.p>

      {/* Animated Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="flex gap-4 mb-8 flex-wrap justify-center"
      >
        <button
          onClick={() => navigate('/recipes')}
          className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transform transition-all text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md duration-300"
        >
          🍽️ Find Recipe
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-green-500 hover:bg-green-600 hover:scale-105 transform transition-all text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md duration-300"
        >
          💬 Chat with Chef
        </button>
      </motion.div>

      {/* Responsive Animated Chef GIF */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-4 right-4"
      >
        <img
          src={chefGif}
          alt="Chef Animation"
          className="w-64 md:w-[400px] h-auto object-contain"
        />
      </motion.div>
    </div>
  );
}

export default LandingPage;
