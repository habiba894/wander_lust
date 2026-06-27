function TripPlanCountryMap({ location }) {
    return (
        <div className="bg-white rounded-[30px] shadow-lg overflow-hidden h-full border border-gray-50 min-h-100 flex flex-col">
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-2xl font-bold text-[#0f6d79] flex items-center gap-2">
                    Trip Map
                    {location && <span className="text-sm font-normal text-gray-500">• {location}</span>}
                </h2>
            </div>
            <div className="flex-1 w-full min-h-87.5">
                <iframe
                    title="Trip Map"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(location || "Paris")}&z=12&output=embed`}
                />
            </div>
        </div>
    );
}

export default TripPlanCountryMap