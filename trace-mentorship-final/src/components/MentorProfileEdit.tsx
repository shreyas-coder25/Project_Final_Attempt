import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { type MentorProfile } from "@/src/data/mentors";
import { saveMentorProfile } from "@/src/lib/store";
import { Loader2 } from "lucide-react";

export default function MentorProfileEdit({
  profile,
  onClose,
  onSave,
}: {
  profile: MentorProfile;
  onClose: () => void;
  onSave: (updated: MentorProfile) => void;
}) {
  const [data, setData] = useState<MentorProfile>(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await saveMentorProfile(data);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error("Failed to save mentor profile", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-md w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Domain</label>
            <input
              type="text"
              value={data.domain}
              onChange={(e) => setData({ ...data, domain: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              disabled
              title="To change your domain, please contact support."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
            <textarea
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Expertise (comma separated)</label>
            <input
              type="text"
              value={data.expertise.join(", ")}
              onChange={(e) => setData({ ...data, expertise: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Response Time</label>
            <input
              type="text"
              value={data.responseTime}
              onChange={(e) => setData({ ...data, responseTime: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
