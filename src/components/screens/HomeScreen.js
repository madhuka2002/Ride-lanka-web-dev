"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getRecommendations, refreshRecommendations, trackEvent } from "@/lib/api";

function AiPlaceCard({ place, token, showScreen }) {
  const fallbackImg = `https://source.unsplash.com/400x220/?${encodeURIComponent(place.name + " Sri Lanka")}`;

  function handleClick() {
    trackEvent(token, {
      place_name: place.name,
      category: place.category || "general",
      action: "view",
    });
    if (place.maps_url) {
      window.open(place.maps_url, "_blank", "noopener,noreferrer");
      return;
    }
    showScreen("screen-detail");
  }

  return (
    <div className="dest-card" role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
      <div className="card-img">
        <img src={place.photo_url || fallbackImg} alt={place.name} onError={(e) => { e.currentTarget.src = fallbackImg; }} />
        <span className="card-badge">{place.category || "general"}</span>
      </div>
      <div className="card-body">
        <h4>{place.name}</h4>
        <div className="card-location">{place.description}</div>
        <div className="card-footer">
          <span className="card-rating">{place.rating ? `Rating ${place.rating}` : ""}</span>
          <span className="card-price">Open map</span>
        </div>
      </div>
    </div>
  );
}

function AiRecommendationsSection({ token, showScreen }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRecommendations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getRecommendations(token);
      if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setPlaces(data.recommendations);
      } else {
        const fresh = await refreshRecommendations(token);
        setPlaces(fresh.recommendations || []);
      }
    } catch {
      setError("Could not load recommendations. Ensure backend and AI are running.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  async function handleRefresh() {
    if (!token || refreshing) return;
    setRefreshing(true);
    setError("");
    try {
      const fresh = await refreshRecommendations(token);
      setPlaces(fresh.recommendations || []);
    } catch {
      setError("Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) return <p style={{ color: "#666" }}>Loading recommendations...</p>;
  if (error) return <p style={{ color: "#c00" }}>{error}</p>;
  if (places.length === 0) return null;

  return (
    <>
      <div className="section-header">
        <h3>Recommended for you</h3>
        <span className="see-all" role="button" tabIndex={0} onClick={handleRefresh}>
          {refreshing ? "Refreshing..." : "Refresh with AI"}
        </span>
      </div>
      <div className="cards-grid cards-grid-3">
        {places.map((p, i) => (
          <AiPlaceCard key={`${p.name}-${i}`} place={p} token={token} showScreen={showScreen} />
        ))}
      </div>
    </>
  );
}

export default function HomeScreen({ active, showScreen }) {
  const [activeCategory, setActiveCategory] = useState("beach");
  const { token, user } = useAuth();
  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "traveler", [user]);

  const popular = [
    { title: "Cultural Triangle Explorer", location: "Sigiriya · Dambulla · Kandy", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80", badge: "7 days", rating: "4.8", trips: "2134", price: "LKR 95,000", category: "culture" },
    { title: "South Coast Highlights", location: "Colombo · Galle · Mirissa", img: "https://images.unsplash.com/photo-1526481280695-3c687fd543c0?w=400&q=80", badge: "5 days", rating: "4.7", trips: "1042", price: "LKR 72,000", category: "beach" },
    { title: "Hill Country and Safari", location: "Kandy · Ella · Yala", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80", badge: "10 days", rating: "4.9", trips: "864", price: "LKR 145,000", category: "wildlife" },
  ];

  function handlePopularClick(card) {
    if (token) {
      trackEvent(token, { place_name: card.title, category: card.category, action: "view" });
    }
    showScreen("screen-trips");
  }

  return (
    <div id="screen-home" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="home" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div>
              <h1>Plan your Sri Lanka trip</h1>
              <div className="subtitle">Good morning, {displayName}.</div>
            </div>
          </div>

          {token && <AiRecommendationsSection token={token} showScreen={showScreen} />}

          <div className="section-header"><h3>Trip style</h3></div>
          <div className="categories">
            {[
              { id: "beach", label: "Beach and Relax" },
              { id: "hill", label: "Hill Country" },
              { id: "cultural", label: "Cultural Triangle" },
              { id: "nature", label: "Nature and Wildlife" },
              { id: "food", label: "Food and Local Life" },
              { id: "family", label: "Family Friendly" },
            ].map((cat) => (
              <div key={cat.id} className={`cat-chip ${activeCategory === cat.id ? "active" : ""}`} onClick={() => setActiveCategory(cat.id)} role="button" tabIndex={0}>
                {cat.label}
              </div>
            ))}
          </div>

          <div className="section-header">
            <h3>Popular itineraries in Sri Lanka</h3>
          </div>
          <div className="cards-grid cards-grid-3">
            {popular.map((card) => (
              <div key={card.title} className="dest-card" role="button" tabIndex={0} onClick={() => handlePopularClick(card)}>
                <div className="card-img">
                  <img src={card.img} alt={card.title} />
                  <span className="card-badge">{card.badge}</span>
                </div>
                <div className="card-body">
                  <h4>{card.title}</h4>
                  <div className="card-location">{card.location}</div>
                  <div className="card-footer">
                    <span className="card-rating">{card.rating} ({card.trips} trips)</span>
                    <span className="card-price">{card.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
