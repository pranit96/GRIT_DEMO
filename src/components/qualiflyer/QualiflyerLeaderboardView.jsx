import React, { useState } from 'react';
import { useGrit } from '../../context/GritContext';
import { QUALIFLYER_POLICY } from '../../data/initialMockData';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import Modal from '../common/Modal';
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Compass,
  Plane,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  Info,
  UserX,
  XCircle
} from 'lucide-react';

export default function QualiflyerLeaderboardView({ onSelectStudent }) {
  const {
    students,
    setCurrentRole,
    setCurrentStudentId,
    currentStudentId,
    nullifyStudentBadge
  } = useGrit();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all' | 'gold' | 'silver' | 'bronze' | 'pending' | 'nullified'
  const [batchFilter, setBatchFilter] = useState('all');
  const [selectedStudentForContests, setSelectedStudentForContests] = useState(null);
  const [showPolicyAccordion, setShowPolicyAccordion] = useState(false);
  const [nullifyConfirmStudent, setNullifyConfirmStudent] = useState(null);
  const [nullifyReason, setNullifyReason] = useState('Unauthorized external assistance detected during post-evaluation audit.');

  // Sort students by Qualiflyer rank (active ranked first 1..8, then DQ)
  const sortedStudents = [...students].sort((a, b) => {
    const rankA = a.qualiflyer?.rank === 'DQ' ? 999 : Number(a.qualiflyer?.rank || 99);
    const rankB = b.qualiflyer?.rank === 'DQ' ? 999 : Number(b.qualiflyer?.rank || 99);
    return rankA - rankB;
  });

  // Filter students
  const filteredStudents = sortedStudents.filter(s => {
    const q = s.qualiflyer;
    if (!q) return true;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(query);
      const matchEmail = s.email.toLowerCase().includes(query);
      const matchSection = (q.section || '').toLowerCase().includes(query);
      const matchBatch = (q.batch || '').toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchSection && !matchBatch) return false;
    }

    // Badge filter
    if (badgeFilter === 'gold' && q.trackBadge?.level !== 'Gold') return false;
    if (badgeFilter === 'silver' && q.trackBadge?.level !== 'Silver') return false;
    if (badgeFilter === 'bronze' && q.trackBadge?.level !== 'Bronze') return false;
    if (badgeFilter === 'pending' && q.trackBadge?.status !== 'pending') return false;
    if (badgeFilter === 'nullified' && !q.isDisqualified && q.trackBadge?.status !== 'nullified') return false;

    // Batch filter
    if (batchFilter !== 'all' && q.batch !== batchFilter) return false;

    return true;
  });

  const topStudent = sortedStudents[0];
  const totalRanked = sortedStudents.filter(s => !s.qualiflyer?.isDisqualified).length;
  const badgesEarned = sortedStudents.filter(s => s.qualiflyer?.trackBadge?.status === 'earned').length;
  const badgesPending = sortedStudents.filter(s => s.qualiflyer?.trackBadge?.status === 'pending').length;
  const badgesNullified = sortedStudents.filter(s => s.qualiflyer?.isDisqualified || s.qualiflyer?.trackBadge?.status === 'nullified').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg bg-[#1E0404] text-[#FFFEF7] relative overflow-hidden">
        <div className="absolute right-[-30px] top-[-30px] w-64 h-64 rounded-full bg-[#F4DF38]/10 pointer-events-none"></div>
        <div className="absolute right-32 bottom-[-50px] w-48 h-48 rounded-full bg-[#4277FB]/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#F4DF38] flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F4DF38]" />
                NxtWave Qualiflyer Leaderboard • Clause 5.3
              </span>
              <span className="text-stone-400">|</span>
              <GritBadge variant="yellow">Global Immersion Trip Selection</GritBadge>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#FFFEF7] tracking-tight">
              Qualiflyer Leaderboard & Miles Standing
            </h1>

            <p className="text-sm sm:text-base font-sans text-stone-200 leading-relaxed">
              Maintained and updated by NxtWave on the GRIT Platform (Clause 5.3.1).
              Rankings reflect cumulative performance across offline skill contests held at NIAT campuses under invigilation and platform milestones. Top-ranking participants qualify for consideration for the Global Immersion Trip.
            </p>

            {/* Mandatory Track Badge Deadline Warning (Clause 5.3.5) */}
            <div className="p-3.5 rounded-xl bg-[#F4DF38]/15 border border-[#F4DF38]/40 text-xs text-[#FFFEF7] flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#F4DF38] shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-bold text-[#F4DF38] block">
                  Mandatory Prerequisite (Clause 5.3.5): Deadline 31st December 2026
                </span>
                <span className="text-stone-300 font-sans text-[11px] leading-tight">
                  Each Participant must earn at least one (1) Track Badge on or before 31st December 2026 as a mandatory condition of continued eligibility. Failure to meet this requirement results in automatic disqualification and total forfeiture of accrued Miles.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Immersion Trip Badge Card */}
          <div className="shrink-0 p-5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm text-center space-y-2 lg:min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-[#F4DF38] border-2 border-[#1E0404] text-[#1E0404] mx-auto flex items-center justify-center font-bold text-xl grit-shadow-sm">
              <Plane className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#F4DF38] block tracking-wider">
                Immersion Trip Target
              </span>
              <span className="font-heading font-black text-xl text-white block">
                Top 5% Qualifying Cutoff
              </span>
              <span className="text-[11px] text-stone-300 font-sans block mt-0.5">
                Current Threshold: 2,000+ Miles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Program Rules Summary Cards (Clauses 5.3.1 - 5.3.6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GritCard header="Contest Miles (Clause 5.3.3)" accent="yellow">
          <div className="space-y-1.5 text-xs text-stone-700">
            <p className="font-sans leading-relaxed">
              Earned via offline skill contests held at NIAT campuses under invigilation (5.3.6).
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold">
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">Gold: 500M</span>
              <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300">Silver: 350M</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">Try Again: 100M</span>
            </div>
          </div>
        </GritCard>

        <GritCard header="Multiple Attempts Rule (5.3.3)" accent="blue">
          <div className="space-y-1 text-xs text-stone-700 font-sans">
            <p className="leading-relaxed">
              Multiple attempts permitted per skill contest. <strong>The highest grade achieved across all attempts counts as the final grade</strong> and Miles are credited accordingly.
            </p>
            <span className="text-[10px] font-mono text-[#4277FB] block font-bold">
              Example: Try Again (100) ➔ Silver (350) = 350 Miles
            </span>
          </div>
        </GritCard>

        <GritCard header="Bonus Miles (Clause 5.3.4)" accent="purple">
          <div className="space-y-1 text-xs text-stone-700 font-sans">
            <p className="leading-relaxed">
              Participants who have earned the Track Badge earn Bonus Miles by clearing platform milestones (e.g. Technical Interview Distinction, 100% Curriculum Clearance).
            </p>
            <span className="text-[10px] font-mono text-[#70449C] block font-bold">
              Bonus Miles contribute to Qualiflyer standing.
            </span>
          </div>
        </GritCard>

        <GritCard header="Anti-Malpractice (5.3.2 & 5.3.5)" accent="red">
          <div className="space-y-1 text-xs text-stone-700 font-sans">
            <p className="leading-relaxed">
              Attempting to artificially inflate Miles or getting caught doing malpractice results in <strong>immediate disqualification and badge nullification</strong>.
            </p>
            <span className="text-[10px] font-mono text-[#D74247] block font-bold">
              All Miles and entitlements forfeited.
            </span>
          </div>
        </GritCard>
      </div>

      {/* 3. Main Leaderboard Card */}
      <div className="p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg bg-[#FFFEF7] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#F4DF38]" />
              <h2 className="font-heading font-black text-2xl text-[#1E0404]">
                Official Qualiflyer Standings
              </h2>
            </div>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              Clause 5.3.1 display fields: Name, Batch, Section, Track Badge Level, Miles Score & Ranking.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search candidate, section, batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4DF38]"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading font-bold text-[#1E0404] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Track Badge:
            </span>

            {[
              { id: 'all', label: `All (${students.length})` },
              { id: 'gold', label: 'Gold Badge' },
              { id: 'silver', label: 'Silver Badge' },
              { id: 'bronze', label: 'Bronze Badge' },
              { id: 'pending', label: `Pending (${badgesPending})`, alert: true },
              { id: 'nullified', label: `Nullified (${badgesNullified})`, danger: true }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setBadgeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all border ${
                  badgeFilter === tab.id
                    ? 'bg-[#1E0404] text-[#FFFEF7] border-[#1E0404]'
                    : tab.danger
                    ? 'bg-rose-50 text-[#D74247] border-[#D74247] hover:bg-rose-100'
                    : tab.alert
                    ? 'bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-[#1E0404]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-bold text-[11px]">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-white border-2 border-stone-300 rounded-lg px-2.5 py-1 text-xs font-heading font-bold text-stone-800 focus:outline-none focus:border-[#1E0404]"
            >
              <option value="all">All Batches</option>
              <option value="NIAT 2023">NIAT 2023</option>
              <option value="NIAT 2024">NIAT 2024</option>
              <option value="NIAT 2025">NIAT 2025</option>
            </select>
          </div>
        </div>

        {/* 4. Table */}
        <div className="overflow-x-auto rounded-xl border-2 border-[#1E0404]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 border-b-2 border-[#1E0404] font-heading font-bold text-[#1E0404]">
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Participant</th>
                <th className="py-3.5 px-4">Batch & Section</th>
                <th className="py-3.5 px-4">Track Badge Level</th>
                <th className="py-3.5 px-4 text-right">Contest Miles</th>
                <th className="py-3.5 px-4 text-right">Bonus Miles</th>
                <th className="py-3.5 px-4 text-right">Total Miles</th>
                <th className="py-3.5 px-4">Immersion Trip Status</th>
                <th className="py-3.5 px-4 text-center">Contests & Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500 font-medium">
                    No participants match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const q = std.qualiflyer || {};
                  const isRank1 = q.rank === 1;
                  const isRank2 = q.rank === 2;
                  const isRank3 = q.rank === 3;
                  const isDQ = q.isDisqualified || q.rank === 'DQ';
                  const isPending = q.trackBadge?.status === 'pending';
                  const isNullified = q.trackBadge?.status === 'nullified';

                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        isDQ
                          ? 'bg-rose-50/25 opacity-80'
                          : isRank1
                          ? 'bg-amber-50/30'
                          : isPending
                          ? 'bg-amber-50/15'
                          : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-4 text-center font-heading font-black">
                        {isRank1 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F4DF38] text-[#1E0404] border border-[#1E0404] grit-shadow-sm font-black text-sm">
                            1 🥇
                          </div>
                        ) : isRank2 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-200 text-[#1E0404] border border-stone-400 font-black text-sm">
                            2 🥈
                          </div>
                        ) : isRank3 ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 border border-amber-800 font-black text-sm">
                            3 🥉
                          </div>
                        ) : isDQ ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-[#D74247] border border-rose-300 font-mono text-[11px] font-black">
                            DQ
                          </span>
                        ) : (
                          <span className="text-stone-700 text-sm font-bold font-mono">
                            #{q.rank || '—'}
                          </span>
                        )}
                      </td>

                      {/* Participant Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className={`w-9 h-9 rounded-full border border-[#1E0404] object-cover shrink-0 ${
                              isDQ ? 'grayscale opacity-60' : ''
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading font-bold text-[#1E0404] block text-sm">
                                {std.name}
                              </span>
                              {std.id === currentStudentId && (
                                <span className="text-[10px] bg-[#F4DF38] text-[#1E0404] px-1.5 py-0.2 rounded font-bold font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {std.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Batch & Section (Clause 5.3.1) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-heading font-bold text-stone-800 block text-xs">
                            {q.batch || std.cohort.split('—')[0].trim()}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {q.section || 'Section Alpha'}
                          </span>
                        </div>
                      </td>

                      {/* Track Badge Level (Clause 5.3.1 & 5.3.5) */}
                      <td className="py-3.5 px-4">
                        {isDQ || isNullified ? (
                          <div className="space-y-0.5">
                            <GritBadge variant="red">
                              Nullified (Malpractice)
                            </GritBadge>
                            <span className="text-[10px] text-[#D74247] block font-mono">
                              Clause 5.3.2 Action
                            </span>
                          </div>
                        ) : isPending ? (
                          <div className="space-y-0.5">
                            <GritBadge variant="yellow">
                              Pending (Prereq Incomplete)
                            </GritBadge>
                            <span className="text-[10px] text-amber-800 block font-bold">
                              Deadline: 31 Dec 2026 ⏳
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <GritBadge
                              variant={
                                q.trackBadge?.level === 'Gold'
                                  ? 'yellow'
                                  : q.trackBadge?.level === 'Silver'
                                  ? 'blue'
                                  : 'purple'
                              }
                            >
                              {q.trackBadge?.name || 'Full Stack Track'} • {q.trackBadge?.level || 'Silver'}
                            </GritBadge>
                            <span className="text-[10px] text-stone-500 block">
                              Earned: {q.trackBadge?.earnedAt || 'Oct 2026'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Contest Miles (Clause 5.3.3) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-mono font-bold text-xs ${isDQ ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {q.contestMiles != null ? q.contestMiles.toLocaleString() : '0'} M
                        </span>
                        <span className="text-[10px] text-stone-500 block font-sans">
                          {q.contests?.length || 0} skills attempted
                        </span>
                      </td>

                      {/* Bonus Miles (Clause 5.3.4) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-mono font-bold text-xs ${isDQ ? 'line-through text-stone-400' : q.bonusMiles > 0 ? 'text-[#70449C]' : 'text-stone-400'}`}>
                          {q.bonusMiles > 0 ? `+${q.bonusMiles.toLocaleString()} M` : '0 M'}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          {q.bonusMiles > 0 ? 'Milestone Bonus' : 'No bonus'}
                        </span>
                      </td>

                      {/* Total Miles (Clause 5.3.3) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-heading font-black text-sm ${
                          isDQ
                            ? 'line-through text-rose-500'
                            : isRank1
                            ? 'text-amber-900 font-extrabold text-base'
                            : 'text-[#1E0404]'
                        }`}>
                          {q.totalMiles != null ? q.totalMiles.toLocaleString() : '0'} Miles
                        </span>
                      </td>

                      {/* Immersion Trip Status (Clause 5.3.6) */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-heading font-bold block ${
                          isDQ
                            ? 'text-[#D74247]'
                            : isRank1 || isRank2
                            ? 'text-emerald-700'
                            : isPending
                            ? 'text-amber-700'
                            : 'text-stone-700'
                        }`}>
                          {q.immersionTripEligibility || 'Contender'}
                        </span>
                      </td>

                      {/* Actions: View Contests Modal & Nullify Option */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForContests(std)}
                            className="px-2.5 py-1 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-white text-stone-800 font-heading font-bold text-xs transition-colors flex items-center gap-1 hover:bg-stone-50"
                            title="View Contest Attempts & Highest Grade Rule (Clause 5.3.3)"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#4277FB]" />
                            <span>Contests</span>
                          </button>

                          {/* Post-Audit Malpractice Nullify Button (for Interview Team) */}
                          {!isDQ && (
                            <button
                              onClick={() => {
                                setNullifyConfirmStudent(std);
                                setNullifyReason('Caught doing malpractice and flagged during post-evaluation integrity audit.');
                              }}
                              className="p-1 rounded-lg border border-transparent hover:border-rose-400 text-stone-400 hover:text-[#D74247] transition-colors"
                              title="Flag Malpractice: Nullifies Track Badge and forfeits all Miles (Clause 5.3.2)"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Policy & Clause Accordion (Verbatim Text of 5.3.1 - 5.3.6) */}
      <div className="p-6 rounded-2xl grit-border bg-[#FFFEF7] space-y-4">
        <button
          onClick={() => setShowPolicyAccordion(!showPolicyAccordion)}
          className="w-full flex items-center justify-between text-left font-heading font-black text-base text-[#1E0404]"
        >
          <span className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#4277FB]" />
            Official Qualiflyer Terms & Regulatory Policy (Clauses 5.3.1 – 5.3.6)
          </span>
          {showPolicyAccordion ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showPolicyAccordion && (
          <div className="pt-3 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {QUALIFLYER_POLICY.map((item) => (
              <div key={item.clause} className="p-4 rounded-xl border border-stone-300 bg-stone-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-[#1E0404]">
                    Clause {item.clause}: {item.title}
                  </span>
                </div>
                <p className="font-sans text-stone-700 leading-relaxed text-[11px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: Skill Contests & Attempts History (Clause 5.3.3)      */}
      {/* ============================================================== */}
      {selectedStudentForContests && (
        <Modal
          isOpen={Boolean(selectedStudentForContests)}
          onClose={() => setSelectedStudentForContests(null)}
          title={`Skill Contests & Scorecard: ${selectedStudentForContests.name}`}
          size="xl"
        >
          <div className="space-y-6 text-xs">
            {/* Header Persona Pill */}
            <div className="p-4 rounded-xl bg-stone-50 border-2 border-[#1E0404] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForContests.avatar}
                  alt={selectedStudentForContests.name}
                  className="w-12 h-12 rounded-full border border-[#1E0404] object-cover"
                />
                <div>
                  <h3 className="font-heading font-black text-base text-[#1E0404]">
                    {selectedStudentForContests.name}
                  </h3>
                  <p className="text-stone-600 font-sans">
                    {selectedStudentForContests.qualiflyer?.batch} • {selectedStudentForContests.qualiflyer?.section} • {selectedStudentForContests.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-stone-500 block font-bold">
                  Qualiflyer Total
                </span>
                <span className="font-heading font-black text-xl text-[#1E0404]">
                  {selectedStudentForContests.qualiflyer?.totalMiles != null
                    ? selectedStudentForContests.qualiflyer.totalMiles.toLocaleString()
                    : 0} Miles
                </span>
              </div>
            </div>

            {/* Malpractice / Disqualification Alert if applicable */}
            {selectedStudentForContests.qualiflyer?.isDisqualified && (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-[#D74247] text-[#D74247] space-y-1">
                <span className="font-heading font-black text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Track Badge Nullified & Participant Disqualified (Clause 5.3.2)
                </span>
                <p className="text-xs font-sans text-stone-800">
                  {selectedStudentForContests.qualiflyer.disqualificationReason}
                </p>
              </div>
            )}

            {/* Explanatory Rule Banner */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-stone-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#4277FB] shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-bold text-blue-900 block">
                  Clause 5.3.3 Multiple Attempts Rule
                </span>
                <span className="text-[11px] font-sans">
                  Where a Participant attempts a skill contest more than once, the highest grade achieved across all attempts is considered the final grade, and the corresponding Miles are credited as the final Miles for that skill.
                </span>
              </div>
            </div>

            {/* List of Skill Contests */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-[#1E0404] uppercase tracking-wider">
                Skill-Based GRIT Contests (Campus Invigilated per 5.3.6)
              </h4>

              {selectedStudentForContests.qualiflyer?.contests?.map((contest, idx) => (
                <div key={idx} className="p-4 rounded-xl border-2 border-stone-300 bg-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <div>
                      <span className="font-heading font-black text-sm text-[#1E0404] block">
                        {contest.skillName}
                      </span>
                      <span className="text-[10px] text-stone-500 font-sans">
                        Offline GRIT Contest held under campus invigilation
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-black text-[#1E0404] block">
                        Final Miles: {contest.finalMiles} M
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase font-mono">
                        Highest Grade: {contest.highestGrade?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Attempts Breakdown Table */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      Attempts History:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {contest.attempts?.map((att, aIdx) => (
                        <div key={aIdx} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-heading font-bold text-[#1E0404] block">
                              Attempt #{att.attemptNum}: <span className="uppercase">{att.grade.replace('_', ' ')}</span>
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {att.date} • {att.venue || 'Campus Lab'}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-stone-700">
                            {att.miles} M
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {contest.attemptsRuleApplied && (
                    <p className="text-[11px] font-mono text-[#4277FB] bg-blue-50/70 p-2 rounded border border-blue-200">
                      ℹ️ {contest.attemptsRuleApplied}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bonus Miles Section (Clause 5.3.4) */}
            {selectedStudentForContests.qualiflyer?.bonusBreakdown?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="font-heading font-bold text-sm text-[#1E0404] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#70449C]" />
                  Bonus Miles (Clause 5.3.4)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedStudentForContests.qualiflyer.bonusBreakdown.map((bonus, bIdx) => (
                    <div key={bIdx} className="p-2.5 rounded-lg border border-purple-200 bg-purple-50 flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800">{bonus.title}</span>
                      <span className="font-mono font-black text-[#70449C]">+{bonus.miles} M</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: Post-Audit Nullify Badge Confirmation                 */}
      {/* ============================================================== */}
      {nullifyConfirmStudent && (
        <Modal
          isOpen={Boolean(nullifyConfirmStudent)}
          onClose={() => setNullifyConfirmStudent(null)}
          title="Flag Malpractice & Nullify Track Badge"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-[#D74247] space-y-2">
              <div className="flex items-center gap-2 font-heading font-black text-sm text-[#D74247]">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Confirm Badge Nullification for {nullifyConfirmStudent.name}</span>
              </div>
              <p className="font-sans text-stone-800 leading-relaxed">
                Under GRIT Program Regulations and <strong>Clause 5.3.2</strong>, if a student was caught doing malpractice and got flagged later, their Track Badge gets nullified, their evaluation is revoked, and all Qualiflyer Miles and Immersion Trip entitlements are permanently forfeited.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-heading font-bold text-xs text-[#1E0404] block">
                Audit Violation Reason & Incident Report:
              </label>
              <textarea
                rows={3}
                value={nullifyReason}
                onChange={(e) => setNullifyReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border-2 border-stone-300 text-xs font-sans focus:outline-none focus:border-[#D74247]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setNullifyConfirmStudent(null)}
                className="px-4 py-2 rounded-lg border-2 border-stone-300 font-heading font-bold text-xs hover:bg-stone-100"
              >
                Cancel
              </button>
              <GritButton
                variant="danger"
                size="md"
                onClick={() => {
                  nullifyStudentBadge(nullifyConfirmStudent.id, nullifyReason);
                  setNullifyConfirmStudent(null);
                }}
              >
                Confirm: Nullify Badge & Forfeit Miles 🚫
              </GritButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

