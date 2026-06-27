import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useTripPlanStore from "../../stores/planStore";
import RoutesList from "../../utils/routesList";

function TripPlanActionBar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const { confirmPendingChanges, discardPendingChanges, plan, isConfirming } = useTripPlanStore();
    const pendingChanges = useMemo(() => plan.places.filter((place) => place.tag === "add" || place.tag === "remove"), [plan]);

    if (collapsed) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setCollapsed(false)}
                    className="flex items-center gap-2 rounded-full bg-white border border-gray-200 shadow-xl px-4 py-3 hover:shadow-2xl transition"
                >
                    <span className="text-sm font-semibold text-gray-700">
                        {pendingChanges.length} unsaved change
                        {pendingChanges.length > 1 ? "s" : ""}
                    </span>
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-2xl px-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800">
                        {pendingChanges.length} unsaved change
                        {pendingChanges.length > 1 ? "s" : ""}
                    </h4>

                    <button
                        onClick={() => setCollapsed(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="Collapse"
                        title="Collapse"
                    >
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Changes */}
                <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto">
                    {console.log(pendingChanges)}
                    {pendingChanges.map((change) => (
                        <span
                            key={change.id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${change.tag === "add"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                                }`}
                        >
                            {change.type === "add" ? "+ " : "− "}
                            {change.name}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={discardPendingChanges}
                        disabled={isConfirming}
                        className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        Discard
                    </button>

                    <button
                        onClick={async () => { await confirmPendingChanges(user.id); navigate(RoutesList.Profile); }}
                        disabled={isConfirming}
                        className="flex-1 bg-[#0f6d79] text-white py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
                    >
                        {isConfirming ? "Saving..." : "Confirm Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TripPlanActionBar;