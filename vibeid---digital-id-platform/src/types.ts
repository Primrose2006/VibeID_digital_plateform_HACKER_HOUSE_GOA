export interface DigitalIDCard {
  id: string;
  fullName: string;
  role: string;
  organization: string;
  eventYear: string;
  headerCategory?: string; // e.g. "profficinal" / "professional"
  subRole?: string; // e.g. "Director of Art"
  taglineQuote?: string; // e.g. "Design is intelligence made visible."
  skillsIcons?: string[]; // e.g. ['Ps', 'Ai', 'pen', 'type', 'crop']
  photoUrl: string;
  originalPhotoUrl?: string;
  photoBgColor: string; // e.g. '#8CE600', '#C81E45', '#0A3825'
  cardTheme: 'pink-emerald' | 'emerald-gold' | 'cyber-dark' | 'crimson-vip' | 'lime-cream';
  issueDate: string;
  expiryDate: string;
  clearanceLevel: 'Level 1 - Guest' | 'Level 2 - Staff' | 'Level 3 - Gate & VIP Access' | 'Level 4 - Executive';
  securityHash: string;
  qrCodeData: string;
  status: 'active' | 'pending' | 'revoked' | 'flagged';
  scanCount: number;
  lastScanned?: string;
  emergencyContact?: string;
  email?: string;
  lanyard: {
    enabled: boolean;
    strapText: string;
    strapColor: string; // e.g. '#A3E635'
    clipColor: 'silver' | 'gold' | 'black';
  };
}

export interface ScanLogItem {
  id: string;
  timestamp: string;
  cardId: string;
  holderName: string;
  role: string;
  organization: string;
  gateLocation: string;
  status: 'granted' | 'denied' | 'flagged';
  clearanceLevel: string;
}

export interface VerificationReport {
  verified: boolean;
  securityScore: number;
  biometricMatch: string;
  clearanceLevel: string;
  complianceChecks: {
    check: string;
    status: 'passed' | 'warning' | 'failed';
    detail: string;
  }[];
  summary: string;
  cryptoHash: string;
}
