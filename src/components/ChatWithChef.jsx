import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChatWithChef() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👨‍🍳 Hello! I’m your ChatChef. Ask me anything about cooking!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
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
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '❌ Sorry, I couldn’t understand that.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
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

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 bg-orange-200 shadow-md">
        <h1 className="text-3xl font-bold text-orange-700">🍳 ChatWithChef</h1>
        <Link to="/" className="text-orange-800 font-semibold hover:underline">Home</Link>
      </nav>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden px-4 py-6">
        <div
          ref={chatRef}
          className="h-[calc(100vh-200px)] overflow-y-auto bg-white rounded-xl shadow-inner p-4 space-y-4"
        >
          {messages.map((msg, i) => (
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
          ))}

          {isTyping && (
            <div className="text-left text-gray-500 italic animate-pulse">👨‍🍳 Chef is typing...</div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 w-full bg-orange-100 px-4 py-3 shadow-inner">
        <div className="max-w-3xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a cooking question..."
            className="flex-grow p-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            rows={1}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold px-5 py-2 rounded-lg transition shadow"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWithChef;
