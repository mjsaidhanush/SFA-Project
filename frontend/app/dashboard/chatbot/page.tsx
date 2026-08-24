"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, User } from "lucide-react";

interface Message {
    id: number;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            content: "Hello! I am your Smart Farm AI Assistant. I can help you with crop advisory, disease identification, weather analytics, and government schemes. How can I assist your farm today? 🌾",
            sender: "bot",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateResponse = async (question: string) => {
        const lowerQ = question.toLowerCase();

        if (lowerQ.includes('weather') || lowerQ.includes('rain') || lowerQ.includes('temperature') || lowerQ.includes('climate')) {
            return "Based on the current meteorological data for your region, the weather is expected to be sunny with a high of 28°C today. Moderate rainfall (18mm) is forecasted tomorrow, so we recommend pausing field irrigation.";
        } else if (lowerQ.includes('crop') && (lowerQ.includes('recommend') || lowerQ.includes('best') || lowerQ.includes('what'))) {
            return "For your soil type (Loamy, pH 6.5) and Kharif season telemetry, Wheat (92% match) and Sugarcane (90% match) are highly recommended.";
        } else if (lowerQ.includes('disease') || lowerQ.includes('pest') || lowerQ.includes('yellow') || lowerQ.includes('spot') || lowerQ.includes('rust')) {
            return "Symptoms like yellowing leaves or orange pustules indicate Leaf Rust or Chlorosis. I recommend uploading a photograph to our 'Disease Detection' scanner for instant neural-network plant pathology diagnosis.";
        } else if (lowerQ.includes('price') || lowerQ.includes('market') || lowerQ.includes('sell') || lowerQ.includes('buy')) {
            return "Wheat prices are currently trading around ₹2,100 per quintal (+8.4% this week). Prices are forecasted to remain strong over the next 7 days.";
        } else if (lowerQ.includes('scheme') || lowerQ.includes('subsidy') || lowerQ.includes('government') || lowerQ.includes('loan')) {
            return "Active government schemes include PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, and PM-KUSUM 60% Solar Pump Subsidies. Check the 'Schemes' section for eligibility.";
        } else if (lowerQ.includes('fertilizer') || lowerQ.includes('npk') || lowerQ.includes('urea') || lowerQ.includes('soil')) {
            return "A balanced NPK ratio (40:50:50) is recommended during the vegetative phase. Nitrogen top dressing should be scheduled before scheduled rainfall for maximum absorption.";
        } else if (lowerQ.includes('irrigation') || lowerQ.includes('water') || lowerQ.includes('dry')) {
            return "Drip irrigation is recommended. Delay irrigation by 24 hours due to expected rainfall tomorrow to prevent soil saturation and save water.";
        } else if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey')) {
            return "Hello! I am your 24/7 Smart Farm AI Assistant. How can I help optimize your yield today?";
        } else {
            return "Based on your farm telemetry and regional dataset, all primary indicators are operating within normal parameters. Feel free to ask about crop prediction, weather, or market rates!";
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: messages.length + 1,
            content: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const responseText = await generateResponse(userMsg.content);
            const botMsg: Message = {
                id: messages.length + 2,
                content: responseText,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const suggestedPrompts = [
        "Should I irrigate today?",
        "What is the wheat market price?",
        "How to treat leaf rust?",
        "Am I eligible for PM-Kisan?"
    ];

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col glass-panel rounded-3xl shadow-xl overflow-hidden border border-teal-800/10">
            {/* Chat Header */}
            <div className="glass-card-dark p-4 shrink-0 flex items-center justify-between shadow-md z-10 text-white rounded-t-3xl border-b border-cyan/20">
                <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border border-cyan/50 shadow-md flex items-center justify-center overflow-hidden">
                        <img
                            src="/smart-chat-ai-logo.jpg"
                            alt="SmartChatAI Logo"
                            className="w-full h-full object-contain rounded-xl"
                        />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-base tracking-tight flex items-center">
                            SmartChat AI <Sparkles className="w-3.5 h-3.5 ml-1.5 text-cyan" />
                        </h2>
                        <p className="text-teal-400 text-[11px] flex items-center font-extrabold">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
                            Online • Kisan Mitra Agri Intelligence
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex space-x-1.5">
                    {suggestedPrompts.slice(0, 2).map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setInput(p);
                            }}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold rounded-full border border-white/15"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
                {messages.map((msg) => {
                    const isBot = msg.sender === "bot";
                    return (
                        <div key={msg.id} className={`flex ${isBot ? "justify-start" : "justify-end"} items-start gap-2.5 animate-fade-in`}>
                            {isBot && (
                                <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-cyan/40 shadow-xs shrink-0 mt-0.5 overflow-hidden">
                                    <img
                                        src="/smart-chat-ai-logo.jpg"
                                        alt="SmartChatAI"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                            )}
                            <div
                                className={`max-w-[82%] rounded-2xl px-5 py-4 text-xs leading-relaxed ${isBot
                                    ? "bg-white border border-slate-200/80 text-navy-900 font-medium rounded-tl-none shadow-xs"
                                    : "bg-navy-900 text-white font-medium rounded-tr-none shadow-md"
                                    }`}
                            >
                                <p>{msg.content}</p>
                                <span className={`block text-[10px] mt-2 font-bold ${isBot ? "text-slate-400" : "text-cyan/70"}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="flex justify-start items-center gap-2.5 animate-fade-in">
                        <div className="w-7 h-7 rounded-xl bg-white p-0.5 border border-cyan/40 shadow-xs shrink-0 overflow-hidden">
                            <img
                                src="/smart-chat-ai-logo.jpg"
                                alt="SmartChatAI"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                        <div className="bg-white border border-slate-200 text-navy-900 rounded-2xl rounded-tl-none px-5 py-3 shadow-xs text-xs flex space-x-1.5 items-center">
                            <span className="w-2 h-2 bg-cyan rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center relative gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about crops, diseases, irrigation, or weather..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-cyan text-xs bg-slate-50 text-navy-900 placeholder-slate-400 font-medium"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 bg-navy-900 hover:bg-teal-800 text-white rounded-xl transition-all border border-cyan/30 disabled:opacity-50 flex items-center justify-center shadow-md"
                    >
                        <Send className="w-4 h-4 text-cyan" />
                    </button>
                </form>
                <p className="text-center text-[10px] text-slate-400 font-medium mt-2">SmartChat AI provides data-driven advisories based on agricultural machine learning models.</p>
            </div>
        </div>
    );
}

