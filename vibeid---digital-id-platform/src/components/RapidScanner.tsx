import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DigitalIDCard, ScanLogItem } from '../types';
import { 
  QrCode, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Camera, 
  Clock, 
  UserCheck, 
  Building2,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

interface RapidScannerProps {
  allCards: DigitalIDCard[];
  onScanCard?: (card: DigitalIDCard) => void;
}

export const RapidScanner: React.FC<RapidScannerProps> = ({
  allCards,
  onScanCard,
}) => {
  const [selectedGate, setSelectedGate] = useState<string>('Gate A — Main Access Portal');
  const [scannedResult, setScannedResult] = useState<DigitalIDCard | null>(allCards[0] || null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'granted' | 'denied'>('granted');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanLog, setScanLog] = useState<ScanLogItem[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cardId: allCards[0]?.id || 'HH-2026-8892',
      holderName: allCards[0]?.fullName || 'Jenny Nguyen',
      role: allCards[0]?.role || 'Lead Developer & Event Architect',
      organization: allCards[0]?.organization || 'HACKER HOUSE 2026',
      gateLocation: 'Gate A — Main Access Portal',
      status: 'granted',
      clearanceLevel: 'Level 3 - VIP Access',
    },
  ]);

  // Play audio chime for scan result
  const playSound = (isSuccess: boolean) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        // High dual pitch chime for access granted
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Low buzz for denied
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio not permitted without interaction
    }
  };

  // Trigger scan action for a specific badge
  const triggerScan = (card: DigitalIDCard) => {
    setScanStatus('scanning');
    setScannedResult(null);

    setTimeout(() => {
      const isAllowed = card.status === 'active';
      setScannedResult(card);
      setScanStatus(isAllowed ? 'granted' : 'denied');
      playSound(isAllowed);

      if (isAllowed) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00FF88', '#FF85A2', '#C81E45'],
        });
      }

      // Append to scan log
      const newLogItem: ScanLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cardId: card.id,
        holderName: card.fullName,
        role: card.role,
        organization: card.organization,
        gateLocation: selectedGate,
        status: isAllowed ? 'granted' : 'denied',
        clearanceLevel: card.clearanceLevel,
      };

      setScanLog((prev) => [newLogItem, ...prev.slice(0, 15)]);
      if (onScanCard) onScanCard(card);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* SCANNER CONTROL BAR */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            Rapid Gate Check-in & QR Scanner
            <span className="text-[10px] bg-[#D9F99D] text-[#0F172A] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Real-time Access
            </span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Simulate or scan event badges for rapid gate clearance and access logging.
          </p>
        </div>

        {/* Gate Location Selector & Sound Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-[#0F172A]"
          >
            <option value="Gate A — Main Access Portal">Gate A — Main Access Portal</option>
            <option value="VIP Lounge & Creator Stage">VIP Lounge & Creator Stage</option>
            <option value="Hacker House Hackathon Zone">Hacker House Hackathon Zone</option>
            <option value="Executive Briefing Room">Executive Briefing Room</option>
          </select>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
            }`}
            title="Toggle Scan Audio Chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D9F99D]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCANNER RETICLE STAGE (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0F172A] text-white rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center relative min-h-[380px] shadow-2xl overflow-hidden">
            
            {/* Corner Bracket Reticle */}
            <div className="relative w-64 h-64 rounded-3xl bg-black/40 border border-white/20 flex flex-col items-center justify-center p-4 backdrop-blur-xs">
              
              {/* Animated Scan Line */}
              {scanStatus === 'scanning' && (
                <div className="absolute inset-x-2 h-1 bg-[#D9F99D] shadow-[0_0_15px_#D9F99D] animate-scan z-30"></div>
              )}

              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-[#D9F99D] rounded-tl-xl"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-[#D9F99D] rounded-tr-xl"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-[#D9F99D] rounded-bl-xl"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-[#D9F99D] rounded-br-xl"></div>

              {/* Scanner Graphic Icon or Scanned Card Preview */}
              {scanStatus === 'scanning' ? (
                <div className="flex flex-col items-center gap-2 text-white">
                  <RefreshCw className="w-10 h-10 animate-spin text-[#D9F99D]" />
                  <span className="font-bold text-xs uppercase tracking-widest text-[#D9F99D]">
                    DECODING PASSPORT...
                  </span>
                </div>
              ) : scannedResult ? (
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 rounded-full border-2 border-white/40 overflow-hidden mb-2 bg-[#0F172A] shadow-lg">
                    <img
                      src={scannedResult.photoUrl}
                      alt={scannedResult.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-white text-sm">{scannedResult.fullName}</h3>
                  <p className="text-[11px] text-[#94A3B8]">{scannedResult.role}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center gap-2 text-white/60">
                  <QrCode className="w-16 h-16 text-[#D9F99D]/60" />
                  <p className="text-xs font-semibold">POSITION QR CODE IN TARGET</p>
                </div>
              )}
            </div>

            {/* Scan Feedback Banner */}
            <div className="mt-5 w-full">
              {scanStatus === 'granted' && (
                <div className="w-full py-3 px-4 rounded-full bg-[#D9F99D] text-[#0F172A] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />
                  <span>ACCESS GRANTED — VERIFIED LEVEL 3</span>
                </div>
              )}

              {scanStatus === 'denied' && (
                <div className="w-full py-3 px-4 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <XCircle className="w-5 h-5 text-white" />
                  <span>ACCESS DENIED — PASS REVOKED OR EXPIRED</span>
                </div>
              )}

              {scanStatus === 'scanning' && (
                <div className="w-full py-3 px-4 rounded-full bg-[#1E293B] text-[#94A3B8] font-mono text-xs text-center border border-white/10">
                  Reading Cryptographic Security Signature...
                </div>
              )}
            </div>
          </div>

          {/* SIMULATE SCAN TRIGGER BUTTONS */}
          <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-sm">
            <p className="text-xs font-bold text-[#0F172A] mb-2.5">
              Click below to test instant QR pass clearance:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {allCards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => triggerScan(c)}
                  className="p-3 rounded-2xl bg-[#0F172A] text-white hover:bg-[#1E293B] border border-[#334155] text-left flex items-center justify-between gap-3 transition-all active:scale-95 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border border-white/20">
                      <img src={c.photoUrl} alt={c.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{c.fullName}</p>
                      <p className="text-[10px] text-[#D9F99D] font-mono truncate">ID: {c.id} • {c.clearanceLevel.split('-')[0]}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#D9F99D] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 flex-shrink-0">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan Pass</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACCESS AUDIT LOG TABLE (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-[#0F172A] text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0F172A]" />
                Live Gate Entry Audit Log
              </h3>
              <span className="text-xs text-[#64748B] font-semibold">
                {scanLog.length} Scans Logged
              </span>
            </div>

            {/* Log Table */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {scanLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                        log.status === 'granted'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {log.status === 'granted' ? <UserCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-[#0F172A] truncate">{log.holderName}</p>
                      <p className="text-[10px] text-[#64748B] truncate">
                        {log.role} • {log.organization}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-0.5 ${
                        log.status === 'granted'
                          ? 'bg-[#D9F99D] text-[#0F172A]'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {log.status}
                    </span>
                    <p className="text-[10px] text-[#94A3B8] font-mono">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span>Location: {selectedGate}</span>
            <span className="flex items-center gap-1.5 text-green-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Gateway Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
