# GRIT — Live Interview & Track Badge Evaluation Platform

A production-grade, interactive web application built for the **GRIT Skilling Competition at NIAT (2026-27)**, implementing the official **GRIT Design Kit** (`Familjen Grotesk` & `DM Sans` typography, neo-brutalist styling, 2.5px solid `#1E0404` borders, hard drop shadows, and brand color palette).

---

## 🌟 Overview & Competition Context

**GRIT** is a year-long skilling competition for engineering students at **NIAT**.
1. **Offline Invigilated Skill Contests**: Students attempt hands-on skill contests in campus labs (e.g., DSA, Full Stack React, Database Concurrency, Microservices, and System Architecture), earning Gold (500m) or Silver (350m) **Qualiflyer Miles**.
2. **Track Badge Gate**: Once a candidate clears every skill required for a Track Badge (5/5 skills for Full Stack Engineering), the **1-on-1 Live Online Interview** unlocks.
3. **Live Online Interview**: Evaluated by a team of technical interviewers across a 4-factor rubric.
4. **Track Badge Award & Leaderboard**: Passing awards the official **Track Badge** and verified credentials, positioning the student for the **Global Readiness Immersion Trip 2026-27**.
5. **Malpractice Audits & Badge Nullification (Clause 5.3.2)**: If malpractice is detected in post-evaluation audits, the Interview Team revokes and nullifies the Track Badge, forfeiting all accrued contest Miles.

---

## 🚀 Live Prototype & Portals

The application features three reactive, synchronized portals with real-time **LocalStorage** persistence:

- 🏠 **Home Tri-Portal Launcher**: `http://localhost:3000/?role=home`
- 🎓 **Page 1: Student Portal**: `http://localhost:3000/?role=student`
  - Checklist of 5 invigilated campus skill contests
  - Direct `Schedule Interview ➔` CTA when eligible
  - Dynamic Before / After status hero cards with plain-language guidance
  - Verified digital certificate modal
- 👨‍🏫 **Page 2: Interviewer Portal**: `http://localhost:3000/?role=interviewer`
  - Full CRUD operations on interview availability slots (Add single, batch-generate 45-min slots with buffers, edit, activate/pause, delete)
  - Simulated video call launcher
  - Post-interview evaluation report & 4-factor rubric grading (Problem Solving, System Architecture, Code Quality, Communication)
  - Automatic removal of numerical scores for No Show and Malpractice cases
- 📋 **Page 3: Interview Team Portal**: `http://localhost:3000/?role=interviewTeam`
  - Cohort funnel and progress bar (Eligible vs Unbooked vs Scheduled vs Evaluated)
  - Single and bulk email notification dispatchers
  - Official decision recording (Award Track Badge, Retake in 7 Days, No Show with 48h window)
  - **Nullify Badge 🚫** action with safety guardrail (disabled for candidates yet to appear)
- 🏆 **Qualiflyer Leaderboard**: `http://localhost:3000/?role=leaderboard`
  - Clause 5.3 compliance: Miles breakdown, Gold/Silver honors, and Immersion Trip rankings

---

## 🎭 Persona Presets Supported

Switchable on the fly via the top **Prototype Controls** bar:
1. **Aarav Sharma**: 5/5 Skills Cleared • Unbooked (5d remaining)
2. **Ananya Iyer**: 5/5 Skills Cleared • Unbooked (3d remaining)
3. **Divya Nair**: 2/5 Skills Cleared • Interview Locked (Ineligible)
4. **Rohan Verma**: 5/5 Skills Cleared • Interview Scheduled
5. **Aditi Rao**: 5/5 Skills Cleared • Interview Completed (Review Ready from Arjun Nair)
6. **Priya Patel**: 5/5 Skills Cleared • Track Badge Earned 🏅 (Score: 92/100)
7. **Kabir Mehta**: 5/5 Skills Cleared • Retake Required (Score: 64/100, 7-day revision window)
8. **Neha Kulkarni**: 5/5 Skills Cleared • No Show Logged (48h courtesy reschedule window)
9. **Vikram Malhotra**: Malpractice Flagged • Track Badge Nullified & Revoked (Clause 5.3.2)

---

## 🎨 Grit Design System Tokens

| Design Element | Specification | Implementation in Code |
| :--- | :--- | :--- |
| **Neutral Palette** | `#1E0404` (Espresso) & `#FFFEF7` (Cream) | Neo-brutalist solid borders, hard drop shadows (`4px 4px 0px #1E0404`), tactile active push animations |
| **Primary Accents** | `#D74247` (Crimson Red) & `#F4DF38` (Vibrant Yellow) | Alerts, urgent booking badges, CTA buttons, celebration cards |
| **Secondary Accents** | `#70449C` (Purple) & `#4277FB` (Cobalt Blue) | Unlocked milestones, calendar invites, booked slots, evaluation badges |
| **Typography** | **Familjen Grotesk** & **DM Sans** | Familjen Grotesk for bold headers, DM Sans for clean readable body copy |
| **Footer** | Official 4-Column Layout | GRIT wordmark, Instagram icon, Terms & Conditions, Bonus Miles, Tracks & Badges, Brand Kit |

---

## 🛠️ Development & Build Commands

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run production build
npm run build

# Preview build locally on port 3000
npm run preview
```

---

## 📦 Tech Stack

- **React 18** (Vite bundler)
- **Tailwind CSS** with Neo-Brutalist utility classes
- **Lucide React** icons
- **Canvas Confetti** for badge celebration
- **LocalStorage State Sync** via React Context API
