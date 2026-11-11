import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  CheckCircle2,
  Clock,
  Terminal,
  Code,
  User,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function SimulatedCallModal({ isOpen, onClose, slot, student, onCompleteAndReview }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [code, setCode] = useState(`// Problem: Implement a Distributed Token Bucket Rate Limiter
// Constraints: Capacity C, Refill Rate R tokens/sec, Thread-safe

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);
    this.lastRefill = now;
  }

  allowRequest(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true; // Request allowed
    }
    return false; // Rate limit exceeded (HTTP 429)
  }
}

// Test Run
const limiter = new TokenBucket(5, 1);
console.log("Request 1:", limiter.allowRequest());
console.log("Request 2:", limiter.allowRequest());
`);
  const [terminalOutput, setTerminalOutput] = useState('Sandbox ready. Click "Run Code & Tests" to execute.');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput('Compiling in V8 sandbox...');
    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(`> TokenBucket instance initialized (Capacity: 5, RefillRate: 1 token/sec)
> Request 1: true (Status: 200 OK, remaining: 4 tokens)
> Request 2: true (Status: 200 OK, remaining: 3 tokens)
> Burst test passed: 5 consecutive requests allowed
> Rate limit test passed: Request 6 returned HTTP 429 Too Many Requests
✓ All 4 unit test assertions passed in 14ms.`);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GRIT Live Technical Interview Sandbox"
      subtitle={`Session: ${slot?.interviewerName || 'Arjun Nair'} & ${student?.name || 'Candidate'} • 45 Min Live Coding`}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Top meeting status bar */}
        <div className="bg-[#1E0404] text-[#FFFEF7] p-3.5 rounded-xl border-2 border-[#1E0404] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-heading font-black text-[#F4DF38] uppercase tracking-wider">
              Live Session Active
            </span>
            <span className="text-stone-400">|</span>
            <span className="font-mono text-stone-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F4DF38]" />
              Time Remaining: <strong>{formatTimer(secondsRemaining)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-1.5 rounded-lg border border-stone-600 transition-colors ${
                micOn ? 'bg-stone-800 text-white' : 'bg-red-800 text-white'
              }`}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-1.5 rounded-lg border border-stone-600 transition-colors ${
                cameraOn ? 'bg-stone-800 text-white' : 'bg-red-800 text-white'
              }`}
              title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {cameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video Feeds Simulation (Side-by-side) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Evaluator Feed */}
          <div className="h-36 rounded-xl border-2 border-[#1E0404] bg-stone-900 relative overflow-hidden flex items-center justify-center grit-shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=200&q=80"
              alt="Evaluator"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-2 left-2 bg-[#1E0404]/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-heading font-bold flex items-center gap-1.5 border border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{slot?.interviewerName || 'Arjun Nair'} (Lead Evaluator)</span>
            </div>
          </div>

          {/* Student Feed */}
          <div className="h-36 rounded-xl border-2 border-[#1E0404] bg-stone-900 relative overflow-hidden flex items-center justify-center grit-shadow-sm">
            {cameraOn ? (
              <img
                src={student?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=200&q=80"}
                alt="Student"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="text-center text-stone-500 text-xs font-heading font-bold">
                <VideoOff className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <span>Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-[#1E0404]/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-heading font-bold flex items-center gap-1.5 border border-stone-700">
              <span className={`w-2 h-2 rounded-full ${cameraOn ? 'bg-emerald-400' : 'bg-stone-500'}`}></span>
              <span>{student?.name || 'Aarav Sharma'} (Candidate)</span>
            </div>
          </div>
        </div>

        {/* Live Code Editor & Sandbox */}
        <div className="rounded-xl border-2 border-[#1E0404] bg-[#1E0404] overflow-hidden grit-shadow-sm">
          <div className="bg-[#1E0404] text-[#FFFEF7] px-4 py-2 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#F4DF38]" />
              <span className="font-heading font-black text-xs text-[#FFFEF7]">
                Live Collaborative Code Editor (JavaScript / Node.js)
              </span>
            </div>
            <GritButton
              size="sm"
              variant="primary"
              icon={Play}
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run Code & Tests ➔'}
            </GritButton>
          </div>

          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 font-mono text-xs text-stone-100 bg-[#1E0404] focus:outline-none resize-none leading-relaxed selection:bg-[#F4DF38] selection:text-[#1E0404]"
            spellCheck={false}
          />

          {/* Terminal / Test Output */}
          <div className="border-t border-stone-800 bg-stone-950 p-3.5 font-mono text-[11px] text-stone-300">
            <div className="flex items-center gap-1.5 text-stone-400 mb-1 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#F4DF38]" />
              <span>Execution Output & Unit Test Results:</span>
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap leading-tight">{terminalOutput}</pre>
          </div>
        </div>

        {/* Session Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <div className="text-xs text-stone-600 font-sans">
            Candidate is actively demonstrating problem solving, trade-offs, and architecture.
          </div>

          <div className="flex items-center gap-3">
            <GritButton variant="secondary" onClick={onClose}>
              Leave Room
            </GritButton>
            <GritButton
              variant="purple"
              icon={CheckCircle2}
              onClick={() => {
                onClose();
                if (onCompleteAndReview) onCompleteAndReview();
              }}
            >
              Conclude Session & Submit Evaluator Review ➔
            </GritButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

