import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useTripPlanStore from "../../stores/planStore";
import RoutesList from "../../utils/routesList";

const CATEGORY_ICONS = { Hotel: "🏨", Restaurant: "🍽️", "Popular Place": "📍" };

const TripPlanSuggestion = ({ countryName }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { isConfirming, suggestedPlaces, confirmSuggestedPlaces } = useTripPlanStore();

    console.log(suggestedPlaces)
    const handleConfirmSuggestion = useCallback(async () => {
        if (!suggestedPlaces || !user?.id) {
            if (!user?.id) alert("You need to be logged in to create a trip plan.");
            return;
        }
        try {
            await confirmSuggestedPlaces(user.id, countryName);

            navigate(RoutesList.profile);
        } catch (error) {
            console.error(error);
        }
    }
        , [confirmSuggestedPlaces, countryName, navigate, suggestedPlaces, user.id]);

    const handleDiscardSuggestion = () => navigate(-1);

    return !suggestedPlaces ? (
        <p className="text-gray-400">Putting together your suggestion...</p>
    ) : (
        <>
            {console.log(suggestedPlaces)}
            <div className="space-y-10">
                {suggestedPlaces && Object.entries({
                    Hotel: suggestedPlaces?.hotels,
                    Restaurant: suggestedPlaces?.restaurants,
                    "Popular Place": suggestedPlaces?.PopularPlaces,
                }).map(([category, items]) =>
                    items.length > 0 ? (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                {CATEGORY_ICONS[category]} {category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-gray-50"
                                    >
                                        <img
                                            loading="lazy"
                                            src={`/${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-xl"
                                        />
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                                            {item.location && (
                                                <p className="text-xs text-gray-500 truncate">📍 {item.location}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null
                )}
            </div>

            <div className="flex gap-4 mt-10">
                <button
                    onClick={handleDiscardSuggestion}
                    disabled={isConfirming}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Discard
                </button>
                <button
                    disabled={isConfirming}
                    onClick={handleConfirmSuggestion}
                    className="flex-1 bg-[#0f6d79] text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
                >
                    {isConfirming ? "Saving..." : "Confirm Trip"}
                </button>
            </div>
        </>
    );
}

export default TripPlanSuggestion;
