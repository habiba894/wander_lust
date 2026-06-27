import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import plan from "../../assets/plan.jpg";
import useTripPlanStore, { getMaxEndDate, getMinStartDate } from "../../stores/planStore";
import RoutesList from "../../utils/routesList";

function TripPlanBanner({
    countryName,
    planName,
    startDate,
    endDate,
    isEditMode,
    locked,
    onStartEdit,
    isSaving,
}) {
    const navigate = useNavigate();
    const [dateErrors, setDateErrors] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const { plan: tripPlan, updatePlanDetails, deletePlan } = useTripPlanStore();

    const [detailsDraft, setDetailsDraft] = useState({
        planName: tripPlan.planName || "",
        startDate: tripPlan.startDate ? tripPlan.startDate.slice(0, 10) : "",
        endDate: tripPlan.endDate ? tripPlan.endDate.slice(0, 10) : "",
    });

    const formattedRange = startDate
        ? `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${endDate ? ` - ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""
        }`
        : null;

    const minStartDate = useMemo(() => getMinStartDate(), []);
    const maxEndDate = useMemo(
        () => (detailsDraft.startDate ? getMaxEndDate(detailsDraft.startDate) : null),
        [detailsDraft.startDate]
    );

    const handleCancelEdit = () => {
        setIsEditingDetails(false);
        setDateErrors([]);
    }

    const handleSaveDetails = async () => {
        setDateErrors([]);
        const result = await updatePlanDetails({
            planName: detailsDraft.planName,
            startDate: detailsDraft.startDate,
            endDate: detailsDraft.endDate,
        });
        if (!result.ok) {
            setDateErrors(result.errors || []);
            return;
        }
        setIsEditingDetails(false);
    };

    const handleDeletePlan = async () => {
        if (!tripPlan.id) return;
        if (!window.confirm("Delete this trip plan? This can't be undone.")) return;

        setIsDeleting(true);
        const success = await deletePlan(tripPlan.id);
        setIsDeleting(false);

        if (success) {
            navigate(RoutesList.Profile);
        }
    };


    return (
        <div className="relative rounded-[35px] overflow-hidden shadow-2xl h-105 w-full">
            <img loading="lazy" src={plan} alt="Travel Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0f6d79]/80 via-black/40 to-orange-500/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-10 z-10 text-white">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span className="bg-orange-500/60 px-5 py-2 rounded-full text-sm font-semibold tracking-wide inline-block">
                            Smart Travel Planner
                        </span>
                        {isEditMode && !locked && (
                            <>
                                <button
                                    onClick={onStartEdit}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold transition"
                                >
                                    ✏️ Edit Details
                                </button>
                                <button
                                    onClick={handleDeletePlan}
                                    disabled={isDeleting}
                                    className="bg-red-500/70 hover:bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "🗑️ Delete Plan"}
                                </button>
                            </>
                        )}
                    </div>

                    {isEditingDetails ? (
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 space-y-3">
                            <input
                                value={detailsDraft.planName}
                                onChange={(e) => setDetailsDraft((d) => ({ ...d, planName: e.target.value }))}
                                placeholder="Plan name"
                                className="w-full bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none font-semibold"
                            />
                            <div className="flex gap-3">
                                <input
                                    type="date"
                                    value={detailsDraft.startDate}
                                    min={minStartDate}
                                    onChange={(e) => setDetailsDraft((d) => ({ ...d, startDate: e.target.value, endDate: "" }))}
                                    className="flex-1 bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none"
                                />
                                <input
                                    type="date"
                                    value={detailsDraft.endDate}
                                    min={detailsDraft.startDate || minStartDate}
                                    max={maxEndDate || undefined}
                                    disabled={!detailsDraft.startDate}
                                    onChange={(e) => setDetailsDraft((d) => ({ ...d, endDate: e.target.value }))}
                                    className="flex-1 bg-white/90 text-gray-800 rounded-xl px-4 py-2 outline-none disabled:opacity-50"
                                />
                            </div>
                            {dateErrors.length > 0 && (
                                <ul className="text-red-200 text-xs space-y-1 pl-1">
                                    {dateErrors.map((err, i) => (
                                        <li key={i}>⚠️ {err}</li>
                                    ))}
                                </ul>
                            )}
                            <p className="text-white/60 text-xs">
                                Start date must be at least 2 days from today. Trip can last up to 3 days.
                            </p>
                            <div className="flex gap-2 justify-end">
                                <button onClick={handleCancelEdit} className="text-white/80 hover:text-white text-sm font-semibold px-3 py-1.5">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveDetails}
                                    disabled={isSaving}
                                    className="bg-white text-[#0f6d79] px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-3">
                                {planName || "Build Your Dream Trip"}
                                {countryName && (
                                    <span className="block text-3xl md:text-4xl mt-2 font-normal opacity-90">to {countryName}</span>
                                )}
                            </h1>
                            {formattedRange && (
                                <p className="text-white/80 text-lg font-medium mb-3">🗓️ {formattedRange}</p>
                            )}
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                Add hotels, restaurants, popular places, and activities to create your personalized travel experience.
                            </p>
                        </>
                    )}
                </div>
                <div className="flex flex-wrap gap-4 mt-8">
                    <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                        Hotels
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                        Restaurants
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                        Popular Places
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripPlanBanner;