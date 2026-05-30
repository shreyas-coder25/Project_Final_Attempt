import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  FileText, 
  GraduationCap, 
  RefreshCcw, 
  AlertTriangle,
  Clock,
  Send
} from "lucide-react";
import { Button } from "./ui/Button";
import { type GeneratedRoadmap, type GeneratedRoadmapMilestone } from "@/src/lib/store";

interface RoadmapViewProps {
  roadmap: GeneratedRoadmap;
  onUpdateMilestone: (milestoneId: string, status: "upcoming" | "active" | "done") => void;
  onRegenerate: () => void;
  onSendToMentor?: () => void;
  isPendingApproval?: boolean;
}

export default function RoadmapView({ roadmap, onUpdateMilestone, onRegenerate, onSendToMentor, isPendingApproval }: RoadmapViewProps) {
  const shortTerm = roadmap.milestones.filter(m => m.phase === "short-term");
  const longTerm = roadmap.milestones.filter(m => m.phase === "long-term");

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Honest Advice Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex gap-4">
        <div className="shrink-0 mt-1">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">Honest Advice</h3>
          <p className="text-amber-800 leading-relaxed text-sm">{roadmap.honestAdvice}</p>
        </div>
        <div className="ml-auto shrink-0">
          <Button variant="outline" size="sm" onClick={onRegenerate} className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 gap-2">
            <RefreshCcw className="w-4 h-4" /> Regenerate
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {shortTerm.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              Short-Term Milestones
            </h2>
            <div className="space-y-6">
              {shortTerm.map((milestone, i) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone} 
                  index={i + 1} 
                  onUpdateStatus={(status) => onUpdateMilestone(milestone.id, status)}
                />
              ))}
            </div>
          </div>
        )}

        {longTerm.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2 pt-6 border-t border-neutral-200">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Long-Term Milestones
            </h2>
            <div className="space-y-6">
              {longTerm.map((milestone, i) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone} 
                  index={shortTerm.length + i + 1} 
                  onUpdateStatus={(status) => onUpdateMilestone(milestone.id, status)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {onSendToMentor && (
        <div className="mt-12 pt-8 border-t border-neutral-200 flex justify-center">
          <Button 
            size="lg" 
            onClick={onSendToMentor} 
            disabled={isPendingApproval}
            className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            {isPendingApproval ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isPendingApproval ? "Sent for Approval" : "Send Roadmap to Mentor for Approval"}
          </Button>
        </div>
      )}
    </div>
  );
}

interface MilestoneCardProps {
  milestone: GeneratedRoadmapMilestone;
  index: number;
  onUpdateStatus: (s: "upcoming" | "active" | "done") => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    if (milestone.status === "done") return "bg-green-100 border-green-200 text-green-700";
    if (milestone.status === "active") return "bg-indigo-100 border-indigo-200 text-indigo-700";
    return "bg-neutral-100 border-neutral-200 text-neutral-500";
  };

  const cycleStatus = () => {
    if (milestone.status === "upcoming") onUpdateStatus("active");
    else if (milestone.status === "active") onUpdateStatus("done");
    else onUpdateStatus("upcoming");
  };

  return (
    <div className="relative pl-8">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-10 bottom-[-24px] w-0.5 bg-neutral-200"></div>
      
      {/* Timeline node */}
      <div className="absolute left-0 top-3 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-600 z-10">
        {index}
      </div>

      <div className={`bg-white border rounded-xl p-5 transition-all ${milestone.status === "active" ? "border-indigo-300 shadow-md ring-1 ring-indigo-100" : "border-neutral-200"}`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {milestone.weekRange}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                ~{milestone.estimatedHours} hrs
              </span>
              <button 
                onClick={cycleStatus}
                className={`text-xs font-bold px-2 py-0.5 rounded border transition-colors flex items-center gap-1 hover:brightness-95 ${getStatusColor()}`}
              >
                {milestone.status === "done" && <CheckCircle2 className="w-3 h-3" />}
                {milestone.status === "active" && <Circle className="w-3 h-3" />}
                {milestone.status.toUpperCase()}
              </button>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">{milestone.title}</h3>
            <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{milestone.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {milestone.skills.map(s => (
                <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {milestone.resources && milestone.resources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-indigo-600 transition-colors w-full"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? "Hide Resources" : `View Resources (${milestone.resources.length})`}
            </button>
            
            <AnimatePresence>
              {expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-2 pt-4">
                    {milestone.resources.map((res, idx) => (
                      <a 
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                      >
                        <div className="text-indigo-500">
                          {res.type === "video" && <PlayCircle className="w-5 h-5" />}
                          {res.type === "doc" && <FileText className="w-5 h-5" />}
                          {res.type === "course" && <GraduationCap className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-medium text-neutral-700 group-hover:text-indigo-700">
                          {res.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
