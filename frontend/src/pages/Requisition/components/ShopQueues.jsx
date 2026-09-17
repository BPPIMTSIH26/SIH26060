import { useState } from "react";
import { CheckCircle2, XCircle, Truck, PackageCheck, AlertTriangle, MessageSquare, Clock } from "lucide-react";

export function QueueCard({ req, children }) {
    const statusColors = {
        PENDING: "text-amber-700 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
        APPROVED: "text-cyan-700 bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800",
        SHIPPED: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        DELIVERED: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
        REJECTED: "text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800"
    };

    return (
        <div className="flex flex-col p-4 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] transition-all hover:border-cyan-500/40 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full">
                <div className="flex-1 min-w-0 pr-0 sm:pr-4">
                    
                    {/* Status Row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{req.id}</span>
                        <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusColors[req.status] || statusColors.PENDING}`}>
                            {req.status === "APPROVED" ? "Awaiting Shipment" : req.status}
                        </span>
                        {req.priority === "Critical" && <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800">Critical</span>}
                        {req.category && <span className="text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{req.category}</span>}
                    </div>
                    
                    {/* Item Details */}
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                        <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-1">{req.qty}x</span> 
                        {req.item}
                    </p>
                    
                    {req.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2 line-clamp-2">"{req.notes}"</p>
                    )}
                    
                    {/* New: Display Rejection Reason if exists */}
                    {req.rejectReason && (
                        <div className="mt-2 mb-2 flex items-start gap-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50">
                            <MessageSquare className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-800 dark:text-red-300 font-medium">Auth Note: {req.rejectReason}</p>
                        </div>
                    )}

                    {/* New: Display ETA if Shipped */}
                    {req.etaDays && req.status !== "DELIVERED" && req.status !== "REJECTED" && (
                        <div className="mt-2 mb-2 flex items-start gap-1.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[0.7rem] text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">Estimated Delivery: {req.etaDays} Days</p>
                        </div>
                    )}
                    
                    {/* Chain of Custody */}
                    <div className="mt-2 space-y-0.5">
                        <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-medium">
                            Req by: <span className="font-bold text-slate-700 dark:text-slate-300">{req.requestedBy}</span>
                        </p>
                        {req.approvedBy && (
                            <p className="text-[0.65rem] text-cyan-700 dark:text-cyan-500 font-medium">
                                Auth by: <span className="font-bold">{req.approvedBy}</span>
                            </p>
                        )}
                        {req.handledBy && (
                            <p className="text-[0.65rem] text-emerald-700 dark:text-emerald-500 font-medium">
                                Handled by: <span className="font-bold">{req.handledBy}</span>
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="mt-3 sm:mt-0 flex-shrink-0 w-full sm:w-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function StationMasterQueue({ requests, activeTab }) {
    return (
        <div className="rounded-2xl border border-amber-200/50 dark:border-slate-800/80 bg-amber-50/50 dark:bg-slate-900/30 p-4 sm:p-5 font-sans h-full">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                {activeTab === "active" ? "My Active Requisitions" : "Requisition History"}
            </h3>
            <div className="space-y-3">
                {requests.length === 0 ? <p className="text-sm font-medium text-slate-500">No records found.</p> : requests.map(req => (
                    <QueueCard key={req.id} req={req} />
                ))}
            </div>
        </div>
    );
}

export function AuthorityQueue({ pending, onUpdate, activeTab }) {
    // State for the floating Rejection Modal
    const [rejectId, setRejectId] = useState(null);
    const [reason, setReason] = useState("");

    if (activeTab === "history") {
        return (
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 font-sans h-full">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Authorization History</h3>
                <div className="space-y-3">
                    {pending.length === 0 ? <p className="text-sm font-medium text-slate-500">No records found.</p> : pending.map(req => (
                        <QueueCard key={req.id} req={req} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/80 dark:bg-amber-950/20 p-4 sm:p-5 font-sans h-full transition-colors relative">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Pending Authorization
                </h3>
                <div className="space-y-3">
                    {pending.length === 0 ? <p className="text-sm font-medium text-slate-500">Queue clear. No pending approvals.</p> : pending.map(req => (
                        <QueueCard key={req.id} req={req}>
                            <div className="flex sm:flex-col gap-2">
                                <button onClick={() => onUpdate(req.id, "APPROVED")} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                                    <CheckCircle2 className="w-4 h-4"/> Approve
                                </button>
                                <button onClick={() => setRejectId(req.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                    <XCircle className="w-4 h-4"/> Reject
                                </button>
                            </div>
                        </QueueCard>
                    ))}
                </div>
            </div>

            {/* FLOATING REJECTION MODAL */}
            {rejectId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-red-50 dark:bg-red-950/20">
                            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Reject Requisition</h3>
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium tracking-wide">ID: {rejectId}</p>
                            </div>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Reason for Rejection
                                </label>
                                <textarea 
                                    value={reason} 
                                    onChange={(e) => setReason(e.target.value)} 
                                    placeholder="Please provide a detailed reason for denying this request. This will be visible to the Station Master." 
                                    rows="4"
                                    className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white resize-none"
                                    autoFocus
                                />
                            </div>
                            
                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => { setRejectId(null); setReason(""); }} 
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => { 
                                        onUpdate(rejectId, "REJECTED", { rejectReason: reason || "No reason provided." }); 
                                        setRejectId(null); 
                                        setReason(""); 
                                    }} 
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function LogisticsQueue({ approved, onUpdate, activeTab }) {
    // Inline state for ETA Input
    const [dispatchId, setDispatchId] = useState(null);
    const [etaDays, setEtaDays] = useState(5);

    if (activeTab === "history") {
        return (
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 font-sans h-full">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Delivery History</h3>
                <div className="space-y-3">
                    {approved.length === 0 ? <p className="text-sm font-medium text-slate-500">No records found.</p> : approved.map(req => (
                        <QueueCard key={req.id} req={req} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 font-sans h-full">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Fulfillment Pipeline</h3>
            <div className="space-y-3">
                {approved.length === 0 ? <p className="text-sm font-medium text-slate-500">No approved orders pending shipment.</p> : approved.map(req => (
                    <QueueCard key={req.id} req={req}>
                        
                        {dispatchId === req.id ? (
                            <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Est. Time of Arrival (Days)</p>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={etaDays} 
                                    onChange={(e) => setEtaDays(e.target.value)} 
                                    className="w-full text-sm px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold text-slate-900 dark:text-white"
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-1">
                                    <button onClick={() => { setDispatchId(null); setEtaDays(5); }} className="flex-1 py-1.5 rounded-md text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                    <button 
                                        onClick={() => { onUpdate(req.id, "SHIPPED", { etaDays, shippedDate: new Date().toISOString() }); setDispatchId(null); setEtaDays(5); }} 
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                    ><Truck className="w-3.5 h-3.5"/> Send</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                {req.status === "APPROVED" && (
                                    <button onClick={() => setDispatchId(req.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
                                        <Truck className="w-4 h-4"/> Dispatch
                                    </button>
                                )}
                                {req.status === "SHIPPED" && (
                                    <button onClick={() => onUpdate(req.id, "DELIVERED")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                                        <PackageCheck className="w-4 h-4"/> Receive
                                    </button>
                                )}
                            </div>
                        )}
                    </QueueCard>
                ))}
            </div>
        </div>
    );
}

export function ActiveTransitBoard({ shipments }) {
    if (shipments.length === 0) return null; 

    return (
        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 to-white/50 dark:from-blue-950/30 dark:to-slate-900/30 backdrop-blur-md p-4 sm:p-5 mt-6 font-sans">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Live Transit Radar
            </h3>
            
            <div className="space-y-4">
                {shipments.map(req => (
                    <div key={req.id} className="p-4.5 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-blue-100/50 dark:border-blue-900/30 shadow-[0_4px_15px_-3px_rgba(59,130,246,0.08)] dark:shadow-[0_4px_15px_-3px_rgba(59,130,246,0.05)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                                    <span className="font-mono text-blue-600 dark:text-blue-400 mr-1">{req.qty}x</span> 
                                    {req.item}
                                </span>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[0.65rem] font-medium text-slate-500">
                                    <p>Req by: <span className="font-bold">{req.requestedBy}</span></p>
                                    {req.handledBy && <p>• Shipped by: <span className="font-bold">{req.handledBy}</span></p>}
                                    {/* New: Display ETA on Radar */}
                                    {req.etaDays && <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">• ETA: {req.etaDays} Days</p>}
                                </div>
                            </div>
                            <span className="text-[0.6rem] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded-md font-mono font-bold tracking-wider shrink-0">
                                {req.id}
                            </span>
                        </div>

                        {/* Tracking Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between mb-2 px-1">
                                <span className="text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Authorized</span>
                                <span className={`text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-wider ${req.status === 'APPROVED' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-400'}`}>Awaiting Ship</span>
                                <span className={`text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-wider ${req.status === 'SHIPPED' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>In Transit</span>
                                <span className="text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Delivered</span>
                            </div>
                            
                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                                    req.status === 'APPROVED' ? 'w-[45%] bg-cyan-500' :
                                    req.status === 'SHIPPED' ? 'w-[80%] bg-blue-500' : 'w-[10%]'
                                }`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}