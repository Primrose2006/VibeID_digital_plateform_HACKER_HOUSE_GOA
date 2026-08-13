import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import { DigitalIDCard } from '../types';
import { BLANK_AVATAR_URL } from '../data/sampleBadges';
import { BarcodeSVG } from './BarcodeSVG';
import { 
  RotateCw, 
  Download, 
  ShieldCheck, 
  Wifi, 
  Lock,
  Sparkles,
  PenTool,
  Type,
  Crop,
  Star
} from 'lucide-react';

interface IDCardPreviewProps {
  card: DigitalIDCard;
  isFlipped?: boolean;
  onFlipToggle?: () => void;
  scale?: number;
  showControls?: boolean;
  onVerifyClick?: () => void;
}

export const IDCardPreview: React.FC<IDCardPreviewProps> = ({
  card,
  isFlipped: externalFlipped,
  onFlipToggle,
  scale = 1.0,
  showControls = true,
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isFlipped = externalFlipped !== undefined ? externalFlipped : internalFlipped;

  const handleFlip = () => {
    if (onFlipToggle) {
      onFlipToggle();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  // Generate high-contrast, fully scannable QR Code Data URL
  useEffect(() => {
    async function generateQR() {
      try {
        const scannablePayload = `VERIFIED DIGITAL PASS
Holder: ${card.fullName || 'Aryan Chauhan'}
ID: ${card.id}
Role: ${card.role || 'graphic designer.'}
Sub-Role: ${card.subRole || 'Director of Art'}
Organization: ${card.organization || 'Hacker House Goa 2026'}
Clearance: ${card.clearanceLevel}
Status: ${card.status.toUpperCase()}
Valid Thru: ${card.expiryDate}
Security Hash: ${card.securityHash || '0x3D88C21EA74F19'}
Verification URL: https://vibeid.app/verify/${card.id}`;

        const url = await QRCode.toDataURL(scannablePayload, {
          width: 380,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#0F172A', // High contrast dark slate
            light: '#FFFFFF', // Clean white quiet zone
          },
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    }
    generateQR();
  }, [card]);

  const exportRef = useRef<HTMLDivElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

  // Handle 3D card tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Download high-resolution PNG showing Front, Back, or Both
  const handleDownloadImage = async (mode: 'both' | 'front' | 'back' = 'both') => {
    setIsDownloading(true);
    try {
      let targetRef = exportRef;
      let filenameSuffix = 'Front_and_Back';

      if (mode === 'front') {
        targetRef = exportFrontRef;
        filenameSuffix = 'Front_Side';
      } else if (mode === 'back') {
        targetRef = exportBackRef;
        filenameSuffix = 'Back_Side';
      }

      if (targetRef.current) {
        const dataUrl = await toPng(targetRef.current, {
          quality: 0.98,
          pixelRatio: 2,
          cacheBust: true,
        });

        const link = document.createElement('a');
        const safeName = (card.fullName || 'ID_Card').replace(/\s+/g, '_');
        link.download = `${safeName}_Digital_ID_${filenameSuffix}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('html-to-image download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const tiltStyle = isHovered && !isDownloading
    ? {
        transform: `perspective(1000px) rotateY(${isFlipped ? 180 + mousePos.x * 20 : mousePos.x * 20}deg) rotateX(${-mousePos.y * 20}deg)`,
      }
    : {
        transform: `perspective(1000px) rotateY(${isFlipped ? 180 : 0}deg)`,
      };

  return (
    <div className="flex flex-col items-center select-none" style={{ transform: `scale(${scale})` }}>
      {/* LANYARD ASSEMBLY (Matching Reference Image) */}
      {card.lanyard?.enabled && (
        <div className="flex flex-col items-center z-20 -mb-5 pointer-events-none transition-all duration-300">
          {/* Top Lime Green Strap Ribbon */}
          <div 
            className="w-14 h-24 rounded-t-sm shadow-xl flex flex-col items-center justify-between p-2 overflow-hidden border-x border-black/10 relative"
            style={{ backgroundColor: card.lanyard.strapColor || '#A3E635' }}
          >
            {/* Star symbol on strap as seen in reference image */}
            <div className="w-5 h-5 flex items-center justify-center text-black font-black">
              <Star className="w-4 h-4 fill-black text-black" />
            </div>
            
            <div className="text-[10px] font-black tracking-widest text-black uppercase rotate-90 whitespace-nowrap font-mono">
              {card.lanyard.strapText || card.organization || 'HACKER HOUSE GOA 2026'}
            </div>

            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-400"></div>
          </div>

          {/* Metal Ring & Silver Swivel Hook Clip */}
          <div className="relative -mt-2 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full border-4 border-slate-300 bg-slate-700 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900 shadow-inner"></div>
            </div>
            <div className="w-5.5 h-8 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-300 rounded-b-md shadow-lg border border-slate-400 -mt-1 flex items-center justify-center">
              <div className="w-1.5 h-4 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* CARD WRAPPER WITH 3D FLIP CONTAINER */}
      <div className="relative w-[340px] h-[520px] perspective-1000 my-2">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="w-full h-full duration-500 transform-style-3d cursor-pointer shadow-2xl rounded-[30px] relative transition-transform ease-out"
          onClick={handleFlip}
        >
          {/* ==================== FRONT SIDE (EXACT TEMPLATE MATCH) ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-[30px] bg-[#F6F5ED] backface-hidden p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-[#E5E5D8] text-[#111111] relative">
            
            {/* Slot / Hole Punch at Top Center */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-[#111111] rounded-full border border-black/20 z-30 flex items-center justify-center">
              <div className="w-8 h-1.5 bg-[#F6F5ED] rounded-full"></div>
            </div>

            {/* TOP BRAND HEADER */}
            <div className="pt-4 z-10">
              <p className="text-[12px] font-bold text-[#333333] opacity-80 tracking-widest font-mono uppercase leading-none">
                {card.headerCategory || 'HACKER HOUSE GOA 2026'}
              </p>
              <h1 className="text-[25px] font-black tracking-tight text-[#111111] leading-none mt-1 font-sans flex items-baseline">
                {card.role || 'graphic designer'}
                <span className="text-[#8CE600] text-3xl font-black inline-block ml-0.5 leading-none">.</span>
              </h1>
            </div>

            {/* MIDDLE PHOTO SECTION WITH SIDE TOOL ICONS */}
            <div className="relative my-auto flex items-center justify-between gap-3 z-10 pt-1">
              {/* Left Side Tool Badges & Vertical Line */}
              <div className="flex flex-col items-center gap-2.5 py-1 border-r border-[#D1D5DB] pr-3">
                {/* Ps badge */}
                <div className="w-5.5 h-5.5 rounded bg-[#111111] text-white text-[10px] font-extrabold flex items-center justify-center font-mono shadow-xs">
                  Ps
                </div>
                {/* Ai badge */}
                <div className="w-5.5 h-5.5 rounded bg-[#8CE600] text-[#111111] text-[10px] font-black flex items-center justify-center font-mono shadow-xs">
                  Ai
                </div>
                {/* Pen nib */}
                <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center">
                  <PenTool className="w-3 h-3 text-[#111111]" />
                </div>
                {/* Type tool */}
                <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center">
                  <Type className="w-3 h-3 text-[#111111]" />
                </div>
                {/* Crop tool */}
                <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center">
                  <Crop className="w-3 h-3 text-[#111111]" />
                </div>
              </div>

              {/* Center Portrait Box with Signature Lime Green Backdrop */}
              <div 
                className="relative w-[210px] h-[210px] rounded-[24px] flex items-center justify-center overflow-hidden shadow-md border border-black/5"
                style={{ backgroundColor: card.photoBgColor || '#8CE600' }}
              >
                <img
                  src={card.photoUrl || BLANK_AVATAR_URL}
                  alt={card.fullName}
                  className="w-full h-full object-cover object-center relative z-10 transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = BLANK_AVATAR_URL;
                  }}
                />

                {/* Verified Shield Badge */}
                <div className="absolute top-2 right-2 z-20 bg-[#111111] text-[#8CE600] rounded-full p-1 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8CE600]" />
                </div>
              </div>
            </div>

            {/* NAME & SUB-ROLE WITH SIGNATURE LIME HIGHLIGHT STRIP */}
            <div className="z-10 pt-1">
              <div className="relative inline-block">
                {/* Lime highlight bar behind name */}
                <span className="bg-[#8CE600] px-2.5 py-0.5 rounded-sm text-[#111111] font-black text-xl tracking-tight leading-tight block shadow-2xs">
                  {card.fullName || 'Aryan Chauhan'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#444444] mt-1 tracking-tight">
                {card.subRole || 'Director of Art'}
              </p>
            </div>

            {/* BOTTOM BARCODE & QUOTE SECTION */}
            <div className="z-10 pt-3 border-t border-[#E5E5D8] flex items-center justify-between gap-3">
              {/* Left: Barcode */}
              <div className="w-28 flex flex-col items-start">
                <BarcodeSVG value={card.id} height={32} width={100} color="#111111" />
              </div>

              {/* Center Divider */}
              <div className="w-[1px] h-8 bg-[#D1D5DB]"></div>

              {/* Right: Tagline / Quote */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[10px] font-semibold text-[#333333] leading-tight">
                  {card.taglineQuote || 'Design is intelligence made visible.'}
                </p>
              </div>

              {/* Bottom Right Starburst Icon */}
              <div className="flex-shrink-0 text-[#8CE600]">
                <Sparkles className="w-5 h-5 text-[#8CE600] fill-[#8CE600]" />
              </div>
            </div>

            {/* Flip Hint */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-500 tracking-wider flex items-center gap-1">
              <RotateCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} />
              CLICK TO FLIP TO WHITE REVERSE SIDE
            </div>
          </div>

          {/* ==================== BACK SIDE (WHITE BACKGROUND WITH QR & BARCODE) ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-[30px] bg-white rotate-y-180 backface-hidden p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
            
            {/* Top Hole Punch Slot */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-slate-900 rounded-full border border-slate-300 z-30 flex items-center justify-center">
              <div className="w-8 h-1.5 bg-white rounded-full"></div>
            </div>

            {/* BACK SIDE HEADER */}
            <div className="pt-4 flex justify-between items-center z-10 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                  {card.organization || 'HACKER HOUSE GOA 2026'}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono font-bold">
                  OFFICIAL ACCESS PASS & CREDENTIAL
                </p>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-[#8CE600] text-slate-900 text-[10px] font-extrabold font-mono tracking-wider flex items-center gap-1 shadow-2xs">
                <Lock className="w-3 h-3 text-slate-900" />
                VERIFIED
              </div>
            </div>

            {/* CENTER HIGH-CONTRAST SCANNABLE QR CODE */}
            <div className="relative my-auto flex flex-col items-center justify-center z-10">
              <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md flex items-center justify-center">
                {/* Target Corners */}
                <div className="absolute top-1 left-1 w-5 h-5 border-t-3 border-l-3 border-[#8CE600]"></div>
                <div className="absolute top-1 right-1 w-5 h-5 border-t-3 border-r-3 border-[#8CE600]"></div>
                <div className="absolute bottom-1 left-1 w-5 h-5 border-b-3 border-l-3 border-[#8CE600]"></div>
                <div className="absolute bottom-1 right-1 w-5 h-5 border-b-3 border-r-3 border-[#8CE600]"></div>

                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Digital ID QR Code"
                    className="w-40 h-40 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-slate-900 font-mono text-xs">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-slate-900">
                <Wifi className="w-3.5 h-3.5 text-green-600 animate-pulse" />
                <span>SCANNABLE PASS & NFC READY</span>
              </div>
            </div>

            {/* BACK SIDE BOTTOM BARCODE & SECURITY METADATA */}
            <div className="z-10 pt-2 border-t border-slate-200">
              {/* Clean Barcode */}
              <div className="mb-2 bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center justify-center">
                <BarcodeSVG value={card.id} height={36} color="#0F172A" showText={true} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
                <div>
                  <span className="opacity-70 block text-[9px]">SECURITY HASH</span>
                  <span className="font-bold text-slate-900">{card.securityHash || '0x3D88C21EA74F19'}</span>
                </div>
                <div className="text-right">
                  <span className="opacity-70 block text-[9px]">EMERGENCY CONTACT</span>
                  <span className="font-bold text-slate-900">{card.emergencyContact || '+1 (555) 019-2834'}</span>
                </div>
              </div>
            </div>

            {/* Back side click hint */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-400 tracking-wider">
              CLICK TO FLIP FRONT SIDE
            </div>
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS UNDER CARD */}
      {showControls && (
        <div className="mt-4 flex flex-col items-center gap-2.5 z-30">
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              onClick={handleFlip}
              className="px-4 py-2.5 rounded-full bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold flex items-center gap-2 shadow-sm border border-white/10 transition-all active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#8CE600]" />
              <span>{isFlipped ? 'Show Front' : 'Flip to Back (QR & Barcode)'}</span>
            </button>

            <button
              onClick={() => handleDownloadImage('both')}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-full bg-[#8CE600] hover:bg-[#9EF01A] text-[#111111] text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#111111]" />
              <span>{isDownloading ? 'Exporting...' : 'Download Both (Front & Back)'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px] uppercase">Single Side Downloads:</span>
            <button
              onClick={() => handleDownloadImage('front')}
              disabled={isDownloading}
              className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              Front Side PNG
            </button>
            <button
              onClick={() => handleDownloadImage('back')}
              disabled={isDownloading}
              className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              Back Side PNG
            </button>
          </div>
        </div>
      )}

      {/* HIDDEN CONTAINER FOR HIGH-RES FRONT & BACK COMPOSITE PNG EXPORT */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none" aria-hidden="true">
        <div
          ref={exportRef}
          className="w-[820px] p-8 bg-[#0F172A] text-white rounded-[32px] border border-[#334155] flex flex-col gap-6 shadow-2xl font-sans"
        >
          {/* Export Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8CE600] text-[#111111] flex items-center justify-center font-black text-lg shadow-sm">
                PASS
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white uppercase">
                  {card.organization || 'HACKER HOUSE GOA 2026'}
                </h2>
                <p className="text-xs text-[#94A3B8] font-mono">
                  VERIFIED DIGITAL PASS • EXPORTED FRONT & REVERSE SIDE
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-[#8CE600] text-[#111111] text-xs font-extrabold uppercase tracking-wider">
                {card.clearanceLevel.split('-')[0]}
              </span>
              <p className="text-[11px] text-[#94A3B8] font-mono mt-1">ID: {card.id}</p>
            </div>
          </div>

          {/* Side-by-Side Cards Display */}
          <div className="flex items-center justify-center gap-8">
            {/* FRONT CARD (CREAM) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#8CE600] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8CE600]" />
                FRONT SIDE
              </span>

              <div
                ref={exportFrontRef}
                className="w-[340px] h-[520px] rounded-[30px] bg-[#F6F5ED] p-6 flex flex-col justify-between overflow-hidden shadow-xl border border-[#E5E5D8] text-[#111111] relative"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-[#111111] rounded-full border border-black/20 z-30 flex items-center justify-center">
                  <div className="w-8 h-1.5 bg-[#F6F5ED] rounded-full"></div>
                </div>

                <div className="pt-4 z-10">
                  <p className="text-[12px] font-bold text-[#333333] opacity-80 tracking-widest font-mono uppercase leading-none">
                    {card.headerCategory || 'HACKER HOUSE GOA 2026'}
                  </p>
                  <h1 className="text-[25px] font-black tracking-tight text-[#111111] leading-none mt-1 font-sans flex items-baseline">
                    {card.role || 'graphic designer'}
                    <span className="text-[#8CE600] text-3xl font-black inline-block ml-0.5 leading-none">.</span>
                  </h1>
                </div>

                <div className="relative my-auto flex items-center justify-between gap-3 z-10 pt-1">
                  <div className="flex flex-col items-center gap-2.5 py-1 border-r border-[#D1D5DB] pr-3">
                    <div className="w-5.5 h-5.5 rounded bg-[#111111] text-white text-[10px] font-extrabold flex items-center justify-center font-mono">Ps</div>
                    <div className="w-5.5 h-5.5 rounded bg-[#8CE600] text-[#111111] text-[10px] font-black flex items-center justify-center font-mono">Ai</div>
                    <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center"><PenTool className="w-3 h-3 text-[#111111]" /></div>
                    <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center"><Type className="w-3 h-3 text-[#111111]" /></div>
                    <div className="w-5.5 h-5.5 rounded bg-[#E5E7EB] text-[#111111] flex items-center justify-center"><Crop className="w-3 h-3 text-[#111111]" /></div>
                  </div>

                  <div 
                    className="relative w-[210px] h-[210px] rounded-[24px] flex items-center justify-center overflow-hidden shadow-md border border-black/5"
                    style={{ backgroundColor: card.photoBgColor || '#8CE600' }}
                  >
                    <img 
                      src={card.photoUrl || BLANK_AVATAR_URL} 
                      alt={card.fullName} 
                      className="w-full h-full object-cover object-center relative z-10" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = BLANK_AVATAR_URL;
                      }}
                    />
                  </div>
                </div>

                <div className="z-10 pt-1">
                  <span className="bg-[#8CE600] px-2.5 py-0.5 rounded-sm text-[#111111] font-black text-xl tracking-tight leading-tight block">
                    {card.fullName || 'Aryan Chauhan'}
                  </span>
                  <p className="text-xs font-semibold text-[#444444] mt-1 tracking-tight">
                    {card.subRole || 'Director of Art'}
                  </p>
                </div>

                <div className="z-10 pt-3 border-t border-[#E5E5D8] flex items-center justify-between gap-3">
                  <div className="w-28 flex flex-col items-start">
                    <BarcodeSVG value={card.id} height={32} width={100} color="#111111" />
                  </div>
                  <div className="w-[1px] h-8 bg-[#D1D5DB]"></div>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-[10px] font-semibold text-[#333333] leading-tight">
                      {card.taglineQuote || 'Design is intelligence made visible.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK CARD (WHITE) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8CE600]" />
                REVERSE SIDE
              </span>

              <div
                ref={exportBackRef}
                className="w-[340px] h-[520px] rounded-[30px] bg-white p-6 flex flex-col justify-between overflow-hidden shadow-xl border border-slate-200 text-slate-900 relative"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-slate-900 rounded-full border border-slate-300 z-30 flex items-center justify-center">
                  <div className="w-8 h-1.5 bg-white rounded-full"></div>
                </div>

                <div className="pt-4 flex justify-between items-center z-10 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                      {card.organization || 'HACKER HOUSE GOA 2026'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono font-bold">
                      OFFICIAL ACCESS PASS & CREDENTIAL
                    </p>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-[#8CE600] text-slate-900 text-[10px] font-extrabold font-mono tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-900" />
                    VERIFIED
                  </div>
                </div>

                <div className="relative my-auto flex flex-col items-center justify-center z-10">
                  <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md flex items-center justify-center">
                    <div className="absolute top-1 left-1 w-5 h-5 border-t-3 border-l-3 border-[#8CE600]"></div>
                    <div className="absolute top-1 right-1 w-5 h-5 border-t-3 border-r-3 border-[#8CE600]"></div>
                    <div className="absolute bottom-1 left-1 w-5 h-5 border-b-3 border-l-3 border-[#8CE600]"></div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 border-b-3 border-r-3 border-[#8CE600]"></div>

                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="Digital ID QR Code" className="w-40 h-40 object-contain rounded-md" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-slate-900 font-mono text-xs">Generating QR...</div>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-slate-900">
                    <Wifi className="w-3.5 h-3.5 text-green-600 animate-pulse" />
                    <span>SCANNABLE PASS & NFC READY</span>
                  </div>
                </div>

                <div className="z-10 pt-2 border-t border-slate-200">
                  <div className="mb-2 bg-slate-50 rounded-lg p-2 border border-slate-200 flex flex-col items-center justify-center">
                    <BarcodeSVG value={card.id} height={36} color="#0F172A" showText={true} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600">
                    <div>
                      <span className="opacity-70 block text-[9px]">SECURITY HASH</span>
                      <span className="font-bold text-slate-900">{card.securityHash || '0x3D88C21EA74F19'}</span>
                    </div>
                    <div className="text-right">
                      <span className="opacity-70 block text-[9px]">EMERGENCY CONTACT</span>
                      <span className="font-bold text-slate-900">{card.emergencyContact || '+1 (555) 019-2834'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Footer */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#94A3B8] font-mono">
            <span>DIGITAL ID CARD SYSTEM • HIGH RESOLUTION EXPORT</span>
            <span>TIMESTAMP: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


