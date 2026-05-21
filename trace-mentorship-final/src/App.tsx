/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/student/Dashboard";
import StudentOnboarding from "./pages/student/Onboarding";
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorLogin from "./pages/mentor/Login";
import DomainDetail from "./pages/DomainDetail";

function AppContent() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on hash-link click (same page)
  useEffect(() => {
    const handler = () => setMobileMenuOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isLanding = location.pathname === "/";
  const isDomainPage = location.pathname.startsWith("/domain/");
  const isMentorArea = location.pathname.startsWith("/mentor");
  const isStudentDashboard = location.pathname === "/student";
  const hideNavActions = isMentorArea || isStudentDashboard;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold tracking-tighter">
              T
            </div>
            <span className="text-xl font-semibold tracking-tight text-neutral-900">
              Trace.
            </span>
          </Link>

          {(isLanding || isDomainPage) && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
              <a href={isLanding ? "#how-it-works" : "/#how-it-works"} className="hover:text-neutral-900 transition-colors">How It Works</a>
              <a href={isLanding ? "#domains" : "/#domains"} className="hover:text-neutral-900 transition-colors">Domains</a>
              <a href={isLanding ? "#testimonials" : "/#testimonials"} className="hover:text-neutral-900 transition-colors">Testimonials</a>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {!hideNavActions && (
              <>
                <Link to="/mentor/login" className="hidden sm:block text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                  Mentor Login
                </Link>
                <Link to="/onboarding" className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 whitespace-nowrap">
                  Find My Mentor
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
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

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && !hideNavActions && (
          <div className="sm:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 animate-fade-in">
            {(isLanding || isDomainPage) && (
              <>
                <a href={isLanding ? "#how-it-works" : "/#how-it-works"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">How It Works</a>
                <a href={isLanding ? "#domains" : "/#domains"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">Domains</a>
                <a href={isLanding ? "#testimonials" : "/#testimonials"} className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">Testimonials</a>
                <div className="border-t border-neutral-100 pt-3 mt-2" />
              </>
            )}
            <Link to="/mentor/login" className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 py-1">Mentor Login</Link>
            <Link to="/onboarding" className="block text-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90">
              Find My Mentor
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/domain/:slug" element={<DomainDetail />} />
          <Route path="/onboarding" element={<StudentOnboarding />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/mentor/login" element={<MentorLogin />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          {/* Catch-all: redirect unknown routes to home */}
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
