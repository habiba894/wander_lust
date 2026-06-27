import iconlogo from "../../assets/logo.png";

const TripPlanEmptyState = ({ countryName }) => {
    return (
        <div className="bg-white rounded-[35px] shadow-lg p-12 text-center min-h-125 flex flex-col items-center justify-center border border-gray-100">
            <div className="w-48 h-40 rounded-full flex items-center justify-center mb-8">
                <img loading="lazy" src={iconlogo} alt="Plane Icon" className="w-60 h-40 object-contain" />
            </div>
            <h2 className="text-5xl font-bold text-gray-700 mb-6">Start Planning Your Trip</h2>
            <p className="text-gray-500 text-xl max-w-2xl leading-relaxed mb-10">
                Your trip plan{countryName ? ` to ${countryName}` : ""} is currently empty.
                Start adding hotels, restaurants, and popular places from the sidebar to build your personalized travel experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                    🍽️ Restaurants
                </div>
                <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                    🏨 Hotels
                </div>
                <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                    🗺️ Popular Places
                </div>
            </div>
        </div>
    );
}

export default TripPlanEmptyState;