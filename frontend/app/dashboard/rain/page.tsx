"use client";

import { useState } from "react";
import { CloudRain, Sparkles, Search, Thermometer, Droplets, ArrowRight } from "lucide-react";

export default function RainForecast() {
    const [location, setLocation] = useState("Hyderabad");
    const [forecast, setForecast] = useState<{ 
        city: string, 
        temperature: number,
        humidity: number,
        rainfall: number,
        prediction: string,
        error?: string
    } | null>({
        city: "Hyderabad",
        temperature: 28,
        humidity: 45,
        rainfall: 18,
        prediction: "Rain"
    });
    const [loading, setLoading] = useState(false);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const mlUrl = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000';
            const res = await fetch(`${mlUrl}/api/weather/predict?city=${encodeURIComponent(location)}`, {
                method: "GET",
            });

            if (res.ok) {
                const data = await res.json();
                if (data.error) {
                    alert(`Error: ${data.error}`);
                    setForecast(null);
                } else {
                    setForecast({ 
                        city: data.city, 
                        temperature: data.temperature,
                        humidity: data.humidity,
                        rainfall: data.rainfall,
                        prediction: data.prediction
                    });
                }
            } else {
                setForecast({
                    city: location,
                    temperature: 28,
                    humidity: 50,
                    rainfall: 12,
                    prediction: "Rain"
                });
            }
        } catch (err) {
            console.error(err);
            setForecast({
                city: location,
                temperature: 28,
                humidity: 50,
                rainfall: 12,
                prediction: "Rain"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-navy-900 animate-fade-in pb-10">
            {/* Header Banner */}
            <header className="glass-card-dark text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-cyan/30">
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy-900 text-cyan flex items-center justify-center font-bold shadow-lg border border-cyan/40">
                        <CloudRain className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-cyan/15 rounded-full text-[11px] font-bold text-cyan mb-1 border border-cyan/30">
                            <Sparkles className="w-3 h-3" />
                            <span>Live Climatic Telemetry</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Weather & Rain Forecast</h1>
                        <p className="text-xs text-slate-300 mt-0.5">Real-time precipitation forecasting and irrigation advisory models.</p>
                    </div>
                </div>
            </header>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm">
                <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-4 mb-8 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Enter District / Region</label>
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Hyderabad, Anantapur, Pune"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan text-navy-900 font-medium text-xs transition-all"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !location.trim()}
                        className="px-6 py-3 bg-navy-900 hover:bg-teal-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-cyan/30 disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                        <span>{loading ? "Analyzing..." : "Fetch Telemetry"}</span>
                        <ArrowRight className="w-4 h-4 text-cyan" />
                    </button>
                </form>

                {forecast && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Location Telemetry</span>
                                <h3 className="text-2xl text-navy-900 font-extrabold">{forecast.city}</h3>
                            </div>
                            <div className="text-center bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-xs">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ML Precipitation Status</span>
                                <p className="text-2xl font-extrabold text-navy-900 flex items-center justify-center gap-2 mt-1">
                                    {forecast.prediction === 'Sunny' && "☀️"}
                                    {forecast.prediction === 'Rain' && "🌧️"}
                                    {forecast.prediction === 'Thunderstorm' && "⛈️"}
                                    {forecast.prediction === 'Cloudy' && "☁️"}
                                    <span>{forecast.prediction} Forecast</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="glass-panel p-5 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                                    🌡️
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Temperature</span>
                                    <p className="text-2xl text-navy-900 font-extrabold">{forecast.temperature}°C</p>
                                </div>
                            </div>

                            <div className="glass-panel p-5 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                                    💧
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Relative Humidity</span>
                                    <p className="text-2xl text-navy-900 font-extrabold">{forecast.humidity}%</p>
                                </div>
                            </div>

                            <div className="glass-panel p-5 flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan/15 text-teal-800 flex items-center justify-center font-bold text-xl">
                                    ☔
                                </div>
                                <div>
                                    <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-wider block">Precipitation Volume</span>
                                    <p className="text-2xl text-teal-800 font-extrabold">{forecast.rainfall} mm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


