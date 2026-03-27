"use client";

import { useState } from "react";

export default function AdminPortal() {
    const [datasets, setDatasets] = useState([
        { id: 1, name: "Crop Recommendation Training Data", type: "Tabular (CSV)", size: "45 MB", records: "125,000", updated: "2026-03-01", status: "Active", accuracy: "94.2%" },
        { id: 2, name: "Leaf Disease Image Collection V2", type: "Images (ZIP)", size: "1.2 GB", records: "15,420 images", updated: "2026-02-28", status: "Active", accuracy: "91.8%" },
        { id: 3, name: "Regional Weather Logs 2025", type: "JSON", size: "18 MB", records: "8,760", updated: "2026-02-15", status: "Archived", accuracy: "N/A" },
        { id: 4, name: "Market Prices Real-time Sync", type: "API Stream", size: "Continuous", records: "450,000+", updated: "2026-03-02", status: "Active", accuracy: "98.5%" }
    ]);

    const [showUpload, setShowUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [datasetName, setDatasetName] = useState("");
    const [showInfoModal, setShowInfoModal] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            if (!datasetName) {
                setDatasetName(e.target.files[0].name.split('.')[0]);
            }
        }
    };

    const handleUploadSubmit = () => {
        if (!selectedFile || !datasetName) {
            alert("Please provide both a file and a dataset name.");
            return;
        }

        const newDataset = {
            id: datasets.length + 1,
            name: datasetName,
            type: selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
            size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
            records: "Processing...",
            updated: new Date().toISOString().split('T')[0],
            status: "Processing",
            accuracy: "N/A"
        };

        setDatasets([newDataset, ...datasets]);
        setShowUpload(false);
        setSelectedFile(null);
        setDatasetName("");

        setTimeout(() => {
            setDatasets(prev =>
                prev.map(ds => ds.id === newDataset.id ? { ...ds, status: "Active", accuracy: "Evaluating", records: "Scan Complete" } : ds)
            );
        }, 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in text-gray-200">
            <header className="flex justify-between items-center mb-8 bg-gray-900/40 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/10">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 tracking-tight flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        Dataset Administration
                        <button onClick={() => setShowInfoModal(true)} className="ml-3 text-gray-400 hover:text-purple-400 transition-colors" title="Why do we need this?">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </h1>
                    <p className="text-gray-400 mt-1 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => setShowInfoModal(true)}>Manage, upload, and monitor the datasets powering the Smart Farm ML models. (Click to learn more)</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload New Dataset
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center">
                    <div className="p-4 bg-purple-500/10 rounded-xl mr-4 border border-purple-500/20"><span className="text-2xl">🧠</span></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">Total ML Models</p>
                        <p className="text-2xl font-black text-white">4 Active</p>
                    </div>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center">
                    <div className="p-4 bg-blue-500/10 rounded-xl mr-4 border border-blue-500/20"><span className="text-2xl">🗄️</span></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">Total Storage Used</p>
                        <p className="text-2xl font-black text-white">1.3 GB</p>
                    </div>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center">
                    <div className="p-4 bg-green-500/10 rounded-xl mr-4 border border-green-500/20"><span className="text-2xl">⚡</span></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">Avg. Prediction Accuracy</p>
                        <p className="text-2xl font-black text-white">94.8%</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Available Datasets</h3>
                    <div className="relative">
                        <input type="text" placeholder="Search datasets..." className="bg-gray-800 text-sm text-white px-4 py-2 rounded-lg border border-gray-700 outline-none focus:border-purple-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Dataset Name</th>
                                <th className="p-4 font-semibold">Type / Format</th>
                                <th className="p-4 font-semibold">Size / Records</th>
                                <th className="p-4 font-semibold">Model Accuracy</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {datasets.map((ds) => (
                                <tr key={ds.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-200">{ds.name}</p>
                                        <p className="text-xs text-gray-400">Updated: {ds.updated}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700 text-gray-300 text-xs">{ds.type}</span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        <p className="font-medium">{ds.size}</p>
                                        <p className="text-xs text-gray-400">{ds.records}</p>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`font-bold ${ds.accuracy.startsWith('9') ? 'text-green-400' : 'text-gray-400'}`}>{ds.accuracy}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ds.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-8000/10 text-gray-400 border-gray-500/20'}`}>
                                            {ds.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20" title="Train Model">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                            <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20" title="Delete Dataset">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 max-w-lg w-full relative">
                        <button
                            onClick={() => {
                                setShowUpload(false);
                                setSelectedFile(null);
                                setDatasetName("");
                            }}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-500/20 rounded-full p-2 transition-all shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="p-8">
                            <h2 className="text-2xl font-extrabold text-white mb-6">Upload New Dataset</h2>
                            <input
                                type="file"
                                id="dataset-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="dataset-upload"
                                className={`border-2 border-dashed ${selectedFile ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'} rounded-2xl p-8 text-center hover:border-purple-500 hover:bg-purple-500/10 transition-colors cursor-pointer mb-6 flex flex-col items-center justify-center`}
                            >
                                {selectedFile ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-purple-300 font-bold">{selectedFile.name}</p>
                                        <p className="text-purple-500/70 text-sm mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        <p className="text-gray-300 font-medium">Click to browse or drag & drop file</p>
                                        <p className="text-gray-400 text-sm mt-2">Supports any document format</p>
                                    </>
                                )}
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 font-medium mb-1">Dataset Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                        placeholder="e.g., Summer Crops 2026"
                                        value={datasetName}
                                        onChange={(e) => setDatasetName(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleUploadSubmit}
                                    disabled={!selectedFile || !datasetName}
                                    className={`w-full font-bold py-3 rounded-xl shadow-lg transition-colors mt-4 ${(!selectedFile || !datasetName) ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                                >
                                    Start Upload & Processing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 rounded-3xl shadow-2xl border border-purple-500/30 max-w-2xl w-full relative overflow-hidden">
                        <button
                            onClick={() => setShowInfoModal(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-500/20 rounded-full p-2 transition-all shadow-lg z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-4 bg-purple-500/10 rounded-2xl mr-4 border border-purple-500/20 text-purple-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white">Why Use the Dataset Admin Portal?</h2>
                                    <p className="text-purple-400 text-sm font-medium">Core Intelligence Engine</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
                                <p>
                                    The <strong className="text-white">Dataset Administration</strong> portal is the heart of the Smart Farm Assistant's Artificial Intelligence features. Here is why we need it:
                                </p>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner">
                                    <h4 className="text-indigo-400 font-bold mb-2 flex items-center"><span className="text-lg mr-2">🧠</span> 1. Training AI Models</h4>
                                    <p className="text-gray-400">Our Machine Learning models (like Crop Prediction and Leaf Disease Detection) start out "empty". They need thousands of records of historical farming data and plant images to learn patterns and make accurate predictions for farmers.</p>
                                </div>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner">
                                    <h4 className="text-green-400 font-bold mb-2 flex items-center"><span className="text-lg mr-2">📈</span> 2. Continuous Improvement</h4>
                                    <p className="text-gray-400">As agriculture evolves, market prices change, and new crop diseases emerge, our AI needs updated information. Admins can upload new CSVs or ZIP files to retrain the models, ensuring the chatbot and predictions never become outdated.</p>
                                </div>
                                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner">
                                    <h4 className="text-blue-400 font-bold mb-2 flex items-center"><span className="text-lg mr-2">🗄️</span> 3. Resource Management</h4>
                                    <p className="text-gray-400">Datasets are massive (often gigabytes). This portal allows you to track storage usage, see which datasets are actively powering our Python APIs, and delete old archives to save expensive server space.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="w-full mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-colors"
                            >
                                I understand!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
