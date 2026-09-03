/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../../components/context/ToastContext";
import { shopAPI } from "../../services/shop";
import { Search } from "lucide-react";

import Skeleton from "../../components/context/Skeleton";
import { OrderForm, DirectInventoryForm } from "./components/ShopForms";
import { StationMasterQueue, AuthorityQueue, LogisticsQueue, ActiveTransitBoard } from "./components/ShopQueues";

export default function Requisitions() {
    const { activeStation = "Maitri" } = useOutletContext() || {};
    const showToast = useToast();
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [user, setUser] = useState({ fullName: "Operator", role: "station_master" });
    
    // Search and Filtering State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("active"); // "active" | "history"

    const formatRole = (roleString) => {
        if (!roleString) return "";
        return roleString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("polar_twin_user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Session parse error");
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchShopData = async () => {
            setLoading(true);
            setError(null);
            try {
                const savedDB = localStorage.getItem(`polar_twin_requests_${activeStation}`);
                if (savedDB) {
                    if (isMounted) setRequests(JSON.parse(savedDB));
                } else {
                    const res = await shopAPI.getRequisitions(activeStation);
                    if (isMounted) {
                        setRequests(res.data.requisitions);
                        localStorage.setItem(`polar_twin_requests_${activeStation}`, JSON.stringify(res.data.requisitions));
                    }
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchShopData();
        return () => { isMounted = false; };
    }, [activeStation]);

    useEffect(() => {
        if (!loading && requests.length > 0) {
            localStorage.setItem(`polar_twin_requests_${activeStation}`, JSON.stringify(requests));
        }
    }, [requests, activeStation, loading]);

    const handleCreateRequest = (newItem) => {
        const isAuthority = user.role === "authority";
        const newReq = {
            id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
            item: newItem.item,
            qty: newItem.qty,
            priority: newItem.priority,
            category: newItem.category,
            notes: newItem.notes,      
            status: isAuthority ? "APPROVED" : "PENDING",
            requestedBy: user.fullName,
            requestDate: new Date().toISOString()
        };
        
        setRequests([newReq, ...requests]);
        showToast(
            isAuthority ? "Priority order authorized and deployed to logistics." : "Requisition submitted for authority approval.",
            "success"
        );
    };

    const handleUpdateStatus = (id, newStatus, extraData = {}) => {
        setRequests(requests.map(req => {
            if (req.id === id) {
                const updatedReq = { ...req, status: newStatus, ...extraData };
                if (newStatus === "APPROVED" || newStatus === "REJECTED") updatedReq.approvedBy = user.fullName; 
                if (newStatus === "SHIPPED" || newStatus === "DELIVERED") updatedReq.handledBy = user.fullName; 
                return updatedReq;
            }
            return req;
        }));
        showToast(`Request ${id} updated to ${newStatus}.`, "info");
    };

    // FILTER LOGIC
    const filteredRequests = requests.filter(req => {
        const matchesSearch = 
            req.item.toLowerCase().includes(searchQuery.toLowerCase()) || 
            req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (req.category && req.category.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;

        const isHistory = req.status === "DELIVERED" || req.status === "REJECTED";
        if (activeTab === "active" && isHistory) return false;
        if (activeTab === "history" && !isHistory) return false;

        return true;
    });

    // =========================================================================
    // OPTIMIZED SKELETON LOADING STATE
    // =========================================================================
    if (loading) {
        return (
            <div className="w-full bg-amber-50 dark:bg-slate-950 min-h-screen font-sans pb-12 transition-colors duration-300">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
                    {/* Header Skeleton */}
                    <div className="mb-2 space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-2 items-start">
                        {/* LEFT COLUMN: Form Skeleton */}
                        <div className="lg:col-span-1">
                            <Skeleton className="h-[460px] w-full rounded-2xl" />
                        </div>

                        {/* RIGHT COLUMN: Queues Skeleton */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {/* Command Bar Skeleton */}
                            <Skeleton className="h-[60px] w-full rounded-2xl" />
                            
                            {/* Queue Container Skeleton */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-4 sm:p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
                                <Skeleton className="h-5 w-40 mb-4" />
                                <div className="space-y-3">
                                    {[1, 2].map((i) => <Skeleton key={i} className="h-[140px] w-full rounded-xl" />)}
                                </div>
                            </div>

                            {/* Transit Board Skeleton */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-4 sm:p-5 mt-2 dark:border-slate-800/80 dark:bg-slate-900/40">
                                <Skeleton className="h-5 w-48 mb-4" />
                                <div className="space-y-4">
                                    {[1, 2].map((i) => <Skeleton key={i} className="h-[120px] w-full rounded-xl" />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-amber-50 dark:bg-slate-950 min-h-screen">
                <div className="text-red-500 font-sans p-6 font-semibold">Error loading requisitions: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-amber-50 dark:bg-slate-950 min-h-screen font-sans pb-12 transition-colors duration-300">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
                
                {/* PAGE HEADER */}
                <div className="mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {activeStation} Requisition Center
                    </h1>
                    
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span>Authorization Level:</span> 
                        <span className="font-semibold text-cyan-600 dark:text-cyan-500">
                            {formatRole(user.role)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-2 items-start">
                    
                    {/* LEFT COLUMN: Input Forms */}
                    {(user.role === "station_master" || user.role === "authority") && (
                        <div className="lg:col-span-1">
                            <OrderForm onSubmit={handleCreateRequest} role={user.role} />
                        </div>
                    )}

                    {user.role === "logistics" && (
                        <div className="lg:col-span-1">
                            <DirectInventoryForm onAdd={(item) => {
                                setRequests([{ id: `INV-${Math.floor(Math.random() * 900) + 100}`, ...item, status: "DELIVERED", requestedBy: "Logistics Direct" }, ...requests]);
                                showToast("Inventory explicitly added to local stock.", "success");
                            }} />
                        </div>
                    )}

                    {/* RIGHT COLUMN: Queues */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        
                        {/* THE COMMAND BAR (Search & History Tabs) */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/70 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-2 sm:pl-4 sm:pr-2 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-colors duration-300">
                            <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0 text-slate-500">
                                <Search className="w-4 h-4 shrink-0" />
                                <input 
                                    type="text" 
                                    placeholder="Search by ID or item..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex w-full sm:w-auto bg-slate-100/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shrink-0">
                                <button 
                                    onClick={() => setActiveTab("active")}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "active" ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                >
                                    Active
                                </button>
                                <button 
                                    onClick={() => setActiveTab("history")}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "history" ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                >
                                    History
                                </button>
                            </div>
                        </div>

                        {/* QUEUE RENDERERS (Receiving pre-filtered data) */}
                        {user.role === "station_master" && (
                            <StationMasterQueue requests={filteredRequests.filter(r => r.requestedBy === user.fullName)} activeTab={activeTab} />
                        )}

                        {user.role === "authority" && (
                            <AuthorityQueue 
                                pending={filteredRequests.filter(r => r.status === "PENDING")} 
                                onUpdate={handleUpdateStatus} 
                                activeTab={activeTab}
                            />
                        )}

                        {user.role === "logistics" && (
                            <LogisticsQueue 
                                approved={filteredRequests.filter(r => r.status === "APPROVED" || r.status === "SHIPPED")} 
                                onUpdate={handleUpdateStatus} 
                                activeTab={activeTab}
                            />
                        )}
                        
                        {/* ONLY show Transit Board on 'active' tab */}
                        {activeTab === "active" && (
                            <ActiveTransitBoard 
                                shipments={filteredRequests.filter(r => r.status === "APPROVED" || r.status === "SHIPPED")} 
                            />
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}