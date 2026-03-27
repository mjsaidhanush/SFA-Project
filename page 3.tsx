"use client";

import { useState } from "react";

export default function CropPrediction() {
    const [formData, setFormData] = useState({
        state_name: "Andhra Pradesh",
        district_name: "ANANTAPUR",
        season: "Kharif",
        soil_type: "Loamy",
        nitrogen: 20,
        phosphorus: 20,
        potassium: 20,
        temperature: 25.0,
        humidity: 60.0,
        rainfall: 150.0,
        ph: 6.5,
    });

    const [prediction, setPrediction] = useState<{ crop: string, confidence: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/crop/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setPrediction({ crop: data.predicted_crop, confidence: data.confidence });
            } else {
                alert("Failed to predict crop. Ensure ML Service is running.");
            }
        } catch (err) {
            console.error(err);
            alert("Error reaching ML Service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-gray-200">
            <header className="bg-gray-900/40 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/10">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-tight">
                    Crop Recommendation ML
                </h1>
                <p className="text-gray-400 mt-2">
                    Enter your soil and environmental metrics to get an AI-powered crop recommendation.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/40 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/10">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6">Input Parameters</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">State</label>
                                <input
                                    type="text"
                                    value={formData.state_name}
                                    onChange={(e) => setFormData({ ...formData, state_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">District</label>
                                <input
                                    type="text"
                                    value={formData.district_name}
                                    onChange={(e) => setFormData({ ...formData, district_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Season</label>
                                <select
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 text-white"
                                >
                                    <option>Kharif</option>
                                    <option>Rabi</option>
                                    <option>Summer</option>
                                    <option>Whole Year</option>
                                    <option>Autumn</option>
                                    <option>Winter</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Soil Type</label>
                                <select
                                    value={formData.soil_type}
                                    onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 text-white"
                                >
                                    <option>Loamy</option>
                                    <option>Clay</option>
                                    <option>Sandy</option>
                                    <option>Silt</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">pH Level</label>
                                <input
                                    type="number" step="0.1"
                                    value={formData.ph}
                                    onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Nitrogen (N)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.nitrogen} onChange={(e) => setFormData({ ...formData, nitrogen: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Phosphorus (P)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.phosphorus} onChange={(e) => setFormData({ ...formData, phosphorus: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Potassium (K)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.potassium} onChange={(e) => setFormData({ ...formData, potassium: parseInt(e.target.value) })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Temp (°C)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Humidity (%)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.humidity} onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Rainfall (mm)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 outline-none text-white focus:ring-2 focus:ring-green-500/50"
                                    value={formData.rainfall} onChange={(e) => setFormData({ ...formData, rainfall: parseFloat(e.target.value) })} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all border border-green-500/30"
                        >
                            {loading ? "Running Model..." : "Predict Optimal Crop"}
                        </button>
                    </form>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-2xl shadow-xl border border-green-500/20 flex flex-col justify-center text-center relative overflow-hidden">
                    {/* decorative blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full filter blur-[50px] pointer-events-none"></div>

                    {prediction ? (
                        <div className="animate-fade-in relative z-10">
                            <span className="text-6xl mb-4 block drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]">🌾</span>
                            <h3 className="text-xl font-medium text-emerald-400 tracking-tight">AI Recommendation</h3>
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 my-4 drop-shadow-sm">
                                {prediction.crop}
                            </p>
                            <div className="inline-block px-4 py-2 bg-green-500/10 text-green-400 font-bold rounded-full text-sm outline border border-green-500/30">
                                {(prediction.confidence * 100).toFixed(1)}% Confidence
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 font-medium relative z-10">
                            <span className="text-6xl mb-4 block opacity-30 drop-shadow-md">🤖</span>
                            <p className="text-gray-400">Awaiting your inputs...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
