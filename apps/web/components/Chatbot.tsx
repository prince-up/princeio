'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
    id: number;
    text: string;
    sender: 'bot' | 'user';
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hi there! 👋 Welcome to PrinceIO.', sender: 'bot' },
        { id: 2, text: 'How can I help you today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate Support Response
        setTimeout(() => {
            let replyText = "I see! Could you check our Guidelines page for more details? Or contact support@princeio.com.";

            const lower = userMsg.text.toLowerCase();
            if (lower.includes('download') || lower.includes('install')) {
                replyText = "You can download the Windows app by clicking the 'Get App' button in the navbar! ⬇️";
            } else if (lower.includes('connect') || lower.includes('session')) {
                replyText = "To connect, launch the app on the host PC, copy the Session Code, and paste it into the Viewer (web or app). 🔗";
            } else if (lower.includes('price') || lower.includes('cost')) {
                replyText = "PrinceIO is currently Free for everyone! 🎉";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                                🤖
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">PrinceIO Support</h3>
                                <p className="text-indigo-100 text-xs">Always here to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-900/50 space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-700 text-slate-200 rounded-tl-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-700 text-slate-400 p-3 rounded-2xl rounded-tl-sm text-xs flex gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-100">●</span>
                                    <span className="animate-bounce delay-200">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s'
                }}
                className={isOpen ? 'rotate-90' : ''}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
    );
}
