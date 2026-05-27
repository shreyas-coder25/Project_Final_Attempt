import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { mentors, getMentorByUsername } from "@/src/data/mentors";
import { saveMentorUser } from "@/src/lib/store";

export default function MentorLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const mentor = getMentorByUsername(username.trim().toLowerCase());
    if (!mentor) { setError("No mentor found with this username."); return; }
    if (password !== "admin123") { setError("Incorrect password."); return; }
    
    try {
      const { auth } = await import("@/src/lib/firebase").then(m => m.requireFirebase());
      const { signInAnonymously } = await import("firebase/auth");
      await signInAnonymously(auth);
      
      await saveMentorUser(mentor);
      sessionStorage.setItem("mentorAuth", "true");
      sessionStorage.setItem("mentorId", mentor.id);
      navigate("/mentor");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in to Firebase.");
    }
  };

  const quickLogin = (uname: string) => { setUsername(uname); setPassword("admin123"); setError(""); };

  // Show 1 featured mentor per domain for demo cards
  const domains = ["Web Development", "AI / ML", "Data Science", "Cybersecurity", "App Development", "Systems & DevOps", "Placements & DSA"];
  const featured = domains.map((d) => mentors.find((m) => m.domain === d)).filter(Boolean) as typeof mentors;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-neutral-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">T</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Mentor Dashboard</h1>
          <p className="text-sm text-neutral-500">Sign in to access your personalized mentor dashboard.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Username</label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" /><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. nikhil.web" className="w-full h-11 pl-10 pr-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors" autoComplete="username" /></div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full h-11 pl-10 pr-12 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
          </div>
          <Button type="submit" className="w-full h-11 text-sm">Sign In</Button>
        </form>

        {/* Demo Accounts — one per domain */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Demo Accounts</h3>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((m) => (
              <button key={m.id} onClick={() => quickLogin(m.username)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${username === m.username ? "border-neutral-900 bg-neutral-50 shadow-sm" : "border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50"}`}>
                <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full bg-neutral-100" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-900 truncate">{m.name.split(" ")[0]}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{m.domain}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400">Password for all: <span className="font-mono font-semibold text-neutral-600">admin123</span></p>

          {/* All usernames reference */}
          <details className="text-xs text-neutral-400">
            <summary className="cursor-pointer hover:text-neutral-600 transition-colors text-center">View all {mentors.length} mentor usernames</summary>
            <div className="mt-3 space-y-1 max-h-48 overflow-y-auto bg-neutral-50 rounded-lg p-3 border border-neutral-100">
              {mentors.map((m) => (
                <button key={m.id} onClick={() => quickLogin(m.username)} className="w-full text-left flex justify-between items-center py-1.5 px-2 rounded hover:bg-white transition-colors">
                  <span className="font-mono text-neutral-700">{m.username}</span>
                  <span className="text-neutral-400 truncate ml-2">{m.name}</span>
                </button>
              ))}
            </div>
          </details>
        </div>
      </motion.div>
    </div>
  );
}
