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
    Send,
    TrendingUp,
    Activity,
    Search,
    UserCheck,
    Clock,
    Calendar,
    ArrowRight,
    Sun,
    Moon
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string }>({
        name: "Sai Dhanush MJ",
        role: "farmer"
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
    const [liveTime, setLiveTime] = useState<Date | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Cinematic Landing Screen State
    const [showLanding, setShowLanding] = useState<boolean>(true);
    const [isSlidingOut, setIsSlidingOut] = useState<boolean>(false);
    const [bgLoaded, setBgLoaded] = useState<boolean>(false);

    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
        { sender: 'ai', text: "Welcome to Smart Farm Assistant! I can help you with crop prediction, disease identification, weather analytics, and market prices. How can I assist your farm today?" }
    ]);
    const [inputMessage, setInputMessage] = useState("");

    // Initialize Theme (Dark / Light)
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                const savedTheme = localStorage.getItem("sfa_theme");
                const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                    setIsDarkMode(true);
                    document.documentElement.classList.add("dark");
                } else {
                    setIsDarkMode(false);
                    document.documentElement.classList.remove("dark");
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const nextMode = !prev;
            if (typeof window !== "undefined") {
                if (nextMode) {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("sfa_theme", "dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("sfa_theme", "light");
                }
            }
            return nextMode;
        });
    };

    // Check session entry on mount
    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                const entered = sessionStorage.getItem("sfa_cinematic_entered");
                if (entered === "true") {
                    setShowLanding(false);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    // Preload background image
    useEffect(() => {
        const img = new Image();
        img.src = "/farm-background.jpg";
        img.onload = () => setBgLoaded(true);
        img.onerror = () => setBgLoaded(true);
    }, []);

    const handleEnterFarm = () => {
        setIsSlidingOut(true);
        try {
            sessionStorage.setItem("sfa_cinematic_entered", "true");
        } catch (e) {}
        setTimeout(() => {
            setShowLanding(false);
            setIsSlidingOut(false);
        }, 900);
    };

    const handleReturnToWelcome = () => {
        setIsSlidingOut(false);
        setShowLanding(true);
    };

    useEffect(() => {
        setLiveTime(new Date());
        const timer = setInterval(() => {
            setLiveTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
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
        setSidebarOpen(false);
    }, [pathname]);

    // Navigation items grouped with highlighted fonts and badges for main features
    const featureGroups = [
        {
            groupName: "MAIN TELEMETRY & AI",
            items: [
                {
                    name: "Dashboard Overview",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                    isMain: false,
                    badge: "HUB",
                    badgeColor: "bg-slate-100 text-slate-700 border-slate-200"
                },
                {
                    name: "AI Disease Scanner",
                    href: "/dashboard/disease",
                    icon: ShieldAlert,
                    isMain: true,
                    badge: "CNN AI",
                    badgeColor: "bg-cyan/15 text-teal-800 border-cyan/40 shadow-xs",
                    desc: "Leaf pathology diagnostics"
                },
                {
                    name: "Crop Prediction",
                    href: "/dashboard/crop",
                    icon: Sprout,
                    isMain: true,
                    badge: "ML YIELD",
                    badgeColor: "bg-lime/20 text-emerald-900 border-lime/40 shadow-xs",
                    desc: "Soil NPK suitability"
                },
                {
                    name: "Weather & Rain Telemetry",
                    href: "/dashboard/rain",
                    icon: CloudRain,
                    isMain: true,
                    badge: "LIVE 28°C",
                    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
                    desc: "Doppler precipitation forecast"
                },
                {
                    name: "Market Intelligence",
                    href: "/dashboard#market",
                    icon: TrendingUp,
                    isMain: true,
                    badge: "+8.4%",
                    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                    desc: "Mandi price benchmarks"
                }
            ]
        },
        {
            groupName: "COMMERCE & SCHEMES",
            items: [
                {
                    name: "Kisan Marketplace",
                    href: "/dashboard/market",
                    icon: ShoppingBag,
                    isMain: true,
                    badge: "STORE",
                    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
                    desc: "Seeds, tools & fertilizers"
                },
                {
                    name: "Government Schemes",
                    href: "/dashboard/schemes",
                    icon: FileText,
                    isMain: true,
                    badge: "SUBSIDY",
                    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
                    desc: "PM-Kisan & PMFBY insurance"
                }
            ]
        },
        {
            groupName: "AI AGENT & SUPPORT",
            items: [
                {
                    name: "SmartChat AI",
                    href: "/dashboard/chatbot",
                    icon: Bot,
                    isMain: true,
                    badge: "SMART AI",
                    badgeColor: "bg-cyan/20 text-teal-900 border-cyan/40 animate-pulse",
                    desc: "Agronomic voice & text assistant"
                }
            ]
        }

    ];

    if (user?.role && user.role.toLowerCase() === 'admin') {
        featureGroups.push({
            groupName: "ADMINISTRATION",
            items: [
                {
                    name: "Admin Portal",
                    href: "/dashboard/admin",
                    icon: ShieldCheck,
                    isMain: false,
                    badge: "ADMIN",
                    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
                    desc: "System oversight"
                }
            ]
        });
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("sfa_cinematic_entered");
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
        <div className="min-h-screen agri-grid-bg text-navy-900 flex flex-col md:flex-row relative font-sans antialiased selection:bg-cyan/20 selection:text-navy-900 overflow-x-hidden">
            
            {/* ========================================================= */}
            {/* CINEMATIC FARM LANDING EXPERIENCE OVERLAY */}
            {/* ========================================================= */}
            {showLanding && (
                <div
                    className={`fixed inset-0 z-[100] w-screen h-screen overflow-hidden flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isSlidingOut 
                            ? "-translate-x-full opacity-90 scale-[0.98] pointer-events-none shadow-[30px_0_90px_rgba(24,213,208,0.6)]" 
                            : "translate-x-0 opacity-100 scale-100"
                    }`}
                >
                    {/* 1. Agricultural Background Image covering entire viewport */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
                            isSlidingOut ? "scale-115 blur-xs" : "scale-105"
                        } ${bgLoaded ? "opacity-100" : "opacity-0"}`}
                        style={{ backgroundImage: "url('/farm-background.jpg')" }}
                    ></div>

                    {/* 7. Laser Light Sweep & Cyan Light Trail during enter transition */}
                    {isSlidingOut && (
                        <div className="absolute inset-y-0 w-56 bg-gradient-to-r from-transparent via-cyan to-white filter blur-lg z-30 animate-light-sweep pointer-events-none"></div>
                    )}

                    {/* 12. Minimal Elegant Loading State */}
                    {!bgLoaded && (
                        <div className="absolute inset-0 bg-[#0B1118] flex flex-col items-center justify-center z-0 text-white space-y-4">
                            <div className="w-12 h-12 rounded-2xl border-2 border-cyan border-t-transparent animate-spin"></div>
                            <div className="flex items-center space-x-2">
                                <Sprout className="w-5 h-5 text-cyan animate-pulse" />
                                <span className="text-xs font-black tracking-widest uppercase text-cyan">SMART FARM ASSISTANT</span>
                            </div>
                        </div>
                    )}

                    {/* 2. Dark Cinematic Gradient Overlay & Soft Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1118]/85 via-[#101820]/60 to-[#0B1118]/90 mix-blend-multiply backdrop-blur-[2px] z-10 transition-opacity duration-1000"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(11,17,24,0.92)_100%)] z-10"></div>

                    {/* Ambient Glowing Orbs & Center Halo Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-radial from-cyan/25 via-teal-800/15 to-transparent rounded-full filter blur-[100px] pointer-events-none z-10"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/15 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime/10 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob animation-delay-2000"></div>

                    {/* Floating Light Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
                        <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#18D5D0] animate-float-particle"></div>
                        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_10px_#A8E63D] animate-float-particle" style={{ animationDelay: '1.2s' }}></div>
                        <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-float-particle" style={{ animationDelay: '0.6s' }}></div>
                    </div>

                    {/* Center Content Container */}
                    <div className="relative z-20 max-w-2xl mx-auto px-6 text-center flex flex-col items-center space-y-6">
                        
                        {/* Official Brand Emblem Logo with Cyan Glow */}
                        <div 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-1 flex items-center justify-center border-2 border-cyan/60 shadow-[0_0_35px_rgba(24,213,208,0.4)] overflow-hidden transform hover:scale-105 transition-all duration-300 animate-entry-scale"
                            style={{ animationDelay: '200ms' }}
                        >
                            <img
                                src="/smart-farm-logo.png"
                                alt="Smart Farm Assistant Logo"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>

                        {/* Title & Subtitle */}
                        <div 
                            className="space-y-1.5 animate-entry-fade-up"
                            style={{ animationDelay: '400ms' }}
                        >
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider uppercase text-white leading-tight">
                                SMART FARM ASSISTANT
                            </h1>
                            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-slate-300/90">
                                Welcome to the future of farming
                            </p>
                        </div>

                        {/* HOLLYLAND Destination Heading */}
                        <div 
                            className="pt-2 pb-1 animate-entry-fade-up"
                            style={{ animationDelay: '600ms' }}
                        >
                            <div className="relative inline-block">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan to-teal-100 filter drop-shadow-[0_0_25px_rgba(24,213,208,0.6)]">
                                    ENTER TO HOLLYLAND
                                </h2>
                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan to-transparent mt-2 opacity-80"></div>
                            </div>
                        </div>

                        {/* THE GLOWING ARROW OF LIGHT (Main Interactive Element) */}
                        <div 
                            className="pt-2 animate-entry-fade-up"
                            style={{ animationDelay: '800ms' }}
                        >
                            <button
                                onClick={handleEnterFarm}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleEnterFarm();
                                    }
                                }}
                                autoFocus
                                tabIndex={0}
                                aria-label="Enter to Hollyland"
                                className="group relative flex flex-col items-center justify-center p-6 rounded-full focus:outline-none transition-transform duration-300 cursor-pointer"
                            >
                                {/* Outer Circular Glow Corona */}
                                <div className="absolute inset-0 rounded-full bg-cyan/15 filter blur-xl group-hover:bg-cyan/35 group-hover:scale-125 transition-all duration-500 pointer-events-none"></div>
                                <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-cyan/40 group-hover:border-cyan group-hover:shadow-[0_0_35px_#18D5D0] transition-all duration-300 flex items-center justify-center bg-navy-900/60 backdrop-blur-md"></div>

                                {/* Glowing Light Arrow SVG */}
                                <div className="relative z-10 animate-arrow-flow group-hover:scale-115 transition-transform duration-300">
                                    <svg
                                        className="w-10 h-10 sm:w-12 sm:h-12 text-white filter drop-shadow-[0_0_15px_#18D5D0] group-hover:drop-shadow-[0_0_28px_#18D5D0]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="4" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="3" />
                                        <polyline points="13 5 20 12 13 19" stroke="#18D5D0" strokeWidth="3" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Microtext Navigation Cue */}
                        <div 
                            className="space-y-1 animate-entry-fade-up"
                            style={{ animationDelay: '1000ms' }}
                        >
                            <p className="text-[11px] font-bold text-slate-300/80 tracking-[0.25em] uppercase">
                                Follow the light to enter
                            </p>
                            <p className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase">
                                Click Arrow or Press <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">ENTER ↵</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ultra-subtle Scenic Wallpaper Layer */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-10 filter brightness-105 contrast-105"
                style={{ backgroundImage: "url('/farm-background.jpg')" }}
            ></div>

            {/* Glowing Ambient Gradient Blobs */}
            <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-cyan/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob pointer-events-none z-0"></div>
            <div className="fixed bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-lime/15 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none z-0"></div>

            {/* Mobile Header Bar */}
            <header className="md:hidden sticky top-0 z-40 w-full bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-cyan/20 px-4 py-2.5 flex items-center justify-between shadow-xs">
                <Link href="/dashboard" className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 p-0.5 flex items-center justify-center border border-cyan/40 shadow-xs overflow-hidden">
                        <img
                            src="/smart-farm-logo.png"
                            alt="Smart Farm Logo"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-navy-900 dark:text-white leading-none">Smart Farm</h1>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-cyan flex items-center mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block mr-1"></span> Assistant OS
                        </span>
                    </div>
                </Link>

                <div className="flex items-center space-x-1.5">
                    {/* Theme Toggle Mobile */}
                    <button
                        onClick={toggleTheme}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-navy-900 dark:text-cyan border border-slate-200/80 dark:border-cyan/30"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan" />}
                    </button>
                    <button
                        onClick={handleReturnToWelcome}
                        title="Cinematic Welcome Screen"
                        className="p-2 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-teal-800 dark:text-cyan rounded-xl text-xs font-bold flex items-center border border-slate-200 dark:border-cyan/30"
                    >
                        🌱
                    </button>
                    <button
                        onClick={() => setAiAssistantOpen(true)}
                        className="p-2 bg-navy-900 text-white rounded-xl text-xs font-bold flex items-center border border-cyan/30"
                    >
                        <Sparkles className="w-4 h-4 text-cyan" />
                    </button>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-navy-900 dark:text-white hover:bg-slate-200 dark:hover:bg-navy-700"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Backdrop Overlay for Mobile Sidebar */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-xs animate-fade-in"
                ></div>
            )}

            {/* VERTICAL SIDEBAR */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 md:z-30 w-72 h-screen bg-white/95 md:bg-white/90 dark:bg-navy-900/95 dark:md:bg-navy-900/90 backdrop-blur-2xl border-r border-teal-800/10 dark:border-cyan/20 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                {/* Top Brand Logo & Status */}
                <div className="p-5 border-b border-slate-100 dark:border-cyan/15 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleReturnToWelcome}
                            title="Click to view Cinematic Welcome Screen"
                            className="flex items-center space-x-3 group text-left"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-navy-800 p-0.5 flex items-center justify-center shadow-lg shadow-navy-900/10 group-hover:scale-105 transition-transform border border-cyan/50 overflow-hidden shrink-0">
                                <img
                                    src="/smart-farm-logo.png"
                                    alt="Smart Farm Assistant Logo"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-sm font-black tracking-tight text-navy-900 dark:text-white truncate leading-none">
                                    SMART FARM
                                </h1>
                                <span className="text-[10px] font-black text-cyan tracking-wider uppercase block mt-0.5">
                                    ASSISTANT
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-400 block tracking-tight">
                                    Smarter Decisions • Better Harvests
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1.5 text-slate-400 hover:text-navy-900 dark:hover:text-white rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Live System Badge with Return to Welcome Trigger */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200/70 dark:border-cyan/20 flex items-center justify-between">
                        <button
                            onClick={handleReturnToWelcome}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-left"
                            title="Return to Cinematic Welcome"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
                            </span>
                            <span className="text-[10px] font-extrabold tracking-wider uppercase text-teal-800 dark:text-cyan">
                                AI Telemetry Live
                            </span>
                        </button>
                        <button
                            onClick={handleReturnToWelcome}
                            className="text-[9px] font-black text-teal-800 dark:text-cyan bg-cyan/15 hover:bg-cyan/25 px-2 py-0.5 rounded-md border border-cyan/30 transition-colors"
                            title="Return to Welcome Screen"
                        >
                            Cinematic View ↵
                        </button>
                    </div>
                </div>

                {/* Navigation Links with Highlighted Fonts for Main Features */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-cyan/20">
                    {featureGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1.5">
                            <div className="px-3 py-1 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    {group.groupName}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 border ${
                                                isActive
                                                    ? "bg-navy-900 dark:bg-cyan text-white dark:text-navy-900 border-navy-900 dark:border-cyan shadow-md shadow-navy-900/15"
                                                    : item.isMain
                                                    ? "bg-white/80 dark:bg-navy-800/80 hover:bg-slate-50 dark:hover:bg-navy-700/80 text-navy-900 dark:text-white border-slate-200/80 dark:border-cyan/20 hover:border-cyan/50 shadow-2xs"
                                                    : "text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-navy-800/60 border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                                        isActive
                                                            ? "bg-white/10 dark:bg-navy-900/20 text-cyan dark:text-navy-900 border border-cyan/30"
                                                            : item.isMain
                                                            ? "bg-slate-100 dark:bg-navy-700/80 text-teal-800 dark:text-cyan group-hover:bg-cyan/15 group-hover:text-cyan border border-slate-200/60 dark:border-cyan/20"
                                                            : "text-slate-400 group-hover:text-navy-900 dark:group-hover:text-white"
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    {/* HIGHLIGHTED FONTS FOR MAIN FEATURES */}
                                                    <span
                                                        className={`block truncate text-xs ${
                                                            item.isMain
                                                                ? "font-black tracking-tight text-navy-900 dark:text-white group-hover:text-teal-900 dark:group-hover:text-cyan"
                                                                : "font-semibold"
                                                        } ${isActive ? "!text-white dark:!text-navy-900 font-black" : ""}`}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Feature Badge */}
                                            {item.badge && (
                                                <span
                                                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider ml-2 shrink-0 ${
                                                        isActive
                                                            ? "bg-cyan text-navy-900 border-cyan font-extrabold"
                                                            : item.badgeColor
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer: Ask AI & Farmer Profile */}
                <div className="p-4 border-t border-slate-100 dark:border-cyan/15 bg-slate-50/70 dark:bg-navy-900/80 space-y-3">
                    {/* Ask Farm AI Trigger Button */}
                    <button
                        onClick={() => setAiAssistantOpen(true)}
                        className="w-full py-2.5 px-4 bg-navy-900 dark:bg-navy-800 hover:bg-teal-800 dark:hover:bg-navy-700 text-white rounded-xl text-xs font-black shadow-md shadow-navy-900/15 hover:shadow-glow-cyan transition-all duration-200 flex items-center justify-center space-x-2 border border-cyan/30 group"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-cyan group-hover:rotate-12 transition-transform" />
                        <span>Ask Farm AI Assistant</span>
                    </button>

                    {/* Farmer Profile Card */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-cyan/25 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-teal-800 dark:bg-cyan text-white dark:text-navy-900 flex items-center justify-center font-black text-xs shrink-0">
                                {getInitials(user.name)}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-black text-navy-900 dark:text-white truncate">{user.name}</p>
                                <span className="text-[9px] font-extrabold text-teal-700 dark:text-cyan uppercase tracking-wider block">
                                    👨‍🌾 Verified Farmer
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Log Out"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors ml-1 shrink-0"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Desktop Top Sub-Header */}
                <header className="hidden md:flex sticky top-0 z-20 h-16 bg-white/85 dark:bg-navy-900/85 backdrop-blur-xl border-b border-teal-800/8 dark:border-cyan/20 px-6 lg:px-8 items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <Link href="/dashboard" className="hover:text-navy-900 dark:hover:text-white transition-colors">Farm Dashboard</Link>
                            <span>/</span>
                            <span className="text-navy-900 dark:text-white font-extrabold capitalize">
                                {pathname.replace("/dashboard", "").replace("/", "") || "Live Telemetry Overview"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Live Date & Time Real-time Widget */}
                        <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-navy-800 border border-slate-200/80 dark:border-cyan/30 px-3.5 py-1.5 rounded-xl shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-cyan" />
                            <span className="text-xs font-black text-navy-900 dark:text-white">
                                {liveTime ? liveTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Loading date..."}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
                            <Clock className="w-3.5 h-3.5 text-teal-800 dark:text-lime" />
                            <span className="text-xs font-black text-teal-800 dark:text-cyan font-mono tracking-tight">
                                {liveTime ? liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "00:00:00"}
                            </span>
                        </div>

                        {/* Live Quick Telemetry Indicator */}
                        <div className="hidden lg:flex items-center space-x-3 bg-slate-50 dark:bg-navy-800 border border-slate-200/80 dark:border-cyan/30 px-3 py-1.5 rounded-xl text-xs font-bold">
                            <span className="flex items-center text-teal-800 dark:text-slate-200 font-extrabold">
                                🌡️ 28°C
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className="flex items-center text-teal-800 dark:text-slate-200 font-extrabold">
                                💧 45% Moisture
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className="flex items-center text-cyan font-black bg-navy-900 dark:bg-navy-950 px-2 py-0.5 rounded-md text-[10px] border border-cyan/30">
                                AI SCORE 92
                            </span>
                        </div>

                        {/* Dark / Light Mode Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200/80 dark:border-cyan/30 text-navy-900 dark:text-cyan font-bold text-xs shadow-2xs hover:scale-105 active:scale-95 transition-all"
                            aria-label="Toggle Dark and Light Mode"
                        >
                            {isDarkMode ? (
                                <>
                                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-white font-black text-[11px]">Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-3.5 h-3.5 text-cyan" />
                                    <span className="text-navy-900 font-black text-[11px]">Dark</span>
                                </>
                            )}
                        </button>

                        {/* Quick AI Trigger */}
                        <button
                            onClick={() => setAiAssistantOpen(true)}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-navy-900 hover:bg-teal-800 text-white rounded-xl text-xs font-bold border border-cyan/30 transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-cyan" />
                            <span>Quick Chat</span>
                        </button>
                    </div>
                </header>


                {/* Page Workspace Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>

            {/* Floating Bottom-Right AI Assistant Trigger */}
            <button
                onClick={() => setAiAssistantOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-navy-900 hover:bg-teal-800 text-white px-5 py-3.5 rounded-full font-black text-xs shadow-2xl flex items-center space-x-2.5 border border-cyan/40 hover:scale-105 active:scale-95 transition-all group hover:shadow-glow-cyan"
            >
                <Sparkles className="w-4 h-4 text-cyan animate-pulse" />
                <span>Ask Farm AI</span>
            </button>

            {/* Slide-out Glass AI Assistant Modal Drawer */}
            {aiAssistantOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-navy-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl border border-teal-800/15 dark:border-cyan/25 w-full sm:max-w-md h-[88vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-navy-900 dark:text-white relative">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-cyan/15 flex items-center justify-between bg-slate-50/70 dark:bg-navy-800/70">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-navy-800 p-0.5 border border-cyan/50 shadow-xs flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/smart-chat-ai-logo.jpg"
                                        alt="SmartChatAI"
                                        className="w-full h-full object-contain rounded-xl"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm text-navy-900 dark:text-white flex items-center">
                                        SmartChat AI <Sparkles className="w-3.5 h-3.5 ml-1.5 text-cyan" />
                                    </h3>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[10px] font-bold text-teal-700 dark:text-cyan">Online • Kisan Mitra Intelligence</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiAssistantOpen(false)}
                                className="text-slate-400 hover:text-navy-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Suggested Prompt Chips */}
                        <div className="p-3 bg-slate-50/50 dark:bg-navy-950/40 border-b border-slate-100 dark:border-cyan/15 space-y-1.5">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider px-1">Suggested Prompts</p>
                            <div className="flex space-x-2 overflow-x-auto scrollbar-none pb-1">
                                {suggestedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(q)}
                                        className="px-3 py-1 bg-white dark:bg-navy-800 hover:bg-navy-900 dark:hover:bg-cyan hover:text-white dark:hover:text-navy-900 text-slate-700 dark:text-slate-200 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border border-slate-200 dark:border-cyan/20 shadow-2xs"
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
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
                                >
                                    {msg.sender === 'ai' && (
                                        <div className="w-6 h-6 rounded-lg bg-white dark:bg-navy-800 p-0.5 border border-cyan/40 shadow-xs shrink-0 mt-0.5 overflow-hidden">
                                            <img
                                                src="/smart-chat-ai-logo.jpg"
                                                alt="SmartChatAI"
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-navy-900 dark:bg-cyan text-white dark:text-navy-900 font-bold rounded-br-none shadow-md'
                                            : 'bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-cyan/20 font-medium'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="p-3.5 border-t border-slate-100 dark:border-cyan/15 bg-white dark:bg-navy-900 flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about irrigation, crops, disease..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-cyan/30 text-navy-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan font-medium"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                className="p-2.5 bg-navy-900 dark:bg-cyan hover:bg-teal-800 dark:hover:bg-cyan/80 text-white dark:text-navy-900 rounded-xl font-bold transition-transform active:scale-95 border border-cyan/30"
                            >
                                <Send className="w-4 h-4 text-cyan dark:text-navy-900" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



