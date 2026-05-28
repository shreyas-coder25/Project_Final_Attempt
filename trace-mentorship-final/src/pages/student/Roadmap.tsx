import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ensureAuth } from "@/src/lib/firebase";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasRoadmap, setHasRoadmap] = useState(false); // To be wired in 5B/5C

  useEffect(() => {
    ensureAuth()
      .then((user) => {
        // Will fetch roadmap from Firestore here in 5C
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            My AI Learning Roadmap
          </h1>
          <p className="text-neutral-500 mt-1">
            Personalized path generated just for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {!hasRoadmap ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Ready to generate your roadmap?</h2>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              Answer 3 quick questions about your goals and skills, and our AI will generate a tailored learning path.
            </p>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              Start Wizard
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center shadow-sm">
            <p className="text-neutral-500">Timeline / Kanban view will go here (5C).</p>
          </div>
        )}
      </div>
    </div>
  );
}
