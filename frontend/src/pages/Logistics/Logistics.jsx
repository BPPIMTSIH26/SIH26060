import {
    useEffect,
    useState,
} from "react";

import {
    useOutletContext,
} from "react-router-dom";

import {
    logisticsAPI,
} from "../../services/api/logistics";

import Skeleton from "../../components/context/Skeleton";

import LogisticsKpiGrid from "./components/LogisticsKpiGrid";
import FuelDepletionChart from "./components/FuelDepletionChart";
import FleetReadiness from "./components/FleetReadiness";
import InventoryTable from "./components/InventoryTable";
import LogisticsForecast from "./components/LogisticsForecast";
import PersonnelRoster from "./components/PersonnelRoster";

export default function Logistics() {
    const {
        activeStation = "Maitri",
    } = useOutletContext() || {};

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchLogistics =
            async () => {
                setLoading(true);
                setError(null);

                try {
                    const res =
                        await logisticsAPI.getStationLogistics(
                            activeStation
                        );

                    if (mounted) {
                        setData(
                            res?.data ||
                                null
                        );
                    }
                } catch (err) {
                    if (mounted) {
                        setError(
                            err?.message ||
                                "Failed to fetch logistics data."
                        );
                    }
                } finally {
                    if (mounted) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        fetchLogistics();

        return () => {
            mounted = false;
        };
    }, [activeStation]);

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 dark:bg-slate-950 p-4 md:p-6">
                <div className="max-w-[1600px] mx-auto space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            1,
                            2,
                            3,
                            4,
                        ].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-28 rounded-2xl"
                            />
                        ))}
                    </div>

                    <Skeleton className="h-[320px] rounded-2xl" />
                    <Skeleton className="h-[320px] rounded-2xl" />
                    <Skeleton className="h-[260px] rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 text-red-500 font-semibold">
                Error loading logistics data:{" "}
                {error ||
                    "No data available"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
            <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Logistics & Supply Chain
                    </h1>

                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {activeStation} Station · Resource tracking, shipments and inventory
                    </p>
                </div>

                <LogisticsKpiGrid
                    logisticsJson={
                        data
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <FuelDepletionChart
                        logisticsJson={
                            data
                        }
                    />

                    <FleetReadiness
                        logisticsJson={
                            data
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <InventoryTable
                            logisticsJson={
                                data
                            }
                        />
                    </div>

                    <LogisticsForecast
                        logisticsJson={
                            data
                        }
                    />
                </div>

                <PersonnelRoster
                    logisticsJson={
                        data
                    }
                />
            </div>
        </div>
    );
}