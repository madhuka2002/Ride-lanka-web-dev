"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useGuideAuth } from "@/context/GuideAuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  listBookingsForGuide,
  updateBookingStatus,
} from "@/lib/tourGuides";

export default function GuideBookingsScreen({ active, showScreen }) {
  const { guide: user } = useGuideAuth();
  const { t } = useSettings();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  const [loading, setLoading] = useState(true);
  const [incoming, setIncoming] = useState([]);

  const refreshBookings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const inc = await listBookingsForGuide(user.uid);
      setIncoming(inc);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!active || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      await refreshBookings();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [active, user, refreshBookings]);

  async function handleBookingAction(bookingId, status) {
    if (!user?.uid) return;
    try {
      await updateBookingStatus(bookingId, user.uid, status);
      await refreshBookings();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!user && active) {
    return (
      <div id="screen-guide-bookings" className={`screen ${active ? "active" : ""}`}>
        <div className="main-layout">
          <Sidebar activeItem="guide-incoming" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
          <div className="main-content">
            <p>{t("guidesHubSignIn")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-guide-bookings" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="guide-incoming" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div>
              <h1>{t("bookingRequestsTitle")}</h1>
              <div className="subtitle">{t("bookingRequestsSubtitle")}</div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>{t("loadingData")}</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="section-header" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t("incomingRequestsTab")}</h3>
              </div>
              
              {incoming.filter((b) => b.status === "pending").length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📥</div>
                  <p className="subtitle">{t("noIncomingRequests")}</p>
                </div>
              ) : (
                <div className="bookings-grid" style={{ display: 'grid', gap: '20px' }}>
                  {incoming
                    .filter((b) => b.status === "pending")
                    .map((b) => (
                      <div key={b.id} className="booking-card-modern">
                        <div className="status-accent info"></div>
                        <div className="booking-content" style={{ flex: 1, padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>{b.travellerName}</h4>
                            <span className="badge-pill">Pending</span>
                          </div>
                          
                          <div className="booking-info-grid">
                            <div className="info-item">
                              <span className="icon">📍</span>
                              <span>{b.destination}</span>
                            </div>
                            <div className="info-item">
                              <span className="icon">📅</span>
                              <span>{b.tourDate} {b.tourTime}</span>
                            </div>
                            <div className="info-item">
                              <span className="icon">👥</span>
                              <span>{b.partySize} {t("travelersCountLabel")}</span>
                            </div>
                          </div>

                          {b.message && (
                            <div className="booking-message" style={{ background: "var(--gray-50)", borderLeft: "3px solid var(--teal)" }}>
                              <p style={{ color: "var(--gray-600)" }}>"{b.message}"</p>
                            </div>
                          )}

                          <div className="booking-actions">
                            <button 
                              className="btn-action accept" 
                              onClick={() => handleBookingAction(b.id, "accepted")}
                            >
                              {t("acceptButton")}
                            </button>
                            <button 
                              className="btn-action decline" 
                              onClick={() => handleBookingAction(b.id, "rejected")}
                            >
                              {t("declineButton")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              
              {incoming.filter((b) => b.status !== "pending").length > 0 && (
                <div style={{ marginTop: '48px' }}>
                  <div className="section-header" style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t("pastReservationsTitle")}</h4>
                  </div>
                  <div className="past-bookings-list">
                    {incoming
                      .filter((b) => b.status !== "pending")
                      .map((b) => (
                        <div key={b.id} className="past-booking-item" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
                          <div className="past-info">
                            <span className="past-name" style={{ color: "var(--text)" }}>{b.travellerName}</span>
                            <span className="past-meta" style={{ color: "var(--gray-400)" }}>{b.destination} • {b.tourDate}</span>
                          </div>
                          <span className={`status-tag ${b.status}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
