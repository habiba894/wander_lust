import { useState } from "react";
import useTripPlanStore from "../../stores/planStore";

const TripPlanNotes = ({locked}) => {
    const { plan: tripPlan, removeNote, addNote, isSaving } = useTripPlanStore();
    const [newNote, setNewNote] = useState("");

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        console.error("❌ Cannot add note: no authenticated user.id available.");
        alert("You need to be logged in to add notes to a trip plan.");
        addNote(newNote);
        setNewNote("");
    };


    return (<div className="bg-white rounded-[30px] shadow-lg p-6 flex flex-col h-full border border-gray-50">
        <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-3xl font-bold text-gray-700">Trip Notes</h2>
            {isSaving && <span className="text-xs text-orange-500 font-medium">Saving...</span>}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar" style={{ maxHeight: "350px" }}>
            {(tripPlan.notes || []).map((note, index) => (
                <div key={index} className="bg-[#f7f4fa] rounded-2xl p-4 text-gray-600 flex justify-between items-start group">
                    <span className="leading-relaxed">✍️ {note}</span>
                    {!locked && (
                        <button
                            onClick={() => removeNote(index)}
                            className="text-gray-300 hover:text-orange-500 transition ml-2 opacity-0 group-hover:opacity-100"
                            aria-label="Remove note"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
            {(!tripPlan.notes || tripPlan.notes.length === 0) && (
                <div className="h-full flex items-center justify-center text-gray-400 italic text-center p-4">
                    No notes yet. Add your first note below! 📝
                </div>
            )}
        </div>

        {!locked && (
            <div className="mt-auto border-t pt-5">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                            e.preventDefault();
                            handleAddNote();
                        }
                    }}
                    placeholder="Write something important... (Ctrl+Enter to save)"
                    className="w-full bg-[#f7f4fa] rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-[#0f6d79] transition resize-none h-24 mb-3"
                />
                <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSaving}
                    className="w-full bg-[#0f6d79] text-white py-3 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving..." : "Save Note"}
                </button>
            </div>
        )}
    </div>)
}

export default TripPlanNotes
