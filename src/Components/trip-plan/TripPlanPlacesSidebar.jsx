import { useEffect, useState } from "react";
import useCountryStore from "../../stores/countryStore";
import useTripPlanStore from "../../stores/planStore";

const categoryConfig = {
    restaurants: { label: "Restaurants", color: "orange", bgColor: "bg-orange-50", activeBg: "bg-orange-600" },
    hotels: { label: "Hotels", color: "cyan", bgColor: "bg-cyan-50", activeBg: "bg-[#0f6d79]" },
    places: { label: "Places", color: "green", bgColor: "bg-green-50", activeBg: "bg-green-600" }
};

function TripPlanPlacesSidebar({ isLoading }) {
    const { queueAddPlace } = useTripPlanStore();
    const { countryDetails } = useCountryStore();
    const [places, setPlaces] = useState();
    const [activeCategory, setActiveCategory] = useState("restaurants");

    const currentItems = places?.[activeCategory] || [];
    const config = categoryConfig[activeCategory];

    useEffect(() => {
        const updatePlaces = () => {
            setPlaces({
                hotels: countryDetails?.hotels || [],
                places: countryDetails?.places || [],
                restaurants: countryDetails?.restaurants || [],
            })
        }
        console.log(countryDetails)
        updatePlaces();
    }, [countryDetails])
    return (
        <div className="bg-white rounded-[30px] shadow-lg px-4 py-6 h-full border border-gray-50 flex flex-col">
            <h2 className="text-3xl font-bold text-orange-600 mb-6">Add to Trip</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
                {Object.entries(categoryConfig).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === key
                            ? `${cfg.activeBg} text-white shadow-md`
                            : `${cfg.bgColor} text-${cfg.color}-600 hover:bg-${cfg.color}-100`
                            }`}
                    >
                        {cfg.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="text-xs text-gray-400 mb-3 font-medium">
                    {currentItems.length} {config.label.toLowerCase()} found
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                    {isLoading ? (
                        // 🔄 Loading Skeleton
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 animate-pulse">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>
                        ))
                    ) : currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div
                                key={item.id ?? index}
                                className="bg-[#f9fafb] rounded-3xl p-3 flex items-center gap-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition group"
                            >
                                <img
                                    loading="lazy"
                                    src={`/${item.image}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                                    {item.location && <p className="text-[10px] text-gray-500 truncate mb-2">📍 {item.location}</p>}
                                    <button
                                        onClick={() => queueAddPlace({...item, category: activeCategory.toLowerCase().slice(0, -1)})}
                                        className="text-orange-600 font-bold text-xs bg-white border border-orange-100 px-3 py-1.5 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition shadow-sm"
                                    >
                                        + Add to Trip
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p className="text-2xl mb-2">🔍</p>
                            <p className="text-sm">No {config.label.toLowerCase()} found</p>
                            <p className="text-xs mt-1">Try another category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripPlanPlacesSidebar;