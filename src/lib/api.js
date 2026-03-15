const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Get the Firebase ID token from the current user (passed in from AuthContext).
 * All API calls attach it as a Bearer token.
 */
async function authHeaders(token) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// ─── Profile ───────────────────────────────────────────────────────────────

export async function saveUserProfile(token, { name, interests }) {
    const res = await fetch(`${BACKEND}/api/users/profile`, {
        method: "POST",
        headers: await authHeaders(token),
        body: JSON.stringify({ name, interests }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// ─── Recommendations ───────────────────────────────────────────────────────

export async function getRecommendations(token) {
    const res = await fetch(`${BACKEND}/api/users/recommendations`, {
        headers: await authHeaders(token),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { recommendations: [], updatedAt: string }
}

export async function refreshRecommendations(token) {
    const res = await fetch(`${BACKEND}/api/users/recommendations/refresh`, {
        method: "POST",
        headers: await authHeaders(token),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// ─── Event tracking ────────────────────────────────────────────────────────

export async function trackEvent(token, { place_name, category, action }) {
    // Fire-and-forget — don't block the UI
    fetch(`${BACKEND}/api/events`, {
        method: "POST",
        headers: await authHeaders(token),
        body: JSON.stringify({ place_name, category, action }),
    }).catch((e) => console.warn("[trackEvent]", e));
}