import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import chefGif from './assets/chefGif.gif'; // adjust path if needed

function LandingPage() {
  const navigate = useNavigate();

  // Expanded list of food emojis
  const emojis = ['🍅', '🥕', '🥦', '🍳', '🍗', '🍔', '🥐', '🍎', '🍕', '🥗'];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900 via-orange-800/50 to-orange-500 blur-3xl opacity-30 z-0"></div>

      {/* Moving Emojis */}
      {emojis.map((emoji, index) => {
  const isLeftToRight = index % 2 === 0;
  const isDiagonal = index % 3 === 0;
  const startX = isLeftToRight ? '-100%' : '2000%'; // extended X movement
  const endX = isLeftToRight ? '2000%' : '-100%';   // extended X movement
  const startY = isDiagonal ? '0%' : '30%';        // higher starting Y range
  const endY = isDiagonal
    ? (isLeftToRight ? '100%' : '0%')              // deeper Y travel
    : '70%';
  const duration = 8 + (index % 4) * 2;

  return (
    <motion.div
      key={index}
      className="absolute text-3xl md:text-5xl z-0"
      initial={{ x: startX, y: startY }}
      animate={{
        x: endX,
        y: endY,
        opacity: [0.4, 0.9, 0.4],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: index * 0.2,
      }}
      style={{
        top: `${(index % 10) * 10}%`, // more vertical positions
      }}
    >
      {emoji}
    </motion.div>
  );
})}


      {/* Steam Animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0">
        <div className="w-16 h-16 bg-gradient-to-t from-white/10 to-white/0 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-2 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6 drop-shadow-lg flex items-center gap-3 text-orange-500"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >
            🍽️
          </motion.span>
          Welcome to ChatChefs
        </motion.h1>

        {/* Typewriter */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
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

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex gap-4 mb-8 flex-wrap justify-center"
        >
          <button
            onClick={() => navigate('/recipes')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md transform transition-transform duration-300 hover:scale-105"
          >
            🍽️ Find Recipe
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md transform transition-transform duration-300 hover:scale-105"
          >
            💬 Chat with Chef
          </button>
        </motion.div>

        {/* Animated GIF */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: 1,
            x: [100, -100, 100], // Wider movement from right to left and back
          }}
          transition={{
            delay: 1.6,
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0,
          }}
          className="absolute bottom-2 right-2 w-32 md:w-72 lg:w-80"
        >
          <img
            src={chefGif}
            alt="Chef Animation"
            className="w-full h-auto object-contain"
            style={{ animation: 'auto 1ms infinite' }} // Force GIF to play by resetting frame
          />
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;