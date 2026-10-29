import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Trophy, 
  Users, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  Wallet, 
  ExternalLink, 
  X, 
  Filter, 
  Sparkles, 
  ChevronDown, 
  Calendar,
  Share2,
  AlertCircle,
  HelpCircle,
  Gamepad2,
  Tv
} from 'lucide-react';

const INITIAL_TOURNAMENTS = [
  {
    id: 1,
    title: "Nadeflux Weekend Warfare #12",
    host: "Nadeflux Admin",
    isVerified: true,
    isCommunity: false,
    status: "REGISTRATION OPEN", // "REGISTRATION OPEN", "LIVE NOW", "UPCOMING", "COMPLETED"
    badgeType: "open",
    slotsFilled: 84,
    totalSlots: 100,
    entryTag: "FREE / CLASSIC",
    entryType: "Free",
    prize: "₹12,000 PRIZE",
    prizeNumeric: 12000,
    timing: "SAT, 24 AUG • 7:30 PM",
    gameMode: "Squad",
    map: "Erangel",
    gradient: "from-amber-950/40 via-yellow-950/20 to-neutral-900/90",
    bannerGlow: "rgba(245, 158, 11, 0.15)",
    bannerAccent: "border-amber-500/30",
    accentColor: "orange",
    rules: "TPP Squad • Erangel • Mobile Only • Level 35+ BGMI IDs required. No emulators.",
    description: "The official weekly flagship tournament hosted by Nadeflux. 100 squad drops, single lobby qualification into high stakes finals."
  },
  {
    id: 2,
    title: "Clutch Kings — Night Ops",
    host: "Viper Community",
    isVerified: false,
    isCommunity: true,
    status: "LIVE NOW",
    badgeType: "live",
    slotsFilled: 100,
    totalSlots: 100,
    entryTag: "₹50 / ENTRY",
    entryType: "Paid",
    prize: "₹8,000 PRIZE",
    prizeNumeric: 8000,
    timing: "LIVE • ROUND 2",
    isLive: true,
    gameMode: "Squad",
    map: "Miramar",
    gradient: "from-cyan-950/50 via-teal-950/25 to-neutral-900/90",
    bannerGlow: "rgba(6, 182, 212, 0.18)",
    bannerAccent: "border-cyan-500/40",
    accentColor: "cyan",
    rules: "TPP Squad • Miramar • Hardcore drop rates • Stream delay 120s strictly observed.",
    description: "High tension Night Ops clash between tier-2 community squads. Round 2 currently in progress on Miramar."
  },
  {
    id: 3,
    title: "Erangel Elites Cup",
    host: "Nadeflux Admin",
    isVerified: true,
    isCommunity: false,
    status: "REGISTRATION OPEN",
    badgeType: "open",
    slotsFilled: 48,
    totalSlots: 100,
    entryTag: "FREE / CLASSIC",
    entryType: "Free",
    prize: "₹25,000 PRIZE",
    prizeNumeric: 25000,
    timing: "SUN, 25 AUG • 6:00 PM",
    gameMode: "Squad",
    map: "Erangel",
    gradient: "from-emerald-950/45 via-green-950/25 to-neutral-900/90",
    bannerGlow: "rgba(16, 185, 129, 0.15)",
    bannerAccent: "border-emerald-500/30",
    accentColor: "orange",
    rules: "TPP Squad • Erangel • 3 Match rotation • Kill points weighted heavily.",
    description: "Supercharged weekend cup featuring premier verified Indian BGMI line-ups battling for ₹25,000 cash pool."
  },
  {
    id: 4,
    title: "Sanhok Scrim Series #04",
    host: "Toxic Squad",
    isVerified: false,
    isCommunity: true,
    status: "UPCOMING",
    badgeType: "upcoming",
    slotsFilled: 32,
    totalSlots: 100,
    entryTag: "₹20 / PLAYER",
    entryType: "Paid",
    prize: "₹3,000 PRIZE",
    prizeNumeric: 3000,
    timing: "MON, 26 AUG • 4:30 PM",
    gameMode: "Duo",
    map: "Sanhok",
    gradient: "from-emerald-950/40 via-teal-950/20 to-neutral-900/90",
    bannerGlow: "rgba(20, 184, 166, 0.15)",
    bannerAccent: "border-emerald-600/30",
    accentColor: "orange",
    rules: "TPP Duo • Fast pace Boot camp and Paradise drops • Quick circle pacing.",
    description: "Daily competitive Duo scrims hosted by Toxic Squad. Test your close quarter rifle discipline."
  },
  {
    id: 5,
    title: "Desert Storm Invitational",
    host: "Nadeflux Admin",
    isVerified: true,
    isCommunity: false,
    status: "REGISTRATION OPEN",
    badgeType: "open",
    slotsFilled: 76,
    totalSlots: 100,
    entryTag: "₹10 / PLAYER",
    entryType: "Paid",
    prize: "₹18,000 PRIZE",
    prizeNumeric: 18000,
    timing: "TUE, 27 AUG • 8:00 PM",
    gameMode: "Squad",
    map: "Miramar",
    gradient: "from-amber-950/50 via-orange-950/25 to-neutral-900/90",
    bannerGlow: "rgba(245, 158, 11, 0.18)",
    bannerAccent: "border-amber-600/30",
    accentColor: "orange",
    rules: "TPP Squad • Miramar Long range sniping & vehicle combat • 4 Match aggregate.",
    description: "Battle through the harsh Miramar desert terrain in this flagship invitational qualifier."
  },
  {
    id: 6,
    title: "Midnight Mayhem Finals",
    host: "Sagar Community",
    isVerified: false,
    isCommunity: true,
    status: "COMPLETED",
    badgeType: "completed",
    slotsFilled: 100,
    totalSlots: 100,
    entryTag: "FREE / PLAYER",
    entryType: "Free",
    prize: "₹10,000 PRIZE",
    prizeNumeric: 10000,
    timing: "COMPLETED • 18 AUG",
    isCompleted: true,
    gameMode: "Solo",
    map: "Erangel",
    gradient: "from-slate-900/60 via-zinc-900/30 to-neutral-900/90",
    bannerGlow: "rgba(100, 116, 139, 0.1)",
    bannerAccent: "border-slate-700/40",
    accentColor: "muted",
    rules: "Solo Classic Erangel • Finished tournament results certified.",
    description: "Official Finals concluded. Winner: TeamGodLike (MVP: Jonathan with 14 frags)."
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameMode, setSelectedGameMode] = useState("All");
  const [selectedMap, setSelectedMap] = useState("All");
  const [selectedEntryType, setSelectedEntryType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Starting Soon");
  
  // Interactive Modals and Toasts
  const [activeModalTourney, setActiveModalTourney] = useState(null);
  const [registeringModalTourney, setRegisteringModalTourney] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [userWallet, setUserWallet] = useState(1250);
  const [registeredTournaments, setRegisteredTournaments] = useState([]);

  // Live Countdown timer for Hero Banner
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 36, secs: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const filteredTournaments = useMemo(() => {
    return INITIAL_TOURNAMENTS.filter((item) => {
      // Search matching
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.map.toLowerCase().includes(searchQuery.toLowerCase());

      // Game Mode matching
      const matchesMode = selectedGameMode === "All" || item.gameMode.toLowerCase() === selectedGameMode.toLowerCase();

      // Map matching
      const matchesMap = selectedMap === "All" || item.map.toLowerCase() === selectedMap.toLowerCase();

      // Entry Type matching
      const matchesEntry = selectedEntryType === "All" || item.entryType.toLowerCase() === selectedEntryType.toLowerCase();

      // Status matching
      let matchesStatus = true;
      if (selectedStatus === "Upcoming") {
        matchesStatus = item.status === "UPCOMING" || item.status === "REGISTRATION OPEN";
      } else if (selectedStatus === "Live") {
        matchesStatus = item.status === "LIVE NOW";
      } else if (selectedStatus === "Completed") {
        matchesStatus = item.status === "COMPLETED";
      }

      return matchesSearch && matchesMode && matchesMap && matchesEntry && matchesStatus;
    });
  }, [searchQuery, selectedGameMode, selectedMap, selectedEntryType, selectedStatus]);

  const handleJoinTournament = (tourney) => {
    if (tourney.status === "COMPLETED") {
      triggerToast("This tournament has ended.");
      return;
    }
    if (tourney.status === "LIVE NOW") {
      triggerToast("Opening spectator livestream feed...");
      return;
    }
    setRegisteringModalTourney(tourney);
  };

  const confirmRegistration = (tourney) => {
    const entryFee = tourney.entryType === "Paid" ? 50 : 0;
    if (entryFee > userWallet) {
      triggerToast("Insufficient wallet balance! Top up in profile.");
      return;
    }
    setUserWallet(prev => prev - entryFee);
    setRegisteredTournaments(prev => [...prev, tourney.id]);
    setRegisteringModalTourney(null);
    triggerToast(`🎉 Squad successfully locked in for ${tourney.title}!`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F15] text-[#D8E2EC] font-sans selection:bg-[#FF5400] selection:text-white antialiased pb-12">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#131D2A] border border-[#FF5400]/60 text-white px-5 py-3 rounded-lg shadow-2xl shadow-orange-950/60 transition-all duration-300 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#FF5400]" />
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="sticky top-0 z-40 w-full bg-[#0E141D]/95 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                {/* Hexagonal Orange Gaming Crosshair Logo */}
                <div className="absolute inset-0 bg-[#FF5400]/20 rounded-lg rotate-45 border border-[#FF5400] group-hover:bg-[#FF5400]/30 transition-all"></div>
                <div className="relative text-[#FF5400] font-black text-xl tracking-tighter">
                  ⚡
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-widest text-white leading-none font-mono">
                  NADEFLUX
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#FF5400] font-bold uppercase -mt-0.5">
                  ESPORTS
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase">
              <a 
                href="#tournaments" 
                className="text-white hover:text-white transition-colors relative py-1 border-b-2 border-[#FF5400]"
              >
                Browse Tournaments
              </a>
              <a 
                href="#host" 
                onClick={(e) => { e.preventDefault(); triggerToast("Host Match portal will open for Tier-1 Clan Admins."); }}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Host Match
              </a>
              <a 
                href="#leaderboard" 
                onClick={(e) => { e.preventDefault(); triggerToast("Leaderboard updating after Round 2."); }}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Leaderboard
              </a>
              <a 
                href="#my-matches" 
                onClick={(e) => { e.preventDefault(); triggerToast(`You are registered in ${registeredTournaments.length} active match.`); }}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                My Matches
              </a>
            </nav>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tournaments, teams, players"
                className="w-full bg-[#131A24] border border-[#1E293B] focus:border-[#FF5400]/70 focus:outline-none focus:ring-1 focus:ring-[#FF5400] text-xs text-neutral-200 pl-10 pr-4 py-2.5 rounded-md placeholder-neutral-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Utilities (Notification, Profile & Wallet) */}
          <div className="flex items-center space-x-3.5">
            {/* Notification Bell with Badge */}
            <button 
              onClick={() => triggerToast("No new notifications at this moment.")}
              className="relative p-2 rounded-md bg-[#131A24] border border-[#1E293B] text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#1E293B] text-[10px] text-neutral-300 w-4 h-4 rounded-full flex items-center justify-center border border-neutral-700 font-mono">
                0
              </span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center bg-[#131A24] border border-[#1E293B] rounded-full p-1 pl-1.5 pr-2 gap-2 cursor-pointer hover:border-neutral-600 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-600 to-neutral-300 flex items-center justify-center text-black font-bold text-xs ring-1 ring-neutral-400">
                R
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-bold text-white tracking-wide">Rishit</span>
                  <span className="bg-[#1E293B] text-[9px] text-[#22D3EE] px-1 py-0.5 rounded font-mono font-bold tracking-tighter">
                    PRO VIP
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Balance Pill */}
            <div 
              onClick={() => triggerToast(`Current Balance: ₹${userWallet}. Instant withdrawal enabled.`)}
              className="flex items-center gap-1.5 bg-[#131A24] border border-[#1E293B] px-3 py-1.5 rounded-full text-xs font-bold text-neutral-100 hover:border-[#FF5400]/40 transition-colors cursor-pointer"
            >
              <span className="text-[#22D3EE]">🪙</span>
              <span className="font-mono text-emerald-400">₹{userWallet.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold">
          <div className="flex items-center space-x-2 text-neutral-400 font-mono text-[11px]">
            <span className="hover:text-white cursor-pointer transition-colors">HOME</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[#94A3B8]">TOURNAMENTS</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#22D3EE] bg-[#0E1B24] px-2.5 py-1 rounded-full border border-cyan-900/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
            </span>
            <span>24 TOURNAMENTS LIVE</span>
          </div>
        </div>
      </section>

      {}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-10">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#121924] via-[#101721] to-[#0D121A] border border-[#223044] overflow-hidden shadow-2xl p-6 sm:p-8 lg:p-10">
          
          {/* Subtle Topographic & Radial Radar lines backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FF5400_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-[#FF5400]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Content Area */}
            <div className="max-w-2xl space-y-4">
              {/* Yellow Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#FBBF24]/10 border border-[#F59E0B]/50 px-2.5 py-0.5 rounded text-[11px] font-extrabold text-[#FBBF24] tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                FEATURED TOURNAMENT
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans uppercase drop-shadow-md">
                  MEGA BGMI SHOWDOWN
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 font-medium mt-1">
                  The ultimate squad battle is here.
                </p>
              </div>

              {/* Tournament Property Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="bg-[#182230] border border-[#26374D] px-3 py-1 rounded text-xs font-mono font-bold text-neutral-200">
                  ₹50,000 PRIZE POOL
                </span>
                <span className="bg-[#182230] border border-[#26374D] px-3 py-1 rounded text-xs font-mono font-bold text-neutral-200 uppercase">
                  ERANGEL
                </span>
                <span className="bg-[#182230] border border-[#26374D] px-3 py-1 rounded text-xs font-mono font-bold text-neutral-200 uppercase">
                  SQUAD
                </span>
                <span className="bg-[#182230] border border-[#26374D] px-3 py-1 rounded text-xs font-mono font-bold text-[#22D3EE] uppercase">
                  FREE ENTRY
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button 
                  onClick={() => handleJoinTournament(INITIAL_TOURNAMENTS[0])}
                  className="bg-[#FF5400] hover:bg-[#ff681c] text-white font-extrabold text-xs uppercase px-6 py-3 rounded tracking-wider shadow-lg shadow-orange-950/50 flex items-center gap-2 transition-all active:scale-95"
                >
                  REGISTER SQUAD
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
                <button 
                  onClick={() => setActiveModalTourney(INITIAL_TOURNAMENTS[0])}
                  className="bg-[#17212F] hover:bg-[#1E2B3D] text-neutral-200 border border-[#28394E] hover:border-neutral-500 font-bold text-xs uppercase px-5 py-3 rounded tracking-wider transition-colors"
                >
                  VIEW TOURNAMENT DETAILS
                </button>
              </div>

              {/* Verified Organizer footer */}
              <div className="flex items-center gap-2 pt-2 text-xs text-neutral-400">
                <div className="w-4 h-4 rounded-full border border-amber-400/80 flex items-center justify-center text-amber-400 text-[9px] font-black">
                  ✓
                </div>
                <span>Nadeflux Admin</span>
                <span className="text-neutral-600">•</span>
                <span className="text-amber-400/90 font-medium flex items-center gap-1">
                  Verified Host
                </span>
              </div>
            </div>

            {/* Right Widget: Radial Timer and Progress Widget */}
            <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 bg-[#0C121A]/80 border border-[#1E293B] p-5 rounded-xl self-start lg:self-center">
              
              {/* Glowing Circular Timer */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="#1E293B"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="#FF5400"
                    strokeWidth="6"
                    strokeDasharray="390"
                    strokeDashoffset="120"
                    strokeLinecap="round"
                    fill="transparent"
                    className="filter drop-shadow-[0_0_8px_rgba(255,84,0,0.8)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] tracking-widest text-[#FBBF24] font-extrabold uppercase mb-0.5">
                    STARTS IN
                  </span>
                  <span className="text-sm font-black font-mono text-white tracking-wider">
                    {String(timeLeft.days).padStart(2, '0')}D {String(timeLeft.hours).padStart(2, '0')}H
                  </span>
                  <span className="text-xs font-bold font-mono text-neutral-300">
                    {String(timeLeft.mins).padStart(2, '0')}M {String(timeLeft.secs).padStart(2, '0')}S
                  </span>
                </div>
              </div>

              {/* Slot Indicator Progress */}
              <div className="w-full sm:w-44 flex flex-col space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-300 font-mono text-[11px]">84 / 100 SLOTS FILLED</span>
                </div>
                <div className="w-full h-2 bg-[#1B2636] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5400] rounded-full transition-all duration-500 shadow-[0_0_10px_#FF5400]"
                    style={{ width: "84%" }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">84%</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E293B]/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
              DISCOVER TOURNAMENTS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Find your next competitive drop.
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative inline-block text-left self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-[#121924] border border-[#223044] rounded px-3 py-1.5 text-xs text-neutral-200">
              <span className="text-neutral-400">Sort:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border-none text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="Starting Soon" className="bg-[#121924] text-white">Starting Soon</option>
                <option value="Prize High-Low" className="bg-[#121924] text-white">Prize: High to Low</option>
                <option value="Slots Available" className="bg-[#121924] text-white">Slots Available</option>
              </select>
            </div>
          </div>
        </div>

        {}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0E1520] border border-[#1A2637] p-3.5 rounded-xl">
          
          {/* GAME MODE Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">GAME MODE</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Solo", "Duo", "Squad"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedGameMode(mode)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    selectedGameMode === mode
                      ? "bg-[#FF5400] text-white font-bold shadow"
                      : "bg-[#141E2B] text-neutral-300 hover:text-white hover:bg-[#1B293C]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* MAP Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">MAP</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Erangel", "Miramar", "Sanhok"].map((mapName) => (
                <button
                  key={mapName}
                  onClick={() => setSelectedMap(mapName)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    selectedMap === mapName
                      ? "bg-[#FF5400] text-white font-bold shadow"
                      : "bg-[#141E2B] text-neutral-300 hover:text-white hover:bg-[#1B293C]"
                  }`}
                >
                  {mapName}
                </button>
              ))}
            </div>
          </div>

          {/* ENTRY TYPE Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">ENTRY TYPE</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Free", "Paid"].map((entry) => (
                <button
                  key={entry}
                  onClick={() => setSelectedEntryType(entry)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    selectedEntryType === entry
                      ? "bg-[#FF5400] text-white font-bold shadow"
                      : "bg-[#141E2B] text-neutral-300 hover:text-white hover:bg-[#1B293C]"
                  }`}
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">STATUS</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Upcoming", "Live", "Completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    selectedStatus === st
                      ? "bg-[#FF5400] text-white font-bold shadow"
                      : "bg-[#141E2B] text-neutral-300 hover:text-white hover:bg-[#1B293C]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {filteredTournaments.length === 0 ? (
          <div className="bg-[#0E1520] border border-[#1A2637] rounded-xl p-12 text-center my-6">
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Tournaments Match Your Criteria</h3>
            <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
              Try adjusting the map, game mode, or clearing search query filters to browse all drops.
            </p>
            <button 
              onClick={() => {
                setSelectedGameMode("All");
                setSelectedMap("All");
                setSelectedEntryType("All");
                setSelectedStatus("All");
                setSearchQuery("");
              }}
              className="mt-4 bg-[#FF5400] text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((card) => {
              const isCardRegistered = registeredTournaments.includes(card.id);
              const percentage = Math.round((card.slotsFilled / card.totalSlots) * 100);

              return (
                <div
                  key={card.id}
                  className="group relative flex flex-col justify-between rounded-xl bg-[#0E1520] border border-[#1F2C3E] hover:border-[#2D4059] transition-all duration-300 overflow-hidden shadow-xl"
                >
                  {/* Card Header Top Banner Graphic with Map Gradient */}
                  <div className={`h-24 w-full bg-gradient-to-b ${card.gradient} relative p-4 flex items-start justify-between border-b ${card.bannerAccent}`}>
                    
                    {/* Badge on Top Left */}
                    <div>
                      {card.status === "REGISTRATION OPEN" && (
                        <span className="bg-[#EAB308] text-[#0B0F15] text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
                          REGISTRATION OPEN
                        </span>
                      )}
                      {card.status === "LIVE NOW" && (
                        <span className="bg-[#06B6D4] text-[#0B0F15] text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                          LIVE NOW
                        </span>
                      )}
                      {card.status === "UPCOMING" && (
                        <span className="bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
                          UPCOMING
                        </span>
                      )}
                      {card.status === "COMPLETED" && (
                        <span className="bg-[#334155] text-neutral-300 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    {/* Slot Count Header Pill */}
                    <div className="text-[11px] font-mono font-bold text-neutral-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      {card.slotsFilled}/{card.totalSlots} SLOTS
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div>
                      {/* Title */}
                      <h3 className="text-base font-extrabold text-white group-hover:text-[#FF5400] transition-colors leading-snug">
                        {card.title}
                      </h3>

                      {/* Organizer info */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-400">
                        <span>{card.host}</span>
                        {card.isVerified && (
                          <span className="text-amber-400 text-xs font-bold" title="Verified Host">
                            ✓
                          </span>
                        )}
                        {card.isCommunity && (
                          <span className="bg-[#1C2C3F] text-[#38BDF8] text-[9px] font-mono px-1.5 py-0.2 rounded">
                            Community Host
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta info tags (Entry fee & Prize) */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="bg-[#141E2B] border border-[#202E42] text-[11px] font-mono font-bold text-neutral-300 px-2 py-1 rounded">
                        {card.entryTag}
                      </span>
                      <span className={`text-sm font-black font-mono tracking-tight ${
                        card.accentColor === "cyan" 
                          ? "text-[#06B6D4]" 
                          : card.accentColor === "muted"
                          ? "text-neutral-400 line-through"
                          : "text-[#F59E0B]"
                      }`}>
                        {card.prize}
                      </span>
                    </div>

                    {/* Timing & Map details */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                      {card.status === "LIVE NOW" ? (
                        <div className="flex items-center gap-1.5 text-[#22D3EE] font-bold">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>{card.timing}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{card.timing}</span>
                        </div>
                      )}
                    </div>

                    {/* Slots progress bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                        <span className="uppercase">{card.map} • {card.gameMode}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1B2636] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            card.status === "LIVE NOW" 
                              ? "bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]" 
                              : card.status === "COMPLETED"
                              ? "bg-neutral-600"
                              : "bg-[#FF5400] shadow-[0_0_8px_#FF5400]"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      {card.status === "COMPLETED" ? (
                        <button 
                          onClick={() => setActiveModalTourney(card)}
                          className="w-full bg-[#1B2636] hover:bg-[#243347] text-neutral-300 font-bold text-xs uppercase py-2.5 rounded tracking-wider transition-colors"
                        >
                          VIEW RESULTS
                        </button>
                      ) : card.status === "LIVE NOW" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => triggerToast("Launching BGMI live spectator client...")}
                            className="bg-[#06B6D4] hover:bg-[#0891b2] text-black font-extrabold text-xs uppercase py-2.5 rounded tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/40"
                          >
                            <Tv className="w-3.5 h-3.5" />
                            WATCH LIVE
                          </button>
                          <button 
                            onClick={() => setActiveModalTourney(card)}
                            className="bg-[#141E2B] hover:bg-[#1C2C3F] border border-[#233348] text-neutral-200 font-bold text-xs uppercase py-2.5 rounded tracking-wider"
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            disabled={isCardRegistered}
                            onClick={() => handleJoinTournament(card)}
                            className={`${
                              isCardRegistered 
                                ? "bg-emerald-600/30 border border-emerald-500 text-emerald-300 cursor-default" 
                                : "bg-[#FF5400] hover:bg-[#e04a00] text-white shadow-lg shadow-orange-950/40"
                            } font-extrabold text-xs uppercase py-2.5 rounded tracking-wider transition-all`}
                          >
                            {isCardRegistered ? "REGISTERED ✓" : "JOIN TOURNAMENT"}
                          </button>
                          <button 
                            onClick={() => setActiveModalTourney(card)}
                            className="bg-[#141E2B] hover:bg-[#1C2C3F] border border-[#233348] text-neutral-200 font-bold text-xs uppercase py-2.5 rounded tracking-wider transition-colors"
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {}
      {activeModalTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0E1520] border border-[#223044] rounded-2xl p-6 shadow-2xl text-left">
            <button 
              onClick={() => setActiveModalTourney(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-md bg-[#16202E]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#FF5400]/20 text-[#FF5400] border border-[#FF5400]/40">
                {activeModalTourney.gameMode} • {activeModalTourney.map}
              </span>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {activeModalTourney.status}
              </span>
            </div>

            <h3 className="text-xl font-black text-white">{activeModalTourney.title}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Host: {activeModalTourney.host}</p>

            <div className="my-4 p-4 rounded-xl bg-[#131C29] border border-[#1E2B3C] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Prize Pool:</span>
                <span className="text-[#F59E0B] font-mono font-bold">{activeModalTourney.prize}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Entry Fee:</span>
                <span className="text-white font-mono font-bold">{activeModalTourney.entryTag}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Match Schedule:</span>
                <span className="text-white font-mono">{activeModalTourney.timing}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Lobby Slots:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeModalTourney.slotsFilled} / {activeModalTourney.totalSlots} Booked
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-300 space-y-1 mb-4">
              <p className="font-bold text-neutral-200">Official Tournament Rules:</p>
              <p className="text-neutral-400 bg-[#0B0F16] p-2.5 rounded border border-[#1A2637] font-mono text-[11px]">
                {activeModalTourney.rules}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeModalTourney.status !== "COMPLETED" && (
                <button
                  onClick={() => {
                    const t = activeModalTourney;
                    setActiveModalTourney(null);
                    handleJoinTournament(t);
                  }}
                  className="flex-1 bg-[#FF5400] hover:bg-[#e04a00] text-white font-extrabold text-xs uppercase py-3 rounded tracking-wider shadow-lg"
                >
                  Proceed to Register
                </button>
              )}
              <button
                onClick={() => setActiveModalTourney(null)}
                className="flex-1 bg-[#1A2637] hover:bg-[#25354D] text-white font-bold text-xs uppercase py-3 rounded tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {registeringModalTourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0E1520] border border-[#223044] rounded-2xl p-6 shadow-2xl text-left">
            <button 
              onClick={() => setRegisteringModalTourney(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-md bg-[#16202E]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white uppercase">Register Squad Slot</h3>
            <p className="text-xs text-neutral-400 mt-1">{registeringModalTourney.title}</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase block mb-1">
                  Squad Name / Clan Tag
                </label>
                <input 
                  type="text" 
                  defaultValue="Team SouL Esports"
                  className="w-full bg-[#131C29] border border-[#1E2B3C] text-xs text-white p-2.5 rounded focus:outline-none focus:border-[#FF5400]" 
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 uppercase block mb-1">
                  Leader BGMI In-Game Character ID (10 digits)
                </label>
                <input 
                  type="text" 
                  defaultValue="5129849310"
                  className="w-full bg-[#131C29] border border-[#1E2B3C] text-xs text-white p-2.5 rounded font-mono focus:outline-none focus:border-[#FF5400]" 
                />
              </div>

              <div className="bg-[#131C29] p-3 rounded-lg border border-[#1E2B3C] flex items-center justify-between text-xs">
                <span className="text-neutral-400">Entry Deduction:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {registeringModalTourney.entryType === "Paid" ? "₹50 from Wallet" : "FREE ENTRY"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => confirmRegistration(registeringModalTourney)}
                className="flex-1 bg-[#FF5400] hover:bg-[#e04a00] text-white font-extrabold text-xs uppercase py-3 rounded tracking-wider shadow-lg shadow-orange-950/60"
              >
                Confirm & Lock Slot
              </button>
              <button
                onClick={() => setRegisteringModalTourney(null)}
                className="bg-[#1A2637] hover:bg-[#25354D] text-neutral-300 font-bold text-xs uppercase px-4 py-3 rounded tracking-wider"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <footer className="border-t border-[#1E293B] bg-[#0A0D13] pt-12 pb-8 text-neutral-400 text-xs">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
            
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#FF5400]/20 border border-[#FF5400] flex items-center justify-center text-[#FF5400] text-xs font-bold">
                  ⚡
                </div>
                <span className="text-sm font-black tracking-widest text-white font-mono">
                  NADEFLUX
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
                Built for fair play. Built for the drop.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div>
              <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-3">
                PLATFORM
              </h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Host a Match</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Column 3: Rules & Policies */}
            <div>
              <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-3">
                RULES
              </h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Tournament Rules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fair Play Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Anti-Cheat Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Follow The Drop (Social Icons) */}
            <div>
              <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-3">
                FOLLOW THE DROP
              </h4>
              <div className="flex items-center space-x-2">
                {/* Discord / Community Box */}
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#131A24] border border-[#1E293B] hover:border-[#FF5400] hover:text-white flex items-center justify-center transition-colors"
                  title="Discord"
                >
                  <Gamepad2 className="w-4 h-4" />
                </a>
                {/* YouTube Box */}
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#131A24] border border-[#1E293B] hover:border-[#FF5400] hover:text-white flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <Tv className="w-4 h-4" />
                </a>
                {/* Instagram / Social Box */}
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#131A24] border border-[#1E293B] hover:border-[#FF5400] hover:text-white flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                {/* Support Box */}
                <a 
                  href="#" 
                  className="w-9 h-9 rounded bg-[#131A24] border border-[#1E293B] hover:border-[#FF5400] hover:text-white flex items-center justify-center transition-colors"
                  title="Support"
                >
                  <ShieldCheck className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright & Subtext */}
          <div className="pt-6 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
            <div>
              © 2024 Nadeflux Esports. All rights reserved.
            </div>
            <div>
              Made for the Indian BGMI community.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}