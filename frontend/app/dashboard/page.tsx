"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    Sun,
    Sprout,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Info,
    Bell,
    ArrowRight,
    Search,
    CloudRain,
    ShoppingBag,
    Bot,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Volume2,
    Activity,
    Thermometer,
    Droplets,
    Wind,
    Sparkles,
    CheckCircle2,
    UploadCloud,
    Camera,
    AlertTriangle,
    ArrowUpRight,
    LineChart,
    BarChart3,
    ShieldAlert,
    Clock,
    Layers,
    Compass,
    Cpu,
    ExternalLink,
    Star,
    Plus,
    Filter,
    RefreshCw,
    Award
} from "lucide-react";

export default function Dashboard() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
    const [activeCropFilter, setActiveCropFilter] = useState("all");
    const [activeMarketCategory, setActiveMarketCategory] = useState("all");
    const [cartCount, setCartCount] = useState(0);
    const [cartToast, setCartToast] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    // Scanner state
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{
        disease: string;
        confidence: number;
        severity: string;
        treatment: string;
    } | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom Crop Prediction Simulation Modal
    const [showPredictModal, setShowPredictModal] = useState(false);
    const [predictFormData, setPredictFormData] = useState({
        state: "Andhra Pradesh",
        soilType: "Loamy",
        nitrogen: 40,
        phosphorus: 50,
        potassium: 50,
        rainfall: 150
    });
    const [modalPrediction, setModalPrediction] = useState<{ crop: string; suitability: number } | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    // Scheme Checker Modal
    const [showSchemeModal, setShowSchemeModal] = useState(false);
    const [schemeCheckResult, setSchemeCheckResult] = useState<string | null>(null);

    // Live Calendar and Time State
    const [selectedCalDay, setSelectedCalDay] = useState<number>(24);

    const [calMonth, setCalMonth] = useState<number>(7); // 7 is August (0-indexed)
    const [calYear, setCalYear] = useState<number>(2026);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const agriculturalEvents: Record<number, { title: string; type: 'sow' | 'irrigate' | 'drone' | 'fertilize' | 'market' | 'rain'; time: string; badge: string }> = {
        4: { title: "Monsoon Precipitation Window", type: "rain", time: "08:00 AM", badge: "RAIN PREP" },
        10: { title: "Wheat & Cereal Sowing Phase", type: "sow", time: "06:30 AM", badge: "SOWING" },
        17: { title: "Drone Aerial NDVI Scouting", type: "drone", time: "10:30 AM", badge: "DRONE AI" },
        24: { title: "Precision Crop Health & Mandi Trading", type: "market", time: "09:00 AM", badge: "TODAY • ACTIVE" },
        29: { title: "Micro-Drip Irrigation Cycle", type: "irrigate", time: "05:30 PM", badge: "IRRIGATION" }
    };

    useEffect(() => {
        const now = new Date();
        setCurrentTime(now);
        setSelectedCalDay(now.getDate());
        setCalMonth(now.getMonth());
        setCalYear(now.getFullYear());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const cropsList = [
        { id: "wheat", name: "Wheat", category: "cereals", suitability: 92, yield: "4.8 tons/ha", soil: "Excellent", weather: "Good", market: "High Demand", icon: "🌾", desc: "Optimal soil NPK & temperature match for current winter/Kharif cycle." },
        { id: "rice", name: "Rice (Paddy)", category: "cereals", suitability: 88, yield: "5.2 tons/ha", soil: "Good", weather: "Optimal", market: "Stable", icon: "🌱", desc: "High water efficiency rating with consistent minimum support pricing." },
        { id: "sugarcane", name: "Sugarcane", category: "cash", suitability: 90, yield: "75 tons/ha", soil: "Optimal", weather: "Good", market: "High Demand", icon: "🎋", desc: "Ideal for irrigated alluvial zones with extended commercial yield." },
        { id: "cotton", name: "Cotton", category: "cash", suitability: 81, yield: "2.4 tons/ha", soil: "Fair", weather: "Moderate", market: "Very High", icon: "☁️", desc: "Requires well-drained deep black soil with regulated moisture." },
        { id: "groundnut", name: "Groundnut", category: "pulses", suitability: 85, yield: "2.8 tons/ha", soil: "Good", weather: "Optimal", market: "High", icon: "🥜", desc: "Fixes nitrogen naturally in light sandy loam soil formations." },
        { id: "maize", name: "Maize (Corn)", category: "cereals", suitability: 86, yield: "6.1 tons/ha", soil: "Excellent", weather: "Good", market: "Growing", icon: "🌽", desc: "Rapid crop rotation suitability with low input cost overheads." },
    ];

    const filteredCrops = activeCropFilter === "all"
        ? cropsList
        : cropsList.filter(c => c.category === activeCropFilter);

    const marketplaceItems = [
        { id: 1, name: "Hybrid Shriram Super Wheat Seeds (40kg)", category: "seeds", price: 1450, originalPrice: 1800, rating: 4.9, discount: "20% OFF", image: "🌾" },
        { id: 2, name: "Bio-NPK Soil Organic Fertilizer (50kg)", category: "fertilizers", price: 890, originalPrice: 1100, rating: 4.8, discount: "19% OFF", image: "🧪" },
        { id: 3, name: "IoT Solar Smart Soil Moisture Sensor Node", category: "equipment", price: 3200, originalPrice: 4000, rating: 5.0, discount: "20% OFF", image: "📟" },
        { id: 4, name: "Automated Drip Irrigation Micro-Kit (1 Acre)", category: "irrigation", price: 6500, originalPrice: 7900, rating: 4.9, discount: "18% OFF", image: "💧" },
        { id: 5, name: "Ergonomic Multi-Blade Paddy Weeder Tool", category: "tools", price: 1250, originalPrice: 1600, rating: 4.7, discount: "22% OFF", image: "🛠️" },
        { id: 6, name: "Copper Fungicide Foliage Spray (1 Liter)", category: "fertilizers", price: 680, originalPrice: 850, rating: 4.8, discount: "20% OFF", image: "🌿" },
    ];

    const filteredProducts = activeMarketCategory === "all"
        ? marketplaceItems
        : marketplaceItems.filter(p => p.category === activeMarketCategory);

    const handleAddToCart = (item: any) => {
        setCartCount(prev => prev + 1);
        setCartToast(`Added ${item.name} to Cart`);
        setTimeout(() => setCartToast(null), 3000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanError(null);
        setScanResult(null);
        setIsScanning(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgData = event.target?.result as string;
            setScannedImage(imgData);

            // Foliage canvas verification
            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setIsScanning(false);
                    return;
                }

                canvas.width = 100;
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);
                const pData = ctx.getImageData(0, 0, 100, 100).data;

                let plantColorPixels = 0;
                const totalSamplePixels = 10000;

                for (let i = 0; i < pData.length; i += 4) {
                    const r = pData[i];
                    const g = pData[i + 1];
                    const b = pData[i + 2];

                    const isGreenFoliage = g > r * 0.9 && g > b * 0.9 && (g > 40 || (r < 140 && g > 60));
                    const isPlantBrownOrYellow = r > 70 && g > 50 && b < 100 && Math.abs(r - g) < 50;

                    if (isGreenFoliage || isPlantBrownOrYellow) {
                        plantColorPixels++;
                    }
                }

                const plantRatio = plantColorPixels / totalSamplePixels;

                setTimeout(() => {
                    setIsScanning(false);
                    if (plantRatio < 0.18) {
                        setScanError("This image is not related to agriculture and is not helpful for farmers. Please upload a clear photo of a crop leaf.");
                    } else {
                        setScanResult({
                            disease: "Leaf Rust (Puccinia triticina)",
                            confidence: 94,
                            severity: "Moderate",
                            treatment: "Apply copper-based fungicide or Propiconazole 25% EC (1ml/L) and ensure field drainage within 48 hours."
                        });
                    }
                }, 1600);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSimulateCustomPrediction = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPredicting(true);
        setTimeout(() => {
            setIsPredicting(false);
            setModalPrediction({
                crop: predictFormData.nitrogen > 30 ? "Wheat" : "Sugarcane",
                suitability: 93
            });
        }, 1200);
    };

    const handleCheckSchemeEligibility = () => {
        setSchemeCheckResult("Eligible for PM-Kisan (₹6,000/yr) and PMFBY Crop Insurance Coverage (up to ₹45,000/ha).");
    };

    const dailyAlerts = [
        { id: 1, title: "Cyclone Warning", desc: "Red Alert: High wind speeds predicted along coastal belt. Halt harvesting.", time: "5 mins ago", color: "red", bg: "bg-red-50 text-red-600 border-red-200" },
        { id: 2, title: "Heavy Rainfall Forecast", desc: "Orange Alert: 18mm rainfall predicted tomorrow. Delay irrigation.", time: "25 mins ago", color: "orange", bg: "bg-amber-50 text-amber-600 border-amber-200" },
        { id: 3, title: "Favorable Spray Window", desc: "Green Alert: Low wind speed today (8 km/h). Ideal for foliar fertilizer application.", time: "1 hour ago", color: "green", bg: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    ];

    return (
        <div className="space-y-16 animate-fade-in text-navy-900 pb-20">
            {/* Toast Notification */}
            {cartToast && (
                <div className="fixed top-20 right-6 z-50 bg-navy-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan/40 flex items-center space-x-2.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-cyan" />
                    <span className="text-xs font-bold">{cartToast}</span>
                </div>
            )}

            {/* 1. HERO SECTION WITH OFFICIAL LOGO */}
            <section id="hero" className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Hero Left Text Column */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Official Brand Logo Badge */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-1 flex items-center justify-center border-2 border-cyan/40 shadow-xl overflow-hidden shrink-0">
                                <img
                                    src="/smart-farm-logo.png"
                                    alt="Smart Farm Assistant Official Logo"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-teal-800/10 shadow-xs">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
                                    </span>
                                    <span className="text-[11px] font-black tracking-wider text-teal-800 uppercase">
                                        ● AI Farm Systems Online
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-cyan tracking-wider uppercase">
                                    Smarter Decisions • Better Harvests
                                </p>
                            </div>
                        </div>

                        {/* Large Headline */}
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 leading-[1.08]">
                                SMART FARM <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-cyan-500 to-lime-500">
                                    ASSISTANT
                                </span>
                            </h1>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-600">
                                AI-powered precision intelligence for modern agricultural operations.
                            </h2>
                        </div>

                        {/* Supporting Narrative */}
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                            Monitor crops, predict Doppler rain, detect leaf diseases with neural pathology, benchmark Mandi prices, and optimize harvest yield.
                        </p>

                        {/* Hero CTA Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <a
                                href="#overview"
                                className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-navy-900/15 hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-200 border border-cyan/30"
                            >
                                <span>Explore Farm Intelligence</span>
                                <ArrowRight className="w-4 h-4 text-cyan" />
                            </a>
                            <a
                                href="#live-calendar"
                                className="inline-flex items-center space-x-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-navy-900 rounded-xl font-black text-xs border border-slate-200/80 shadow-xs hover:border-cyan/50 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Calendar className="w-4 h-4 text-cyan" />
                                <span>Live Agro Calendar</span>
                            </a>
                        </div>

                        {/* Quick Live Telemetry Strip */}
                        <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
                            <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-cyan" />
                                <span>IoT Nodes: <strong className="text-navy-900">12 Connected</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>Zone A-4: <strong className="text-navy-900">28°C Optimal</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Droplets className="w-4 h-4 text-blue-500" />
                                <span>Moisture: <strong className="text-navy-900">45% Field Cap</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Right Visual Column: Sophisticated Agricultural AI Visual */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-card border border-teal-800/10 overflow-hidden group">
                            {/* Scanning laser animation overlay */}
                            <div className="animate-scan"></div>

                            {/* Top Graphic Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-cyan animate-pulse"></div>
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-navy-900">Drone & Satellite Telemetry</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    LIVE SENSOR FEED
                                </span>
                            </div>

                            {/* Center Visual: Crop Field Grid Radar Simulation */}
                            <div className="relative rounded-2xl bg-navy-900 p-5 text-white overflow-hidden mb-5 border border-cyan/30">
                                <div className="absolute inset-0 bg-[radial-gradient(#18D5D0_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                                <div className="relative z-10 flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] text-cyan font-bold uppercase tracking-wider">Active Region</p>
                                        <h4 className="text-base font-extrabold">Sector 7 — Wheat Field 🌾</h4>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-cyan text-xs font-mono font-bold">
                                        94% Health
                                    </span>
                                </div>

                                <div className="relative z-10 grid grid-cols-3 gap-2.5 text-center text-xs">
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-slate-400">Chlorophyll</p>
                                        <p className="text-sm font-extrabold text-lime mt-0.5">88.4 SPAD</p>
                                    </div>
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-slate-400">Nitrogen Index</p>
                                        <p className="text-sm font-extrabold text-cyan mt-0.5">Optimal</p>
                                    </div>
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-[10px] text-slate-400">Disease Threat</p>
                                        <p className="text-sm font-extrabold text-emerald-400 mt-0.5">0 Detected</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Analytics Dial Row */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan/15 text-teal-800 flex items-center justify-center font-bold">
                                        <Sprout className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold">Crop Growth Index</p>
                                        <p className="text-sm font-extrabold text-navy-900">+12% vs Normal</p>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-lime/20 text-teal-900 flex items-center justify-center font-bold">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold">Market Projected</p>
                                        <p className="text-sm font-extrabold text-navy-900">₹2,100 / Qtl</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1.5. TIME, DATE & LIVE AGRICULTURAL CALENDAR SECTION */}
            <section id="live-calendar" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan/15 rounded-full text-[11px] font-black text-teal-800 mb-2 border border-cyan/30">
                            <Clock className="w-3.5 h-3.5 text-cyan" />
                            <span>Real-Time Agronomic Timekeeper</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                            Live Time, Date & Crop Calendar
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">
                            Plan irrigation, sowing windows, fertilizing cycles, and harvest timelines with real-time solar telemetry.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                            Kharif Season 2026
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Interactive Monthly Calendar Grid (7 Columns) */}
                    <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
                        <div>
                            {/* Calendar Header with Controls */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-2xl bg-navy-900 text-cyan flex items-center justify-center font-bold border border-cyan/40 shadow-xs">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-black text-navy-900">
                                            {monthNames[calMonth]} {calYear}
                                        </h3>
                                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                            Agricultural Sowing & Schedular
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1.5">
                                    <button
                                        onClick={() => {
                                            if (calMonth === 0) {
                                                setCalMonth(11);
                                                setCalYear(prev => prev - 1);
                                            } else {
                                                setCalMonth(prev => prev - 1);
                                            }
                                        }}
                                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy-900 border border-slate-200 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const now = new Date();
                                            setCalMonth(now.getMonth());
                                            setCalYear(now.getFullYear());
                                            setSelectedCalDay(now.getDate());
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 text-xs font-bold transition-all border border-slate-200"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (calMonth === 11) {
                                                setCalMonth(0);
                                                setCalYear(prev => prev + 1);
                                            } else {
                                                setCalMonth(prev => prev + 1);
                                            }
                                        }}
                                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy-900 border border-slate-200 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 mb-2">
                                <span>SUN</span>
                                <span>MON</span>
                                <span>TUE</span>
                                <span>WED</span>
                                <span>THU</span>
                                <span>FRI</span>
                                <span>SAT</span>
                            </div>

                            {/* Month Grid Cells */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty offset days */}
                                {Array.from({ length: firstDayOfMonth(calMonth, calYear) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-slate-50/40"></div>
                                ))}

                                {/* Month Days */}
                                {Array.from({ length: daysInMonth(calMonth, calYear) }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const isToday = dayNum === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear();
                                    const isSelected = dayNum === selectedCalDay;
                                    const event = agriculturalEvents[dayNum];

                                    return (
                                        <button
                                            key={`day-${dayNum}`}
                                            onClick={() => setSelectedCalDay(dayNum)}
                                            className={`relative h-10 sm:h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs sm:text-sm transition-all border ${
                                                isSelected
                                                    ? "bg-navy-900 text-white border-navy-900 shadow-md shadow-navy-900/15 scale-105 z-10"
                                                    : isToday
                                                    ? "bg-cyan/15 text-teal-900 border-cyan font-black"
                                                    : "bg-slate-50 hover:bg-slate-100/80 text-navy-900 border-slate-200/60"
                                            }`}
                                        >
                                            <span>{dayNum}</span>
                                            {event && (
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                                                        isSelected
                                                            ? "bg-cyan"
                                                            : event.type === 'rain'
                                                            ? "bg-blue-500"
                                                            : event.type === 'sow'
                                                            ? "bg-emerald-500"
                                                            : event.type === 'drone'
                                                            ? "bg-cyan"
                                                            : "bg-amber-500"
                                                    }`}
                                                ></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Day Milestone Banner */}
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Schedule for {monthNames[calMonth]} {selectedCalDay}, {calYear}
                                </span>
                                {agriculturalEvents[selectedCalDay] && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan/20 text-teal-900 border border-cyan/30">
                                        {agriculturalEvents[selectedCalDay].badge}
                                    </span>
                                )}
                            </div>

                            {agriculturalEvents[selectedCalDay] ? (
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">
                                            {agriculturalEvents[selectedCalDay].type === 'rain' && "🌧️"}
                                            {agriculturalEvents[selectedCalDay].type === 'sow' && "🌾"}
                                            {agriculturalEvents[selectedCalDay].type === 'drone' && "🔬"}
                                            {agriculturalEvents[selectedCalDay].type === 'irrigate' && "💧"}
                                            {agriculturalEvents[selectedCalDay].type === 'market' && "📈"}
                                        </span>
                                        <div>
                                            <p className="text-xs font-black text-navy-900">{agriculturalEvents[selectedCalDay].title}</p>
                                            <p className="text-[11px] font-medium text-slate-500">Scheduled Time: {agriculturalEvents[selectedCalDay].time}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-teal-800">Confirmed</span>
                                </div>
                            ) : (
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs font-medium flex items-center justify-between">
                                    <span>Standard field maintenance and automated soil telemetry logging.</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">Routine</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Live Digital Precision Clock & Solar Telemetry (5 Columns) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                        {/* Live Digital Clock Card */}
                        <div className="glass-card-dark text-white p-6 sm:p-7 rounded-3xl border border-cyan/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan/15 rounded-full border border-cyan/30">
                                    <span className="w-2 h-2 rounded-full bg-cyan animate-ping"></span>
                                    <span className="text-[10px] font-black uppercase text-cyan tracking-wider">Live System Clock</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-300">IST (UTC+5:30)</span>
                            </div>

                            {/* Big Bold Clock Numbers */}
                            <div className="my-3">
                                <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white flex items-baseline">
                                    <span>
                                        {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "07:05:00 PM"}
                                    </span>
                                </p>
                                <p className="text-xs sm:text-sm font-extrabold text-cyan mt-1">
                                    {currentTime ? currentTime.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "Monday, August 24, 2026"}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
                                <span>Day 236 of 365 (64.6%)</span>
                                <span className="text-lime font-bold">Autumn Kharif Phase</span>
                            </div>
                        </div>

                        {/* Astronomical, Daylight & Solar Radiation Telemetry */}
                        <div className="glass-panel p-6 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Daylight & Solar Telemetry</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-teal-800">Doppler Live</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                    <div className="flex items-center space-x-1.5 text-amber-600 font-black">
                                        <Sun className="w-4 h-4" />
                                        <span>Sunrise & Sunset</span>
                                    </div>
                                    <p className="text-sm font-black text-navy-900 mt-1">05:48 AM – 06:42 PM</p>
                                    <p className="text-[10px] text-slate-500">12h 54m Total Photoperiod</p>
                                </div>

                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                    <div className="flex items-center space-x-1.5 text-teal-800 font-black">
                                        <Compass className="w-4 h-4" />
                                        <span>Moon Phase</span>
                                    </div>
                                    <p className="text-sm font-black text-navy-900 mt-1">Waxing Gibbous</p>
                                    <p className="text-[10px] text-emerald-700 font-bold">Optimal For Foliar Sprays</p>
                                </div>

                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                    <div className="flex items-center space-x-1.5 text-cyan font-black">
                                        <Activity className="w-4 h-4" />
                                        <span>Solar Radiation</span>
                                    </div>
                                    <p className="text-sm font-black text-navy-900 mt-1">840 W/m²</p>
                                    <p className="text-[10px] text-slate-500">High Photosynthetic Peak</p>
                                </div>

                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                    <div className="flex items-center space-x-1.5 text-blue-600 font-black">
                                        <Droplets className="w-4 h-4" />
                                        <span>Irrigation Today</span>
                                    </div>
                                    <p className="text-sm font-black text-navy-900 mt-1">2.4 L / m²</p>
                                    <p className="text-[10px] text-teal-800 font-bold">Morning Window: 06-08 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OVERVIEW SECTION ("Your Farm at a Glance") */}
            <section id="overview" className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Your Farm at a Glance

                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Everything you need to understand your farm in one view.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Weather Card */}
                    <div className="glass-panel p-6 flex flex-col justify-between h-full group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                                Realtime Telemetry
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sun className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Weather</h3>
                            <p className="text-3xl font-black text-navy-900 tracking-tight">28°C</p>
                            <p className="text-xs font-semibold text-slate-600 mt-1">Sunny • 45% Humidity</p>
                        </div>
                    </div>

                    {/* Crop Health Card */}
                    <div className="glass-panel p-6 flex flex-col justify-between h-full group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                                Optimal Stage
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sprout className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Crop Health</h3>
                            <p className="text-3xl font-black text-navy-900 tracking-tight">94%</p>
                            <p className="text-xs font-semibold text-emerald-700 mt-1">Healthy • Low Risk Threat</p>
                        </div>
                    </div>

                    {/* Market Price Card */}
                    <div className="glass-panel p-6 flex flex-col justify-between h-full group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-cyan/15 text-teal-800 border border-cyan/30 uppercase tracking-wider">
                                High Demand
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-cyan/15 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Market Price</h3>
                            <p className="text-3xl font-black text-navy-900 tracking-tight">₹2,100</p>
                            <p className="text-xs font-semibold text-teal-700 mt-1">Wheat / Quintal (+8.4% this week)</p>
                        </div>
                    </div>

                    {/* AI Farm Score Card */}
                    <div className="glass-panel p-6 flex flex-col justify-between h-full group border-cyan/30 bg-gradient-to-br from-white to-cyan/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-navy-900 text-white uppercase tracking-wider border border-cyan/40">
                                AI Index
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-navy-900 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AI Farm Score</h3>
                            <p className="text-3xl font-black text-navy-900 tracking-tight">92<span className="text-base text-slate-400 font-bold">/100</span></p>
                            <p className="text-xs font-bold text-teal-800 mt-1">Excellent Operational Index</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. AI FARM INTELLIGENCE (2-Column Layout) */}
            <section id="intelligence" className="space-y-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Predictive Engine</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        AI Farm Intelligence
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Turn farm data into actionable decisions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Interactive Crop Growth Chart */}
                    <div className="lg:col-span-8 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                            <div>
                                <h3 className="text-base font-extrabold text-navy-900 flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2 text-teal-800" />
                                    Crop Growth Telemetry vs AI 5-Day Model
                                </h3>
                                <p className="text-xs text-slate-500">Actual growth metric vs Expected target vs Machine Learning projection</p>
                            </div>
                            <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 self-start sm:self-auto">
                                Live Synced
                            </span>
                        </div>

                        {/* Bar Visualizer */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex justify-between items-stretch h-44 space-x-2 sm:space-x-4">
                                {[
                                    { day: "Mon", actual: 20, expected: 22, ai: 24 },
                                    { day: "Tue", actual: 32, expected: 30, ai: 35 },
                                    { day: "Wed", actual: 45, expected: 42, ai: 48 },
                                    { day: "Thu", actual: 60, expected: 56, ai: 64 },
                                    { day: "Fri", actual: 74, expected: 70, ai: 78 },
                                    { day: "Sat", actual: 88, expected: 82, ai: 92 },
                                    { day: "Sun", actual: 96, expected: 90, ai: 99 },
                                ].map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end items-center group cursor-pointer">
                                        <div className="relative w-full flex justify-center items-end flex-1 space-x-1">
                                            <div className="w-1/3 bg-navy-900 rounded-t-sm" style={{ height: `${d.actual}%` }}></div>
                                            <div className="w-1/3 bg-slate-300 rounded-t-sm" style={{ height: `${d.expected}%` }}></div>
                                            <div className="w-1/3 bg-cyan rounded-t-sm" style={{ height: `${d.ai}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 mt-2">{d.day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center mt-4 space-x-6 border-t border-slate-200 pt-3 text-[11px] font-bold text-slate-600">
                                <div className="flex items-center"><span className="w-2.5 h-2.5 bg-navy-900 rounded-xs mr-1.5"></span> Actual Growth</div>
                                <div className="flex items-center"><span className="w-2.5 h-2.5 bg-slate-300 rounded-xs mr-1.5"></span> Expected Target</div>
                                <div className="flex items-center"><span className="w-2.5 h-2.5 bg-cyan rounded-xs mr-1.5"></span> AI 5-Day Prediction</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Recommendation Card */}
                    <div className="lg:col-span-4 glass-card-dark p-6 sm:p-8 flex flex-col justify-between text-white relative">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan px-2.5 py-1 rounded-full bg-cyan/15 border border-cyan/30">
                                    AI Recommendation
                                </span>
                                <Sparkles className="w-4 h-4 text-cyan" />
                            </div>

                            <h3 className="text-xl font-extrabold leading-snug">
                                Wheat growth is 12% above expected levels.
                            </h3>

                            <p className="text-slate-300 text-xs leading-relaxed">
                                Weather and soil conditions are currently favorable across your localized zone.
                            </p>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                                <p className="text-[10px] font-extrabold uppercase text-lime tracking-wider">Recommended Action</p>
                                <p className="text-xs font-semibold text-white">
                                    Continue current irrigation schedule. Schedule nitrogen foliar top-dressing on Thursday.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPredictModal(true)}
                            className="mt-6 w-full py-3.5 bg-cyan hover:bg-cyan-300 text-navy-900 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
                        >
                            <span>View Full Analysis</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. CROP PREDICTION SECTION */}
            <section id="crop-prediction" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                            Crop Prediction
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Find the crops best suited for your farm.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                        {[
                            { id: "all", label: "All Crops" },
                            { id: "cereals", label: "Cereals" },
                            { id: "cash", label: "Cash Crops" },
                            { id: "pulses", label: "Pulses & Oilseeds" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCropFilter(tab.id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCropFilter === tab.id
                                    ? "bg-navy-900 text-white shadow-xs"
                                    : "text-slate-600 hover:text-navy-900 hover:bg-white"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Crop Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCrops.map((crop) => (
                        <div key={crop.id} className="glass-panel p-6 flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl p-2 rounded-xl bg-slate-100">{crop.icon}</span>
                                        <div>
                                            <h3 className="text-base font-extrabold text-navy-900">{crop.name}</h3>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{crop.category}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 block">AI Match</span>
                                        <span className="text-lg font-black text-teal-800">{crop.suitability}%</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4">{crop.desc}</p>

                                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs mb-5">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Soil</span>
                                        <span className="font-bold text-navy-900">{crop.soil}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Weather</span>
                                        <span className="font-bold text-navy-900">{crop.weather}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block">Yield</span>
                                        <span className="font-bold text-teal-800">{crop.yield.split(" ")[0]}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/dashboard/crop"
                                className="w-full py-2.5 bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200/80"
                            >
                                <span>View Analysis</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. WEATHER INTELLIGENCE & RAIN FORECAST */}
            <section id="weather" className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Weather & Rain Telemetry
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Hyperlocal climatic data, rain precipitation models, and irrigation schedules.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Large Current Weather Card */}
                    <div className="lg:col-span-5 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Forecast</span>
                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan/15 text-teal-800 border border-cyan/30">
                                    20% Rain Probability
                                </span>
                            </div>

                            <div className="flex items-center justify-between my-4">
                                <div>
                                    <div className="text-5xl font-black text-navy-900">28°C</div>
                                    <p className="text-sm font-bold text-amber-600 mt-1">Sunny • Clear Skies</p>
                                </div>
                                <Sun className="w-16 h-16 text-amber-500 animate-spin-slow" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-slate-400 block">Humidity</span>
                                    <strong className="text-navy-900 text-sm">45%</strong>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-slate-400 block">Wind Velocity</span>
                                    <strong className="text-navy-900 text-sm">12 km/h</strong>
                                </div>
                            </div>
                        </div>

                        {/* AI Weather Insight */}
                        <div className="mt-6 p-4 bg-teal-900 text-white rounded-2xl border border-cyan/30 space-y-1">
                            <p className="text-[10px] font-extrabold uppercase text-cyan tracking-wider">AI Weather Insight</p>
                            <p className="text-xs leading-relaxed text-slate-200">
                                "Rainfall probability is low today. Irrigation can be scheduled during the early morning."
                            </p>
                        </div>
                    </div>

                    {/* 5-Day Forecast & Rain Curve */}
                    <div className="lg:col-span-7 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-navy-900 mb-1">5-Day Meteorological Outlook</h3>
                            <p className="text-xs text-slate-500 mb-6">Predicted temperature highs, lows, and precipitation probabilities</p>

                            <div className="grid grid-cols-5 gap-2 text-center text-xs mb-6">
                                {[
                                    { day: "Mon", temp: "28°", icon: "☀️", rain: "10%" },
                                    { day: "Tue", temp: "27°", icon: "🌤️", rain: "20%" },
                                    { day: "Wed", temp: "25°", icon: "🌧️", rain: "80%" },
                                    { day: "Thu", temp: "26°", icon: "⛅", rain: "40%" },
                                    { day: "Fri", temp: "29°", icon: "☀️", rain: "15%" },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 transition-all font-bold">
                                        <p className="text-[10px] text-slate-500">{item.day}</p>
                                        <p className="text-xl my-1.5">{item.icon}</p>
                                        <p className="text-sm font-extrabold text-navy-900">{item.temp}</p>
                                        <span className="text-[9px] text-blue-600 mt-1 block">{item.rain}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                                <CloudRain className="w-5 h-5 text-blue-600" />
                                <div>
                                    <strong className="text-navy-900">Tomorrow: Expected 18 mm Rainfall</strong>
                                    <p className="text-slate-500 text-[11px]">Recommendation: Delay field irrigation by 24 hours.</p>
                                </div>
                            </div>
                            <Link href="/dashboard/rain" className="font-bold text-teal-800 hover:underline flex items-center">
                                View Trend →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. AI CROP HEALTH SCANNER (DISEASE DETECTION) */}
            <section id="disease-detection" className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        AI Crop Health Scanner
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Upload a crop image and let AI identify potential diseases.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Scanner Upload Card */}
                    <div className="lg:col-span-7 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative border-2 border-dashed border-slate-300 hover:border-cyan bg-slate-50/80 hover:bg-white rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all group overflow-hidden"
                        >
                            {isScanning && <div className="animate-scan"></div>}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-navy-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                <UploadCloud className="w-8 h-8 text-teal-800" />
                            </div>

                            <h3 className="text-base font-extrabold text-navy-900 mb-1">
                                Drop crop leaf photo here or click to browse
                            </h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Supports PNG, JPG, JPEG. Camera snaps from smartphones are optimized automatically.
                            </p>

                            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold shadow-xs">
                                <Camera className="w-4 h-4 text-cyan" />
                                <span>Upload / Take Photo</span>
                            </div>
                        </div>

                        {scanError && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-semibold flex items-start space-x-2.5">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                <span>{scanError}</span>
                            </div>
                        )}
                    </div>

                    {/* Result / Diagnosis Card */}
                    <div className="lg:col-span-5 glass-panel p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis Output</span>
                                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                    Pathology CNN Model
                                </span>
                            </div>

                            {scanResult ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
                                        <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">Identified Pathogen</span>
                                        <h4 className="text-lg font-black text-navy-900 mt-0.5">{scanResult.disease}</h4>
                                        <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
                                            <span>Confidence: <strong className="text-navy-900">{scanResult.confidence}%</strong></span>
                                            <span>Severity: <strong className="text-amber-700">{scanResult.severity}</strong></span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                        <p className="text-[10px] font-extrabold uppercase text-teal-800 tracking-wider">Recommended Treatment</p>
                                        <p className="text-xs leading-relaxed text-slate-700 font-medium">
                                            {scanResult.treatment}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-400 space-y-2">
                                    <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                                    <p className="text-xs font-bold text-slate-500">No Leaf Scanned Yet</p>
                                    <p className="text-[11px] max-w-xs mx-auto">Upload an image on the left to run instantaneous neural plant pathology diagnosis.</p>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/dashboard/disease"
                            className="mt-6 w-full py-3 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs text-center block transition-colors"
                        >
                            Open Full Pathology Lab →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. MARKET INTELLIGENCE & AGRI MARKETPLACE */}
            <section id="market" className="space-y-8">
                {/* Market Intelligence */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                            Market Intelligence
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Understand prices before making your next selling decision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 glass-panel p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                <div>
                                    <span className="text-xs text-slate-400 font-bold uppercase">Mandi Benchmark</span>
                                    <h3 className="text-2xl font-black text-navy-900">Wheat: ₹2,100 / Quintal <span className="text-sm font-extrabold text-emerald-600">+8.4%</span></h3>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 bg-cyan/15 text-teal-800 rounded-full border border-cyan/30">
                                    7-Day Upward Trend
                                </span>
                            </div>

                            {/* Price Trend Chart Simulation */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 h-40 flex items-end justify-between space-x-2 text-xs font-bold text-slate-500">
                                {[
                                    { day: "18 Aug", val: 1940 },
                                    { day: "19 Aug", val: 1970 },
                                    { day: "20 Aug", val: 2010 },
                                    { day: "21 Aug", val: 2040 },
                                    { day: "22 Aug", val: 2080 },
                                    { day: "23 Aug", val: 2090 },
                                    { day: "Today", val: 2100 },
                                ].map((p, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-teal-800 rounded-t-sm transition-all" style={{ height: `${(p.val - 1900) * 1.5}%` }}></div>
                                        <span className="text-[10px] mt-2">{p.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4 glass-card-dark p-6 sm:p-8 flex flex-col justify-between text-white">
                            <div className="space-y-3">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan px-2.5 py-1 rounded-full bg-cyan/15 border border-cyan/30">
                                    AI Market Forecast
                                </span>
                                <h4 className="text-lg font-extrabold">Market prices are expected to remain favorable.</h4>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    National buffer demand and export index will likely sustain prices between ₹2,080 - ₹2,160 over the next 7 days.
                                </p>
                            </div>
                            <Link href="/dashboard/market" className="mt-6 text-xs font-bold text-cyan hover:underline flex items-center">
                                View Full Commodities Chart →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Kisan Marketplace Grid */}
                <div id="marketplace" className="space-y-4 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-extrabold text-navy-900">Agri Marketplace</h3>
                            <p className="text-xs text-slate-500">Certified seeds, fertilizers, IoT hardware, and farming equipment</p>
                        </div>

                        {/* Category Selector */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                            {["all", "seeds", "fertilizers", "equipment", "irrigation", "tools"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveMarketCategory(cat)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${activeMarketCategory === cat
                                        ? "bg-navy-900 text-white shadow-xs"
                                        : "text-slate-600 hover:text-navy-900"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="glass-panel p-5 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl p-2 rounded-2xl bg-slate-100">{item.image}</span>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-lime/20 text-teal-900">
                                            {item.discount}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-extrabold text-navy-900 group-hover:text-teal-800 transition-colors">{item.name}</h4>
                                    <div className="flex items-center space-x-1 my-2 text-amber-500 text-xs">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span className="font-bold text-slate-700">{item.rating}</span>
                                    </div>
                                    <div className="flex items-baseline space-x-2 mb-4">
                                        <span className="text-lg font-black text-navy-900">₹{item.price}</span>
                                        <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full py-2.5 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-cyan/30"
                                >
                                    <Plus className="w-4 h-4 text-cyan" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FARM ALERTS SECTION */}
            <section id="alerts" className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Farm Alerts & Advisory Timeline
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Immediate agro-climatic advisories requiring operational attention.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {dailyAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            onClick={() => setSelectedUpdate(alert)}
                            className="glass-panel p-5 cursor-pointer hover:border-cyan/50 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${alert.bg}`}>
                                    {alert.title}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {alert.desc}
                            </p>
                            <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-teal-800 flex items-center justify-between">
                                <span>View advisory details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 9. GOVERNMENT SCHEMES & ELIGIBILITY CHECKER */}
            <section id="schemes" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                            Government Schemes
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Discover farming schemes and benefits you may be eligible for.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowSchemeModal(true)}
                        className="px-5 py-2.5 bg-navy-900 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all border border-cyan/30 self-start sm:self-auto"
                    >
                        <span>Check AI Eligibility</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { title: "PM-Kisan Samman Nidhi", benefit: "₹6,000 / Year", eligibility: "Small & Marginal Farmers", deadline: "31 Oct 2026", status: "Active" },
                        { title: "Pradhan Mantri Fasal Bima (PMFBY)", benefit: "Full Crop Insurance", eligibility: "All Food & Oilseed Crops", deadline: "15 Nov 2026", status: "Open" },
                        { title: "Soil Health Card Scheme", benefit: "Free Nutrient Testing", eligibility: "All Cultivating Landholders", deadline: "Ongoing", status: "Active" },
                        { title: "PM-KUSUM Solar Pump Subsidy", benefit: "Up to 60% Subsidy", eligibility: "Agricultural Power Consumers", deadline: "30 Dec 2026", status: "Open" },
                    ].map((s, idx) => (
                        <div key={idx} className="glass-panel p-5 flex flex-col justify-between group">
                            <div className="space-y-2">
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {s.status}
                                </span>
                                <h4 className="text-sm font-extrabold text-navy-900">{s.title}</h4>
                                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                    <p>Benefit: <strong className="text-teal-800 font-bold">{s.benefit}</strong></p>
                                    <p>Eligible: <span className="text-slate-500">{s.eligibility}</span></p>
                                    <p>Deadline: <span className="text-slate-500">{s.deadline}</span></p>
                                </div>
                            </div>
                            <Link href="/dashboard/schemes" className="mt-4 text-xs font-bold text-navy-900 hover:text-teal-800 flex items-center">
                                <span>Check Eligibility →</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 10. FARM ANALYTICS (Portfolio Metrics Style) */}
            <section id="analytics" className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Farm Analytics & Health Scores
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Comprehensive telemetry scores mapped across operational vectors.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Crop Growth", score: 94, color: "text-emerald-500", bar: "bg-emerald-500", desc: "Optimal vegetative state" },
                        { title: "Soil Health Index", score: 88, color: "text-teal-700", bar: "bg-teal-700", desc: "Balanced NPK and pH 6.5" },
                        { title: "Water Efficiency", score: 82, color: "text-blue-500", bar: "bg-blue-500", desc: "Regulated drip consumption" },
                        { title: "Market Opportunity", score: 91, color: "text-cyan", bar: "bg-cyan", desc: "Peak pricing cycle window" },
                    ].map((m, idx) => (
                        <div key={idx} className="glass-panel p-6 text-center space-y-3">
                            <div className="text-4xl font-black text-navy-900">{m.score}%</div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{m.title}</h4>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${m.bar} rounded-full transition-all duration-1000`} style={{ width: `${m.score}%` }}></div>
                            </div>
                            <p className="text-[11px] text-slate-400">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 11. AI INSIGHTS TIMELINE */}
            <section id="timeline" className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        AI Telemetry Timeline
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Chronological stream of automated farm intelligence events.
                    </p>
                </div>

                <div className="glass-panel p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                        {[
                            { time: "08:30 AM", title: "Weather Analyzed", desc: "Solar radiance 680 W/m² recorded." },
                            { time: "09:15 AM", title: "Growth Updated", desc: "Foliage index up by 12%." },
                            { time: "10:20 AM", title: "Disease Scan Done", desc: "Zero active field pathogens." },
                            { time: "11:00 AM", title: "Market Price Synced", desc: "Wheat at ₹2,100 / Quintal." },
                            { time: "12:30 PM", title: "AI Advisory Ready", desc: "Delay irrigation for tomorrow's rain." },
                        ].map((event, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 relative">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 rounded-full bg-cyan"></span>
                                    <span className="text-[10px] font-mono font-bold text-teal-800">{event.time}</span>
                                </div>
                                <h4 className="text-xs font-extrabold text-navy-900">{event.title}</h4>
                                <p className="text-[11px] text-slate-500">{event.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 12. FOOTER (Matching Reference Portfolio) */}
            <footer className="pt-12 border-t border-slate-200/80 text-xs text-slate-500 space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-navy-900 text-sm">🌱 Smart Farm Assistant</span>
                        <span>— Smarter Decisions. Better Harvests.</span>
                    </div>
                    <div className="flex items-center space-x-4 font-semibold text-slate-600">
                        <a href="#hero" className="hover:text-navy-900">Home</a>
                        <a href="#overview" className="hover:text-navy-900">Overview</a>
                        <a href="#crop-prediction" className="hover:text-navy-900">Crops</a>
                        <a href="#weather" className="hover:text-navy-900">Weather</a>
                        <a href="#disease-detection" className="hover:text-navy-900">Disease</a>
                        <a href="#marketplace" className="hover:text-navy-900">Marketplace</a>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-[11px]">
                    <p>© 2026 Smart Farm Assistant. AI-powered agriculture platform for modern farmers.</p>
                    <p className="mt-1 sm:mt-0 font-medium">Developed for Sai Dhanush MJ • All systems operational</p>
                </div>
            </footer>

            {/* Custom Crop Prediction Simulation Modal */}
            {showPredictModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-teal-800/20 relative">
                        <button onClick={() => setShowPredictModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-navy-900">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-extrabold text-navy-900 mb-1">Custom Field Suitability Simulator</h3>
                        <p className="text-xs text-slate-500 mb-5">Test soil parameters to evaluate crop suitability.</p>

                        <form onSubmit={handleSimulateCustomPrediction} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Soil Type</label>
                                    <select
                                        value={predictFormData.soilType}
                                        onChange={(e) => setPredictFormData({ ...predictFormData, soilType: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                                    >
                                        <option>Loamy</option>
                                        <option>Clayey</option>
                                        <option>Sandy</option>
                                        <option>Black</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Rainfall (mm)</label>
                                    <input
                                        type="number"
                                        value={predictFormData.rainfall}
                                        onChange={(e) => setPredictFormData({ ...predictFormData, rainfall: Number(e.target.value) })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Nitrogen (N)</label>
                                    <input
                                        type="number"
                                        value={predictFormData.nitrogen}
                                        onChange={(e) => setPredictFormData({ ...predictFormData, nitrogen: Number(e.target.value) })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Phosphorus (P)</label>
                                    <input
                                        type="number"
                                        value={predictFormData.phosphorus}
                                        onChange={(e) => setPredictFormData({ ...predictFormData, phosphorus: Number(e.target.value) })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Potassium (K)</label>
                                    <input
                                        type="number"
                                        value={predictFormData.potassium}
                                        onChange={(e) => setPredictFormData({ ...predictFormData, potassium: Number(e.target.value) })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPredicting}
                                className="w-full py-3 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider"
                            >
                                {isPredicting ? "Running ML Model..." : "Calculate AI Suitability"}
                            </button>
                        </form>

                        {modalPrediction && (
                            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-fade-in">
                                <p className="text-xs text-emerald-800 font-bold">Recommended Crop: <strong className="text-base text-navy-900">{modalPrediction.crop}</strong> ({modalPrediction.suitability}% Match)</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Scheme Eligibility Modal */}
            {showSchemeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-teal-800/20 text-center relative">
                        <button onClick={() => setShowSchemeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-navy-900">
                            <X className="w-5 h-5" />
                        </button>
                        <Award className="w-12 h-12 text-teal-800 mx-auto mb-2" />
                        <h3 className="text-lg font-extrabold text-navy-900">AI Scheme Eligibility Check</h3>
                        <p className="text-xs text-slate-500 mb-4">Evaluating your land size (3.5 Acres) & regional Aadhaar KYC status...</p>

                        {schemeCheckResult ? (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 mb-4">
                                {schemeCheckResult}
                            </div>
                        ) : (
                            <button
                                onClick={handleCheckSchemeEligibility}
                                className="w-full py-3 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase mb-4"
                            >
                                Run Eligibility Scan
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Alert Detail Modal */}
            {selectedUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center relative">
                        <button onClick={() => setSelectedUpdate(null)} className="absolute top-4 right-4 text-slate-400 hover:text-navy-900">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-extrabold text-navy-900 mb-1">{selectedUpdate.title}</h3>
                        <p className="text-xs text-slate-500 mb-4">{selectedUpdate.time}</p>
                        <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 leading-relaxed text-left border border-slate-100 mb-5 font-medium">
                            {selectedUpdate.desc}
                        </div>
                        <button
                            onClick={() => setSelectedUpdate(null)}
                            className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl text-xs uppercase"
                        >
                            Acknowledge Advisory
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



