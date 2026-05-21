import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Database, Layout, Shield, Cpu, Terminal, Users, Sparkles, UserCheck, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { getMentorsForDomain } from "@/src/data/mentors";

export default function Landing() {
  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  const domainCards = [
    { icon: <Layout className="w-5 h-5" />, title: "Web Development", desc: "React, Node.js, Next.js, MERN", slug: "web-development" },
    { icon: <Cpu className="w-5 h-5" />, title: "AI / ML", desc: "PyTorch, TensorFlow, LLMs, NLP", slug: "ai-ml" },
    { icon: <Database className="w-5 h-5" />, title: "Data Science", desc: "Python, SQL, PowerBI, Analytics", slug: "data-science" },
    { icon: <Shield className="w-5 h-5" />, title: "Cybersecurity", desc: "Pentesting, Network Security, CTFs", slug: "cybersecurity" },
    { icon: <Terminal className="w-5 h-5" />, title: "App Development", desc: "Flutter, React Native, Kotlin", slug: "app-development" },
    { icon: <Code className="w-5 h-5" />, title: "Placements & DSA", desc: "DSA, LeetCode, System Design", slug: "placements-dsa" },
  ];

  const testimonials = [
    { quote: "I was stuck in tutorial hell for months. My mentor helped me pick 3 real projects and I cracked my first internship at a Pune-based startup within 4 months!", author: "Aarav Kulkarni", role: "TY CSE · Matched with Web Dev Mentor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" },
    { quote: "Having a senior who just went through placements review my resume and conduct mock interviews was a complete game changer. Got placed at TCS Digital!", author: "Neha Patil", role: "TY IT · Matched with Placements Mentor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
    { quote: "As a mentor on Trace, it feels rewarding to guide juniors through the same struggles I faced. The platform makes managing mentees incredibly simple.", author: "Rohan Deshmukh", role: "Senior AI/ML Mentor · SY MTech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  ];

  const teamMembers = ["Shreyas Raybhog", "Swanand Jaju", "Sanskar Lupane", "Sufiyan Shaikh", "Sarthak Baraskar"];

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div className="flex flex-col items-start gap-8" initial="initial" animate="animate" variants={fadeIn}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-sm font-medium">
                <Sparkles className="w-4 h-4" /><span>Peer-to-peer engineering guidance</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.1]">
                Confused about what to learn? <br /><span className="text-neutral-400">Connect with seniors.</span>
              </h1>
              <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">Get real, actionable guidance from experienced senior mentors in Web Dev, AI/ML, Cybersecurity, App Development, Placements, and more.</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/onboarding"><Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">Find My Mentor <ArrowRight className="w-4 h-4" /></Button></Link>
                <a href="#domains"><Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">Explore Domains</Button></a>
              </div>
              <div className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
                <div className="flex items-center gap-2"><UserCheck className="w-4 h-4" /><span>Verified Mentors</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>500+ Students Guided</span></div>
              </div>
            </motion.div>
            <motion.div className="relative lg:ml-auto w-full max-w-lg hidden sm:block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative rounded-2xl border border-neutral-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl">
                <div className="rounded-xl border border-neutral-100 bg-white overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between border-b border-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nikhil" alt="Mentor" className="h-10 w-10 rounded-full bg-neutral-100" />
                      <div><div className="text-sm font-semibold text-neutral-900">Nikhil Deshpande</div><div className="text-xs text-neutral-500">TY CSE · Full-Stack Intern</div></div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">Match: 96%</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Expertise</div>
                      <div className="flex flex-wrap gap-2">{["React", "Next.js", "Node.js"].map((s) => (<span key={s} className="px-2 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-700">{s}</span>))}</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100"><div className="text-sm text-neutral-700">"Hey! I see you're learning full-stack development. I went through the same journey last year. Let's set up a roadmap!"</div></div>
                    <Button className="w-full">Accept Mentorship</Button>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl max-w-[200px]">
                  <div className="flex items-center gap-3 mb-1.5"><div className="h-2 w-2 rounded-full bg-green-500" /><div className="text-xs font-medium text-neutral-500">This Semester</div></div>
                  <div className="text-sm font-semibold text-neutral-900">38 students placed via mentors</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-neutral-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">How Trace Works</h2>
            <p className="text-neutral-500">Tell us what you want to achieve, and we'll connect you with the right senior.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-neutral-200" />
            {[
              { step: "01", title: "Share Your Goals", desc: "Fill out a quick profile about your skills, branch, and aims — placements, GSoC, hackathons, or skill building." },
              { step: "02", title: "Get Matched", desc: "Our system pairs you with a senior mentor whose expertise aligns with your domain and goals." },
              { step: "03", title: "Start Guided Learning", desc: "Receive custom roadmaps, code reviews, mock interviews, and career advice from your mentor." },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm z-10 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">{item.step}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains — counts derived from real data */}
      <section id="domains" className="py-20 sm:py-24 bg-white border-t border-neutral-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12"><h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">Explore Domains</h2><p className="text-neutral-500">Find specialized guidance across every major engineering discipline.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainCards.map((d, i) => {
              const count = getMentorsForDomain(d.title).length;
              return (
                <Link to={`/domain/${d.slug}`} key={i} className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:bg-neutral-50 hover:shadow-md hover:border-neutral-300 flex flex-col cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:scale-110 transition-transform">{d.icon}</div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">{d.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4 flex-1">{d.desc}</p>
                  <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-neutral-100 mt-auto">
                    <span className="text-neutral-500">{count} Active Mentor{count !== 1 ? "s" : ""}</span>
                    <span className="text-neutral-900 flex items-center group-hover:translate-x-1 transition-transform">Explore <ArrowRight className="w-3 h-3 ml-1" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-24 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-3xl font-bold tracking-tight mb-4">Built by seniors, for juniors.</h2><p className="text-neutral-400">Real stories from engineering students who found their path.</p></div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 flex flex-col">
                <div className="flex-1">
                  <div className="flex gap-1 mb-4 text-yellow-500">{[1,2,3,4,5].map((s)=>(<svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>))}</div>
                  <p className="text-neutral-300 leading-relaxed text-sm mb-6">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 mt-auto"><img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full bg-neutral-800" /><div><div className="font-bold text-sm">{t.author}</div><div className="text-neutral-500 text-xs">{t.role}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-900 text-white font-bold tracking-tighter text-xs">T</div><span className="font-semibold text-neutral-900">Trace.</span></div>
            <p className="text-sm text-neutral-500 text-center md:text-left">Built for Indian engineering students. Mentorship over automation.</p>
            <div className="flex items-center gap-4 text-sm text-neutral-500"><Link to="/mentor/login" className="hover:text-neutral-900 transition-colors">Become a Mentor</Link></div>
          </div>
          <div className="border-t border-neutral-100 py-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-neutral-400"><span>Made with</span><Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /><span>by</span></div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">{teamMembers.map((name, i) => (<span key={name} className="text-sm font-medium text-neutral-700">{name}{i < teamMembers.length - 1 && <span className="text-neutral-300 ml-3">·</span>}</span>))}</div>
              <p className="text-xs text-neutral-400 tracking-wide">Students of FY AIML, Walchand College of Engineering, Sangli</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
