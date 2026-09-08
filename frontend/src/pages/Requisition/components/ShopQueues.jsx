import { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Truck,
    PackageCheck,
    AlertTriangle,
    Loader2,
} from "lucide-react";

const requirementStatusColors = {
    PENDING:
        "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400",

    PROCESSING:
        "text-cyan-700 bg-cyan-100 border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-400",

    FULFILLED:
        "text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400",

    REJECTED:
        "text-red-700 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400",

    CANCELLED:
        "text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400",
};

const shipmentStatusColors = {
    PREPARING:
        "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400",

    IN_TRANSIT:
        "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400",

    ARRIVED:
        "text-cyan-700 bg-cyan-100 border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-400",

    RECEIVED:
        "text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400",

    CANCELLED:
        "text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400",
};

const formatStatus = (value) =>
    String(value || "UNKNOWN")
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );

function QueueCard({
    req,
    children,
}) {
    const status =
        req?.status ||
        "PENDING";

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {
                            req?.requirementNumber ||
                            "REQ-UNKNOWN"
                        }
                    </span>

                    <span
                        className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            requirementStatusColors[
                                status
                            ] ||
                            requirementStatusColors.PENDING
                        }`}
                    >
                        {formatStatus(
                            status
                        )}
                    </span>

                    {req?.priority && (
                        <span className="text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {
                                req.priority
                            }
                        </span>
                    )}

                    {req?.category && (
                        <span className="text-[0.6rem] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {
                                req.category
                            }
                        </span>
                    )}
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-1">
                        {req?.quantity ?? 0}
                        {req?.unit
                            ? ` ${req.unit}`
                            : ""}
                    </span>

                    {req?.title ||
                        "Untitled Requirement"}
                </p>

                {req?.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
                        "{req.description}"
                    </p>
                )}

                {req?.rejectionReason && (
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 mb-2">
                        <p className="text-xs text-red-800 dark:text-red-300 font-medium">
                            Rejection Reason:{" "}
                            {
                                req.rejectionReason
                            }
                        </p>
                    </div>
                )}

                <div className="text-[0.65rem] text-slate-500 dark:text-slate-400">
                    Requested by:{" "}
                    <span className="font-bold">
                        {
                            req?.requestedBy ||
                            "Unknown"
                        }
                    </span>
                </div>

                {req?.processedBy && (
                    <div className="text-[0.65rem] text-cyan-600 dark:text-cyan-400 mt-1">
                        Processed by:{" "}
                        <span className="font-bold">
                            {
                                req.processedBy
                            }
                        </span>
                    </div>
                )}
            </div>

            <div className="shrink-0">
                {children}
            </div>
        </div>
    );
}

export function StationMasterQueue({
    requests = [],
    activeTab,
    onUpdate,
    shipments = [],
}) {
    const shipmentByRequirement =
        new Map(
            shipments
                .filter(
                    (shipment) =>
                        shipment
                            ?.requirement
                            ?.requirementNumber
                )
                .map(
                    (shipment) => [
                        shipment
                            .requirement
                            .requirementNumber,
                        shipment,
                    ]
                )
        );

    return (
        <div className="rounded-2xl border border-amber-200/50 dark:border-slate-800/80 bg-amber-50/50 dark:bg-slate-900/30 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                {activeTab === "active"
                    ? "My Active Requirements"
                    : "Requirement History"}
            </h3>

            <div className="space-y-3">
                {requests.length ===
                0 ? (
                    <p className="text-sm text-slate-500">
                        No records found.
                    </p>
                ) : (
                    requests.map(
                        (req) => {
                            const shipment =
                                shipmentByRequirement.get(
                                    req.requirementNumber
                                );

                            return (
                                <QueueCard
                                    key={
                                        req.requirementNumber
                                    }
                                    req={
                                        req
                                    }
                                >
                                    {activeTab ===
                                        "active" &&
                                        req.status ===
                                            "PENDING" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdate?.(
                                                        req.requirementNumber,
                                                        "CANCELLED"
                                                    )
                                                }
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        )}

                                    {shipment &&
                                        req.status ===
                                            "PROCESSING" && (
                                            <span className="text-xs font-bold text-blue-600">
                                                Shipment:{" "}
                                                {
                                                    shipment.shipmentNumber
                                                }
                                            </span>
                                        )}

                                    {shipment?.status ===
                                        "ARRIVED" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onUpdate?.(
                                                    shipment.shipmentNumber,
                                                    "RECEIVE_SHIPMENT"
                                                )
                                            }
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold"
                                        >
                                            <PackageCheck className="w-4 h-4" />
                                            Receive
                                        </button>
                                    )}
                                </QueueCard>
                            );
                        }
                    )
                )}
            </div>
        </div>
    );
}

export function AuthorityQueue({
    pending = [],
    history = [],
    activeTab,
}) {
    const records =
        activeTab === "history"
            ? history
            : pending;

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                {activeTab ===
                "history"
                    ? "Requirement History"
                    : "All Station Requirements"}
            </h3>

            <div className="space-y-3">
                {records.length === 0 ? (
                    <p className="text-sm font-medium text-slate-500">
                        No records found.
                    </p>
                ) : (
                    records.map(
                        (req) => (
                            <QueueCard
                                key={
                                    req.requirementNumber
                                }
                                req={
                                    req
                                }
                            />
                        )
                    )
                )}
            </div>
        </div>
    );
}

export function LogisticsQueue({
    requests = [],
    shipments = [],
    onRequirementUpdate,
    onCreateShipment,
    onShipmentUpdate,
    activeTab,
}) {
    const [busy, setBusy] =
        useState(null);

    const processingRequirements =
        requests.filter(
            (req) =>
                req.status ===
                    "PENDING" ||
                req.status ===
                    "PROCESSING"
        );

    const requirementHistory =
        requests.filter(
            (req) =>
                req.status ===
                    "FULFILLED" ||
                req.status ===
                    "REJECTED" ||
                req.status ===
                    "CANCELLED"
        );

    const shownRequirements =
        activeTab === "history"
            ? requirementHistory
            : processingRequirements;

    const existingShipmentFor =
        (requirementNumber) =>
            shipments.find(
                (shipment) =>
                    shipment?.requirement
                        ?.requirementNumber ===
                    requirementNumber
            );

    const run =
        async (
            key,
            action
        ) => {
            setBusy(key);

            try {
                if (
                    action ===
                    "PROCESSING"
                ) {
                    await onRequirementUpdate?.(
                        key,
                        "PROCESSING"
                    );
                } else if (
                    action ===
                    "REJECTED"
                ) {
                    await onRequirementUpdate?.(
                        key,
                        "REJECTED"
                    );
                } else if (
                    action ===
                    "FULFILLED"
                ) {
                    await onRequirementUpdate?.(
                        key,
                        "FULFILLED"
                    );
                } else {
                    await onShipmentUpdate?.(
                        key,
                        action
                    );
                }
            } finally {
                setBusy(
                    null
                );
            }
        };

    return (
        <div className="space-y-4">

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/30 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {activeTab ===
                    "history"
                        ? "Requirement History"
                        : "Requirement Processing"}
                </h3>

                <div className="space-y-3">
                    {shownRequirements.length ===
                    0 ? (
                        <p className="text-sm text-slate-500">
                            No records found.
                        </p>
                    ) : (
                        shownRequirements.map(
                            (req) => {
                                const shipment =
                                    existingShipmentFor(
                                        req.requirementNumber
                                    );

                                return (
                                    <QueueCard
                                        key={
                                            req.requirementNumber
                                        }
                                        req={
                                            req
                                        }
                                    >
                                        {activeTab ===
                                            "active" &&
                                            req.status ===
                                                "PENDING" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busy !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            run(
                                                                req.requirementNumber,
                                                                "PROCESSING"
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold disabled:opacity-50"
                                                    >
                                                        {busy ===
                                                        req.requirementNumber ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        )}
                                                        Process
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busy !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            run(
                                                                req.requirementNumber,
                                                                "REJECTED"
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                        {activeTab ===
                                            "active" &&
                                            req.status ===
                                                "PROCESSING" && (
                                                <div className="flex flex-col gap-2">
                                                    {shipment ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                                                            <PackageCheck className="w-4 h-4" />
                                                            {
                                                                shipment.shipmentNumber
                                                            }
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                busy !==
                                                                null
                                                            }
                                                            onClick={async () => {
                                                                setBusy(
                                                                    req.requirementNumber
                                                                );

                                                                try {
                                                                    await onCreateShipment?.(
                                                                        req
                                                                    );
                                                                } finally {
                                                                    setBusy(
                                                                        null
                                                                    );
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold disabled:opacity-50"
                                                        >
                                                            {busy ===
                                                            req.requirementNumber ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Truck className="w-4 h-4" />
                                                            )}
                                                            Create Shipment
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            busy !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            run(
                                                                req.requirementNumber,
                                                                "FULFILLED"
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Fulfill
                                                    </button>
                                                </div>
                                            )}
                                    </QueueCard>
                                );
                            }
                        )
                    )}
                </div>
            </div>

            <ShipmentQueue
                shipments={
                    shipments
                }
                onUpdate={
                    onShipmentUpdate
                }
                activeTab={
                    activeTab
                }
            />
        </div>
    );
}

export function ShipmentQueue({
    shipments = [],
    onUpdate,
    activeTab,
}) {
    const [busy, setBusy] =
        useState(null);

    const filtered =
        activeTab ===
            "history"
            ? shipments.filter(
                  (shipment) =>
                      shipment.status ===
                          "RECEIVED" ||
                      shipment.status ===
                          "CANCELLED"
              )
            : shipments.filter(
                  (shipment) =>
                      shipment.status ===
                          "PREPARING" ||
                      shipment.status ===
                          "IN_TRANSIT" ||
                      shipment.status ===
                          "ARRIVED"
              );

    return (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                {activeTab ===
                "history"
                    ? "Shipment History"
                    : "Fulfillment Pipeline"}
            </h3>

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No shipment records found.
                    </p>
                ) : (
                    filtered.map(
                        (shipment) => (
                            <div
                                key={
                                    shipment.shipmentNumber
                                }
                                className="p-4 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800"
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                                {
                                                    shipment.shipmentNumber
                                                }
                                            </span>

                                            <span
                                                className={`px-2 py-1 rounded-md border text-[0.6rem] font-bold uppercase ${
                                                    shipmentStatusColors[
                                                        shipment.status
                                                    ] ||
                                                    shipmentStatusColors.PREPARING
                                                }`}
                                            >
                                                {formatStatus(
                                                    shipment.status
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {
                                                shipment.quantity
                                            }{" "}
                                            {
                                                shipment.unit
                                            }{" "}
                                            {
                                                shipment.title
                                            }
                                        </p>

                                        {shipment.station?.name && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                Station:{" "}
                                                {
                                                    shipment.station
                                                        .name
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {activeTab ===
                                        "active" &&
                                        shipment.status ===
                                            "PREPARING" && (
                                            <button
                                                type="button"
                                                disabled={
                                                    busy !==
                                                    null
                                                }
                                                onClick={async () => {
                                                    setBusy(
                                                        shipment.shipmentNumber
                                                    );

                                                    try {
                                                        await onUpdate?.(
                                                            shipment.shipmentNumber,
                                                            "IN_TRANSIT"
                                                        );
                                                    } finally {
                                                        setBusy(
                                                            null
                                                        );
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold disabled:opacity-50"
                                            >
                                                {busy ===
                                                shipment.shipmentNumber ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Truck className="w-4 h-4" />
                                                )}
                                                Dispatch
                                            </button>
                                        )}

                                    {activeTab ===
                                        "active" &&
                                        shipment.status ===
                                            "IN_TRANSIT" && (
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                In Transit
                                            </span>
                                        )}

                                    {activeTab ===
                                        "active" &&
                                        shipment.status ===
                                            "ARRIVED" && (
                                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                                                Awaiting Station Receipt
                                            </span>
                                        )}
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}

export function ActiveTransitBoard({
    shipments = [],
}) {
    const active = shipments.filter(
        (shipment) =>
            shipment.status ===
                "PREPARING" ||
            shipment.status ===
                "IN_TRANSIT" ||
            shipment.status ===
                "ARRIVED"
    );

    if (active.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Live Transit Radar
            </h3>

            <div className="space-y-4">
                {active.map(
                    (shipment) => {
                        const width =
                            shipment.status ===
                            "PREPARING"
                                ? "w-[25%]"
                                : shipment.status ===
                                  "IN_TRANSIT"
                                ? "w-[65%]"
                                : "w-[85%]";

                        return (
                            <div
                                key={
                                    shipment.shipmentNumber
                                }
                                className="p-4 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-blue-100 dark:border-blue-900/30"
                            >
                                <div className="flex justify-between gap-3 mb-3">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            {
                                                shipment.quantity
                                            }{" "}
                                            {
                                                shipment.unit
                                            }{" "}
                                            {
                                                shipment.title
                                            }
                                        </p>
                                    </div>

                                    <span className="font-mono text-[0.6rem] font-bold text-blue-700 dark:text-blue-300">
                                        {
                                            shipment.shipmentNumber
                                        }
                                    </span>
                                </div>

                                <span
                                    className={`inline-flex px-2 py-1 rounded-md border text-[0.6rem] font-bold uppercase ${
                                        shipmentStatusColors[
                                            shipment.status
                                        ] ||
                                        shipmentStatusColors.PREPARING
                                    }`}
                                >
                                    {formatStatus(
                                        shipment.status
                                    )}
                                </span>

                                <div className="mt-3">
                                    <div className="flex justify-between text-[0.55rem] uppercase font-semibold text-slate-500 mb-2">
                                        <span>
                                            Preparing
                                        </span>
                                        <span>
                                            In Transit
                                        </span>
                                        <span>
                                            Arrived
                                        </span>
                                        <span>
                                            Received
                                        </span>
                                    </div>

                                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-blue-500 transition-all ${width}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </section>
    );
}