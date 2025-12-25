'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HELP_DATA, HELP_CATEGORIES, HelpArticle } from '@/data/help-data';

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    options?: HelpArticle[];
}

export default function HelpCenterPage() {
    // Initial bot message
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'Halo! Saya TokoBot, asisten virtual Tokova. Ada yang bisa saya bantu hari ini? Silakan pilih topik di bawah ini:',
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleCategoryClick = (category: string) => {
        // User message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: `Saya butuh bantuan tentang ${category}`
        };
        setMessages(prev => [...prev, userMsg]);
        setSelectedCategory(category);
        setIsTyping(true);

        // Find questions for this category
        const relevantQuestions = HELP_DATA.filter(item => item.category === category);

        // Bot response
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: `Baik, berikut adalah pertanyaan umum seputar ${category}. Pilih yang sesuai dengan masalah Anda:`,
                options: relevantQuestions
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const handleQuestionClick = (article: HelpArticle) => {
        // User message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: article.question
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Bot response
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: article.answer
            };
            setMessages(prev => [...prev, botMsg]);

            // Ask if helpful or needs more
            setTimeout(() => {
                const followUpMsg: ChatMessage = {
                    id: (Date.now() + 2).toString(),
                    sender: 'bot',
                    text: 'Apakah jawaban ini membantu? Atau ingin menanyakan hal lain?',
                };
                setMessages(prev => [...prev, followUpMsg]);
                setIsTyping(false);
                setSelectedCategory(null); // Reset to show categories again
            }, 800);

        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900">Tokova Help Center</h1>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online • AI Assistant
                            </p>
                        </div>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-500">
                        Exit Chat
                    </Link>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4">
                <div className="flex-1 space-y-6 pb-24">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}

                            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${msg.sender === 'user'
                                    ? 'bg-orange-500 text-white rounded-br-none'
                                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                                {msg.options && (
                                    <div className="mt-4 space-y-2">
                                        {msg.options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleQuestionClick(opt)}
                                                className="block w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-colors text-sm font-medium text-slate-700 hover:text-orange-700"
                                            >
                                                {opt.question}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center ml-3 mt-1 overflow-hidden">
                                    {/* Simple user avatar */}
                                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Categories / Input Area */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200">
                    <div className="max-w-3xl mx-auto">
                        {!selectedCategory ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto pb-2 sm:pb-0">
                                {HELP_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-95"
                                    >
                                        <span className="text-2xl mb-1">{cat.icon}</span>
                                        <span className="text-xs font-medium text-slate-700 whitespace-nowrap">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="w-full py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                ← Main Menu / Pilih Topik Lain
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
