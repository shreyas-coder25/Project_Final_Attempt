import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "./ui/Button";
import {
  addChatMessage,
  subscribeChatMessages,
  type ChatMessage,
} from "@/src/lib/store";

interface MentorChatProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  studentId: string;
  studentName: string;
  domain: string;
  role: "student" | "mentor";
  mentorshipId: string;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h > 12 ? h - 12 : h || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / 86400000
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MentorChat({
  isOpen,
  onClose,
  mentorId,
  mentorName,
  mentorAvatar,
  mentorTitle,
  studentId,
  studentName,
  domain,
  role,
  mentorshipId,
}: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(() => {
    return subscribeChatMessages(
      mentorshipId,
      setMessages,
      (err) => setError(err.message),
    );
  }, [mentorshipId]);

  // Load messages when opened, then keep them synced from Firestore
  useEffect(() => {
    if (!isOpen) return;
    return loadMessages();
  }, [isOpen, loadMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    try {
      await addChatMessage(mentorshipId, role, message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
    }
  };

  const otherName = role === "student" ? mentorName : studentName;
  const otherAvatar =
    role === "student"
      ? mentorAvatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}`;
  const otherTitle =
    role === "student" ? mentorTitle : `Student · ${domain}`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-[80]"
        onClick={onClose}
      />
      <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-full sm:h-[600px] sm:max-h-[calc(100vh-120px)] bg-white sm:rounded-2xl shadow-2xl border-0 sm:border border-neutral-200 flex flex-col z-[90] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-neutral-100 bg-white flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors sm:hidden"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
          <img
            src={otherAvatar}
            alt={otherName}
            className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-neutral-900 truncate">
              {otherName}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-neutral-500 truncate">
                {otherTitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500">
              <Video className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hidden sm:block"
              onClick={onClose}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa]">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-neutral-300 rotate-[-30deg]" />
              </div>
              <p className="text-sm font-semibold text-neutral-700 mb-1">
                No messages yet
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-[240px]">
                {role === "student"
                  ? `Say hello to ${otherName.split(" ")[0]}! Start your mentorship conversation.`
                  : `${otherName.split(" ")[0]} hasn't sent a message yet. Start the conversation!`}
              </p>
            </div>
          )}
          <div className="space-y-1">
            {messages.map((msg, i) => {
              const prevDate =
                i > 0
                  ? formatDateLabel(messages[i - 1].timestamp)
                  : null;
              const curDate = formatDateLabel(msg.timestamp);
              const showDate = curDate !== prevDate;
              const isMine = msg.sender === role;
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-3">
                      <span className="text-[10px] bg-neutral-200/60 text-neutral-500 px-3 py-1 rounded-full font-medium">
                        {curDate}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        isMine
                          ? "bg-neutral-900 text-white rounded-br-md"
                          : "bg-white text-neutral-800 border border-neutral-100 rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-[10px] mt-1.5 ${isMine ? "text-neutral-400" : "text-neutral-400"} text-right`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 h-10 px-4 rounded-full border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors bg-neutral-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="rounded-full h-10 w-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
