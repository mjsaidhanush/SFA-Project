"use client";

import { useState } from "react";

export default function RainForecast() {
    const [location, setLocation] = useState("");
    const [forecast, setForecast] = useState<{ 
        city: string, 
        temperature: number,
        humidity: number,
        rainfall: number,
        prediction: string,
        error?: string
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:8000/api/weather/predict?city=${encodeURIComponent(location)}`, {
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
                alert("Failed to fetch rain forecast.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to Live API Service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-gray-200">
            <header className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl border border-blue-500/20 relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/20 rounded-full mix-blend-screen opacity-20 blur-[80px]"></div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center mb-2 relative z-10">
                    <span className="text-4xl mr-3 drop-shadow-md">🌧️</span> Live Rain Forecast Prediction
                </h1>
                <p className="text-blue-300 font-medium relative z-10">
                    Get real-time meteorological conditions and ML-driven live weather condition forecasts for any city.
                </p>
            </header>

            <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-800">
                <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-4 mb-10 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Enter Region / City</label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Hyderabad, Mahbubnagar"
                            className="w-full px-5 py-4 rounded-xl bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-600 transition-all font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !location.trim()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all border border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center whitespace-nowrap"
                    >
                        {loading ? "Analyzing..." : "Get Live Forecast"}
                    </button>
                </form>

                {forecast ? (
                    <div className="space-y-6 animate-fade-in relative z-10">
                        <div className="bg-gray-950 border border-blue-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl z-0 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl text-gray-400 uppercase tracking-widest font-bold mb-1">Region</h3>
                                <p className="text-3xl text-white font-extrabold">{forecast.city}</p>
                            </div>
                            <div className="relative z-10 text-center bg-gray-900 border border-gray-800 px-8 py-6 rounded-2xl shadow-inner min-w-[200px]">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Live Prediction</p>
                                <p className={`text-4xl font-extrabold flex items-center justify-center gap-3 ${
                                    forecast.prediction === 'Sunny' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                                    forecast.prediction === 'Rain' ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]' :
                                    forecast.prediction === 'Thunderstorm' ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]' :
                                    'text-gray-300'
                                }`}>
                                    {forecast.prediction === 'Sunny' && "☀️"}
                                    {forecast.prediction === 'Rain' && "🌧️"}
                                    {forecast.prediction === 'Thunderstorm' && "⛈️"}
                                    {forecast.prediction === 'Cloudy' && "☁️"}
                                    {forecast.prediction === 'Fog' && "🌫️"}
                                    <span>{forecast.prediction}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in relative z-10">
                            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
                                <span className="text-4xl">🌡️</span>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Temp</p>
                                    <p className="text-2xl text-white font-extrabold">{forecast.temperature}°C</p>
                                </div>
                            </div>
                            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
                                <span className="text-4xl">💧</span>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Humidity</p>
                                    <p className="text-2xl text-white font-extrabold">{forecast.humidity}%</p>
                                </div>
                            </div>
                            <div className="bg-gray-950 border border-blue-500/30 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
                                <span className="text-4xl">☔</span>
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Rain Volume</p>
                                    <p className="text-2xl text-blue-300 font-extrabold">{forecast.rainfall} mm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/50 text-gray-400">
                        <span className="text-5xl mb-4 opacity-50 block">⛅</span>
                        <p className="font-medium">Enter a location above to see ML-driven forecasts and live weather.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

