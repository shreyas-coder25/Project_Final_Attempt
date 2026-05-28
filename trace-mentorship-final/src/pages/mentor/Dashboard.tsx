import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  MessageSquare,
  Settings,
  User,
  LogOut,
  X,
  CheckCircle2,
  XCircle,
  Archive,
  ChevronRight,
  Star,
  BookOpen,
  Inbox,
  Send,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import MentorChat from "@/src/components/MentorChat";
import { getMentorById, type MentorProfile } from "@/src/data/mentors";
import {
  subscribeMentorshipsForMentor,
  updateMentorshipStatus,
  deleteMentorship,
  type MentorshipRecord,
} from "@/src/lib/store";
import MentorProfileEdit from "@/src/components/MentorProfileEdit";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [tab, setTab] = useState<"mentees" | "requests">("requests");
  const [selected, setSelected] = useState<MentorshipRecord | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStudent, setChatStudent] = useState<MentorshipRecord | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [mentorships, setMentorships] = useState<MentorshipRecord[]>([]);

  useEffect(() => {
    import("@/src/lib/firebase").then(async ({ ensureAuth }) => {
      try {
        const currentUser = await ensureAuth();
        const mentorId = currentUser.uid;

        import("@/src/lib/store").then(({ subscribeMentorProfile, subscribeMentorshipsForMentor }) => {
          const unsubProfile = subscribeMentorProfile(
            mentorId,
            (data) => {
              if (data) {
                setMentor(data);
              } else {
                navigate("/mentor/onboarding");
              }
            },
            (err) => console.error("Mentor profile sync error", err)
          );

          const unsubscribe = subscribeMentorshipsForMentor(
            mentorId,
            (data) => setMentorships(data),
            (err) => console.error("Mentorship sync error", err)
          );

          return () => {
            unsubProfile();
            unsubscribe();
          };
        });
      } catch (err) {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (!mentor) return null;

  const refreshData = () => { /* No-op, real-time listener handles this */ };
  const active = mentorships.filter((r) => r.status === "active");
  const pending = mentorships.filter((r) => r.status === "pending");
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("mentorAuth");
    sessionStorage.removeItem("mentorId");
    navigate("/mentor/login");
  };

  const openChat = (record: MentorshipRecord) => {
    setChatStudent(record);
    setChatOpen(true);
  };
  const acceptRequest = (record: MentorshipRecord) => {
    updateMentorshipStatus(record.id, "active");
    refreshData();
    setSelected(null);
    showToast(`Accepted! ${record.studentName} is now your mentee.`);
    setTab("mentees");
  };
  const declineRequest = (record: MentorshipRecord) => {
    deleteMentorship(record.id);
    refreshData();
    setSelected(null);
    showToast("Request declined.");
  };
  const archiveMentee = (record: MentorshipRecord) => {
    updateMentorshipStatus(record.id, "archived");
    refreshData();
    setSelected(null);
    showToast("Mentorship archived.");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
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

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-10 h-10 rounded-full bg-neutral-100"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-neutral-900 truncate">
                {mentor.name}
              </div>
              <div className="text-xs text-neutral-500 truncate">
                {mentor.domain}
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => {
              setTab("requests");
              setSelected(null);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "requests" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            <span className="flex items-center gap-2">
              <Inbox className="w-4 h-4" /> Requests
            </span>
            {pending.length > 0 && (
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setTab("mentees");
              setSelected(null);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "mentees" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> My Mentees
            </span>
            {active.length > 0 && (
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {active.length}
              </span>
            )}
          </button>
          <div className="pt-4 border-t border-neutral-100 mt-4 space-y-1">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2.5 mb-2">
              Account
            </div>
            <button
              onClick={() => setProfileOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <User className="w-4 h-4" /> My Profile
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </nav>
        <div className="p-3 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-neutral-200 flex items-center gap-2 px-4 py-2">
        <img src={mentor.avatar} alt="" className="w-7 h-7 rounded-full" />
        <span className="text-sm font-bold truncate">{mentor.name}</span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => {
              setTab("requests");
              setSelected(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "requests" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}
          >
            Requests{pending.length > 0 ? ` (${pending.length})` : ""}
          </button>
          <button
            onClick={() => {
              setTab("mentees");
              setSelected(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === "mentees" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}
          >
            Mentees{active.length > 0 ? ` (${active.length})` : ""}
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-8 md:pt-8 pt-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Requests Tab */}
          {tab === "requests" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                  Mentorship Requests
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Review and accept new student requests for {mentor.domain}.
                </p>
              </div>
              {pending.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
                  <Inbox className="w-12 h-12 mx-auto mb-4 text-neutral-200" />
                  <h3 className="font-bold text-neutral-900 text-lg mb-2">
                    No requests yet
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    When students select {mentor.domain} during onboarding, their
                    mentorship requests will appear here. You can then review
                    their profile and accept or decline.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelected(record)}
                      className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-md ${selected?.id === record.id ? "border-neutral-900 shadow-md" : "border-neutral-200 hover:border-neutral-300"}`}
                    >
                      <img
                        src={record.studentAvatar}
                        alt={record.studentName}
                        className="w-12 h-12 rounded-full bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">
                            {record.studentName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 rounded text-amber-700 font-medium shrink-0">
                            New Request
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 truncate mt-0.5">
                          {record.studentYear} {record.studentBranch} ·{" "}
                          {record.studentGoals}
                        </p>
                      </div>
                      <div className="text-xs text-neutral-400 shrink-0 hidden sm:block">
                        {new Date(record.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Mentees Tab */}
          {tab === "mentees" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                  Active Mentees
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Your current students in {mentor.domain}.
                </p>
              </div>
              {active.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-neutral-200" />
                  <h3 className="font-bold text-neutral-900 text-lg mb-2">
                    No active mentees
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Accept student requests from the Requests tab to start
                    mentoring. Accepted students will appear here with their
                    chat threads.
                  </p>
                  {pending.length > 0 && (
                    <Button
                      className="mt-6 gap-2"
                      onClick={() => setTab("requests")}
                    >
                      <Inbox className="w-4 h-4" /> View {pending.length}{" "}
                      Pending Request{pending.length > 1 ? "s" : ""}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {active.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelected(record)}
                      className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-md ${selected?.id === record.id ? "border-neutral-900 shadow-md" : "border-neutral-200 hover:border-neutral-300"}`}
                    >
                      <img
                        src={record.studentAvatar}
                        alt={record.studentName}
                        className="w-12 h-12 rounded-full bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 truncate">
                            {record.studentName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-green-100 rounded text-green-700 font-medium shrink-0">
                            Active
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-neutral-100 rounded text-neutral-500 font-medium shrink-0">
                            {record.studentYear} {record.studentBranch}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 truncate mt-0.5">
                          {record.studentGoals}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Student Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white border-l border-neutral-200 z-40 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-neutral-100 p-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-neutral-900">Student Profile</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selected.studentAvatar}
                  alt={selected.studentName}
                  className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200"
                />
                <div>
                  <h4 className="font-bold text-lg text-neutral-900">
                    {selected.studentName}
                  </h4>
                  <p className="text-sm text-neutral-500">
                    {selected.studentYear} {selected.studentBranch}
                  </p>
                  <span
                    className={`inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${selected.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {selected.status === "pending"
                      ? "Awaiting your response"
                      : "Active mentee"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Domain</div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {selected.studentDomain}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Goal</div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {selected.studentGoals}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Current Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.studentSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {selected.status === "active" && (
                  <>
                    <Button
                      className="w-full gap-2"
                      onClick={() => openChat(selected)}
                    >
                      <MessageSquare className="w-4 h-4" /> Message Student
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => showToast("Roadmap task assigned!")}
                    >
                      <Star className="w-4 h-4" /> Assign Roadmap Task
                    </Button>
                    <button
                      onClick={() => archiveMentee(selected)}
                      className="w-full text-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors pt-2 flex items-center justify-center gap-1.5"
                    >
                      <Archive className="w-3.5 h-3.5" /> Archive Mentorship
                    </button>
                  </>
                )}
                {selected.status === "pending" && (
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-sm text-amber-800">
                        <strong>{selected.studentName}</strong> wants to be
                        mentored by you in{" "}
                        <strong>{selected.studentDomain}</strong>. Review their
                        profile and accept to start the mentorship.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => acceptRequest(selected)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => declineRequest(selected)}
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentor Chat */}
      {chatStudent && (
        <MentorChat
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setChatStudent(null);
          }}
          mentorId={mentor.id}
          mentorName={mentor.name}
          mentorAvatar={mentor.avatar}
          mentorTitle={mentor.title}
          studentId={chatStudent.studentId}
          studentName={chatStudent.studentName}
          domain={mentor.domain}
          role="mentor"
        />
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {profileOpen && mentor && (
          <MentorProfileEdit
            profile={mentor}
            onClose={() => setProfileOpen(false)}
            onSave={(updated) => setMentor(updated)}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Settings
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    desc: "Get notified when students message you",
                  },
                  {
                    label: "Auto-accept Requests",
                    desc: "Automatically accept mentorship requests",
                  },
                  {
                    label: "Show Online Status",
                    desc: "Let students see when you're available",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {s.label}
                      </div>
                      <div className="text-xs text-neutral-500">{s.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-300 peer-checked:bg-neutral-900 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-6"
                onClick={() => setSettingsOpen(false)}
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
