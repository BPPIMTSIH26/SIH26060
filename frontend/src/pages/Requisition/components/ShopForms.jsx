import { useState } from "react";
import {
    Package,
    Send,
    Loader2,
    FileText,
    Hash,
} from "lucide-react";

const CATEGORY_OPTIONS = [
    {
        value: "Rations",
        label: "Rations",
    },
    {
        value: "Medical",
        label: "Medical",
    },
    {
        value: "Fuel",
        label: "Fuel",
    },
    {
        value: "Mechanical",
        label: "Mechanical",
    },
    {
        value: "Scientific",
        label: "Scientific",
    },
];

const PRIORITY_OPTIONS = [
    {
        value: "Low",
        label: "Low",
    },
    {
        value: "Medium",
        label: "Medium",
    },
    {
        value: "High",
        label: "High",
    },
];

export function OrderForm({
    role,
    onSubmit,
}) {
    const [formData, setFormData] = useState({
        item: "",
        qty: 1,
        priority: "Medium",
        category: "",
        notes: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "qty"
                    ? value
                    : value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const item =
            formData.item.trim();

        const qty = Number(
            formData.qty
        );

        const priority =
            formData.priority;

        const category =
            formData.category;

        const notes =
            formData.notes.trim();

        if (!item) {
            setError(
                "Item description is required."
            );
            return;
        }

        if (
            !Number.isFinite(qty) ||
            qty < 1
        ) {
            setError(
                "Quantity must be at least 1."
            );
            return;
        }

        if (!category) {
            setError(
                "Please select a category."
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            /*
             * IMPORTANT:
             * These names exactly match the
             * backend createRequirement controller:
             *
             * item
             * qty
             * priority
             * category
             * notes
             */
            await onSubmit({
                item,
                qty,
                priority,
                category,
                notes,
            });

            setFormData({
                item: "",
                qty: 1,
                priority: "Medium",
                category: "",
                notes: "",
            });
        } catch (submitError) {
            setError(
                submitError?.message ||
                    "Failed to submit requirement."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-400";

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-5 shadow-sm">
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
                        <Package className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            New Requirement
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Submit a station supply request
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* ITEM */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Item / Requirement
                    </label>

                    <div className="relative">
                        <Package className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            name="item"
                            value={
                                formData.item
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Diesel filters"
                            className={`${inputClass} pl-10`}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {/* QUANTITY */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Quantity
                    </label>

                    <div className="relative">
                        <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="number"
                            name="qty"
                            min="1"
                            step="1"
                            value={
                                formData.qty
                            }
                            onChange={
                                handleChange
                            }
                            className={`${inputClass} pl-10`}
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {/* PRIORITY */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={
                            formData.priority
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                        disabled={loading}
                    >
                        {PRIORITY_OPTIONS.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* CATEGORY */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Category
                    </label>

                    <select
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={
                            handleChange
                        }
                        className={inputClass}
                        disabled={loading}
                        required
                    >
                        <option value="">
                            Select category
                        </option>

                        {CATEGORY_OPTIONS.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* NOTES */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Notes
                    </label>

                    <div className="relative">
                        <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />

                        <textarea
                            name="notes"
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Additional details or specifications..."
                            rows={4}
                            className={`${inputClass} resize-none pl-10`}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-2.5">
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Requirement
                            <Send className="h-4 w-4" />
                        </>
                    )}
                </button>

                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                    Access Level:{" "}
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {role ||
                            "Station Manager"}
                    </span>
                </p>
            </form>
        </div>
    );
}

export default OrderForm;