export const QUALIFLYER_POLICY = [
  {
    clause: "5.3.1",
    title: "Leaderboard Maintenance, Visibility & Participant Consent",
    text: "The Qualiflyer Leaderboard shall be maintained and updated by NxtWave on the Platform and may be made visible to all Participants. By participating in the Program, each Participant expressly consents to the display of their name, batch, section, Track Badge level, Miles score, and ranking on the Leaderboard and in any Program-related promotional or informational materials published through Official Channels."
  },
  {
    clause: "5.3.2",
    title: "Anti-Manipulation, Malpractice & Immediate Badge Nullification",
    text: "NxtWave reserves the right to determine the format, update frequency, and scope of information displayed. The Leaderboard is subject to change at any time, and NxtWave’s decisions regarding rankings, score corrections, and disqualifications are final and binding. Any attempt to artificially inflate Miles, manipulate Qualiflyer Leaderboard rankings, exploit Platform vulnerabilities, or engage in malpractice constitutes a material breach and shall result in immediate disqualification, forfeiture of Miles, and nullification of any earned Track Badges."
  },
  {
    clause: "5.3.3",
    title: "Miles Framework, Contests, Grading & Multiple Attempts Rule",
    text: "Miles are earned by a Participant upon completion of GRIT Contests conducted per skill on the Platform. Upon completion of each GRIT Contest, the Participant is awarded a grade of “gold”, “silver”, or “try again”, with corresponding Miles credited to their account accordingly. Each skill-based GRIT Contest may be attempted multiple times by the Participant. Where a Participant attempts a GRIT Contest more than once, the highest grade achieved across all attempts shall be considered the final grade for that skill, and the Miles corresponding to such highest grade shall be counted as the final Miles for that GRIT Contest. For example, if a Participant receives a “try again” grade in the first attempt and a “silver” grade in the second attempt, the “silver” grade shall be treated as the final grade and Miles shall be credited accordingly. Cumulative Miles across all completed GRIT Contests shall determine the Participant’s standing on the Qualiflyer Leaderboard."
  },
  {
    clause: "5.3.4",
    title: "Bonus Miles for Track Badge Earners",
    text: "Participants who have earned the Track Badge through live online interview evaluation may earn Bonus Miles by achieving prescribed milestones on the Platform or through qualifying achievements, as notified through Official Channels. Bonus Miles contribute to the Qualiflyer Leaderboard standing. NxtWave reserves the right to introduce, modify, or discontinue the Bonus Miles framework at any time."
  },
  {
    clause: "5.3.5",
    title: "Mandatory Track Badge Prerequisite & 31st Dec 2026 Forfeiture Deadline",
    text: "Participants must clear the requisite skill contests and earn the Track Badge via live online interview as a mandatory prerequisite. Each Participant must earn at least one (1) Track Badge on or before 31st December 2026 as a mandatory condition of continued eligibility. Participants who fail to meet this requirement by the stipulated date shall be automatically disqualified from the Program, forfeiting all accrued Miles, Bonus Miles, leaderboard standings, Qualiflyer rankings, and associated entitlements, with no right to appeal or reinstatement."
  },
  {
    clause: "5.3.6",
    title: "Campus Invigilation & Live Online Interview Evaluation",
    text: "The Qualiflyer Leaderboard ranks Participants based on cumulative performance across platform milestones and offline GRIT Contests held at NIAT campuses under invigilation. Once every skill required for a Track Badge is cleared, candidates take a live online interview with our team of interviewers to earn that badge. Selection for the Immersion Trip shall be made at NxtWave’s sole discretion from verified badge earners."
  }
];

export const TRACK_BADGE_DEFINITION = {
  id: "track-fse",
  name: "Full Stack Engineering Track Badge",
  code: "FSE-2026",
  domain: "Software Systems Engineering",
  description: "NIAT flag-bearer engineering track. Requires clearing 5 offline invigilated campus skill contests, followed by a 1-on-1 live online interview with an interviewer to officially earn and verify the Track Badge.",
  totalSkillsRequired: 5,
  skills: [
    {
      id: "skill-dsa",
      name: "Data Structures & Algorithms",
      code: "DSA-201",
      domain: "Algorithms & Complexity",
      desc: "Tree and graph cycle traversal, dynamic programming, and complexity optimization under campus invigilation."
    },
    {
      id: "skill-fsd",
      name: "Full Stack React & WebSockets",
      code: "FSD-301",
      domain: "Modern Frontend Systems",
      desc: "Component lifecycle, optimistic UI updates, and low-latency client-server WebSocket synchronization."
    },
    {
      id: "skill-db",
      name: "Database Concurrency & Row Locks",
      code: "DBS-401",
      domain: "Data Persistence & Transactions",
      desc: "Postgres transaction isolation, row-level locks, MVCC, and deadlock resolution under high throughput."
    },
    {
      id: "skill-micro",
      name: "Microservices & Distributed Messaging",
      code: "SYS-402",
      domain: "Backend Systems",
      desc: "Kafka event streams, consumer groups, gRPC streaming, and idempotent distributed service patterns."
    },
    {
      id: "skill-sys",
      name: "System Design & Distributed Scalability",
      code: "ARC-501",
      domain: "System Architecture",
      desc: "Distributed rate limiters, token buckets, multi-tier caching, and horizontal partitioning strategies."
    }
  ]
};

