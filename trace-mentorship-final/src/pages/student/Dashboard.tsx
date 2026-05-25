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
  Loader2,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import AssistantChat from "@/src/components/AssistantChat";
import MentorChat from "@/src/components/MentorChat";
import { getMentorById, getMentorsForDomain } from "@/src/data/mentors";
import {
  subscribeStudentProfile,
  subscribeMentorshipForStudent,
  getStudentId,
  updateRoadmapProgress,
  updateMentorTasks,
} from "@/src/lib/store";


export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [mentorship, setMentorship] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubMentorship: (() => void) | null = null;

    const setupSubscriptions = () => {
      const studentId = getStudentId();
      if (studentId === "temp_student_id") {
        // Fallback to local profile parsing first
        const raw = localStorage.getItem("studentProfile");
        if (!raw) {
          navigate("/onboarding");
          return;
        }
        try {
          setProfile(JSON.parse(raw));
          setLoading(false);
        } catch {
          navigate("/onboarding");
        }
        return;
      }

      unsubProfile = subscribeStudentProfile(
        studentId,
        (prof) => {
          if (prof) {
            setProfile(prof);
          } else {
            const raw = localStorage.getItem("studentProfile");
            if (raw) {
              try { setProfile(JSON.parse(raw)); } catch {}
            } else {
              navigate("/onboarding");
            }
          }
          setLoading(false);
        },
        (err) => {
          console.error("Profile subscription error:", err);
          setLoading(false);
        }
      );

      unsubMentorship = subscribeMentorshipForStudent(
        studentId,
        (record) => {
          setMentorship(record);
        },
        (err) => {
          console.error("Mentorship subscription error:", err);
        }
      );
    };

    setupSubscriptions();

    if (searchParams.get("matched") === "true") {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 4000);
    }

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubMentorship) unsubMentorship();
    };
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto" />
          <p className="text-sm text-neutral-400">Loading your mentorship dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const mentor = mentorship ? getMentorById(mentorship.mentorId) : null;
  const studentId = getStudentId();
  const isPending = mentorship?.status === "pending";
  const isActive = mentorship?.status === "active";

  const domainMentors = getMentorsForDomain(profile.domain || "");
  const firstName = profile.name?.split(" ")[0] || "Student";
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const handleLogout = () => {
    localStorage.removeItem("studentProfile");
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
                {mentor
                  ? `Your mentorship request has been sent to ${mentor.name}. They'll review it soon!`
                  : "Your mentor will review your request soon!"}
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
              {isPending && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
                  <Hourglass className="w-4 h-4" /> Awaiting Mentor Approval
                </div>
              )}
              {isActive && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Mentorship Active
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
            {/* Mentor Card — Pending State */}
            {mentor && isPending && (
              <Card className="overflow-hidden border-2 border-amber-200 bg-amber-50/30">
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
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 4).map((e) => (
                      <span
                        key={e}
                        className="px-3 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-700"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mentor Card — Active State */}
            {mentor && isActive && (
              <Card className="overflow-hidden border-2 border-green-200">
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
                      onClick={() => setChatOpen(true)}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Message Mentor
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        showToast("Call link copied — share with your mentor!")
                      }
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Learning Roadmap & Tasks */}
            {mentor && isActive && mentorship && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-neutral-900" />
                      AI Learning Roadmap & Tasks
                    </span>
                    <span className="text-xs font-semibold bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full">
                      {mentorship.progress || 0}% Complete
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Roadmap Stepper */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 mb-3">Milestones</h4>
                    <div className="space-y-3">
                      {(mentorship.roadmap || []).length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No roadmap generated yet.</p>
                      ) : (
                        (mentorship.roadmap || []).map((step: any, index: number) => (
                          <div key={step.id || index} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <button
                                onClick={async () => {
                                  const newRoadmap = [...mentorship.roadmap];
                                  newRoadmap[index] = {
                                    ...step,
                                    status: step.status === "done" ? "upcoming" : "done",
                                  };
                                  await updateRoadmapProgress(mentorship.id, newRoadmap);
                                  showToast(step.status === "done" ? "Milestone marked incomplete" : "Milestone completed!");
                                }}
                                className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-colors shrink-0 ${
                                  step.status === "done"
                                    ? "bg-[#0a0a0b] border-[#0a0a0b] text-white"
                                    : "border-neutral-300 hover:border-neutral-900 bg-white text-neutral-400"
                                }`}
                              >
                                {step.status === "done" ? "✓" : index + 1}
                              </button>
                              {index < mentorship.roadmap.length - 1 && (
                                <div className="w-[2px] h-6 bg-neutral-200 my-1" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-medium ${step.status === "done" ? "line-through text-neutral-400" : "text-neutral-900"} truncate`}>
                                {step.title}
                              </div>
                              {step.resources && step.resources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {step.resources.map((res: string, idx: number) => (
                                    <a
                                      key={idx}
                                      href="#"
                                      onClick={(e) => { e.preventDefault(); showToast(`Opening resource: ${res}`); }}
                                      className="text-[10px] text-neutral-500 hover:text-neutral-900 underline flex items-center gap-0.5"
                                    >
                                      <BookOpen className="w-2.5 h-2.5" /> {res}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Mentor Tasks */}
                  <div className="border-t border-neutral-100 pt-4">
                    <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-neutral-600" />
                      Tasks Assigned by Mentor
                    </h4>
                    {(!mentorship.tasks || mentorship.tasks.length === 0) ? (
                      <p className="text-xs text-neutral-500 italic">No tasks assigned yet by your mentor.</p>
                    ) : (
                      <div className="space-y-2">
                        {mentorship.tasks.map((task: any) => (
                          <label
                            key={task.id}
                            className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                              task.done
                                ? "bg-neutral-50/50 border-neutral-200"
                                : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={async () => {
                                const newTasks = mentorship.tasks.map((t: any) =>
                                  t.id === task.id ? { ...t, done: !t.done } : t
                                );
                                await updateMentorTasks(mentorship.id, newTasks);
                                showToast(task.done ? "Task marked incomplete" : "Task completed!");
                              }}
                              className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            />
                            <span className={`text-sm ${task.done ? "line-through text-neutral-400" : "text-neutral-700 font-medium"}`}>
                              {task.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No mentor fallback */}
            {!mentor && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-neutral-300" />
                  <h3 className="font-bold text-neutral-900 mb-2">
                    No mentor assigned yet
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    Complete the onboarding to get matched with a domain mentor.
                  </p>
                  <Button onClick={() => navigate("/onboarding")}>
                    Start Onboarding
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Other mentors in domain */}
            {domainMentors.length > 1 && mentor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-4 h-4 text-neutral-500" /> Other Mentors
                    in {profile.domain}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    {domainMentors
                      .filter((m) => m.id !== mentor.id)
                      .slice(0, 3)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100"
                        >
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-10 h-10 rounded-full bg-neutral-100"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-neutral-900 truncate">
                              {m.name}
                            </div>
                            <div className="text-xs text-neutral-500 truncate">
                              {m.title}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                            {m.rating}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat Preview — empty state */}
            {isActive && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-neutral-500" />{" "}
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Send className="w-8 h-8 mx-auto mb-3 text-neutral-200 rotate-[-30deg]" />
                    <p className="text-sm text-neutral-500 mb-1">
                      No messages yet
                    </p>
                    <p className="text-xs text-neutral-400 mb-4">
                      Start a conversation with your mentor
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setChatOpen(true)}
                      className="gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                  onClick={() => showToast("Resources page coming soon!")}
                  className="w-full text-left p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-700 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-neutral-500" /> Browse
                  Resources
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

      {/* Mentor Chat — only available when mentorship is active */}
      {mentor && mentorship && isActive && (
        <MentorChat
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          mentorId={mentor.id}
          mentorName={mentor.name}
          mentorAvatar={mentor.avatar}
          mentorTitle={mentor.title}
          studentId={studentId}
          studentName={profile.name || "Student"}
          domain={profile.domain}
          role="student"
        />
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit3 className="w-8 h-8 mx-auto mb-4 text-neutral-400" />
              <h3 className="font-bold text-neutral-900 mb-2">Edit Profile</h3>
              <p className="text-sm text-neutral-500 mb-6">
                To update your profile, please go through the onboarding again
                with your updated information.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    localStorage.removeItem("studentProfile");
                    navigate("/onboarding");
                  }}
                >
                  Re-onboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
