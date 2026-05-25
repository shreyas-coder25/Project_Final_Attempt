import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { assignMentorForDomain, createMentorship, saveStudentProfile } from "@/src/lib/store";

const domains = [
  "Web Development",
  "AI / ML",
  "Data Science",
  "Cybersecurity",
  "App Development",
  "Systems & DevOps",
  "Placements & DSA",
];

const domainSkills: Record<string, string[]> = {
  "Web Development": [
    "HTML/CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Next.js",
    "Tailwind",
    "SQL",
    "MongoDB",
  ],
  "AI / ML": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NLP",
    "Computer Vision",
  ],
  "Data Science": [
    "Python",
    "SQL",
    "R",
    "Tableau",
    "PowerBI",
    "Statistics",
    "Machine Learning",
  ],
  Cybersecurity: [
    "Linux",
    "Networking",
    "Pen Testing",
    "Wireshark",
    "Cryptography",
    "Bash",
  ],
  "App Development": ["Flutter", "React Native", "Swift", "Kotlin", "Java", "Firebase"],
  "Systems & DevOps": [
    "Linux",
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD",
    "Go",
    "Rust",
  ],
  "Placements & DSA": [
    "DSA",
    "LeetCode",
    "System Design",
    "Mock Interviews",
    "Resume Review",
    "Core CS",
  ],
};
const defaultSkills = ["C++", "Java", "Python", "Git", "DSA", "SQL"];

const skillLevels = [
  "Beginner (Just starting out)",
  "Intermediate (Know basics, building projects)",
  "Advanced (Preparing for internships/placements)",
];

const availabilities = [
  "1-3 hours/week",
  "3-5 hours/week",
  "5-10 hours/week",
  "10+ hours/week",
];

const mentorStyles = [
  "Hands-on & structured",
  "Directional advice only",
  "Chill & conversational",
];

const branches = [
  "AIML",
  "CSE",
  "IT",
  "ENTC",
  "Mechanical",
  "Civil",
  "Electrical",
  "Other",
];

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
  const [data, setData] = useState({
    name: "",
    branch: "",
    year: "",
    domain: "",
    skills: [] as string[],
    skillLevel: "",
    goals: "",
    helpNeeded: "",
    availability: "",
    mentorStyle: "",
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

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      localStorage.setItem("studentProfile", JSON.stringify(data));
      
      await saveStudentProfile(data);
      
      const mentor = assignMentorForDomain(data.domain);
      await createMentorship(
        { name: data.name, year: data.year, branch: data.branch, domain: data.domain, goals: data.goals || data.primaryGoal || "", skills: data.skills },
        mentor.id,
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

  const currentSkillsList =
    data.domain && domainSkills[data.domain]
      ? domainSkills[data.domain]
      : defaultSkills;

  const totalSteps = 5;

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
              <div className="space-y-1.5">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Branch
                  </label>
                  <select
                    value={data.branch}
                    onChange={(e) => updateData({ branch: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 bg-white transition-shadow"
                  >
                    <option value="" disabled>
                      Select Branch
                    </option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Button
              onClick={handleNext}
              disabled={!data.name.trim() || !data.year || !data.branch}
              className="w-full mt-6"
            >
              Continue
            </Button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                What do you want to master?
              </h2>
              <p className="text-neutral-500">
                Select your primary area of interest.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    if (data.domain !== d) {
                      updateData({ domain: d, skills: [] });
                    } else {
                      updateData({ domain: d });
                    }
                  }}
                  className={`p-3 text-sm text-left rounded-lg border transition-all ${
                    data.domain === d
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleBack} className="px-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button onClick={handleNext} disabled={!data.domain} className="flex-1">
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                What's in your toolkit?
              </h2>
              <p className="text-neutral-500">
                Select the skills you already know or are learning.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
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

            <div className="flex gap-3 pt-4">
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

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Where are you headed?
              </h2>
              <p className="text-neutral-500">
                Tell us about your current status and goals.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Current Skill Level
                </label>
                <div className="space-y-2">
                  {skillLevels.map((lvl) => (
                    <label
                      key={lvl}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.skillLevel === lvl ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="skillLevel"
                        checked={data.skillLevel === lvl}
                        onChange={() => updateData({ skillLevel: lvl })}
                        className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-800">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  What is your primary goal right now?
                </label>
                <textarea
                  rows={2}
                  value={data.goals}
                  onChange={(e) => updateData({ goals: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none transition-shadow"
                  placeholder="e.g. Crack a summer internship, build my first MERN stack project, prepare for placements..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  What specific help do you need?
                </label>
                <textarea
                  rows={2}
                  value={data.helpNeeded}
                  onChange={(e) => updateData({ helpNeeded: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none transition-shadow"
                  placeholder="e.g. Need someone to review my code and help me with mock interviews."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleBack} className="px-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.skillLevel || !data.goals.trim()}
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
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                How do you learn best?
              </h2>
              <p className="text-neutral-500">
                So we can match you with someone who fits your style.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Weekly Availability
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availabilities.map((av) => (
                    <label
                      key={av}
                      className={`flex items-center justify-center p-3 text-sm rounded-lg border cursor-pointer transition-colors ${data.availability === av ? "border-neutral-900 bg-neutral-50 font-medium" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="availability"
                        checked={data.availability === av}
                        onChange={() => updateData({ availability: av })}
                        className="sr-only"
                      />
                      <span>{av}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Preferred Mentorship Style
                </label>
                <div className="space-y-2">
                  {mentorStyles.map((style) => (
                    <label
                      key={style}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.mentorStyle === style ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                    >
                      <input
                        type="radio"
                        name="mentorStyle"
                        checked={data.mentorStyle === style}
                        onChange={() => updateData({ mentorStyle: style })}
                        className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-sm text-neutral-800">{style}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-3"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!data.availability || !data.mentorStyle || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Matching...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Find My Mentor
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        );

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
              Analyzing your profile
            </h2>
            <p className="text-neutral-500 text-sm">
              Finding the perfect senior mentor for your goals in{" "}
              {data.domain || "Engineering"}...
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
