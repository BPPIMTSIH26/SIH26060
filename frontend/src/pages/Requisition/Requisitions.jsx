import { useEffect, useMemo, useState } from "react";
import {
    useOutletContext,
} from "react-router-dom";
import { Search } from "lucide-react";

import {
    requirementsAPI,
} from "../../services/api/requirements.js";

import {
    logisticsAPI,
} from "../../services/api/logistics";

import {
    useToast,
} from "../../components/context/ToastContext";

import Skeleton from "../../components/context/Skeleton";

import {
    OrderForm,
} from "./components/ShopForms";

import {
    StationMasterQueue,
    AuthorityQueue,
    LogisticsQueue,
    ActiveTransitBoard,
} from "./components/ShopQueues";

const ROLE_STATION_MANAGER =
    "Station Manager";

const ROLE_NCPOR =
    "NCPOR Operator";

const ROLE_LOGISTICS =
    "Logistics Manager";

export default function Requisitions() {
    const {
        activeStation = "Maitri",
    } = useOutletContext() || {};

    const showToast =
        useToast();

    const [user, setUser] =
        useState(null);

    const [requests, setRequests] =
        useState([]);

    const [shipments, setShipments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [activeTab, setActiveTab] =
        useState("active");

    useEffect(() => {
        try {
            const stored =
                localStorage.getItem(
                    "polar_twin_user"
                );

            if (
                stored &&
                stored !== "undefined"
            ) {
                setUser(
                    JSON.parse(stored)
                );
            }
        } catch {
            setUser(null);
        }
    }, []);

    const userRole =
        user?.role ||
        ROLE_STATION_MANAGER;

    const fetchData =
        async () => {
            setLoading(true);
            setError(null);

            try {
                const [
                    requirementsRes,
                    logisticsRes,
                ] =
                    await Promise.all([
                        requirementsAPI.getRequirements(
                            activeStation
                        ),

                        logisticsAPI.getStationLogistics(
                            activeStation
                        ),
                    ]);

                setRequests(
                    requirementsRes?.data
                        ?.requisitions ||
                        []
                );

                setShipments(
                    logisticsRes?.shipments ||
                    []
                );
            } catch (err) {
                setError(
                    err?.message ||
                        "Failed to load requisitions."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, [activeStation]);

    const handleCreateRequest =
        async (payload) => {
            try {
                const response =
                    await requirementsAPI.createRequirement(
                        payload
                    );

                if (
                    response?.requirement
                ) {
                    setRequests(
                        (prev) => [
                            response.requirement,
                            ...prev,
                        ]
                    );
                } else {
                    await fetchData();
                }

                showToast(
                    "Requirement submitted successfully.",
                    "success"
                );
            } catch (error) {
                showToast(
                    error?.message ||
                        "Failed to create requirement.",
                    "error"
                );

                throw error;
            }
        };

    const handleRequirementStatus =
        async (
            requirementNumber,
            status,
            extraData = {}
        ) => {
            try {
                const response =
                    await requirementsAPI.updateStatus(
                        requirementNumber,
                        status,
                        extraData
                    );

                if (
                    response?.requirement
                ) {
                    setRequests(
                        (prev) =>
                            prev.map(
                                (req) =>
                                    req.requirementNumber ===
                                    requirementNumber
                                        ? response.requirement
                                        : req
                            )
                    );
                } else {
                    await fetchData();
                }

                showToast(
                    `Requirement ${requirementNumber} updated to ${status}.`,
                    "success"
                );
            } catch (error) {
                showToast(
                    error?.message ||
                        "Failed to update requirement.",
                    "error"
                );

                throw error;
            }
        };

    const handleCreateShipment =
        async (requirement) => {
            try {
                const shipmentNumber =
                    `SHIP-${requirement.requirementNumber}-${Date.now()}`;

                await logisticsAPI.createShipment(
                    {
                        shipmentNumber,
                        requirementNumber:
                            requirement.requirementNumber,
                        title:
                            requirement.title,
                        description:
                            requirement.description ||
                            "",
                        category:
                            requirement.category,
                        quantity:
                            requirement.quantity,
                        unit:
                            requirement.unit ||
                            "unit",
                    }
                );

                showToast(
                    `Shipment ${shipmentNumber} created.`,
                    "success"
                );

                await fetchData();
            } catch (error) {
                showToast(
                    error?.message ||
                        "Failed to create shipment.",
                    "error"
                );

                throw error;
            }
        };

    const handleShipmentStatus =
        async (
            shipmentNumber,
            status
        ) => {
            try {
                if (
                    status ===
                    "RECEIVE_SHIPMENT"
                ) {
                    await logisticsAPI.receiveShipment(
                        shipmentNumber
                    );
                } else {
                    await logisticsAPI.updateShipmentStatus(
                        shipmentNumber,
                        status
                    );
                }

                showToast(
                    `Shipment ${shipmentNumber} updated.`,
                    "success"
                );

                await fetchData();
            } catch (error) {
                showToast(
                    error?.message ||
                        "Failed to update shipment.",
                    "error"
                );

                throw error;
            }
        };

    const isHistoryStatus =
        (status) =>
            status ===
                "FULFILLED" ||
            status ===
                "REJECTED" ||
            status ===
                "CANCELLED";

    const filteredRequests =
        useMemo(() => {
            const search =
                searchQuery
                    .trim()
                    .toLowerCase();

            return requests.filter(
                (req) => {
                    const searchable = [
                        req.requirementNumber,
                        req.title,
                        req.description,
                        req.category,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    if (
                        search &&
                        !searchable.includes(
                            search
                        )
                    ) {
                        return false;
                    }

                    const history =
                        isHistoryStatus(
                            req.status
                        );

                    if (
                        activeTab ===
                            "history" &&
                        !history
                    ) {
                        return false;
                    }

                    if (
                        activeTab ===
                            "active" &&
                        history
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [
            requests,
            searchQuery,
            activeTab,
        ]);

    const filteredShipments =
        useMemo(() => {
            return shipments.filter(
                (shipment) => {
                    const searchable = [
                        shipment.shipmentNumber,
                        shipment.title,
                        shipment.category,
                        shipment.station
                            ?.name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return (
                        !searchQuery
                            .trim() ||
                        searchable.includes(
                            searchQuery
                                .trim()
                                .toLowerCase()
                        )
                    );
                }
            );
        }, [
            shipments,
            searchQuery,
        ]);

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 dark:bg-slate-950 p-4 md:p-6">
                <div className="max-w-[1600px] mx-auto space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Skeleton className="h-[460px] rounded-2xl" />

                        <div className="lg:col-span-2 space-y-4">
                            <Skeleton className="h-16 rounded-2xl" />
                            <Skeleton className="h-[300px] rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-600 dark:text-red-400 font-semibold">
                Error loading requisitions:{" "}
                {error}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-amber-50 dark:bg-slate-950 font-sans pb-12">
            <div className="mx-auto max-w-[1600px] p-4 md:p-6 space-y-4">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {activeStation} Requisition Center
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Authorization Level:{" "}
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                            {userRole}
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">

                    {userRole ===
                        ROLE_STATION_MANAGER && (
                        <div>
                            <OrderForm
                                role={
                                    userRole
                                }
                                onSubmit={
                                    handleCreateRequest
                                }
                            />
                        </div>
                    )}

                    <div
                        className={`${
                            userRole ===
                            ROLE_STATION_MANAGER
                                ? "lg:col-span-2"
                                : "lg:col-span-3"
                        } space-y-4`}
                    >
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl">
                            <div className="flex items-center gap-2 w-full sm:w-auto px-2">
                                <Search className="w-4 h-4 text-slate-500" />

                                <input
                                    type="text"
                                    value={
                                        searchQuery
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearchQuery(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search by requirement or shipment..."
                                    className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "active"
                                        )
                                    }
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold ${
                                        activeTab ===
                                        "active"
                                            ? "bg-white dark:bg-slate-800 text-cyan-600"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Active
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "history"
                                        )
                                    }
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold ${
                                        activeTab ===
                                        "history"
                                            ? "bg-white dark:bg-slate-800 text-cyan-600"
                                            : "text-slate-500"
                                    }`}
                                >
                                    History
                                </button>
                            </div>
                        </div>

                        {userRole ===
                            ROLE_STATION_MANAGER && (
                            <>
                                <StationMasterQueue
                                    requests={
                                        filteredRequests
                                    }
                                    shipments={
                                        filteredShipments
                                    }
                                    activeTab={
                                        activeTab
                                    }
                                    onUpdate={
                                        async (
                                            id,
                                            action
                                        ) => {
                                            if (
                                                action ===
                                                "RECEIVE_SHIPMENT"
                                            ) {
                                                await handleShipmentStatus(
                                                    id,
                                                    "RECEIVE_SHIPMENT"
                                                );
                                            } else {
                                                await handleRequirementStatus(
                                                    id,
                                                    action
                                                );
                                            }
                                        }
                                    }
                                />

                                <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-4">
                                    <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3">
                                        Station Shipments
                                    </h3>

                                    {filteredShipments.length ===
                                    0 ? (
                                        <p className="text-sm text-slate-500">
                                            No shipments found.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredShipments.map(
                                                (
                                                    shipment
                                                ) => (
                                                    <div
                                                        key={
                                                            shipment.shipmentNumber
                                                        }
                                                        className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 p-3"
                                                    >
                                                        <div>
                                                            <p className="font-mono font-bold text-sm">
                                                                {
                                                                    shipment.shipmentNumber
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    shipment.title
                                                                }
                                                            </p>
                                                        </div>

                                                        <span className="text-xs font-bold">
                                                            {
                                                                shipment.status
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {userRole ===
                            ROLE_NCPOR && (
                            <AuthorityQueue
                                pending={
                                    filteredRequests
                                }
                                history={
                                    requests.filter(
                                        (
                                            req
                                        ) =>
                                            isHistoryStatus(
                                                req.status
                                            )
                                    )
                                }
                                activeTab={
                                    activeTab
                                }
                            />
                        )}

                        {userRole ===
                            ROLE_LOGISTICS && (
                            <LogisticsQueue
                                requests={
                                    filteredRequests
                                }
                                shipments={
                                    filteredShipments
                                }
                                activeTab={
                                    activeTab
                                }
                                onRequirementUpdate={
                                    handleRequirementStatus
                                }
                                onCreateShipment={
                                    handleCreateShipment
                                }
                                onShipmentUpdate={
                                    handleShipmentStatus
                                }
                            />
                        )}

                        {activeTab ===
                            "active" &&
                            userRole !==
                                ROLE_LOGISTICS && (
                                <ActiveTransitBoard
                                    shipments={
                                        filteredShipments
                                    }
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}