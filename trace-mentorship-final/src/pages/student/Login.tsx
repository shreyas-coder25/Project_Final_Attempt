import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { signInWithGoogle } from "@/src/lib/firebase";
import { subscribeStudentProfile } from "@/src/lib/store";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import("@/src/lib/firebase").then(({ requireFirebase }) => {
      const { auth } = requireFirebase();
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          processLogin(user);
        } else {
          setIsLoading(false);
        }
      });
      return () => unsubscribe();
    });
  }, []);

  const processLogin = async (user: any) => {
    setIsLoading(true);
    try {
      const { getStudentProfile, getMentorProfile } = await import("@/src/lib/store");
      
      const [studentProfile, mentorProfile] = await Promise.all([
        getStudentProfile(user.uid),
        getMentorProfile(user.uid)
      ]);

      const hasStudent = !!studentProfile;
      const hasMentor = !!mentorProfile;
      const lastView = localStorage.getItem("lastActiveView") || "student";

      if (hasStudent && hasMentor) {
        navigate(lastView === "mentor" ? "/mentor" : "/student");
      } else if (hasMentor) {
        localStorage.setItem("lastActiveView", "mentor");
        navigate("/mentor");
      } else if (hasStudent) {
        localStorage.setItem("lastActiveView", "student");
        navigate("/student");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      console.error("Profile check error:", err);
      navigate("/onboarding");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // The page will redirect to Google for authentication.
      // When it redirects back, the useEffect onAuthStateChanged listener will catch it.
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-neutral-200"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Student Login</h1>
          <p className="text-sm text-neutral-500">
            Sign in to connect with senior mentors and track your progress.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 text-base"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
