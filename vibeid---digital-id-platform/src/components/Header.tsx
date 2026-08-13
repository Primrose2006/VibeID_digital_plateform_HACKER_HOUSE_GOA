import React from 'react';
import { 
  Building2, 
  CreditCard, 
  Wand2, 
  QrCode, 
  ShieldCheck, 
  Users, 
  Plus, 
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewBadge: () => void;
  totalCardsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNewBadge,
  totalCardsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* BRAND LOGO & TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9F99D] text-[#0F172A] flex items-center justify-center font-bold text-xl shadow-sm">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl tracking-tight text-white leading-none">
                Vibe<span className="text-[#D9F99D]">ID</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D9F99D] text-[#0F172A] text-[10px] font-black uppercase tracking-wider">
                V2 VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium leading-tight">
              Digital Identity Hub & Security Verification
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex items-center gap-1.5 bg-[#1E293B] p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto">
          {/* ID Badge Studio Tab */}
          <button
            onClick={() => onTabChange('studio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-[#D9F99D] text-[#0F172A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ID Card Studio</span>
          </button>

          {/* Background Cutout Studio */}
          <button
            onClick={() => onTabChange('cutout')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'cutout'
                ? 'bg-[#D9F99D] text-[#0F172A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#D9F99D]" />
            <span>Photo Cutout</span>
          </button>

          {/* Rapid Scanner */}
          <button
            onClick={() => onTabChange('scanner')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-[#D9F99D] text-[#0F172A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#D9F99D]" />
            <span>Gate Scanner</span>
          </button>

          {/* Security Verification */}
          <button
            onClick={() => onTabChange('verify')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'verify'
                ? 'bg-[#D9F99D] text-[#0F172A] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Audit</span>
          </button>
        </nav>

        {/* ISSUE NEW ID BUTTON */}
        <button
          onClick={onNewBadge}
          className="px-4 py-2 rounded-full bg-[#D9F99D] hover:bg-[#bef264] text-[#0F172A] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#0F172A]" />
          <span>Issue ID</span>
        </button>
      </div>
    </header>
  );
};
