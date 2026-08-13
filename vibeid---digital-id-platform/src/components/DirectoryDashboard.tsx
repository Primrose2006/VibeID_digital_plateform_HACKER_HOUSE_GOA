import React, { useState } from 'react';
import { DigitalIDCard } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  ShieldAlert, 
  QrCode, 
  Download, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

interface DirectoryDashboardProps {
  cards: DigitalIDCard[];
  selectedCardId: string;
  onSelectCard: (card: DigitalIDCard) => void;
  onAddNewCard: () => void;
  onRevokeCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

export const DirectoryDashboard: React.FC<DirectoryDashboardProps> = ({
  cards,
  selectedCardId,
  onSelectCard,
  onAddNewCard,
  onRevokeCard,
  onDeleteCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter cards based on search and status
  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-6 text-[#1E293B]">
      {/* HEADER & TOP STATS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            Digital ID Registry Directory
            <span className="text-[10px] bg-[#D9F99D] text-[#0F172A] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {cards.length} Total Passes
            </span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Search, issue, inspect, and revoke active event and personnel digital IDs.
          </p>
        </div>

        {/* Issue New ID Button */}
        <button
          onClick={onAddNewCard}
          className="px-4 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#D9F99D]" />
          <span>Issue New Digital ID</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, ID number, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:border-[#0F172A]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-[#0F172A]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Passes</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* CARDS DIRECTORY TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase bg-[#F8FAFC]">
              <th className="py-3 px-4">Pass Holder</th>
              <th className="py-3 px-4">Organization & Event</th>
              <th className="py-3 px-4">Security Clearance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Scans</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {filteredCards.map((c) => {
              const isSelected = c.id === selectedCardId;
              return (
                <tr
                  key={c.id}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    isSelected ? 'bg-[#F1F5F9] border-l-4 border-l-[#0F172A]' : ''
                  }`}
                >
                  {/* Holder Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border border-[#CBD5E1] overflow-hidden flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: c.photoBgColor || '#0F172A' }}
                      >
                        <img
                          src={c.photoUrl}
                          alt={c.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A]">{c.fullName}</p>
                        <p className="text-[10px] text-[#64748B] font-mono">ID: {c.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Organization */}
                  <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                    <p className="font-bold text-[#0F172A]">{c.role}</p>
                    <p className="text-[10px] text-[#64748B]">{c.organization}</p>
                  </td>

                  {/* Clearance Level */}
                  <td className="py-3.5 px-4 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] font-bold">
                      {c.clearanceLevel.split('-')[0]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'active'
                          ? 'bg-[#D9F99D] text-[#0F172A]'
                          : c.status === 'revoked'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {c.status}
                    </span>
                  </td>

                  {/* Scan Count */}
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {c.scanCount} scans
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Inspect / Select */}
                      <button
                        onClick={() => onSelectCard(c)}
                        className="p-1.5 rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all"
                        title="View & Edit Card"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D9F99D]" />
                      </button>

                      {/* Revoke Access */}
                      <button
                        onClick={() => onRevokeCard(c.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                        title="Revoke Access"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteCard(c.id)}
                        className="p-1.5 rounded-lg bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
