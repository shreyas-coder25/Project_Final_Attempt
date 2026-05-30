import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { ensureAuth } from "@/src/lib/firebase";
import { getGeneratedRoadmap, getStudentProfile, type GeneratedRoadmap, type StudentProfile } from "@/src/lib/store";
import RoadmapView from "@/src/components/RoadmapView";

export default function StudentRoadmap() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<GeneratedRoadmap | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (!studentId) return;

    ensureAuth()
      .then(async () => {
        const [profile, roadmap] = await Promise.all([
          getStudentProfile(studentId),
          getGeneratedRoadmap(studentId)
        ]);
        
        if (profile) setStudentProfile(profile);
        if (roadmap) setRoadmapData(roadmap);
        
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [studentId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-medium">Loading Student Roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 theme-indigo">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate(`/mentor/chat?studentId=${studentId}`)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chat
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-2">
                {studentProfile ? `${studentProfile.name.split(" ")[0]}'s Roadmap` : "Student Roadmap"}
              </h1>
              <p className="text-neutral-500 mt-1">
                Read-only view of the AI-generated learning path.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {!roadmapData ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">No Roadmap Found</h2>
            <p className="text-neutral-500">
              The student hasn't generated their AI roadmap yet, or there was an error retrieving it.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            {/* The mentor can see the roadmap, but we pass empty handlers for updates so it stays read-only */}
            <RoadmapView 
              roadmap={roadmapData}
              onUpdateMilestone={() => Promise.resolve()}
              onRegenerate={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
