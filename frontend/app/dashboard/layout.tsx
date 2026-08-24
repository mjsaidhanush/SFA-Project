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
    ChevronRight,
    Leaf,
    Search,
    Bell,
    Sun,
    Settings,
    HelpCircle,
    PanelLeftClose,
    PanelLeftOpen,
    Send,
    MessageSquare,
    CheckCircle2
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string }>({
        name: "Google Farmer User",
        role: "farmer"
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
        { sender: 'ai', text: "Hello! I am your AI Smart Farm Assistant. How can I help optimize your yield today?" }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getTimePeriodInfo = (date: Date | null) => {
        if (!date) return { greeting: "Good Day", period: "Daily Update", icon: "🌱", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) {
            return { greeting: "Good Morning", period: "Morning Shift Update", icon: "🌅", badgeBg: "bg-amber-100 text-amber-800 border-amber-300" };
        } else if (hour >= 12 && hour < 17) {
            return { greeting: "Good Afternoon", period: "Afternoon Shift Update", icon: "☀️", badgeBg: "bg-yellow-100 text-yellow-800 border-yellow-300" };
        } else if (hour >= 17 && hour < 21) {
            return { greeting: "Good Evening", period: "Evening Shift Update", icon: "🌆", badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-300" };
        } else {
            return { greeting: "Good Night", period: "Night Telemetry Shift", icon: "🌙", badgeBg: "bg-purple-100 text-purple-800 border-purple-300" };
        }
    };

    const timePeriod = getTimePeriodInfo(currentTime);

    useEffect(() => {
        try {
            if (typeof window === "undefined") return;

            let token = localStorage.getItem("token");
            let storedUser = localStorage.getItem("user");

            if (!token || !storedUser) {
                const defaultUser = {
                    name: "Google Farmer User",
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
                if (parsedUser.name.toLowerCase().includes("xsxsxssai")) {
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
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Crop Prediction", href: "/dashboard/crop", icon: Sprout },
        { name: "Rain Forecast", href: "/dashboard/rain", icon: CloudRain },
        { name: "Disease Detection", href: "/dashboard/disease", icon: ShieldAlert },
        { name: "Marketplace", href: "/dashboard/market", icon: ShoppingBag },
        { name: "Govt Schemes", href: "/dashboard/schemes", icon: FileText },
        { name: "AI Chatbot", href: "/dashboard/chatbot", icon: Bot },
    ];

    if (user?.role && user.role.toLowerCase() === 'admin') {
        navLinks.push({ name: "Admin Portal", href: "/dashboard/admin", icon: ShieldCheck });
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

        // Simulated AI response
        setTimeout(() => {
            let aiReply = "Based on your soil moisture (45%), 5-day weather forecast (sunny with 20% rain prob), and crop growth telemetry, your wheat crop is performing optimally.";
            if (text.toLowerCase().includes("irrigate") || text.toLowerCase().includes("water")) {
                aiReply = "Based on your soil moisture levels and light rain forecast tomorrow, scheduled irrigation is recommended tomorrow morning.";
            } else if (text.toLowerCase().includes("crop") || text.toLowerCase().includes("grow")) {
                aiReply = "Wheat and Sugarcane have high AI suitability (92%+) based on your regional NPK and temp parameters.";
            } else if (text.toLowerCase().includes("price") || text.toLowerCase().includes("market")) {
                aiReply = "Wheat is currently trading at ₹2,100 / Quintal (+8.4% this week). Prices are expected to increase over the next 7 days.";
            }
            setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
        }, 800);
    };

    const suggestedQuestions = [
        "Should I irrigate my wheat today?",
        "What crop should I grow?",
        "Will it rain tomorrow?",
        "Is my crop healthy?",
    ];

    return (
        <div className="min-h-screen bg-[#F6F8F2] text-[#212422] flex flex-col md:flex-row relative overflow-hidden font-sans">
            {/* Ambient Background Blobs matching Login Page */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none z-0"></div>

            {/* Left Sidebar */}
            <aside
                className={`bg-[#1E293B] border-r border-[#1E293B]/20 flex-col hidden md:flex relative z-30 transition-all duration-300 rounded-tr-3xl rounded-br-3xl my-3 ml-3 shadow-2xl overflow-hidden ${sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-400"></div>

                {/* Logo & Brand Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-3 group min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 flex-shrink-0 font-extrabold text-lg">
                            🌾
                        </div>
                        {!sidebarCollapsed && (
                            <div className="truncate">
                                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight flex items-center">
                                    Smart Farm <span className="text-blue-400 ml-1.5">🚜</span>
                                </h1>
                                <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1 text-blue-400" /> AI Assistant
                                </p>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-white/60 hover:text-blue-400 p-1.5 rounded-xl hover:bg-white/10 transition-colors focus:outline-none hidden lg:block"
                        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>

                {/* User Profile Badge */}
                {!sidebarCollapsed && (
                    <div className="mx-4 mt-4 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md relative flex-shrink-0">
                            {getInitials(user.name)}
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 border-2 border-[#1E293B] rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-xs truncate" title={user.name}>{user.name}</p>
                            <span className="text-[9px] font-extrabold tracking-wider uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30 inline-block mt-0.5 flex items-center w-max">
                                👨‍🌾 {user.role}
                            </span>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {!sidebarCollapsed && (
                        <p className="px-3 text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2">Main Navigation</p>
                    )}
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href}>
                                <div
                                    className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-xl transition-all duration-300 cursor-pointer group relative mb-1 ${isActive
                                        ? "bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/30"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    title={sidebarCollapsed ? link.name : undefined}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-white" : "text-blue-400 group-hover:scale-110"}`} />
                                        {!sidebarCollapsed && <span className="text-xs font-bold tracking-wide">{link.name}</span>}
                                    </div>
                                    {!sidebarCollapsed && isActive && (
                                        <span className="w-1.5 h-4 bg-cyan-300 rounded-full"></span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Navigation Actions */}
                <div className="p-3 border-t border-white/10 space-y-1">
                    {!sidebarCollapsed && (
                        <p className="px-3 text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-1">System</p>
                    )}
                    <Link href="/dashboard" className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3 px-3.5'} py-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 text-xs font-semibold`}>
                        <Settings className="w-4 h-4 text-blue-400" />
                        {!sidebarCollapsed && <span>Settings</span>}
                    </Link>
                    <button
                        onClick={() => setAiAssistantOpen(true)}
                        className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3 px-3.5'} py-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 text-xs font-semibold`}
                    >
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        {!sidebarCollapsed && <span>Help & Support</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3 px-3.5'} py-2 text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition-colors mt-1`}
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                        {!sidebarCollapsed && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Top Header Bar */}
                <header className="glass-header-light sticky top-0 z-20 border-b border-blue-200/60 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs bg-white/80 backdrop-blur-md">
                    {/* Header Left: Dynamic Greeting & Time Period */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-xl bg-[#1E293B] text-blue-400"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-extrabold text-[#1E293B] flex items-center">
                                    {timePeriod.greeting}, {user?.name.split(" ")[0] || "Farmer"} <span className="ml-1.5 text-xl">{timePeriod.icon}</span>
                                </h2>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${timePeriod.badgeBg} hidden sm:inline-block`}>
                                    {timePeriod.period}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium hidden sm:flex items-center mt-0.5">
                                <span className="font-bold text-[#1E293B] mr-2">
                                    📅 {currentTime ? currentTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Loading date..."}
                                </span>
                                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                    ⏰ {currentTime ? currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Header Right Controls */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Status Dot Pill */}
                        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full border border-blue-200 text-xs font-bold text-[#1E293B] shadow-xs">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                            <span>Farm systems operational</span>
                        </div>

                        {/* Search Input */}
                        <div className="relative hidden sm:block w-44 md:w-56">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search telemetry..."
                                className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-[#1E293B] placeholder-gray-400 focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-blue-400/40 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#1E293B] hover:bg-gray-50 transition-colors">
                            <Bell className="w-4.5 h-4.5 text-blue-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>

                        {/* Weather Indicator */}
                        <Link href="/dashboard/rain" className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E293B] hover:border-blue-400 transition-all shadow-xs">
                            <Sun className="w-4 h-4 text-amber-500" />
                            <span>28°C Sunny</span>
                        </Link>

                        {/* User Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md border border-blue-400/40">
                            {getInitials(user.name)}
                        </div>
                    </div>
                </header>

                {/* Main Dynamic Viewport */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 md:px-8 py-5">
                    {children}
                </main>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-[#1E293B]/95 backdrop-blur-xl flex flex-col pt-16 px-6 pb-6 animate-fade-in space-y-4">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-xl"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{user.name}</p>
                            <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2 overflow-y-auto">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.name} href={link.href}>
                                    <div
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                            ? "bg-blue-600 text-white font-bold"
                                            : "text-white/80 hover:bg-white/10"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{link.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 rounded-xl bg-red-500/20 text-red-300 font-bold flex items-center justify-center space-x-2 border border-red-500/30"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            )}

            {/* Floating AI Farmer Assistant Button */}
            <button
                onClick={() => setAiAssistantOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-[#1E293B] text-white px-5 py-3.5 rounded-full font-extrabold text-sm shadow-2xl flex items-center space-x-2.5 border border-blue-400/40 hover:scale-105 active:scale-95 transition-all group"
            >
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                <span>Ask Farm AI</span>
            </button>

            {/* Floating AI Chat Assistant Glass Drawer Panel */}
            {aiAssistantOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-[#1E293B] border border-blue-400/30 w-full sm:max-w-md h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white flex items-center">
                                        Ask Farm AI <Sparkles className="w-3.5 h-3.5 ml-1.5 text-blue-400" />
                                    </h3>
                                    <p className="text-[10px] text-blue-300">Online • 24/7 Crop Intelligence</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiAssistantOpen(false)}
                                className="text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Suggested Quick Questions Toolbar */}
                        <div className="p-3 bg-black/20 border-b border-white/5 space-y-1.5">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider px-1">Suggested Questions</p>
                            <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-1">
                                {suggestedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(q)}
                                        className="px-3 py-1 bg-white/10 hover:bg-blue-500/20 hover:text-blue-300 text-white/80 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors border border-white/10"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                            {chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white font-semibold rounded-br-none shadow-md'
                                            : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="p-3.5 border-t border-white/10 bg-black/30 flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask your farm assistant..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-blue-400"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                className="p-2.5 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

