import React from 'react';
import { useNavigate } from 'react-router-dom';
import chefGif from './assets/chefGif.gif'; // Make sure this path is correct

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
      <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">🍽️ Welcome to ChatChefs</h1>
      <p className="text-lg mb-8 max-w-md">
        Your smart cooking companion. Add your ingredients and let us show you magic recipes!
      </p>

      {/* 🔸 Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate('/recipes')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md transition duration-300"
        >
          🍽️ Find Recipe
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-md transition duration-300"
        >
          💬 Chat with Chef
        </button>
      </div>

      {/* 🔸 Chef GIF at the bottom right */}
      <div className="absolute bottom-4 right-4">
        <img
          src={chefGif}
          alt="Chef Animation"
          className="w-[400px] h-auto object-contain"
        />
      </div>
    </div>
  );
}

export default LandingPage;
