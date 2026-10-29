import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Pencil, 
  Trophy, 
  Gamepad2, 
  IndianRupee, 
  UploadCloud, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Calendar, 
  Mail, 
  Check, 
  Flame, 
  Clock, 
  Lock, 
  LogOut,
  Target
} from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('Leaderboard');
  const [activeTab, setActiveTab] = useState('PROFILE INFO');
  
  // Profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Rishik Sharma',
    displayName: 'Rishik',
    email: 'rishik.sharma@gmail.com',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Pune'
  });

  // Game account state
  const [ign, setIgn] = useState('RishikOP');
  const [characterId, setCharacterId] = useState('5839 2741 08');
  const [isGameVerified, setIsGameVerified] = useState(true);
  const [uploadedScreenshot, setUploadedScreenshot] = useState({
    name: 'bgmi_profile_01.png',
    size: '2.4 MB'
  });

  // Wallet and modals
  const [walletBalance, setWalletBalance] = useState(1250);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');
  const [withdrawAmount, setWithdrawAmount] = useState('500');

  // Connected providers & sessions
  const [discordConnected, setDiscordConnected] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, name: 'Chrome on Windows', location: 'Pune, India', status: 'Current device', current: true },
    { id: 2, name: 'Safari on iPhone', location: 'Pune, India', status: 'Last active 2 hours ago', current: false }
  ]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    showToast('Profile information successfully updated!');
  };

  const handleVerifyGameAccount = () => {
    setIsGameVerified(true);
    showToast('BGMI Character ID & Screenshot submitted for verification!');
  };

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Session revoked successfully.');
  };

  const handleDeposit = () => {
    const amt = parseInt(depositAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      setWalletBalance(prev => prev + amt);
      setDepositModalOpen(false);
      showToast(`Added ₹${amt.toLocaleString()} to your wallet balance.`);
    }
  };

  const handleWithdraw = () => {
    const amt = parseInt(withdrawAmount, 10);
    if (!isNaN(amt) && amt > 0 && amt <= walletBalance) {
      setWalletBalance(prev => prev - amt);
      setWithdrawModalOpen(false);
      showToast(`Withdrawal of ₹${amt.toLocaleString()} initiated.`);
    } else {
      showToast('Insufficient wallet balance.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#CBD5E1] font-sans selection:bg-[#ECA214] selection:text-black">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0F1622] border border-[#ECA214] text-white px-4 py-3 rounded-lg shadow-2xl shadow-amber-950/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ECA214]" />
          <span className="text-xs font-semibold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#080D14]/95 backdrop-blur-md border-b border-[#141C28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Nav Tabs */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => showToast('Navigating to Nadeflux Home')}
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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider">
              {['Browse Tournaments', 'Host Match', 'Leaderboard', 'My Matches'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveNavTab(tab);
                    showToast(`Navigated to ${tab}`);
                  }}
                  className={`relative py-1 transition-colors ${
                    activeNavTab === tab 
                      ? 'text-white font-bold' 
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab}
                  {activeNavTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section: Search, Notifications, User Badge, Wallet */}
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

            {/* Notification Bell */}
            <button 
              onClick={() => showToast('No unread notifications')}
              className="relative p-2 text-neutral-400 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full ring-2 ring-[#080D14]"></span>
            </button>

            {/* User Avatar Chip */}
            <div className="flex items-center bg-[#0E1521] border border-[#1A2637] rounded-full py-1 pl-1 pr-3 gap-2 cursor-pointer hover:border-[#28384E]">
              <div className="w-7 h-7 rounded-full bg-neutral-300 text-black font-black text-[11px] flex items-center justify-center font-mono">
                RS
              </div>
              <span className="text-xs font-bold text-white">RishiK</span>
            </div>

            {/* Wallet Balance Display */}
            <div className="flex items-center gap-1.5 bg-[#0E1521] border border-[#1A2637] px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="text-[#38BDF8]">🪙</span>
              <span className="font-mono text-[#38BDF8]">₹{walletBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider">
          <span 
            onClick={() => showToast('Navigating to Profile root')}
            className="text-neutral-400 hover:text-white cursor-pointer uppercase"
          >
            PROFILE
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-extrabold uppercase">
            ACCOUNT SETTINGS
          </span>
        </div>
      </div>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        <div className="relative bg-[#0C121B] border border-[#172233] rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Subtle gaming geometric overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ECA214_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-[#ECA214] bg-[#0A0F17] flex items-center justify-center font-mono text-2xl font-black text-white shadow-[0_0_20px_rgba(236,162,20,0.25)]">
                  RS
                </div>
                {/* Pencil badge */}
                <button 
                  onClick={() => showToast('Avatar change dialog opened')}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#ECA214] border-2 border-[#0C121B] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-md"
                  title="Change Avatar"
                >
                  <Pencil className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                    Rishik Sharma
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#ECA214] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-sm">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                    VERIFIED PLAYER
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  @rishik
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  <span>rishik.sharma@gmail.com</span>
                  <span className="mx-2 text-neutral-600">•</span>
                  <span>Member since Jan 2024</span>
                </div>
              </div>
            </div>

            {/* Right: Wallet Balance & Actions */}
            <div className="flex flex-col md:items-end justify-center gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#38BDF8] uppercase block">
                  WALLET BALANCE
                </span>
                <span className="text-3xl font-black text-[#38BDF8] font-mono leading-tight">
                  ₹{walletBalance.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="px-5 py-2 bg-[#ECA214] hover:bg-[#d89311] text-black font-extrabold text-xs uppercase rounded-md tracking-wider shadow-md transition-colors flex items-center gap-1.5"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  Deposit
                </button>
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="px-5 py-2 bg-[#0E1521] hover:bg-[#162131] border border-[#223146] text-white font-extrabold text-xs uppercase rounded-md tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  Withdraw
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-[#0C121B] border border-[#172233] rounded-lg p-1 flex overflow-x-auto scrollbar-none">
          {[
            'PROFILE INFO',
            'GAME ACCOUNTS',
            'REGISTERED TOURNAMENTS',
            'MATCH HISTORY',
            'SECURITY & AUTH'
          ].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[160px] py-2.5 text-xs font-black uppercase tracking-wider rounded transition-all text-center ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-[#121A26]/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'PROFILE INFO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ================= LEFT COLUMN (8 COLS) ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* CARD 1: PROFILE INFORMATION */}
              <div className="bg-[#0C121B] border border-[#172233] rounded-xl p-6 shadow-xl relative">
                
                {/* Header with Title and Edit Profile Button */}
                <div className="flex items-center justify-between pb-5 border-b border-[#141C28]">
                  <div className="text-sm font-black text-white uppercase tracking-wider">
                    PROFILE INFORMATION
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(!isEditing);
                      showToast(isEditing ? 'Cancelled editing.' : 'Profile edit mode enabled.');
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-md shadow transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit profile'}
                  </button>
                </div>

                {/* 2x3 Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
                  
                  {/* FULL NAME */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-medium"
                    />
                  </div>

                  {/* DISPLAY NAME */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-medium"
                    />
                  </div>

                  {/* CONTACT EMAIL */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      CONTACT EMAIL
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 pl-3.5 pr-20 py-2.5 rounded-md font-medium"
                      />
                      <span className="absolute right-2 top-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* PHONE NUMBER */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-medium"
                    />
                  </div>

                  {/* COUNTRY */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      COUNTRY
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-medium"
                    />
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      CITY
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full bg-[#0E1521] border border-[#1A2637] disabled:opacity-75 focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-medium"
                    />
                  </div>

                </div>

                {/* SAVE CHANGES BUTTON */}
                <div className="pt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-[#ECA214] hover:bg-[#d89311] text-black font-black text-xs uppercase py-3 rounded-md tracking-wider transition-colors shadow-lg shadow-amber-950/20"
                  >
                    SAVE CHANGES
                  </button>
                </div>

              </div>

              {/* CARD 2: BGMI GAME ACCOUNT */}
              <div className="bg-[#0C121B] border border-[#172233] rounded-xl p-6 shadow-xl space-y-5">
                
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      BGMI GAME ACCOUNT
                    </h2>
                    <span className="bg-[#ECA214] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      HIGH PRIORITY
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    Verify your in-game identity to participate in tournaments.
                  </p>
                </div>

                {/* Two Column Layout for Game Inputs and Dropzone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  
                  {/* Left Side: IGN & Character ID */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        IN-GAME NAME (IGN)
                      </label>
                      <input
                        type="text"
                        value={ign}
                        onChange={(e) => setIgn(e.target.value)}
                        className="w-full bg-[#0E1521] border border-[#1A2637] focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 px-3.5 py-2.5 rounded-md font-mono"
                        placeholder="e.g. RishikOP"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        BGMI NUMERIC CHARACTER ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={characterId}
                          onChange={(e) => setCharacterId(e.target.value)}
                          className="w-full bg-[#0E1521] border border-[#1A2637] focus:border-[#ECA214] focus:outline-none text-xs text-neutral-200 pl-3.5 pr-28 py-2.5 rounded-md font-mono"
                          placeholder="e.g. 5839 2741 08"
                        />
                        <span className="absolute right-2 top-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                          10 DIGITS VALID
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Upload Dropzone Box */}
                  <div className="border border-dashed border-[#1E2B3D] hover:border-[#ECA214]/60 bg-[#0A0F17]/50 rounded-xl p-4 flex flex-col justify-between transition-colors">
                    <div 
                      onClick={() => showToast('Opening screenshot file picker...')}
                      className="cursor-pointer text-center space-y-1.5 py-3"
                    >
                      <UploadCloud className="w-7 h-7 text-[#ECA214] mx-auto stroke-[1.5]" />
                      <div className="text-xs font-bold text-white uppercase">
                        Upload in-game verification screenshot
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Show your profile page with IGN and numeric character ID visible
                      </div>
                    </div>

                    {/* Uploaded state pill */}
                    <div className="mt-2 bg-[#0E1521] border border-[#1A2637] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-200 font-bold">{uploadedScreenshot.name}</span>
                        <span className="text-neutral-500 text-[10px]">{uploadedScreenshot.size}</span>
                      </div>
                      <span className="text-[#ECA214] font-bold text-[10px] uppercase flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Verified screenshot
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleVerifyGameAccount}
                    className="px-6 py-2.5 bg-[#ECA214] hover:bg-[#d89311] text-black font-extrabold text-xs uppercase rounded-md tracking-wider transition-colors shadow-md"
                  >
                    VERIFY GAME ACCOUNT
                  </button>
                </div>

              </div>

            </div>

            {/* ================= RIGHT COLUMN (4 COLS) ================= */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* CARD 1: QUICK STATS */}
              <div className="bg-[#0C121B] border border-[#172233] rounded-xl p-5 shadow-xl space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                  QUICK STATS
                </span>

                {/* Metric 1: Win Rate */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-300 font-semibold uppercase text-[11px]">
                      <Target className="w-3.5 h-3.5 text-[#ECA214]" />
                      <span>WIN RATE</span>
                    </div>
                    <span className="font-mono font-black text-[#ECA214]">68.4%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#141C28] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-[#ECA214] rounded-full" style={{ width: '68.4%' }}></div>
                  </div>
                </div>

                {/* Metric 2: Matches Played */}
                <div className="flex items-center justify-between pt-2 border-t border-[#131B26]">
                  <div className="flex items-center gap-2 text-neutral-300 font-semibold uppercase text-[11px]">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>TOTAL MATCHES PLAYED</span>
                  </div>
                  <span className="font-mono font-black text-white text-sm">128</span>
                </div>

                {/* Metric 3: Tournaments Won */}
                <div className="flex items-center justify-between pt-2 border-t border-[#131B26]">
                  <div className="flex items-center gap-2 text-neutral-300 font-semibold uppercase text-[11px]">
                    <Trophy className="w-3.5 h-3.5 text-[#ECA214]" />
                    <span>TOURNAMENTS WON</span>
                  </div>
                  <span className="font-mono font-black text-white text-sm">12</span>
                </div>

                {/* Metric 4: Total Winnings */}
                <div className="flex items-center justify-between pt-2 border-t border-[#131B26]">
                  <div className="flex items-center gap-2 text-neutral-300 font-semibold uppercase text-[11px]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>TOTAL WINNINGS</span>
                  </div>
                  <span className="font-mono font-black text-[#38BDF8] text-base">₹48,500</span>
                </div>
              </div>

              {/* CARD 2: CONNECTED AUTH PROVIDERS */}
              <div className="bg-[#0C121B] border border-[#172233] rounded-xl p-5 shadow-xl space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                  CONNECTED AUTH PROVIDERS
                </span>

                <div className="space-y-3">
                  
                  {/* Row 1: Email / Password */}
                  <div className="flex items-center justify-between py-1.5">
                    <div>
                      <div className="text-xs font-bold text-white">Email / Password</div>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Connected
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast('Manage credentials modal opened')}
                      className="px-3 py-1 bg-[#0E1521] hover:bg-[#162131] border border-[#1F2E42] text-xs font-bold text-white rounded transition-colors"
                    >
                      Manage
                    </button>
                  </div>

                  {/* Row 2: Google Account */}
                  <div className="flex items-center justify-between py-1.5 border-t border-[#131B26]">
                    <div>
                      <div className="text-xs font-bold text-white">Google Account</div>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Connected
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast('Google authentication managed')}
                      className="px-3 py-1 bg-[#0E1521] hover:bg-[#162131] border border-[#1F2E42] text-xs font-bold text-white rounded transition-colors"
                    >
                      Manage
                    </button>
                  </div>

                  {/* Row 3: Discord */}
                  <div className="flex items-center justify-between py-1.5 border-t border-[#131B26]">
                    <div>
                      <div className="text-xs font-bold text-white">Discord</div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {discordConnected ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Connected as @rishik_bgmi
                          </span>
                        ) : 'Not connected'}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setDiscordConnected(!discordConnected);
                        showToast(discordConnected ? 'Discord account disconnected' : 'Discord account connected!');
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                        discordConnected 
                          ? 'bg-[#141C28] text-neutral-300 border border-[#223146]' 
                          : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
                      }`}
                    >
                      {discordConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>

                </div>
              </div>

              {/* CARD 3: ACTIVE SESSIONS */}
              <div className="bg-[#0C121B] border border-[#172233] rounded-xl p-5 shadow-xl space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                  ACTIVE SESSIONS
                </span>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 text-neutral-400">
                          {sess.name.includes('Chrome') ? (
                            <Laptop className="w-4 h-4 text-[#ECA214]" />
                          ) : (
                            <Smartphone className="w-4 h-4 text-[#38BDF8]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{sess.name}</div>
                          <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 mt-0.5">
                            <span>{sess.location}</span>
                            <span>•</span>
                            <span className={sess.current ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                              {sess.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-3 py-1 bg-[#0E1521] hover:bg-[#1C1618] border border-[#2B2329] text-xs font-bold text-neutral-300 hover:text-red-400 rounded transition-colors"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Placeholder Views for Other Segmented Tabs */}
        {activeTab !== 'PROFILE INFO' && (
          <div className="bg-[#0C121B] border border-[#172233] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#121A26] border border-[#1D293C] flex items-center justify-center mx-auto text-[#ECA214]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {activeTab}
            </h3>
            <p className="text-xs text-neutral-400 font-mono max-w-md mx-auto">
              Live records and configurations for {activeTab.toLowerCase()} are loaded and synced with your BGMI player profile.
            </p>
            <button
              onClick={() => setActiveTab('PROFILE INFO')}
              className="mt-2 px-4 py-2 bg-[#0E1521] hover:bg-[#162131] border border-[#1F2E42] text-white text-xs font-bold uppercase rounded-md"
            >
              Back to Profile Info
            </button>
          </div>
        )}
      </main>

      {}
      <footer className="w-full border-t border-[#101722] py-6 text-center text-[11px] font-mono text-neutral-500">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span>Powered by Better Auth</span>
          <span className="hidden sm:inline">•</span>
          <span>Last profile update 12 Mar 2024</span>
        </div>
      </footer>

      {}
      {/* DEPOSIT MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0C121B] border border-[#27384E] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                DEPOSIT FUNDS
              </h3>
              <button 
                onClick={() => setDepositModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-mono">
              Top up your Nadeflux tournament wallet instantly via UPI or Net Banking.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono">₹</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-[#0E1521] border border-[#1A2637] text-white pl-8 pr-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-[#ECA214]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {['100', '250', '500', '1000'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(amt)}
                  className="flex-1 py-1.5 bg-[#0E1521] border border-[#1C283A] text-xs font-mono text-neutral-300 rounded hover:border-[#ECA214]"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleDeposit}
              className="w-full bg-[#ECA214] hover:bg-[#d89311] text-black font-extrabold text-xs uppercase py-3 rounded-md tracking-wider transition-colors"
            >
              Confirm Deposit
            </button>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0C121B] border border-[#27384E] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                WITHDRAW WINNINGS
              </h3>
              <button 
                onClick={() => setWithdrawModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#0E1521] rounded-lg border border-[#182333] flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">Withdrawable Balance:</span>
              <span className="text-[#38BDF8] font-bold">₹{walletBalance.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Withdraw Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#0E1521] border border-[#1A2637] text-white pl-8 pr-3 py-2 rounded text-sm font-mono focus:outline-none focus:border-[#ECA214]"
                />
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-black font-extrabold text-xs uppercase py-3 rounded-md tracking-wider transition-colors"
            >
              Process Withdrawal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}