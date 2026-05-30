import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, Video, MoreVertical, MessageSquare, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { 
  subscribeMentorProfile, 
  subscribeMentorshipsForMentor, 
  subscribeChatMessages,
  addChatMessage,
  editChatMessage,
  deleteChatMessage,
  type MentorshipRecord,
  type ChatMessage 
} from "@/src/lib/store";
import { ensureAuth } from "@/src/lib/firebase";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h > 12 ? h - 12 : h || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MentorChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStudentId = searchParams.get("studentId");

  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [activeMentorships, setActiveMentorships] = useState<MentorshipRecord[]>([]);
  const [selectedMentorshipId, setSelectedMentorshipId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubMentorships: (() => void) | undefined;

    ensureAuth().then((user) => {
      unsubProfile = subscribeMentorProfile(user.uid, setProfile, console.error);
      unsubMentorships = subscribeMentorshipsForMentor(
        user.uid,
        (data) => {
          // Store already filters out 'archived', so we just use data directly
          const active = data;
          setActiveMentorships(active);
          
          if (active.length > 0) {
            // Select based on URL or just pick the first one
            if (initialStudentId) {
              const matched = active.find(m => m.studentId === initialStudentId);
              if (matched) {
                setSelectedMentorshipId(matched.id);
                return;
              }
            }
            if (!selectedMentorshipId) {
              setSelectedMentorshipId(active[0].id);
            }
          } else {
            setSelectedMentorshipId(null);
          }
        },
        console.error
      );
    }).catch(() => navigate("/login"));

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubMentorships) unsubMentorships();
    };
  }, [navigate, initialStudentId]);

  useEffect(() => {
    if (!selectedMentorshipId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeChatMessages(
      selectedMentorshipId,
      setMessages,
      console.error
    );
    return () => unsub();
  }, [selectedMentorshipId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!profile) return null;

  const selectedMentorship = activeMentorships.find(m => m.id === selectedMentorshipId);
  const studentInfo = selectedMentorship ? {
    name: selectedMentorship.studentName,
    avatar: selectedMentorship.studentAvatar,
    domain: selectedMentorship.studentDomain
  } : null;

  const handleSend = () => {
    if (!input.trim() || !selectedMentorship) return;

    if (editingMessageId) {
      editChatMessage(selectedMentorship.id, editingMessageId, input.trim());
      setEditingMessageId(null);
    } else {
      addChatMessage(selectedMentorship.id, "mentor", input.trim());
    }
    setInput("");
  };

  const handleEditClick = (msg: ChatMessage) => {
    if (msg.isDeleted) return;
    setEditingMessageId(msg.id);
    setInput(msg.text);
  };

  const handleDeleteClick = (msgId: string) => {
    if (!selectedMentorship || !confirm("Are you sure you want to delete this message?")) return;
    deleteChatMessage(selectedMentorship.id, msgId);
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-neutral-200 bg-white flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <button 
            onClick={() => navigate("/mentor")}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <h2 className="text-xl font-bold text-neutral-900">Chats</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeMentorships.length === 0 ? (
            <div className="text-center p-6 text-neutral-500 text-sm">
              No active mentees.
            </div>
          ) : (
            activeMentorships.map(m => {
              const isSelected = m.id === selectedMentorshipId;
              
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMentorshipId(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    isSelected ? "bg-indigo-50 border border-indigo-100" : "hover:bg-neutral-50 border border-transparent"
                  }`}
                >
                  <img src={m.studentAvatar} alt={m.studentName} className="w-12 h-12 rounded-full border border-neutral-200" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate text-sm ${isSelected ? "text-indigo-900" : "text-neutral-900"}`}>
                      {m.studentName}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">{m.studentDomain}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {!selectedMentorship || !studentInfo ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 p-8 text-center bg-neutral-50">
            <MessageSquare className="w-12 h-12 mb-4 text-neutral-300" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Select a Conversation</h3>
            <p className="text-sm max-w-sm">
              Choose a mentee from the sidebar to start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-16 px-4 sm:px-6 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate("/mentor")}
                  className="md:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={studentInfo.avatar} alt={studentInfo.name} className="w-10 h-10 rounded-full border border-neutral-200" />
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{studentInfo.name}</h3>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hidden sm:block">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8f9fa]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-neutral-300 rotate-[-30deg]" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-700 mb-1">
                    No messages yet
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-[240px]">
                    Say hello to {studentInfo.name.split(" ")[0]}! Start your mentorship conversation.
                  </p>
                </div>
              )}
              <div className="space-y-2 max-w-4xl mx-auto">
                {messages.map((msg, i) => {
                  const prevDate = i > 0 ? formatDateLabel(messages[i - 1].timestamp) : null;
                  const curDate = formatDateLabel(msg.timestamp);
                  const showDate = curDate !== prevDate;
                  const isMine = msg.sender === "mentor";
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-[10px] bg-neutral-200/60 text-neutral-500 px-3 py-1 rounded-full font-medium">
                            {curDate}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2 group relative`}>
                        {isMine && !msg.isDeleted && (
                          <div className="hidden group-hover:flex items-center gap-1 mr-2 opacity-60 hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(msg)} className="p-1.5 hover:bg-neutral-200 rounded-full" title="Edit">
                              <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <button onClick={() => handleDeleteClick(msg.id)} className="p-1.5 hover:bg-red-100 rounded-full" title="Delete">
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${
                            isMine
                              ? "bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl rounded-tr-sm"
                              : "bg-white text-neutral-800 border border-neutral-100 rounded-2xl rounded-tl-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                          } ${msg.isDeleted ? "italic opacity-70" : ""}`}
                        >
                          {msg.isDeleted ? "🚫 This message was deleted" : msg.text}
                          {!msg.isDeleted && msg.text.includes("🗺️ I've generated my AI learning roadmap") && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                onClick={() => navigate(`/mentor/student-roadmap/${selectedMentorship.studentId}`)}
                                className={`w-full text-xs font-semibold border-0 ${
                                  isMine
                                    ? "bg-white/20 text-white hover:bg-white/30"
                                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                }`}
                              >
                                View Roadmap
                              </Button>
                            </div>
                          )}
                          <div className={`text-[10px] mt-1 text-right opacity-60 flex justify-end gap-1 items-center`}>
                            {msg.editedAt && <span>(edited)</span>}
                            <span>{formatTime(msg.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div ref={endRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-neutral-200">
              {editingMessageId && (
                <div className="flex items-center justify-between bg-neutral-100 px-4 py-2 rounded-t-xl border border-neutral-200 border-b-0 max-w-4xl mx-auto -mb-2 relative z-0">
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="font-medium">Editing message</span>
                  </div>
                  <button 
                    onClick={() => { setEditingMessageId(null); setInput(""); }} 
                    className="p-1 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className={`flex items-center gap-3 max-w-4xl mx-auto relative z-10 ${editingMessageId ? "mt-2" : ""}`}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-12 px-5 rounded-full border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors bg-neutral-50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="rounded-full h-12 w-12 shrink-0 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
