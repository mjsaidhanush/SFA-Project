"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShieldCheck,
    Users,
    Sprout,
    Activity,
    CloudRain,
    TrendingUp,
    FileText,
    Bot,
    Bell,
    BarChart3,
    User as UserIcon,
    Settings,
    LogOut,
    Search,
    Plus,
    CheckCircle2,
    AlertTriangle,
    Eye,
    Edit3,
    Trash2,
    RefreshCw,
    X,
    ChevronRight,
    Sparkles,
    Sliders,
    Globe,
    Cpu,
    Radio,
    Thermometer,
    Droplets,
    Wind,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Lock
} from "lucide-react";

// Approved Administrator Allowlist
const ADMIN_EMAILS = [
    'mjsaidhanush@gmail.com',
    'purush361@gmail.com'
];

export default function AdminConsole() {
    const router = useRouter();

    // Active Navigation Tab
    const [activeTab, setActiveTab] = useState<
        "dashboard" | "farmers" | "crops" | "disease" | "weather" | "market" | "schemes" | "ai" | "notifications" | "analytics" | "profile" | "settings"
    >("dashboard");

    // Authorization & User State
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Profile Setup Modal for first-time Admin
    const [showProfileSetup, setShowProfileSetup] = useState(false);
    const [setupFullName, setSetupFullName] = useState("");
    const [setupDisplayName, setSetupDisplayName] = useState("");

    // Notification toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Executive Stats
    const [stats, setStats] = useState({
        totalFarmers: 1248,
        activeFarmers: 986,
        cropReports: 3482,
        diseaseReports: 524,
        marketplaceOrders: 847,
        aiRequests: 12430,
        systemHealth: "100% Operational",
        telemetryNodes: 48,
        avgResponseTime: "124ms"
    });

    // 1. Farmers Data & Modals
    const [farmers, setFarmers] = useState([
        {
            id: "FARM-101",
            name: "Ramesh Patel",
            email: "ramesh.farmer@gmail.com",
            phone: "+91 98450 11234",
            location: "Gujarat, Anand",
            primaryCrop: "Cotton",
            farmSize: "12.5 Acres",
            registrationDate: "2026-01-14",
            status: "Active",
            cropHealth: "Optimal (96%)",
            soilNPK: { n: 140, p: 45, k: 50, ph: 6.8 },
            weatherStation: "Node-West-04",
            diseaseReportsCount: 1,
            marketOrdersCount: 5,
            aiQueriesCount: 42
        },
        {
            id: "FARM-102",
            name: "Suresh Reddy",
            email: "suresh.reddy@gmail.com",
            phone: "+91 97321 44556",
            location: "Andhra Pradesh, Guntur",
            primaryCrop: "Chilli & Rice",
            farmSize: "8.0 Acres",
            registrationDate: "2026-01-22",
            status: "Active",
            cropHealth: "Good (88%)",
            soilNPK: { n: 120, p: 40, k: 45, ph: 7.1 },
            weatherStation: "Node-South-12",
            diseaseReportsCount: 0,
            marketOrdersCount: 8,
            aiQueriesCount: 65
        },
        {
            id: "FARM-103",
            name: "Harpreet Singh",
            email: "harpreet.punjab@gmail.com",
            phone: "+91 99140 77889",
            location: "Punjab, Ludhiana",
            primaryCrop: "Wheat",
            farmSize: "25.0 Acres",
            registrationDate: "2026-02-05",
            status: "Active",
            cropHealth: "Excellent (98%)",
            soilNPK: { n: 160, p: 55, k: 60, ph: 6.5 },
            weatherStation: "Node-North-01",
            diseaseReportsCount: 2,
            marketOrdersCount: 14,
            aiQueriesCount: 120
        },
        {
            id: "FARM-104",
            name: "Ananya Sharma",
            email: "ananya.agri@gmail.com",
            phone: "+91 94220 33211",
            location: "Maharashtra, Nashik",
            primaryCrop: "Grapes & Sugarcane",
            farmSize: "15.0 Acres",
            registrationDate: "2026-02-18",
            status: "Active",
            cropHealth: "Optimal (94%)",
            soilNPK: { n: 135, p: 48, k: 52, ph: 6.9 },
            weatherStation: "Node-West-09",
            diseaseReportsCount: 1,
            marketOrdersCount: 9,
            aiQueriesCount: 84
        },
        {
            id: "FARM-105",
            name: "Vijay Kumar",
            email: "vijay.k@gmail.com",
            phone: "+91 96550 99881",
            location: "Tamil Nadu, Thanjavur",
            primaryCrop: "Paddy / Rice",
            farmSize: "6.5 Acres",
            registrationDate: "2026-03-01",
            status: "Inactive",
            cropHealth: "Fair (72%)",
            soilNPK: { n: 95, p: 30, k: 35, ph: 7.4 },
            weatherStation: "Node-South-08",
            diseaseReportsCount: 3,
            marketOrdersCount: 2,
            aiQueriesCount: 18
        }
    ]);
    const [farmerSearch, setFarmerSearch] = useState("");
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
    const [newFarmerData, setNewFarmerData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        primaryCrop: "Wheat",
        farmSize: "5 Acres"
    });
    const [confirmDeactivateFarmer, setConfirmDeactivateFarmer] = useState<any>(null);

    // 2. Crops Data & Modals
    const [crops, setCrops] = useState([
        {
            id: "CROP-01",
            name: "Wheat (Triticum aestivum)",
            suitableSoil: "Loamy, Clay Loam",
            temperature: "15°C – 25°C",
            rainfall: "450 – 650 mm",
            duration: "110 – 130 Days",
            expectedYield: "4.5 – 5.5 Tons/Ha",
            marketDemand: "High (Rising)",
            recommendedSeason: "Rabi",
            status: "Active"
        },
        {
            id: "CROP-02",
            name: "Paddy / Rice (Oryza sativa)",
            suitableSoil: "Clayey, Alluvial",
            temperature: "22°C – 32°C",
            rainfall: "1000 – 1500 mm",
            duration: "120 – 150 Days",
            expectedYield: "5.0 – 6.5 Tons/Ha",
            marketDemand: "Very High",
            recommendedSeason: "Kharif",
            status: "Active"
        },
        {
            id: "CROP-03",
            name: "Cotton (Gossypium)",
            suitableSoil: "Black Cotton, Sandy Loam",
            temperature: "21°C – 30°C",
            rainfall: "500 – 800 mm",
            duration: "150 – 180 Days",
            expectedYield: "2.5 – 3.2 Tons/Ha",
            marketDemand: "High",
            recommendedSeason: "Kharif",
            status: "Active"
        },
        {
            id: "CROP-04",
            name: "Sugarcane (Saccharum officinarum)",
            suitableSoil: "Deep Rich Loamy",
            temperature: "20°C – 35°C",
            rainfall: "1500 – 2500 mm",
            duration: "300 – 360 Days",
            expectedYield: "80 – 100 Tons/Ha",
            marketDemand: "Stable",
            recommendedSeason: "Annual",
            status: "Active"
        },
        {
            id: "CROP-05",
            name: "Maize / Corn (Zea mays)",
            suitableSoil: "Well-drained Fertile Loam",
            temperature: "18°C – 27°C",
            rainfall: "500 – 750 mm",
            duration: "90 – 110 Days",
            expectedYield: "6.0 – 7.5 Tons/Ha",
            marketDemand: "High",
            recommendedSeason: "Kharif / Rabi",
            status: "Active"
        }
    ]);
    const [showAddCropModal, setShowAddCropModal] = useState(false);
    const [newCropData, setNewCropData] = useState({
        name: "",
        suitableSoil: "Loamy Soil",
        temperature: "20°C – 30°C",
        rainfall: "500 – 800 mm",
        duration: "120 Days",
        expectedYield: "4.5 Tons/Ha",
        marketDemand: "High",
        recommendedSeason: "Kharif"
    });

    // 3. Disease Reports
    const [diseaseReports, setDiseaseReports] = useState([
        {
            id: "DIS-2026-001",
            farmer: "Ramesh Patel",
            crop: "Cotton",
            detectedDisease: "Bacterial Blight",
            confidence: "96.4%",
            severity: "Moderate",
            date: "2026-03-02",
            status: "Under Review",
            recommendedAction: "Apply Copper Oxychloride (0.25%) + Streptocycline (100 ppm)"
        },
        {
            id: "DIS-2026-002",
            farmer: "Harpreet Singh",
            crop: "Wheat",
            detectedDisease: "Yellow Rust (Puccinia striiformis)",
            confidence: "98.8%",
            severity: "High",
            date: "2026-03-01",
            status: "Resolved",
            recommendedAction: "Foliar spray of Propiconazole 25% EC @ 0.1%"
        },
        {
            id: "DIS-2026-003",
            farmer: "Ananya Sharma",
            crop: "Grapes",
            detectedDisease: "Powdery Mildew",
            confidence: "94.1%",
            severity: "Low",
            date: "2026-02-28",
            status: "Resolved",
            recommendedAction: "Spray wettable sulphur @ 2g/litre water"
        },
        {
            id: "DIS-2026-004",
            farmer: "Vijay Kumar",
            crop: "Paddy",
            detectedDisease: "Rice Blast (Magnaporthe oryzae)",
            confidence: "97.2%",
            severity: "Critical",
            date: "2026-02-27",
            status: "Under Review",
            recommendedAction: "Apply Tricyclazole 75% WP @ 0.6g/L"
        }
    ]);
    const [selectedDiseaseReport, setSelectedDiseaseReport] = useState<any>(null);

    // 4. Weather Intelligence & Alert Broadcaster
    const [weatherTelemetry, setWeatherTelemetry] = useState({
        temp: "28.4°C",
        humidity: "62%",
        wind: "14 km/h SW",
        rainfall: "4.2 mm",
        dopplerStatus: "Active Doppler Stream",
        activeNodes: 48
    });
    const [showWeatherAlertModal, setShowWeatherAlertModal] = useState(false);
    const [weatherAlertData, setWeatherAlertData] = useState({
        region: "Andhra Pradesh & Telangana",
        message: "Severe thunderstorm and high wind gust advisory in coastal agricultural belts for the next 24 hours.",
        severity: "High"
    });

    // 5. Market Intelligence
    const [marketData, setMarketData] = useState([
        { id: "MKT-01", crop: "Wheat (Sharbati)", currentPrice: 2450, previousPrice: 2320, change: "+5.6%", market: "Khanna Mandi, Punjab", updatedTime: "10 mins ago" },
        { id: "MKT-02", crop: "Paddy (Basmati 1121)", currentPrice: 3850, previousPrice: 3900, change: "-1.2%", market: "Karnal Mandi, Haryana", updatedTime: "25 mins ago" },
        { id: "MKT-03", crop: "Cotton (Medium Staple)", currentPrice: 7100, previousPrice: 6850, change: "+3.6%", market: "Rajkot Mandi, Gujarat", updatedTime: "1 hour ago" },
        { id: "MKT-04", crop: "Soybean (Yellow)", currentPrice: 4620, previousPrice: 4550, change: "+1.5%", market: "Indore Mandi, MP", updatedTime: "40 mins ago" },
        { id: "MKT-05", crop: "Sugarcane (FRP)", currentPrice: 340, previousPrice: 315, change: "+7.9%", market: "Kolhapur Mandi, Maharashtra", updatedTime: "2 hours ago" },
        { id: "MKT-06", crop: "Maize (Feed Grade)", currentPrice: 2150, previousPrice: 2100, change: "+2.3%", market: "Davangere Mandi, Karnataka", updatedTime: "15 mins ago" }
    ]);
    const [editingMarketItem, setEditingMarketItem] = useState<any>(null);

    // 6. Government Schemes
    const [schemes, setSchemes] = useState([
        {
            id: "SCHEME-01",
            name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
            eligibility: "All landholding farmers with cultivable land.",
            benefit: "₹6,000 / Year (Direct Bank Transfer)",
            deadline: "Ongoing Open Registration",
            status: "Active",
            applicationUrl: "https://pmkisan.gov.in"
        },
        {
            id: "SCHEME-02",
            name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
            description: "Comprehensive risk insurance coverage against yield loss due to non-preventable natural risks.",
            eligibility: "All farmers growing notified crops in notified areas.",
            benefit: "Full Sum Insured for natural disaster loss (1.5% - 2% premium)",
            deadline: "Seasonal Cutoffs (Kharif: July 31, Rabi: Dec 31)",
            status: "Active",
            applicationUrl: "https://pmfby.gov.in"
        },
        {
            id: "SCHEME-03",
            name: "Soil Health Card Scheme",
            description: "Provides information on 12 soil nutrient parameters with tailored fertilizer recommendations.",
            eligibility: "Every agricultural field across India.",
            benefit: "Free GPS-tagged soil chemical analysis report",
            deadline: "Cycle 2025-2027 Ongoing",
            status: "Active",
            applicationUrl: "https://soilhealth.dac.gov.in"
        }
    ]);
    const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
    const [newSchemeData, setNewSchemeData] = useState({
        name: "",
        description: "",
        eligibility: "",
        benefit: "",
        deadline: "Active",
        applicationUrl: "https://agricoop.nic.in"
    });

    // 7. Notifications Center
    const [notifications, setNotifications] = useState([
        {
            id: "NOTIF-01",
            title: "Doppler Radar Precipitation Advisory",
            message: "Moderate rainfall (22mm) forecasted for Andhra Pradesh & Telangana over the next 48 hours.",
            type: "Weather Alert",
            priority: "High",
            timestamp: "15 mins ago",
            author: "System Telemetry"
        },
        {
            id: "NOTIF-02",
            title: "Leaf Rust Alert in Northern Grain Belt",
            message: "Spore concentration elevated in Punjab & Haryana. Farmers advised to inspect wheat crops.",
            type: "Disease Warning",
            priority: "High",
            timestamp: "1 hour ago",
            author: "AI Plant Pathology Unit"
        },
        {
            id: "NOTIF-03",
            title: "MSP Procurement Portal Online",
            message: "Kharif season Mandi registrations are now open with direct bank settlement within 48 hours.",
            type: "Platform Announcement",
            priority: "Normal",
            timestamp: "3 hours ago",
            author: "Admin Office"
        }
    ]);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [newBroadcastData, setNewBroadcastData] = useState({
        title: "",
        message: "",
        type: "Platform Announcement",
        priority: "Normal"
    });

    // 8. Admin Profile State
    const [profileName, setProfileName] = useState("");
    const [profileDisplayName, setProfileDisplayName] = useState("");

    // Authorization & Role Validation on Load
    useEffect(() => {
        const verifyAdminSession = async () => {
            try {
                const token = localStorage.getItem("token");
                const savedUserStr = localStorage.getItem("user");

                if (!token || !savedUserStr) {
                    setIsAdmin(false);
                    setIsLoadingAuth(false);
                    return;
                }

                const parsedUser = JSON.parse(savedUserStr);
                const userEmail = parsedUser.email ? parsedUser.email.trim().toLowerCase() : "";

                // Check against approved admin allowlist
                const isApprovedAdmin = ADMIN_EMAILS.includes(userEmail) || parsedUser.role === "Admin";

                if (isApprovedAdmin) {
                    setCurrentUser(parsedUser);
                    setProfileName(parsedUser.name || "Dhanush");
                    setProfileDisplayName(parsedUser.displayName || parsedUser.name || "Dhanush");
                    setIsAdmin(true);

                    // Check if first-time profile setup is needed
                    if (!parsedUser.displayName) {
                        setSetupFullName(parsedUser.name || "");
                        setSetupDisplayName(parsedUser.name ? parsedUser.name.split(" ")[0] : "Dhanush");
                        setShowProfileSetup(true);
                    }
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Admin verification error:", err);
                setIsAdmin(false);
            } finally {
                setIsLoadingAuth(false);
            }
        };

        verifyAdminSession();
    }, []);

    // Handle Profile Setup Save
    const handleSaveAdminProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!setupFullName.trim() || !setupDisplayName.trim()) return;

        const updated = {
            ...currentUser,
            name: setupFullName.trim(),
            displayName: setupDisplayName.trim(),
            role: "Admin"
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setCurrentUser(updated);
        setProfileName(setupFullName.trim());
        setProfileDisplayName(setupDisplayName.trim());
        setShowProfileSetup(false);
        showToast("Admin profile updated successfully!");

        // Sync with backend if available
        try {
            const token = localStorage.getItem("token");
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
            await fetch(`${backendUrl}/api/admin/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: setupFullName, displayName: setupDisplayName })
            });
        } catch (e) {}
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("sfa_cinematic_entered");
        router.push("/");
    };

    // Farmer Add Handler
    const handleAddFarmer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFarmerData.name || !newFarmerData.email) return;

        const newF = {
            id: `FARM-${Math.floor(100 + Math.random() * 900)}`,
            name: newFarmerData.name,
            email: newFarmerData.email,
            phone: newFarmerData.phone || "+91 98000 00000",
            location: newFarmerData.location || "Andhra Pradesh",
            primaryCrop: newFarmerData.primaryCrop,
            farmSize: newFarmerData.farmSize,
            registrationDate: new Date().toISOString().split("T")[0],
            status: "Active",
            cropHealth: "Optimal (95%)",
            soilNPK: { n: 130, p: 42, k: 48, ph: 6.8 },
            weatherStation: "Node-South-01",
            diseaseReportsCount: 0,
            marketOrdersCount: 0,
            aiQueriesCount: 0
        };

        setFarmers([newF, ...farmers]);
        setShowAddFarmerModal(false);
        setNewFarmerData({ name: "", email: "", phone: "", location: "", primaryCrop: "Wheat", farmSize: "5 Acres" });
        showToast(`Farmer ${newF.name} registered successfully.`);
    };

    // Toggle Farmer Status
    const handleToggleFarmerStatus = (farmerId: string) => {
        setFarmers(farmers.map(f => {
            if (f.id === farmerId) {
                const nextStatus = f.status === "Active" ? "Deactivated" : "Active";
                showToast(`Farmer ${f.name} is now ${nextStatus}.`);
                return { ...f, status: nextStatus };
            }
            return f;
        }));
        setConfirmDeactivateFarmer(null);
    };

    // Crop Add Handler
    const handleAddCrop = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCropData.name) return;

        const newC = {
            id: `CROP-0${crops.length + 1}`,
            ...newCropData,
            status: "Active"
        };
        setCrops([...crops, newC]);
        setShowAddCropModal(false);
        setNewCropData({
            name: "",
            suitableSoil: "Loamy Soil",
            temperature: "20°C – 30°C",
            rainfall: "500 – 800 mm",
            duration: "120 Days",
            expectedYield: "4.5 Tons/Ha",
            marketDemand: "High",
            recommendedSeason: "Kharif"
        });
        showToast(`Crop ${newC.name} cataloged into AI recommendations.`);
    };

    // Toggle Disease Report Status
    const handleResolveDisease = (id: string) => {
        setDiseaseReports(diseaseReports.map(d => {
            if (d.id === id) {
                const nextStatus = d.status === "Resolved" ? "Under Review" : "Resolved";
                showToast(`Disease ticket ${id} marked as ${nextStatus}.`);
                return { ...d, status: nextStatus };
            }
            return d;
        }));
        if (selectedDiseaseReport?.id === id) {
            setSelectedDiseaseReport((prev: any) => ({
                ...prev,
                status: prev.status === "Resolved" ? "Under Review" : "Resolved"
            }));
        }
    };

    // Weather Alert Broadcast Handler
    const handleBroadcastWeatherAlert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!weatherAlertData.message) return;

        const alertItem = {
            id: `NOTIF-${Date.now().toString().slice(-4)}`,
            title: `Weather Alert: ${weatherAlertData.region}`,
            message: weatherAlertData.message,
            type: "Weather Alert",
            priority: weatherAlertData.severity,
            timestamp: "Just now",
            author: profileDisplayName || "Administrator"
        };

        setNotifications([alertItem, ...notifications]);
        setShowWeatherAlertModal(false);
        showToast("Weather alert broadcasted to all connected farm nodes.");
    };

    // Market Price Update Handler
    const handleUpdateMarketPrice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMarketItem) return;

        setMarketData(marketData.map(m => {
            if (m.id === editingMarketItem.id) {
                return {
                    ...m,
                    currentPrice: Number(editingMarketItem.currentPrice),
                    previousPrice: Number(editingMarketItem.previousPrice),
                    change: editingMarketItem.change,
                    updatedTime: "Just now"
                };
            }
            return m;
        }));
        setEditingMarketItem(null);
        showToast(`Market price for ${editingMarketItem.crop} synchronized.`);
    };

    // Government Scheme Add Handler
    const handleAddScheme = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSchemeData.name || !newSchemeData.description) return;

        const newS = {
            id: `SCHEME-0${schemes.length + 1}`,
            ...newSchemeData,
            status: "Active"
        };
        setSchemes([...schemes, newS]);
        setShowAddSchemeModal(false);
        setNewSchemeData({
            name: "",
            description: "",
            eligibility: "",
            benefit: "",
            deadline: "Active",
            applicationUrl: "https://agricoop.nic.in"
        });
        showToast(`Government scheme ${newS.name} published.`);
    };

    // Platform Announcement Broadcast Handler
    const handleBroadcastAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBroadcastData.title || !newBroadcastData.message) return;

        const notif = {
            id: `NOTIF-${Date.now().toString().slice(-4)}`,
            title: newBroadcastData.title,
            message: newBroadcastData.message,
            type: newBroadcastData.type,
            priority: newBroadcastData.priority,
            timestamp: "Just now",
            author: profileDisplayName || "Administrator"
        };

        setNotifications([notif, ...notifications]);
        setShowBroadcastModal(false);
        setNewBroadcastData({ title: "", message: "", type: "Platform Announcement", priority: "Normal" });
        showToast("Platform announcement broadcasted to all farmers.");
    };

    // =========================================================================
    // 1. AUTHENTICATION LOADING STATE
    // =========================================================================
    if (isLoadingAuth) {
        return (
            <div className="min-h-screen w-screen bg-[#0B1118] flex flex-col items-center justify-center text-white space-y-4">
                <div className="w-12 h-12 rounded-2xl border-2 border-cyan border-t-transparent animate-spin"></div>
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-cyan animate-pulse" />
                    <span className="text-xs font-black tracking-widest uppercase text-cyan">
                        AUTHENTICATING ADMIN PRIVILEGES...
                    </span>
                </div>
            </div>
        );
    }

    // =========================================================================
    // 2. ACCESS DENIED / DIRECT URL PROTECTION
    // =========================================================================
    if (!isAdmin) {
        return (
            <div className="min-h-screen w-screen bg-[#0B1118] flex items-center justify-center p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)] pointer-events-none"></div>
                
                <div className="max-w-md w-full p-8 rounded-3xl bg-[#101820] border-2 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center space-y-6 relative z-10 animate-fade-up">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                            Access Denied
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                            You don't have permission to access the Smart Farm Assistant Admin Console. This section is restricted to authorized platform administrators.
                        </p>
                    </div>

                    <div className="pt-2 space-y-3">
                        <Link
                            href="/dashboard"
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-102"
                        >
                            <span>Return to Smart Farm</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/"
                            className="block text-xs font-bold text-slate-400 hover:text-cyan transition-colors"
                        >
                            Log in with an Administrator Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Filtered Farmers
    const filteredFarmers = farmers.filter(f =>
        f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        f.email.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        f.location.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        f.primaryCrop.toLowerCase().includes(farmerSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0B1118] text-white font-sans flex flex-col antialiased selection:bg-cyan selection:text-navy-900">
            
            {/* Global Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#101820] border-2 border-cyan shadow-[0_0_30px_rgba(24,213,208,0.4)] text-white text-xs font-bold flex items-center space-x-3 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-cyan shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* FIRST-TIME ADMIN PROFILE COMPLETION MODAL */}
            {showProfileSetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-8 rounded-3xl bg-[#101820] border-2 border-cyan shadow-[0_0_50px_rgba(24,213,208,0.3)] space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-cyan/15 border border-cyan/40 flex items-center justify-center mx-auto text-cyan">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black uppercase text-white tracking-wide">
                                Complete Your Admin Profile
                            </h2>
                            <p className="text-xs text-slate-300 font-medium">
                                Welcome to the Admin Console. Set your display credentials to personalize your platform management experience.
                            </p>
                        </div>

                        <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={setupFullName}
                                    onChange={(e) => setSetupFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={setupDisplayName}
                                    onChange={(e) => setSetupDisplayName(e.target.value)}
                                    placeholder="Enter display name (e.g. Dhanush)"
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-102 cursor-pointer"
                            >
                                <span>Save Profile →</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TOP ADMIN HEADER */}
            <header className="sticky top-0 z-30 h-16 bg-[#0B1118]/90 backdrop-blur-xl border-b border-cyan/20 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-cyan/60 shadow-[0_0_15px_rgba(24,213,208,0.4)]">
                            <img src="/smart-farm-logo.png" alt="Smart Farm Logo" className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                                    Smart Farm Assistant
                                </h1>
                                <span className="px-2 py-0.5 rounded-md bg-cyan/15 text-cyan border border-cyan/30 text-[9px] font-black tracking-widest uppercase">
                                    ADMIN CONSOLE
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                                ● TELEMETRY GRID: ONLINE
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* Return to Farmer Dashboard */}
                    <Link
                        href="/dashboard"
                        className="px-3 py-1.5 rounded-xl bg-[#101820] hover:bg-slate-800 text-slate-300 hover:text-cyan border border-cyan/20 text-xs font-bold transition-all flex items-center space-x-1.5"
                    >
                        <Sprout className="w-3.5 h-3.5 text-lime" />
                        <span className="hidden md:inline">Farmer Dashboard</span>
                    </Link>

                    {/* Admin Profile Chip */}
                    <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                        <div className="w-8 h-8 rounded-xl bg-cyan text-navy-900 font-black text-xs flex items-center justify-center shadow-sm">
                            {profileDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-black text-white leading-none">{profileDisplayName}</p>
                            <span className="text-[9px] font-bold text-cyan uppercase tracking-wider">Administrator</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* MAIN ADMIN LAYOUT (SIDEBAR + CONTENT) */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* ADMIN SIDEBAR */}
                <aside className="w-64 bg-[#0B1118] border-r border-cyan/15 flex flex-col justify-between p-4 overflow-y-auto hidden md:flex shrink-0">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan px-3">
                                Platform Control
                            </span>
                            <nav className="mt-2 space-y-1">
                                {[
                                    { id: "dashboard", label: "Executive Overview", icon: Activity },
                                    { id: "farmers", label: "Farmers Management", icon: Users },
                                    { id: "crops", label: "Crop Recommendations", icon: Sprout },
                                    { id: "disease", label: "Disease Reports", icon: ShieldCheck },
                                    { id: "weather", label: "Weather Intelligence", icon: CloudRain },
                                    { id: "market", label: "Market Intelligence", icon: TrendingUp },
                                    { id: "schemes", label: "Government Schemes", icon: FileText },
                                    { id: "ai", label: "AI Farm Assistant", icon: Bot },
                                    { id: "notifications", label: "Notifications Center", icon: Bell },
                                    { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
                                    { id: "profile", label: "Admin Profile", icon: UserIcon },
                                    { id: "settings", label: "System Settings", icon: Settings },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as any)}
                                            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                                isActive
                                                    ? "bg-cyan/15 text-cyan border border-cyan/40 shadow-[0_0_15px_rgba(24,213,208,0.25)]"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? "text-cyan" : "text-slate-400"}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#101820] border border-cyan/20 space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Connected Admin Node</span>
                        <span className="text-xs font-mono font-black text-cyan">Node-HYD-Core-01</span>
                    </div>
                </aside>

                {/* CONTENT VIEWPORT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#0B1118] via-[#101820]/60 to-[#0B1118]">
                    
                    {/* ========================================================= */}
                    {/* 1. EXECUTIVE DASHBOARD OVERVIEW */}
                    {/* ========================================================= */}
                    {activeTab === "dashboard" && (
                        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
                            {/* Welcome Banner */}
                            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101820] via-teal-950/40 to-[#101820] border-2 border-cyan/30 shadow-[0_0_40px_rgba(24,213,208,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan/15 rounded-full text-xs font-black text-cyan uppercase tracking-wider border border-cyan/30">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Autonomous AgriTech Command</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                                        Welcome, {profileDisplayName} 👋
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                                        Manage your Smart Farm Assistant ecosystem, monitor regional crop diagnostics, Doppler telemetry, and real-time farmer interactions from one central cockpit.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => setShowBroadcastModal(true)}
                                        className="py-3 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span>Broadcast Alert</span>
                                    </button>
                                    <button
                                        onClick={() => setShowAddFarmerModal(true)}
                                        className="py-3 px-5 rounded-xl bg-[#101820] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border border-cyan/40 transition-all flex items-center space-x-2 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 text-cyan" />
                                        <span>+ Add Farmer</span>
                                    </button>
                                </div>
                            </div>

                            {/* 6 Metric Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                {[
                                    { label: "Total Farmers", value: "1,248", change: "+12.4%", icon: Users, color: "text-cyan", border: "border-cyan/30" },
                                    { label: "Active Farmers", value: "986", change: "+8.1%", icon: CheckCircle2, color: "text-lime", border: "border-lime/30" },
                                    { label: "Crop Reports", value: "3,482", change: "+18.2%", icon: Sprout, color: "text-teal-400", border: "border-teal-500/30" },
                                    { label: "Disease Reports", value: "524", change: "-4.5%", icon: ShieldCheck, color: "text-amber-400", border: "border-amber-500/30" },
                                    { label: "Market Orders", value: "847", change: "+22.8%", icon: TrendingUp, color: "text-sky-400", border: "border-sky-500/30" },
                                    { label: "AI Requests", value: "12,430", change: "+41.0%", icon: Bot, color: "text-purple-400", border: "border-purple-500/30" },
                                ].map((card, i) => {
                                    const Icon = card.icon;
                                    return (
                                        <div key={i} className={`p-4 rounded-2xl bg-[#101820] border ${card.border} space-y-2`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</span>
                                                <Icon className={`w-4 h-4 ${card.color}`} />
                                            </div>
                                            <p className="text-2xl font-black text-white">{card.value}</p>
                                            <span className="text-[10px] font-mono text-lime flex items-center">
                                                {card.change} this month
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Live System Grid & Quick Operations */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-black uppercase text-white">Recent Disease Diagnostic Inquiries</h3>
                                            <p className="text-xs text-slate-400">Incoming CNN image predictions from field IoT nodes</p>
                                        </div>
                                        <button onClick={() => setActiveTab("disease")} className="text-xs font-black text-cyan hover:underline">View All →</button>
                                    </div>

                                    <div className="space-y-3">
                                        {diseaseReports.slice(0, 3).map((r) => (
                                            <div key={r.id} className="p-3.5 rounded-2xl bg-[#0B1118] border border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30">
                                                        🔬
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-white">{r.detectedDisease}</p>
                                                        <span className="text-[10px] text-slate-400 font-medium">Farmer: {r.farmer} ({r.crop}) • {r.date}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                    r.status === "Resolved" ? "bg-lime/15 text-lime border border-lime/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-black uppercase text-white">IoT Sensor Grid Status</h3>
                                        <div className="space-y-2 text-xs text-slate-300">
                                            <div className="flex justify-between py-2 border-b border-slate-800">
                                                <span>Active Weather Nodes</span>
                                                <span className="font-mono font-bold text-cyan">48 / 48 Online</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-800">
                                                <span>Doppler Radar Sync</span>
                                                <span className="font-mono font-bold text-lime">0.4s Latency</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-800">
                                                <span>AI Inference Pipeline</span>
                                                <span className="font-mono font-bold text-teal-400">99.8% Uptime</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => showToast("Diagnostic ping broadcasted across all 48 nodes: 100% OK")}
                                        className="w-full py-3 bg-[#0B1118] hover:bg-slate-900 border border-cyan/30 text-cyan font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Ping Telemetry Grid</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 2. FARMERS MANAGEMENT */}
                    {/* ========================================================= */}
                    {activeTab === "farmers" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Farmer Directory & Management</h2>
                                    <p className="text-xs text-slate-400">View telemetry profiles, manage farmer status, and monitor field allocations</p>
                                </div>
                                <button
                                    onClick={() => setShowAddFarmerModal(true)}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>+ Add Farmer</span>
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={farmerSearch}
                                    onChange={(e) => setFarmerSearch(e.target.value)}
                                    placeholder="Search by farmer name, email, location, or crop..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none placeholder:text-slate-500"
                                />
                            </div>

                            {/* Farmers Table */}
                            <div className="rounded-3xl bg-[#101820] border border-cyan/20 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#0B1118] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-800">
                                            <tr>
                                                <th className="px-6 py-4">Farmer Name</th>
                                                <th className="px-6 py-4">Contact</th>
                                                <th className="px-6 py-4">Location</th>
                                                <th className="px-6 py-4">Primary Crop</th>
                                                <th className="px-6 py-4">Farm Size</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                                            {filteredFarmers.map((f) => (
                                                <tr key={f.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-2.5">
                                                        <div className="w-8 h-8 rounded-xl bg-cyan/15 text-cyan flex items-center justify-center font-black text-xs shrink-0 border border-cyan/30">
                                                            {f.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-white leading-none">{f.name}</p>
                                                            <span className="text-[10px] text-slate-400 font-mono">{f.id}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-white">{f.email}</p>
                                                        <span className="text-[10px] text-slate-400">{f.phone}</span>
                                                    </td>
                                                    <td className="px-6 py-4">{f.location}</td>
                                                    <td className="px-6 py-4 font-bold text-cyan">{f.primaryCrop}</td>
                                                    <td className="px-6 py-4 font-mono">{f.farmSize}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                            f.status === "Active" ? "bg-lime/15 text-lime border border-lime/30" : "bg-red-500/15 text-red-400 border border-red-500/30"
                                                        }`}>
                                                            {f.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => setSelectedFarmer(f)}
                                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan hover:text-navy-900 transition-colors text-slate-300"
                                                            title="View Detailed Profile"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeactivateFarmer(f)}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                f.status === "Active" ? "bg-red-950/40 text-red-300 hover:bg-red-900" : "bg-lime/15 text-lime hover:bg-lime/30"
                                                            }`}
                                                            title={f.status === "Active" ? "Deactivate" : "Activate"}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 3. CROPS MANAGEMENT */}
                    {/* ========================================================= */}
                    {activeTab === "crops" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Crop Catalog & Agronomy Rules</h2>
                                    <p className="text-xs text-slate-400">Configure ML suitability thresholds, rainfall bounds, and yield prediction factors</p>
                                </div>
                                <button
                                    onClick={() => setShowAddCropModal(true)}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>+ Add New Crop</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {crops.map((c) => (
                                    <div key={c.id} className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-0.5 rounded-md bg-cyan/15 text-cyan border border-cyan/30 text-[10px] font-black tracking-wider uppercase font-mono">
                                                    {c.id}
                                                </span>
                                                <span className="text-[10px] font-bold text-lime uppercase">{c.recommendedSeason} Season</span>
                                            </div>
                                            <h3 className="text-lg font-black text-white">{c.name}</h3>
                                            
                                            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Suitable Soil:</span>
                                                    <span className="font-semibold text-white">{c.suitableSoil}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Temperature:</span>
                                                    <span className="font-mono text-cyan">{c.temperature}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Rainfall Requirement:</span>
                                                    <span className="font-mono text-teal-400">{c.rainfall}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Growing Duration:</span>
                                                    <span className="font-medium text-white">{c.duration}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Expected Yield:</span>
                                                    <span className="font-bold text-lime">{c.expectedYield}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setCrops(crops.filter(x => x.id !== c.id));
                                                showToast(`Crop ${c.name} removed from catalog.`);
                                            }}
                                            className="w-full py-2 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                        >
                                            Remove Crop
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 4. DISEASE REPORTS MANAGEMENT */}
                    {/* ========================================================= */}
                    {activeTab === "disease" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Leaf Pathology & Disease Reports</h2>
                                <p className="text-xs text-slate-400">Inspect CNN model confidence scores, review pathology alerts, and dispatch treatment remedies</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {diseaseReports.map((d) => (
                                    <div key={d.id} className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black font-mono">
                                                {d.id}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                d.severity === "Critical" || d.severity === "High" ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-cyan/15 text-cyan border border-cyan/30"
                                            }`}>
                                                Severity: {d.severity}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-black text-white">{d.detectedDisease}</h3>
                                            <p className="text-xs text-slate-400">Reported by <span className="text-white font-bold">{d.farmer}</span> on crop <span className="text-cyan font-bold">{d.crop}</span></p>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-[#0B1118] border border-slate-800 space-y-1.5 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">AI Confidence:</span>
                                                <span className="font-mono font-bold text-lime">{d.confidence}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Report Date:</span>
                                                <span className="font-mono text-slate-300">{d.date}</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-800/80">
                                                <span className="text-[11px] font-bold text-slate-400 block mb-1">Recommended Treatment:</span>
                                                <p className="text-slate-300 font-medium text-xs">{d.recommendedAction}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 pt-1">
                                            <button
                                                onClick={() => handleResolveDisease(d.id)}
                                                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                                                    d.status === "Resolved"
                                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                        : "bg-gradient-to-r from-teal-800 to-cyan text-white shadow-md hover:scale-102"
                                                }`}
                                            >
                                                {d.status === "Resolved" ? "Reopen Investigation" : "Mark Resolved ✓"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 5. WEATHER INTELLIGENCE */}
                    {/* ========================================================= */}
                    {activeTab === "weather" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Doppler Weather Telemetry & Node Hub</h2>
                                    <p className="text-xs text-slate-400">Live Doppler radar stream, sensor station diagnostics, and emergency weather broadcasting</p>
                                </div>
                                <button
                                    onClick={() => setShowWeatherAlertModal(true)}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer self-start"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Broadcast Weather Alert</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-2">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span className="text-xs font-bold uppercase">Ambient Temp</span>
                                        <Thermometer className="w-4 h-4 text-cyan" />
                                    </div>
                                    <p className="text-3xl font-black text-white">{weatherTelemetry.temp}</p>
                                    <span className="text-[10px] text-lime font-bold">Optimal agricultural envelope</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-2">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span className="text-xs font-bold uppercase">Humidity</span>
                                        <Droplets className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <p className="text-3xl font-black text-white">{weatherTelemetry.humidity}</p>
                                    <span className="text-[10px] text-cyan font-bold">Low evapotranspiration</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-2">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span className="text-xs font-bold uppercase">Wind Vector</span>
                                        <Wind className="w-4 h-4 text-lime" />
                                    </div>
                                    <p className="text-3xl font-black text-white">{weatherTelemetry.wind}</p>
                                    <span className="text-[10px] text-slate-400 font-bold">Safe for drone spraying</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-2">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span className="text-xs font-bold uppercase">Rainfall Today</span>
                                        <CloudRain className="w-4 h-4 text-sky-400" />
                                    </div>
                                    <p className="text-3xl font-black text-white">{weatherTelemetry.rainfall}</p>
                                    <span className="text-[10px] text-teal-300 font-bold">Doppler radar active</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 6. MARKET INTELLIGENCE */}
                    {/* ========================================================= */}
                    {activeTab === "market" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Mandi Marketplace Real-Time Sync</h2>
                                <p className="text-xs text-slate-400">Direct APMC Mandi feeds, commodity price trends, and benchmark updates</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {marketData.map((m) => (
                                    <div key={m.id} className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase text-cyan">{m.crop}</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                                m.change.startsWith("+") ? "bg-lime/15 text-lime" : "bg-red-500/15 text-red-400"
                                            }`}>
                                                {m.change}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-3xl font-black text-white">₹{m.currentPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ Quintal</span></p>
                                            <span className="text-[11px] text-slate-400">Previous: ₹{m.previousPrice.toLocaleString()} • {m.market}</span>
                                        </div>

                                        <button
                                            onClick={() => setEditingMarketItem(m)}
                                            className="w-full py-2.5 bg-slate-900 hover:bg-cyan hover:text-navy-900 border border-cyan/30 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                        >
                                            Update Mandi Price ✎
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 7. GOVERNMENT SCHEMES */}
                    {/* ========================================================= */}
                    {activeTab === "schemes" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Government Schemes Registry</h2>
                                    <p className="text-xs text-slate-400">Publish agricultural subsidies, insurance schemes, and DBT financial initiatives</p>
                                </div>
                                <button
                                    onClick={() => setShowAddSchemeModal(true)}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>+ Add Scheme</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {schemes.map((s) => (
                                    <div key={s.id} className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-cyan font-mono">{s.id}</span>
                                                <span className="text-[10px] font-bold text-lime uppercase">{s.status}</span>
                                            </div>
                                            <h3 className="text-base font-black text-white leading-snug">{s.name}</h3>
                                            <p className="text-xs text-slate-300 font-medium leading-relaxed">{s.description}</p>
                                            
                                            <div className="p-3 rounded-2xl bg-[#0B1118] border border-slate-800 space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Benefit:</span>
                                                    <span className="font-bold text-lime">{s.benefit}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Deadline:</span>
                                                    <span className="text-slate-300">{s.deadline}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSchemes(schemes.filter(x => x.id !== s.id));
                                                showToast(`Scheme ${s.name} deleted.`);
                                            }}
                                            className="w-full py-2 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                        >
                                            Delete Scheme
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 8. AI ASSISTANT CONFIG */}
                    {/* ========================================================= */}
                    {activeTab === "ai" && (
                        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">AI Farming Intelligence Engine</h2>
                                <p className="text-xs text-slate-400">LLM agronomy prompting, leaf vision model hyperparameters, and token usage monitor</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-[#101820] border border-cyan/20 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-[#0B1118] border border-slate-800">
                                        <span className="text-slate-400 text-xs font-bold">Total Inferences Today</span>
                                        <p className="text-2xl font-black text-cyan mt-1">12,430</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#0B1118] border border-slate-800">
                                        <span className="text-slate-400 text-xs font-bold">Avg. Accuracy Rating</span>
                                        <p className="text-2xl font-black text-lime mt-1">98.4%</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#0B1118] border border-slate-800">
                                        <span className="text-slate-400 text-xs font-bold">Latency</span>
                                        <p className="text-2xl font-black text-teal-300 mt-1">142 ms</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                            System Agronomy Prompt Directives
                                        </label>
                                        <textarea
                                            rows={4}
                                            defaultValue="You are the Smart Farm Assistant AI. Provide precision soil management, NPK fertilizer dosing, and organic pest remedies based on Indian agricultural guidelines."
                                            className="w-full p-4 rounded-2xl bg-[#0B1118] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={() => showToast("AI Engine system prompt updated successfully.")}
                                        className="py-3 px-6 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                                    >
                                        Save AI Config →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 9. NOTIFICATIONS BROADCASTER */}
                    {/* ========================================================= */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Notifications & Announcement Center</h2>
                                    <p className="text-xs text-slate-400">Broadcast platform announcements, storm warnings, and agronomy bulletins</p>
                                </div>
                                <button
                                    onClick={() => setShowBroadcastModal(true)}
                                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-cyan text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>New Announcement</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {notifications.map((n) => (
                                    <div key={n.id} className="p-5 rounded-3xl bg-[#101820] border border-cyan/20 flex items-start justify-between gap-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-cyan/15 border border-cyan/30 text-cyan flex items-center justify-center shrink-0 mt-0.5">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="text-sm font-black text-white">{n.title}</h3>
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                                                        {n.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-300">{n.message}</p>
                                                <span className="text-[10px] text-slate-400 font-mono block">By {n.author} • {n.timestamp}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setNotifications(notifications.filter(x => x.id !== n.id));
                                                showToast("Notification deleted.");
                                            }}
                                            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 10. ANALYTICS & TRENDS */}
                    {/* ========================================================= */}
                    {activeTab === "analytics" && (
                        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Platform Growth & Agronomic Analytics</h2>
                                <p className="text-xs text-slate-400">Telemetry aggregations, crop distribution breakdown, and diagnostic frequencies</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Crop Distribution Breakdown */}
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4">
                                    <h3 className="text-base font-black uppercase text-white">Crop Cultivation Distribution</h3>
                                    <div className="space-y-3">
                                        {[
                                            { crop: "Wheat", pct: "38%", color: "bg-cyan" },
                                            { crop: "Paddy / Rice", pct: "29%", color: "bg-lime" },
                                            { crop: "Cotton", pct: "16%", color: "bg-teal-400" },
                                            { crop: "Sugarcane", pct: "11%", color: "bg-amber-400" },
                                            { crop: "Others", pct: "6%", color: "bg-purple-400" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-white">{item.crop}</span>
                                                    <span className="text-slate-400 font-mono">{item.pct}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-[#0B1118] overflow-hidden">
                                                    <div className={`h-full ${item.color}`} style={{ width: item.pct }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Farmer Registration Milestones */}
                                <div className="p-6 rounded-3xl bg-[#101820] border border-cyan/20 space-y-4">
                                    <h3 className="text-base font-black uppercase text-white">Monthly Farmer Onboarding Growth</h3>
                                    <div className="space-y-3">
                                        {[
                                            { month: "October", count: "450 Farmers", pct: "36%" },
                                            { month: "November", count: "620 Farmers", pct: "49%" },
                                            { month: "December", count: "810 Farmers", pct: "64%" },
                                            { month: "January", count: "990 Farmers", pct: "79%" },
                                            { month: "February", count: "1,140 Farmers", pct: "91%" },
                                            { month: "March (Active)", count: "1,248 Farmers", pct: "100%" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-white">{item.month}</span>
                                                    <span className="text-cyan font-mono">{item.count}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-[#0B1118] overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-teal-800 to-cyan" style={{ width: item.pct }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 11. ADMIN PROFILE */}
                    {/* ========================================================= */}
                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Administrator Credentials</h2>
                                <p className="text-xs text-slate-400">Manage your administrative profile and platform identity</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-[#101820] border border-cyan/20 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-2xl bg-cyan text-navy-900 font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(24,213,208,0.4)]">
                                        {profileDisplayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{profileName}</h3>
                                        <span className="text-xs text-cyan font-mono font-bold">ADMINISTRATOR (ROLE: ADMIN)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-4 rounded-2xl bg-[#0B1118] border border-slate-800 space-y-1">
                                        <span className="text-slate-400 font-bold uppercase">Registered Email (Immutable)</span>
                                        <p className="text-white font-mono font-bold">{currentUser?.email || "mjsaidhanush@gmail.com"}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#0B1118] border border-slate-800 space-y-1">
                                        <span className="text-slate-400 font-bold uppercase">Role Security Status</span>
                                        <p className="text-lime font-bold">● Approved Administrator Allowlist</p>
                                    </div>
                                </div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const updated = { ...currentUser, name: profileName, displayName: profileDisplayName };
                                    localStorage.setItem("user", JSON.stringify(updated));
                                    setCurrentUser(updated);
                                    showToast("Admin profile updated!");
                                }} className="space-y-4 pt-4 border-t border-slate-800">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0B1118] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileDisplayName}
                                            onChange={(e) => setProfileDisplayName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0B1118] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="py-3 px-6 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                                    >
                                        Save Profile Changes →
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* 12. SETTINGS */}
                    {/* ========================================================= */}
                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Platform Engine Configuration</h2>
                                <p className="text-xs text-slate-400">Configure IoT telemetry polling frequency and diagnostic sensitivity</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-[#101820] border border-cyan/20 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B1118] border border-slate-800">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase">Doppler Precipitation Auto-Sync</p>
                                            <span className="text-[11px] text-slate-400">Stream Doppler radar precipitation every 60 seconds</span>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan focus:ring-0" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B1118] border border-slate-800">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase">Autonomous Disease Alert Dispatch</p>
                                            <span className="text-[11px] text-slate-400">Broadcast warning if regional spore detection exceeds 90%</span>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan focus:ring-0" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => showToast("System settings synchronized successfully.")}
                                    className="py-3 px-6 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                                >
                                    Save System Settings →
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* ========================================================= */}
            {/* MODALS */}
            {/* ========================================================= */}

            {/* 1. Add Farmer Modal */}
            {showAddFarmerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Register New Farmer</h3>
                            <button onClick={() => setShowAddFarmerModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleAddFarmer} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Farmer Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newFarmerData.name}
                                    onChange={(e) => setNewFarmerData({ ...newFarmerData, name: e.target.value })}
                                    placeholder="e.g. Ramesh Patel"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newFarmerData.email}
                                    onChange={(e) => setNewFarmerData({ ...newFarmerData, email: e.target.value })}
                                    placeholder="farmer@gmail.com"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={newFarmerData.phone}
                                        onChange={(e) => setNewFarmerData({ ...newFarmerData, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Location / State</label>
                                    <input
                                        type="text"
                                        value={newFarmerData.location}
                                        onChange={(e) => setNewFarmerData({ ...newFarmerData, location: e.target.value })}
                                        placeholder="Andhra Pradesh"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Primary Crop</label>
                                    <select
                                        value={newFarmerData.primaryCrop}
                                        onChange={(e) => setNewFarmerData({ ...newFarmerData, primaryCrop: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    >
                                        <option>Wheat</option>
                                        <option>Paddy / Rice</option>
                                        <option>Cotton</option>
                                        <option>Sugarcane</option>
                                        <option>Maize</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Farm Size</label>
                                    <input
                                        type="text"
                                        value={newFarmerData.farmSize}
                                        onChange={(e) => setNewFarmerData({ ...newFarmerData, farmSize: e.target.value })}
                                        placeholder="5 Acres"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer mt-2"
                            >
                                Register Farmer →
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Farmer Detailed Profile Modal */}
            {selectedFarmer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-2xl bg-cyan text-navy-900 font-black text-lg flex items-center justify-center">
                                    {selectedFarmer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">{selectedFarmer.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono">{selectedFarmer.id} • {selectedFarmer.location}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFarmer(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-2xl bg-[#0B1118] border border-slate-800">
                                <span className="text-slate-400">Crop Health</span>
                                <p className="font-black text-lime mt-0.5">{selectedFarmer.cropHealth}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#0B1118] border border-slate-800">
                                <span className="text-slate-400">Primary Crop</span>
                                <p className="font-black text-cyan mt-0.5">{selectedFarmer.primaryCrop}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#0B1118] border border-slate-800">
                                <span className="text-slate-400">Farm Size</span>
                                <p className="font-black text-white mt-0.5">{selectedFarmer.farmSize}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#0B1118] border border-slate-800">
                                <span className="text-slate-400">AI Inquiries</span>
                                <p className="font-black text-teal-300 mt-0.5">{selectedFarmer.aiQueriesCount}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#0B1118] border border-cyan/20 space-y-2 text-xs">
                            <h4 className="font-black uppercase text-cyan">Soil Telemetry Parameters (NPK)</h4>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="p-2 rounded-xl bg-[#101820]">
                                    <span className="text-[10px] text-slate-400">Nitrogen (N)</span>
                                    <p className="font-bold text-white">{selectedFarmer.soilNPK?.n || 140} kg/ha</p>
                                </div>
                                <div className="p-2 rounded-xl bg-[#101820]">
                                    <span className="text-[10px] text-slate-400">Phosphorus (P)</span>
                                    <p className="font-bold text-white">{selectedFarmer.soilNPK?.p || 45} kg/ha</p>
                                </div>
                                <div className="p-2 rounded-xl bg-[#101820]">
                                    <span className="text-[10px] text-slate-400">Potassium (K)</span>
                                    <p className="font-bold text-white">{selectedFarmer.soilNPK?.k || 50} kg/ha</p>
                                </div>
                                <div className="p-2 rounded-xl bg-[#101820]">
                                    <span className="text-[10px] text-slate-400">pH Level</span>
                                    <p className="font-bold text-lime">{selectedFarmer.soilNPK?.ph || 6.8}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedFarmer(null)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase"
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Confirmation Dialog for Farmer Deactivation */}
            {confirmDeactivateFarmer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 rounded-3xl bg-[#101820] border-2 border-red-500/40 space-y-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-white">
                            {confirmDeactivateFarmer.status === "Active" ? "Deactivate Farmer Account?" : "Reactivate Farmer Account?"}
                        </h3>
                        <p className="text-xs text-slate-300">
                            Are you sure you want to change the status of <span className="font-bold text-white">{confirmDeactivateFarmer.name}</span>?
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={() => setConfirmDeactivateFarmer(null)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleToggleFarmerStatus(confirmDeactivateFarmer.id)}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Weather Alert Broadcaster Modal */}
            {showWeatherAlertModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-amber-500/40 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Broadcast Emergency Weather Alert</h3>
                            <button onClick={() => setShowWeatherAlertModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleBroadcastWeatherAlert} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Target Region</label>
                                <input
                                    type="text"
                                    required
                                    value={weatherAlertData.region}
                                    onChange={(e) => setWeatherAlertData({ ...weatherAlertData, region: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-amber-500/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Alert Advisory Message</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={weatherAlertData.message}
                                    onChange={(e) => setWeatherAlertData({ ...weatherAlertData, message: e.target.value })}
                                    className="w-full p-3.5 rounded-xl bg-[#0B1118] border border-amber-500/30 text-white text-xs outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                            >
                                Dispatch Alert Broadcast →
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. Market Update Modal */}
            {editingMarketItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Update Market Price</h3>
                            <button onClick={() => setEditingMarketItem(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleUpdateMarketPrice} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Crop Commodity</label>
                                <input
                                    type="text"
                                    disabled
                                    value={editingMarketItem.crop}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-slate-700 text-slate-400 text-xs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Current Price (₹/Q)</label>
                                    <input
                                        type="number"
                                        required
                                        value={editingMarketItem.currentPrice}
                                        onChange={(e) => setEditingMarketItem({ ...editingMarketItem, currentPrice: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Price Change (e.g. +4.2%)</label>
                                    <input
                                        type="text"
                                        value={editingMarketItem.change}
                                        onChange={(e) => setEditingMarketItem({ ...editingMarketItem, change: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                            >
                                Sync Price to Mandi Feed →
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. Broadcast Announcement Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Broadcast Platform Announcement</h3>
                            <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Announcement Headline</label>
                                <input
                                    type="text"
                                    required
                                    value={newBroadcastData.title}
                                    onChange={(e) => setNewBroadcastData({ ...newBroadcastData, title: e.target.value })}
                                    placeholder="e.g. MSP Procurement Portal Online"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Message Content</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newBroadcastData.message}
                                    onChange={(e) => setNewBroadcastData({ ...newBroadcastData, message: e.target.value })}
                                    placeholder="Enter announcement details for all farmers..."
                                    className="w-full p-3.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                            >
                                Dispatch Announcement →
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 7. Add Crop Modal */}
            {showAddCropModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Add Crop to Recommendation Engine</h3>
                            <button onClick={() => setShowAddCropModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleAddCrop} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Crop Botanical Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCropData.name}
                                    onChange={(e) => setNewCropData({ ...newCropData, name: e.target.value })}
                                    placeholder="e.g. Groundnut (Arachis hypogaea)"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Suitable Soil</label>
                                    <input
                                        type="text"
                                        value={newCropData.suitableSoil}
                                        onChange={(e) => setNewCropData({ ...newCropData, suitableSoil: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Temperature</label>
                                    <input
                                        type="text"
                                        value={newCropData.temperature}
                                        onChange={(e) => setNewCropData({ ...newCropData, temperature: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Expected Yield</label>
                                    <input
                                        type="text"
                                        value={newCropData.expectedYield}
                                        onChange={(e) => setNewCropData({ ...newCropData, expectedYield: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Season</label>
                                    <select
                                        value={newCropData.recommendedSeason}
                                        onChange={(e) => setNewCropData({ ...newCropData, recommendedSeason: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    >
                                        <option>Kharif</option>
                                        <option>Rabi</option>
                                        <option>Zaid</option>
                                        <option>Annual</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer mt-2"
                            >
                                Catalog Crop →
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 8. Add Scheme Modal */}
            {showAddSchemeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#101820] border-2 border-cyan/40 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase text-white">Add Government Scheme</h3>
                            <button onClick={() => setShowAddSchemeModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleAddScheme} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Scheme Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newSchemeData.name}
                                    onChange={(e) => setNewSchemeData({ ...newSchemeData, name: e.target.value })}
                                    placeholder="e.g. Kisan Credit Card (KCC)"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    required
                                    value={newSchemeData.description}
                                    onChange={(e) => setNewSchemeData({ ...newSchemeData, description: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Benefit</label>
                                    <input
                                        type="text"
                                        value={newSchemeData.benefit}
                                        onChange={(e) => setNewSchemeData({ ...newSchemeData, benefit: e.target.value })}
                                        placeholder="Low interest credit up to ₹3L"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Deadline</label>
                                    <input
                                        type="text"
                                        value={newSchemeData.deadline}
                                        onChange={(e) => setNewSchemeData({ ...newSchemeData, deadline: e.target.value })}
                                        placeholder="Active"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1118] border border-cyan/30 text-white text-xs outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer mt-2"
                            >
                                Publish Government Scheme →
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
