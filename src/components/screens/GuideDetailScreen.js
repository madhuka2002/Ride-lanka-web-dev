"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  getGuideProfile,
  listReviewsForGuide,
  createBookingRequest,
  addGuideReview,
  GUIDE_EXPERTISE_OPTIONS,
} from "@/lib/tourGuides";

function expertiseLabel(id) {
  return GUIDE_EXPERTISE_OPTIONS.find((o) => o.id === id)?.label || id;
}

export default function GuideDetailScreen({ active, showScreen, guideId }) {
  const { user } = useAuth();
  const { t } = useSettings();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingErr, setBookingErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [destination, setDestination] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [message, setMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  const load = useCallback(async () => {
    if (!guideId) {
      setGuide(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const g = await getGuideProfile(guideId);
      setGuide(g);
      const r = await listReviewsForGuide(guideId);
      setReviews(r);
    } catch {
      setGuide(null);
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  useEffect(() => {
    if (active) load();
  }, [active, load]);

  async function submitBooking(e) {
    e.preventDefault();
    setBookingErr("");
    setBookingMsg("");
    if (!user) {
      setBookingErr(t("guidesSignInToBook"));
      return;
    }
    if (!tourDate || !destination.trim()) {
      setBookingErr(t("guidesBookingFillRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await createBookingRequest({
        traveller: user,
        guideId,
        guideDisplayName: guide.displayName,
        tourDate,
        tourTime,
        destination: destination.trim(),
        partySize,
        message: message.trim(),
      });
      setBookingMsg(t("guidesBookingSent"));
      setTourDate("");
      setTourTime("");
      setDestination("");
      setPartySize(2);
      setMessage("");
    } catch (err) {
      setBookingErr(err.message || t("guidesBookingFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewMsg("");
    if (!user || !guideId || user.uid === guideId) return;
    try {
      await addGuideReview({ guideId, traveller: user, rating: reviewRating, text: reviewText.trim() });
      setReviewMsg(t("guidesReviewThanks"));
      setReviewText("");
      const r = await listReviewsForGuide(guideId);
      setReviews(r);
      const g = await getGuideProfile(guideId);
      setGuide(g);
    } catch (err) {
      setReviewMsg(err.message || t("guidesReviewFailed"));
    }
  }

  if (!guideId && active) {
    return (
      <div id="screen-guide-detail" className={`screen ${active ? "active" : ""}`}>
        <div className="main-layout">
          <Sidebar activeItem="tour-guides" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
          <div className="main-content">
            <button type="button" className="back-btn" onClick={() => showScreen("screen-tour-guides")}>
              {t("guidesBackToList")}
            </button>
            <p>{t("guidesNotFound")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-guide-detail" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="tour-guides" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
        <div className="main-content">
          <div className="back-btn" role="button" tabIndex={0} onClick={() => showScreen("screen-tour-guides")} onKeyDown={(e) => e.key === "Enter" && showScreen("screen-tour-guides")}>
            {t("guidesBackToList")}
          </div>

          {loading ? (
            <p className="subtitle">{t("guidesLoading")}</p>
          ) : !guide ? (
            <p>{t("guidesNotFound")}</p>
          ) : (
            <div className="detail-layout" style={{ marginTop: 16 }}>
              <div className="detail-main">
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
                  <img
                    src={guide.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"}
                    alt=""
                    style={{ width: 120, height: 120, borderRadius: 16, objectFit: "cover" }}
                  />
                  <div>
                    <h1 className="detail-title" style={{ marginBottom: 8 }}>
                      {guide.displayName}
                    </h1>
                    <div className="detail-meta" style={{ flexWrap: "wrap", gap: 12 }}>
                      <span>📍 {guide.location || "—"}</span>
                      <span>
                        ⭐ {guide.ratingAvg ? guide.ratingAvg.toFixed(1) : "—"} ({guide.ratingCount || 0} {t("guidesReviews")})
                      </span>
                      {guide.hourlyRate ? <span className="pill pill-teal">LKR {guide.hourlyRate}/hr</span> : null}
                    </div>
                    {guide.headline ? <p className="detail-desc" style={{ marginTop: 12, fontWeight: 600 }}>{guide.headline}</p> : null}
                  </div>
                </div>

                {guide.expertise?.length ? (
                  <div className="tag-row" style={{ marginBottom: 20 }}>
                    {guide.expertise.map((id) => (
                      <span key={id} className="tag">
                        {expertiseLabel(id)}
                      </span>
                    ))}
                  </div>
                ) : null}

                {guide.languages?.length ? (
                  <p className="detail-desc">
                    <strong>{t("guidesLanguages")}:</strong> {guide.languages.join(", ")}
                  </p>
                ) : null}

                {guide.experienceYears ? (
                  <p className="detail-desc">
                    <strong>{t("guidesYearsExp")}:</strong> {guide.experienceYears}
                  </p>
                ) : null}

                {guide.certifications ? (
                  <p className="detail-desc">
                    <strong>{t("guidesCerts")}:</strong> {guide.certifications}
                  </p>
                ) : null}

                {guide.bio ? <p className="detail-desc">{guide.bio}</p> : null}

                {guide.availabilityNote ? (
                  <div className="info-card" style={{ marginTop: 16, padding: 16 }}>
                    <strong>{t("guidesAvailability")}</strong>
                    <p style={{ margin: "8px 0 0", color: "var(--gray-600)" }}>{guide.availabilityNote}</p>
                  </div>
                ) : null}

                {guide.travelHighlights?.length ? (
                  <>
                    <h4 style={{ marginTop: 24, marginBottom: 12 }}>{t("guidesHighlights")}</h4>
                    <ul style={{ color: "var(--gray-600)", lineHeight: 1.6 }}>
                      {guide.travelHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {guide.galleryUrls?.length ? (
                  <>
                    <h4 style={{ marginTop: 24, marginBottom: 12 }}>{t("guidesGallery")}</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                      {guide.galleryUrls.map((url, i) => (
                        <img key={i} src={url} alt="" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10 }} />
                      ))}
                    </div>
                  </>
                ) : null}

                {guide.videoUrls?.length ? (
                  <>
                    <h4 style={{ marginTop: 24, marginBottom: 12 }}>{t("guidesVideos")}</h4>
                    <ul>
                      {guide.videoUrls.map((url, i) => (
                        <li key={i}>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {guide.stories?.length ? (
                  <>
                    <h4 style={{ marginTop: 24, marginBottom: 12 }}>{t("guidesStories")}</h4>
                    {guide.stories.map((s, i) => (
                      <div key={i} className="feed-post" style={{ marginBottom: 16, padding: 16 }}>
                        <strong>{s.title}</strong>
                        <p style={{ marginTop: 8, color: "var(--gray-600)", whiteSpace: "pre-wrap" }}>{s.body}</p>
                      </div>
                    ))}
                  </>
                ) : null}

                <h4 style={{ marginTop: 28, marginBottom: 12 }}>{t("guidesReviewsTitle")}</h4>
                {reviews.length === 0 ? (
                  <p className="subtitle">{t("guidesNoReviews")}</p>
                ) : (
                  <div className="reviews-grid-modern">
                    {reviews.map((r) => (
                      <div key={r.id} className="review-card-premium glass-panel">
                        <div className="review-left">
                          <div className="review-avatar-stylized">
                            {r.travellerPhotoURL ? (
                              <img 
                                src={r.travellerPhotoURL} 
                                alt="" 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                              />
                            ) : (
                              (r.travellerName || "?").charAt(0).toUpperCase()
                            )}
                          </div>
                        </div>
                        <div className="review-right">
                          <div className="review-header">
                            <span className="review-name">{r.travellerName}</span>
                            <span className="review-stars-modern">
                              {"★".repeat(Math.min(5, r.rating || 5))}
                              {"☆".repeat(5 - Math.min(5, r.rating || 5))}
                            </span>
                          </div>
                          <p className="review-text-modern">{r.text}</p>
                          {r.createdAt && (
                            <span className="review-date">
                              {new Date(r.createdAt.seconds * 1000).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {user && user.uid !== guideId ? (
                  <form onSubmit={submitReview} className="glass-panel review-form-premium" style={{ marginTop: 32, padding: '32px' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{t("guidesLeaveReview")}</h4>
                    <p className="subtitle" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Share your experience to help other travelers.</p>
                    
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.95rem', fontWeight: '600' }}>{t("guidesRating")}</label>
                      <div className="star-rating-input">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            className={`star-btn ${reviewRating >= num ? 'active' : ''}`}
                            onClick={() => setReviewRating(num)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              fontSize: '2rem', 
                              cursor: 'pointer',
                              padding: '0 4px',
                              color: reviewRating >= num ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
                              transition: 'all 0.2s'
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.95rem', fontWeight: '600' }}>{t("guidesReviewText")}</label>
                      <textarea 
                        rows={4} 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        placeholder="What made this tour special?"
                        style={{ 
                          width: "100%", 
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          color: 'var(--gray-100)',
                          fontSize: '1rem',
                          resize: 'none'
                        }} 
                      />
                    </div>

                    <button type="submit" className="btn-action accept" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} disabled={submitting}>
                      {submitting ? t("savingProgress") : t("guidesSubmitReview")}
                    </button>
                    
                    {reviewMsg ? (
                      <div style={{ 
                        marginTop: 20, 
                        padding: 12, 
                        borderRadius: 8, 
                        background: 'rgba(11, 168, 145, 0.1)', 
                        color: 'var(--teal)', 
                        fontSize: 14, 
                        fontWeight: 600, 
                        textAlign: "center" 
                      }}>
                        {reviewMsg}
                      </div>
                    ) : null}
                  </form>
                ) : null}
              </div>

              <div>
                <div className="booking-card">
                  <h3 style={{ marginBottom: 16 }}>{t("guidesRequestBooking")}</h3>
                  {!user ? (
                    <p className="subtitle">{t("guidesSignInToBook")}</p>
                  ) : user.uid === guideId ? (
                    <p className="subtitle">{t("guidesOwnProfile")}</p>
                  ) : (
                    <form className="booking-form" onSubmit={submitBooking}>
                      <div className="form-group">
                        <label>{t("guidesTourDate")}</label>
                        <input type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>{t("guidesTourTime")}</label>
                        <input type="time" value={tourTime} onChange={(e) => setTourTime(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>{t("guidesDestination")}</label>
                        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Kandy, Galle Fort..." required />
                      </div>
                      <div className="form-group">
                        <label>{t("guidesPartySize")}</label>
                        <input type="number" min={1} max={50} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
                      </div>
                      <div className="form-group">
                        <label>{t("guidesMessage")}</label>
                        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("guidesMessagePh")} />
                      </div>
                      {bookingErr ? <p style={{ color: "#b91c1c", fontSize: 13, marginBottom: 8 }}>{bookingErr}</p> : null}
                      {bookingMsg ? <p style={{ color: "var(--teal)", fontSize: 14, marginBottom: 8 }}>{bookingMsg}</p> : null}
                      <button type="submit" className="btn-teal" disabled={submitting}>
                        {submitting ? t("guidesSending") : t("guidesSendRequest")}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
