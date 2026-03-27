"use client";

import { useEffect, useState } from "react";

interface Scheme {
    id: number;
    name: string;
    benefit: string;
    eligibility: string;
    deadline: string;
    url?: string;
}

export default function GovtSchemes() {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/govt-schemes");
                if (res.ok) {
                    await res.json();
                }

                const richData: Scheme[] = [
                    { id: 1, name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", benefit: "₹6,000 per year in 3 equal installments", eligibility: "Small & Marginal Farmers (< 2 hectares)", deadline: "Open", url: "https://pmkisan.gov.in/" },
                    { id: 2, name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", benefit: "Comprehensive crop insurance cover", eligibility: "All loanee and non-loanee farmers", deadline: "July 31st", url: "https://pmfby.gov.in/" },
                    { id: 3, name: "Kisan Credit Card (KCC)", benefit: "Short term credit limit up to ₹3,000,000 at 4% interest", eligibility: "All farmers, tenants, share croppers", deadline: "Open Year Round", url: "https://myscheme.gov.in/schemes/kcc" },
                    { id: 4, name: "Paramparagat Krishi Vikas Yojana", benefit: "₹50,000 per hectare for 3 years for organic farming", eligibility: "Clustered organic farmers", deadline: "August 15th", url: "https://pgsindia-ncof.gov.in/" },
                    { id: 5, name: "National Agriculture Market (e-NAM)", benefit: "Unified national market for commodities", eligibility: "Registered FPOs and Farmers", deadline: "Continuous Registration", url: "https://enam.gov.in/web/" },
                ];

                setSchemes(richData);
            } catch (err) {
                console.error("Error fetching schemes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-gray-200">
            <header className="bg-gradient-to-r from-blue-900 to-indigo-950 p-8 rounded-3xl shadow-xl relative overflow-hidden border border-blue-900/50">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-screen opacity-10 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center drop-shadow-md">
                            📑 Government Schemes
                        </h1>
                        <p className="text-blue-300 font-medium">Find and apply for state and central agricultural subsidies.</p>
                    </div>
                    <a
                        href="https://www.myscheme.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 md:mt-0 px-6 py-3 bg-blue-600/20 border border-blue-500 text-blue-300 font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:bg-blue-600/40 hover:text-white transition-all text-sm block text-center"
                    >
                        Check My Eligibility
                    </a>
                </div>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-900 animate-pulse rounded-2xl border border-gray-800"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                    {schemes.map((scheme) => (
                        <div key={scheme.id} className="bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">Active Scheme</span>
                                    {scheme.deadline !== "Open" && scheme.deadline !== "Open Year Round" && scheme.deadline !== "Continuous Registration" && (
                                        <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider flex items-center shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Due: {scheme.deadline}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors leading-tight mb-3">
                                    {scheme.name}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Benefit</p>
                                        <p className="text-sm text-gray-300 font-medium bg-gray-950 p-2.5 rounded-lg border border-gray-800">{scheme.benefit}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Eligibility</p>
                                        <p className="text-sm text-gray-300 font-medium bg-gray-950 p-2.5 rounded-lg border border-gray-800">{scheme.eligibility}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-800 md:border-l pl-0 md:pl-6">
                                <a
                                    href={scheme.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] text-sm flex items-center justify-center border border-transparent hover:border-blue-400 text-center"
                                >
                                    Apply Now
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(scheme.name + " official pdf guidelines")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 md:flex-none px-6 py-3 bg-gray-950 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-gray-400 hover:text-gray-200 font-bold rounded-xl transition-colors text-sm text-center"
                                >
                                    Save PDF Info
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
