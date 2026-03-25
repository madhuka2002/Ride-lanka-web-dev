"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";

export default function DiscoveryHubScreen({ active, showScreen }) {
  const { user } = useAuth();
  const { t } = useSettings();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autoCompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ["place_id", "geometry", "name", "formatted_address", "photos", "rating", "types", "user_ratings_total"],
        componentRestrictions: { country: "lk" }, // Optional: Restrict to Sri Lanka if desired
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          handleSelectPlace(place);
        }
      });
      autoCompleteRef.current = autocomplete;
    }
  }, [active]);

  const handleSelectPlace = (place) => {
    const formattedPlace = {
      id: place.place_id,
      title: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      image: place.photos?.[0]?.getUrl({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1544487661-04e8d38cb71f?w=800&q=80",
      types: place.types,
    };
    setSelectedPlace(formattedPlace);
    setResults([formattedPlace]); // Show the selected one as main result
  };

  const handleToggleWishlist = (place) => {
    if (isWishlisted(place)) {
      removeFromWishlist(place.title);
    } else {
      addToWishlist({
        id: place.id,
        name: place.title,
        title: place.title,
        image: place.image,
        location: place.address,
      });
    }
  };

  return (
    <div id="screen-discovery-hub" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="discovery-hub" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
        <div className="main-content">
          <div className="discovery-hero">
            <h1 className="text-glow animate-fade-in">{t("navDiscoveryHub")}</h1>
            <p className="discovery-subtitle">{t("discoveryHubSubtitle")}</p>
            
            <div className="search-container-futuristic">
              <input
                ref={searchInputRef}
                type="text"
                className="discovery-search-input"
                placeholder={t("discoverySearchPh")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="discovery-body">
            {selectedPlace ? (
              <div className="discovery-result-details animate-slide-up">
                <div className="discovery-card-large futuristic-card">
                  <div className="card-image" style={{ backgroundImage: `url(${selectedPlace.image})` }}>
                    <button 
                      className={`wishlist-toggle ${isWishlisted(selectedPlace) ? "active" : ""}`}
                      onClick={() => handleToggleWishlist(selectedPlace)}
                    >
                      {isWishlisted(selectedPlace) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h2>{selectedPlace.title}</h2>
                      <div className="rating">
                        <span className="stars">⭐ {selectedPlace.rating || "N/A"}</span>
                        <span className="count">({selectedPlace.user_ratings_total || 0} reviews)</span>
                      </div>
                    </div>
                    <p className="address">📍 {selectedPlace.address}</p>
                    <div className="tags">
                      {selectedPlace.types?.slice(0, 5).map(type => (
                        <span key={type} className="tag">{type.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                    
                    <div className="discovery-map-preview glow-teal">
                      <iframe
                        title="Google Map"
                        width="100%"
                        height="300"
                        style={{ border: 0, borderRadius: '12px' }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${selectedPlace.id}`}
                        allowFullScreen
                      ></iframe>
                    </div>

                    <button className="btn-save-wishlist" onClick={() => handleToggleWishlist(selectedPlace)}>
                      {isWishlisted(selectedPlace) ? t("wishlistRemoveTitle") : t("detailAddToWishlist")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="discovery-placeholder animate-fade-in">
                <div className="placeholder-icon">🌏</div>
                <h3>{t("navDiscover")}</h3>
                <p>{t("discoveryStartDesc")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        #screen-discovery-hub {
          background: var(--off-white);
          min-height: 100vh;
          overflow-x: hidden;
        }
        .discovery-hero {
          padding: 80px 24px 60px;
          text-align: center;
          background: linear-gradient(to bottom, var(--teal-light), transparent);
          border-radius: 0 0 60px 60px;
          margin-bottom: 50px;
        }
        :global(html.dark) .discovery-hero {
          background: #0c1215;
          border-bottom: 1px solid #1f2a30;
          box-shadow: inset 0 -20px 40px rgba(0,0,0,0.5);
        }
        .discovery-hero h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 12px;
          color: var(--teal-dark);
          text-shadow: 0 4px 10px rgba(0,0,0,0.1);
          letter-spacing: -1.5px;
          font-weight: 900;
        }
        :global(html.dark) .discovery-hero h1 {
          color: #6be5cf;
          text-shadow: 0 0 30px rgba(107, 229, 207, 0.3);
        }
        .discovery-subtitle {
          color: var(--gray-600);
          font-size: 1.15rem;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        :global(html.dark) .discovery-subtitle {
          color: var(--gray-400);
        }
        .search-container-futuristic {
          position: relative;
          max-width: 650px;
          margin: 0 auto;
          z-index: 10;
        }
        .discovery-search-input {
          width: 100%;
          padding: 20px 25px 20px 60px;
          border-radius: 50px;
          border: 2px solid var(--gray-100);
          background: var(--white);
          color: var(--text);
          font-size: 1.2rem;
          box-shadow: var(--shadow-lg);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          outline: none;
        }
        :global(html.dark) .discovery-search-input {
          background: #1a242a;
          border-color: #2a3840;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        :global(html.dark) .discovery-search-input::placeholder {
          color: var(--gray-400);
          opacity: 0.6;
        }
        .discovery-search-input:focus {
          border-color: var(--teal);
          transform: scale(1.02);
          box-shadow: 0 20px 50px rgba(11, 168, 145, 0.2);
        }
        .search-icon {
          position: absolute;
          left: 22px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.6rem;
          opacity: 0.6;
          color: var(--teal);
        }
        .discovery-body {
          padding: 0 40px 80px;
          max-width: 1300px;
          margin: 0 auto;
        }
        .discovery-card-large {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 0;
          overflow: hidden;
          background: var(--white);
          border-radius: 32px;
          border: 1px solid var(--gray-100);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .card-image {
          height: 100%;
          min-height: 600px;
          background-size: cover;
          background-position: center;
          position: relative;
          transition: transform 0.6s ease;
        }
        .discovery-card-large:hover .card-image {
          transform: scale(1.02);
        }
        .wishlist-toggle {
          position: absolute;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 5;
        }
        :global(html.dark) .wishlist-toggle {
          background: rgba(30, 48, 53, 0.8);
          color: white;
        }
        .wishlist-toggle:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .wishlist-toggle.active {
          background: #ff4757;
          color: white;
          transform: scale(1.15);
        }
        .card-content {
          padding: 50px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: var(--white);
          position: relative;
          z-index: 2;
        }
        .card-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 8px;
          color: var(--text);
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          line-height: 1.1;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--gray-50);
          padding: 8px 16px;
          border-radius: 50px;
          width: fit-content;
        }
        .stars {
          font-weight: 800;
          color: #f59e0b;
          font-size: 1.1rem;
        }
        .count {
          color: var(--gray-600);
          font-size: 0.95rem;
          font-weight: 500;
        }
        .address {
          color: var(--gray-600);
          font-size: 1.1rem;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tag {
          background: var(--teal-light);
          color: var(--teal-dark);
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s;
        }
        :global(html.dark) .tag {
          background: #173138;
          color: #6be5cf;
        }
        .tag:hover {
          background: var(--teal);
          color: white;
        }
        .discovery-map-preview {
          margin-top: 10px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--gray-100);
        }
        .btn-save-wishlist {
          margin-top: 20px;
          background: linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%);
          color: white;
          border: none;
          padding: 20px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.4s;
          box-shadow: 0 10px 30px rgba(11, 168, 145, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .btn-save-wishlist:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(11, 168, 145, 0.45);
        }
        .discovery-placeholder {
          text-align: center;
          padding: 120px 0;
          color: var(--gray-400);
        }
        .placeholder-icon {
          font-size: 6rem;
          margin-bottom: 24px;
          opacity: 0.2;
          filter: grayscale(1);
        }
        .discovery-placeholder h3 {
          font-size: 1.8rem;
          color: var(--gray-600);
          margin-bottom: 12px;
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1100px) {
          .discovery-card-large {
            grid-template-columns: 1fr;
          }
          .card-image {
            min-height: 400px;
          }
          .card-content {
            padding: 35px;
          }
        }
      `}</style>
    </div>
  );
}
