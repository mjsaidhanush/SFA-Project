"use client";

import { useEffect, useState } from "react";
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
    ShieldAlert
} from "lucide-react";

export default function Dashboard() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [showDailyUpdate, setShowDailyUpdate] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
    const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getTimeShift = (date: Date | null) => {
        if (!date) return { label: "Daily Telemetry", icon: "🌾", tag: "Daily Update", badgeClass: "bg-blue-500/20 text-blue-300 border-blue-400/30" };
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) {
            return { label: "Morning Farm Update", icon: "🌅", tag: "Morning Shift", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
        } else if (hour >= 12 && hour < 17) {
            return { label: "Afternoon Farm Update", icon: "☀️", tag: "Afternoon Shift", badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
        } else if (hour >= 17 && hour < 21) {
            return { label: "Evening Farm Update", icon: "🌆", tag: "Evening Shift", badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" };
        } else {
            return { label: "Night Telemetry Shift", icon: "🌙", tag: "Night Shift", badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
        }
    };

    const timeShift = getTimeShift(currentTime);

    // Scanner state
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();

    const handleUpdateClick = (update: any) => {
        setSelectedUpdate(update);
        if (['red', 'orange', 'yellow'].includes(update.alertColor)) {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                if (update.alertColor === 'red') {
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.3);
                    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.6);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.5);
                } else if (update.alertColor === 'orange') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.setValueAtTime(400, ctx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1);
                } else {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(500, ctx.currentTime);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
                }

                osc.start();
                osc.stop(ctx.currentTime + 1.5);
            } catch (e) {
                console.error('Audio play failed', e);
            }
        }
    };

    const handleDateClick = (day: number) => {
        const historicUpdate = {
            state: "Farm",
            title: `Farm Log: ${monthNames[currentMonth]} ${day}, ${currentYear}`,
            desc: "Historical telemetry: Soil moisture at 45%. NPK levels optimal. No leaf rust detected. Scheduled irrigation recommended in 2 days.",
            time: "End of Day Telemetry",
            alertColor: "blue",
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            border: "border-blue-500/20"
        };
        handleUpdateClick(historicUpdate);
    };

    const dailyUpdatesList = [
        { state: "AP", title: "Cyclone Warning", desc: "Red Alert! Severe cyclone storm approaching coastal districts. Evacuate low-lying areas immediately and halt all farming activities.", time: "5 mins ago", alertColor: "red", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
        { state: "MH", title: "Heavy Rainfall", desc: "Orange Alert! Heavy rainfall expected tomorrow. Delay sowing and protect harvested crops.", time: "15 mins ago", alertColor: "orange", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
        { state: "WB", title: "Strong Winds", desc: "Yellow Alert! High velocity winds predicted. Secure greenhouse covers and temporary structures.", time: "1 hour ago", alertColor: "yellow", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
        { state: "PB", title: "Crop Growth Optimal", desc: "Green Alert! Wheat crop growth is 12% above expected levels across Vidarbha region.", time: "2 hours ago", alertColor: "green", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const simulateScanner = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScannedImage("leaf_rust_sample");
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in text-[#212422] relative pb-12">
            {/* Section 5: Premium Hero Banner */}
            <section className="relative bg-[#1E293B] rounded-3xl p-6 md:p-10 text-white shadow-xl overflow-hidden border border-blue-400/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-xs font-bold text-blue-400">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                <span>AI Agricultural Telemetry Platform 🌾</span>
                            </div>
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${timeShift.badgeClass} flex items-center space-x-1`}>
                                <span>{timeShift.icon}</span>
                                <span>{timeShift.tag}</span>
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Your Farm. <br className="hidden sm:inline" />
                            <span className="text-blue-400">Smarter Decisions.</span> <br />
                            Better Harvests. 🚜🌾
                        </h1>

                        <p className="text-white/70 text-sm md:text-base font-normal leading-relaxed">
                            AI-powered insights to help you make better farming decisions, monitor climatic telemetry, and boost crop yields.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                                href="/dashboard/crop"
                                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 text-white hover:bg-blue-500 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/30 hover:scale-105 transition-all border border-blue-400/30"
                            >
                                <span>View Farm Insights</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setShowProjectInfo(true)}
                                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/15 transition-all"
                            >
                                System Details
                            </button>
                        </div>
                    </div>

                    {/* Subtle Agricultural Visual Graphics & Live Daily Clock */}
                    <div className="relative lg:w-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden space-y-4">
                        <div className="flex justify-between items-center text-xs text-blue-400 font-bold">
                            <span className="flex items-center space-x-1.5"><Activity className="w-4 h-4 animate-pulse text-blue-400" /> Telemetry Live</span>
                            <span className="text-white/60 text-[10px]">Zone A-4</span>
                        </div>

                        {/* Live Date & Time Display Card */}
                        <div className="bg-black/30 p-3.5 rounded-xl border border-white/15 text-white">
                            <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-400 uppercase tracking-wider mb-1">
                                <span>{timeShift.label}</span>
                                <span>{timeShift.icon}</span>
                            </div>
                            <div className="text-lg font-black text-white tracking-tight">
                                {currentTime ? currentTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
                            </div>
                            <div className="text-xs font-semibold text-white/80 mt-0.5">
                                📅 {currentTime ? currentTime.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "Loading date..."}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-white text-xs">
                            <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                                <p className="text-white/60 text-[10px]">Soil Moisture</p>
                                <p className="text-base font-extrabold text-blue-400 mt-0.5">45%</p>
                                <p className="text-[9px] text-cyan-300">Optimal Field</p>
                            </div>
                            <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                                <p className="text-white/60 text-[10px]">AI Prediction</p>
                                <p className="text-base font-extrabold text-cyan-300 mt-0.5">+12% Yield</p>
                                <p className="text-[9px] text-white/60">5-Day Outlook</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-white/80 border-t border-white/10 pt-2">
                            <span>IoT Sensor Node #12</span>
                            <span className="text-blue-400 font-bold">Connected 🔵</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Specs Modal */}
            {showProjectInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1E293B] rounded-3xl shadow-2xl border border-blue-400/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-white">
                        <button
                            onClick={() => setShowProjectInfo(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/10 rounded-full p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-8">
                            <h2 className="text-3xl font-extrabold text-blue-400 mb-2 flex items-center">
                                Smart Farm Assistant 🚜🌾
                            </h2>
                            <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-6">AI Agriculture SaaS Platform</p>
                            <div className="space-y-4 text-sm text-gray-300">
                                <p>Smart Farm Assistant integrates Scikit-Learn machine learning, weather forecasting telemetry, plant pathology CNN image recognition, and marketplace logistics into a unified modern interface.</p>
                                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10"><strong className="text-white">AI Crop Predictor:</strong> Multi-parameter ML modeling.</div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10"><strong className="text-white">Weather Forecast:</strong> Real-time climatic telemetry.</div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10"><strong className="text-white">Disease Diagnosis:</strong> Automated plant pathology scan.</div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10"><strong className="text-white">Kisan Marketplace:</strong> Seed & equipment trading.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 6: Overview Statistics Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Farm Weather"
                    value="28°C"
                    sub="Sunny • 45% Humidity"
                    icon={Sun}
                    badge="Live Telemetry"
                    badgeColor="bg-amber-50 text-amber-700 border-amber-200"
                    iconBg="bg-amber-50 text-amber-500"
                    href="/dashboard/rain"
                />
                <StatCard
                    title="Recommended Crop"
                    value="Wheat"
                    sub="92% Suitability Match"
                    icon={Sprout}
                    badge="Optimal Soil"
                    badgeColor="bg-blue-500/20 text-blue-300 border-blue-400/50"
                    iconBg="bg-blue-600 text-white"
                    href="/dashboard/crop"
                    highlight
                />
                <StatCard
                    title="Market Price"
                    value="₹2,100"
                    sub="Wheat / Quintal (+8.4% this week)"
                    icon={TrendingUp}
                    badge="High Demand"
                    badgeColor="bg-blue-50 text-blue-700 border-blue-200"
                    iconBg="bg-blue-50 text-blue-600"
                    href="/dashboard/market"
                />
                <StatCard
                    title="Disease Risk"
                    value="Low"
                    sub="0 Active Field Threats"
                    icon={ShieldCheck}
                    badge="Field Protected"
                    badgeColor="bg-cyan-50 text-cyan-600 border-cyan-200"
                    iconBg="bg-cyan-50 text-cyan-600"
                    href="/dashboard/disease"
                />
            </section>

            {/* Section 7 & 8: AI Farm Intelligence & Weather Telemetry */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Crop Growth Prediction Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <div>
                            <h3 className="text-lg font-extrabold text-[#1E293B] flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                                AI Farm Intelligence — Crop Growth Prediction 🌾
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">Actual vs Expected Growth vs AI 5-Day Prediction Model</p>
                        </div>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                            Updated 5m ago
                        </span>
                    </div>

                    {/* Chart Container */}
                    <div className="bg-[#F6F8F2] rounded-2xl border border-gray-200/70 p-5 flex flex-col justify-end min-h-[16rem]">
                        <div className="flex justify-between items-stretch h-48 space-x-2 sm:space-x-3">
                            {[
                                { day: "Mon", actual: 18, expected: 20, ai: 22 },
                                { day: "Tue", actual: 30, expected: 28, ai: 32 },
                                { day: "Wed", actual: 42, expected: 40, ai: 45 },
                                { day: "Thu", actual: 58, expected: 54, ai: 60 },
                                { day: "Fri", actual: 72, expected: 68, ai: 76 },
                                { day: "Sat", actual: 86, expected: 80, ai: 90 },
                                { day: "Sun", actual: 95, expected: 90, ai: 98 },
                            ].map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col justify-end items-center group cursor-pointer hover:bg-white p-1 rounded-xl transition-all relative">
                                    <div className="relative w-full flex justify-center items-end flex-1 space-x-1 px-0.5">
                                        <div className="w-1/3 bg-[#1E293B] rounded-t-sm transition-all relative" style={{ height: `${data.actual}%` }}>
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-white bg-blue-600 px-1 py-0.5 rounded shadow whitespace-nowrap z-20">
                                                {data.actual}%
                                            </div>
                                        </div>
                                        <div className="w-1/3 bg-gray-300 rounded-t-sm" style={{ height: `${data.expected}%` }}></div>
                                        <div className="w-1/3 bg-blue-500 rounded-t-sm" style={{ height: `${data.ai}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold mt-2">{data.day}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center mt-4 space-x-6 border-t border-gray-200 pt-3 text-[11px] font-bold text-gray-600">
                            <div className="flex items-center"><span className="w-2.5 h-2.5 bg-[#1E293B] rounded-sm mr-1.5"></span> Actual Growth</div>
                            <div className="flex items-center"><span className="w-2.5 h-2.5 bg-gray-300 rounded-sm mr-1.5"></span> Expected Growth</div>
                            <div className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1.5"></span> AI Prediction</div>
                        </div>
                    </div>

                    {/* AI Insight Box */}
                    <div className="mt-4 p-4 bg-[#1E293B] text-white rounded-2xl flex items-start space-x-3 shadow-md border border-blue-400/30">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">AI Telemetry Insight 🌾</h4>
                            <p className="text-xs text-white/90 leading-relaxed mt-0.5">
                                "Your wheat crop is showing <strong>12% higher growth</strong> than expected. Weather conditions are favorable for the next 5 days."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weather Intelligence Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-[#212422] flex items-center">
                                <Sun className="w-5 h-5 mr-2 text-amber-500" /> Weather Intelligence
                            </h3>
                            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                20% Rain Prob
                            </span>
                        </div>

                        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 mb-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-3xl font-extrabold text-[#212422]">28°C</p>
                                    <p className="text-xs font-bold text-amber-800 mt-0.5">Sunny • Clear Skies</p>
                                </div>
                                <div className="text-right text-xs text-gray-600 space-y-1 font-semibold">
                                    <p>Humidity: <strong className="text-gray-900">45%</strong></p>
                                    <p>Wind: <strong className="text-gray-900">12 km/h</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* 5-Day Forecast mini-grid */}
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">5-Day Outlook</p>
                        <div className="grid grid-cols-5 gap-1.5 text-center text-xs mb-4">
                            {[
                                { day: "Mon", temp: "28°", icon: "☀️" },
                                { day: "Tue", temp: "27°", icon: "🌤️" },
                                { day: "Wed", temp: "25°", icon: "🌧️" },
                                { day: "Thu", temp: "26°", icon: "⛅" },
                                { day: "Fri", temp: "29°", icon: "☀️" },
                            ].map((item, idx) => (
                                <div key={idx} className="p-2 bg-[#F6F8F2] rounded-xl border border-gray-200/70 font-bold">
                                    <p className="text-[10px] text-gray-500">{item.day}</p>
                                    <p className="my-1 text-sm">{item.icon}</p>
                                    <p className="text-[11px] text-[#212422]">{item.temp}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Weather Recommendation */}
                    <div className="p-3.5 bg-[#F6F8F2] rounded-2xl border border-blue-300 flex items-center space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-extrabold text-[#1E293B] uppercase tracking-wider">AI Recommendation 🌦️</p>
                            <p className="text-xs font-bold text-[#1E293B]">"Good conditions for irrigation today."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 9 & 10: Crop Recommendation & AI Disease Scanner */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crop Recommendation Visualizer */}
                <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-[#1E293B] flex items-center">
                                <Sprout className="w-5 h-5 mr-2 text-blue-600" /> Top Recommended Crop
                            </h3>
                            <span className="text-xs font-extrabold text-white bg-blue-600 px-3 py-1 rounded-full shadow-xs">
                                92% AI Suitability Match
                            </span>
                        </div>

                        <div className="p-5 bg-[#1E293B] text-white rounded-2xl mb-5 flex items-center justify-between border border-blue-400/30">
                            <div>
                                <span className="text-xs text-blue-400 font-extrabold uppercase tracking-wider">Primary Recommendation</span>
                                <h4 className="text-3xl font-extrabold mt-1">Wheat 🌾🚜</h4>
                                <p className="text-xs text-white/70 mt-1">Optimal soil NPK & temperature match</p>
                            </div>
                            <div className="text-right bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                                <p className="text-[10px] text-white/70 uppercase font-bold">Expected Yield</p>
                                <p className="text-xl font-extrabold text-blue-400 mt-0.5">4.8 tons/ha</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs font-bold">
                            <div>
                                <div className="flex justify-between mb-1 text-gray-700">
                                    <span>Soil Compatibility</span>
                                    <span className="text-blue-700">94%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1 text-gray-700">
                                    <span>Weather Compatibility</span>
                                    <span className="text-blue-700">91%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '91%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1 text-gray-700">
                                    <span>Market Demand Index</span>
                                    <span className="text-blue-700">89%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '89%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/crop"
                        className="mt-6 w-full py-3.5 bg-[#1E293B] text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl font-extrabold text-xs text-center block transition-all shadow-md border border-blue-400/30"
                    >
                        View Full Crop Analysis →
                    </Link>
                </div>

                {/* AI Crop Health Scanner */}
                <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60 relative">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-[#1E293B] flex items-center">
                                <ShieldAlert className="w-5 h-5 mr-2 text-blue-600" /> AI Crop Health Scanner
                            </h3>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                CNN Diagnosis
                            </span>
                        </div>

                        {/* Scanner Upload Box */}
                        <div
                            onClick={simulateScanner}
                            className="relative border-2 border-dashed border-blue-400 hover:border-blue-600 bg-[#F6F8F2] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white group"
                        >
                            {isScanning && <div className="animate-scan"></div>}
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#1E293B] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                                <UploadCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="font-extrabold text-xs text-[#1E293B]">Upload Leaf Photo or Take Snap 📸</p>
                            <p className="text-[11px] text-gray-500 mt-1">Supports PNG, JPG (Click to simulate scan)</p>
                        </div>

                        {/* Diagnostic Results */}
                        <div className="mt-4 p-4 bg-[#F6F8F2] rounded-2xl border border-gray-200 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-gray-700">Diagnosis Status:</span>
                                <span className="text-blue-700 font-extrabold flex items-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Leaf Rust Detected
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-600">
                                <span>AI Confidence: <strong>94%</strong></span>
                                <span>Severity: <strong className="text-amber-600">Moderate</strong></span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600">
                                <strong className="text-[#1E293B]">Recommended Treatment:</strong> Apply copper-based fungicide and schedule field drainage within 48 hours.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 11, 12, 13: Rain, Market & Daily Farm Alerts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rainfall Prediction */}
                <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60">
                    <div>
                        <h3 className="text-base font-extrabold text-[#1E293B] flex items-center mb-3">
                            <CloudRain className="w-5 h-5 mr-2 text-cyan-600" /> Rainfall Telemetry
                        </h3>

                        <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-200/60 mb-4">
                            <div className="flex justify-between items-center text-xs">
                                <div>
                                    <p className="text-gray-500 font-semibold">Tomorrow's Forecast</p>
                                    <p className="text-2xl font-extrabold text-cyan-900 mt-0.5">18 mm</p>
                                </div>
                                <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full">
                                    Heavy Precipitation
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-[#1E293B] text-blue-400 rounded-2xl text-xs font-medium border border-blue-400/30">
                            <strong>AI Alert:</strong> "Heavy rainfall expected tomorrow. Consider delaying irrigation."
                        </div>
                    </div>

                    <Link href="/dashboard/rain" className="mt-4 text-xs font-extrabold text-blue-700 hover:underline flex items-center">
                        View 7-Day Rainfall Trend →
                    </Link>
                </div>

                {/* Market Intelligence */}
                <div className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-blue-200/60">
                    <div>
                        <h3 className="text-base font-extrabold text-[#1E293B] flex items-center mb-3">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> Market Intelligence
                        </h3>

                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/60 mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Wheat Market Price</p>
                                    <p className="text-2xl font-extrabold text-[#1E293B] mt-0.5">₹2,100 / Quintal</p>
                                </div>
                                <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                                    +8.4%
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-[#1E293B] text-blue-400 rounded-2xl text-xs font-medium border border-blue-400/30">
                            <strong>AI Market Prediction:</strong> "Prices are expected to increase over the next 7 days."
                        </div>
                    </div>

                    <Link href="/dashboard/market" className="mt-4 text-xs font-extrabold text-blue-700 hover:underline flex items-center">
                        View Marketplace Analytics →
                    </Link>
                </div>

                {/* Daily Farm Alerts */}
                <div className="bg-[#1E293B] rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl border border-blue-400/30">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-extrabold text-white flex items-center">
                                <Bell className="w-5 h-5 mr-2 text-blue-400" /> Daily Farm Alerts 🚨
                            </h3>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        </div>

                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {dailyUpdatesList.map((alert, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleUpdateClick(alert)}
                                    className="p-3 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 cursor-pointer transition-all flex items-start space-x-3"
                                >
                                    <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${alert.alertColor === 'red' ? 'bg-red-500 animate-pulse' :
                                        alert.alertColor === 'orange' ? 'bg-orange-500' :
                                            alert.alertColor === 'yellow' ? 'bg-amber-400' : 'bg-blue-400'
                                        }`}></span>
                                    <div>
                                        <p className="text-xs font-bold text-white">{alert.title}</p>
                                        <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">{alert.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Alert Detail Modal */}
            {selectedUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1E293B] rounded-3xl shadow-2xl border border-blue-400/30 max-w-md w-full p-6 text-white text-center relative">
                        <button onClick={() => setSelectedUpdate(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-2xl font-extrabold text-blue-400 mb-2">{selectedUpdate.title}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Region: {selectedUpdate.state}</p>
                        <div className="p-4 bg-black/30 rounded-2xl text-xs leading-relaxed text-gray-200 mb-6 text-left border border-white/10">
                            {selectedUpdate.desc}
                        </div>
                        <button
                            onClick={() => setSelectedUpdate(null)}
                            className="w-full py-3.5 bg-blue-600 text-white hover:bg-blue-500 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg border border-blue-400/30"
                        >
                            Acknowledge Alert
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, sub, icon: Icon, badge, badgeColor, iconBg, href, highlight }: any) {
    const CardContent = (
        <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-md ${highlight
            ? 'bg-[#1E293B] border-blue-400/40 text-white'
            : 'bg-white border-blue-200/60 hover:border-[#1E293B]'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${highlight ? 'bg-blue-600 text-white' : iconBg} transition-transform duration-300 group-hover:scale-110 shadow-xs font-bold`}>
                    <Icon className="w-5 h-5" />
                </div>
                {badge && (
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${highlight ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>

            <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-white/70' : 'text-gray-500'}`}>{title}</h3>
                <p className={`text-2xl font-extrabold tracking-tight ${highlight ? 'text-white' : 'text-[#1E293B]'}`}>{value}</p>
                <p className={`text-xs font-bold mt-1 ${highlight ? 'text-blue-400' : 'text-blue-700'}`}>{sub}</p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}


