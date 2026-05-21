import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Briefcase, Code, GraduationCap, Layers, Lightbulb, Users, Star } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { getDomainBySlug, getMentorsForDomain } from "@/src/data/mentors";

export default function DomainDetail() {
  const { slug } = useParams<{ slug: string }>();
  const domain = slug ? getDomainBySlug(slug) : undefined;
  if (!domain) return <Navigate to="/" replace />;

  const domainMentors = getMentorsForDomain(domain.title);
  const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div {...fade} className="max-w-3xl">
            <Link to="/#domains" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"><ArrowLeft className="w-4 h-4" /> All Domains</Link>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{domain.title}</h1>
            <p className="text-lg text-neutral-300 leading-relaxed mb-4 max-w-2xl">{domain.tagline}</p>
            <div className="flex items-center gap-4 text-sm text-neutral-400 mb-8">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {domainMentors.length} Active Mentor{domainMentors.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/onboarding"><Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 bg-white text-neutral-900 hover:bg-neutral-100">Find a Mentor <ArrowRight className="w-4 h-4" /></Button></Link>
              <a href="#roadmap"><Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">View Roadmap</Button></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About + Career */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider"><BookOpen className="w-4 h-4" /> Overview</div>
              <p className="text-neutral-700 leading-relaxed text-lg">{domain.description}</p>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900"><Briefcase className="w-4 h-4 text-neutral-500" /> Career Paths</div>
                <div className="space-y-2">{domain.careers.map((c) => (<div key={c} className="flex items-center gap-2 text-sm text-neutral-700"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />{c}</div>))}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-8"><Code className="w-4 h-4" /> Tech Stack</div>
          <div className="flex flex-wrap gap-3">{domain.techStack.map((t) => (<span key={t} className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all">{t}</span>))}</div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-16 sm:py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2"><Layers className="w-4 h-4" /> Learning Roadmap</div>
          <p className="text-neutral-500 mb-10 max-w-xl">A structured progression from beginner to advanced — follow this path with your mentor.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {domain.roadmap.map((phase, pi) => {
              const c = [
                { border: "border-green-200", bg: "bg-green-50", badge: "bg-green-100 text-green-800", dot: "bg-green-500" },
                { border: "border-blue-200", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
                { border: "border-purple-200", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
              ][pi] || { border: "border-neutral-200", bg: "bg-neutral-50", badge: "bg-neutral-100 text-neutral-800", dot: "bg-neutral-500" };
              return (<div key={phase.level} className={`rounded-2xl border ${c.border} ${c.bg} p-6 space-y-4`}><span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${c.badge}`}>{phase.level}</span><div className="space-y-3">{phase.items.map((item) => (<div key={item} className="flex items-start gap-3 text-sm text-neutral-800"><div className={`w-2 h-2 rounded-full ${c.dot} mt-1.5 shrink-0`} />{item}</div>))}</div></div>);
            })}
          </div>
        </div>
      </section>

      {/* Project Ideas */}
      <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-8"><Lightbulb className="w-4 h-4" /> Project Ideas</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domain.projectIdeas.map((p, i) => (<div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs font-bold shrink-0">{String(i+1).padStart(2,"0")}</div><span className="text-sm font-semibold text-neutral-900">{p}</span></div></div>))}
          </div>
        </div>
      </section>

      {/* Mentors — ALL mentors for this domain */}
      <section className="py-16 sm:py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2"><Users className="w-4 h-4" /> Mentors in {domain.title}</div>
          <p className="text-neutral-500 mb-8">Meet all {domainMentors.length} mentors available in this domain.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainMentors.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-4">
                  <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-neutral-900 truncate">{m.name}</h3>
                    <p className="text-xs text-neutral-500 truncate">{m.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold text-neutral-700">{m.rating}</span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${m.availability === "available" ? "bg-green-100 text-green-700" : m.availability === "limited" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"}`}>{m.availability}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{m.bio}</p>
                <div className="flex flex-wrap gap-1.5">{m.expertise.slice(0, 4).map((e) => (<span key={e} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-md font-medium">{e}</span>))}</div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                  <span>{m.stats.totalMentored} students mentored</span>
                  <span>~{m.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to start your {domain.title} journey?</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">Get matched with one of {domainMentors.length} experienced mentors who'll guide you from beginner to job-ready.</p>
          <Link to="/onboarding"><Button size="lg" className="h-12 px-10 bg-white text-neutral-900 hover:bg-neutral-100 gap-2">Find My Mentor <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
