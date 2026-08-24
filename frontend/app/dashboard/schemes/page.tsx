"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, ExternalLink, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface Scheme {
    id: number;
    name: string;
    benefit: string;
    eligibility: string;
    deadline: string;
    status: string;
    url?: string;
}

export default function GovtSchemes() {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const richData: Scheme[] = [
            { id: 1, name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", benefit: "₹6,000 per year in 3 equal installments", eligibility: "Small & Marginal Farmers (< 2 hectares)", deadline: "Open Registration", status: "Active", url: "https://pmkisan.gov.in/" },
            { id: 2, name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", benefit: "Comprehensive crop insurance with low farmer premium", eligibility: "All loanee and non-loanee farmers", deadline: "31 Oct 2026", status: "Open", url: "https://pmfby.gov.in/" },
            { id: 3, name: "Kisan Credit Card (KCC) Crop Loan", benefit: "Concessional credit limit up to ₹3,00,000 at 4% interest", eligibility: "All cultivating farmers, tenants & sharecroppers", deadline: "Open Year Round", status: "Active", url: "https://myscheme.gov.in/schemes/kcc" },
            { id: 4, name: "PM-KUSUM Solar Agri-Pump Subsidy", benefit: "Up to 60% capital subsidy for off-grid solar irrigation pumps", eligibility: "Individual farmers & water user groups", deadline: "15 Nov 2026", status: "Open", url: "https://pgsindia-ncof.gov.in/" },
            { id: 5, name: "National Agriculture Market (e-NAM)", benefit: "Direct digital trading platform across national Mandis", eligibility: "Registered FPOs, farmers & traders", deadline: "Continuous", status: "Active", url: "https://enam.gov.in/web/" },
        ];
        setSchemes(richData);
        setLoading(false);
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-navy-900 animate-fade-in pb-10">
            {/* Header Banner */}
            <header className="glass-card-dark text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-cyan/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy-900 text-cyan flex items-center justify-center font-bold shadow-lg border border-cyan/40">
                        <FileText className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-cyan/15 rounded-full text-[11px] font-bold text-cyan mb-1 border border-cyan/30">
                            <Sparkles className="w-3 h-3" />
                            <span>Central & State Schemes</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Government Schemes & Subsidies</h1>
                        <p className="text-xs text-slate-300 mt-0.5">Discover verified financial support, insurance, and subsidy programs.</p>
                    </div>
                </div>

                <a
                    href="https://www.myscheme.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 px-5 py-3 bg-navy-900 hover:bg-teal-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-cyan/30 flex items-center space-x-2"
                >
                    <span>Check All Eligibility</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan" />
                </a>
            </header>

            {/* Scheme Cards */}
            <div className="space-y-4">
                {schemes.map((scheme) => (
                    <div key={scheme.id} className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                                    {scheme.status}
                                </span>
                                {scheme.deadline !== "Open Registration" && (
                                    <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                                        Deadline: {scheme.deadline}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base font-extrabold text-navy-900 group-hover:text-teal-800 transition-colors">
                                {scheme.name}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Key Benefit</span>
                                    <p className="text-xs font-bold text-teal-800 mt-0.5">{scheme.benefit}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Eligibility Criteria</span>
                                    <p className="text-xs font-medium text-slate-600 mt-0.5">{scheme.eligibility}</p>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 flex md:flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 md:border-l md:pl-6">
                            <a
                                href={scheme.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none px-5 py-2.5 bg-navy-900 hover:bg-teal-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all border border-cyan/30"
                            >
                                <span>Apply Now</span>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                            </a>
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(scheme.name + " official pdf guidelines")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-navy-900 font-bold rounded-xl text-xs text-center hover:bg-slate-50 transition-colors"
                            >
                                Guidelines PDF
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

