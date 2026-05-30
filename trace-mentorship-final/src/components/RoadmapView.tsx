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
  Send,
  Target,
  Sparkles,
  MapPin,
  Flag,
  Lightbulb
} from "lucide-react";
import { Button } from "./ui/Button";
import { type GeneratedRoadmap, type GeneratedRoadmapMilestone } from "@/src/lib/store";

interface RoadmapViewProps {
  roadmap: GeneratedRoadmap;
  onUpdateMilestone: (milestoneId: string, status: "upcoming" | "active" | "done") => void;
  onRegenerate?: () => void;
  onSendToMentor?: () => void;
  isPendingApproval?: boolean;
}

export default function RoadmapView({ roadmap, onUpdateMilestone, onRegenerate, onSendToMentor, isPendingApproval }: RoadmapViewProps) {
  const isPhased = !!roadmap.phases;
  const [activePhase, setActivePhase] = useState<number>(1);
  
  const allMilestones = isPhased 
    ? roadmap.phases!.flatMap(p => p.milestones)
    : (roadmap.milestones || []);
    
  const completedCount = allMilestones.filter(m => m.status === "done").length;
  const totalCount = allMilestones.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const shortTerm = !isPhased && roadmap.milestones ? roadmap.milestones.filter(m => m.phase === "short-term") : [];
  const longTerm = !isPhased && roadmap.milestones ? roadmap.milestones.filter(m => m.phase === "long-term") : [];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Progress Bar & Meta Summary */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Your Journey Progress</h2>
            <p className="text-sm text-neutral-500">
              {completedCount} of {totalCount} goals completed
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{progressPercent}%</span>
          </div>
        </div>
        
        {/* The Bar */}
        <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Meta Info */}
        {roadmap.meta && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-100 text-sm">
            <div className="flex items-center gap-1.5 text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-neutral-900">{roadmap.meta.timeline}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
              <Target className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-neutral-900">{roadmap.meta.hoursPerWeek} hrs/week</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-neutral-900 capitalize">{roadmap.meta.level}</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {roadmap.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" /> Roadmap Overview
          </h3>
          <p className="text-neutral-600 leading-relaxed bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm text-sm">
            {roadmap.summary}
          </p>
        </div>
      )}

      {/* Honest Advice */}
      {roadmap.honestAdvice && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex gap-4">
          <div className="shrink-0 mt-1">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-1">Honest Advice</h3>
            <p className="text-amber-800 leading-relaxed text-sm">{roadmap.honestAdvice}</p>
          </div>
          {onRegenerate && (
            <div className="ml-auto shrink-0 self-start">
              <Button variant="outline" size="sm" onClick={onRegenerate} className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 gap-2">
                <RefreshCcw className="w-4 h-4" /> Regenerate
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {roadmap.tips && roadmap.tips.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {roadmap.tips.map((tip, i) => (
              <div key={i} className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-12 relative">
        <div className="absolute left-[11px] sm:left-[27px] top-4 bottom-8 w-0.5 bg-neutral-200 z-0"></div>

        {isPhased && roadmap.phases && (
          <div className="mb-8 relative z-10 pl-6 sm:pl-14 flex flex-wrap gap-2">
            {roadmap.phases.map((p) => (
              <button
                key={p.phaseNumber}
                onClick={() => {
                  setActivePhase(p.phaseNumber);
                  document.getElementById(`phase-${p.phaseNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                  activePhase === p.phaseNumber
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-md"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Phase {p.phaseNumber}
              </button>
            ))}
          </div>
        )}

        {isPhased && roadmap.phases && roadmap.phases.map((phase, pIndex) => {
          const isExpanded = activePhase === phase.phaseNumber;
          return (
            <div key={`phase-${pIndex}`} id={`phase-${phase.phaseNumber}`} className="relative z-10">
              <div 
                className="flex items-center gap-4 mb-6 cursor-pointer group"
                onClick={() => setActivePhase(isExpanded ? 0 : phase.phaseNumber)}
              >
                <div className={`w-6 h-6 sm:w-14 sm:h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 relative z-10 transition-colors ${isExpanded ? "bg-indigo-600" : "bg-indigo-100 group-hover:bg-indigo-200"}`}>
                  <Flag className={`w-3 h-3 sm:w-6 sm:h-6 ${isExpanded ? "text-white" : "text-indigo-600"}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center justify-between">
                    <span>Phase {phase.phaseNumber}: {phase.title}</span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </h2>
                  <p className="text-sm text-neutral-500 font-medium">{phase.theme} • {phase.durationWeeks} Weeks</p>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 sm:pl-14 space-y-6 pb-6">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800 flex items-start gap-3 relative z-10 shadow-sm">
                        <Target className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <p><span className="font-semibold">Goal:</span> {phase.weeklyGoal}</p>
                      </div>

                      {phase.milestones.map((milestone, mIndex) => (
                        <MilestoneCard 
                          key={milestone.id} 
                          milestone={milestone} 
                          index={`${phase.phaseNumber}.${mIndex + 1}`} 
                          onUpdateStatus={(status) => onUpdateMilestone(milestone.id, status)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {!isPhased && shortTerm.length > 0 && (
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2 pl-6 sm:pl-14">
              <span className="w-3 h-3 rounded-full bg-indigo-500 absolute left-1 sm:left-[22px] border-2 border-white z-10"></span>
              Short-Term Milestones
            </h2>
            <div className="pl-6 sm:pl-14 space-y-6">
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

        {!isPhased && longTerm.length > 0 && (
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2 pt-6 pl-6 sm:pl-14">
              <span className="w-3 h-3 rounded-full bg-emerald-500 absolute left-1 sm:left-[22px] border-2 border-white z-10"></span>
              Long-Term Milestones
            </h2>
            <div className="pl-6 sm:pl-14 space-y-6">
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
        <div className="mt-12 pt-8 border-t border-neutral-200 flex justify-center relative z-10">
          <Button 
            size="lg" 
            onClick={onSendToMentor} 
            disabled={isPendingApproval}
            className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            {isPendingApproval ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isPendingApproval ? "Sent for Approval" : "Send Roadmap to Mentor"}
          </Button>
        </div>
      )}
    </div>
  );
}

interface MilestoneCardProps {
  milestone: GeneratedRoadmapMilestone;
  index: number | string;
  onUpdateStatus: (s: "upcoming" | "active" | "done") => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    if (milestone.status === "done") return "bg-emerald-100 border-emerald-200 text-emerald-800";
    if (milestone.status === "active") return "bg-indigo-100 border-indigo-200 text-indigo-800";
    return "bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200 cursor-pointer";
  };

  const cycleStatus = () => {
    if (milestone.status === "upcoming") onUpdateStatus("active");
    else if (milestone.status === "active") onUpdateStatus("done");
    else onUpdateStatus("upcoming");
  };

  const getDifficultyColor = () => {
    switch (milestone.difficulty) {
      case "beginner": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "intermediate": return "bg-amber-100 text-amber-700 border-amber-200";
      case "advanced": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const formatResourceTime = (mins?: number) => {
    if (!mins) return "";
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all relative z-10 ${milestone.status === "active" ? "border-indigo-300 shadow-md ring-1 ring-indigo-100" : "border-neutral-200 shadow-sm"}`}>
      
      {/* Done Checkmark Overlay */}
      {milestone.status === "done" && (
        <div className="absolute top-4 right-4 text-emerald-500">
          <CheckCircle2 className="w-8 h-8 opacity-20" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
              {index}
            </span>
            <button 
              onClick={cycleStatus}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${getStatusColor()}`}
            >
              {milestone.status === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {milestone.status === "active" && <Circle className="w-3.5 h-3.5" />}
              {milestone.status.toUpperCase()}
            </button>
            {milestone.difficulty && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getDifficultyColor()}`}>
                {milestone.difficulty}
              </span>
            )}
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 flex items-center gap-1 sm:ml-auto">
              <Clock className="w-3 h-3" /> {milestone.estimatedHours}h
            </span>
          </div>
          
          <h3 className={`text-lg font-bold mb-2 pr-10 ${milestone.status === "done" ? "text-neutral-500 line-through decoration-neutral-300" : "text-neutral-900"}`}>
            {milestone.title}
          </h3>
          
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{milestone.description}</p>
          
          {milestone.why && (
            <p className="text-xs text-indigo-700 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 mb-4 italic">
              <span className="font-bold not-italic">Why this matters:</span> {milestone.why}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {milestone.skills.map(s => (
              <span key={s} className="text-[11px] font-semibold px-2 py-1 rounded bg-neutral-100 border border-neutral-200 text-neutral-700">
                {s}
              </span>
            ))}
          </div>
          
          {/* Practice & Criteria */}
          {milestone.practiceTask && (
            <div className="mb-4 space-y-3">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-rose-500" /> Practice Task
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">{milestone.practiceTask}</p>
              </div>
              
              {milestone.completionCriteria && (
                <div className="flex items-start gap-2 text-sm text-neutral-600 pl-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p><span className="font-semibold text-neutral-800">To complete:</span> {milestone.completionCriteria}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {milestone.resources && milestone.resources.length > 0 && (
        <div className="mt-2 pt-4 border-t border-neutral-100">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors w-full p-2 -ml-2 rounded-lg hover:bg-indigo-50"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? "Hide Learning Resources" : `View Learning Resources (${milestone.resources.length})`}
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid gap-2 pt-2">
                  {milestone.resources.map((res, idx) => (
                    <a 
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group shadow-sm hover:shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg shrink-0">
                          {res.type === "video" && <PlayCircle className="w-4 h-4" />}
                          {res.type === "youtube" && <PlayCircle className="w-4 h-4" />}
                          {res.type === "doc" && <FileText className="w-4 h-4" />}
                          {res.type === "docs" && <FileText className="w-4 h-4" />}
                          {res.type === "article" && <FileText className="w-4 h-4" />}
                          {res.type === "course" && <GraduationCap className="w-4 h-4" />}
                          {res.type === "nptel" && <GraduationCap className="w-4 h-4" />}
                          {res.type === "coursera" && <GraduationCap className="w-4 h-4" />}
                          {res.type === "practice" && <Target className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-neutral-800 group-hover:text-indigo-700 block line-clamp-1">
                            {res.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                              {res.type}
                            </span>
                            {res.isPrimary && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Highly Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {res.estimatedMinutes && (
                        <div className="text-xs font-semibold text-neutral-500 bg-neutral-50 px-2 py-1 rounded-md shrink-0 sm:ml-auto w-fit">
                          {formatResourceTime(res.estimatedMinutes)}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
