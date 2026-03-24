/**
 * Tour guides + bookings in Firestore.
 * Collections: tourGuides (doc id = guide userId), guideBookings, guideReviews
 * Ensure Firestore rules allow authenticated reads/writes as appropriate for production.
 */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { guideDb as db } from "@/lib/firebase";

const GUIDES = "dyourguides";
const BOOKINGS = "guideBookings";
const REVIEWS = "guideReviews";

export const GUIDE_EXPERTISE_OPTIONS = [
  { id: "culture", label: "Culture" },
  { id: "adventure", label: "Adventure" },
  { id: "history", label: "History" },
  { id: "food", label: "Food" },
  { id: "nature", label: "Nature" },
  { id: "wildlife", label: "Wildlife" },
];

export const GUIDE_LANGUAGE_OPTIONS = [
  { id: "english", label: "English" },
  { id: "sinhala", label: "Sinhala" },
  { id: "tamil", label: "Tamil" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "russian", label: "Russian" },
  { id: "italian", label: "Italian" },
  { id: "spanish", label: "Spanish" },
];

function normalizeGuide(id, data) {
  if (!data) return null;
  return {
    id,
    userId: data.userId || id,
    email: data.email || "",
    displayName: data.displayName || "Guide",
    headline: data.headline || "",
    location: data.location || "",
    languages: Array.isArray(data.languages) ? data.languages : [],
    expertise: Array.isArray(data.expertise) ? data.expertise : [],
    experienceYears: Number(data.experienceYears) || 0,
    certifications: data.certifications || "",
    bio: data.bio || "",
    hourlyRate: Number(data.hourlyRate) || 0,
    availabilityNote: data.availabilityNote || "",
    photoURL: data.photoURL || "",
    galleryUrls: Array.isArray(data.galleryUrls) ? data.galleryUrls : [],
    videoUrls: Array.isArray(data.videoUrls) ? data.videoUrls : [],
    travelHighlights: Array.isArray(data.travelHighlights) ? data.travelHighlights : [],
    stories: Array.isArray(data.stories) ? data.stories : [],
    ratingAvg: typeof data.ratingAvg === "number" ? data.ratingAvg : 0,
    ratingCount: Number(data.ratingCount) || 0,
    status: data.status || "active",
    active: data.active !== false && (data.status || "active") === "active",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function listPublicGuides() {
  try {
    const snap = await getDocs(collection(db, GUIDES));
    const list = [];
    snap.forEach((d) => {
      const g = normalizeGuide(d.id, d.data());
      if (g && g.active) list.push(g);
    });
    list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return list;
  } catch (e) {
    console.warn("listPublicGuides:", e);
    return [];
  }
}

export async function getGuideProfile(guideUserId) {
  const ref = doc(db, GUIDES, guideUserId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return normalizeGuide(snap.id, snap.data());
}

export async function saveMyGuideProfile(user, payload) {
  if (!user?.uid) throw new Error("Sign in to create a guide profile.");
  const ref = doc(db, GUIDES, user.uid);
  const existing = await getDoc(ref);
  const prev = existing.exists() ? existing.data() : {};
  const stories = Array.isArray(payload.stories) ? payload.stories : prev.stories || [];
  const data = {
    userId: user.uid,
    email: user.email || "",
    displayName: payload.displayName || user.displayName || user.email?.split("@")[0] || "Guide",
    headline: payload.headline ?? prev.headline ?? "",
    location: payload.location ?? prev.location ?? "",
    languages: payload.languages ?? prev.languages ?? [],
    expertise: payload.expertise ?? prev.expertise ?? [],
    experienceYears: Number(payload.experienceYears) || 0,
    certifications: payload.certifications ?? prev.certifications ?? "",
    bio: payload.bio ?? prev.bio ?? "",
    hourlyRate: Number(payload.hourlyRate) || 0,
    availabilityNote: payload.availabilityNote ?? prev.availabilityNote ?? "",
    photoURL: payload.photoURL ?? prev.photoURL ?? user.photoURL ?? "",
    galleryUrls: payload.galleryUrls ?? prev.galleryUrls ?? [],
    videoUrls: payload.videoUrls ?? prev.videoUrls ?? [],
    travelHighlights: payload.travelHighlights ?? prev.travelHighlights ?? [],
    stories,
    ratingAvg: typeof prev.ratingAvg === "number" ? prev.ratingAvg : 0,
    ratingCount: Number(prev.ratingCount) || 0,
    active: payload.active !== undefined ? !!payload.active : prev.active !== false,
    updatedAt: serverTimestamp(),
  };
  if (!existing.exists()) {
    data.createdAt = serverTimestamp();
  }
  await setDoc(ref, data, { merge: true });
  return getGuideProfile(user.uid);
}

export async function createBookingRequest({ traveller, guideId, guideDisplayName, tourDate, tourTime, destination, partySize, message }) {
  if (!traveller?.uid) throw new Error("Sign in to request a booking.");
  if (!guideId) throw new Error("Missing guide.");
  if (guideId === traveller.uid) throw new Error("You cannot book yourself.");
  const docRef = await addDoc(collection(db, BOOKINGS), {
    travellerId: traveller.uid,
    travellerEmail: traveller.email || "",
    travellerName: traveller.displayName || traveller.email?.split("@")[0] || "Traveler",
    guideId,
    guideDisplayName: guideDisplayName || "Guide",
    status: "pending",
    tourDate: tourDate || "",
    tourTime: tourTime || "",
    destination: destination || "",
    partySize: Math.max(1, Number(partySize) || 1),
    message: message || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function listBookingsForGuide(guideId) {
  if (!guideId) return [];
  const snap = await getDocs(query(collection(db, BOOKINGS), where("guideId", "==", guideId)));
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return rows;
}

export async function listBookingsForTraveller(travellerId) {
  if (!travellerId) return [];
  const snap = await getDocs(query(collection(db, BOOKINGS), where("travellerId", "==", travellerId)));
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return rows;
}

export async function updateBookingStatus(bookingId, guideId, status) {
  if (!bookingId || !guideId) throw new Error("Invalid booking.");
  const ref = doc(db, BOOKINGS, bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Booking not found.");
  const data = snap.data();
  if (data.guideId !== guideId) throw new Error("Not authorized.");
  if (!["accepted", "rejected", "cancelled"].includes(status)) throw new Error("Invalid status.");
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

export async function listReviewsForGuide(guideId) {
  if (!guideId) return [];
  const snap = await getDocs(query(collection(db, REVIEWS), where("guideId", "==", guideId)));
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return rows;
}

export async function addGuideReview({ guideId, traveller, rating, text }) {
  if (!traveller?.uid || !guideId) throw new Error("Missing data.");
  const r = Math.min(5, Math.max(1, Number(rating) || 5));
  await addDoc(collection(db, REVIEWS), {
    guideId,
    travellerId: traveller.uid,
    travellerName: traveller.displayName || traveller.email?.split("@")[0] || "Traveler",
    travellerPhotoURL: traveller.photoURL || "",
    rating: r,
    text: text || "",
    createdAt: serverTimestamp(),
  });
  const guideRef = doc(db, GUIDES, guideId);
  const gSnap = await getDoc(guideRef);
  if (gSnap.exists()) {
    const g = gSnap.data();
    const count = Number(g.ratingCount) || 0;
    const avg = typeof g.ratingAvg === "number" ? g.ratingAvg : 0;
    const newCount = count + 1;
    const newAvg = (avg * count + r) / newCount;
    await updateDoc(guideRef, { ratingAvg: newAvg, ratingCount: newCount, updatedAt: serverTimestamp() });
  }
}
