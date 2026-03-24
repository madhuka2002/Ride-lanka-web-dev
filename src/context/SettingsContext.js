"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();
const TRANSLATIONS = {
  en: {
    appRoleTripPlanner: "Trip planner for Sri Lanka",
    appRoleExplorerPro: "Explorer · Pro",
    navDiscover: "Discover",
    navHome: "Home",
    navExplore: "Explore Sri Lanka",
    navTrips: "Trips",
    navMyTrips: "My Trips",
    navWishlist: "Wishlist",
    navAccount: "Account",
    navProfile: "Profile",
    navNotifications: "Notifications",
    navSettings: "Settings",
    splashTitleLine1: "Ready to Dream?",
    splashTitleLine2: "Let's Travel.",
    splashSubtitle: "Discover breathtaking destinations, plan unforgettable trips, and connect with a global community of explorers.",
    splashGetStarted: "Get Started",
    splashSignIn: "Sign In",
    authHeroTitleLine1: "Every journey begins",
    authHeroTitleLine2: "with a single step.",
    authHeroSubtitle: "Join millions of travelers who plan their dream trips with DreamTrip.",
    authSignInTab: "Sign In",
    authCreateAccountTab: "Create Account",
    authBrandTagline: "Plan. Explore. Remember.",
    authTablistAria: "Sign in or create an account",
    authInterestHint: "Tap what excites you — pick at least one.",
    loginWelcomeBack: "Welcome back!",
    loginSubtitle: "Sign in to continue your travel journey",
    loginEmailLabel: "Email Address",
    loginPasswordLabel: "Password",
    loginForgotPassword: "Forgot password?",
    loginSigningIn: "Signing in...",
    loginSignIn: "Sign In",
    loginErrorEmpty: "Please enter your email and password.",
    loginErrorFailed: "Sign in failed. Check your credentials.",
    signupTitle: "Create your account",
    signupSubtitle: "Start planning your Sri Lanka adventure",
    signupFullName: "Full Name",
    signupNext: "Next",
    signupInterestsTitle: "Select your interests",
    signupInterestsSubtitle: "We use these to generate AI recommendations.",
    signupCreating: "Creating account...",
    signupCreateAccount: "Create Account",
    signupBack: "Back",
    signupErrorSelectInterest: "Please select at least one interest.",
    signupErrorFailed: "Sign up failed. Please try again.",
    signupErrorFillAll: "Please fill in all fields.",
    signupErrorPasswordLen: "Password must be at least 6 characters.",
    settingsTitle: "Settings",
    settingsTitle: "Settings",
    settingsSubtitle: "Manage your account preferences and application experience.",
    appearanceTitle: "Appearance",
    appearanceDesc: "Customize how Ride-Lanka looks on your device.",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    languageTitle: "Language",
    languageDesc: "Select your preferred language for the interface.",
    notificationsTitle: "Notifications",
    notificationsDesc: "Control which alerts you want to receive.",
    emailNotificationsTitle: "Email Notifications",
    emailNotificationsDesc: "Receive trip summaries and recommendations via email.",
    pushNotificationsTitle: "Push Notifications",
    pushNotificationsDesc: "Get real-time alerts for travel updates and badges.",
    privacyTitle: "Security & Privacy",
    privacyDesc: "Manage your account visibility and data tracking.",
    publicProfileTitle: "Public Profile",
    publicProfileDesc: "Allow others to see your traveler level and badges.",
    activityTrackingTitle: "Activity Tracking",
    activityTrackingDesc: "Use your travel behavior to improve AI recommendations.",
    notificationsEmpty: "No new notifications.",
    wishlistTitle: "My Wishlist",
    wishlistPlacesSaved: "places saved",
    wishlistEmptyTitle: "Your wishlist is empty",
    wishlistEmptyDesc: "Press the heart button on any destination in Home or Explore to save it here.",
    wishlistRemoveTitle: "Remove from Wishlist",
    homeTitle: "Plan your Sri Lanka trip",
    homeMorning: "Good morning",
    homeRecommended: "Recommended for you by AI",
    homeRefreshing: "Refreshing...",
    homeRefreshAI: "Refresh AI",
    homeLoadingRecommendations: "Loading recommendations...",
    homeRecommendationsError: "Could not load recommendations. Ensure backend and AI are running.",
    homeRefreshFailed: "Refresh failed.",
    homeOpenMap: "Open map",
    homeTripStyle: "Trip style",
    homePopularItineraries: "Popular itineraries in Sri Lanka",
    homeHiddenGems: "Hidden Gems & Off the Beaten Path",
    homeThrillingAdventures: "Thrilling Adventures",
    tripsTitle: "My Trips ✈️",
    tripsSubtitle: "Track and plan all your adventures",
    tripsNewTrip: "+ New Trip",
    tripsBackToTrips: "← Back to trips",
    tripsFilterAll: "All Trips",
    tripsFilterUpcoming: "Upcoming",
    tripsFilterActive: "Active",
    tripsFilterCompleted: "Completed",
    tripsLoading: "Loading your trips...",
    tripsNoSaved: "No trips saved yet",
    tripsNoSavedDesc: "Click \"New Trip\" to start planning your adventure!",
    tripsNoCategory: "No trips in this category.",
    tripsShowAll: "Show all trips",
    profileTitle: "Profile",
    profileEdit: "Edit Profile",
    profileTravelerQuests: "Traveler Quests",
    profileTravelerQuestsDesc: "View and complete available quests to earn rewards!",
    profileViewQuests: "View Quests",
    profileSignOut: "Sign Out",
    questsTitle: "Quests & Challenges",
    questsSubtitle: "Complete these quests to earn rewards and upgrade your traveler status!",
    questsLoading: "Loading quests...",
    questsEmpty: "No quests available right now. Check back later!",
    questsCompleted: "✓ Completed",
    questsCompleting: "Completing...",
    questsCompleteQuest: "Complete Quest",
    communityTitle: "Community 🌐",
    communitySubtitle: "Connect with fellow travelers",
    detailBackToExplore: "← Back to Explore",
    detailBookNow: "Book Now",
    detailAddToWishlist: "Add to Wishlist ❤️"
  },
  si: {
    appRoleTripPlanner: "ශ්‍රී ලංකා සංචාර සැලසුම්කරු",
    appRoleExplorerPro: "ගවේෂක · ප්‍රෝ",
    navDiscover: "සොයා බලන්න",
    navHome: "මුල් පිටුව",
    navExplore: "ශ්‍රී ලංකාව ගවේෂණය",
    navTrips: "සංචාර",
    navMyTrips: "මගේ සංචාර",
    navWishlist: "පැතුම් ලැයිස්තුව",
    navAccount: "ගිණුම",
    navProfile: "පැතිකඩ",
    navNotifications: "දැනුම්දීම්",
    navSettings: "සැකසුම්",
    splashTitleLine1: "සිහින දකින්න සූදානම්ද?",
    splashTitleLine2: "අපි සංචාරය කරමු.",
    splashSubtitle: "අලංකාර ගමනාන්ත සොයා, අමතක නොවන සංචාර සැලසුම් කර, ගවේෂකයන්ගේ ගෝලීය ප්‍රජාව සමඟ සම්බන්ධ වන්න.",
    splashGetStarted: "ආරම්භ කරන්න",
    splashSignIn: "පිවිසෙන්න",
    authHeroTitleLine1: "සෑම ගමනක්ම ආරම්භ වන්නේ",
    authHeroTitleLine2: "එක් පියවරකින්.",
    authHeroSubtitle: "DreamTrip සමඟ තම සිහින සංචාර සැලසුම් කරන මිලියන ගණනක් සංචාරකයන්ට එක්වන්න.",
    authSignInTab: "පිවිසෙන්න",
    authCreateAccountTab: "ගිණුම සාදන්න",
    authBrandTagline: "සැලසුම් · ගවේෂණය · මතක.",
    authTablistAria: "පිවිසීම හෝ ගිණුමක් සාදීම",
    authInterestHint: "ඔබට උද්යෝගය දනවන දේ තට්ටු කරන්න — එකක් වත් තෝරන්න.",
    loginWelcomeBack: "නැවත සාදරයෙන් පිළිගනිමු!",
    loginSubtitle: "ඔබේ සංචාරක ගමන දිගටම කරගෙන යාමට පිවිසෙන්න",
    loginEmailLabel: "ඊමේල් ලිපිනය",
    loginPasswordLabel: "මුරපදය",
    loginForgotPassword: "මුරපදය අමතකද?",
    loginSigningIn: "පිවිසෙමින්...",
    loginSignIn: "පිවිසෙන්න",
    loginErrorEmpty: "කරුණාකර ඔබේ ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.",
    loginErrorFailed: "පිවිසීම අසාර්ථකයි. ඔබේ විස්තර පරීක්ෂා කරන්න.",
    signupTitle: "ඔබේ ගිණුම සාදන්න",
    signupSubtitle: "ඔබගේ ශ්‍රී ලංකා සංචාරය සැලසුම් කිරීම ආරම්භ කරන්න",
    signupFullName: "සම්පූර්ණ නම",
    signupNext: "ඊළඟ",
    signupInterestsTitle: "ඔබේ රුචිකතා තෝරන්න",
    signupInterestsSubtitle: "AI නිර්දේශ සඳහා මෙය අපි භාවිත කරමු.",
    signupCreating: "ගිණුම සාදමින්...",
    signupCreateAccount: "ගිණුම සාදන්න",
    signupBack: "ආපසු",
    signupErrorSelectInterest: "කරුණාකර අවම වශයෙන් එක් රුචිකතාවක් තෝරන්න.",
    signupErrorFailed: "ගිණුම සෑදීම අසාර්ථකයි. නැවත උත්සාහ කරන්න.",
    signupErrorFillAll: "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න.",
    signupErrorPasswordLen: "මුරපදය අක්ෂර 6ක්වත් විය යුතුය.",
    settingsTitle: "සැකසුම්",
    settingsSubtitle: "ඔබගේ ගිණුම් කැමැත්ත සහ යෙදුම් අත්දැකීම කළමනාකරණය කරන්න.",
    appearanceTitle: "පෙනුම",
    appearanceDesc: "ඔබගේ උපාංගයේ Ride-Lanka පෙනුම අභිරුචිකරණය කරන්න.",
    themeLight: "ආලෝක",
    themeDark: "අඳුරු",
    themeSystem: "පද්ධති",
    languageTitle: "භාෂාව",
    languageDesc: "අතුරුමුහුණත සඳහා ඔබ කැමති භාෂාව තෝරන්න.",
    notificationsTitle: "දැනුම්දීම්",
    notificationsDesc: "ඔබට ලැබිය යුතු දැනුම්දීම් පාලනය කරන්න.",
    emailNotificationsTitle: "ඊමේල් දැනුම්දීම්",
    emailNotificationsDesc: "ගමන් සාරාංශ සහ නිර්දේශ ඊමේල් හරහා ලබා ගන්න.",
    pushNotificationsTitle: "පුෂ් දැනුම්දීම්",
    pushNotificationsDesc: "ගමන් යාවත්කාලීන සහ බැජ් සඳහා තත්‍ය කාලීන දැනුම්දීම් ලබා ගන්න.",
    privacyTitle: "ආරක්ෂාව සහ පෞද්ගලිකත්වය",
    privacyDesc: "ගිණුම් දෘශ්‍යතාව සහ දත්ත නිරීක්ෂණය කළමනාකරණය කරන්න.",
    publicProfileTitle: "පොදු පැතිකඩ",
    publicProfileDesc: "අන් අයට ඔබේ සංචාරක මට්ටම සහ බැජ් දැකීමට ඉඩ දෙන්න.",
    activityTrackingTitle: "ක්‍රියාකාරකම් නිරීක්ෂණය",
    activityTrackingDesc: "AI නිර්දේශ වැඩිදියුණු කිරීමට ඔබගේ ගමන් හැසිරීම භාවිත කරන්න.",
    notificationsEmpty: "නව දැනුම්දීම් නොමැත.",
    wishlistTitle: "මගේ පැතුම් ලැයිස්තුව",
    wishlistPlacesSaved: "ස්ථාන සුරකින ලදී",
    wishlistEmptyTitle: "ඔබේ පැතුම් ලැයිස්තුව හිස්ය",
    wishlistEmptyDesc: "මෙහි සුරැකීමට Home හෝ Explore හි ඕනෑම ගමනාන්තයක හදවත බොත්තම ඔබන්න.",
    wishlistRemoveTitle: "පැතුම් ලැයිස්තුවෙන් ඉවත් කරන්න",
    homeTitle: "ඔබගේ ශ්‍රී ලංකා සංචාරය සැලසුම් කරන්න",
    homeMorning: "සුභ උදෑසනක්",
    homeRecommended: "AI ඔබට නිර්දේශ කරයි",
    homeRefreshing: "යාවත්කාලීන වෙමින්...",
    homeRefreshAI: "AI යාවත්කාලීන කරන්න",
    homeLoadingRecommendations: "නිර්දේශ පූරණය වෙමින්...",
    homeRecommendationsError: "නිර්දේශ පූරණය කළ නොහැකි විය. Backend සහ AI ධාවනය වන බව තහවුරු කරන්න.",
    homeRefreshFailed: "යාවත්කාලීන කිරීම අසාර්ථකයි.",
    homeOpenMap: "සිතියම විවෘත කරන්න",
    homeTripStyle: "සංචාර ශෛලිය",
    homePopularItineraries: "ශ්‍රී ලංකාවේ ජනප්‍රිය සංචාර සැලසුම්",
    homeHiddenGems: "රහසිගත මැණික් සහ විශේෂ ස්ථාන",
    homeThrillingAdventures: "රසවත් ත්‍රාසජනක අත්දැකීම්",
    tripsTitle: "මගේ සංචාර ✈️",
    tripsSubtitle: "ඔබගේ සියලු ගමන් අත්දැකීම් සැලසුම් කර අධීක්ෂණය කරන්න",
    tripsNewTrip: "+ නව සංචාරයක්",
    tripsBackToTrips: "← සංචාර වෙත ආපසු",
    tripsFilterAll: "සියලු සංචාර",
    tripsFilterUpcoming: "ඉදිරියට ඇති",
    tripsFilterActive: "ක්‍රියාත්මක",
    tripsFilterCompleted: "සම්පූර්ණ",
    tripsLoading: "ඔබගේ සංචාර පූරණය වෙමින්...",
    tripsNoSaved: "තවම සංචාර සුරකිලා නැහැ",
    tripsNoSavedDesc: "\"නව සංචාරයක්\" ක්ලික් කර ආරම්භ කරන්න!",
    tripsNoCategory: "මෙම ප්‍රභේදයට සංචාර නොමැත.",
    tripsShowAll: "සියල්ල පෙන්වන්න",
    profileTitle: "පැතිකඩ",
    profileEdit: "පැතිකඩ සංස්කරණය",
    profileTravelerQuests: "සංචාරක කාර්යය",
    profileTravelerQuestsDesc: "ප්‍රතිලාභ ලබා ගැනීමට ලබාගත හැකි කාර්යයන් සම්පූර්ණ කරන්න!",
    profileViewQuests: "කාර්යයන් බලන්න",
    profileSignOut: "පිටවන්න",
    questsTitle: "කාර්යයන් සහ අභියෝග",
    questsSubtitle: "ප්‍රතිලාභ ලබාගෙන සංචාරක මට්ටම ඉහළ නැංවීමට කාර්යයන් සම්පූර්ණ කරන්න!",
    questsLoading: "කාර්යයන් පූරණය වෙමින්...",
    questsEmpty: "දැනට කාර්යයන් නොමැත. පසුව නැවත පරීක්ෂා කරන්න!",
    questsCompleted: "✓ සම්පූර්ණයි",
    questsCompleting: "සම්පූර්ණ කරමින්...",
    questsCompleteQuest: "කාර්යය සම්පූර්ණ කරන්න",
    communityTitle: "ප්‍රජාව 🌐",
    communitySubtitle: "සහ සංචාරකයින් සමඟ සම්බන්ධ වන්න",
    detailBackToExplore: "← ගවේෂණය වෙත ආපසු",
    detailBookNow: "දැන් වෙන්කරන්න",
    detailAddToWishlist: "පැතුම් ලැයිස්තුවට එක් කරන්න ❤️"
  },
  ta: {
    settingsTitle: "அமைப்புகள்",
    settingsSubtitle: "உங்கள் கணக்கு விருப்பங்களையும் பயன்பாட்டு அனுபவத்தையும் நிர்வகிக்கவும்.",
    appearanceTitle: "தோற்றம்",
    appearanceDesc: "உங்கள் சாதனத்தில் Ride-Lanka எப்படி தோன்ற வேண்டும் என்பதை தனிப்பயனாக்கவும்.",
    themeLight: "ஒளி",
    themeDark: "இருள்",
    themeSystem: "கணினி",
    languageTitle: "மொழி",
    languageDesc: "இணைமுகத்திற்கு விருப்பமான மொழியைத் தேர்வுசெய்க.",
    notificationsTitle: "அறிவிப்புகள்",
    notificationsDesc: "நீங்கள் பெற விரும்பும் அறிவிப்புகளை கட்டுப்படுத்தவும்.",
    emailNotificationsTitle: "மின்னஞ்சல் அறிவிப்புகள்",
    emailNotificationsDesc: "பயண சுருக்கங்கள் மற்றும் பரிந்துரைகளை மின்னஞ்சலில் பெறவும்.",
    pushNotificationsTitle: "புஷ் அறிவிப்புகள்",
    pushNotificationsDesc: "பயண புதுப்பிப்புகள் மற்றும் பதக்கங்களுக்கு உடனடி அறிவிப்புகளை பெறவும்.",
    privacyTitle: "பாதுகாப்பும் தனியுரிமையும்",
    privacyDesc: "உங்கள் கணக்கு காட்சிப்படுத்தலும் தரவு கண்காணிப்பையும் நிர்வகிக்கவும்.",
    publicProfileTitle: "பொது சுயவிவரம்",
    publicProfileDesc: "மற்றவர்கள் உங்கள் பயணி நிலை மற்றும் பதக்கங்களை காண அனுமதிக்கவும்.",
    activityTrackingTitle: "செயற்பாட்டு கண்காணிப்பு",
    activityTrackingDesc: "AI பரிந்துரைகளை மேம்படுத்த உங்கள் பயண நடத்தை பயன்படுத்தவும்."
  }
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState("system"); // light, dark, system
  const [language, setLanguage] = useState("en"); // en, si, ta
  const [notifications, setNotifications] = useState({
    email: true,
    push: true
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    tracking: true
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ride-lanka-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.privacy) setPrivacy(parsed.privacy);
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Save to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem("ride-lanka-settings", JSON.stringify({
      theme, language, notifications, privacy
    }));

    // Apply dark mode class to html
    const root = window.document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Keep browser language metadata in sync with selected app language.
    root.setAttribute("lang", language);
    root.setAttribute("dir", "ltr");
  }, [theme, language, notifications, privacy]);

  useEffect(() => {
    if (theme !== "system") return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const root = window.document.documentElement;
      if (media.matches) root.classList.add("dark");
      else root.classList.remove("dark");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const t = (key) => TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme, 
      language, setLanguage, 
      t,
      notifications, setNotifications,
      privacy, setPrivacy 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
