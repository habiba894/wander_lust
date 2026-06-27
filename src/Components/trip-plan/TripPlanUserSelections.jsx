import { Trash2 } from "lucide-react";
import useTripPlanStore from "../../stores/planStore";

const CATEGORY_ICONS = { Hotel: "🏨", Restaurant: "🍽️", "Popular Place": "📍" };

function TripPlanUserSelections({places, category,  locked }) {
    
    return (
        <div className="animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-white text-white flex items-center justify-center font-bold shadow-lg text-2xl shrink-0">
                    {CATEGORY_ICONS[category] || "📌"}
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">{category[0].toUpperCase() + category.slice(1).toLowerCase()}</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ml-6 border-l-2 border-dashed border-gray-300 pl-10">
                {places.filter((p)=>p.tag ==="add" ||p.tag ==="added").map((place) => (
                    <PlaceCard
                        place={place}
                        locked={locked}
                        key={place.name.split(" ").join("-").toLowerCase()}
                    />
                ))}
            </div>
        </div>
    );
}


function PlaceCard({ place, locked }) {
    const { queueRemovePlace } = useTripPlanStore();


    return (
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition border border-gray-50 overflow-hidden" >
            <div className="relative">
                {console.log(place)}
                <img
                    loading="lazy"
                    alt={place.name}
                    className="w-full h-40 object-cover"
                    src={place.image}
                />

                {!locked && (
                    <Trash2 size={32} onClick={() => queueRemovePlace(place.name, place.category)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition"
                        aria-label="Remove from trip"
                        title="Remove from trip" />
                )}
            </div>

            <div className="p-4">
                <p className="text-lg font-bold text-gray-800">{place.name}</p>
            </div>
        </div>


    );
}

export default TripPlanUserSelections;