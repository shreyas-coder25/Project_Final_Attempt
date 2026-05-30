import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAuth } from "@/src/lib/firebase";
import { getStudentProfile, getGeneratedRoadmap, saveGeneratedRoadmap, addChatMessage, type GeneratedRoadmap, type StudentProfile } from "@/src/lib/store";
import { generatePersonalizedRoadmap } from "@/src/lib/gemini";
import RoadmapView from "@/src/components/RoadmapView";
import { branches } from "@/src/data/domainMatrix";
import { ArrowLeft, Sparkles, Target, Clock, Zap, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<GeneratedRoadmap | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [userId, setUserId] = useState("");

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    timeline: "3", // default 3 months
    currentLevel: "",
    hoursPerWeek: 5
  });
  
  // For sending to mentor
  const [isSendingToMentor, setIsSendingToMentor] = useState(false);
  const [sentToMentor, setSentToMentor] = useState(false);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    ensureAuth()
      .then(async (user) => {
        setUserId(user.uid);
        const [profile, roadmap] = await Promise.all([
          getStudentProfile(user.uid),
          getGeneratedRoadmap(user.uid)
        ]);
        if (profile) {
          setStudentProfile(profile);
        }
        if (roadmap) {
          setRoadmapData(roadmap);
          setHasRoadmap(true);
        }
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generatePersonalizedRoadmap({
        topic: formData.topic,
        timeline: formData.timeline,
        currentLevel: formData.currentLevel,
        hoursPerWeek: formData.hoursPerWeek,
        studentBranch: studentProfile?.branch,
        studentRole: studentProfile?.domain,
        studentSkills: studentProfile?.skills,
        studentGoals: studentProfile?.goals
      });
      await saveGeneratedRoadmap(userId, generated);
      setRoadmapData(generated);
      setHasRoadmap(true);
      setWizardOpen(false);
    } catch (error) {
      console.error("Failed to generate roadmap", error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateMilestone = async (id: string, status: "upcoming" | "active" | "done") => {
    if (!roadmapData) return;
    
    // For legacy flat milestones
    let newMilestones = roadmapData.milestones;
    if (newMilestones) {
      newMilestones = newMilestones.map(m => m.id === id ? { ...m, status } : m);
    }

    // For new phase-based milestones
    let newPhases = roadmapData.phases;
    if (newPhases) {
      newPhases = newPhases.map(p => ({
        ...p,
        milestones: p.milestones.map(m => m.id === id ? { ...m, status } : m)
      }));
    }

    const updated: GeneratedRoadmap = {
      ...roadmapData,
      milestones: newMilestones,
      phases: newPhases
    };
    
    setRoadmapData(updated);
    await saveGeneratedRoadmap(userId, updated);
  };
  
  // Implemented for Task 12
  const handleSendToMentor = async () => {
    if (!userId) return;
    setIsSendingToMentor(true);
    try {
      // Find active mentorship
      const { getDocs, collection, query, where } = await import("firebase/firestore");
      const { requireFirebase } = await import("@/src/lib/firebase");
      const { db: firestore } = requireFirebase();
      
      const snap = await getDocs(query(collection(firestore, "mentorships"), where("studentId", "==", userId)));
      const active = snap.docs.filter(d => d.data().status !== "archived");
      
      if (active.length > 0) {
        await Promise.all(
          active.map(m => 
            addChatMessage(m.id, "student", "🗺️ I've generated my AI learning roadmap! Check it out.")
          )
        );
        setSentToMentor(true);
      } else {
        alert("No active mentor found.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message to mentor.");
    } finally {
      setIsSendingToMentor(false);
    }
  };

  // Helper for slider labels
  const getTimelineLabel = (months: number) => {
    if (months === 1) return "1 month";
    if (months < 12) return `${months} months`;
    if (months === 12) return "1 year";
    if (months === 18) return "1.5 years";
    if (months === 24) return "2 years";
    if (months === 36) return "3 years";
    if (months === 48) return "4 years";
    return `${months} months`;
  };

  const renderWizardStep = () => {
    switch (step) {
      case 1: {
        let suggestions = ["DSA", "Web Development", "Machine Learning", "DevOps", "GATE Prep", "Android Dev"];
        if (studentProfile?.branch) {
          const branchObj = branches.find(b => b.title === studentProfile.branch);
          if (branchObj) {
            suggestions = branchObj.roleCategories.flatMap(c => c.roles).slice(0, 8);
          }
        }
        
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> What do you want to learn?
            </h3>
            
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Web Development"
                  value={formData.topic}
                  onChange={(e) => updateFormData({ topic: e.target.value })}
                  className="w-full p-4 text-lg rounded-xl border-2 border-neutral-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <p className="text-sm font-semibold text-neutral-500 mb-3">Suggestions for {studentProfile?.branch || "you"}:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => updateFormData({ topic: s })}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-neutral-200 bg-white text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.topic.trim()} className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      }
      case 2: {
        // We need a slider that maps to 1, 2, 3, 4, 6, 9, 12, 18, 24, 36, 48
        const timelineValues = [1, 2, 3, 4, 6, 9, 12, 18, 24, 36, 48];
        const currentIndex = timelineValues.indexOf(Number(formData.timeline)) !== -1 
          ? timelineValues.indexOf(Number(formData.timeline)) 
          : 2; // default to index 2 (3 months)
          
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> How much time do you have?
            </h3>
            
            <div className="space-y-12 py-8 px-4">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-indigo-600">{getTimelineLabel(Number(formData.timeline))}</span>
                <p className="text-neutral-500 mt-2">Target completion timeline</p>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={timelineValues.length - 1}
                  value={currentIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    updateFormData({ timeline: timelineValues[idx].toString() });
                  }}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs font-medium text-neutral-400 mt-3 px-1">
                  <span>1m</span>
                  <span>6m</span>
                  <span>1y</span>
                  <span>2y</span>
                  <span>4y</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      }
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> Where are you right now?
            </h3>
            
            <div className="space-y-4">
              {[
                { id: "beginner", title: "Beginner", desc: "Starting from zero, no prior knowledge" },
                { id: "intermediate", title: "Intermediate", desc: "Know the basics, ready for projects" },
                { id: "advanced", title: "Advanced", desc: "Experienced, looking for mastery" }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => updateFormData({ currentLevel: level.id })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.currentLevel === level.id
                      ? "border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-100"
                      : "border-neutral-200 bg-white hover:border-indigo-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="font-bold text-neutral-900 text-lg">{level.title}</div>
                  <div className="text-sm text-neutral-500 mt-1">{level.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)} disabled={!formData.currentLevel} className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Final details
            </h3>
            
            <div className="space-y-12 py-8 px-4">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-indigo-600">{formData.hoursPerWeek}</span>
                <span className="text-xl font-medium text-neutral-500 ml-2">hours / week</span>
                <p className="text-neutral-500 mt-2">How much time can you commit?</p>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.hoursPerWeek}
                  onChange={(e) => updateFormData({ hoursPerWeek: Number(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs font-medium text-neutral-400 mt-3 px-1">
                  <span>1 hr</span>
                  <span>15 hrs</span>
                  <span>30 hrs</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 h-11 px-6 text-base"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? "Generating..." : "Generate My Roadmap"}
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-medium">Loading your AI Roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 theme-indigo">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate("/student")}
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-2">
                My AI Learning Roadmap
              </h1>
              <p className="text-neutral-500 mt-1">
                Personalized path generated specifically for you.
              </p>
            </div>
            {hasRoadmap && (
              <Button 
                onClick={handleSendToMentor} 
                disabled={isSendingToMentor || sentToMentor}
                className="bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm self-start sm:self-auto"
              >
                {isSendingToMentor ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {sentToMentor ? "Sent for Approval" : "Send to Mentor"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {!hasRoadmap ? (
          wizardOpen ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: step >= s ? "100%" : "0%" }}
                    />
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {renderWizardStep()}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">Ready to map out your journey?</h2>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
                Answer 4 quick questions about your goals. Our AI will generate a highly tailored, step-by-step roadmap using the best resources available.
              </p>
              <Button size="lg" onClick={() => setWizardOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-base px-8 h-12">
                Start Wizard
              </Button>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            {roadmapData && (
              <RoadmapView 
                roadmap={roadmapData}
                onUpdateMilestone={handleUpdateMilestone}
                onRegenerate={() => {
                  setWizardOpen(true);
                  setStep(1); // Reset step
                  setHasRoadmap(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
