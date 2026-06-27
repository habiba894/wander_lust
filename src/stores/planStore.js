// import { create } from "zustand";
// import { plansService } from "../services/api";

// const CATEGORY_MAP = {
//   restaurants: "Restaurant",
//   hotels: "Hotel",
//   PopularPlaces: "Popular Place",
// };

// const normalizePlace = (place) => ({
//   id: place.id,
//   placeId: place.placeId || place.id,
//   name: place.placeName || place.name || "Untitled place",
//   category: place.category || "Place",
//   image: place.image || "",
//   location: place.location || "",
//   details: place.details || "",
//   note: place.note || "",
//   createdAt: place.createdAt || null,
// });

// const emptyPlan = () => ({
//   id: null,
//   destination: "",
//   planName: "",
//   startDate: "",
//   endDate: "",
//   note: "",
//   places: [],
// });

// const useTripPlanStore = create((set, get) => ({
//   // ---- Plan data ----
//   plan: emptyPlan(),

//   // ---- UI/async state ----
//   isLoading: false,
//   isSaving: false,
//   error: null,

//   loadPlanById: async (planId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const data = await plansService.getPlanById(planId);
//       const plan = data?.data || data;

//       set({
//         plan: {
//           id: plan.id,
//           destination: (plan.destination || "").toLowerCase().trim(),
//           planName: plan.planName || "",
//           startDate: plan.startDate || "",
//           endDate: plan.endDate || "",
//           note: plan.note || "",
//           places: (plan.places || []).map(normalizePlace),
//         },
//         isLoading: false,
//       });

//       return plan;
//     } catch (err) {
//       console.error("❌ Failed to load plan:", err);
//       set({ error: "Failed to load plan", isLoading: false });
//       return null;
//     }
//   },

//   // Sets up a brand-new, not-yet-created plan for a country
//   // (creation mode: /country/:countryName/trip-plan). Nothing is
//   // sent to the backend until the user actually adds a place or note.
//   initDraftPlan: (countryName) => {
//     set({
//       plan: {
//         ...emptyPlan(),
//         destination: (countryName || "").toLowerCase().trim(),
//         planName: countryName ? `Trip to ${countryName}` : "",
//       },
//       isLoading: false,
//       error: null,
//     });
//   },

//   reset: () =>
//     set({ plan: emptyPlan(), isLoading: false, isSaving: false, error: null }),

//   // ======================================================
//   // PLAN-LEVEL ACTIONS (create / update / delete)
//   // ======================================================

//   // Creates the plan on the backend the first time it's needed
//   // (first place added or first note saved while id is still null).
//   ensurePlanExists: async (defaults = {}) => {
//     const { plan } = get();
//     if (plan.id) return plan.id;

//     set({ isSaving: true });
//     try {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       const endDate = new Date(tomorrow);
//       endDate.setDate(endDate.getDate() + 3);

//       const payload = {
//         userId: defaults.userId,
//         destination: plan.destination,
//         planName: plan.planName || `Trip to ${plan.destination}`,
//         startDate:
//           plan.startDate ||
//           defaults.startDate ||
//           tomorrow.toISOString().slice(0, 10),
//         endDate:
//           plan.endDate ||
//           defaults.endDate ||
//           endDate.toISOString().slice(0, 10),
//         note: plan.note || "",
//       };

//       const data = await plansService.createPlan(payload);
//       const created = data?.data || data;
//       const newId = created?.id;

//       set((state) => ({
//         plan: { ...state.plan, id: newId },
//         isSaving: false,
//       }));

//       return newId;
//     } catch (err) {
//       console.error("❌ Failed to create plan:", err);
//       set({ isSaving: false, error: "Failed to create plan" });
//       throw err;
//     }
//   },

//   // Updates plan-level fields (title, dates, note) both locally and on the backend.
//   updatePlanDetails: async (updates) => {
//     const { plan } = get();
//     const previous = { ...plan };

//     set((state) => ({ plan: { ...state.plan, ...updates } }));

//     if (!plan.id) return; // not created yet, nothing to sync

