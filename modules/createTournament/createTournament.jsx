import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Minus, 
  Plus, 
  Bold, 
  Italic, 
  List, 
  Link2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  X, 
  Layers, 
  Trophy,
  Gamepad2,
  Sliders
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [activeNav, setActiveNav] = useState('Host Match');
  const [walletBalance] = useState(1250);

  // Stepper state
  const [currentStep, setCurrentStep] = useState(2); // Step 2 is active in screenshot

  // Step 1: Match Identity State
  const [tournamentTitle, setTournamentTitle] = useState('Daily Erangel Squad Clash #12');
  const [bannerPreview, setBannerPreview] = useState(null);
  const [startDate, setStartDate] = useState('18 MAR 2024');
  const [matchTime, setMatchTime] = useState('09:00 PM');
  const [rulesText, setRulesText] = useState('• Simulator bans strictly enforced\n• Minimum account level: 35+');

  // Step 2: Game Config & Capacity
  const [gameMode, setGameMode] = useState('SQUAD'); // 'SQUAD', 'DUO', 'SOLO'
  const [selectedMap, setSelectedMap] = useState('ERANGEL'); // 'ERANGEL', 'MIRAMAR', 'SANHOK'
  const [slotsCount, setSlotsCount] = useState(25);
  const [entryType, setEntryType] = useState('PAID'); // 'FREE', 'PAID'
  const [entryFee, setEntryFee] = useState(200);
  const [prizePreset, setPrizePreset] = useState('STANDARD'); // 'STANDARD', 'WINNER_TAKES_ALL', 'CUSTOM'

  // Step 3: Legal & Modals
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const financials = useMemo(() => {
    const isPaid = entryType === 'PAID';
    const fee = isPaid ? (Number(entryFee) || 0) : 0;
    const totalSlots = Number(slotsCount) || 0;
    
    // Gross collection
    const gross = totalSlots * fee;
    // Platform fee 10%
    const platformFee = Math.round(gross * 0.10);
    // Net Prize pool 90% (or 0 if free)
    const netPrize = gross - platformFee;
    // Host anti-cheat security deposit (fixed ₹250)
    const securityDeposit = 250;

    // Prize distributions
    let firstPlace = 0;
    let secondPlace = 0;
    let thirdPlace = 0;

    if (prizePreset === 'STANDARD') {
      firstPlace = Math.round(netPrize * 0.50);
      secondPlace = Math.round(netPrize * 0.30);
      thirdPlace = Math.round(netPrize * 0.20);
    } else if (prizePreset === 'WINNER_TAKES_ALL') {
      firstPlace = netPrize;
      secondPlace = 0;
      thirdPlace = 0;
    } else {
      firstPlace = Math.round(netPrize * 0.50);
      secondPlace = Math.round(netPrize * 0.30);
      thirdPlace = Math.round(netPrize * 0.20);
    }

    return {
      gross,
      platformFee,
      netPrize,
      securityDeposit,
      firstPlace,
      secondPlace,
      thirdPlace,
    };
  }, [entryType, entryFee, slotsCount, prizePreset]);

  const handleGameModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'SQUAD') setSlotsCount(25);
    else if (mode === 'DUO') setSlotsCount(50);
    else if (mode === 'SOLO') setSlotsCount(100);
  };

  const handleSlotChange = (delta) => {
    setSlotsCount((prev) => {
      const minSlots = 2;
      const maxSlots = gameMode === 'SOLO' ? 100 : gameMode === 'DUO' ? 50 : 25;
      const next = prev + delta;
      if (next < minSlots) return minSlots;
      if (next > maxSlots) return maxSlots;
      return next;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        triggerToast('File exceeds 10MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result);
        triggerToast('Banner image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (!tournamentTitle.trim()) {
      triggerToast('Please provide a tournament title.');
      return;
    }
    if (!legalAccepted) {
      triggerToast('Please accept the Host Legal Agreement to continue.');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleFinalPublish = () => {
    setIsReviewModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070B11] text-[#94a3b8] font-sans selection:bg-[#F59E0B] selection:text-black antialiased relative pb-28">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 bg-[#0C121B] border border-[#F59E0B]/80 text-white px-4 py-3 rounded-lg shadow-2xl animate-fade-in shadow-amber-950/40">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="sticky top-0 z-40 w-full bg-[#080D15]/95 backdrop-blur-md border-b border-[#131B27]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Nav Tabs */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => triggerToast('Nadeflux Esports Home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              {/* Circular Target / Crosshair Logo */}
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#F59E0B] transition-transform group-hover:scale-105" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M18 2V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M18 28V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M28 18H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M2 18H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="3.2" fill="currentColor" />
                </svg>
              </div>
              <span className="text-sm tracking-[0.16em] font-black text-white font-mono uppercase">
                NADEFLUX
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-[12px] font-medium tracking-wide">
              {['Browse Tournaments', 'Host Match', 'Leaderboard', 'My Matches'].map((item) => {
                const isActive = activeNav === item;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveNav(item);
                      triggerToast(`Switched view to ${item}`);
                    }}
                    className={`py-1 transition-colors ${
                      isActive 
                        ? 'text-white font-bold border-b-2 border-[#F59E0B] pb-0.5' 
                        : 'text-[#64748b] hover:text-[#cbd5e1]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Bar & User / Wallet Chip */}
          <div className="flex items-center gap-4">
            
            {/* Search Input Box */}
            <div className="relative hidden md:block w-72 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tournaments, teams, players"
                className="w-full bg-[#0B1019] border border-[#162132] focus:border-[#F59E0B]/50 focus:outline-none text-[11px] text-neutral-200 pl-8 pr-3 py-1.5 rounded-md placeholder-neutral-500 font-sans"
              />
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => triggerToast('You have no new notifications.')}
              className="relative p-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
            </button>

            {/* User Pill RS */}
            <div 
              onClick={() => triggerToast('User profile: Rishik')}
              className="flex items-center bg-[#0B1019] border border-[#162132] rounded-full py-0.5 pl-0.5 pr-2.5 gap-2 cursor-pointer hover:border-[#223149] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#e2e8f0] text-black font-black text-[10px] flex items-center justify-center font-mono">
                RS
              </div>
              <span className="text-[11px] font-semibold text-white">Rishik</span>
            </div>

            {/* Cyan Wallet Chip */}
            <div 
              onClick={() => triggerToast(`Wallet balance: ₹${walletBalance}`)}
              className="flex items-center gap-1.5 bg-[#0B1019] border border-[#162132] px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[#22D3EE] text-[11px]">🪙</span>
              <span className="font-mono text-[#22D3EE] font-bold text-[11px]">
                ₹{walletBalance.toLocaleString()}
              </span>
            </div>

          </div>
        </div>
      </header>

      {}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6">
        {/* Breadcrumb line */}
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase mb-3">
          <span className="text-[#64748b] hover:text-white cursor-pointer" onClick={() => triggerToast('Home')}>
            HOME
          </span>
          <span className="text-[#334155]">/</span>
          <span className="text-[#64748b] hover:text-white cursor-pointer" onClick={() => triggerToast('Tournaments')}>
            TOURNAMENTS
          </span>
          <span className="text-[#334155]">/</span>
          <span className="text-white font-bold">
            CREATE TOURNAMENT
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-sans">
            CREATE & HOST CUSTOM BGMI TOURNAMENT
          </h1>
          <p className="text-xs text-[#64748b] font-normal">
            Configure match rules, automated room slots, and entry fees.
          </p>
        </div>
      </div>

      {}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-[#090E17] border border-[#131B27] rounded-xl px-6 py-4 flex items-center justify-between">
          
          {/* Step 1: Basic Details (Completed with Green Check) */}
          <div 
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#10B981] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-white uppercase">
              BASIC DETAILS
            </span>
          </div>

          {/* Line 1 -> 2 (Amber) */}
          <div className="flex-1 mx-4 sm:mx-8 h-[2px] bg-[#F59E0B]/70 rounded-full hidden sm:block"></div>

          {/* Step 2: Match Engine & Prizes (Active glowing amber) */}
          <div 
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-black font-black text-[11px] flex items-center justify-center font-mono shadow-md shadow-amber-500/30">
              02
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#F59E0B] uppercase">
              MATCH ENGINE & PRIZES
            </span>
          </div>

          {/* Line 2 -> 3 (Muted) */}
          <div className="flex-1 mx-4 sm:mx-8 h-[2px] bg-[#1A2536] rounded-full hidden sm:block"></div>

          {/* Step 3: Platform Fees & Payouts */}
          <div 
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-3 cursor-pointer group text-[#475569] hover:text-[#94a3b8]"
          >
            <div className="w-6 h-6 rounded-full border border-[#24334A] text-[#475569] font-bold text-[11px] flex items-center justify-center font-mono">
              03
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
              PLATFORM FEES & PAYOUTS
            </span>
          </div>

        </div>
      </div>

      {}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN: FORM CARDS (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD 1: MATCH IDENTITY (STEP 1 OF 3) */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#121B29] pb-3">
              <h2 className="text-xs font-mono font-black uppercase tracking-widest text-white">
                MATCH IDENTITY
              </h2>
              <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
                STEP 1 OF 3
              </span>
            </div>

            {/* Tournament Title */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                TOURNAMENT TITLE
              </label>
              <input
                type="text"
                value={tournamentTitle}
                onChange={(e) => setTournamentTitle(e.target.value)}
                placeholder="Enter tournament title"
                className="w-full bg-[#0E1522] border border-[#1A2536] focus:border-[#F59E0B] text-neutral-100 px-3.5 py-2.5 rounded text-xs font-mono font-medium focus:outline-none transition-colors"
              />
            </div>

            {/* Tournament Banner Upload Area */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                TOURNAMENT BANNER
              </label>
              
              <div className="relative border border-dashed border-[#1E2B3E] hover:border-[#F59E0B]/50 bg-[#0A1019] rounded-lg p-6 text-center transition-all group cursor-pointer overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {bannerPreview ? (
                  <div className="relative h-32 w-full flex items-center justify-center">
                    <img 
                      src={bannerPreview} 
                      alt="Banner Preview" 
                      className="h-full w-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white font-mono font-bold bg-[#F59E0B] text-black px-3 py-1 rounded">
                        Change Banner
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-9 h-9 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <p className="text-xs text-neutral-300 font-medium">
                      Drag & drop your banner here or <span className="text-[#F59E0B] underline font-semibold">browse files</span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#64748b] font-mono">
                      <span>1920 x 1080 recommended</span>
                      <span>|</span>
                      <span className="bg-[#101824] px-1.5 py-0.5 rounded border border-[#1A2536]">
                        Max 10MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Time Pickers in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                  START DATE
                </label>
                <div className="relative flex items-center bg-[#0E1522] border border-[#1A2536] rounded px-3 py-2 text-xs font-mono text-neutral-100">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-[#64748b] ml-2 shrink-0" />
                </div>
              </div>

              {/* Match Time */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                  MATCH TIME (IST)
                </label>
                <div className="relative flex items-center bg-[#0E1522] border border-[#1A2536] rounded px-3 py-2 text-xs font-mono text-neutral-100">
                  <input
                    type="text"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <Clock className="w-4 h-4 text-[#64748b] ml-2 shrink-0" />
                </div>
                <p className="text-[10px] font-mono text-[#F59E0B] pt-0.5">
                  Room ID & Pass shared 15 mins prior
                </p>
              </div>
            </div>

            {/* Rules & Additional Instructions */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                RULES & ADDITIONAL INSTRUCTIONS
              </label>
              
              <div className="border border-[#1A2536] rounded-md bg-[#0E1522] overflow-hidden focus-within:border-[#F59E0B]">
                {/* Mini Formatting Toolbar */}
                <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#141F30] bg-[#0A1019] text-[#64748b]">
                  <button 
                    type="button" 
                    onClick={() => triggerToast('Format: Bold applied')} 
                    className="p-1 hover:text-white hover:bg-[#131C28] rounded"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => triggerToast('Format: Italic applied')} 
                    className="p-1 hover:text-white hover:bg-[#131C28] rounded"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => triggerToast('Format: Bullet List')} 
                    className="p-1 hover:text-white hover:bg-[#131C28] rounded"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => triggerToast('Format: Insert Link')} 
                    className="p-1 hover:text-white hover:bg-[#131C28] rounded"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                  className="w-full bg-transparent p-3 text-xs font-mono text-neutral-200 placeholder-[#475569] focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

          </div>

          {/* CARD 2: GAME CONFIGURATION & PRIZE DISTRIBUTION */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-white border-b border-[#121B29] pb-3">
              GAME CONFIGURATION & PRIZE DISTRIBUTION
            </h2>

            {/* Game Mode Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                GAME MODE
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* Squad */}
                <div 
                  onClick={() => handleGameModeSelect('SQUAD')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    gameMode === 'SQUAD' 
                      ? 'bg-[#0E1522] border-[#F59E0B] shadow-md shadow-amber-500/10' 
                      : 'bg-[#0A1018] border-[#162132] hover:border-[#223149]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black font-mono uppercase text-white">
                      SQUAD
                    </span>
                    <span className="text-[10px] font-mono text-[#64748b]">
                      25 TEAMS
                    </span>
                  </div>
                  {/* 4 dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></div>
                  </div>
                </div>

                {/* Duo */}
                <div 
                  onClick={() => handleGameModeSelect('DUO')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    gameMode === 'DUO' 
                      ? 'bg-[#0E1522] border-[#F59E0B] shadow-md shadow-amber-500/10' 
                      : 'bg-[#0A1018] border-[#162132] hover:border-[#223149]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {gameMode === 'DUO' && <div className="w-2 h-2 rounded-full border border-[#F59E0B] bg-transparent"></div>}
                      <span className="text-xs font-black font-mono uppercase text-neutral-300">
                        DUO
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748b]">
                      50 TEAMS
                    </span>
                  </div>
                  {/* 2 dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#334155]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#334155]"></div>
                  </div>
                </div>

                {/* Solo */}
                <div 
                  onClick={() => handleGameModeSelect('SOLO')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    gameMode === 'SOLO' 
                      ? 'bg-[#0E1522] border-[#F59E0B] shadow-md shadow-amber-500/10' 
                      : 'bg-[#0A1018] border-[#162132] hover:border-[#223149]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black font-mono uppercase text-neutral-300">
                      SOLO
                    </span>
                    <span className="text-[10px] font-mono text-[#64748b]">
                      100 PLAYERS
                    </span>
                  </div>
                  {/* 1 dot */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#334155]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                MAP SELECTOR
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'ERANGEL', color: '#06B6D4', stroke: '#06B6D4' },
                  { name: 'MIRAMAR', color: '#38BDF8', stroke: '#38BDF8' },
                  { name: 'SANHOK', color: '#10B981', stroke: '#10B981' }
                ].map((mapItem) => {
                  const isSelected = selectedMap === mapItem.name;
                  return (
                    <div
                      key={mapItem.name}
                      onClick={() => setSelectedMap(mapItem.name)}
                      className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between h-20 transition-all ${
                        isSelected 
                          ? 'border-[#06B6D4] bg-[#0E1724]' 
                          : 'border-[#15202E] bg-[#0A1018] hover:border-[#213045]'
                      }`}
                    >
                      {/* Geometric tactical grid icon */}
                      <div className="w-8 h-8 rounded bg-[#06111D] border border-[#16293D] flex items-center justify-center relative overflow-hidden">
                        <svg className="w-6 h-6 text-cyan-500/80" viewBox="0 0 24 24" fill="none">
                          <line x1="2" y1="2" x2="22" y2="22" stroke={mapItem.stroke} strokeWidth="1.5" />
                          <line x1="22" y1="2" x2="2" y2="22" stroke={mapItem.stroke} strokeWidth="0.8" strokeOpacity="0.4" />
                          <rect x="5" y="5" width="14" height="14" stroke={mapItem.stroke} strokeWidth="0.7" strokeDasharray="2 2"/>
                        </svg>
                      </div>
                      <span className={`text-[11px] font-mono font-black uppercase tracking-wider ${
                        isSelected ? 'text-white' : 'text-[#64748b]'
                      }`}>
                        {mapItem.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capacity Controls & Entry Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Left: Total Teams / Slots Counter & Slider */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                  CAPACITY CONTROLS
                </label>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-white uppercase">
                    TOTAL TEAMS / SLOTS
                  </span>
                  
                  {/* Stepper buttons [- / +] */}
                  <div className="flex items-center gap-1.5 bg-[#0E1522] border border-[#1A2536] rounded p-1">
                    <button 
                      type="button"
                      onClick={() => handleSlotChange(-1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#151F2E] hover:bg-[#202E42] text-white rounded transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-mono font-bold text-xs text-white">
                      {slotsCount}
                    </span>
                    <button 
                      type="button"
                      onClick={() => handleSlotChange(1)}
                      className="w-6 h-6 flex items-center justify-center bg-[#151F2E] hover:bg-[#202E42] text-white rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="2"
                    max={gameMode === 'SOLO' ? 100 : gameMode === 'DUO' ? 50 : 25}
                    value={slotsCount}
                    onChange={(e) => setSlotsCount(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-[#162232] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#64748b] pt-1">
                    <span>{slotsCount} squads</span>
                    <span>Max {gameMode === 'SOLO' ? 100 : gameMode === 'DUO' ? 50 : 25}</span>
                  </div>
                </div>
              </div>

              {/* Right: Entry Fee & Type Toggle */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                  ENTRY FEE
                </label>

                {/* Free vs Paid Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryType('FREE')}
                    className={`py-2 px-2 text-center text-xs font-mono font-black uppercase rounded transition-all ${
                      entryType === 'FREE'
                        ? 'bg-[#152233] text-white border border-[#2E4362]'
                        : 'bg-[#0A1018] text-[#64748b] border border-[#15202E]'
                    }`}
                  >
                    FREE TOURNAMENT
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryType('PAID')}
                    className={`py-2 px-2 text-center text-xs font-mono font-black uppercase rounded transition-all ${
                      entryType === 'PAID'
                        ? 'bg-[#152233] text-white border border-[#F59E0B]'
                        : 'bg-[#0A1018] text-[#64748b] border border-[#15202E]'
                    }`}
                  >
                    PAID TOURNAMENT
                  </button>
                </div>

                {/* Entry fee per slot input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                    <span>ENTRY FEE PER SLOT (₹)</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      disabled={entryType === 'FREE'}
                      value={entryType === 'FREE' ? 0 : entryFee}
                      onChange={(e) => setEntryFee(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-[#0E1522] border border-[#1A2536] focus:border-[#F59E0B] text-neutral-100 px-3 py-2 rounded text-xs font-mono font-bold focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-[#64748b]">
                    Minimum ₹50 per player
                  </p>
                </div>
              </div>

            </div>

            {/* Prize Split Presets */}
            <div className="space-y-3 pt-3 border-t border-[#121B29]">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                PRIZE SPLIT PRESETS
              </label>

              {/* Radio 1: Standard Top 3 */}
              <div 
                onClick={() => setPrizePreset('STANDARD')}
                className="flex items-center justify-between cursor-pointer group py-1"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    prizePreset === 'STANDARD' ? 'border-[#F59E0B]' : 'border-[#273850]'
                  }`}>
                    {prizePreset === 'STANDARD' && <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>}
                  </div>
                  <span className="text-xs font-mono font-black uppercase text-white">
                    STANDARD TOP 3
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b]">
                  1ST 50% / 2ND 30% / 3RD 20%
                </span>
              </div>

              {/* Radio 2: Winner Takes All */}
              <div 
                onClick={() => setPrizePreset('WINNER_TAKES_ALL')}
                className="flex items-center justify-between cursor-pointer group py-1"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    prizePreset === 'WINNER_TAKES_ALL' ? 'border-[#F59E0B]' : 'border-[#273850]'
                  }`}>
                    {prizePreset === 'WINNER_TAKES_ALL' && <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>}
                  </div>
                  <span className="text-xs font-mono font-black uppercase text-neutral-300">
                    WINNER TAKES ALL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b]">
                  1ST 100%
                </span>
              </div>

              {/* Radio 3: Custom Distribution Table */}
              <div 
                onClick={() => setPrizePreset('CUSTOM')}
                className="flex items-center gap-2.5 cursor-pointer group py-1"
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  prizePreset === 'CUSTOM' ? 'border-[#F59E0B]' : 'border-[#273850]'
                }`}>
                  {prizePreset === 'CUSTOM' && <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>}
                </div>
                <span className="text-xs font-mono font-black uppercase text-neutral-300">
                  CUSTOM DISTRIBUTION TABLE
                </span>
              </div>

              {/* 3 Calculated Rupee Value Cards */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-[#0B111B] border border-[#172335] rounded-lg p-2.5 text-center">
                  <span className="text-[10px] font-mono text-[#64748b] block mb-0.5">
                    1st Place: {prizePreset === 'WINNER_TAKES_ALL' ? '100%' : '50%'}
                  </span>
                  <span className="text-xs font-mono font-black text-white">
                    ₹{financials.firstPlace.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#0B111B] border border-[#172335] rounded-lg p-2.5 text-center">
                  <span className="text-[10px] font-mono text-[#64748b] block mb-0.5">
                    2nd Place: {prizePreset === 'WINNER_TAKES_ALL' ? '0%' : '30%'}
                  </span>
                  <span className="text-xs font-mono font-black text-white">
                    ₹{financials.secondPlace.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#0B111B] border border-[#172335] rounded-lg p-2.5 text-center">
                  <span className="text-[10px] font-mono text-[#64748b] block mb-0.5">
                    3rd Place: {prizePreset === 'WINNER_TAKES_ALL' ? '0%' : '20%'}
                  </span>
                  <span className="text-xs font-mono font-black text-white">
                    ₹{financials.thirdPlace.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: LIVE FINANCIALS & SUMMARY (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TOURNAMENT PREVIEW CARD */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#64748b]">
              TOURNAMENT PREVIEW
            </h2>

            {/* Banner card with geometric cross-lines graphic & yellow corner ribbon */}
            <div className="relative rounded-lg overflow-hidden bg-[#07101B] border border-[#16273C] p-4 min-h-[140px] flex flex-col justify-between">
              
              {/* Cyberpunk abstract backdrop lines */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" viewBox="0 0 300 150" fill="none">
                  <line x1="30" y1="0" x2="270" y2="150" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.7" />
                  <line x1="270" y1="0" x2="30" y2="150" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.7" />
                  <circle cx="150" cy="75" r="45" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3"/>
                </svg>
              </div>

              {/* Yellow corner tag */}
              <div className="absolute top-0 right-0 w-9 h-9 overflow-hidden">
                <div className="bg-[#EAB308] transform rotate-45 translate-x-3 -translate-y-3 w-10 h-6"></div>
              </div>

              {/* Tag / Badge */}
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
                  MAPS / {gameMode}
                </span>
                <h3 className="text-sm font-black text-white uppercase font-sans mt-1 leading-snug line-clamp-2">
                  {tournamentTitle || 'DAILY ERANGEL SQUAD CLASH #12'}
                </h3>
              </div>

              {/* Date & Time pill */}
              <div className="relative z-10 pt-4">
                <p className="text-[10px] font-mono text-[#64748b]">
                  {startDate} • {matchTime} IST
                </p>
              </div>
            </div>
          </div>

          {/* PUBLISHING CHECKLIST CARD */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#64748b]">
              PUBLISHING CHECKLIST
            </h2>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Tournament title added</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Schedule configured</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Prize split selected</span>
              </div>
              
              {/* Pending or Done Legal checklist item */}
              <div className="flex items-center gap-2">
                {legalAccepted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span className="text-white font-medium">Legal agreement accepted</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span className="text-[#F59E0B] font-semibold">Legal agreement pending</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* LIVE FINANCIAL PREVIEW CARD */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 shadow-xl space-y-4">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#64748b]">
              LIVE FINANCIAL PREVIEW
            </h2>

            <div className="space-y-3 font-mono">
              
              {/* GROSS COLLECTION */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#64748b] block">
                    GROSS COLLECTION
                  </span>
                  <span className="text-[10px] text-[#475569]">
                    {slotsCount} Squads x ₹{entryType === 'FREE' ? 0 : entryFee}
                  </span>
                </div>
                <span className="text-base font-black text-[#22D3EE]">
                  ₹{financials.gross.toLocaleString()}
                </span>
              </div>

              {/* PLATFORM FACILITATION FEE */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#64748b] block">
                    PLATFORM FACILITATION FEE (10%)
                  </span>
                  <span className="text-[10px] text-[#475569]">
                    Server + automated scoring
                  </span>
                </div>
                <span className="text-sm font-bold text-[#F59E0B]">
                  -₹{financials.platformFee.toLocaleString()}
                </span>
              </div>

              {/* NET TOTAL PRIZE POOL */}
              <div className="flex items-start justify-between pt-1 border-t border-[#121B29]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-white block">
                    NET TOTAL PRIZE POOL
                  </span>
                </div>
                <span className="text-base font-black text-[#10B981]">
                  ₹{financials.netPrize.toLocaleString()}
                </span>
              </div>

              {/* HOST ANTI-CHEAT SECURITY DEPOSIT */}
              <div className="flex items-start justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase text-[#64748b] block">
                    HOST ANTI-CHEAT SECURITY DEPOSIT
                  </span>
                  <span className="text-[10px] text-[#475569]">
                    Refundable after match conclusion
                  </span>
                </div>
                <span className="text-xs font-bold text-white">
                  ₹{financials.securityDeposit.toLocaleString()}
                </span>
              </div>

            </div>
          </div>

          {/* HOST LEGAL AGREEMENT CARD */}
          <div className="bg-[#080D15] border border-[#141F30] rounded-xl p-5 shadow-xl space-y-3">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#64748b]">
              HOST LEGAL AGREEMENT
            </h2>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-[#0A1018] border-[#1F2C40] text-[#F59E0B] focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] text-[#94a3b8] group-hover:text-neutral-200 transition-colors leading-relaxed">
                I agree to the Nadeflux Fair Play Policy, Anti-Cheat Rules, and Match Result Upload SLA.
              </span>
            </label>
          </div>

        </div>

      </main>

      {}
      <footer className="fixed bottom-0 inset-x-0 bg-[#070C14]/95 backdrop-blur-md border-t border-[#131B27] py-3.5 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Buttons: CANCEL / DISCARD & SAVE AS DRAFT */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => triggerToast('Tournament draft discarded.')}
              className="text-xs font-mono font-bold uppercase text-[#EF4444] hover:text-red-400 transition-colors"
            >
              CANCEL / DISCARD
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Tournament configuration saved as draft.')}
              className="px-3.5 py-2 bg-[#0E1522] border border-[#1C283A] hover:bg-[#152030] text-neutral-200 rounded text-xs font-mono font-bold uppercase transition-all"
            >
              SAVE AS DRAFT
            </button>
          </div>

          {/* Right Buttons: PREVIOUS STEP & NEXT STEP / REVIEW & PUBLISH */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentStep((prev) => Math.max(1, prev - 1));
                triggerToast('Navigated to previous step.');
              }}
              className="px-4 py-2.5 bg-[#0E1522] border border-[#1C283A] hover:bg-[#152030] text-neutral-300 rounded text-xs font-mono font-bold uppercase transition-all"
            >
              PREVIOUS STEP
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#d98b06] active:scale-[0.98] text-black rounded text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-950/30"
            >
              <span>NEXT STEP / REVIEW & PUBLISH</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

        </div>
      </footer>

      {}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#090E17] border border-[#1F2E45] rounded-2xl p-6 shadow-2xl text-neutral-200 space-y-5">
            
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F59E0B]">
                <ShieldCheck className="w-4 h-4" />
                <span>NADEFLUX HOST VERIFICATION</span>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Confirm Tournament Publishing
              </h3>
            </div>

            {/* Summary Details */}
            <div className="bg-[#0B111A] border border-[#162233] rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#131D2C] pb-2">
                <span className="text-[#64748b]">Tournament Name:</span>
                <span className="font-bold text-white text-right max-w-[240px] truncate">{tournamentTitle}</span>
              </div>
              <div className="flex justify-between border-b border-[#131D2C] pb-2">
                <span className="text-[#64748b]">Mode & Map:</span>
                <span className="font-bold text-[#22D3EE]">{gameMode} • {selectedMap}</span>
              </div>
              <div className="flex justify-between border-b border-[#131D2C] pb-2">
                <span className="text-[#64748b]">Slot Capacity:</span>
                <span className="font-bold text-white">{slotsCount} Squads</span>
              </div>
              <div className="flex justify-between border-b border-[#131D2C] pb-2">
                <span className="text-[#64748b]">Total Prize Pool:</span>
                <span className="font-bold text-[#10B981]">₹{financials.netPrize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Security Deposit:</span>
                <span className="font-bold text-[#F59E0B]">₹{financials.securityDeposit.toLocaleString()} (Refundable)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#64748b]">
              Your room credentials will automatically unlock 15 minutes prior to match schedule. Once published, slots will open instantly on the tournament discovery portal.
            </p>

            {/* Confirm Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2.5 bg-[#0E1522] border border-[#1C283A] text-neutral-300 rounded text-xs font-mono font-bold uppercase hover:bg-[#152030]"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleFinalPublish}
                className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#d98b06] text-black rounded text-xs font-mono font-black uppercase tracking-wider transition-all"
              >
                Confirm & Publish Tournament
              </button>
            </div>

          </div>
        </div>
      )}

      {}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#090E17] border border-[#10B981]/50 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase font-sans">
                Tournament Published!
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                {tournamentTitle} is now live on the Nadeflux discovery portal.
              </p>
            </div>

            <div className="bg-[#0B1019] border border-[#162132] rounded-lg p-3 text-xs font-mono flex justify-between items-center">
              <span className="text-[#64748b]">Automated Room Slot ID:</span>
              <span className="text-[#22D3EE] font-bold">#BGMI-8842-PUB</span>
            </div>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-[#F59E0B] hover:bg-[#d98b06] text-black font-black text-xs uppercase py-3 rounded tracking-wider font-mono transition-colors"
            >
              Back to Host Dashboard
            </button>

          </div>
        </div>
      )}

    </div>
  );
}