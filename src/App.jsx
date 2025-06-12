// App.js or wherever your routing is set up
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import RecipeFinder from './components/RecipeFinder';
import ChatWithChef from './components/ChatWithChef';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recipes" element={<RecipeFinder />} />
        <Route path="/chat" element={<ChatWithChef />} />
      </Routes>
    </Router>
  );
}

export default App;
