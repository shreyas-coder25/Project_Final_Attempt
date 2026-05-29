import { useState, useEffect } from "react";
import { ensureAuth } from "@/src/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Sparkles, Star, Clock, Users } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { createMentorship, saveStudentProfile } from "@/src/lib/store";
import { getRankedMentorsForBranch, type MentorProfile } from "@/src/data/mentors";

import {
  branches,
  NOT_DECIDED_ROLE,
  getBranchById,
  getSkillsForRole,
  timelineOptions,
  shortTermGoals,
  weeklyCommitmentOptions,
  currentLevelOptions,
} from "@/src/data/domainMatrix";

const years = [
  { value: "FY", label: "FY (1st Year)" },
  { value: "SY", label: "SY (2nd Year)" },
  { value: "TY", label: "TY (3rd Year)" },
  { value: "Final", label: "Final Year" },
];

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState("");
  
  useEffect(() => {
    ensureAuth().catch(() => navigate("/login"));
  }, [navigate]);

  const [data, setData] = useState({
    name: "",
    branchId: "",
    year: "",
    role: "",
    skills: [] as string[],
    skillLevel: "",
    goals: [] as string[],
    customGoal: "",
    helpNeeded: "",
    timeline: "",
    availability: "",
  });

  const updateData = (fields: Partial<typeof data>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const toggleSkill = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleGoal = (goal: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!selectedMentorId) return;
    setIsSubmitting(true);
    
    try {
      const branchObj = getBranchById(data.branchId);
      const branchName = branchObj?.title || data.branchId;
      const roleName = data.role;
      const finalGoals = [...data.goals, data.customGoal].filter(Boolean).join(" | ");

      const profileToSave = {
        ...data,
        goals: finalGoals,
        branch: branchName,
        domain: roleName,
      };

      await saveStudentProfile(profileToSave as any);
      
      await createMentorship(
        { 
          name: data.name, 
          year: data.year, 
          branch: branchName, 
          domain: roleName, 
          goals: finalGoals, 
          skills: data.skills 
        },
        selectedMentorId,
      );

      setTimeout(() => {
        navigate("/student?matched=true");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save to Firebase. Check console for details.");
      setIsSubmitting(false);
    }
  };

  const branch = getBranchById(data.branchId);
  const currentSkillsList = branch && data.role ? getSkillsForRole(branch, data.role) : [];
  const rankedMentors: MentorProfile[] = data.branchId
    ? getRankedMentorsForBranch(data.branchId, data.role, data.skills)
    : [];

  const totalSteps = 6;

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Let's get to know you
              </h2>
              <p className="text-neutral-500">
                We'll use this to find the perfect mentor match.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-neutral-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-shadow"
                    placeholder="e.g. Aarav Kulkarni"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-neutral-700">Year</label>
                  <select
                    value={data.year}
                    onChange={(e) => updateData({ year: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 bg-white transition-shadow"
                  >
                    <option value="" disabled>
                      Select Year
                    </option>
                    {years.map((y) => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Engineering Branch
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-[40vh] overflow-y-auto pr-2">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (data.branchId !== b.id) {
                          updateData({ branchId: b.id, role: "", skills: [] });
                        }
                      }}
                      className={`p-3 text-sm text-left rounded-lg border transition-all flex flex-col gap-1 ${
                        data.branchId === b.id
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm"
                      }`}
                    >
                      <div className="font-bold text-[15px]">{b.title}</div>
                      <div className={`text-xs ${data.branchId === b.id ? "text-neutral-300" : "text-neutral-500"}`}>
                        {b.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={handleNext}
              disabled={!data.name.trim() || !data.year || !data.branchId}
              className="w-full mt-6"
            >
              Continue
            </Button>
          </motion.div>
        );

      case 1:
        const currentBranch = getBranchById(data.branchId);
        
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex flex-col h-full"
          >
            <div className="space-y-2 shrink-0">
              <h2 className="text-2xl font-bold text-neutral-900">
                What role are you aiming for?
              </h2>
              <p className="text-neutral-500">
                Select a specific role in {currentBranch?.title}, or explore generally.
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[50vh]">
              <button
                onClick={() => updateData({ role: NOT_DECIDED_ROLE, skills: [] })}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  data.role === NOT_DECIDED_ROLE
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                    : "border-dashed border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
                }`}
              >
                <div className="font-bold text-base">Not Decided / Exploring</div>
                <div className="text-sm opacity-80 mt-1">I want to learn the general basics of this branch first.</div>
              </button>

              {currentBranch?.roleCategories.map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => updateData({ role: r, skills: [] })}
                        className={`px-3 py-2 text-sm text-left rounded-lg border transition-all ${
                          data.role === r
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-sm font-medium"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-neutral-100 shrink-0">
              <Button variant="outline" onClick={handleBack} className="px-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={handleNext} disabled={!data.role} className="flex-1">
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 2: {
        const isNotDecided = data.role === NOT_DECIDED_ROLE;
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex flex-col h-full"
          >
            <div className="space-y-2 shrink-0">
              <h2 className="text-2xl font-bold text-neutral-900">
                What's in your toolkit?
              </h2>
              <p className="text-neutral-500">
                {isNotDecided 
                  ? "Select any general skills you already know or are currently learning." 
                  : `Select the skills relevant to ${data.role} you already know.`}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 max-h-[40vh]">
              <div className="flex flex-wrap gap-2 mb-6">
                {currentSkillsList.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                      data.skills.includes(skill)
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  updateData({ skills: [] });
                  handleNext();
                }}
                className="w-full p-4 mt-2 text-left rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 transition-all"
              >
                <div className="font-bold text-base">None / Complete Beginner</div>
                <div className="text-sm opacity-80 mt-1">I am starting from scratch and haven't learned these yet.</div>
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100 shrink-0">
              <Button variant="outline" onClick={handleBack} className="px-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue{" "}
                {data.skills.length > 0 ? `(${data.skills.length} selected)` : ""}
              </Button>
            </div>
          </motion.div>
        );
      }

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex flex-col h-full"
          >
            <div className="space-y-2 shrink-0">
              <h2 className="text-2xl font-bold text-neutral-900">
                What is your timeline?
              </h2>
              <p className="text-neutral-500">
                This will be used to generate your personalized learning roadmap.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 max-h-[50vh] space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-700">
                  Target Timeline
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {timelineOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.timeline === opt.value ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="timeline"
                        checked={data.timeline === opt.value}
                        onChange={() => updateData({ timeline: opt.value })}
                        className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-800 font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-700">
                  Weekly Time Commitment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {weeklyCommitmentOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-center p-3 text-sm rounded-lg border cursor-pointer transition-colors ${data.availability === opt.value ? "border-neutral-900 bg-neutral-900 text-white font-medium" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="availability"
                        checked={data.availability === opt.value}
                        onChange={() => updateData({ availability: opt.value })}
                        className="sr-only"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100 shrink-0">
              <Button variant="outline" onClick={handleBack} className="px-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.timeline || !data.availability}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex flex-col h-full"
          >
            <div className="space-y-2 shrink-0">
              <h2 className="text-2xl font-bold text-neutral-900">
                Set your goals
              </h2>
              <p className="text-neutral-500">
                Where are you currently, and what do you want to achieve?
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 max-h-[50vh] space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-700">
                  Current Level
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {currentLevelOptions.map((lvl) => (
                    <label
                      key={lvl.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.skillLevel === lvl.value ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="skillLevel"
                        checked={data.skillLevel === lvl.value}
                        onChange={() => updateData({ skillLevel: lvl.value })}
                        className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-800 font-medium">{lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-700">
                  Short-Term Goals (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {shortTermGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`px-3 py-2 text-xs sm:text-sm text-left rounded-lg border transition-all ${
                        data.goals.includes(goal)
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-sm font-medium"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Other / Custom Goal (Optional)
                </label>
                <input
                  type="text"
                  value={data.customGoal}
                  onChange={(e) => updateData({ customGoal: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-shadow"
                  placeholder="Type any other specific goal..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100 shrink-0">
              <Button variant="outline" onClick={handleBack} className="px-3" disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.skillLevel || (data.goals.length === 0 && !data.customGoal.trim())}
                className="flex-1"
              >
                See Matching Mentors
              </Button>
            </div>
          </motion.div>
        );

      case 5: {
        const availabilityLabel: Record<string, string> = {
          available: "Available",
          limited: "Limited Slots",
          busy: "Busy",
        };
        const availabilityColor: Record<string, string> = {
          available: "text-green-600 bg-green-50",
          limited: "text-yellow-600 bg-yellow-50",
          busy: "text-red-600 bg-red-50",
        };
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 flex flex-col h-full"
          >
            <div className="space-y-1 shrink-0">
              <h2 className="text-2xl font-bold text-neutral-900">Choose your mentor</h2>
              <p className="text-neutral-500 text-sm">
                Showing seniors closest to your selected branch and role. Pick one to send a request.
              </p>
            </div>

            {rankedMentors.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-neutral-400 text-sm text-center">
                  No mentors found for your branch yet. Please contact the coordinator.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[52vh]">
                {rankedMentors.map((mentor) => (
                  <button
                    key={mentor.id}
                    onClick={() => setSelectedMentorId(mentor.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedMentorId === mentor.id
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-11 h-11 rounded-full shrink-0 bg-neutral-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`font-bold text-[15px] ${selectedMentorId === mentor.id ? "text-white" : "text-neutral-900"}`}>
                            {mentor.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            selectedMentorId === mentor.id
                              ? "bg-white/20 text-white"
                              : availabilityColor[mentor.availability] || "bg-neutral-100 text-neutral-600"
                          }`}>
                            {availabilityLabel[mentor.availability] || mentor.availability}
                          </span>
                        </div>
                        <div className={`text-xs mt-0.5 ${selectedMentorId === mentor.id ? "text-neutral-300" : "text-neutral-500"}`}>
                          {mentor.title}
                        </div>
                        <p className={`text-xs mt-1.5 line-clamp-2 ${selectedMentorId === mentor.id ? "text-neutral-200" : "text-neutral-600"}`}>
                          {mentor.bio}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className={`flex items-center gap-1 text-xs ${selectedMentorId === mentor.id ? "text-neutral-300" : "text-neutral-500"}`}>
                            <Star className="w-3 h-3" />{mentor.rating}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${selectedMentorId === mentor.id ? "text-neutral-300" : "text-neutral-500"}`}>
                            <Clock className="w-3 h-3" />{mentor.responseTime}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${selectedMentorId === mentor.id ? "text-neutral-300" : "text-neutral-500"}`}>
                            <Users className="w-3 h-3" />{mentor.stats.totalMentored} mentored
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.expertise.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                selectedMentorId === mentor.id
                                  ? "bg-white/15 text-neutral-200"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-neutral-100 shrink-0">
              <Button variant="outline" onClick={handleBack} className="px-3" disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedMentorId || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Request...</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Send Mentor Request</>
                )}
              </Button>
            </div>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 p-8 max-w-sm"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-neutral-900 border-t-transparent animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-neutral-900 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-neutral-900">
              Sending your request
            </h2>
            <p className="text-neutral-500 text-sm">
              Your mentor request is being sent. Please wait...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-neutral-50">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs font-medium text-neutral-500">
            <span>
              Step {step + 1} of {totalSteps}
            </span>
            <span>
              {Math.round(((step + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm relative shadow-black/[0.03]">
          <AnimatePresence mode="wait">{stepContent()}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}
