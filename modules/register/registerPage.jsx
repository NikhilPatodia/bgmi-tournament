import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Check, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  AlertCircle,
  Copy,
  Share2,
  X,
  Trophy
} from 'lucide-react';

const MOCK_FRIENDS = [
  { username: "ViperSniper_99", ign: "ViperX", level: "LVL 42", status: "Online" },
  { username: "MortalSoul", ign: "SoulMortal", level: "LVL 65", status: "In Lobby" },
  { username: "JonathanFrag", ign: "JONATHAN", level: "LVL 71", status: "Online" },
  { username: "ScoutOP", ign: "scoutOP", level: "LVL 58", status: "Online" },
  { username: "ClutchGod7", ign: "ClutchGod", level: "LVL 50", status: "Away" },
];

export default function App() {
  const [squadName, setSquadName] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [activeSuggestionSlot, setActiveSuggestionSlot] = useState(null);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1250);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [registeredMatchDetails, setRegisteredMatchDetails] = useState(null);

  // Live countdown state
  const [countdown, setCountdown] = useState({
    days: "02",
    hours: "14",
    mins: "36",
    secs: "42"
  });

  const ENTRY_FEE = 100;
  const remainingBalance = walletBalance - ENTRY_FEE;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let s = parseInt(prev.secs, 10) - 1;
        let m = parseInt(prev.mins, 10);
        let h = parseInt(prev.hours, 10);
        let d = parseInt(prev.days, 10);

        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }

        return {
          days: String(d < 0 ? 0 : d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          mins: String(m).padStart(2, '0'),
          secs: String(s).padStart(2, '0'),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const selectFriend = (friend, slotIndex) => {
    if (slotIndex === 2) setPlayer2(friend.username);
    if (slotIndex === 3) setPlayer3(friend.username);
    if (slotIndex === 4) setPlayer4(friend.username);
    setActiveSuggestionSlot(null);
    showToast(`Invited ${friend.username} to Slot ${slotIndex}`);
  };

  const handleRegisterSquad = (e) => {
    e.preventDefault();

    if (!squadName.trim()) {
      showToast("Please enter a valid Squad Name before proceeding.");
      return;
    }

    if (!acceptedRules) {
      showToast("You must accept the tournament rules and eligibility requirements.");
      return;
    }

    if (walletBalance < ENTRY_FEE) {
      showToast("Insufficient wallet balance. Please add funds to register.");
      return;
    }

    // Process payment & confirm registration
    setWalletBalance(prev => prev - ENTRY_FEE);
    setRegisteredMatchDetails({
      squadName: squadName.trim(),
      captain: "RishiK",
      teammates: [player2 || "Auto-Invite #2", player3 || "Auto-Invite #3", player4 || "Auto-Invite #4"],
      tournament: "MEGA BGMI SHOWDOWN",
      slotNumber: "SLOT #65",
      feePaid: ENTRY_FEE,
      time: "24 AUG, 8:00 PM IST"
    });
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070B10] text-[#DCE4EE] font-sans selection:bg-[#F59E0B] selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#101722] border border-[#F59E0B]/50 text-white px-4 py-3 rounded-lg shadow-2xl shadow-orange-950/60 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="sticky top-0 z-40 w-full bg-[#090D13]/95 backdrop-blur-md border-b border-[#151D28]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer">
              {/* Golden Crosshair Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#ECA214]" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M18 2V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M18 28V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M2 18H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M28 18H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="3.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-widest text-white font-mono">
                  NADEFLUX
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#ECA214] font-extrabold uppercase mt-0.5">
                  ESPORTS
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider">
              <a 
                href="#tournaments" 
                className="text-neutral-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); showToast("Browsing all tournaments..."); }}
              >
                Browse Tournaments
              </a>
              <a 
                href="#host" 
                className="text-neutral-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); showToast("Host Match portal requires Verified Tier."); }}
              >
                Host Match
              </a>
              <a 
                href="#leaderboard" 
                className="text-neutral-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); showToast("Leaderboard updated every 24 hours."); }}
              >
                Leaderboard
              </a>
              <a 
                href="#matches" 
                className="text-neutral-400 hover:text-white transition-colors"
                onClick={(e) => { e.preventDefault(); showToast("Showing your active scrim matches."); }}
              >
                My Matches
              </a>
            </nav>
          </div>

          {/* Right Section: Search, Bell, Profile, Wallet */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tournaments, teams, players"
                className="w-full bg-[#0E1520] border border-[#1B2533] focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 pl-9 pr-3 py-2 rounded-md placeholder-neutral-500 transition-all"
              />
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => showToast("No new lobby invites.")}
              className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
            </button>

            {/* Profile Avatar Pill */}
            <div className="flex items-center bg-[#0E1520] border border-[#1A2534] rounded-full py-1 pl-1 pr-3 gap-2 cursor-pointer hover:border-[#27374D] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-500 to-neutral-200 flex items-center justify-center text-black font-extrabold text-[11px] ring-1 ring-neutral-400">
                RK
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white tracking-tight">RishiK</span>
                <span className="text-[9px] text-neutral-400 font-mono">LVL 28</span>
              </div>
            </div>

            {/* Wallet Balance Pill */}
            <div 
              onClick={() => showToast(`Available Wallet Balance: ₹${walletBalance}`)}
              className="flex items-center gap-1.5 bg-[#0E1520] border border-[#1A2534] px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:border-[#27374D] transition-colors"
            >
              {/* Linked loop chain / wallet token */}
              <span className="text-[#38BDF8] text-sm">🔗</span>
              <span className="font-mono text-[#38BDF8] font-extrabold">₹{walletBalance.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </header>

      {}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider">
          <span 
            onClick={() => showToast("Navigating to Tournaments catalog...")}
            className="text-neutral-400 hover:text-white cursor-pointer uppercase transition-colors"
          >
            TOURNAMENTS
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-extrabold uppercase tracking-wide">
            REGISTER SQUAD
          </span>
        </div>
      </div>

      {}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-7">
        <div className="relative rounded-xl bg-gradient-to-r from-[#0C121B] via-[#0A0F16] to-[#0A0E15] border border-[#1A2535] p-6 lg:p-7 shadow-2xl overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Tournament Details */}
            <div className="space-y-3">
              {/* Yellow Badge */}
              <div className="inline-block bg-[#F59E0B] text-black text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
                FEATURED TOURNAMENT
              </div>

              {/* Tournament Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase font-sans">
                  MEGA BGMI SHOWDOWN
                </h1>
                
                {/* Host Info with golden checkmark */}
                <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-400">
                  <span>Hosted by Nadeflux Admin</span>
                  <span className="text-[#ECA214] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline fill-[#ECA214] text-black" />
                    <span className="text-[11px] font-semibold">Verified</span>
                  </span>
                </div>
              </div>

              {/* Tournament Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] font-bold text-neutral-300">
                <span className="bg-[#101723] border border-[#1F2C3E] px-2.5 py-1 rounded">
                  ₹50,000 PRIZE POOL
                </span>
                <span className="bg-[#101723] border border-[#1F2C3E] px-2.5 py-1 rounded uppercase">
                  ERANGEL
                </span>
                <span className="bg-[#101723] border border-[#1F2C3E] px-2.5 py-1 rounded uppercase">
                  SQUAD
                </span>
                <span className="bg-[#101723] border border-[#1F2C3E] px-2.5 py-1 rounded uppercase text-[#38BDF8]">
                  ₹100 ENTRY FEE
                </span>
              </div>
            </div>

            {/* Right Side: Circular Countdown and Slot Progress Widget */}
            <div className="flex items-center gap-5 sm:gap-7 self-start lg:self-center">
              
              {/* Circular Countdown Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#192433"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  {/* Glowing Orange Progress Ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#FFA000"
                    strokeWidth="5"
                    strokeDasharray="339"
                    strokeDashoffset="85"
                    strokeLinecap="round"
                    fill="transparent"
                    className="filter drop-shadow-[0_0_8px_rgba(255,160,0,0.85)]"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-extrabold tracking-widest text-[#FFA000] uppercase">
                    STARTS IN
                  </span>
                  <span className="text-sm font-black font-mono text-white tracking-wider mt-0.5">
                    {countdown.days}D {countdown.hours}H
                  </span>
                  <span className="text-xs font-black font-mono text-neutral-200">
                    {countdown.mins}M
                  </span>
                </div>
              </div>

              {/* Slots Progress Box */}
              <div className="w-48 bg-[#0D141F] border border-[#1A2536] p-3.5 rounded-lg flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-300 uppercase">
                  <span>64 / 100 SLOTS FILLED</span>
                </div>
                <div className="w-full h-1.5 bg-[#172231] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFA000] rounded-full transition-all duration-500 shadow-[0_0_8px_#FFA000]"
                    style={{ width: "64%" }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">64%</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* ================= LEFT COLUMN: REGISTER YOUR SQUAD (7 cols) ================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0C121B] border border-[#192535] rounded-xl p-6 sm:p-7 shadow-xl">
              
              {/* Header Titles */}
              <div className="border-b border-[#172231] pb-4 mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  REGISTER YOUR SQUAD
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Add your squad details and invite your teammates.
                </p>
              </div>

              {/* SQUAD NAME INPUT */}
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">
                  SQUAD NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="Enter your squad name"
                    className="w-full bg-[#0E1521] border border-[#1A2637] text-white text-xs rounded-md px-3.5 py-3 focus:outline-none focus:border-[#ECA214] placeholder-neutral-500 transition-colors"
                  />
                  {squadName && (
                    <span className="absolute right-3 top-3 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                      VERIFIED SQUAD TAG
                    </span>
                  )}
                </div>
              </div>

              {/* PLAYER SLOTS HEADER */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  PLAYER SLOTS
                </label>

                {/* SLOT 1 (CAPTAIN - CURRENT USER) */}
                <div className="flex items-center justify-between bg-[#101723] border border-[#1B2738] rounded-md p-3.5">
                  <div className="flex items-center gap-3">
                    {/* Golden Captain Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#D97706] text-black font-black flex items-center justify-center text-xs ring-2 ring-[#B45309]">
                      RK
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">RishiK</span>
                      <span className="text-[10px] text-neutral-400">
                        Captain <span className="text-neutral-600">•</span> Current user
                      </span>
                    </div>
                  </div>

                  {/* Player 1 Badge */}
                  <span className="bg-[#ECA214] text-black text-[10px] font-extrabold uppercase px-2 py-1 rounded font-mono shadow-sm">
                    PLAYER 1
                  </span>
                </div>

                {/* SLOT 2 */}
                <div className="relative">
                  <div className="flex items-center bg-[#0E1521] border border-[#1A2637] rounded-md px-3.5 py-2.5 focus-within:border-[#27384E] transition-colors">
                    <UserPlus className="w-4 h-4 text-neutral-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      onFocus={() => setActiveSuggestionSlot(2)}
                      placeholder="Invite teammate 2 by username"
                      className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 ml-2">
                      {player2 && (
                        <button 
                          onClick={() => setPlayer2("")} 
                          className="text-neutral-500 hover:text-neutral-300 text-xs"
                        >
                          ✕
                        </button>
                      )}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase">PLAYER</span>
                        <span className="text-xs font-mono font-bold text-neutral-300">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion dropdown for slot 2 */}
                  {activeSuggestionSlot === 2 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#101723] border border-[#213146] rounded-md shadow-2xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-[#182333] flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                        <span>ONLINE FRIENDS</span>
                        <button onClick={() => setActiveSuggestionSlot(null)} className="text-neutral-400 hover:text-white">✕</button>
                      </div>
                      <div className="max-h-36 overflow-y-auto">
                        {MOCK_FRIENDS.map((friend) => (
                          <div 
                            key={friend.username}
                            onClick={() => selectFriend(friend, 2)}
                            className="flex items-center justify-between p-2 hover:bg-[#162131] cursor-pointer text-xs"
                          >
                            <span className="text-white font-medium">{friend.username}</span>
                            <span className="text-[10px] font-mono text-emerald-400">{friend.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SLOT 3 */}
                <div className="relative">
                  <div className="flex items-center bg-[#0E1521] border border-[#1A2637] rounded-md px-3.5 py-2.5 focus-within:border-[#27384E] transition-colors">
                    <UserPlus className="w-4 h-4 text-neutral-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={player3}
                      onChange={(e) => setPlayer3(e.target.value)}
                      onFocus={() => setActiveSuggestionSlot(3)}
                      placeholder="Invite teammate 3 by username"
                      className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 ml-2">
                      {player3 && (
                        <button 
                          onClick={() => setPlayer3("")} 
                          className="text-neutral-500 hover:text-neutral-300 text-xs"
                        >
                          ✕
                        </button>
                      )}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase">PLAYER</span>
                        <span className="text-xs font-mono font-bold text-neutral-300">3</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion dropdown for slot 3 */}
                  {activeSuggestionSlot === 3 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#101723] border border-[#213146] rounded-md shadow-2xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-[#182333] flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                        <span>ONLINE FRIENDS</span>
                        <button onClick={() => setActiveSuggestionSlot(null)} className="text-neutral-400 hover:text-white">✕</button>
                      </div>
                      <div className="max-h-36 overflow-y-auto">
                        {MOCK_FRIENDS.map((friend) => (
                          <div 
                            key={friend.username}
                            onClick={() => selectFriend(friend, 3)}
                            className="flex items-center justify-between p-2 hover:bg-[#162131] cursor-pointer text-xs"
                          >
                            <span className="text-white font-medium">{friend.username}</span>
                            <span className="text-[10px] font-mono text-emerald-400">{friend.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SLOT 4 */}
                <div className="relative">
                  <div className="flex items-center bg-[#0E1521] border border-[#1A2637] rounded-md px-3.5 py-2.5 focus-within:border-[#27384E] transition-colors">
                    <UserPlus className="w-4 h-4 text-neutral-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={player4}
                      onChange={(e) => setPlayer4(e.target.value)}
                      onFocus={() => setActiveSuggestionSlot(4)}
                      placeholder="Invite teammate 4 by username"
                      className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 ml-2">
                      {player4 && (
                        <button 
                          onClick={() => setPlayer4("")} 
                          className="text-neutral-500 hover:text-neutral-300 text-xs"
                        >
                          ✕
                        </button>
                      )}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase">PLAYER</span>
                        <span className="text-xs font-mono font-bold text-neutral-300">4</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion dropdown for slot 4 */}
                  {activeSuggestionSlot === 4 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#101723] border border-[#213146] rounded-md shadow-2xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-[#182333] flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                        <span>ONLINE FRIENDS</span>
                        <button onClick={() => setActiveSuggestionSlot(null)} className="text-neutral-400 hover:text-white">✕</button>
                      </div>
                      <div className="max-h-36 overflow-y-auto">
                        {MOCK_FRIENDS.map((friend) => (
                          <div 
                            key={friend.username}
                            onClick={() => selectFriend(friend, 4)}
                            className="flex items-center justify-between p-2 hover:bg-[#162131] cursor-pointer text-xs"
                          >
                            <span className="text-white font-medium">{friend.username}</span>
                            <span className="text-[10px] font-mono text-emerald-400">{friend.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* ================= RIGHT COLUMN: COST SUMMARY & RULES (5 cols) ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 1: COST SUMMARY */}
            <div className="bg-[#0C121B] border border-[#192535] rounded-xl p-6 sm:p-7 shadow-xl space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                COST SUMMARY
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Squad entry fee</span>
                  <span className="text-white font-mono font-bold text-sm">₹{ENTRY_FEE}</span>
                </div>

                <div className="flex justify-between items-center text-neutral-400">
                  <span>Available wallet balance</span>
                  <span className="text-[#38BDF8] font-mono font-bold text-sm">
                    ₹{walletBalance.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#172231] flex justify-between items-center">
                  <span className="text-white font-bold">Remaining balance</span>
                  <span className="text-[#ECA214] font-mono font-black text-base">
                    ₹{remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleRegisterSquad}
                  className="w-full bg-[#ECA214] hover:bg-[#d89311] active:bg-[#c2820d] text-black font-extrabold text-xs uppercase py-3.5 rounded-md tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 transition-all"
                >
                  <span>PAY ₹100 & REGISTER SQUAD</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => showToast("Registration cancelled. Returned to tournaments.")}
                  className="w-full bg-transparent hover:bg-[#131C28] text-neutral-400 hover:text-white border border-[#1D293A] font-bold text-xs uppercase py-3 rounded-md tracking-wider transition-colors"
                >
                  CANCEL / BACK
                </button>
              </div>
            </div>

            {/* CARD 2: RULES & ELIGIBILITY */}
            <div className="bg-[#0C121B] border border-[#192535] rounded-xl p-6 sm:p-7 shadow-xl space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                RULES & ELIGIBILITY
              </h3>

              {/* Bullet points with icons */}
              <div className="space-y-3.5 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#ECA214] flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Squads must have four registered players before match start.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#ECA214] flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Check in at least 15 minutes before the scheduled start time.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#ECA214] flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Fair play is required. Cheating, teaming, and exploits are prohibited.
                  </p>
                </div>
              </div>

              {/* Accept Rules Checkbox */}
              <div className="pt-3 border-t border-[#172231]">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedRules}
                    onChange={(e) => setAcceptedRules(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded bg-[#0E1521] border-[#1F2C3E] text-[#ECA214] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ECA214]"
                  />
                  <span className="text-[11px] text-neutral-400 group-hover:text-neutral-300 leading-snug">
                    I have read and accept the tournament rules and eligibility requirements.
                  </span>
                </label>
              </div>

            </div>

          </div>

        </div>
      </main>

      {}
      {isSuccessModalOpen && registeredMatchDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0C121B] border border-[#27384E] rounded-2xl p-6 sm:p-7 shadow-2xl text-left">
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-md bg-[#131A24]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#ECA214]/10 border border-[#ECA214]/40 flex items-center justify-center text-[#ECA214] mb-4">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              SQUAD REGISTERED!
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Your squad has been booked into the official match lobby.
            </p>

            <div className="my-5 p-4 rounded-xl bg-[#0F1622] border border-[#1A2637] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Tournament:</span>
                <span className="text-white font-bold">{registeredMatchDetails.tournament}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Squad Name:</span>
                <span className="text-[#ECA214] font-mono font-bold">{registeredMatchDetails.squadName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Allocated Lobby:</span>
                <span className="text-emerald-400 font-mono font-bold">{registeredMatchDetails.slotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Paid from Wallet:</span>
                <span className="text-white font-mono font-bold">₹{registeredMatchDetails.feePaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Start Time:</span>
                <span className="text-white font-mono">{registeredMatchDetails.time}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`Squad ${registeredMatchDetails.squadName} verified for ${registeredMatchDetails.tournament}!`);
                  showToast("Match lobby invite link copied to clipboard!");
                }}
                className="w-full bg-[#131C29] hover:bg-[#1A2637] border border-[#233348] text-white font-bold text-xs uppercase py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Team Pass & Lobby Link
              </button>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-[#ECA214] hover:bg-[#d89311] text-black font-extrabold text-xs uppercase py-3 rounded-md tracking-wider transition-colors"
              >
                Done / View My Matches
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}