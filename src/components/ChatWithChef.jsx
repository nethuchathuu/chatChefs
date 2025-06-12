// ChatWithChef.jsx
import React, { useState } from 'react';

function ChatWithChef() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I’m your ChatChef 👨‍🍳 Ask me anything about cooking!' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful and friendly cooking assistant.' },
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await response.json();
      const botMessage = {
        sender: 'bot',
        text: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4 text-orange-600">Chat with Chef 🤖</h1>
      <div className="border p-4 rounded-lg h-[400px] overflow-y-auto bg-white space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-orange-200' : 'bg-gray-100'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a cooking question..."
          className="flex-grow p-2 border rounded-l-md"
        />
        <button onClick={sendMessage} className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWithChef;
