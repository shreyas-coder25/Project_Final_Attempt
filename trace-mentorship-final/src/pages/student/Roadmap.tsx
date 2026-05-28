import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAuth } from "@/src/lib/firebase";
import { getStudentProfile, getGeneratedRoadmap, saveGeneratedRoadmap, type GeneratedRoadmap } from "@/src/lib/store";
import { generatePersonalizedRoadmap } from "@/src/lib/gemini";
import RoadmapView from "@/src/components/RoadmapView";
import { ArrowLeft, Sparkles, Target, Clock, Zap, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
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
    skillLevel: "",
    targetRole: "",
    deadline: ""
  });

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
      const generated = await generatePersonalizedRoadmap({
        domain: studentDomain || "Engineering",
        skillLevel: formData.skillLevel,
        targetRole: formData.targetRole,
        deadline: formData.deadline
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
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> What is your current skill level in {studentDomain}?
            </h3>
            <div className="grid gap-3">
              {["Beginner (Just starting out)", "Intermediate (Know the basics, built some projects)", "Advanced (Looking for deep expertise/mastery)"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, skillLevel: level })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.skillLevel === level
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-neutral-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-800">{level}</span>
                    {formData.skillLevel === level && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.skillLevel} className="gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> What is your target role or primary goal?
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {["Crack an internship", "Build a strong portfolio", "Clear GATE/Masters", "Land a full-time job", "Learn for fun"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setFormData({ ...formData, targetRole: chip })}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm font-medium text-neutral-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type your specific goal..."
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            />
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!formData.targetRole.trim()} className="gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> What is your timeline & commitment?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <label className="text-sm font-semibold text-neutral-600 col-span-full">Timeline</label>
              {["3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "4 Years"].map((time) => (
                <button
                  key={time}
                  onClick={() => setFormData({ ...formData, deadline: time })}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    formData.deadline.includes(time)
                      ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-900"
                      : "border-neutral-200 bg-white hover:border-indigo-200 text-neutral-700"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              <label className="text-sm font-semibold text-neutral-600">Weekly Commitment</label>
              <select 
                onChange={(e) => setFormData({ ...formData, deadline: formData.deadline.split(" | ")[0] + " | " + e.target.value })}
                className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select hours...</option>
                <option value="1-2 hours/week">1-2 hours/week (Light)</option>
                <option value="3-5 hours/week">3-5 hours/week (Moderate)</option>
                <option value="10+ hours/week">10+ hours/week (Intense)</option>
              </select>
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleGenerate} disabled={!formData.deadline.includes("|") || isGenerating} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
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
