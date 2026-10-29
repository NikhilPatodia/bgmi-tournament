import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [activeNav, setActiveNav] = useState('Browse Tournaments');
  const [walletBalance, setWalletBalance] = useState(1250);
  
  // Deposit Amount States
  const [selectedPreset, setSelectedPreset] = useState('1,000');
  const [customAmount, setCustomAmount] = useState('1000');
  
  // Payment Modal & Workflow States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi_qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to trigger brief toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePresetSelect = (amountStr, numericVal) => {
    setSelectedPreset(amountStr);
    setCustomAmount(numericVal.toString());
  };

  const handleCustomAmountChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(rawVal);

    // Sync preset if match
    if (rawVal === '500') setSelectedPreset('500');
    else if (rawVal === '1000') setSelectedPreset('1,000');
    else if (rawVal === '2000') setSelectedPreset('2,000');
    else if (rawVal === '5000') setSelectedPreset('5,000');
    else setSelectedPreset(null);
  };

  const handleContinuePayment = () => {
    const numeric = parseInt(customAmount, 10);
    if (!numeric || isNaN(numeric)) {
      triggerToast('Please specify a deposit amount.');
      return;
    }
    if (numeric < 100) {
      triggerToast('Minimum deposit is ₹100.');
      return;
    }
    setPaymentSuccess(false);
    setIsProcessing(false);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmMockPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const added = parseInt(customAmount, 10) || 0;
      setWalletBalance((prev) => prev + added);
      triggerToast(`Successfully added ₹${added.toLocaleString()} to your wallet!`);
    }, 1400);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentSuccess(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#05080E] text-[#94a3b8] font-sans selection:bg-[#F59E0B] selection:text-black antialiased relative pb-16">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0C121B] border border-[#F59E0B]/70 text-white px-4 py-3 rounded-lg shadow-2xl animate-fade-in shadow-amber-950/40">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#070B12]/95 backdrop-blur-md border-b border-[#121A28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Nav Tabs */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => triggerToast('Navigating to home...')}
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
              {['Browse Tournaments', 'Host Match', 'Leaderboard', 'My Matches'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    triggerToast(`Switched tab to ${item}`);
                  }}
                  className={`py-1 transition-colors ${
                    activeNav === item 
                      ? 'text-neutral-200 hover:text-white font-medium' 
                      : 'text-[#64748b] hover:text-[#94a3b8]'
                  }`}
                >
                  {item}
                </button>
              ))}
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
                className="w-full bg-[#0B1019] border border-[#162132] focus:border-[#F59E0B]/50 focus:outline-none text-[11px] text-neutral-200 pl-8 pr-3 py-1.5 rounded-md placeholder-neutral-500"
              />
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => triggerToast('No pending notifications')}
              className="relative p-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
            </button>

            {/* User Pill RS */}
            <div 
              onClick={() => triggerToast('Opened user menu')}
              className="flex items-center bg-[#0B1019] border border-[#162132] rounded-full py-0.5 pl-0.5 pr-2.5 gap-2 cursor-pointer hover:border-[#223149] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#e2e8f0] text-black font-black text-[10px] flex items-center justify-center font-mono">
                RS
              </div>
              <span className="text-[11px] font-semibold text-white">Rishik</span>
            </div>

            {/* Cyan Wallet Chip */}
            <div 
              onClick={() => triggerToast(`Current wallet balance: ₹${walletBalance.toLocaleString()}`)}
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase">
          <span 
            onClick={() => triggerToast('Going back to Profile')}
            className="text-[#64748b] hover:text-neutral-300 cursor-pointer"
          >
            PROFILE
          </span>
          <span className="text-[#334155]">/</span>
          <span 
            onClick={() => triggerToast('Going back to Account Settings')}
            className="text-[#64748b] hover:text-neutral-300 cursor-pointer"
          >
            ACCOUNT SETTINGS
          </span>
          <span className="text-[#334155]">/</span>
          <span className="text-white font-bold">
            DEPOSIT
          </span>
        </div>
      </div>

      {}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-7">
        <div className="bg-[#080D15] border border-[#141C2B] rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          
          {/* User info left block */}
          <div className="flex items-center gap-4">
            {/* RS avatar with yellow outline */}
            <div className="w-14 h-14 rounded-full border-2 border-[#EAB308] bg-[#05080E] flex items-center justify-center font-mono text-base font-black text-white shrink-0">
              RS
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Rishik Sharma
                </h1>
                {/* Yellow VERIFIED PLAYER pill */}
                <span className="bg-[#EAB308] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide font-mono">
                  VERIFIED PLAYER
                </span>
              </div>
              <div className="text-xs font-mono text-[#64748b] flex items-center gap-2">
                <span>@rishik</span>
                <span>•</span>
                <span>rishik.sharma@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Current Wallet Balance on right */}
          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#22D3EE] uppercase block">
              CURRENT WALLET BALANCE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#22D3EE] font-mono leading-none tracking-tight">
              ₹{walletBalance.toLocaleString()}
            </span>
          </div>

        </div>
      </section>

      {}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pb-12">
        <div className="w-full max-w-[620px] bg-[#080D15] border border-[#141F30] rounded-xl p-6 sm:p-9 shadow-2xl relative">
          
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-1.5 pb-6">
            <h2 className="text-lg sm:text-xl font-black tracking-widest text-white/90 uppercase font-sans">
              ADD FUNDS
            </h2>
            <p className="text-xs text-[#64748b] font-normal tracking-wide">
              Choose an amount to add to your NADEFLUX wallet.
            </p>
          </div>

          {/* 4 Preset Amount White Buttons */}
          <div className="grid grid-cols-4 gap-2.5 pb-6">
            {[
              { label: '₹500', value: 500, key: '500' },
              { label: '₹1,000', value: 1000, key: '1,000' },
              { label: '₹2,000', value: 2000, key: '2,000' },
              { label: '₹5,000', value: 5000, key: '5,000' }
            ].map((item) => {
              const isSelected = selectedPreset === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handlePresetSelect(item.key, item.value)}
                  className={`py-2 px-1 text-center font-bold text-xs rounded transition-all select-none ${
                    isSelected 
                      ? 'bg-white text-black ring-2 ring-white shadow-md font-extrabold' 
                      : 'bg-[#EDEDEE] hover:bg-white text-black font-semibold'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Custom Amount Section */}
          <div className="space-y-1.5 pb-4">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
              CUSTOM AMOUNT
            </label>
            <div className="relative flex items-center bg-[#0E1522] border border-[#1A2536] rounded focus-within:border-[#F59E0B] transition-colors">
              <span className="pl-3.5 pr-1 text-[#F59E0B] font-bold text-sm select-none font-mono">
                ₹
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className="w-full bg-transparent py-2.5 pr-3 text-xs font-mono text-neutral-100 placeholder-[#475569] focus:outline-none"
              />
            </div>
          </div>

          {/* Secure Payment Information Box */}
          <div className="bg-[#0B111B] border border-[#162335] rounded p-3.5 mb-6 space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#22D3EE] stroke-[2.2]" />
              <span className="text-xs font-bold text-white tracking-wide">
                Secure payment
              </span>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Payments are processed securely. Minimum deposit is ₹100 and applicable payment processing limits may apply.
            </p>
          </div>

          {/* Large Amber Continue Action Button */}
          <button
            type="button"
            onClick={handleContinuePayment}
            className="w-full bg-[#F59E0B] hover:bg-[#d98b06] active:scale-[0.99] text-black font-black text-xs uppercase py-3.5 rounded tracking-wider transition-all shadow-lg shadow-amber-950/20"
          >
            CONTINUE TO PAYMENT
          </button>

          {/* Cancel / Back Link */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => triggerToast('Navigating back to Account Settings...')}
              className="text-[11px] text-[#64748b] hover:text-neutral-300 transition-colors font-medium cursor-pointer"
            >
              Cancel / Back to Account Settings
            </button>
          </div>

        </div>
      </main>

      {}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#090E17] border border-[#1E2C42] rounded-2xl p-6 shadow-2xl text-neutral-200">
            
            {/* Modal close button */}
            <button
              onClick={closePaymentModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#F59E0B]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>NADEFLUX SECURE CHECKOUT</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Add ₹{parseInt(customAmount, 10 || 0).toLocaleString()} to Wallet
                  </h3>
                </div>

                {/* Method selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Select Payment Method
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'upi_qr', name: 'Instant UPI / QR', icon: QrCode },
                      { id: 'card', name: 'Debit / Credit Card', icon: CreditCard },
                      { id: 'netbanking', name: 'Net Banking', icon: Building2 },
                      { id: 'wallet', name: 'Paytm / PhonePe', icon: Smartphone }
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-colors ${
                            active 
                              ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white font-bold' 
                              : 'border-[#182333] bg-[#0E1522] text-neutral-400 hover:text-white hover:border-[#223146]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-[#F59E0B]' : 'text-neutral-500'}`} />
                          <span className="truncate">{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated payment detail view */}
                <div className="bg-[#0B1019] border border-[#162132] rounded-xl p-4 text-center space-y-2">
                  {paymentMethod === 'upi_qr' && (
                    <div className="space-y-2">
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto p-2 flex items-center justify-center">
                        {/* Mock QR SVG */}
                        <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                          <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                          <rect x="6" y="6" width="18" height="18" fill="white"/>
                          <rect x="10" y="10" width="10" height="10" fill="currentColor"/>

                          <rect x="70" y="0" width="30" height="30" fill="currentColor"/>
                          <rect x="76" y="6" width="18" height="18" fill="white"/>
                          <rect x="80" y="10" width="10" height="10" fill="currentColor"/>

                          <rect x="0" y="70" width="30" height="30" fill="currentColor"/>
                          <rect x="6" y="76" width="18" height="18" fill="white"/>
                          <rect x="10" y="80" width="10" height="10" fill="currentColor"/>

                          <rect x="40" y="10" width="20" height="8" fill="currentColor"/>
                          <rect x="40" y="25" width="10" height="15" fill="currentColor"/>
                          <rect x="70" y="45" width="20" height="10" fill="currentColor"/>
                          <rect x="45" y="45" width="15" height="15" fill="currentColor"/>
                          <rect x="40" y="70" width="15" height="20" fill="currentColor"/>
                          <rect x="65" y="70" width="25" height="10" fill="currentColor"/>
                        </svg>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <span className="text-[10px] text-[#22D3EE] font-mono font-bold block">
                        UPI ID: nadefluxesports@icici
                      </span>
                    </div>
                  )}

                  {paymentMethod !== 'upi_qr' && (
                    <div className="py-4 text-xs font-mono text-neutral-400">
                      Simulating test gateway for <span className="text-white font-bold">{paymentMethod.toUpperCase()}</span>.
                    </div>
                  )}
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmMockPayment}
                  className="w-full bg-[#F59E0B] hover:bg-[#d98b06] disabled:opacity-50 text-black font-extrabold text-xs uppercase py-3 rounded tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Authorizing transaction...</span>
                    </>
                  ) : (
                    <span>Pay ₹{parseInt(customAmount, 10 || 0).toLocaleString()} Now</span>
                  )}
                </button>
              </div>
            ) : (
              /* Success screen */
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Deposit Successful!</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    ₹{parseInt(customAmount, 10 || 0).toLocaleString()} has been credited to your Nadeflux wallet.
                  </p>
                </div>

                <div className="bg-[#0B1019] border border-[#162132] rounded-lg p-3 text-xs font-mono flex justify-between items-center">
                  <span className="text-neutral-400">Updated Balance:</span>
                  <span className="text-[#22D3EE] font-bold text-sm">₹{walletBalance.toLocaleString()}</span>
                </div>

                <button
                  onClick={closePaymentModal}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase py-2.5 rounded tracking-wider transition-colors"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}