// Helper to generate full 5 skills array for students
const createSkillsArray = (overrides = {}) => {
  return TRACK_BADGE_DEFINITION.skills.map((skill) => {
    const override = overrides[skill.id] || {};
    const status = override.status || "cleared";
    const bestGrade = override.bestGrade !== undefined ? override.bestGrade : (status === "cleared" ? "gold" : null);
    const finalMiles = override.finalMiles !== undefined ? override.finalMiles : (status === "cleared" ? 500 : 0);
    return {
      skillId: skill.id,
      skillName: skill.name,
      code: skill.code,
      domain: skill.domain,
      desc: skill.desc,
      status, // "cleared" | "in_progress" | "not_started"
      bestGrade, // "gold" | "silver" | "try_again" | null
      finalMiles,
      attempts: override.attempts || (status === "cleared" ? [
        { attemptNum: 1, grade: bestGrade || "gold", miles: finalMiles, date: "2026-10-15", venue: "NIAT Campus Lab 2" }
      ] : []),
      clearedAt: override.clearedAt || (status === "cleared" ? "2026-10-15" : null),
      campusInvigilated: true
    };
  });
};

export const INITIAL_STUDENTS = [
  {
    id: "std-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2023 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "ready_for_interview", // 1. ALL SKILLS CLEARED • ELIGIBLE TO BOOK LIVE INTERVIEW
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "unbooked",
    bookedSlotId: null,
    deadlineDaysRemaining: 5,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-dsa": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-09-18" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-15" },
      "skill-db": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-10-04" },
      "skill-micro": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-20" },
      "skill-sys": {
        status: "cleared",
        bestGrade: "gold",
        finalMiles: 500,
        clearedAt: "2026-09-22",
        attempts: [
          { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-09-08", venue: "NIAT Campus Lab 3" },
          { attemptNum: 2, grade: "gold", miles: 500, date: "2026-09-22", venue: "NIAT Campus Lab 1" }
        ]
      }
    }),
    interviewerReview: null,
    evaluation: null,
    milestones: {
      skills: "completed",
      interview: "pending",
      badge: "pending",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2023",
      section: "Section Alpha",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Silver",
        status: "pending_interview",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "Distributed Rate Limiter & Scalability",
          campusInvigilated: true,
          attempts: [
            { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-09-08", venue: "NIAT Campus Lab 3" },
            { attemptNum: 2, grade: "gold", miles: 500, date: "2026-09-22", venue: "NIAT Campus Lab 1" }
          ],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 'try again' (100) improved to Attempt 2 'gold' (500). Final grade: Gold (500 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-09-18", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 counted: Silver (350 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-10-04", venue: "NIAT Campus Lab 4" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 counted: Gold (500 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-15", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 counted: Silver (350 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-20", venue: "NIAT Campus Lab 3" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 counted: Silver (350 Miles)."
        }
      ],
      contestMiles: 2050,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 2050,
      rank: 4,
      isDisqualified: false,
      immersionTripEligibility: "Eligible for Interview • Contender"
    }
  },
  {
    id: "std-2",
    name: "Ananya Iyer",
    email: "ananya.iyer@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2024 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "ready_for_interview", // 2. ALL SKILLS CLEARED • ELIGIBLE TO BOOK LIVE INTERVIEW
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "unbooked",
    bookedSlotId: null,
    deadlineDaysRemaining: 3,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-dsa": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-25" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-18" },
      "skill-db": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-08" },
      "skill-micro": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-18" },
      "skill-sys": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-09-12" }
    }),
    interviewerReview: null,
    evaluation: null,
    milestones: {
      skills: "completed",
      interview: "pending",
      badge: "pending",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2024",
      section: "Section Beta",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Silver",
        status: "pending_interview",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-25", venue: "NIAT Campus Lab 3" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-09-12", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-08", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-18", venue: "NIAT Campus Lab 4" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-18", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 1900,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 1900,
      rank: 5,
      isDisqualified: false,
      immersionTripEligibility: "Eligible for Interview • Contender"
    }
  },
  {
    id: "std-3",
    name: "Divya Nair",
    email: "divya.nair@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "skills_in_progress", // 3. SKILLS INCOMPLETE (2/5 Cleared) • LIVE INTERVIEW LOCKED
    clearedSkillsCount: 2,
    totalSkillsRequired: 5,
    allSkillsCleared: false,
    eligibilityStatus: "Ineligible",
    bookingStatus: "ineligible",
    bookedSlotId: null,
    deadlineDaysRemaining: null,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-fsd": {
        status: "cleared",
        bestGrade: "silver",
        finalMiles: 350,
        clearedAt: "2026-10-22",
        attempts: [
          { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-10-04", venue: "NIAT Campus Lab 2" },
          { attemptNum: 2, grade: "silver", miles: 350, date: "2026-10-22", venue: "NIAT Campus Lab 3" }
        ]
      },
      "skill-dsa": {
        status: "cleared",
        bestGrade: "silver",
        finalMiles: 350,
        clearedAt: "2026-10-28",
        attempts: [
          { attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-28", venue: "NIAT Campus Lab 1" }
        ]
      },
      "skill-db": {
        status: "in_progress",
        bestGrade: "try_again",
        finalMiles: 100,
        clearedAt: null,
        attempts: [
          { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-11-02", venue: "NIAT Campus Lab 4" }
        ]
      },
      "skill-micro": {
        status: "not_started",
        bestGrade: null,
        finalMiles: 0,
        clearedAt: null,
        attempts: []
      },
      "skill-sys": {
        status: "not_started",
        bestGrade: null,
        finalMiles: 0,
        clearedAt: null,
        attempts: []
      }
    }),
    interviewerReview: null,
    evaluation: null,
    milestones: {
      skills: "in_progress",
      interview: "locked",
      badge: "locked",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2025",
      section: "Section Alpha",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Pending",
        status: "skills_pending",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [
            { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-10-04", venue: "NIAT Campus Lab 2" },
            { attemptNum: 2, grade: "silver", miles: 350, date: "2026-10-22", venue: "NIAT Campus Lab 3" }
          ],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 'try again' (100) improved to Attempt 2 'silver' (350). Final counted: Silver (350 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-28", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 counted: Silver (350 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "try_again", miles: 100, date: "2026-11-02", venue: "NIAT Campus Lab 4" }],
          highestGrade: "try_again",
          finalMiles: 100,
          attemptsRuleApplied: "Clause 5.3.3: Try Again (100 Miles) counted. Retake contest on campus to improve."
        }
      ],
      contestMiles: 800,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 800,
      rank: 8,
      isDisqualified: false,
      trackBadgeWarning: "Mandatory Prerequisite (Clause 5.3.5): Must clear remaining 3 skill contests and earn Track Badge on or before 31st December 2026 to avoid automatic disqualification and forfeiture.",
      immersionTripEligibility: "Track Badge Pending (Deadline: 31 Dec 2026)"
    }
  },
  {
    id: "std-4",
    name: "Rohan Verma",
    email: "rohan.verma@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2024 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "interview_booked", // 4. INTERVIEW BOOKED WITH ARJUN NAIR
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "booked",
    bookedSlotId: "slot-102",
    deadlineDaysRemaining: 4,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-sys": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-09-10" },
      "skill-dsa": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-24" },
      "skill-db": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-10-02" },
      "skill-micro": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-12" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-24" }
    }),
    interviewerReview: null,
    evaluation: null,
    milestones: {
      skills: "completed",
      interview: "booked",
      badge: "pending",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2024",
      section: "Section Beta",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Silver",
        status: "interview_booked",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-09-10", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-24", venue: "NIAT Campus Lab 1" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-10-02", venue: "NIAT Campus Lab 3" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-12", venue: "NIAT Campus Lab 4" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-24", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 2050,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 2050,
      rank: 3,
      isDisqualified: false,
      immersionTripEligibility: "Interview Booked • Contender"
    }
  },
  {
    id: "std-5",
    name: "Aditi Rao",
    email: "aditi.rao@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "interview_completed", // 5. INTERVIEW CONDUCTED • EVALUATOR REVIEW SUBMITTED • AWAITING TEAM BADGE AWARD
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "completed",
    bookedSlotId: "slot-104",
    deadlineDaysRemaining: 0,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-sys": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-14" },
      "skill-dsa": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-28" },
      "skill-db": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-06" },
      "skill-micro": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-10-18" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-24" }
    }),
    interviewerReview: {
      interviewerId: "int-1",
      interviewerName: "Arjun Nair",
      conductedAt: "2026-11-10T16:45:00Z",
      recommendedOutcome: "pass",
      recommendedScore: 90,
      rubric: {
        problemSolving: 4.5,
        systemDesign: 5,
        codeQuality: 4,
        communication: 4.5
      },
      observations:
        "Aditi demonstrated outstanding clarity during the live interview. Walked through Postgres transaction isolation and distributed rate limiting with remarkable proficiency. Recommended to award Full Stack Engineering Track Badge.",
      strengths: [
        "Distributed lock & deadlock mitigation",
        "React concurrent mode & optimistic sync",
        "Clear architectural trade-offs"
      ],
      areasToWatch: ["Explore automated canary deployment rollback patterns"]
    },
    evaluation: null,
    milestones: {
      skills: "completed",
      interview: "completed",
      badge: "pending_review",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2025",
      section: "Section Alpha",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Gold",
        status: "under_review",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-14", venue: "NIAT Campus Lab 1" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-28", venue: "NIAT Campus Lab 3" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-06", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-10-18", venue: "NIAT Campus Lab 4" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-24", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 2200,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 2200,
      rank: 2,
      isDisqualified: false,
      immersionTripEligibility: "Interview Completed • Awaiting Track Badge Decision"
    }
  },
  {
    id: "std-6",
    name: "Priya Patel",
    email: "priya.patel@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "earned", // 6. LIVE INTERVIEW PASSED (92/100) • TRACK BADGE OFFICIALLY EARNED 🏅
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "evaluated",
    bookedSlotId: "slot-101",
    deadlineDaysRemaining: 0,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-sys": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-12" },
      "skill-dsa": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-09-26" },
      "skill-db": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-10-04" },
      "skill-micro": { status: "cleared", bestGrade: "gold", finalMiles: 500, clearedAt: "2026-10-14" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-22" }
    }),
    interviewerReview: {
      interviewerId: "int-1",
      interviewerName: "Arjun Nair",
      conductedAt: "2026-11-08T16:30:00Z",
      recommendedOutcome: "pass",
      recommendedScore: 92,
      rubric: {
        problemSolving: 5,
        systemDesign: 4.5,
        codeQuality: 4.5,
        communication: 5
      },
      observations:
        "Outstanding mastery across all 5 skills. Defended distributed cache invalidation strategies and WebSocket reconnect protocols flawlessly. Full Stack Engineering Track Badge awarded with distinction.",
      strengths: [
        "Algorithmic efficiency & graph reasoning",
        "Clear structural diagrams",
        "Proactive trade-off discussions"
      ],
      areasToWatch: ["Automated canary deployment patterns"]
    },
    evaluation: {
      outcome: "pass",
      score: 92,
      maxScore: 100,
      badgeAwarded: true,
      badgeName: "Full Stack Engineering Track Badge",
      badgeCertificateId: "NIAT-FSE-2026-0891",
      evaluatedAt: "2026-11-08T17:00:00Z",
      evaluatorId: "team-1",
      evaluatorName: "Preeti Sundaram",
      rubric: {
        problemSolving: 5,
        systemDesign: 4.5,
        codeQuality: 4.5,
        communication: 5
      },
      feedback:
        "Outstanding mastery of concurrency, cache consistency, and microservices decoupling. Cleared live online interview. Full Stack Engineering Track Badge officially awarded and verified.",
      strengths: [
        "Algorithmic efficiency",
        "Clear structural diagrams",
        "Proactive trade-off discussions"
      ],
      improvements: [
        "Consider automated canary deployment patterns in production scenarios"
      ]
    },
    milestones: {
      skills: "completed",
      interview: "passed",
      badge: "earned",
      capstone: "unlocked"
    },
    qualiflyer: {
      batch: "NIAT 2025",
      section: "Section Alpha",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Gold",
        status: "earned",
        earnedAt: "2026-11-08",
        certificateId: "NIAT-FSE-2026-0891",
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-12", venue: "NIAT Campus Lab 1" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-26", venue: "NIAT Campus Lab 2" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-10-04", venue: "NIAT Campus Lab 3" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "gold", miles: 500, date: "2026-10-14", venue: "NIAT Campus Lab 4" }],
          highestGrade: "gold",
          finalMiles: 500,
          attemptsRuleApplied: "Clause 5.3.3: Gold counted (500 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-22", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 2350,
      bonusMiles: 850,
      bonusBreakdown: [
        { title: "Track Badge Earned (Score 92/100 Distinction)", miles: 450, date: "2026-11-08" },
        { title: "5/5 Skill Contests First Attempt Completion", miles: 200, date: "2026-10-22" },
        { title: "Peer Code Review & Technical Scribe Contribution", miles: 200, date: "2026-10-30" }
      ],
      totalMiles: 3200,
      rank: 1,
      isDisqualified: false,
      immersionTripEligibility: "Qualified • Track Badge Earned (Immersion Trip Contender)"
    }
  },
  {
    id: "std-7",
    name: "Kabir Mehta",
    email: "kabir.mehta@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "retake_required", // 7. INTERVIEW EVALUATED: RETAKE (Score: 64/100, 7-day window to earn badge)
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "evaluated",
    bookedSlotId: "slot-103",
    deadlineDaysRemaining: 0,
    notificationEmailSentAt: null,
    skills: createSkillsArray({
      "skill-sys": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-09-16" },
      "skill-dsa": {
        status: "cleared",
        bestGrade: "silver",
        finalMiles: 350,
        clearedAt: "2026-10-05",
        attempts: [
          { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-09-20", venue: "NIAT Campus Lab 1" },
          { attemptNum: 2, grade: "silver", miles: 350, date: "2026-10-05", venue: "NIAT Campus Lab 3" }
        ]
      },
      "skill-db": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-15" },
      "skill-micro": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-25" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-30" }
    }),
    interviewerReview: {
      interviewerId: "int-2",
      interviewerName: "Dr. Meera Swaminathan",
      conductedAt: "2026-11-09T14:00:00Z",
      recommendedOutcome: "retake",
      recommendedScore: 64,
      rubric: {
        problemSolving: 3,
        systemDesign: 3.5,
        codeQuality: 3,
        communication: 4
      },
      observations:
        "Good architectural intuition and communication. However, struggled with recursive graph traversal time complexities (O(V+E) vs exponential) and state mutation bugs in live coding. Retake recommended in 7 days before Track Badge award.",
      strengths: [
        "Engaging verbal communication",
        "Good high-level system diagrams"
      ],
      areasToWatch: [
        "Deepen knowledge of DFS/BFS cycle detection",
        "Practice immutable state patterns in React"
      ]
    },
    evaluation: {
      outcome: "retake",
      score: 64,
      maxScore: 100,
      badgeAwarded: false,
      evaluatedAt: "2026-11-09T15:00:00Z",
      evaluatorId: "team-1",
      evaluatorName: "Preeti Sundaram",
      rubric: {
        problemSolving: 3,
        systemDesign: 3.5,
        codeQuality: 3,
        communication: 4
      },
      feedback:
        "Good architectural intuition and communication. However, struggled with recursive graph traversal complexities and state mutation bugs. Retake recommended in 7 days to earn the Track Badge.",
      strengths: [
        "Engaging verbal communication",
        "Good high-level system diagrams"
      ],
      improvements: [
        "Deepen knowledge of DFS/BFS cycle detection",
        "Practice immutable state patterns in React"
      ]
    },
    milestones: {
      skills: "completed",
      interview: "retake",
      badge: "pending_retake",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2024",
      section: "Section Alpha",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Pending Retake",
        status: "pending_retake",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-09-16", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [
            { attemptNum: 1, grade: "try_again", miles: 100, date: "2026-09-20", venue: "NIAT Campus Lab 1" },
            { attemptNum: 2, grade: "silver", miles: 350, date: "2026-10-05", venue: "NIAT Campus Lab 3" }
          ],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Attempt 1 'try again' (100) improved to Attempt 2 'silver' (350). Final counted: Silver (350 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-15", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-25", venue: "NIAT Campus Lab 4" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-30", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 1750,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 1750,
      rank: 6,
      isDisqualified: false,
      immersionTripEligibility: "Contender • Retake Interview Scheduled to Earn Badge"
    }
  },
  {
    id: "std-8",
    name: "Neha Kulkarni",
    email: "neha.kulkarni@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "no_show_hold", // 8. INTERVIEW NO SHOW (Absence logged, 48h courtesy make-up window)
    clearedSkillsCount: 5,
    totalSkillsRequired: 5,
    allSkillsCleared: true,
    eligibilityStatus: "Eligible",
    bookingStatus: "evaluated",
    bookedSlotId: "slot-107",
    deadlineDaysRemaining: 2,
    notificationEmailSentAt: "2026-11-09T16:00:00Z",
    skills: createSkillsArray({
      "skill-sys": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-09-18" },
      "skill-dsa": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-02" },
      "skill-db": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-22" },
      "skill-micro": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-10-28" },
      "skill-fsd": { status: "cleared", bestGrade: "silver", finalMiles: 350, clearedAt: "2026-11-01" }
    }),
    interviewerReview: {
      interviewerId: "int-1",
      interviewerName: "Arjun Nair",
      conductedAt: "2026-11-09T14:15:00Z",
      recommendedOutcome: "no_show",
      recommendedScore: null,
      rubric: {
        problemSolving: 0,
        systemDesign: 0,
        codeQuality: 0,
        communication: 0
      },
      observations:
        "Candidate did not connect to the video meeting room for Track Badge interview. Evaluator waited 15 minutes. Courtesy 48h make-up window granted.",
      strengths: ["5/5 Skill Contests cleared in good standing"],
      areasToWatch: ["Adhere to scheduled interview windows"]
    },
    evaluation: {
      outcome: "no_show",
      score: null,
      maxScore: 100,
      badgeAwarded: false,
      evaluatedAt: "2026-11-09T15:00:00Z",
      evaluatorId: "team-1",
      evaluatorName: "Preeti Sundaram",
      rubric: {
        problemSolving: 0,
        systemDesign: 0,
        codeQuality: 0,
        communication: 0
      },
      feedback:
        "Interview Absence Recorded: Candidate did not attend scheduled technical evaluation session with Arjun Nair. 1st Notice: You have 48 hours to request an authorized make-up slot before Track Badge interview eligibility forfeiture.",
      reason: "Unexcused Absence / Failure to Connect",
      incidentRef: "ABS-2026-109",
      gracePeriodDeadline: "Thursday, Nov 12 at 5:00 PM EST",
      canReschedule: true,
      strengths: ["Eligible for one courtesy make-up evaluation"],
      improvements: ["Select new slot within 48-hour grace window"]
    },
    milestones: {
      skills: "completed",
      interview: "no_show",
      badge: "on_hold",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2025",
      section: "Section Beta",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "On Hold",
        status: "no_show_hold",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "System Design & Scalability",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-09-18", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-dsa",
          skillName: "Data Structures & Algorithms",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-02", venue: "NIAT Campus Lab 1" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-db",
          skillName: "Database Concurrency & Row Locks",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-22", venue: "NIAT Campus Lab 3" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-micro",
          skillName: "Microservices & Distributed Messaging",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-10-28", venue: "NIAT Campus Lab 4" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        },
        {
          skillId: "skill-fsd",
          skillName: "Full Stack React & WebSockets",
          campusInvigilated: true,
          attempts: [{ attemptNum: 1, grade: "silver", miles: 350, date: "2026-11-01", venue: "NIAT Campus Lab 2" }],
          highestGrade: "silver",
          finalMiles: 350,
          attemptsRuleApplied: "Clause 5.3.3: Silver counted (350 Miles)."
        }
      ],
      contestMiles: 1750,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 1750,
      rank: 7,
      isDisqualified: false,
      immersionTripEligibility: "On Hold • Reschedule Slot within 48h to Re-activate"
    }
  },
  {
    id: "std-9",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@student.grit.edu",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    cohort: "NIAT 2025 cohort",
    trackBadgeName: "Full Stack Engineering Track Badge",
    trackBadgeStatus: "nullified", // 9. MALPRACTICE: CAUGHT DOING MALPRACTICE AND FLAGGED LATER • BADGE NULLIFIED 🚫
    trackBadgeNotice:
      "Track Badge Nullified & Revoked: Candidate was caught doing malpractice and flagged post-evaluation audit (Ref: SEC-2026-904). All earned credentials, Miles, and Immersion Trip entitlements have been permanently nullified per NIAT Skilling Regulations and Qualiflyer Clause 5.3.2.",
    clearedSkillsCount: 0,
    totalSkillsRequired: 5,
    allSkillsCleared: false,
    eligibilityStatus: "Ineligible",
    bookingStatus: "evaluated",
    bookedSlotId: "slot-108",
    deadlineDaysRemaining: 0,
    notificationEmailSentAt: "2026-11-08T19:00:00Z",
    skills: createSkillsArray({
      "skill-sys": { status: "not_started", bestGrade: null, finalMiles: 0, clearedAt: null },
      "skill-dsa": { status: "not_started", bestGrade: null, finalMiles: 0, clearedAt: null },
      "skill-db": { status: "not_started", bestGrade: null, finalMiles: 0, clearedAt: null },
      "skill-micro": { status: "not_started", bestGrade: null, finalMiles: 0, clearedAt: null },
      "skill-fsd": { status: "not_started", bestGrade: null, finalMiles: 0, clearedAt: null }
    }),
    interviewerReview: {
      interviewerId: "int-1",
      interviewerName: "Arjun Nair",
      conductedAt: "2026-11-08T15:45:00Z",
      recommendedOutcome: "malpractice",
      recommendedScore: null,
      rubric: {
        problemSolving: 0,
        systemDesign: 0,
        codeQuality: 0,
        communication: 0
      },
      observations:
        "Interview terminated at minute 18. Automated telemetry detected code injection stream from external unauthorized process, and secondary audio cues indicated real-time external prompting.",
      strengths: ["N/A — Evaluation invalidated for honor code violation"],
      areasToWatch: ["Academic Integrity Board review required"]
    },
    evaluation: {
      outcome: "malpractice",
      score: null,
      maxScore: 100,
      badgeAwarded: false,
      evaluatedAt: "2026-11-08T18:00:00Z",
      evaluatorId: "team-1",
      evaluatorName: "Preeti Sundaram",
      rubric: {
        problemSolving: 0,
        systemDesign: 0,
        codeQuality: 0,
        communication: 0
      },
      feedback:
        "Academic Integrity Board Action: Evaluation invalidated due to detected unauthorized external assistance and proscribed tool injection during the live coding component (Incident Ref: SEC-2026-904). Candidate placed on academic hold. Track Badge has been nullified.",
      incidentRef: "SEC-2026-904",
      violationType: "Unauthorized External Assistance / Code Injection",
      evidence:
        "Automated IDE telemetry detected paste stream from non-whitelisted external process and audio feed registered secondary prompter.",
      appealDeadline: "48 Hours from Notice",
      hearingDate: "Nov 18, 2026",
      strengths: [
        "Right to submit written appeal to integrity@grit.edu within 48 hours"
      ],
      improvements: ["Adhere strictly to GRIT Honor Code Section 4.2"]
    },
    milestones: {
      skills: "locked",
      interview: "malpractice",
      badge: "revoked",
      capstone: "locked"
    },
    qualiflyer: {
      batch: "NIAT 2025",
      section: "Section Beta",
      trackBadge: {
        name: "Full Stack Engineering Track Badge",
        level: "Revoked (Nullified)",
        status: "nullified",
        earnedAt: null,
        deadline: "2026-12-31"
      },
      contests: [
        {
          skillId: "skill-sys",
          skillName: "Distributed Rate Limiter & Scalability",
          campusInvigilated: true,
          attempts: [
            { attemptNum: 1, grade: "gold", miles: 500, date: "2026-09-15", venue: "NIAT Campus Lab 1" }
          ],
          highestGrade: "gold",
          finalMiles: 0,
          attemptsRuleApplied: "Clause 5.3.2 Disqualification: All contest Miles forfeited due to detected malpractice."
        }
      ],
      contestMiles: 0,
      bonusMiles: 0,
      bonusBreakdown: [],
      totalMiles: 0,
      rank: "DQ",
      isDisqualified: true,
      disqualificationReason:
        "Breach of Clause 5.3.2 & Academic Integrity Board Reference SEC-2026-904. Disqualified for artificial score inflation and unauthorized code injection. All accrued Miles, Bonus Miles, Track Badges, and Immersion Trip entitlements permanently forfeited.",
      immersionTripEligibility: "Disqualified (Badge Nullified & Miles Forfeited)"
    }
  }
];

