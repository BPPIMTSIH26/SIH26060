import React from "react";
import { CheckCircle2, XCircle, Truck, PackageCheck, AlertTriangle } from "lucide-react";

export function QueueCard({ req, children }) {
    const statusColors = {
        PENDING: "text-amber-700 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
        APPROVED: "text-cyan-700 bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800",
        SHIPPED: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        DELIVERED: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
        REJECTED: "text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800"
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 shadow-sm transition-all hover:border-cyan-500/50 font-sans">
            <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{req.id}</span>
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${statusColors[req.status] || statusColors.PENDING}`}>
                        {req.status}
                    </span>
                    {req.priority === "Critical" && <span className="text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded border text-red-700 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800">Critical</span>}
                </div>
                
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{req.qty}x {req.item}</p>
                
                <div className="mt-2 space-y-0.5">
                    <p className="text-[0.7rem] text-gray-500 tracking-wide">
                        Requested by: <span className="font-semibold text-gray-700 dark:text-slate-300">{req.requestedBy}</span>
                    </p>
                    {req.approvedBy && (
                        <p className="text-[0.7rem] text-cyan-700 dark:text-cyan-500 tracking-wide">
                            Authorized by: <span className="font-semibold">{req.approvedBy}</span>
                        </p>
                    )}
                    {req.handledBy && (
                        <p className="text-[0.7rem] text-emerald-700 dark:text-emerald-500 tracking-wide">
                            Handled by: <span className="font-semibold">{req.handledBy}</span>
                        </p>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

export function StationMasterQueue({ requests }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100/50 dark:bg-slate-900/20 p-5 font-sans">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4">My Requisitions</h3>
            <div className="space-y-3">
                {requests.length === 0 ? <p className="text-sm text-gray-500">No active requisitions.</p> : requests.map(req => (
                    <QueueCard key={req.id} req={req} />
                ))}
            </div>
        </div>
    );
}

export function AuthorityQueue({ pending, onUpdate }) {
    return (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-100/50 dark:bg-amber-950/10 p-5 font-sans">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Pending Authorization
            </h3>
            <div className="space-y-3">
                {pending.length === 0 ? <p className="text-sm text-gray-500">Queue clear. No pending approvals.</p> : pending.map(req => (
                    <QueueCard key={req.id} req={req}>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                            <button onClick={() => onUpdate(req.id, "REJECTED")} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors" title="Reject"><XCircle className="w-5 h-5"/></button>
                            <button onClick={() => onUpdate(req.id, "APPROVED")} className="p-2 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 transition-colors" title="Approve"><CheckCircle2 className="w-5 h-5"/></button>
                        </div>
                    </QueueCard>
                ))}
            </div>
        </div>
    );
}

export function LogisticsQueue({ approved, onUpdate }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 p-5 font-sans">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4">Fulfillment Pipeline</h3>
            <div className="space-y-3">
                {approved.length === 0 ? <p className="text-sm text-gray-500">No approved orders pending shipment.</p> : approved.map(req => (
                    <QueueCard key={req.id} req={req}>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                            {req.status === "APPROVED" && (
                                <button onClick={() => onUpdate(req.id, "SHIPPED")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-wide hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
                                    <Truck className="w-4 h-4"/> Dispatch
                                </button>
                            )}
                            {req.status === "SHIPPED" && (
                                <button onClick={() => onUpdate(req.id, "DELIVERED")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                                    <PackageCheck className="w-4 h-4"/> Receive
                                </button>
                            )}
                        </div>
                    </QueueCard>
                ))}
            </div>
        </div>
    );
}

export function ActiveTransitBoard({ shipments }) {
    if (shipments.length === 0) return null; 

    return (
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent p-5 mt-6 font-sans">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Live Transit Radar
            </h3>
            
            <div className="space-y-4">
                {shipments.map(req => (
                    <div key={req.id} className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-blue-100 dark:border-blue-900/30 shadow-[0_4px_15px_-3px_rgba(59,130,246,0.1)] dark:shadow-[0_4px_15px_-3px_rgba(59,130,246,0.05)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="font-bold text-sm text-gray-900 dark:text-white">{req.qty}x {req.item}</span>
                                <p className="text-[0.7rem] font-medium text-gray-500 mt-1">
                                    Req by: {req.requestedBy} {req.handledBy && `• Dispatched by: ${req.handledBy}`}
                                </p>
                            </div>
                            <span className="text-[0.65rem] text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded font-bold tracking-wide">
                                {req.id}
                            </span>
                        </div>

                        {/* Tracking Progress Bar */}
                        <div className="w-full">
                            <div className="flex justify-between mb-2 px-1">
                                <span className="text-[0.65rem] font-semibold text-gray-400">Authorized</span>
                                <span className={`text-[0.65rem] font-semibold ${req.status === 'APPROVED' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}>Processing</span>
                                <span className={`text-[0.65rem] font-semibold ${req.status === 'SHIPPED' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>In Transit</span>
                                <span className="text-[0.65rem] font-semibold text-gray-400">Delivered</span>
                            </div>
                            
                            <div className="relative h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
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