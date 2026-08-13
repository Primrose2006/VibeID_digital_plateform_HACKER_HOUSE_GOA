import { DigitalIDCard } from '../types';

export const BLANK_AVATAR_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="72" r="36" fill="%230F172A" opacity="0.45"/><path d="M100 118C62 118 36 142 36 182H164C164 142 138 118 100 118Z" fill="%230F172A" opacity="0.45"/></svg>`;

export const DEFAULT_USER_CARD: DigitalIDCard = {
  id: 'HHG-2026-8891',
  fullName: 'Aryan Chauhan',
  role: 'graphic designer.',
  headerCategory: 'HACKER HOUSE GOA 2026',
  subRole: 'Director of Art',
  organization: 'Hacker House Goa 2026',
  taglineQuote: 'Design is intelligence made visible.',
  skillsIcons: ['Ps', 'Ai', 'Pen', 'T', 'Crop'],
  eventYear: '2026',
  photoUrl: BLANK_AVATAR_URL,
  originalPhotoUrl: BLANK_AVATAR_URL,
  photoBgColor: '#8CE600', // Signature Lime Green from the reference template
  cardTheme: 'lime-cream',
  issueDate: new Date().toISOString().split('T')[0],
  expiryDate: '2026-12-31',
  clearanceLevel: 'Level 3 - Gate & VIP Access',
  securityHash: '0x3D88C21EA74F19',
  qrCodeData: 'VERIFIED:HHG-2026-8891:AryanChauhan:Level3VIP:2026',
  status: 'active',
  scanCount: 12,
  emergencyContact: '+1 (555) 019-2834',
  email: 'aryan.chauhan@artdirector.design',
  lanyard: {
    enabled: true,
    strapText: 'HACKER HOUSE GOA 2026',
    strapColor: '#A3E635', // Lime Green Strap
    clipColor: 'silver',
  },
};

export const SAMPLE_BADGES: DigitalIDCard[] = [DEFAULT_USER_CARD];

