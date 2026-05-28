/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRightLeft } from "lucide-react";
import Landing from "./pages/Landing";
import Login from "./pages/student/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentOnboarding from "./pages/student/Onboarding";
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorOnboarding from "./pages/mentor/Onboarding";
import DomainDetail from "./pages/DomainDetail";
import { requireFirebase } from "./lib/firebase";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { auth } = requireFirebase();
    const unsubscribe = auth.onAuthStateChanged((u: any) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setMobileMenuOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isLanding = location.pathname === "/";
  const isDomainPage = location.pathname.startsWith("/domain/");
  const isMentorArea = location.pathname.startsWith("/mentor");
  const isStudentArea = location.pathname.startsWith("/student") || location.pathname === "/onboarding";
  const hideNavActions = isLanding ? false : (!user && !isDomainPage);

  // Dynamic Theme
  const themeClass = isMentorArea ? "theme-emerald" : "theme-indigo";
  const headerBgClass = isMentorArea ? "bg-emerald-50/90" : "bg-white/80";
  const textColorClass = isMentorArea ? "text-emerald-900" : "text-neutral-900";
  const switchBtnClass = isMentorArea 
    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200" 
    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200";

  const handleRoleSwitch = () => {
    if (isMentorArea) {
      localStorage.setItem("lastActiveView", "student");
      navigate("/student");
    } else {
      localStorage.setItem("lastActiveView", "mentor");
      navigate("/mentor");
    }
  };

  const handleSignOut = async () => {
    const { auth } = requireFirebase();
    await auth.signOut();
    localStorage.removeItem("lastActiveView");
    navigate("/");
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col transition-colors duration-300 ${themeClass}`}>
      <header className={`sticky top-0 z-50 w-full border-b border-neutral-200 backdrop-blur-md transition-colors duration-300 ${headerBgClass}`}>
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold tracking-tighter transition-colors ${isMentorArea ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white'}`}>
              T
            </div>
            <span className={`text-xl font-semibold tracking-tight transition-colors ${textColorClass}`}>
              Trace.
            </span>
          </Link>

          {(isLanding || isDomainPage) && !user && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
              <a href={isLanding ? "#how-it-works" : "/#how-it-works"} className="hover:text-neutral-900 transition-colors">How It Works</a>
              <a href={isLanding ? "#domains" : "/#domains"} className="hover:text-neutral-900 transition-colors">Domains</a>
              <a href={isLanding ? "#testimonials" : "/#testimonials"} className="hover:text-neutral-900 transition-colors">Testimonials</a>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {!user ? (
              <Link to="/login" className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 whitespace-nowrap">
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {(isStudentArea || isMentorArea) ? (
                  <button
                    onClick={handleRoleSwitch}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${switchBtnClass}`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    {isMentorArea ? "Switch to Student View" : "Switch to Mentor View"}
                  </button>
                ) : (
                  <Link to={localStorage.getItem("lastActiveView") === "mentor" ? "/mentor" : "/student"} className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 whitespace-nowrap">
                    Go to Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="hidden sm:block text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}

            {!hideNavActions && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && !hideNavActions && (
          <div className="sm:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 animate-fade-in">
            {(isLanding || isDomainPage) && !user && (
              <>
                <a href={isLanding ? "#how-it-works" : "/#how-it-works"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">How It Works</a>
                <a href={isLanding ? "#domains" : "/#domains"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">Domains</a>
                <a href={isLanding ? "#testimonials" : "/#testimonials"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">Testimonials</a>
                <div className="border-t border-neutral-100 pt-3 mt-2" />
              </>
            )}
            {!user ? (
              <Link to="/login" className="block text-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90">
                Sign In
              </Link>
            ) : (
              <>
                <Link to={localStorage.getItem("lastActiveView") === "mentor" ? "/mentor" : "/student"} className="block text-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90">
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1 mt-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/domain/:slug" element={<DomainDetail />} />
          <Route path="/onboarding" element={<StudentOnboarding />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/mentor/onboarding" element={<MentorOnboarding />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
