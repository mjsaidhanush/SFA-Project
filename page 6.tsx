"use client";

import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    seller: string;
    category: string;
    image: string;
    url?: string;
}

export default function Marketplace() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [favorites, setFavorites] = useState<number[]>([]);

    const toggleFavorite = (productId: number) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/marketplace/products");
                let data = [];
                if (res.ok) {
                    data = await res.json();
                }

                const richData: Product[] = [
                    { id: 1, name: "Premium Urea Fertilizer (50kg)", price: 1200, category: "Fertilizer", seller: "AgriCorp Ltd.", image: "🌾", url: "https://www.google.com/search?q=buy+premium+urea+fertilizer+50kg" },
                    { id: 2, name: "Mahindra Tractor 575 DI", price: 500000, category: "Equipment", seller: "FarmTech Solutions", image: "🚜", url: "https://www.mahindratractor.com/" },
                    { id: 3, name: "Organic Pesticide Spray (5L)", price: 850, category: "Pesticide", seller: "BioGuard", image: "🧪", url: "https://www.google.com/search?q=buy+organic+pesticide+spray+5l" },
                    { id: 4, name: "Hybrid Corn Seeds (10kg)", price: 3400, category: "Seeds", seller: "National Seed Corp", image: "🌽", url: "https://www.google.com/search?q=buy+hybrid+corn+seeds+10kg" },
                    { id: 5, name: "Drip Irrigation Kit (1 Acre)", price: 14500, category: "Irrigation", seller: "WaterTech India", image: "💧", url: "https://www.google.com/search?q=buy+drip+irrigation+kit+1+acre" },
                    { id: 6, name: "Heavy Duty Plough", price: 25000, category: "Equipment", seller: "AgriMakers", image: "⚙️", url: "https://www.google.com/search?q=buy+heavy+duty+plough" },
                ];

                setProducts(richData);
            } catch (err) {
                console.error("Error fetching market data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ["All", "Equipment", "Seeds", "Fertilizer", "Pesticide", "Irrigation"];

    const filteredProducts = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

    return (
        <div className="space-y-6 animate-fade-in text-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900/40 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-tight">Kisan Marketplace 🛒</h1>
                    <p className="text-gray-400 mt-2 font-medium">Buy & sell verified agricultural products.</p>
                </div>
                <a
                    href="https://seller.indiamart.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap border border-green-500/30 text-center"
                >
                    + Sell Product
                </a>
            </div>

            {/* Categories */}
            <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-none scrollbar-hide hide-scroll-bar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all border ${activeCategory === cat
                            ? "bg-green-600/20 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                            : "bg-gray-900 border-gray-700 text-gray-400 hover:border-green-500/50 hover:text-green-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-gray-800 animate-pulse h-80 rounded-3xl border border-gray-700"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-800 overflow-hidden flex flex-col group h-full">
                            {/* Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center border-b border-gray-800 group-hover:bg-gray-800 transition-colors duration-500">
                                <span className="text-7xl opacity-80 filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">{product.image}</span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md mb-2 inline-block">
                                        {product.category}
                                    </span>
                                    <div
                                        onClick={() => toggleFavorite(product.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-inner border ${favorites.includes(product.id) ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={favorites.includes(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={favorites.includes(product.id) ? 0 : 2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-100 leading-tight mb-2 flex-1">{product.name}</h3>

                                <p className="text-xs text-gray-400 font-medium mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-gray-400"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                                    {product.seller}
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-800 mt-auto pt-4 relative">
                                    <div>
                                        <span className="text-2xl font-extrabold text-white tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
                                    </div>
                                    <a
                                        href={product.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] rounded-xl font-bold transition-all text-sm border border-green-500/30 text-center"
                                    >
                                        Buy Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