export const INITIAL_INTERVIEWERS = [
  {
    id: "int-1",
    name: "Arjun Nair",
    title: "Staff Software Engineer & Lead Evaluator",
    company: "GRIT Engineering",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    email: "arjun.nair@grit.edu",
    specialties: [
      "Distributed Systems",
      "System Design",
      "React / Node.js Architecture"
    ],
    bio: "12+ years building distributed cloud platforms. Evaluates live online interviews for students who have cleared all Track Badge skill contests.",
    totalSlots: 7,
    bookedSlots: 1,
    completedEvaluations: 4
  },
  {
    id: "int-2",
    name: "Dr. Meera Swaminathan",
    title: "Principal Systems Architect",
    company: "GRIT Faculty",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
    email: "meera.s@grit.edu",
    specialties: ["Data Structures", "Database Internals", "API Scalability"],
    bio: "Former BigTech infrastructure architect. Specializes in low-latency systems and clean data modeling.",
    totalSlots: 2,
    bookedSlots: 0,
    completedEvaluations: 1
  },
  {
    id: "int-3",
    name: "Rajesh Sengupta",
    title: "Senior Full Stack Lead",
    company: "GRIT Industry Partner",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    email: "rajesh.sengupta@grit.edu",
    specialties: ["Full Stack Web", "TypeScript / GraphQL", "Testing & CI/CD"],
    bio: "Passionate engineering mentor focused on production readiness, maintainability, and clear developer communication.",
    totalSlots: 2,
    bookedSlots: 0,
    completedEvaluations: 0
  }
];

