import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import RecipeFinder from './components/RecipeFinder';
import ChatWithChef from './components/ChatWithChef';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/recipes" element={<RecipeFinder />} />
      <Route path="/chat" element={<ChatWithChef />} />
    </Routes>
  );
}

export default App;
