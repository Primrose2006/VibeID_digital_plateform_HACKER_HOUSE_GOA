import React, { useState } from 'react';
import { DigitalIDCard } from './types';
import { SAMPLE_BADGES, DEFAULT_USER_CARD, BLANK_AVATAR_URL } from './data/sampleBadges';
import { Header } from './components/Header';
import { IDCardPreview } from './components/IDCardPreview';
import { CardEditor } from './components/CardEditor';
import { PhotoCutoutEditor } from './components/PhotoCutoutEditor';
import { RapidScanner } from './components/RapidScanner';
import { VerificationHub } from './components/VerificationHub';
import { DirectoryDashboard } from './components/DirectoryDashboard';
import { 
  Sparkles, 
  CreditCard, 
  Wand2, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Zap,
  RotateCw
} from 'lucide-react';

export default function App() {
  const [userCard, setUserCard] = useState<DigitalIDCard>(DEFAULT_USER_CARD);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'cutout' | 'scanner' | 'verify'>('studio');

  // Update card state
  const handleUpdateCard = (updated: DigitalIDCard) => {
    setUserCard(updated);
  };

  // Generate ID Card Action
  const handleGenerateCard = () => {
    const passId = userCard.id === 'PASS-2026-0001' || !userCard.id
      ? `HHG-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : userCard.id;

    const updatedCard: DigitalIDCard = {
      ...userCard,
      id: passId,
      fullName: userCard.fullName || 'Aryan Chauhan',
      role: userCard.role || 'graphic designer.',
      headerCategory: userCard.headerCategory || 'HACKER HOUSE GOA 2026',
      subRole: userCard.subRole || 'Director of Art',
      organization: userCard.organization || 'Hacker House Goa 2026',
      taglineQuote: userCard.taglineQuote || 'Design is intelligence made visible.',
      photoBgColor: userCard.photoBgColor || '#8CE600',
      status: 'active',
      securityHash: userCard.securityHash && userCard.securityHash !== '0x00000000000000'
        ? userCard.securityHash
        : `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      qrCodeData: `VERIFIED:${passId}:${userCard.fullName || 'AryanChauhan'}:${userCard.clearanceLevel}:2026`,
    };

    setUserCard(updatedCard);
    setIsGenerated(true);
  };

  // Apply cutout photo from Background Removal Studio
  const handleApplyCutoutPhoto = (processedUrl: string, bgColor: string, originalUrl?: string) => {
    const updated: DigitalIDCard = {
      ...userCard,
      photoUrl: processedUrl,
      originalPhotoUrl: originalUrl || userCard.originalPhotoUrl,
      photoBgColor: bgColor,
    };
    handleUpdateCard(updated);
    setActiveTab('studio');
  };

  // Reset or Issue New Blank Digital ID
  const handleIssueNewBadge = () => {
    const newId = `HHG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBadge: DigitalIDCard = {
      id: newId,
      fullName: 'Aryan Chauhan',
      role: 'graphic designer.',
      headerCategory: 'HACKER HOUSE GOA 2026',
      subRole: 'Director of Art',
      organization: 'Hacker House Goa 2026',
      taglineQuote: 'Design is intelligence made visible.',
      eventYear: '2026',
      photoUrl: BLANK_AVATAR_URL,
      originalPhotoUrl: BLANK_AVATAR_URL,
      photoBgColor: '#8CE600',
      cardTheme: 'lime-cream',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      clearanceLevel: 'Level 3 - Gate & VIP Access',
      securityHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      qrCodeData: '',
      status: 'pending',
      scanCount: 0,
      emergencyContact: '+1 (555) 019-2834',
      lanyard: {
        enabled: true,
        strapText: 'HACKER HOUSE GOA 2026',
        strapColor: '#A3E635',
        clipColor: 'silver',
      },
    };

    setUserCard(newBadge);
    setIsGenerated(false);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col selection:bg-[#D9F99D] selection:text-[#0F172A]">
      {/* HEADER NAVBAR */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        onNewBadge={handleIssueNewBadge}
        totalCardsCount={1}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* TAB 1: ID BADGE STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* ACTION BANNER FOR STATUS */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isGenerated ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  {isGenerated ? (
                    <>
                      Generated Pass: <span className="underline decoration-[#D9F99D] decoration-2">{userCard.fullName}</span> ({userCard.id})
                    </>
                  ) : (
                    <>Fill Required Details Below & Click &quot;Generate ID Card&quot;</>
                  )}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('cutout')}
                className="text-xs font-bold text-[#0F172A] hover:text-black flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Background Removal Studio</span>
              </button>
            </div>

            {/* SUCCESS BANNER IF GENERATED */}
            {isGenerated && (
              <div className="bg-[#0F172A] text-white rounded-2xl p-4 border border-[#334155] flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D9F99D] text-[#0F172A] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      ID Card Generated Successfully!
                    </h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      Your digital ID pass with scannable QR code is ready. Use controls below to flip or download.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#D9F99D] text-[#0F172A] font-extrabold px-3 py-1 rounded-full uppercase">
                  VERIFIED ACTIVE PASS
                </span>
              </div>
            )}

            {/* STUDIO SPLIT LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: 3D DIGITAL LANYARD BADGE PREVIEW (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-6 md:p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-[-80px] right-[-80px] w-56 h-56 bg-[#D9F99D] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-[#38BDF8] opacity-10 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="mb-4 text-center relative z-10">
                  <span className="text-[10px] font-bold text-[#D9F99D] uppercase tracking-widest block mb-1">
                    {isGenerated ? 'Official Digital Pass • Generated' : 'Pass Draft Preview'}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {userCard.fullName || 'Your Name Here'}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-medium">{userCard.organization || 'Your Organization'}</p>
                </div>

                {/* ID Card 3D Component */}
                <IDCardPreview
                  card={userCard}
                  showControls={true}
                  onVerifyClick={() => setActiveTab('verify')}
                />
              </div>

              {/* RIGHT: LIVE CARD EDITOR & FORM CUSTOMIZER (7 cols) */}
              <div className="lg:col-span-7">
                <CardEditor
                  card={userCard}
                  onChange={handleUpdateCard}
                  onOpenCutoutStudio={() => setActiveTab('cutout')}
                  onGenerateCard={handleGenerateCard}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BACKGROUND CUTOUT STUDIO */}
        {activeTab === 'cutout' && (
          <PhotoCutoutEditor
            currentPhotoUrl={userCard.originalPhotoUrl || userCard.photoUrl}
            currentColor={userCard.photoBgColor || '#0F172A'}
            onApplyPhoto={handleApplyCutoutPhoto}
            onClose={() => setActiveTab('studio')}
          />
        )}

        {/* TAB 3: RAPID SCANNER & GATE CHECK-IN */}
        {activeTab === 'scanner' && (
          <RapidScanner
            allCards={[userCard]}
            onScanCard={(scanned) => handleUpdateCard(scanned)}
          />
        )}

        {/* TAB 4: SECURITY & VERIFICATION HUB */}
        {activeTab === 'verify' && (
          <VerificationHub
            card={userCard}
            onUpdateCard={handleUpdateCard}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B] font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9F99D] border border-[#0F172A]"></span>
            <span className="font-semibold text-[#0F172A]">VibeID Digital Pass Platform</span>
            <span>— Level 4 Encryption & Biometric Hub</span>
          </div>
          <div className="text-[#94A3B8] text-[11px]">
            <span>Theme: Sleek Interface • Dark Slate & Lime Accent (#0F172A / #D9F99D)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