export const INITIAL_SLOTS = [
  // Arjun Nair slots
  {
    id: "slot-101",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-08",
    startTime: "10:00",
    endTime: "10:45",
    durationMinutes: 45,
    status: "completed",
    bookedByStudentId: "std-6",
    bookedByStudentName: "Priya Patel",
    meetingLink: "https://meet.grit.edu/eval-arjun-101",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-102",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-14",
    startTime: "14:00",
    endTime: "14:45",
    durationMinutes: 45,
    status: "booked",
    bookedByStudentId: "std-4",
    bookedByStudentName: "Rohan Verma",
    meetingLink: "https://meet.grit.edu/eval-arjun-102",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-104",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-10",
    startTime: "16:00",
    endTime: "16:45",
    durationMinutes: 45,
    status: "completed",
    bookedByStudentId: "std-5",
    bookedByStudentName: "Aditi Rao",
    meetingLink: "https://meet.grit.edu/eval-arjun-104",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-107",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-09",
    startTime: "14:00",
    endTime: "14:45",
    durationMinutes: 45,
    status: "no_show",
    bookedByStudentId: "std-8",
    bookedByStudentName: "Neha Kulkarni",
    meetingLink: "https://meet.grit.edu/eval-arjun-107",
    track: "Full Stack Engineering Track Badge",
    note: "Candidate absent: did not join within 15 min window"
  },
  {
    id: "slot-108",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-08",
    startTime: "15:00",
    endTime: "15:45",
    durationMinutes: 45,
    status: "malpractice",
    bookedByStudentId: "std-9",
    bookedByStudentName: "Vikram Malhotra",
    meetingLink: "https://meet.grit.edu/eval-arjun-108",
    track: "Full Stack Engineering Track Badge",
    note: "Flagged for Academic Integrity violation (SEC-2026-904)"
  },
  {
    id: "slot-201",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-15",
    startTime: "11:00",
    endTime: "11:45",
    durationMinutes: 45,
    status: "available",
    bookedByStudentId: null,
    bookedByStudentName: null,
    meetingLink: "https://meet.grit.edu/eval-arjun-201",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-202",
    interviewerId: "int-1",
    interviewerName: "Arjun Nair",
    date: "2026-11-16",
    startTime: "15:30",
    endTime: "16:15",
    durationMinutes: 45,
    status: "available",
    bookedByStudentId: null,
    bookedByStudentName: null,
    meetingLink: "https://meet.grit.edu/eval-arjun-202",
    track: "Full Stack Engineering Track Badge"
  },

  // Dr. Meera Swaminathan slots
  {
    id: "slot-103",
    interviewerId: "int-2",
    interviewerName: "Dr. Meera Swaminathan",
    date: "2026-11-09",
    startTime: "11:00",
    endTime: "11:45",
    durationMinutes: 45,
    status: "completed",
    bookedByStudentId: "std-7",
    bookedByStudentName: "Kabir Mehta",
    meetingLink: "https://meet.grit.edu/eval-meera-103",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-203",
    interviewerId: "int-2",
    interviewerName: "Dr. Meera Swaminathan",
    date: "2026-11-17",
    startTime: "10:00",
    endTime: "10:45",
    durationMinutes: 45,
    status: "available",
    bookedByStudentId: null,
    bookedByStudentName: null,
    meetingLink: "https://meet.grit.edu/eval-meera-203",
    track: "Full Stack Engineering Track Badge"
  },

  // Rajesh Sengupta slots
  {
    id: "slot-204",
    interviewerId: "int-3",
    interviewerName: "Rajesh Sengupta",
    date: "2026-11-18",
    startTime: "14:00",
    endTime: "14:45",
    durationMinutes: 45,
    status: "available",
    bookedByStudentId: null,
    bookedByStudentName: null,
    meetingLink: "https://meet.grit.edu/eval-rajesh-204",
    track: "Full Stack Engineering Track Badge"
  },
  {
    id: "slot-205",
    interviewerId: "int-3",
    interviewerName: "Rajesh Sengupta",
    date: "2026-11-19",
    startTime: "16:00",
    endTime: "16:45",
    durationMinutes: 45,
    status: "available",
    bookedByStudentId: null,
    bookedByStudentName: null,
    meetingLink: "https://meet.grit.edu/eval-rajesh-205",
    track: "Full Stack Engineering Track Badge"
  }
];

export const INITIAL_INTERVIEW_TEAM = {
  id: "team-1",
  name: "Preeti Sundaram",
  title: "Interview Team Lead & Track Badge Authority",
  email: "preeti.sundaram@grit.edu",
  avatar:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&h=150&q=80",
  cohortName: "NIAT 2025 cohort"
};

export const INITIAL_ADMIN = INITIAL_INTERVIEW_TEAM;
