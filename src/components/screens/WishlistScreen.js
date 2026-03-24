"use client";

import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistScreen({ active, showScreen }) {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div id="screen-wishlist" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="wishlist" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div>
              <h1 style={{ fontSize: "2rem", color: "var(--teal-dark)" }}>❤️ My Wishlist</h1>
              <div className="subtitle">{wishlist.length} places saved</div>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "80px", color: "var(--gray-400)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🤍</div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Your wishlist is empty</h3>
              <p>Press the heart button on any destination in Home or Explore to save it here.</p>
            </div>
          ) : (
            <div className="cards-grid cards-grid-3" style={{ marginTop: "24px" }}>
              {wishlist.map((place) => (
                <div key={place.name || place.title} className="dest-card" style={{ position: "relative" }}>
                  <div className="card-img">
                    <img
                      src={place.image || place.img}
                      alt={place.name || place.title}
                      onError={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.display = "none"; }}
                    />
                    <span className="card-badge">{place.category || place.badge || "Destination"}</span>
                    <button
                      className="wishlist-btn wishlisted"
                      onClick={() => removeFromWishlist(place.name || place.title)}
                      title="Remove from Wishlist"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="card-body">
                    <h4>{place.name || place.title}</h4>
                    <div className="card-location">{place.description || place.snippet || place.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
