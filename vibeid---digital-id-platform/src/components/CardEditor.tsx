import React, { useState } from 'react';
import { DigitalIDCard } from '../types';
import { BLANK_AVATAR_URL } from '../data/sampleBadges';
import { 
  User, 
  Briefcase, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Wand2, 
  Sparkles, 
  Palette, 
  Tag, 
  Layers,
  Phone,
  Mail,
  Zap,
  Check
} from 'lucide-react';

interface CardEditorProps {
  card: DigitalIDCard;
  onChange: (updatedCard: DigitalIDCard) => void;
  onOpenCutoutStudio: () => void;
  onGenerateCard?: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  card,
  onChange,
  onOpenCutoutStudio,
  onGenerateCard,
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Field change handler
  const handleChange = (field: keyof DigitalIDCard, value: any) => {
    onChange({
      ...card,
      [field]: value,
    });
  };

  // Direct file upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onChange({
          ...card,
          photoUrl: url,
          originalPhotoUrl: url,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Lanyard field change handler
  const handleLanyardChange = (lanyardField: string, value: any) => {
    onChange({
      ...card,
      lanyard: {
        ...card.lanyard,
        [lanyardField]: value,
      },
    });
  };

  // Trigger Gemini AI Badge Info Generator
  const handleAiEnhance = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-badge-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: `${card.fullName || 'Member'} ${card.role || 'Attendee'} ${card.organization || 'Pass Holder'}`,
          style: card.cardTheme,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onChange({
          ...card,
          fullName: data.suggestedName || card.fullName,
          role: data.suggestedRole || card.role,
          organization: data.suggestedOrg || card.organization,
          clearanceLevel: data.accessClearance || card.clearanceLevel,
          emergencyContact: data.emergencyContact || card.emergencyContact,
        });
      }
    } catch (err) {
      console.error('AI badge info generation error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] text-[#1E293B] space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            Fill Required ID Details
            <span className="text-[10px] bg-[#D9F99D] text-[#0F172A] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Required
            </span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Enter your details below and click &quot;Generate ID Card&quot; to build your pass.
          </p>
        </div>

        {/* Gemini AI Auto Enhance Button */}
        <button
          onClick={handleAiEnhance}
          disabled={isAiLoading}
          className="px-4 py-2 rounded-full bg-[#0F172A] text-white font-semibold text-xs flex items-center gap-2 shadow-sm hover:bg-[#1E293B] transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D9F99D] animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isAiLoading ? 'Enhancing...' : 'AI Profile Enhance'}</span>
        </button>
      </div>

      {/* PHOTO UPLOAD & BACKGROUND CUTOUT BANNER */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl border border-[#CBD5E1] overflow-hidden flex-shrink-0" style={{ backgroundColor: card.photoBgColor || '#8CE600' }}>
            <img src={card.photoUrl || BLANK_AVATAR_URL} alt="Badge photo" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              Holder Photo & Background Removal
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Upload your photo or isolate portrait subject with background cutout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Photo File Upload */}
          <label className="px-3.5 py-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#D9F99D]" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={onOpenCutoutStudio}
            className="px-3.5 py-2 rounded-full bg-[#D9F99D] hover:bg-[#bef264] text-[#0F172A] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Cutout Studio</span>
          </button>
        </div>
      </div>

      {/* FORM INPUT FIELDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#0F172A]" />
            Full Holder Name *
          </label>
          <input
            type="text"
            value={card.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Aryan Chauhan"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Primary Role / Title */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0F172A]" />
            Primary Role / Title *
          </label>
          <input
            type="text"
            value={card.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g. graphic designer."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Top Header Category */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#0F172A]" />
            Top Category Header
          </label>
          <input
            type="text"
            value={card.headerCategory || ''}
            onChange={(e) => handleChange('headerCategory', e.target.value)}
            placeholder="e.g. HACKER HOUSE GOA 2026"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Sub-Role / Designation */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0F172A]" />
            Sub-Role / Designation
          </label>
          <input
            type="text"
            value={card.subRole || ''}
            onChange={(e) => handleChange('subRole', e.target.value)}
            placeholder="e.g. Director of Art"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Organization / Event */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0F172A]" />
            Organization / Event *
          </label>
          <input
            type="text"
            value={card.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="e.g. Hacker House Goa 2026"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Tagline / Quote */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
            Quote / Tagline
          </label>
          <input
            type="text"
            value={card.taglineQuote || ''}
            onChange={(e) => handleChange('taglineQuote', e.target.value)}
            placeholder="e.g. Design is intelligence made visible."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Photo Background Backdrop Color */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#0F172A]" />
            Photo Frame Color
          </label>
          <div className="flex items-center gap-2">
            {[
              { label: 'Lime', value: '#8CE600' },
              { label: 'Crimson', value: '#C81E45' },
              { label: 'Emerald', value: '#0A3825' },
              { label: 'Dark Slate', value: '#0F172A' },
            ].map((col) => (
              <button
                key={col.value}
                type="button"
                onClick={() => handleChange('photoBgColor', col.value)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  card.photoBgColor === col.value ? 'scale-110 border-slate-900 shadow-md' : 'border-white'
                }`}
                style={{ backgroundColor: col.value }}
                title={col.label}
              />
            ))}
            <input
              type="color"
              value={card.photoBgColor || '#8CE600'}
              onChange={(e) => handleChange('photoBgColor', e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
            />
          </div>
        </div>

        {/* Clearance Level */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F172A]" />
            Security Access Level
          </label>
          <select
            value={card.clearanceLevel}
            onChange={(e) => handleChange('clearanceLevel', e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-medium focus:outline-none focus:border-[#0F172A]"
          >
            <option value="Level 1 - Guest">Level 1 - General Attendee</option>
            <option value="Level 2 - Staff">Level 2 - Event Staff</option>
            <option value="Level 3 - Gate & VIP Access">Level 3 - Gate & VIP Access</option>
            <option value="Level 4 - Executive">Level 4 - Executive Security</option>
          </select>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#0F172A]" />
            Emergency Contact Phone
          </label>
          <input
            type="text"
            value={card.emergencyContact || ''}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            placeholder="+1 (555) 019-2834"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-sm font-mono focus:outline-none focus:border-[#0F172A]"
          />
        </div>
      </div>

      {/* THEME SELECTION */}
      <div>
        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#0F172A]" />
          Visual Theme Palette Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Preset 1: Sleek Dark Slate */}
          <button
            onClick={() => handleChange('cardTheme', 'pink-emerald')}
            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              card.cardTheme === 'pink-emerald'
                ? 'border-[#0F172A] bg-[#F1F5F9] ring-2 ring-[#0F172A]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="w-full h-3 rounded-md bg-[#0F172A] mb-1.5 flex items-center justify-end px-1">
              <div className="w-2 h-2 rounded-full bg-[#D9F99D]"></div>
            </div>
            <p className="text-xs font-bold text-[#0F172A]">Sleek Dark Slate</p>
            <span className="text-[9px] text-green-600 font-bold">Lime Accent</span>
          </button>

          {/* Preset 2: Emerald Gold */}
          <button
            onClick={() => handleChange('cardTheme', 'emerald-gold')}
            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              card.cardTheme === 'emerald-gold'
                ? 'border-[#0F172A] bg-[#F1F5F9] ring-2 ring-[#0F172A]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="w-full h-3 rounded-md bg-gradient-to-r from-[#0F172A] to-amber-400 mb-1.5"></div>
            <p className="text-xs font-bold text-[#0F172A]">Slate & Gold Pass</p>
            <span className="text-[9px] text-amber-600 font-bold">VIP Access</span>
          </button>

          {/* Preset 3: Cyber Dark */}
          <button
            onClick={() => handleChange('cardTheme', 'cyber-dark')}
            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              card.cardTheme === 'cyber-dark'
                ? 'border-[#0F172A] bg-[#F1F5F9] ring-2 ring-[#0F172A]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="w-full h-3 rounded-md bg-zinc-800 mb-1.5 border border-slate-600"></div>
            <p className="text-xs font-bold text-[#0F172A]">Cyber Obsidian</p>
            <span className="text-[9px] text-slate-600 font-bold">Executive</span>
          </button>

          {/* Preset 4: Crimson Pass */}
          <button
            onClick={() => handleChange('cardTheme', 'crimson-vip')}
            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              card.cardTheme === 'crimson-vip'
                ? 'border-[#0F172A] bg-[#F1F5F9] ring-2 ring-[#0F172A]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="w-full h-3 rounded-md bg-[#C81E45] mb-1.5"></div>
            <p className="text-xs font-bold text-[#0F172A]">Crimson Gate Pass</p>
            <span className="text-[9px] text-red-600 font-bold">Staff Security</span>
          </button>
        </div>
      </div>

      {/* LANYARD & HARDWARE CONTROLS */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#0F172A]" />
            Lanyard Strap & Attachment Mockup
          </label>
          <button
            onClick={() => handleLanyardChange('enabled', !card.lanyard.enabled)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              card.lanyard.enabled
                ? 'bg-[#0F172A] text-white'
                : 'bg-[#E2E8F0] text-[#64748B]'
            }`}
          >
            {card.lanyard.enabled ? 'LANYARD ENABLED' : 'NO LANYARD'}
          </button>
        </div>

        {card.lanyard.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-[11px] text-[#64748B] font-medium block mb-1">Strap Ribbon Text</span>
              <input
                type="text"
                value={card.lanyard.strapText}
                onChange={(e) => handleLanyardChange('strapText', e.target.value)}
                placeholder="e.g. DIGITAL PASS 2026"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-mono"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] font-medium block mb-1">Metal Carabiner Clip</span>
              <select
                value={card.lanyard.clipColor}
                onChange={(e) => handleLanyardChange('clipColor', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs"
              >
                <option value="silver">Chrome Silver Hook</option>
                <option value="gold">Brushed Gold Hook</option>
                <option value="black">Matte Black Hook</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* GENERATE ID CARD PRIMARY ACTION BUTTON */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (onGenerateCard) onGenerateCard();
          }}
          className="w-full py-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#0F172A]/10 transition-all active:scale-[0.99]"
        >
          <Check className="w-5 h-5 text-[#D9F99D]" />
          <span>Generate ID Card</span>
        </button>
      </div>
    </div>
  );
};