//     set({ isSaving: true });
//     try {
//       await plansService.updatePlan(plan.id, updates);
//       set({ isSaving: false });
//     } catch (err) {
//       console.error("❌ Failed to update plan:", err);
//       set({ plan: previous, isSaving: false, error: "Failed to save changes" });
//     }
//   },

//   // Deletes the whole plan. Returns true on success so the page can navigate away.
//   deletePlan: async () => {
//     const { plan } = get();
//     if (!plan.id) return true;

//     set({ isSaving: true });
//     try {
//       await plansService.deletePlan(plan.id);
//       set({ isSaving: false });
//       get().reset();
//       return true;
//     } catch (err) {
//       console.error("❌ Failed to delete plan:", err);
//       set({ isSaving: false, error: "Failed to delete plan" });
//       return false;
//     }
//   },

//   // ======================================================
//   // PLACE ACTIONS
//   // ======================================================

//   // item: raw suggestion object from the sidebar (hotel/restaurant/place catalog entry)
//   // sourceCategory: "restaurants" | "hotels" | "PopularPlaces"
//   addPlace: async (item, sourceCategory, options = {}) => {
//     const category = CATEGORY_MAP[sourceCategory] || "Place";
//     const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

//     const optimisticPlace = normalizePlace({
//       id: tempId,
//       placeName: item.name,
//       category,
//       image: item.image || item.photo || "",
//       location: item.location || "",
//       details: item.details || "",
//     });

//     set((state) => ({
//       plan: { ...state.plan, places: [...state.plan.places, optimisticPlace] },
//     }));

//     try {
//       const planId = await get().ensurePlanExists(options);

//       const data = await plansService.addPlaceToPlan(planId, {
//         placeName: item.name,
//         category,
//       });
//       const created = data?.data || data;
//       const realId = created?.id;

//       if (realId) {
//         set((state) => ({
//           plan: {
//             ...state.plan,
//             places: state.plan.places.map((p) =>
//               p.id === tempId ? { ...p, id: realId } : p,
//             ),
//           },
//         }));
//       }

//       return true;
//     } catch (err) {
//       console.error("❌ Failed to add place to plan:", err);
//       // 🔙 Rollback
//       set((state) => ({
//         plan: {
//           ...state.plan,
//           places: state.plan.places.filter((p) => p.id !== tempId),
//         },
//       }));
//       return false;
//     }
//   },

//   removePlace: async (placeId) => {
//     const { plan } = get();
//     const previousPlaces = plan.places;

//     set((state) => ({
//       plan: {
//         ...state.plan,
//         places: state.plan.places.filter((p) => p.id !== placeId),
//       },
//     }));

//     if (!plan.id || String(placeId).startsWith("temp_")) return true;

//     try {
//       await plansService.removePlaceFromPlan(plan.id, placeId);
//       return true;
//     } catch (err) {
//       console.error("❌ Failed to remove place:", err);
//       // 🔙 Rollback
//       set((state) => ({ plan: { ...state.plan, places: previousPlaces } }));
//       return false;
//     }
//   },

//   updatePlaceNote: async (placeId, note) => {
//     const { plan } = get();
//     const previousPlaces = plan.places;

//     set((state) => ({
//       plan: {
//         ...state.plan,
//         places: state.plan.places.map((p) =>
//           p.id === placeId ? { ...p, note } : p,
//         ),
//       },
//     }));

//     if (!plan.id || String(placeId).startsWith("temp_")) return;

//     try {
//       // NOTE: backend currently has no dedicated endpoint for patching a
//       // single place's note. Until that exists, this call is a no-op
//       // placeholder kept optimistic-only so the UI still feels responsive.
//       // Swap this for a real PATCH /plans/{planId}/places/{placeId} call
//       // once the backend supports it.
//     } catch (err) {
//       console.error("❌ Failed to update place note:", err);
//       set({ plan: { ...plan, places: previousPlaces } });
//     }
//   },

//   // ======================================================
//   // NOTES (plan-level free-text notes list)
//   // ======================================================

//   addNote: async (noteText, options = {}) => {
//     const trimmed = (noteText || "").trim();
//     if (!trimmed) return;

//     const { plan } = get();

