"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { getExplorePlaces } from "@/lib/api";

export default function ExploreScreen({ active, showScreen }) {
  const { user, token } = useAuth();
  const { t } = useSettings();
  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "traveler", [user]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [explorePlaces, setExplorePlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (active && token) {
      setLoading(true);
      getExplorePlaces(token)
        .then((data) => setExplorePlaces(data.places || []))
        .catch((err) => console.error("Failed to load explore places", err))
        .finally(() => setLoading(false));
    }
  }, [active, token]);

  // Scroll to top when article is opened
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const filteredPlaces = useMemo(() => {
    // Broaden filter to catch 'test001', 'test 001', etc.
    return explorePlaces.filter(p => !p.title.toLowerCase().includes("test"));
  }, [explorePlaces]);

  // Scroll to top when article is opened
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    const scrollContainer = document.querySelector("#screen-explore .main-content");
    if (scrollContainer) scrollContainer.scrollTop = 0;
  };

  return (
    <div id="screen-explore" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="explore" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
        <div className="main-content">
          
          {selectedPlace ? (
            <div className="explore-article-view">
              <div className="explore-article-hero article-futuristic-header" style={{ backgroundImage: `url(${selectedPlace.image})` }}>
                <div className="hero-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                  <div className="hero-topbar">
                    <button 
                      className="btn-back-article glass-panel" 
                      onClick={() => setSelectedPlace(null)} 
                    >
                      {t("tripsBackToTrips")}
                    </button>
                  </div>
                  <h1 className="article-title-futuristic">{selectedPlace.title}</h1>
                </div>
              </div>
              <div className="explore-article-content article-content-glass article-flex-layout">
                <div className="article-main-text">
                  <p className="article-lead" style={{ color: 'var(--teal-dark)', borderLeftColor: 'var(--teal)' }}>{selectedPlace.snippet}</p>
                  <div className="article-body">
                    <p>{selectedPlace.content}</p>
                    
                    {selectedPlace.coordinates && (
                      <div className="maps-container glow-teal" style={{ marginTop: '40px' }}>
                         <iframe 
                          className="maps-embed"
                          title="Location Map"
                          src={`https://www.google.com/maps?q=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}&z=15&output=embed`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Visual Archive */}
                <div className="article-collage-sidebar">
                  <h4 className="text-glow" style={{ marginBottom: '20px', color: 'var(--teal-dark)', fontSize: '0.8rem', letterSpacing: '2px' }}>VISUAL ARCHIVE</h4>
                  <div className="single-archive-card futuristic-card">
                    <img src={selectedPlace.image} alt={selectedPlace.title} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="topbar" style={{ borderBottom: 'none' }}>
                <div style={{ paddingBottom: "24px", width: "100%" }}>
                  <h1 className="text-glow explore-main-title" style={{ fontSize: "2.8rem", marginBottom: 8, fontWeight: 900 }}>EXPLORE SRI LANKA</h1>
                  <div className="subtitle explore-main-subtitle" style={{ fontSize: "1.1rem", letterSpacing: '1px' }}>
                    IMMERSIVE JOURNEYS THROUGH THE PEARL OF THE INDIAN OCEAN
                  </div>
                </div>
              </div>

              {/* Futuristic Map Feature */}
              {!loading && filteredPlaces.length > 0 && (
                <div className="explore-map-container glow-teal">
                  <iframe 
                    style={{ width: '100%', height: '100%', border: 'none', filter: 'grayscale(0.2) contrast(1.1)' }}
                    src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=Famous+Places+in+Sri+Lanka&center=7.8731,80.7718&zoom=7`}
                    // Fallback to a searchable static-ish view if no key or key fails
                    srcDoc={!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `<style>body{margin:0;overflow:hidden;}iframe{width:100%;height:100%;border:none;}</style><iframe src="https://www.google.com/maps?q=Sri+Lanka+Famous+Destinations&z=7&output=embed"></iframe>` : undefined}
                  ></iframe>
                  <div className="map-overlay-info">
                    <strong>Interstellar Navigation</strong>
                    <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{filteredPlaces.length} Nexus Points Loaded</div>
                  </div>
                </div>
              )}

              <div className="explore-bento">
                {loading ? (
                  <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '100px' }}>
                    <div className="marker-pulse" style={{ margin: '0 auto 20px' }}></div>
                    <p style={{ color: "var(--gray-400)", fontSize: "1.1rem", letterSpacing: '2px' }}>LOADING DATASTREAMS...</p>
                  </div>
                ) : filteredPlaces.length === 0 ? (
                  <p style={{ color: "var(--gray-500)", fontSize: "1.1rem" }}>No signals found in this sector.</p>
                ) : (
                  filteredPlaces.map((place, index) => {
                    let bentoClass = "bento-normal";
                    const pos = index % 7;
                    if (pos === 0) bentoClass = "bento-large";
                    else if (pos === 3 || pos === 6) bentoClass = "bento-wide";
                    const liked = isWishlisted(place);

                    return (
                      <div key={place.id} className={`bento-card futuristic-card ${bentoClass}`} onClick={() => handleSelectPlace(place)}>
                        <div className="bento-bg" style={{ backgroundImage: `url(${place.image})` }} />
                        <div className="bento-overlay">
                          <h3 className="text-glow">{place.title}</h3>
                          {(bentoClass === "bento-large" || bentoClass === "bento-wide") && (
                            <p style={{ opacity: 0.8 }}>{place.snippet}</p>
                          )}
                          <span className="read-more" style={{ color: 'var(--teal)' }}>INITIATE ARTICLE →</span>
                        </div>
                        <button
                          className={`wishlist-btn ${liked ? "wishlisted" : ""}`}
                          onClick={(e) => { e.stopPropagation(); liked ? removeFromWishlist(place.title) : addToWishlist({ ...place, name: place.title, image: place.image }); }}
                          title={liked ? t("wishlistRemoveTitle") : t("navWishlist")}
                        >
                          {liked ? "❤️" : "🤍"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
