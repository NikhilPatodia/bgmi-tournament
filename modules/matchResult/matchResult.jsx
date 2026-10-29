import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Trophy, 
  Crown, 
  Play, 
  Download, 
  ShieldCheck, 
  ChevronDown, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  ExternalLink, 
  X, 
  Check, 
  Video, 
  Layers, 
  FileText,
  Share2
} from 'lucide-react';

const STANDINGS_DATA = [
  { rank: 1, name: "NOVA VANGUARD", chicken: true, placement: 100, elims: 48, total: 148, prize: "₹25,000", isUser: false },
  { rank: 2, name: "TACTICAL CREW", chicken: false, placement: 92, elims: 34, total: 126, prize: "₹15,000", isUser: false },
  { rank: 3, name: "RAVEN X", chicken: false, placement: 83, elims: 26, total: 109, prize: "₹10,000", isUser: false },
  { rank: 4, name: "SKYLINE 4", chicken: false, placement: 78, elims: 22, total: 100, prize: "₹0", isUser: false },
  { rank: 5, name: "RISHIK WARRIORS", chicken: false, placement: 70, elims: 27, total: 97, prize: "₹0", isUser: true },
  { rank: 6, name: "DROP ZONE", chicken: false, placement: 64, elims: 25, total: 89, prize: "₹0", isUser: false },
  { rank: 7, name: "CLUTCH UNIT", chicken: false, placement: 61, elims: 21, total: 82, prize: "₹0", isUser: false },
  { rank: 8, name: "NIGHT RAIDERS", chicken: false, placement: 58, elims: 19, total: 77, prize: "₹0", isUser: false },
  { rank: 9, name: "FINAL CIRCLE", chicken: false, placement: 51, elims: 18, total: 69, prize: "₹0", isUser: false },
  { rank: 10, name: "ORANGE OPS", chicken: false, placement: 44, elims: 17, total: 61, prize: "₹0", isUser: false },
  { rank: 11, name: "HYDRA CLAN", chicken: false, placement: 40, elims: 15, total: 55, prize: "₹0", isUser: false },
  { rank: 12, name: "GODLIKE RETALIATION", chicken: false, placement: 36, elims: 14, total: 50, prize: "₹0", isUser: false },
  { rank: 13, name: "BLIND ESPORTS ACADEMY", chicken: false, placement: 32, elims: 12, total: 44, prize: "₹0", isUser: false },
  { rank: 14, name: "RECKONING FORCE", chicken: false, placement: 28, elims: 11, total: 39, prize: "₹0", isUser: false },
  { rank: 15, name: "TEAM SOUL JUNIORS", chicken: false, placement: 24, elims: 9, total: 33, prize: "₹0", isUser: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [selectedFilter, setSelectedFilter] = useState('All teams');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [replayModalOpen, setReplayModalOpen] = useState(false);
  const [auditModal, setAuditModal] = useState(null); // 'score', 'result', 'killfeed'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayedStandings = STANDINGS_DATA.filter((team) => {
    if (selectedFilter === 'Top 3') return team.rank <= 3;
    if (selectedFilter === 'Prize Winners') return team.prize !== '₹0';
    if (selectedFilter === 'My Squad') return team.isUser;
    return team.rank <= 10;
  });

  const handleExportCSV = () => {
    const headers = "Rank,Team Name,Chicken Dinner,Placement Pts,Elimination Pts,Total Match Pts,Prize Won\n";
    const rows = STANDINGS_DATA.map(t => 
      `${t.rank},"${t.name}",${t.chicken ? 'Yes' : 'No'},${t.placement},${t.elims},${t.total},"${t.prize}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "MEGA_BGMI_SHOWDOWN_STANDINGS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Standings exported to CSV successfully!");
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#CBD5E1] font-sans selection:bg-[#ECA214] selection:text-black">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0F1622] border border-[#ECA214] text-white px-4 py-3 rounded-lg shadow-2xl shadow-amber-950/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ECA214]" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="sticky top-0 z-40 w-full bg-[#080D14]/95 backdrop-blur-md border-b border-[#141C28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => showToast("Navigating to Nadeflux Home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#ECA214] transition-transform group-hover:scale-105" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M18 2V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M18 28V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M28 18H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M2 18H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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

            {/* Nav Tabs */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider">
              {['Browse Tournaments', 'Host Match', 'Leaderboard', 'My Matches'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    showToast(`Switched view to ${tab}`);
                  }}
                  className={`relative py-1 transition-colors ${
                    activeTab === tab 
                      ? 'text-white font-bold' 
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64 lg:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search tournaments, teams, players"
                className="w-full bg-[#0E1521] border border-[#1A2637] focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 pl-9 pr-3 py-2 rounded-md placeholder-neutral-500"
              />
            </div>

            {/* Notification */}
            <button 
              onClick={() => showToast("Tournament result verified by admin.")}
              className="relative p-2 text-neutral-400 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full ring-2 ring-[#080D14]"></span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center bg-[#0E1521] border border-[#1A2637] rounded-full py-1 pl-1 pr-3 gap-2 cursor-pointer hover:border-[#28384E]">
              <div className="w-7 h-7 rounded-full bg-neutral-300 text-black font-black text-[11px] flex items-center justify-center">
                RK
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white">RishiK</span>
                <span className="text-[9px] text-neutral-400 font-mono">LVL 28</span>
              </div>
            </div>

            {/* Wallet */}
            <div className="flex items-center gap-1.5 bg-[#0E1521] border border-[#1A2637] px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="text-[#38BDF8]">🪙</span>
              <span className="font-mono text-[#38BDF8]">₹1,250</span>
            </div>
          </div>
        </div>
      </header>

      {}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141C28]/60 pb-3">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider">
            <span 
              onClick={() => showToast("Navigating to tournaments list")}
              className="text-neutral-400 hover:text-white cursor-pointer uppercase"
            >
              TOURNAMENTS
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-white font-extrabold uppercase">
              RESULTS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#38BDF8] uppercase">
              COMPLETED • 18 AUG 2024
            </span>
          </div>
        </div>
      </div>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase font-sans">
              MEGA BGMI SHOWDOWN
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Final results • Erangel • Squad • TPP
            </p>
          </div>

          <button
            onClick={() => showToast("Returned to Tournaments overview")}
            className="self-start sm:self-center px-4 py-2 bg-[#0E1521] hover:bg-[#151F2E] border border-[#1B2738] text-white text-xs font-bold uppercase rounded-md tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO TOURNAMENTS
          </button>
        </div>
      </section>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              THE WINNERS CIRCLE
            </h2>
            <span className="bg-[#ECA214] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wider">
              COMPLETED
            </span>
          </div>

          {/* Podium Grid (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            
            {/* ================= #2 RUNNERS-UP (LEFT CARD) ================= */}
            <div className="relative flex flex-col">
              <div className="bg-[#0C121B] border border-[#1A2536] rounded-xl p-6 text-center space-y-4 shadow-xl">
                {/* Avatar */}
                <div className="w-14 h-14 mx-auto rounded-full bg-[#1A2433] border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-sm font-black text-white font-mono">TC</span>
                </div>

                {/* Team Info */}
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    TACTICAL CREW
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-black tracking-widest text-[#38BDF8] uppercase">
                    #2 RUNNERS-UP
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center gap-8 text-xs font-mono border-t border-b border-[#16202D] py-3">
                  <div>
                    <span className="block text-base font-black text-white">14</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">KILLS</span>
                  </div>
                  <div>
                    <span className="block text-base font-black text-white">126</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">TOTAL POINTS</span>
                  </div>
                </div>

                {/* Prize */}
                <div className="text-sm font-black text-[#ECA214] font-mono">
                  ₹15,000
                </div>
              </div>

              {/* Glowing Podium Bar & Number */}
              <div className="mt-3 flex flex-col items-center">
                <div className="w-full h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"></div>
                <span className="text-lg font-black text-amber-500 font-mono mt-1">3</span>
              </div>
            </div>

            {/* ================= #1 CHAMPIONS (CENTER ELEVATED CARD) ================= */}
            <div className="relative flex flex-col -mt-4">
              <div className="relative bg-[#0C121B] border-2 border-[#ECA214] rounded-xl p-7 text-center space-y-4 shadow-2xl shadow-amber-950/20">
                {/* Crown in top right */}
                <div className="absolute top-3.5 right-3.5 text-[#ECA214]">
                  <Crown className="w-5 h-5 fill-[#ECA214]" />
                </div>

                {/* Champion Avatar */}
                <div className="w-16 h-16 mx-auto rounded-full bg-[#1F190B] border-2 border-[#ECA214] flex items-center justify-center shadow-[0_0_15px_rgba(236,162,20,0.3)]">
                  <span className="text-base font-black text-[#ECA214] font-mono">NV</span>
                </div>

                {/* Team Info */}
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    NOVA VANGUARD
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-black tracking-widest text-[#ECA214] uppercase">
                    #1 CHAMPIONS
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center gap-10 text-xs font-mono border-t border-b border-[#21271D] py-3.5">
                  <div>
                    <span className="block text-lg font-black text-white">18</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">KILLS</span>
                  </div>
                  <div>
                    <span className="block text-lg font-black text-white">148</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">TOTAL POINTS</span>
                  </div>
                </div>

                {/* Prize */}
                <div className="text-base font-black text-[#ECA214] font-mono tracking-wider">
                  ₹25,000
                </div>
              </div>

              {/* Podium Number 2 underneath */}
              <div className="mt-3 flex flex-col items-center">
                <span className="text-xl font-black text-[#38BDF8] font-mono">2</span>
              </div>
            </div>

            {/* ================= #3 RANK (RIGHT CARD) ================= */}
            <div className="relative flex flex-col">
              <div className="bg-[#0C121B] border border-[#1A2536] rounded-xl p-6 text-center space-y-4 shadow-xl">
                {/* Avatar */}
                <div className="w-14 h-14 mx-auto rounded-full bg-[#20150E] border-2 border-[#F97316] flex items-center justify-center">
                  <span className="text-sm font-black text-[#F97316] font-mono">RX</span>
                </div>

                {/* Team Info */}
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    RAVEN X
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-black tracking-widest text-[#F97316] uppercase">
                    #3
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center gap-8 text-xs font-mono border-t border-b border-[#16202D] py-3">
                  <div>
                    <span className="block text-base font-black text-white">11</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">KILLS</span>
                  </div>
                  <div>
                    <span className="block text-base font-black text-white">109</span>
                    <span className="text-[9px] text-neutral-400 uppercase font-sans">TOTAL POINTS</span>
                  </div>
                </div>

                {/* Prize */}
                <div className="text-sm font-black text-neutral-200 font-mono">
                  ₹10,000
                </div>
              </div>

              {/* Podium Number 1 underneath */}
              <div className="mt-3 flex flex-col items-center">
                <span className="text-lg font-black text-[#38BDF8] font-mono">1</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Total Prize Distributed */}
          <div className="bg-[#0C121B] border border-[#1A2536] rounded-xl p-5 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              TOTAL PRIZE DISTRIBUTED
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#38BDF8]">🪙</span>
              <span className="text-2xl font-black text-white font-mono">₹50,000</span>
            </div>
          </div>

          {/* Card 2: Total Eliminations */}
          <div className="bg-[#0C121B] border border-[#1A2536] rounded-xl p-5 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              TOTAL ELIMINATIONS
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white font-mono">186</span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-700/30 px-2 py-0.5 rounded">
                +12% vs avg
              </span>
            </div>
          </div>

          {/* Card 3: Match MVP */}
          <div className="bg-[#0C121B] border border-[#1A2536] rounded-xl p-5 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              MATCH MVP
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-300 text-black font-extrabold text-[10px] flex items-center justify-center">
                  VEX
                </div>
                <div>
                  <span className="block text-xs font-bold text-white uppercase">VEX • NOVA VANGUARD</span>
                  <span className="text-[11px] font-mono text-[#38BDF8] font-bold">18 KILLS</span>
                </div>
              </div>
              <span className="bg-[#ECA214] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded">
                MVP
              </span>
            </div>
          </div>

        </div>
      </section>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-[#0C121B] border border-[#192535] rounded-xl p-5 sm:p-6 shadow-xl">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#16202E]">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                DETAILED STANDINGS
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                25 teams • Placement + elimination scoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Dropdown Filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="bg-[#0E1521] border border-[#1C283A] text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-2 text-neutral-300 hover:text-white"
                >
                  <span>{selectedFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {filterDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-[#101723] border border-[#213146] rounded shadow-xl z-20 overflow-hidden text-xs">
                    {['All teams', 'Top 3', 'Prize Winners', 'My Squad'].map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setSelectedFilter(f);
                          setFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-[#182333] transition-colors ${
                          selectedFilter === f ? 'text-[#ECA214] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="bg-[#0E1521] hover:bg-[#162131] border border-[#1C283A] text-xs font-bold px-3 py-1.5 rounded text-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-[#16202E]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">TEAM NAME</th>
                  <th className="py-3 px-3">CHICKEN DINNER</th>
                  <th className="py-3 px-3 text-right">PLACEMENT PTS</th>
                  <th className="py-3 px-3 text-right">ELIMINATION PTS</th>
                  <th className="py-3 px-3 text-right">TOTAL MATCH PTS</th>
                  <th className="py-3 px-3 text-right">PRIZE WON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131B26] font-mono">
                {displayedStandings.map((team) => (
                  <tr 
                    key={team.name}
                    className={`transition-colors ${
                      team.isUser 
                        ? 'bg-[#3A2210]/40 border-l-4 border-l-[#F97316] text-white hover:bg-[#3A2210]/60' 
                        : 'hover:bg-[#0E1522]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3 font-bold text-white">
                      {team.rank}
                    </td>

                    {/* Team Name */}
                    <td className="py-3.5 px-3 font-sans font-bold text-white flex items-center gap-2">
                      <span>{team.name}</span>
                      {team.isUser && (
                        <span className="bg-[#F97316] text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded font-mono">
                          YOU
                        </span>
                      )}
                    </td>

                    {/* Chicken Dinner Trophy */}
                    <td className="py-3.5 px-3">
                      {team.chicken ? (
                        <span className="text-amber-400 text-sm">🏆</span>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>

                    {/* Placement Points */}
                    <td className="py-3.5 px-3 text-right text-neutral-300">
                      {team.placement}
                    </td>

                    {/* Elimination Points */}
                    <td className="py-3.5 px-3 text-right text-neutral-300">
                      {team.elims}
                    </td>

                    {/* Total Match Points */}
                    <td className="py-3.5 px-3 text-right font-black text-[#38BDF8]">
                      {team.total}
                    </td>

                    {/* Prize */}
                    <td className="py-3.5 px-3 text-right font-black text-neutral-200">
                      {team.prize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="pt-4 text-left text-[11px] font-mono text-neutral-500">
            Showing {displayedStandings.length} of 25 teams
          </div>

        </div>
      </section>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4">
          EVIDENCE & FAIR PLAY
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Admin Verified Scoreboards (7 cols) */}
          <div className="lg:col-span-7 bg-[#0C121B] border border-[#192535] rounded-xl p-5 shadow-xl space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              ADMIN-VERIFIED SCOREBOARDS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              
              {/* Item 1 */}
              <div 
                onClick={() => setAuditModal('score')}
                className="bg-[#0E1521] border border-[#1A2637] hover:border-[#38BDF8]/60 p-3 rounded-lg cursor-pointer transition-all space-y-3"
              >
                <div className="text-[10px] font-black uppercase text-neutral-300 tracking-wider">
                  FINAL SCOREBOARD
                </div>
                <div className="inline-block bg-[#0B2E3D] border border-[#0284C7] text-[#38BDF8] text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                  VERIFIED • 18:42
                </div>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => setAuditModal('result')}
                className="bg-[#0E1521] border border-[#1A2637] hover:border-[#38BDF8]/60 p-3 rounded-lg cursor-pointer transition-all space-y-3"
              >
                <div className="text-[10px] font-black uppercase text-neutral-300 tracking-wider">
                  MATCH RESULT
                </div>
                <div className="inline-block bg-[#0B2E3D] border border-[#0284C7] text-[#38BDF8] text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                  VERIFIED • 18:45
                </div>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => setAuditModal('killfeed')}
                className="bg-[#0E1521] border border-[#1A2637] hover:border-[#38BDF8]/60 p-3 rounded-lg cursor-pointer transition-all space-y-3"
              >
                <div className="text-[10px] font-black uppercase text-neutral-300 tracking-wider">
                  KILL FEED REVIEW
                </div>
                <div className="inline-block bg-[#0B2E3D] border border-[#0284C7] text-[#38BDF8] text-[9px] font-black font-mono px-2 py-0.5 rounded uppercase">
                  VERIFIED • 18:51
                </div>
              </div>

            </div>
          </div>

          {/* Match Replay Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0C121B] border border-[#192535] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#38BDF8] flex items-center justify-center text-[#38BDF8]">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <h3 className="text-xs font-bold text-white">
                  Watch the full match replay
                </h3>
              </div>

              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Review the final circle, rotations, and every elimination from Match #42.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setReplayModalOpen(true)}
                className="w-full bg-[#00A3FF] hover:bg-[#008FE0] text-black font-black text-xs uppercase py-2.5 px-4 rounded flex items-center justify-center gap-1.5 tracking-wider transition-colors"
              >
                <span>WATCH REPLAY</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span>Verified by Nadeflux Admin • No disputes filed</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {}
      <footer className="w-full bg-[#06090E] border-t border-[#131B26] pt-12 pb-8 text-neutral-400 text-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-[#ECA214]" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="3.5" fill="currentColor" />
                </svg>
                <span className="font-mono font-bold tracking-widest text-white text-sm">
                  NADEFLUX
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Built for fair play. Built for the drop.
              </p>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-2.5">
              <span className="block font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                PLATFORM
              </span>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#about" onClick={(e) => { e.preventDefault(); showToast("Platform specs: Nadeflux v2.4"); }} className="hover:text-white">About Us</a></li>
                <li><a href="#leaderboard" onClick={(e) => { e.preventDefault(); showToast("Viewing All-India Leaderboards"); }} className="hover:text-white">Leaderboard</a></li>
                <li><a href="#host" onClick={(e) => { e.preventDefault(); showToast("Host verification portal"); }} className="hover:text-white">Host a Match</a></li>
                <li><a href="#support" onClick={(e) => { e.preventDefault(); showToast("Support desk online 24/7"); }} className="hover:text-white">Support</a></li>
              </ul>
            </div>

            {/* Col 3: Rules / Quick Links */}
            <div className="space-y-2.5">
              <span className="block font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                QUICK LINKS
              </span>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#tournaments" onClick={(e) => { e.preventDefault(); showToast("Browse Tournaments"); }} className="hover:text-white">Tournaments</a></li>
                <li><a href="#rules" onClick={(e) => { e.preventDefault(); showToast("BGIS & BGMI Standard Rules"); }} className="hover:text-white">Rules</a></li>
                <li><a href="#my-matches" onClick={(e) => { e.preventDefault(); showToast("Navigating to My Matches"); }} className="hover:text-white">My Matches</a></li>
              </ul>
            </div>

            {/* Col 4: Follow the Drop */}
            <div className="space-y-2.5">
              <span className="block font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                FOLLOW THE DROP
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => showToast("Opened official Nadeflux Discord community")}
                  className="w-8 h-8 rounded border border-[#1A2637] bg-[#0E1521] flex items-center justify-center hover:text-white hover:border-[#38BDF8]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showToast("Opened official Youtube Stream")}
                  className="w-8 h-8 rounded border border-[#1A2637] bg-[#0E1521] flex items-center justify-center hover:text-white hover:border-[#38BDF8]"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showToast("Opened Twitter Esports Hub")}
                  className="w-8 h-8 rounded border border-[#1A2637] bg-[#0E1521] flex items-center justify-center hover:text-white hover:border-[#38BDF8]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-[#101722] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-neutral-500">
            <span>© 2024 Nadeflux Esports</span>
            <span>Made for the Indian BGMI community</span>
          </div>

        </div>
      </footer>

      {}
      {replayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0C121B] border border-[#27384E] rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setReplayModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-md bg-[#131A24]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#00A3FF]/20 border border-[#00A3FF] flex items-center justify-center text-[#00A3FF]">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase">MATCH #42 REPLAY STREAM</h3>
                <p className="text-xs text-neutral-400 font-mono">Erangel • 28m 42s duration • 1080p 60fps</p>
              </div>
            </div>

            {/* Video Player Canvas Mock */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#1A2536] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
              
              {/* Overlay elements */}
              <div className="absolute top-3 left-3 bg-[#0A0E15]/90 border border-neutral-700 px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>SPECTATOR POV : NOVA VANGUARD</span>
              </div>

              <div className="text-center z-10 space-y-2">
                <Play className="w-12 h-12 text-[#00A3FF] mx-auto hover:scale-110 cursor-pointer transition-transform" />
                <span className="block text-xs font-mono text-neutral-300">Click to resume 2.4 GHz stream</span>
              </div>

              {/* Progress bar mock */}
              <div className="absolute bottom-3 left-4 right-4 space-y-1">
                <div className="w-full h-1 bg-neutral-700 rounded">
                  <div className="w-3/4 h-full bg-[#00A3FF] rounded"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                  <span>21:14</span>
                  <span>28:42</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-mono">Telemetry: No anomalous packet latency reported.</span>
              <button 
                onClick={() => setReplayModalOpen(false)}
                className="px-4 py-1.5 bg-[#141E2B] border border-[#233348] text-white font-bold rounded"
              >
                Close Replay
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {auditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0C121B] border border-[#27384E] rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setAuditModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-md bg-[#131A24]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#38BDF8]" />
              <div>
                <h3 className="text-base font-black text-white uppercase">
                  {auditModal === 'score' && 'FINAL SCOREBOARD AUDIT LOG'}
                  {auditModal === 'result' && 'MATCH RESULT HASH VERIFICATION'}
                  {auditModal === 'killfeed' && 'KILL FEED ANTI-CHEAT VERIFICATION'}
                </h3>
                <span className="text-[10px] font-mono text-[#38BDF8]">
                  CRYPTOGRAPHIC LOG ID: #782-ERL-2024
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#0F1622] border border-[#1A2536] rounded-xl text-xs space-y-2.5 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Match Hash:</span>
                <span className="text-white">0x8a92f0...31c4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Admin Reviewer:</span>
                <span className="text-emerald-400">Nadeflux_Admin_04 [VERIFIED]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Screenshot Evidence:</span>
                <span className="text-[#ECA214]">34 Screenshots Captured</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Anti-Cheat Flags:</span>
                <span className="text-white">0 Flags Triggered</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast("Audit cryptographic report saved to clipboard.");
                setAuditModal(null);
              }}
              className="mt-5 w-full bg-[#ECA214] hover:bg-[#d89311] text-black font-extrabold text-xs uppercase py-2.5 rounded tracking-wider"
            >
              DOWNLOAD OFFICIAL CERTIFICATE
            </button>
          </div>
        </div>
      )}

    </div>
  );
}