"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) {
            router.push("/login");
            return;
        }
        let parsedUser = JSON.parse(storedUser);

        // Automatically clean up the test name into the proper requested name
        if (parsedUser.name && parsedUser.name.toLowerCase().includes("xsxsxssai")) {
            parsedUser.name = "Sai Dhanush MJ";
            localStorage.setItem("user", JSON.stringify(parsedUser));
        }

        setUser(parsedUser);
    }, [router]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-green-500">Loading...</div>;
    }

    const navLinks = [
        { name: "Overview", href: "/dashboard", icon: "📊" },
        { name: "Crop Prediction", href: "/dashboard/crop", icon: "🌱" },
        { name: "Rain Forecast", href: "/dashboard/rain", icon: "🌧️" },
        { name: "Disease Detection", href: "/dashboard/disease", icon: "🌿" },
        { name: "Marketplace", href: "/dashboard/market", icon: "🛒" },
        { name: "Govt Schemes", href: "/dashboard/schemes", icon: "📑" },
        { name: "AI Chatbot", href: "/dashboard/chatbot", icon: "🤖" },
    ];

    if (user?.role && user.role.toLowerCase() === 'admin') {
        navLinks.push({ name: "Admin Portal", href: "/dashboard/admin", icon: "⚙️" });
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[#F4F6F4] text-gray-800 flex flex-col md:flex-row relative overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1E3B2D] border-r border-[#1E3B2D] flex flex-col hidden md:flex relative z-10 rounded-tr-3xl rounded-br-3xl my-2 ml-2 shadow-2xl">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center hidden md:flex leading-tight">
                        <span className="text-[#C6F370] mr-2 text-2xl">🌱</span> Smart Farm<br />Assistant
                    </h2>
                    <div className="mt-8">
                        <p className="text-white font-bold block truncate capitalize text-lg mt-0.5" title={user.name}>{user.name}</p>
                        <span className="text-[#1E3B2D] text-[10px] uppercase font-black tracking-widest bg-[#C6F370] px-2.5 py-1 rounded-md mt-2 inline-block shadow-sm">{user.role}</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent mt-4">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href}>
                                <div
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group mb-2 ${isActive
                                        ? "bg-[#C6F370] text-[#1E3B2D] font-bold shadow-[0_0_15px_rgba(198,243,112,0.2)]"
                                        : "text-white/80 hover:bg-white/5 hover:text-white border border-transparent"
                                        }`}
                                >
                                    <span className={`mr-3 text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                                    {link.name}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-white/80 font-bold hover:text-white transition-all duration-300 group"
                    >
                        Logout <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <div className="mt-6 p-4 bg-[#76A85B]/20 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-white font-bold text-sm">New!</h4>
                            <p className="text-white/80 text-xs mt-1 leading-snug">Ready to discover new farmers blog?</p>
                        </div>
                        <div className="absolute -bottom-4 -right-2 text-6xl opacity-40">🍐</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative z-10 px-4 md:px-8 py-4">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#1E3B2D] rounded-xl p-4 flex items-center justify-between mb-4 shadow-lg text-white">
                    <h2 className="text-xl font-bold flex items-center">
                        <span className="text-[#C6F370] mr-2">🌱</span> Smart Farm
                    </h2>
                    <button onClick={handleLogout} className="text-[#C6F370] hover:text-white font-medium text-sm">Logout</button>
                </header>

                <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}
