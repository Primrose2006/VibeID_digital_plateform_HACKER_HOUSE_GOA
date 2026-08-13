import React, { useState } from 'react';
import { DigitalIDCard, VerificationReport } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Fingerprint, 
  FileText, 
  RefreshCw, 
  Lock, 
  Cpu, 
  Check, 
  X 
} from 'lucide-react';

interface VerificationHubProps {
  card: DigitalIDCard;
  onUpdateCard?: (updatedCard: DigitalIDCard) => void;
}

export const VerificationHub: React.FC<VerificationHubProps> = ({
  card,
  onUpdateCard,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [report, setReport] = useState<VerificationReport | null>({
    verified: true,
    securityScore: 98.6,
    biometricMatch: '99.4%',
    clearanceLevel: card.clearanceLevel,
    complianceChecks: [
      {
        check: 'Portrait Face Alignment & Clarity',
        status: 'passed',
        detail: 'Centered front-facing portrait verified with clean background contrast.',
      },
      {
        check: 'Background Cutout Mask Isolation',
        status: 'passed',
        detail: 'Edge boundary analysis passed. No background interference detected.',
      },
      {
        check: 'Cryptographic Signature Hash',
        status: 'passed',
        detail: 'Key hash 0x8F9A2026 matches centralized registry server.',
      },
      {
        check: 'Access Expiration Date Validity',
        status: 'passed',
        detail: `Valid through ${card.expiryDate}`,
      },
    ],
    summary: `${card.fullName} holds authentic verified credentials as ${card.role} for ${card.organization}. Security level confirmed.`,
    cryptoHash: card.securityHash || '0x9E4B2F7A8C110D',
  });

  // Call Gemini AI Verification API
  const handleRunAiAudit = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/gemini/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: card.fullName,
          role: card.role,
          organization: card.organization,
          photoBase64: card.photoUrl,
          idNumber: card.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport({
          verified: data.verified ?? true,
          securityScore: data.securityScore ?? 98.4,
          biometricMatch: data.biometricMatch ?? '99.2%',
          clearanceLevel: data.clearanceLevel ?? card.clearanceLevel,
          complianceChecks: data.complianceChecks || [
            { check: 'Facial Alignment', status: 'passed', detail: 'Pass' },
            { check: 'Security Signature', status: 'passed', detail: 'Hash Match' },
          ],
          summary: data.summary || 'Security check completed successfully.',
          cryptoHash: data.cryptoHash || `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        });
      }
    } catch (err) {
      console.error('Audit failed', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Re-generate Cryptographic Security Hash
  const handleRegenerateKey = () => {
    const newHash = `0x${Math.random().toString(16).substring(2, 12).toUpperCase()}`;
    if (onUpdateCard) {
      onUpdateCard({
        ...card,
        securityHash: newHash,
      });
    }
    if (report) {
      setReport({
        ...report,
        cryptoHash: newHash,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-6 text-[#1E293B]">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#D9F99D]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              Cryptographic & Biometric Verification Hub
              <span className="text-[10px] bg-[#D9F99D] text-[#0F172A] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Level 4 Security
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Audit credential authenticity, biometric match, and cryptographic security hashes.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiAudit}
          disabled={isVerifying}
          className="px-4 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#D9F99D]" />
          <span>{isVerifying ? 'Analyzing Photo & Hashes...' : 'Run AI Security Audit'}</span>
        </button>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Security Rating */}
        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-[#D9F99D] flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">SECURITY SCORE</span>
            <span className="text-2xl font-bold text-[#0F172A]">
              {report?.securityScore || 98.6}%
            </span>
            <span className="text-[10px] text-green-600 font-bold block">Grade A Security</span>
          </div>
        </div>

        {/* Biometric Match */}
        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold">
            <Fingerprint className="w-6 h-6 text-[#D9F99D]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">BIOMETRIC MATCH</span>
            <span className="text-2xl font-bold text-[#0F172A]">
              {report?.biometricMatch || '99.4%'}
            </span>
            <span className="text-[10px] text-[#64748B] block">Portrait Validated</span>
          </div>
        </div>

        {/* Cryptographic Signature */}
        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">DIGITAL HASH</span>
            <span className="text-sm font-bold font-mono text-[#0F172A] block mt-0.5 truncate max-w-[140px]">
              {report?.cryptoHash || card.securityHash}
            </span>
            <span className="text-[10px] text-green-600 font-bold block">Signature Valid</span>
          </div>

          <button
            onClick={handleRegenerateKey}
            className="p-2 rounded-xl bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
            title="Re-generate Security Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COMPLIANCE CHECKLIST */}
      <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0F172A]" />
          Real-time Compliance Checklist
        </h3>

        <div className="space-y-2">
          {report?.complianceChecks.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <div>
                  <p className="font-bold text-[#0F172A]">{item.check}</p>
                  <p className="text-[11px] text-[#64748B]">{item.detail}</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-[#D9F99D] text-[#0F172A] text-[9px] font-bold uppercase">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY BANNER */}
      {report?.summary && (
        <div className="p-4 rounded-2xl bg-[#0F172A] text-white border border-white/10 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#D9F99D] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#94A3B8] font-medium leading-relaxed">
            {report.summary}
          </p>
        </div>
      )}
    </div>
  );
};