//     set((state) => ({ plan: { ...state.plan, note: trimmed } }));

//     try {
//       await get().ensurePlanExists(options);
//     } catch (err) {
//       console.error("❌ Failed to save note:", err);
//       set((state) => ({
//         plan: {
//           ...state.plan,
//           notes: (state.plan.notes || []).filter((n) => n !== trimmed),
//         },
//       }));
//     }
//   },

//   removeNote: async (index) => {
//     const { plan } = get();
//     const note = plan.note.split("\n") || [];

//     set((state) => ({
//       plan: {
//         ...state.plan,
//         note: note.filter((_, i) => i !== index).join("\n"),
//       },
//     }));

//     // if (!plan.id) return;

//     try {
//       // await plansService.updatePlan(plan.id, { notes: newNotes });
//     } catch (err) {
//       console.error("❌ Failed to remove note:", err);
//       set((state) => ({ plan: { ...state.plan, note: note.join("\n") } }));
//     }
//   },
// }));

// export default useTripPlanStore;

import { create } from "zustand";
import { hotelsList } from "../data/hotels_data";
import { placesList } from "../data/places_data";
import { restaurantsList } from "../data/restaurants_data";
import { plansService } from "../services/api";

const NOTE_SEPARATOR = "/-#-/";

const CATEGORY_MAP = {
  hotels: "Hotel",
  restaurants: "Restaurant",
  PopularPlaces: "Popular Place",
};

const toISODate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getMinStartDate = () => toISODate(addDays(new Date(), 2));

export const getMaxEndDate = (startDate) => {
  if (!startDate) return null;
  return toISODate(addDays(new Date(startDate), 3));
};

// Clamps/validates a {startDate, endDate} pair against the rules above.
// Returns { startDate, endDate, errors[] } — callers decide whether to
// block the change or just surface the errors.
export const validateDateRange = (startDate, endDate) => {
  const errors = [];
  const minStart = getMinStartDate();

  if (!startDate) {
    errors.push("Start date is required.");
    return { startDate, endDate, errors };
  }

  if (startDate < minStart) {
    errors.push("Start date must be at least 2 days from today.");
  }

  if (endDate) {
    const maxEnd = getMaxEndDate(startDate);
    if (endDate < startDate) {
      errors.push("End date can't be before the start date.");
    } else if (endDate > maxEnd) {
      errors.push("End date can be at most 3 days after the start date.");
    }
  }

  return { startDate, endDate, errors };
};

export const isPlanLocked = (startDate) => {
  if (!startDate) return false;
  const today = toISODate(new Date());
  return today >= startDate.slice(0, 10);
};

const notesToApiString = (notes) => (notes || []).join(NOTE_SEPARATOR);

const apiStringToNotes = (noteString) =>
  (noteString || "")
    .split(NOTE_SEPARATOR)
    .map((n) => n.trim())
    .filter(Boolean);

const normalizePlace = (place) => ({
  id: place.id,
  name: place.placeName,
  category: place.category.includes("Place")
    ? "place"
    : place.category.toLowerCase(),
  image: getPlaceImage(
    place.category.includes("Place") ? "place" : place.category.toLowerCase(),
    place.placeName,
  ),
});

const emptyPlan = () => ({
  id: null,
  notes: [],
  places: [],
  endDate: "",
  name: "",
  startDate: "",
  destination: "",
});

