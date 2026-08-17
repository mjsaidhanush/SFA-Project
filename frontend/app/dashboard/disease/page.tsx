"use client";

import { useState } from "react";

export default function DiseaseDetection() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<{ disease: string, confidence: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setAnalysis(null);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        // Mocking the detection
        setTimeout(() => {
            setLoading(false);
            setAnalysis({
                disease: "Leaf Blight (Alternaria spp.)",
                confidence: 94.2
            });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-gray-200">
            <header className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl border border-rose-500/20 relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-rose-500/20 rounded-full mix-blend-screen opacity-20 blur-[80px]"></div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center mb-2 relative z-10">
                    <span className="text-4xl mr-3 drop-shadow-md">🌿</span> Disease Detection
                </h1>
                <p className="text-rose-300 font-medium relative z-10">
                    Upload an image of your crop leaf for instant neural-network analysis.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-800 flex flex-col items-center justify-center min-h-[400px]">
                    <h2 className="text-xl font-bold tracking-tight text-white mb-6 w-full text-left">Upload Leaf Image</h2>

                    <form onSubmit={handleUpload} className="w-full flex-1 flex flex-col justify-between">
                        <label className={`flex flex-col items-center justify-center flex-1 w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all mb-4 ${preview ? 'border-green-500/50 bg-gray-950 hover:bg-gray-900' : 'border-gray-700 bg-gray-950 hover:border-gray-500 hover:bg-gray-900'
                            }`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {preview ? (
                                    <img src={preview} alt="Leaf Preview" className="h-48 object-contain rounded-xl drop-shadow-lg" />
                                ) : (
                                    <>
                                        <svg className="w-12 h-12 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-400 font-bold"><span className="font-extrabold text-rose-400">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">SVG, PNG, JPG or WEBP</p>
                                    </>
                                )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className="w-full px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all border border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Scanning via Neural Network..." : "Analyze Image"}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-800 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center font-bold text-rose-400 tracking-widest uppercase">
                            <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(225,29,72,0.5)]"></div>
                            Processing...
                        </div>
                    )}

                    {analysis ? (
                        <div className="animate-fade-in relative z-10 w-full space-y-6">
                            <span className="text-6xl mb-4 block drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">🔬</span>
                            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl shadow-inner">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Detected Issue</h3>
                                <p className="text-2xl font-extrabold text-white mb-4">
                                    {analysis.disease}
                                </p>
                                <div className="inline-flex items-center px-4 py-2 bg-rose-500/10 text-rose-400 font-bold rounded-full text-sm outline border border-rose-500/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {analysis.confidence.toFixed(1)}% Match
                                </div>
                            </div>

                            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl shadow-inner text-left">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2">Recommended Action</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    Apply copper-based fungicides immediately. Remove severely damaged leaves. Ensure plants have adequate airflow to prevent moisture buildup.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 font-medium">
                            <span className="text-6xl mb-4 block opacity-30 drop-shadow-md">📷</span>
                            <p>Upload a photograph to view AI diagnostics.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
