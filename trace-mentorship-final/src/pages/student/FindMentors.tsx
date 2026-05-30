import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { getRankedMentorsForBranch } from "@/src/data/mentors";
import { subscribeStudentProfile, subscribeAllMentorshipsForStudent, createMentorship, type MentorshipRecord } from "@/src/lib/store";
import { ensureAuth } from "@/src/lib/firebase";
import { useAllMentors } from "@/src/hooks/useMentors";

export default function FindMentors() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [mentorships, setMentorships] = useState<MentorshipRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const allMentorsPool = useAllMentors();

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubMentorships: (() => void) | undefined;

    ensureAuth().then((user) => {
      unsubProfile = subscribeStudentProfile(
        user.uid,
        (data) => setProfile(data),
        (err) => console.error(err)
      );
      unsubMentorships = subscribeAllMentorshipsForStudent(
        user.uid,
        (data) => setMentorships(data),
        (err) => console.error(err)
      );
    }).catch(() => {
      navigate("/login");
    });

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubMentorships) unsubMentorships();
    };
  }, [navigate]);

  if (!profile) return null;

  // Filter out mentors the student has already requested/connected with
  const connectedMentorIds = new Set(mentorships.filter(m => m.status !== "archived").map(m => m.mentorId));

  // Get recommended mentors using the smart ranking function
  const allMentors = getRankedMentorsForBranch(
    profile.branchId || "cs-it", 
    profile.domain || "", 
    profile.skills || [],
    allMentorsPool
  );

  const availableMentors = allMentors.filter(m => !connectedMentorIds.has(m.id));

  const handleRequestMentor = async (mentorId: string) => {
    setIsSubmitting(mentorId);
    try {
      await createMentorship({
        name: profile.name,
        year: profile.year,
        branch: profile.branch,
        domain: profile.domain,
        goals: profile.goals,
        skills: profile.skills,
      }, mentorId);
      
      // Navigate back to dashboard with a query parameter to show the welcome/success modal
      navigate("/student?matched=true");
    } catch (error) {
      console.error("Failed to request mentor", error);
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => navigate("/student")}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Find Your Mentor
          </h1>
          <p className="text-neutral-500 mt-2">
            Based on your profile, we've ranked these mentors for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {availableMentors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                No new mentors available
              </h3>
              <p className="text-neutral-500">
                You are already connected with all available mentors for your domain.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {availableMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-4 mb-4">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-neutral-900 text-lg">{mentor.name}</h3>
                        <p className="text-sm text-neutral-600 mb-2">{mentor.title}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {mentor.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {mentor.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4 flex-1">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {mentor.expertise.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                      {mentor.expertise.length > 4 && (
                        <span className="px-2 py-1 bg-neutral-50 rounded text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          +{mentor.expertise.length - 4} more
                        </span>
                      )}
                    </div>

                    <Button 
                      className="w-full gap-2" 
                      onClick={() => handleRequestMentor(mentor.id)}
                      disabled={isSubmitting !== null}
                    >
                      {isSubmitting === mentor.id ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Request
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
