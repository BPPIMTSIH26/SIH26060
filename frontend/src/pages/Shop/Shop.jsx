import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../../components/context/ToastContext";
import { shopAPI } from "../../services/shop";

import Skeleton from "../../components/context/Skeleton";
import { OrderForm, DirectInventoryForm } from "./components/ShopForms";
import { StationMasterQueue, AuthorityQueue, LogisticsQueue, ActiveTransitBoard } from "./components/ShopQueues";

export default function Shop() {
    const { activeStation = "Maitri" } = useOutletContext() || {};
    const showToast = useToast();
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [user, setUser] = useState({ fullName: "Operator", role: "station_master" });

    const formatRole = (roleString) => {
        if (!roleString) return "";
        return roleString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // 1. Establish User Session
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

    // 2. Fetch Initial API Data OR Load from Local "Real-Time" DB
    useEffect(() => {
        let isMounted = true;
        const fetchShopData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Check if we have a saved state for this station to persist across logouts
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

    // --- REAL-TIME SYNC ENGINE ---
    // Automatically saves every change to localStorage so it survives when you switch accounts
    useEffect(() => {
        if (!loading && requests.length > 0) {
            localStorage.setItem(`polar_twin_requests_${activeStation}`, JSON.stringify(requests));
        }
    }, [requests, activeStation, loading]);

    // 3. State Mutations
    const handleCreateRequest = (newItem) => {
        const isAuthority = user.role === "authority";
        const newReq = {
            id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
            item: newItem.item,
            qty: newItem.qty,
            priority: newItem.priority,
            status: isAuthority ? "APPROVED" : "PENDING",
            requestedBy: user.fullName
        };
        
        setRequests([newReq, ...requests]);
        showToast(
            isAuthority ? "Priority order authorized and deployed to logistics." : "Requisition submitted for authority approval.",
            "success"
        );
    };

    const handleUpdateStatus = (id, newStatus) => {
        setRequests(requests.map(req => {
            if (req.id === id) {
                const updatedReq = { ...req, status: newStatus };
                
                if (newStatus === "APPROVED" || newStatus === "REJECTED") {
                    updatedReq.approvedBy = user.fullName; 
                }
                if (newStatus === "SHIPPED" || newStatus === "DELIVERED") {
                    updatedReq.handledBy = user.fullName; 
                }
                
                return updatedReq;
            }
            return req;
        }));
        showToast(`Request ${id} updated to ${newStatus}.`, "info");
    };

    if (loading) {
        return (
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full min-h-screen bg-amber-50 dark:bg-slate-950">
                <div className="mb-2 space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-1 h-[400px] rounded-xl" />
                    <Skeleton className="lg:col-span-2 h-[600px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 font-sans p-6">Error loading requisitions: {error}</div>;
    }

    return (
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
            
            <div className="mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
                    {activeStation} Requisition Center
                </h1>
                
                <div className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span>Authorization Level:</span> 
                    <span className="font-semibold text-cyan-600 dark:text-cyan-500">
                        {formatRole(user.role)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                
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

                <div className="lg:col-span-2 space-y-4">
                    
                    {user.role === "station_master" && (
                        <StationMasterQueue requests={requests.filter(r => r.requestedBy === user.fullName)} />
                    )}

                    {user.role === "authority" && (
                        <AuthorityQueue 
                            pending={requests.filter(r => r.status === "PENDING")} 
                            onUpdate={handleUpdateStatus} 
                        />
                    )}

                    {user.role === "logistics" && (
                        <LogisticsQueue 
                            approved={requests.filter(r => r.status === "APPROVED" || r.status === "SHIPPED")} 
                            onUpdate={handleUpdateStatus} 
                        />
                    )}
                    
                    <ActiveTransitBoard 
                        shipments={requests.filter(r => r.status === "APPROVED" || r.status === "SHIPPED")} 
                    />

                </div>
            </div>
        </div>
    );
}