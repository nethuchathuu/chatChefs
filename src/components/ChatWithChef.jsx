import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { FaTrash } from 'react-icons/fa';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-700">Oops! Something went wrong.</h1>
          <p className="text-gray-600 mt-2">Please try refreshing the page or starting a new chat.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function ChatWithChef() {
  const { transcript, isListening, startListening } = useSpeechRecognition();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  });
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👨‍🍳 Hello! I’m your ChatChef. Ask me anything about cooking!' },
  ]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Track which session to delete
  const chatRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const startNewChat = () => {
    const updatedSessions = [...sessions];
    if (messages.length > 1) {
      updatedSessions[currentSessionIndex] = messages;
    }
    const newSession = [{ sender: 'bot', text: '👨‍🍳 Hello again! Ready to cook something new?' }];
    setSessions([newSession, ...updatedSessions]);
    setCurrentSessionIndex(0);
    setMessages(newSession);
  };

  const loadSession = (index) => {
    setCurrentSessionIndex(index);
    const sessionMessages = Array.isArray(sessions[index]) ? sessions[index] : [{ sender: 'bot', text: '👨‍🍳 Hello! I’m your ChatChef. Ask me anything about cooking!' }];
    setMessages(sessionMessages);
  };

  const deleteSession = (index) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);

    if (index === currentSessionIndex) {
      if (updatedSessions.length > 0) {
        const newIndex = Math.min(index, updatedSessions.length - 1);
        setCurrentSessionIndex(newIndex);
        setMessages(Array.isArray(updatedSessions[newIndex]) ? updatedSessions[newIndex] : []);
      } else {
        setCurrentSessionIndex(0);
        setMessages([{ sender: 'bot', text: '👨‍🍳 Hello! I’m your ChatChef. Ask me anything about cooking!' }]);
      }
    } else if (index < currentSessionIndex) {
      setCurrentSessionIndex(currentSessionIndex - 1);
      setMessages(Array.isArray(sessions[currentSessionIndex - 1]) ? sessions[currentSessionIndex - 1] : []);
    } else if (currentSessionIndex >= updatedSessions.length) {
      setCurrentSessionIndex(updatedSessions.length - 1);
      setMessages(Array.isArray(updatedSessions[updatedSessions.length - 1]) ? updatedSessions[updatedSessions.length - 1] : []);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '❌ Sorry, I couldn’t understand that.';
      const updatedMessages = [...newMessages, { sender: 'bot', text: botReply }];
      setMessages(updatedMessages);

      const updatedSessions = [...sessions];
      updatedSessions[currentSessionIndex] = updatedMessages;
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDeleteConfirm = (index) => {
    setShowDeleteConfirm(index);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleDeleteConfirmYes = () => {
    if (showDeleteConfirm !== null) {
      deleteSession(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-orange-50 flex flex-col">
        {/* Nav */}
        <nav className="flex justify-between items-center px-6 py-4 bg-orange-200 shadow-md">
          <h1 className="text-3xl font-bold text-orange-700">🍳 ChatWithChef</h1>
          <Link to="/" className="text-orange-800 font-semibold hover:underline">Home</Link>
        </nav>

        {/* Body with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-orange-100 border-r border-orange-200 p-4 overflow-y-auto">
            <button
              onClick={startNewChat}
              className="w-full mb-4 py-2 px-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg shadow"
            >
              + New Chat
            </button>

            <h2 className="text-lg font-semibold mb-2 text-orange-700">Previous Chats</h2>
            <ul className="space-y-2">
              {sessions.map((session, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => loadSession(idx)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                      idx === currentSessionIndex ? 'bg-orange-300 font-bold' : 'bg-white hover:bg-orange-200'
                    }`}
                  >
                    <span>Chat #{idx + 1}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConfirm(idx);
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-hidden px-4 py-6">
              <div
                ref={chatRef}
                className="h-[calc(100vh-200px)] overflow-y-auto bg-white rounded-xl shadow-inner p-4 space-y-4"
              >
                {Array.isArray(messages) ? messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-orange-200 text-gray-800 rounded-br-none'
                          : 'bg-gray-100 text-gray-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )) : null}

                {isTyping && (
                  <div className="text-left text-gray-500 italic animate-pulse">👨‍🍳 Chef is typing...</div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 w-full bg-orange-100 px-4 py-3 shadow-inner">
              <div className="max-w-4xl mx-auto flex items-center gap-2">
                {/* Mic Button on the left */}
                <button
                  onClick={startListening}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-l-lg transition"
                  type="button"
                >
                  🎤 {isListening ? 'Listening...' : 'Speak'}
                </button>

                {/* Textarea input */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a cooking question..."
                  className="flex-grow p-3 rounded-none border-t border-b border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  rows={1}
                />

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold px-5 py-2 rounded-r-lg transition shadow"
                  type="button"
                >
                  ➤
                </button>
              </div>
            </div>
          </main>

          {/* Delete Confirmation Notification */}
          {showDeleteConfirm !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-80 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                  <span className="text-4xl">👨‍🍳</span>
                </div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Chef’s Kitchen Alert!</h3>
                <p className="text-gray-600 mb-4">Are you sure you want to toss this recipe chat into the localhost bin? This action cannot be undone!</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeleteConfirmYes}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleDeleteCancel}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ChatWithChef;