import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Clock,
  LogOut,
  Sparkles,
  BookOpen,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Hourglass,
  Send,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import AssistantChat from "@/src/components/AssistantChat";
import { getMentorById, getMentorsForDomain } from "@/src/data/mentors";
import { useAllMentors } from "@/src/hooks/useMentors";
import { subscribeStudentProfile, subscribeAllMentorshipsForStudent, getStudentId, resetStudentProfile, updateMentorshipStatus, type MentorshipRecord } from "@/src/lib/store";
import { ensureAuth } from "@/src/lib/firebase";
import { requireFirebase } from "@/src/lib/firebase";
import StudentProfileEdit from "@/src/components/StudentProfileEdit";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [mentorships, setMentorships] = useState<MentorshipRecord[]>([]);
  const [loadingMentorship, setLoadingMentorship] = useState(true);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(searchParams.get("matched") === "true");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [ratingSubmitting, setRatingSubmitting] = useState<string | null>(null);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);

  const allMentorsPool = useAllMentors();

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubMentorships: (() => void) | undefined;

    ensureAuth().then((user) => {
      setUid(user.uid);
      unsubProfile = subscribeStudentProfile(
        user.uid,
        (data) => {
          if (data) {
            setProfile(data);
          } else {
            navigate("/onboarding");
          }
        },
        (err) => console.error("Profile sync error", err)
      );

      import("@/src/lib/store").then(({ subscribeAllMentorshipsForStudent, getMyRatingForMentor }) => {
        unsubMentorships = subscribeAllMentorshipsForStudent(
          user.uid,
          (data) => {
            setMentorships(data);
            setLoadingMentorship(false);
            
            // Fetch my ratings for active mentors
            data.filter(m => m.status === "active").forEach(async (m) => {
              try {
                const myRating = await getMyRatingForMentor(m.mentorId, user.uid);
                if (myRating !== null) {
                  setRatings(prev => ({ ...prev, [m.mentorId]: myRating }));
                }
              } catch (e) {
                console.error("Failed to load rating for", m.mentorId);
              }
            });
          },
          (err) => {
            console.error("Mentorships sync error", err);
            setLoadingMentorship(false);
          }
        );
      });
    }).catch(() => {
      navigate("/login");
    });

    if (searchParams.get("matched") === "true") {
      setTimeout(() => setShowWelcome(false), 4000);
    }

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubMentorships) unsubMentorships();
    };
  }, [navigate, searchParams]);

  if (!profile) return null;
  const studentId = getStudentId();
  const activeMentorships = mentorships.filter((m) => m.status === "active");

  const handleRateMentor = async (mentorId: string, rating: number) => {
    if (!uid) return;
    setRatingSubmitting(mentorId);
    try {
      const { submitMentorRating } = await import("@/src/lib/store");
      await submitMentorRating(mentorId, uid, rating);
      setRatings(prev => ({ ...prev, [mentorId]: rating }));
      setRatingMessage("Thanks for rating!");
      setTimeout(() => setRatingMessage(null), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setRatingSubmitting(null);
    }
  };

  const pendingMentorships = mentorships.filter((m) => m.status === "pending");

  const domainMentors = getMentorsForDomain(profile.domain || "", allMentorsPool);
  const firstName = profile.name?.split(" ")[0] || "Student";
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const handleLogout = async () => {
    const { auth } = requireFirebase();
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hourglass className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Request Sent!
              </h2>
              <p className="text-neutral-500 max-w-xs mx-auto">
                Your mentor request has been sent! They'll review it soon!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Welcome, {firstName}.
              </h1>
              <p className="text-neutral-500 mt-1">
                {profile.year} {profile.branch} · {profile.domain}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {pendingMentorships.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
                  <Hourglass className="w-4 h-4" /> {pendingMentorships.length} Awaiting Approval
                </div>
              )}
              {activeMentorships.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> {activeMentorships.length} Active
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Find Mentor Action (Always available if they want to add more) */}
            <div className="flex justify-end">
              <Button onClick={() => navigate("/student/mentors")} className="gap-2">
                <Sparkles className="w-4 h-4" /> Find More Mentors
              </Button>
            </div>

            {/* Active Mentors */}
            {activeMentorships.map((m) => {
              const mentor = getMentorById(m.mentorId, allMentorsPool);
              if (!mentor) return null;
              return (
                <Card key={m.id} className="overflow-hidden border-2 border-green-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-neutral-900">
                            {mentor.name}
                          </h2>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{mentor.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Avg response:{" "}
                            {mentor.responseTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                            {mentor.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">
                          Mentorship Accepted
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        {mentor.name.split(" ")[0]} has accepted your request! You can now
                        message them and start your guided learning journey.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        onClick={() => navigate(`/student/chat?mentorId=${mentor.id}`)}
                        className="gap-2"
                      >
                        <MessageSquare className="w-4 h-4" /> Message Mentor
                      </Button>
                      <div className="flex items-center gap-1.5 sm:ml-auto bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-200">
                        <span className="text-xs font-semibold text-neutral-500 mr-1">Rate Mentor:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            disabled={ratingSubmitting === mentor.id}
                            onClick={() => handleRateMentor(mentor.id, star)}
                            className="p-1 hover:scale-125 transition-transform disabled:opacity-50 focus:outline-none"
                          >
                            <Star className={`w-4 h-4 ${
                              (ratings[mentor.id] || 0) >= star 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-neutral-300"
                            }`} />
                          </button>
                        ))}
                        {ratingMessage && ratingSubmitting !== mentor.id && ratings[mentor.id] && (
                          <span className="text-xs text-green-600 font-medium animate-in fade-in ml-2 hidden sm:inline-block">
                            {ratingMessage}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => showToast("Call link copied — share with your mentor!")}
                        className="gap-2"
                      >
                        <Calendar className="w-4 h-4" /> Schedule Call
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          if (confirm("Are you sure you want to leave this mentorship?")) {
                            await updateMentorshipStatus(m.id, "archived");
                            showToast("You have left the mentorship.");
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        Leave Mentor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Pending Requests */}
            {pendingMentorships.map((m) => {
              const mentor = getMentorById(m.mentorId, allMentorsPool);
              if (!mentor) return null;
              return (
                <Card key={m.id} className="overflow-hidden border-2 border-amber-200 bg-amber-50/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-neutral-900">
                          {mentor.name}
                        </h2>
                        <p className="text-sm text-neutral-500">{mentor.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Avg response:{" "}
                            {mentor.responseTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                            {mentor.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Hourglass className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">
                          Waiting for Acceptance
                        </span>
                      </div>
                      <p className="text-sm text-amber-700">
                        Your mentorship request has been sent to {mentor.name.split(" ")[0]}. 
                        Once they accept, you'll be able to start chatting and 
                        receiving personalized guidance.
                      </p>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          if (confirm("Are you sure you want to cancel this request?")) {
                            await updateMentorshipStatus(m.id, "archived");
                            showToast("Request cancelled.");
                          }
                        }}
                        className="text-neutral-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Cancel Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* No mentors fallback */}
            {mentorships.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-neutral-300" />
                  <h3 className="font-bold text-neutral-900 mb-2">
                    No mentor assigned yet
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    Find and request mentors that match your goals.
                  </p>
                  <Button onClick={() => navigate("/student/mentors")}>
                    Find Mentors
                  </Button>
                </CardContent>
              </Card>
            )}



            {/* Chat Preview Removed -> Direct to /student/chat */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">Name</div>
                    <div className="font-semibold text-neutral-900">
                      {profile.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">Year</div>
                    <div className="font-semibold text-neutral-900">
                      {profile.year}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">Branch</div>
                    <div className="font-semibold text-neutral-900">
                      {profile.branch}
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-100 pt-4 space-y-3">
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">
                      Primary Goal
                    </div>
                    <div className="font-semibold text-neutral-900 text-sm">
                      {profile.goals ||
                        profile.primaryGoal ||
                        "Build projects"}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">
                      Commitment
                    </div>
                    <div className="font-semibold text-neutral-900 text-sm">
                      {(profile.availability || "3-5 hours/week").replace(
                        /\s*hours\/week$/i,
                        ""
                      )}{" "}
                      hours/week
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs mb-1">
                      Current Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(profile.skills || []).map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-neutral-100 rounded-md text-xs font-medium text-neutral-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full text-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors pt-2 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <button
                  onClick={() => setAssistantOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-indigo-900">
                      AI Learning Companion
                    </div>
                    <div className="text-xs text-indigo-600">
                      Get instant help between mentor sessions
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Quick Actions
                </h4>
                <button
                  onClick={() => navigate("/roadmap")}
                  className="w-full text-left p-3 rounded-xl bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 transition-colors text-sm font-medium text-white flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" /> My AI Roadmap
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full text-left p-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors text-sm font-medium text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> Restart Onboarding
                </button>
                <button
                  onClick={() => showToast("Join link copied to clipboard!")}
                  className="w-full text-left p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-neutral-500" /> Upcoming
                  Sessions
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AssistantChat
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        studentProfile={profile}
      />

      {/* Mentor Chat Modal Removed */}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && profile && (
          <StudentProfileEdit
            profile={profile as any}
            onClose={() => setEditOpen(false)}
            onSave={(updated) => setProfile(updated)}
          />
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => !isResetting && setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-500" /> Restart Onboarding?
              </h3>
              <p className="text-sm text-neutral-500 mb-6">
                This will permanently delete your current profile and unmatch you from your mentor. You cannot undo this action.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setIsResetting(true);
                    try {
                      await resetStudentProfile();
                      // Redirect happens via subscription listener automatically
                    } catch (err) {
                      console.error("Reset failed", err);
                      showToast("Failed to reset profile. Please try again.");
                      setIsResetting(false);
                      setShowResetConfirm(false);
                    }
                  }}
                  disabled={isResetting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 shadow-none"
                >
                  {isResetting ? "Resetting..." : "Yes, Reset"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
