"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Sparkles, Plus, Star, Heart, ExternalLink, ArrowRight } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    seller: string;
    category: string;
    image: string;
    rating?: number;
    discount?: string;
    url?: string;
}

export default function Marketplace() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [favorites, setFavorites] = useState<number[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartToast, setCartToast] = useState<string | null>(null);

    const toggleFavorite = (productId: number) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const handleAddToCart = (item: Product) => {
        setCartCount(prev => prev + 1);
        setCartToast(`Added ${item.name} to Cart`);
        setTimeout(() => setCartToast(null), 3000);
    };

    useEffect(() => {
        const richData: Product[] = [
            { id: 1, name: "Premium Bio-Organic Fertilizer (50kg)", price: 890, originalPrice: 1100, category: "Fertilizer", seller: "AgriBio Corp", image: "🧪", rating: 4.8, discount: "19% OFF" },
            { id: 2, name: "Hybrid Super Shriram Wheat Seeds (40kg)", price: 1450, originalPrice: 1800, category: "Seeds", seller: "National Seed Corp", image: "🌾", rating: 4.9, discount: "20% OFF" },
            { id: 3, name: "IoT Solar Smart Soil Moisture Sensor Node", price: 3200, originalPrice: 4000, category: "Equipment", seller: "SmartFarm IoT", image: "📟", rating: 5.0, discount: "20% OFF" },
            { id: 4, name: "Automated Drip Irrigation Micro-Kit (1 Acre)", price: 6500, originalPrice: 7900, category: "Irrigation", seller: "WaterTech India", image: "💧", rating: 4.9, discount: "18% OFF" },
            { id: 5, name: "Copper Foliage Fungicide Spray (1L)", price: 680, originalPrice: 850, category: "Fertilizer", seller: "BioGuard", image: "🌿", rating: 4.8, discount: "20% OFF" },
            { id: 6, name: "Ergonomic Multi-Blade Paddy Weeder Tool", price: 1250, originalPrice: 1600, category: "Equipment", seller: "AgriMakers", image: "🛠️", rating: 4.7, discount: "22% OFF" },
        ];
        setProducts(richData);
        setLoading(false);
    }, []);

    const categories = ["All", "Seeds", "Fertilizer", "Equipment", "Irrigation"];
    const filteredProducts = activeCategory === "All" ? products : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="max-w-5xl mx-auto space-y-6 text-navy-900 animate-fade-in pb-10">
            {/* Toast Notification */}
            {cartToast && (
                <div className="fixed top-20 right-6 z-50 bg-navy-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan/40 flex items-center space-x-2.5 animate-bounce">
                    <Sparkles className="w-4 h-4 text-cyan" />
                    <span className="text-xs font-bold">{cartToast}</span>
                </div>
            )}

            {/* Header Banner */}
            <header className="glass-card-dark text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-cyan/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy-900 text-cyan flex items-center justify-center font-bold shadow-lg border border-cyan/40">
                        <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-cyan/15 rounded-full text-[11px] font-bold text-cyan mb-1 border border-cyan/30">
                            <Sparkles className="w-3 h-3" />
                            <span>Verified Kisan Agri Products</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kisan Marketplace</h1>
                        <p className="text-xs text-slate-300 mt-0.5">Certified seeds, bio-fertilizers, IoT telemetry sensors, and tools.</p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/15 text-xs font-bold text-cyan flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Cart: {cartCount} Items</span>
                    </div>
                </div>
            </header>

            {/* Category Filter Pills */}
            <div className="flex space-x-2 overflow-x-auto py-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold text-xs transition-all border ${activeCategory === cat
                            ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                            : "bg-white border-slate-200/80 text-slate-600 hover:text-navy-900 hover:border-cyan"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="glass-panel p-6 rounded-3xl flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100">{product.image}</span>
                                <div className="flex items-center space-x-2">
                                    {product.discount && (
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-lime/20 text-teal-900">
                                            {product.discount}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => toggleFavorite(product.id)}
                                        className={`p-1.5 rounded-xl border ${favorites.includes(product.id) ? 'bg-red-50 text-red-500 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-red-500'}`}
                                    >
                                        <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                                {product.category}
                            </span>
                            <h3 className="text-base font-extrabold text-navy-900 group-hover:text-teal-800 transition-colors leading-snug">
                                {product.name}
                            </h3>

                            <div className="flex items-center space-x-1 my-2 text-amber-500 text-xs font-bold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-slate-700">{product.rating}</span>
                                <span className="text-slate-400 font-medium text-[11px] ml-1">• {product.seller}</span>
                            </div>

                            <div className="flex items-baseline space-x-2 my-4">
                                <span className="text-2xl font-black text-navy-900">₹{product.price.toLocaleString("en-IN")}</span>
                                {product.originalPrice && (
                                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-3 bg-navy-900 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all border border-cyan/30"
                        >
                            <Plus className="w-4 h-4 text-cyan" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

