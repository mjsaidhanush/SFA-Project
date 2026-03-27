"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [showDailyUpdate, setShowDailyUpdate] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
    const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
    const [calendarDate, setCalendarDate] = useState(new Date());

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
                    // Urgent Siren Sound
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.3);
                    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.6);
                    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.9);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.5);
                } else if (update.alertColor === 'orange') {
                    // Warning Beep
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.setValueAtTime(400, ctx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1);
                } else {
                    // Notification Ding
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
            desc: "Historical view: Soil moisture at 45%. NPK levels optimal. No disease detected in latest crop scans. Recommended scheduled irrigation in 2 days.",
            time: "End of Day Report",
            alertColor: "blue",
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            border: "border-blue-500/20"
        };
        handleUpdateClick(historicUpdate);
    };

    const dailyUpdatesList = [
        { state: "AP", title: "Cyclone Warning", desc: "Red Alert! Severe cyclone storm approaching coastal districts. Evacuate low-lying areas immediately and halt all farming activities.", time: "5 mins ago", alertColor: "red", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
        { state: "MH", title: "Heavy Rainfall", desc: "Orange Alert! Heavy to very heavy rainfall expected in Vidarbha region. Delay sowing and protect harvested crops.", time: "15 mins ago", alertColor: "orange", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
        { state: "WB", title: "Strong Winds", desc: "Yellow Alert! High velocity winds predicted. Secure greenhouse covers and temporary structures.", time: "1 hour ago", alertColor: "yellow", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
        { state: "PB", title: "MSP Bonus", desc: "Govt announces new MSP bonus for early wheat procurement.", time: "2 hours ago", alertColor: "green", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
        { state: "UP", title: "Seed Availability", desc: "Subsidized sugarcane seeds now available in block offices.", time: "4 hours ago", alertColor: "blue", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
        { state: "KA", title: "Scheme Reopened", desc: "Krishi Bhagya scheme portal reopened for new borewell applications.", time: "6 hours ago", alertColor: "purple", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    return (
        <div className="space-y-6 animate-fade-in text-gray-800 relative">
            <header className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div
                    className="cursor-pointer group relative z-10"
                    onClick={() => setShowProjectInfo(true)}
                >
                    <h1 className="text-3xl font-extrabold text-[#1E3B2D] tracking-tight flex items-center group-hover:text-[#76A85B] transition-colors">
                        Overview
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#76A85B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </h1>
                    <p className="text-gray-500 mt-1 transition-colors font-medium">Here's your farm summary for today. (Click for project details)</p>
                </div>
                <div
                    className="text-right hidden sm:block cursor-pointer group"
                    onClick={() => setShowDailyUpdate(true)}
                >
                    <p className="text-sm font-bold text-gray-400 transition-colors uppercase tracking-wider">Current Date</p>
                    <p className="font-extrabold text-2xl text-[#1E3B2D] flex items-center justify-end group-hover:text-[#76A85B] transition-colors mt-1">
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#76A85B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </p>
                </div>
            </header>

            {/* Daily Update Modal */}
            {showDailyUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 max-w-lg w-full relative">
                        <button
                            onClick={() => setShowDailyUpdate(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-500/20 rounded-full p-2 transition-all shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="p-8">
                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Farm Calendar
                                </div>
                            </h2>
                            <div className="text-gray-300">
                                <div className="flex justify-between items-center mb-6 border border-gray-800 bg-gray-950 p-3 rounded-2xl">
                                    <button onClick={prevMonth} className="text-cyan-500 hover:text-white bg-cyan-500/10 hover:bg-cyan-600 p-2 rounded-xl transition-colors shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <h3 className="text-xl font-bold text-white tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
                                    <button onClick={nextMonth} className="text-cyan-500 hover:text-white bg-cyan-500/10 hover:bg-cyan-600 p-2 rounded-xl transition-colors shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-2 mb-3 text-center">
                                    {dayNames.map(day => (
                                        <div key={day} className="text-gray-500 font-bold text-sm tracking-wider">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="p-3"></div>
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => handleDateClick(day)}
                                                className={`p-3 rounded-xl text-sm font-bold transition-all cursor-pointer border ${isToday
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 border-blue-400/50 hover:bg-blue-500'
                                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-500 shadow-inner'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="mt-8 text-center pt-6 border-t border-gray-800">
                                <button onClick={() => setShowDailyUpdate(false)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-colors border border-gray-600 shadow-lg w-full">
                                    Close Calendar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Information Modal */}
            {showProjectInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                        <button
                            onClick={() => setShowProjectInfo(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-500/20 rounded-full p-2 transition-all shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="p-8 md:p-10">
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6 drop-shadow-sm">Smart Farm Assistant</h2>
                            <div className="space-y-6 text-gray-300">
                                <p className="text-lg leading-relaxed"><strong className="text-white">Smart Farm Assistant</strong> is a revolutionary AI-powered agricultural intelligence platform designed to empower farmers with data-driven insights and modern farming tools.</p>

                                <div>
                                    <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">Key Features</h3>
                                    <ul className="list-none space-y-3 text-sm text-gray-400">
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">AI Crop Prediction:</strong> Machine learning models predict best crops based on Nitrogen, Phosphorous, Potassium (NPK), temp, humidity, pH, and rainfall.</span></li>
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">Weather & Rain Forecast:</strong> Real-time climatic trend analysis to optimize watering and harvesting schedules.</span></li>
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">Crop Disease Detection:</strong> Advanced image recognition to instantly detect and navigate solutions for crop illnesses.</span></li>
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">Kisan Marketplace:</strong> A dedicated portal to seamlessly buy equipment, seeds, fertilizers, or securely sell agricultural returns.</span></li>
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">Government Schemes:</strong> Active synchronization directly to verified state/central government agricultural subsidies.</span></li>
                                        <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span><strong className="text-gray-200">Expert AI Chatbot:</strong> 24/7 intelligent conversational assistant to solve on-the-spot queries.</span></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">Technology Stack</h3>
                                    <div className="flex flex-wrap gap-2 text-xs font-bold font-mono">
                                        <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 hover:-translate-y-0.5 transition-all text-blue-400 rounded-full border border-blue-500/20 shadow-inner">Next.js (React)</a>
                                        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 hover:-translate-y-0.5 transition-all text-cyan-400 rounded-full border border-cyan-500/20 shadow-inner">Tailwind CSS</a>
                                        <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 hover:-translate-y-0.5 transition-all text-green-400 rounded-full border border-green-500/20 shadow-inner">Node.js (Express)</a>
                                        <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 hover:-translate-y-0.5 transition-all text-emerald-400 rounded-full border border-emerald-500/20 shadow-inner">MongoDB</a>
                                        <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 hover:-translate-y-0.5 transition-all text-yellow-500 rounded-full border border-yellow-500/20 shadow-inner">Python (FastAPI)</a>
                                        <a href="https://scikit-learn.org/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 hover:-translate-y-0.5 transition-all text-orange-400 rounded-full border border-orange-500/20 shadow-inner">Scikit-Learn (ML)</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Local Weather" value="28°C" sub="Sunny, 45% Humidity" icon="☀️" color="text-yellow-400" href="/dashboard/rain" />
                <StatCard title="Recommended Crop" value="Wheat" sub="Ideal soil conditions" icon="🌾" color="text-green-400" href="/dashboard/crop" />
                <StatCard title="Market Trend (Max)" value="₹2,100" sub="Wheat / Quintal" icon="📈" color="text-emerald-400" href="/dashboard/market" />
                <StatCard title="Disease Alerts" value="0" sub="No risks detected" icon="🛡️" color="text-blue-400" href="/dashboard/disease" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                    <h3 className="text-xl font-bold text-[#1E3B2D] mb-4 tracking-tight">Predictive analysis</h3>
                    <div className="flex-1 min-h-[16rem] bg-[#F4F6F4] rounded-2xl border border-gray-100 p-6 flex flex-col justify-end">
                        <div className="flex justify-between items-stretch h-48 space-x-2">
                            {[
                                { day: "Mon", actual: 15, expected: 18 },
                                { day: "Tue", actual: 28, expected: 25 },
                                { day: "Wed", actual: 35, expected: 35 },
                                { day: "Thu", actual: 50, expected: 48 },
                                { day: "Fri", actual: 65, expected: 60 },
                                { day: "Sat", actual: 78, expected: 72 },
                                { day: "Sun", actual: 92, expected: 85 },
                            ].map((data, index) => (
                                <Link
                                    key={index}
                                    href="/dashboard/crop"
                                    className="flex-1 flex flex-col justify-end items-center group cursor-pointer hover:bg-white/50 rounded-lg pt-4 pb-2 transition-colors relative h-full"
                                >
                                    <div className="relative w-full flex justify-center items-end flex-1 px-1">
                                        {/* Actual Growth Bar */}
                                        <div
                                            className="w-1/2 bg-[#1E3B2D] rounded-t-sm transition-all group-hover:bg-[#204E3A] relative"
                                            style={{ height: `${data.actual}%` }}
                                        >
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#1E3B2D] bg-[#C6F370] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                                                {data.actual}%
                                            </div>
                                        </div>
                                        {/* Expected Growth Bar */}
                                        <div
                                            className="w-1/2 bg-gray-300 rounded-t-sm transition-all ml-1 opacity-70"
                                            style={{ height: `${data.expected}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 font-bold">{data.day}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center justify-center mt-6 space-x-6 border-t border-gray-200 pt-5 text-gray-600">
                            <div className="flex items-center text-xs font-bold"><span className="w-3 h-3 bg-[#1E3B2D] rounded-sm mr-2"></span> Actual Growth (%)</div>
                            <div className="flex items-center text-xs font-bold"><span className="w-3 h-3 bg-gray-300 rounded-sm mr-2"></span> Expected Growth (%)</div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#E9F4E5] rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full max-h-[22rem] relative overflow-hidden">
                    <h3 className="text-xl font-bold text-[#1E3B2D] mb-2 tracking-tight flex items-center justify-between">
                        <span>Daily State Updates</span>
                        {dailyUpdatesList.some(u => ['red', 'orange', 'yellow'].includes(u.alertColor) && !acknowledgedAlerts.includes(u.title)) && (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </h3>
                    <p className="text-sm font-bold text-[#76A85B] mb-4">Latest farm alerts and news</p>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <ul className="space-y-4 pb-2">
                            {dailyUpdatesList.map((update, idx) => {
                                const isAcknowledged = acknowledgedAlerts.includes(update.title);
                                return (
                                    <li
                                        key={idx}
                                        className={`flex items-start group cursor-pointer hover:bg-white/40 p-2 -mx-2 rounded-xl transition-all ${isAcknowledged ? 'opacity-50 grayscale' : ''}`}
                                        onClick={() => handleUpdateClick(update)}
                                    >
                                        <span className={`${isAcknowledged ? 'bg-gray-200 text-gray-500' : `${update.bg} text-gray-700 border border-gray-100`} p-2 flex items-center justify-center font-bold rounded-xl mr-3 text-sm shadow-sm mt-1 relative w-10 h-10`}>
                                            {update.state}
                                            {!isAcknowledged && update.alertColor === 'red' && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span></span>}
                                            {!isAcknowledged && update.alertColor === 'orange' && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span></span>}
                                            {!isAcknowledged && update.alertColor === 'yellow' && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span></span>}
                                        </span>
                                        <div className="flex-1">
                                            <p className={`text-sm font-bold text-[#1E3B2D] transition-colors line-clamp-2`}>{update.title}</p>
                                            <p className={`text-xs text-gray-600 mt-0.5 line-clamp-1`}>{update.desc}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 font-bold flex items-center uppercase">{update.time}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Alert Modal */}
            {selectedUpdate && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className={`bg-gray-900 rounded-3xl shadow-2xl border ${selectedUpdate.border} max-w-md w-full relative overflow-hidden transform transition-all scale-100`}>
                        {selectedUpdate.alertColor === 'red' && <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse shadow-[0_0_20px_rgb(239,68,68)]"></div>}
                        {selectedUpdate.alertColor === 'orange' && <div className="absolute top-0 left-0 w-full h-2 bg-orange-500 animate-pulse shadow-[0_0_20px_rgb(249,115,22)]"></div>}
                        {selectedUpdate.alertColor === 'yellow' && <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 animate-pulse shadow-[0_0_20px_rgb(250,204,21)]"></div>}

                        <button
                            onClick={() => setSelectedUpdate(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-all shadow-lg z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="p-8 text-center pt-10">
                            <div className={`mx-auto w-20 h-20 rounded-full ${selectedUpdate.bg} flex items-center justify-center mb-6 border ${selectedUpdate.border} shadow-lg relative`}>
                                <span className="text-4xl">{selectedUpdate.alertColor === 'red' ? '🚨' : selectedUpdate.alertColor === 'orange' ? '⚠️' : selectedUpdate.alertColor === 'yellow' ? '🔔' : 'ℹ️'}</span>
                            </div>
                            <h2 className={`text-3xl font-extrabold ${selectedUpdate.text} mb-2 tracking-tight`}>{selectedUpdate.title}</h2>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">Region: {selectedUpdate.state}</p>

                            <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-gray-300 text-base leading-relaxed mb-8 shadow-inner text-left">
                                {selectedUpdate.desc}
                            </div>

                            <button
                                onClick={() => {
                                    if (!acknowledgedAlerts.includes(selectedUpdate.title)) {
                                        setAcknowledgedAlerts(prev => [...prev, selectedUpdate.title]);
                                    }
                                    setSelectedUpdate(null);
                                }}
                                className={`w-full py-4 px-6 rounded-xl font-bold transition-all text-lg ${selectedUpdate.alertColor === 'red' ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:-translate-y-1' :
                                    selectedUpdate.alertColor === 'orange' ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:-translate-y-1' :
                                        selectedUpdate.alertColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:-translate-y-1' :
                                            'bg-gray-800 hover:bg-gray-700 text-white shadow-lg shadow-black group hover:-translate-y-1 border border-gray-700'
                                    }`}
                            >
                                Acknowledge Alert Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, sub, icon, color, href }: any) {
    const isSpecial = icon === "🌾" || icon === "☀️";

    const CardContent = (
        <div className={`p-6 rounded-3xl border border-gray-100 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md ${isSpecial ? 'bg-[#1E3B2D] text-white' : 'bg-white'}`}>
            <div className={`flex justify-between items-start mb-6 ${isSpecial ? 'text-white' : 'text-gray-500'}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
                <span className={`text-2xl ${isSpecial ? '' : color} transition-transform duration-300 group-hover:scale-110`}>{icon}</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                {isSpecial ? (
                    <div className="text-6xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                        {icon === "🌾" ? "🌱" : "🥑"}
                    </div>
                ) : null}
                <p className={`text-3xl font-extrabold tracking-tight ${isSpecial ? 'text-white' : 'text-[#1E3B2D]'} mb-1`}>{value}</p>
                <div className="flex items-center justify-center">
                    <p className={`text-sm font-bold ${isSpecial ? 'text-[#C6F370]' : 'text-gray-500'}`}>{sub}</p>
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}
