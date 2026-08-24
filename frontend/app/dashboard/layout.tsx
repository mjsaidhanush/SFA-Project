"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Sprout,
    CloudRain,
    ShieldAlert,
    ShoppingBag,
    FileText,
    Bot,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    Sparkles,
    ChevronDown,
    Send,
    TrendingUp
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string }>({
        name: "Sai Dhanush MJ",
        role: "farmer"
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
        { sender: 'ai', text: "Welcome to Smart Farm Assistant! I can help you with crop prediction, disease identification, weather analytics, and market prices. How can I assist your farm today?" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        try {
            if (typeof window === "undefined") return;

            let token = localStorage.getItem("token");
            let storedUser = localStorage.getItem("user");

            if (!token || !storedUser) {
                const defaultUser = {
                    name: "Sai Dhanush MJ",
                    email: "farmer@smartfarm.com",
                    role: "farmer"
                };
                token = "mock_smart_farm_token_123";
                storedUser = JSON.stringify(defaultUser);
                localStorage.setItem("token", token);
                localStorage.setItem("user", storedUser);
            }

            let parsedUser = JSON.parse(storedUser);

            if (parsedUser && parsedUser.name) {
                if (parsedUser.name.toLowerCase().includes("xsxsxssai") || parsedUser.name.toLowerCase().includes("google")) {
                    parsedUser.name = "Sai Dhanush MJ";
                    localStorage.setItem("user", JSON.stringify(parsedUser));
                }
                setUser(parsedUser);
            }
        } catch (e) {
            console.error("Error reading stored user:", e);
        }
    }, [router]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: "Overview", href: "/dashboard", sectionId: "overview", icon: LayoutDashboard },
        { name: "Crop Prediction", href: "/dashboard#crop-prediction", sectionId: "crop-prediction", icon: Sprout },
        { name: "Weather", href: "/dashboard#weather", sectionId: "weather", icon: CloudRain },
        { name: "Disease Detection", href: "/dashboard#disease-detection", sectionId: "disease-detection", icon: ShieldAlert },
        { name: "Market", href: "/dashboard#market", sectionId: "market", icon: TrendingUp },
        { name: "Marketplace", href: "/dashboard#marketplace", sectionId: "marketplace", icon: ShoppingBag },
        { name: "Schemes", href: "/dashboard#schemes", sectionId: "schemes", icon: FileText },
    ];

    if (user?.role && user.role.toLowerCase() === 'admin') {
        navLinks.push({ name: "Admin Portal", href: "/dashboard/admin", sectionId: "admin", icon: ShieldCheck });
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleSendMessage = (textToSend?: string) => {
        const text = textToSend || inputMessage;
        if (!text.trim()) return;

        setChatMessages(prev => [...prev, { sender: 'user', text }]);
        if (!textToSend) setInputMessage("");

        setTimeout(() => {
            let aiReply = "Based on your regional soil moisture (45%), telemetry sensor readings, and favorable 5-day weather, your wheat crop is performing at 94% optimal efficiency.";
            if (text.toLowerCase().includes("irrigate") || text.toLowerCase().includes("water")) {
                aiReply = "Telemetry Advisory: Moderate rain (18mm) is forecasted tomorrow. We recommend delaying irrigation by 24 hours to conserve water and prevent soil saturation.";
            } else if (text.toLowerCase().includes("crop") || text.toLowerCase().includes("grow")) {
                aiReply = "AI Suitability Engine recommends Wheat (92%) and Sugarcane (89%) based on your NPK parameters, Loamy soil, and Kharif season telemetry.";
            } else if (text.toLowerCase().includes("price") || text.toLowerCase().includes("market")) {
                aiReply = "Wheat is trading at ₹2,100 / Quintal (+8.4% this week). AI market prediction indicates upward price movement over the next 7 days.";
            } else if (text.toLowerCase().includes("disease") || text.toLowerCase().includes("leaf") || text.toLowerCase().includes("rust")) {
                aiReply = "If you observe yellow/orange pustules on leaves, it indicates Leaf Rust. Recommended action: Apply copper oxychloride fungicide and ensure field drainage.";
            }
            setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
        }, 600);
    };

    const suggestedQuestions = [
        "Should I irrigate today?",
        "Which crop should I grow?",
        "Is my crop healthy?",
        "Will it rain tomorrow?",
        "What is today's market price?"
    ];

    return (
        <div className="min-h-screen agri-grid-bg text-navy-900 flex flex-col relative font-sans antialiased selection:bg-cyan/20 selection:text-navy-900">
            {/* Ultra-subtle Scenic Wallpaper Layer */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-10 filter brightness-105 contrast-105"
                style={{ backgroundImage: "url('/farm-background.jpg')" }}
            ></div>

            {/* Glowing Ambient Gradient Blobs */}
            <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-cyan/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none z-0"></div>
            <div className="fixed bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-lime/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none z-0"></div>

            {/* Floating Glass Navigation Bar (Reference Website Style) */}
            <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
                <nav className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${isScrolled
                    ? "bg-white/90 backdrop-blur-xl border border-teal-800/10 shadow-[0_10px_30px_rgba(16,24,32,0.06)]"
                    : "bg-white/80 backdrop-blur-md border border-teal-800/8 shadow-sm"
                    }`}>
                    {/* Brand Logo */}
                    <Link href="/dashboard" className="flex items-center space-x-3 group min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md shadow-navy-900/10 transition-transform duration-300 group-hover:scale-105 flex-shrink-0 font-extrabold text-base border border-cyan/30">
                            🌱
                        </div>
                        <div className="truncate">
                            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-navy-900 leading-tight flex items-center">
                                Smart Farm <span className="text-teal-800 font-semibold ml-1">Assistant</span>
                            </h1>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">AI Farm Systems Online</span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
                        {navLinks.map((link) => {
                            const isCurrent = pathname === link.href || (pathname === '/dashboard' && link.href === '/dashboard');
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${isCurrent
                                        ? "bg-navy-900 text-white shadow-sm font-bold"
                                        : "text-slate-600 hover:text-navy-900 hover:bg-white/80"
                                        }`}
                                >
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Action Bar */}
                    <div className="flex items-center space-x-3">
                        {/* Ask Farm AI Trigger Button */}
                        <button
                            onClick={() => setAiAssistantOpen(true)}
                            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 bg-navy-900 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-navy-900/15 hover:shadow-glow-cyan transition-all duration-200 group border border-cyan/30"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-cyan group-hover:rotate-12 transition-transform" />
                            <span>Ask Farm AI</span>
                        </button>

                        {/* User Profile Badge */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-cyan/40 transition-colors shadow-xs"
                            >
                                <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                                    {getInitials(user.name)}
                                </div>
                                <span className="text-xs font-bold text-navy-900 hidden md:inline truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {/* User Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                                        <span className="text-[10px] font-extrabold uppercase bg-cyan/15 text-teal-800 px-2 py-0.5 rounded-md inline-block mt-1">
                                            👨‍🌾 {user.role}
                                        </span>
                                    </div>
                                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-900">
                                        <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-teal-700" /> Dashboard Overview
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                                    >
                                        <LogOut className="w-3.5 h-3.5 mr-2" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-navy-900 hover:bg-slate-50"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Drawer Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-2 p-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/80 shadow-2xl space-y-2 animate-fade-in">
                        <div className="space-y-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isCurrent = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${isCurrent
                                            ? "bg-navy-900 text-white font-bold"
                                            : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 text-cyan" />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setAiAssistantOpen(true);
                                }}
                                className="w-full py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-cyan" />
                                <span>Open AI Assistant</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-red-200"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Application Dynamic Workspace */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {children}
            </main>

            {/* Floating Bottom-Right AI Assistant Trigger */}
            <button
                onClick={() => setAiAssistantOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-navy-900 hover:bg-teal-800 text-white px-5 py-3.5 rounded-full font-extrabold text-xs shadow-2xl flex items-center space-x-2.5 border border-cyan/40 hover:scale-105 active:scale-95 transition-all group hover:shadow-glow-cyan"
            >
                <Sparkles className="w-4 h-4 text-cyan animate-pulse" />
                <span>Ask Farm AI</span>
            </button>

            {/* Slide-out Glass AI Assistant Modal Drawer */}
            {aiAssistantOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-navy-900/40 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-2xl border border-teal-800/15 w-full sm:max-w-md h-[88vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-navy-900 relative">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold border border-cyan/30 shadow-xs">
                                    <Bot className="w-4 h-4 text-cyan" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-sm text-navy-900 flex items-center">
                                        Farm AI Assistant <Sparkles className="w-3.5 h-3.5 ml-1.5 text-cyan" />
                                    </h3>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[10px] font-bold text-teal-700">Online • 24/7 Crop Intelligence</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiAssistantOpen(false)}
                                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Suggested Prompt Chips */}
                        <div className="p-3 bg-slate-50/50 border-b border-slate-100 space-y-1.5">
                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider px-1">Suggested Prompts</p>
                            <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-1">
                                {suggestedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(q)}
                                        className="px-3 py-1 bg-white hover:bg-navy-900 hover:text-white text-slate-700 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors border border-slate-200 shadow-2xs"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                            {chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-navy-900 text-white font-medium rounded-br-none shadow-md'
                                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 font-medium'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about irrigation, crops, disease..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 placeholder-slate-400 text-xs focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                className="p-2.5 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-bold transition-transform active:scale-95 border border-cyan/30"
                            >
                                <Send className="w-4 h-4 text-cyan" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


