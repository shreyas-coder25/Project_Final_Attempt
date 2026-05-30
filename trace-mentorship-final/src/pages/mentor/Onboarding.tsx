import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/Button";
import { saveMentorProfile } from "@/src/lib/store";
import { requireFirebase } from "@/src/lib/firebase";
import { branches } from "@/src/data/domainMatrix";

export default function MentorOnboarding() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    title: "",
    branchId: "",
    bio: "",
    expertise: "",
    responseTime: "Usually responds within 24 hours"
  });

  useEffect(() => {
    // Ensure user is authenticated
    const { auth } = requireFirebase();
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { auth } = requireFirebase();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const selectedBranch = branches.find(b => b.id === data.branchId);

      const newProfile = {
        id: user.uid,
        username: user.email?.split("@")[0] || user.uid,
        name: user.displayName || "New Mentor",
        title: data.title,
        domain: selectedBranch?.title || data.branchId,
        branchId: data.branchId,
        bio: data.bio,
        expertise: data.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        responseTime: data.responseTime,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        rating: 5.0,
        ratingCount: 0,
        activeMentees: 0,
        availability: "available",
        stats: {
          mentees: 0,
          totalMentored: 0,
        }
      };

      await saveMentorProfile(newProfile as any);
      localStorage.setItem("lastActiveView", "mentor");
      navigate("/mentor");
    } catch (err) {
      console.error(err);
      alert("Failed to create mentor profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-neutral-200 p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Become a Mentor</h1>
          <p className="text-neutral-500">Set up your profile to start guiding students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Professional Title</label>
            <input
              required
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
              className="w-full h-11 px-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Branch</label>
            <select
              required
              value={data.branchId}
              onChange={(e) => setData({ ...data, branchId: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors bg-white"
            >
              <option value="" disabled>Select your primary branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Bio</label>
            <textarea
              required
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              placeholder="Tell students about your experience and how you can help..."
              className="w-full h-24 p-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Expertise (comma separated)</label>
            <input
              required
              type="text"
              value={data.expertise}
              onChange={(e) => setData({ ...data, expertise: e.target.value })}
              placeholder="e.g. React, Node.js, System Design"
              className="w-full h-11 px-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">Response Time</label>
            <select
              required
              value={data.responseTime}
              onChange={(e) => setData({ ...data, responseTime: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors bg-white"
            >
              <option value="Usually responds within 1 hour">Usually responds within 1 hour</option>
              <option value="Usually responds within 3 hours">Usually responds within 3 hours</option>
              <option value="Usually responds within 6 hours">Usually responds within 6 hours</option>
              <option value="Usually responds within 12 hours">Usually responds within 12 hours</option>
              <option value="Usually responds within 24 hours">Usually responds within 24 hours</option>
              <option value="Usually responds within 48 hours">Usually responds within 48 hours</option>
            </select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base">
            {isSubmitting ? "Creating Profile..." : "Create Mentor Profile"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