const useTripPlanStore = create((set, get) => ({
  error: null,
  isSaving: false,
  isLoading: false,
  isConfirming: false,
  plan: emptyPlan(),
  suggestedPlaces: null,

  loadPlanById: async (planId) => {
    set({ isLoading: true, error: null, pendingChanges: [] });
    try {
      const res = await plansService.getPlanById(planId);
      console.log(res);
      set({
        plan: {
          id: res.id,
          endDate: res.endDate || "",
          name: res.planName || "",
          startDate: res.startDate || "",
          notes: apiStringToNotes(res.note),
          places: (res.places || []).map(normalizePlace),
          destination: (res.destination || "").toLowerCase().trim(),
        },
        isLoading: false,
      });
    } catch (err) {
      console.error("❌ Failed to load plan:", err);
      set({ error: "Failed to load plan", isLoading: false });
      return null;
    }
  },

  initDraftPlan: (countryName) => {
    const start = new Date(Date.now() + 2 * 86400000)
      .toISOString()
      .split("T")[0];
    const end = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
    set({
      plan: {
        ...emptyPlan(),
        endDate: end,
        startDate: start,
        destination: (countryName || "").toLowerCase().trim(),
        name: countryName
          ? `Trip to ${countryName[0].toUpperCase()}${countryName.slice(1)}`
          : "",
      },
      error: null,
      isLoading: false,
      pendingChanges: [],
    });
  },

  reset: () =>
    set({
      plan: emptyPlan(),
      error: null,
      isSaving: false,
      isLoading: false,
      pendingChanges: [],
      suggestedPlaces: {},
    }),

  updatePlanDetails: async (updates) => {
    const { plan } = get();

    if (isPlanLocked(plan.startDate)) {
      console.warn("⚠️ Plan is locked (already started) — ignoring update.");
      return {
        ok: false,
        errors: ["This trip has already started and can no longer be edited."],
      };
    }

    const nextStartDate = updates.startDate ?? plan.startDate;
    const nextEndDate = updates.endDate ?? plan.endDate;

    if (updates.startDate !== undefined || updates.endDate !== undefined) {
      const { errors } = validateDateRange(nextStartDate, nextEndDate);
      if (errors.length > 0) {
        return { ok: false, errors };
      }
    }

    const previous = { ...plan };
    set((state) => ({ plan: { ...state.plan, ...updates } }));

    if (!plan.id) return { ok: true }; // not created yet, nothing to sync

    set({ isSaving: true });
    try {
      await plansService.updatePlan(plan.id, updates);
      set({ isSaving: false });
      return { ok: true };
    } catch (err) {
      console.error("❌ Failed to update plan:", err);
      set({ plan: previous, isSaving: false, error: "Failed to save changes" });
      return {
        ok: false,
        errors: ["Failed to save changes. Please try again."],
      };
    }
  },

  // Deletes the whole plan. Returns true on success so the page can navigate away.
  deletePlan: async (planId) => {
    const id = planId || get().plan.id;
    if (!id) return true;

    set({ isSaving: true });
    try {
      await plansService.deletePlan(id);
      set({ isSaving: false });
      get().reset();
      return true;
    } catch (err) {
      console.error("❌ Failed to delete plan:", err);
      set({ isSaving: false, error: "Failed to delete plan" });
      return false;
    }
  },
  // ======================================================
  setSuggestedPlaces: (suggestions) => {
    set({ suggestedPlaces: suggestions });
  },
  confirmSuggestedPlaces: async (userId, countryName) => {
    const { suggestedPlaces } = get();
    set({ isSaving: true, isConfirming: true });
    const places = Object.entries(suggestedPlaces).flatMap(
      ([category, items]) =>
        items.map(({ name }) => ({
          name,
          category:
            category === "hotels"
              ? "hotel"
              : category === "restaurants"
                ? "restaurant"
                : "place",
        })),
    );

    get().initDraftPlan(countryName);
    const { plan } = get();
    const planId =
      plan?.id ??
      (
        await plansService.createPlan({
          userId,
          planName: plan.name,
          endDate: plan.endDate,
          startDate: plan.startDate,
          destination: plan.destination,
          note: notesToApiString(plan.notes),
        })
      ).id;
    set({ plan: { ...plan, id: planId } });
    console.log(planId);

    for (const place of places) {
      const res = await plansService.addPlaceToPlan(planId, {
        placeName: place.name,
        category: place.category,
      });
      console.log(res);

      set((state) => ({
        plan: {
          ...state.plan,
          places: state.plan.places.map((p) =>
            p.name === place.name && p.category === place.category
              ? { ...p, id: res.id }
              : p,
          ),
        },
      }));
    }

    set({ isSaving: false, isConfirming: false });
  },
  // ======================================================
  // PLACE ACTIONS — CREATE MODE (immediate API sync)
  // ======================================================
  queueAddPlace: (item) => {
    const { plan } = get();
    if (isPlanLocked(plan.startDate)) return;

    set((state) => ({
      plan: {
        ...state.plan,
        places: [
          ...state.plan.places,
          {
            tag: "add",
            name: item.name,
            image: `/${item.image}`,
            category: item.category,
          },
        ],
      },
    }));
  },

  queueRemovePlace: (name, category) => {
    console.log(name, category);
    const { plan } = get();
    if (isPlanLocked(plan.startDate)) return;
    set((state) => ({
      plan: {
        ...state.plan,
        places: state.plan.places.filter(
          (p) => p.name !== name || p.category !== category,
        ),
      },
    }));
  },

  // Discards every queued change and restores the plan to its last
  // loaded-from-server state.
  discardPendingChanges: async () => {
    set({ isConfirming: true });
    const planId = get().plan.id;
    if (planId) {
      await get().loadPlanById(planId);
    } else {
      set({ pendingChanges: [], plan: emptyPlan() });
    }
    set({ isConfirming: false });
  },

  // Applies all queued add/delete changes against the backend in order,
  // then reconciles temp ids with the real ones returned by the API.
  confirmPendingChanges: async (userId) => {
    const { plan } = get();
    set({ isSaving: true, isConfirming: true });

    try {
      const planId =
        plan?.id ??
        (
          await plansService.createPlan({
            userId,
            planName: plan.name,
            endDate: plan.endDate,
            startDate: plan.startDate,
            destination: plan.destination,
            note: notesToApiString(plan.notes),
          })
        ).id;
      set({ plan: { ...plan, id: planId } });
      console.log(planId);

      for (const change of plan.places) {
        if (change.tag === "add") {
          const res = await plansService.addPlaceToPlan(planId, {
            placeName: change.name,
            category: change.category,
          });
          console.log(res);

          set((state) => ({
            plan: {
              ...state.plan,
              places: state.plan.places.map((p) =>
                p.name === change.name && p.category === change.category
                  ? { ...p, id: res.id }
                  : p,
              ),
            },
          }));
        } else if (change.tag === "remove") {
          await plansService.removePlaceFromPlan(planId, change.id);
        }
      }
      // if (realId) {
      //   set((state) => ({
      //     plan: {
      //       ...state.plan,
      //       places: state.plan.places.map((p) =>
      //         p.id === change.id ? { ...p, id: realId } : p
      //       ),
      //     },
      //   }));
      // }

      // set({ pendingChanges: [], isSaving: false });
      return true;
    } catch (err) {
      console.error("❌ Failed to apply pending changes:", err);
      set({ isSaving: false, error: "Failed to save changes" });
      // Reload from server to guarantee UI matches reality after a
      // partial failure, rather than leaving a half-applied local state.
      // await get().loadPlanById(plan.id);
      return false;
    } finally {
      set({ isConfirming: false });
    }
  },

  addNote: async (noteText) => {
    const { plan } = get();
    if (isPlanLocked(plan.startDate)) return;

    const trimmed = (noteText || "").trim();
    if (!trimmed) return;

    const newNotes = [...(plan.notes || []), trimmed];
    set((state) => ({ plan: { ...state.plan, notes: newNotes } }));
  },

  removeNote: async (index) => {
    const { plan } = get();
    if (isPlanLocked(plan.startDate) || plan.notes.length) return;

    const newNotes = plan.notes.filter((_, i) => i !== index);

    set((state) => ({ plan: { ...state.plan, notes: newNotes } }));
  },
}));

export default useTripPlanStore;

const getPlaceImage = (category, name) => {
  let obj;
  console.log(category, name);
  switch (category) {
    case "hotel":
      obj = hotelsList.find((h) => h.name.toLowerCase() === name.toLowerCase());
      break;
    case "place":
      obj = placesList.find((p) => p.name.toLowerCase() === name.toLowerCase());
      break;
    case "restaurant":
      console.log(name);
      console.log(category);
      obj = restaurantsList.find(
        (r) => r.name.toLowerCase() === name.toLowerCase(),
      );
      break;
    default:
      break;
  }
  console.log(obj);
  return obj?.image
    ? `/${obj.image}`
    : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80";
};
