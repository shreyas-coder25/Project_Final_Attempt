import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAuth } from "@/src/lib/firebase";
import { getStudentProfile, getGeneratedRoadmap, saveGeneratedRoadmap, type GeneratedRoadmap } from "@/src/lib/store";
import { generatePersonalizedRoadmap } from "@/src/lib/gemini";
import RoadmapView from "@/src/components/RoadmapView";
import { domainMatrix } from "@/src/data/domainMatrix";
import { ArrowLeft, Sparkles, Target, Clock, Zap, ChevronRight, CheckCircle2, Loader2, Code, Settings, PenTool, Briefcase } from "lucide-react";

// Helper for icons
const getDomainIcon = (title: string) => {
  switch (title) {
    case "Software & AI": return <Code className="w-8 h-8 text-indigo-500 mb-4" />;
    case "Core Engineering": return <Settings className="w-8 h-8 text-orange-500 mb-4" />;
    case "Design & Product": return <PenTool className="w-8 h-8 text-pink-500 mb-4" />;
    case "Business & Management": return <Briefcase className="w-8 h-8 text-emerald-500 mb-4" />;
    default: return <Sparkles className="w-8 h-8 text-indigo-500 mb-4" />;
  }
};
import { Button } from "@/src/components/ui/Button";

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState<GeneratedRoadmap | null>(null);
  const [studentDomain, setStudentDomain] = useState("");
  const [userId, setUserId] = useState("");

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    majorDomain: "",
    targetRoles: [] as string[],
    currentSkills: [] as string[],
    isAbsoluteBeginner: false,
    currentLevel: "",
    primaryGoal: "",
    timeCommitment: ""
  });

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
          setStudentDomain(profile.domain);
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
      const generated = await generatePersonalizedRoadmap(formData);
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
    const updated = {
      ...roadmapData,
      milestones: roadmapData.milestones.map(m => m.id === id ? { ...m, status } : m)
    };
    setRoadmapData(updated);
    await saveGeneratedRoadmap(userId, updated);
  };

  const renderWizardStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> Choose your primary path
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(domainMatrix).map((domain) => (
                <button
                  key={domain.title}
                  onClick={() => {
                    updateFormData({ 
                      majorDomain: domain.title, 
                      targetRoles: [], 
                      currentSkills: [], 
                      isAbsoluteBeginner: false 
                    });
                  }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    formData.majorDomain === domain.title
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-100"
                      : "border-neutral-200 bg-white hover:border-indigo-200 hover:bg-neutral-50 shadow-sm"
                  }`}
                >
                  {getDomainIcon(domain.title)}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-lg mb-1">{domain.title}</h4>
                      <p className="text-sm text-neutral-500 leading-relaxed">{domain.description}</p>
                    </div>
                    {formData.majorDomain === domain.title && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.majorDomain} className="gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 2: {
        const domainData = domainMatrix[formData.majorDomain];
        if (!domainData) return null;
        
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> What are your target roles and skills?
            </h3>
            
            <div className="space-y-8">
              {/* Target Roles */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-3">
                  Target Roles (Select one or more)
                </label>
                <div className="flex flex-wrap gap-2">
                  {domainData.roles.map((role) => {
                    const isSelected = formData.targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          const newRoles = isSelected 
                            ? formData.targetRoles.filter(r => r !== role)
                            : [...formData.targetRoles, role];
                          updateFormData({ targetRoles: newRoles });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" 
                            : "bg-white border-neutral-200 text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Skills */}
              <div className="pt-6 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-neutral-700 block">
                    Current Skills
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-amber-700 cursor-pointer bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100 transition-colors">
                    <input 
                      type="checkbox" 
                      className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                      checked={formData.isAbsoluteBeginner}
                      onChange={(e) => {
                        const isBeginner = e.target.checked;
                        updateFormData({ 
                          isAbsoluteBeginner: isBeginner,
                          currentSkills: isBeginner ? [] : formData.currentSkills
                        });
                      }}
                    />
                    None / Absolute Beginner
                  </label>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {domainData.skills.map((skill) => {
                    const isSelected = formData.currentSkills.includes(skill);
                    const disabled = formData.isAbsoluteBeginner;
                    return (
                      <button
                        key={skill}
                        disabled={disabled}
                        onClick={() => {
                          const newSkills = isSelected
                            ? formData.currentSkills.filter(s => s !== skill)
                            : [...formData.currentSkills, skill];
                          updateFormData({ currentSkills: newSkills });
                        }}
                        className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                          disabled 
                            ? "opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-200 text-neutral-400"
                            : isSelected
                              ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                              : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={formData.targetRoles.length === 0 || (!formData.isAbsoluteBeginner && formData.currentSkills.length === 0)} 
                className="gap-2"
              >
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
              <Clock className="w-5 h-5 text-indigo-500" /> Final details
            </h3>
            
            <div className="space-y-6">
              {/* Current Level */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-2">Current Level</label>
                <div className="flex gap-3">
                  {["Beginner", "Intermediate"].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateFormData({ currentLevel: level })}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        formData.currentLevel === level
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-indigo-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-2">Primary Goal</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Internship", "Build a Project", "General Upskilling"].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => updateFormData({ primaryGoal: goal })}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        formData.primaryGoal === goal
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or specify another goal..."
                  value={!["Internship", "Build a Project", "General Upskilling", ""].includes(formData.primaryGoal) ? formData.primaryGoal : ""}
                  onChange={(e) => updateFormData({ primaryGoal: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              {/* Time Commitment */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-2">Weekly Time Commitment</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1-3 hrs", "3-5 hrs", "10+ hrs"].map((time) => (
                    <button
                      key={time}
                      onClick={() => updateFormData({ timeCommitment: time })}
                      className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                        formData.timeCommitment === time
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-emerald-300"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!formData.currentLevel || !formData.primaryGoal.trim() || !formData.timeCommitment || isGenerating} 
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? "Generating..." : "Generate Roadmap"}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-2">
            My AI Learning Roadmap
          </h1>
          <p className="text-neutral-500 mt-1">
            Personalized path generated specifically for {studentDomain}.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {!hasRoadmap ? (
          wizardOpen ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
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
                Answer 3 quick questions about your goals and current skills. Our AI will generate a highly tailored, step-by-step roadmap using the best resources available for your specific engineering branch.
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
