import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { ExternalLink, Github, Zap, Globe, CheckCircle2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { SiGithub, SiReact, SiNodedotjs, SiMongodb } from "react-icons/si";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};



const projects = [
  {
    id: "resumebuilder",
    title: "Resume Builder",
    subtitle: "Interactive Resume Creator",
    tagline: "A stunning resume builder with real-time preview, 4 templates, and PDF export.",
    overview: "A modern resume builder featuring real-time preview, multiple ATS-optimized templates, color customization, PDF download, and URL state-sharing capabilities.",
    problem: "Designing an ATS-friendly, professional resume is often tedious and formatting breaks easily when modifying sections.",
    solution: "Built a component-driven React application that dynamically renders resume sections in real-time, allowing users to customize colors, choose templates, and export clean PDFs.",
    features: ["Real-time Preview", "4 Professional Templates", "6 Color Schemes", "PDF Export (html2canvas & jsPDF)", "Share via URL Link", "ATS-optimized", "Fully Responsive"],
    learned: ["Client-side PDF Generation", "URL state encoding/decoding", "Dynamic CSS Theming with Variables", "Responsive Layout Design"],
    tech: ["React.js", "html2canvas", "jsPDF", "CSS Variables"],
    techIcons: [<SiReact key="r" className="text-cyan-400" />],
    github: "https://github.com/Manoha-r/Resume-Builder.git",
    live: "https://resume-builder-blush-nine.vercel.app/",
    color: "from-cyan-600/15 to-blue-900/15",
    hoverColor: "hover:shadow-[0_20px_50px_rgba(6,182,212,0.25)] hover:border-cyan-500/50",
    border: "border-cyan-500/30",
    badge: "React · Tool",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    icon: <FileText className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "nextstep",
    title: "NextStep",
    subtitle: "Engineering Career Navigator",
    tagline: "Helping engineering students explore career paths — built with React.",
    overview: "A career guidance web application designed to help engineering students explore branch-specific career opportunities through an intuitive, interactive interface.",
    problem: "Engineering students often don't know what career paths their branch offers. No dedicated, interactive resource existed to guide them through options.",
    solution: "Built a component-based React application with interactive navigation, reusable UI components, and dynamic content rendering — making career exploration intuitive.",
    features: ["Reusable React Components", "Interactive Navigation", "Responsive Design", "Dynamic UI", "Component-Based Architecture"],
    learned: ["Component Architecture", "State Management", "UI Design Principles", "Reusable Component Patterns"],
    tech: ["React.js", "JavaScript (ES6+)", "CSS"],
    techIcons: [<SiReact key="r" className="text-cyan-400" />],
    github: "https://github.com/Manoha-r/nexus-pathfinder-62",
    live: "https://nexus-pathfinder-62.lovable.app/",
    color: "from-blue-600/15 to-indigo-900/15",
    hoverColor: "hover:shadow-[0_20px_50px_rgba(0,113,227,0.25)] hover:border-blue-500/50",
    border: "border-blue-500/30",
    badge: "React · Frontend",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
  },
  {
    id: "airbnb",
    title: "Airbnb Clone",
    subtitle: "Full-Stack Booking & Listing Platform",
    tagline: "A production-grade Airbnb clone with full auth and MVC architecture.",
    overview: "A full-stack web application inspired by Airbnb. Users can create, manage, and browse property listings with authentication and secure backend functionality.",
    problem: "Replicating a complex platform like Airbnb requires designing for real-world scenarios: auth, MVC structure, dynamic views, and data integrity all at once.",
    solution: "Implemented MVC with Express.js, session-based Passport.js auth, MongoDB + Mongoose for data storage, EJS for server-side rendering, and Bootstrap for responsive UI.",
    features: ["Authentication with Passport.js", "REST APIs & CRUD", "MVC Architecture", "Data Validation & Error Handling", "Responsive Design", "Route Protection"],
    learned: ["Backend Development", "Authentication Flows", "Database Relationships", "Route Protection", "Error Handling Patterns"],
    tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "EJS", "Bootstrap", "Passport.js"],
    techIcons: [<SiNodedotjs key="n" className="text-green-400" />, <SiMongodb key="m" className="text-green-500" />],
    github: "https://github.com/Manoha-r/Airbnb-Clone-Project",
    live: null,
    color: "from-rose-600/15 to-orange-900/15",
    hoverColor: "hover:shadow-[0_20px_50px_rgba(244,63,94,0.25)] hover:border-rose-500/50",
    border: "border-rose-500/30",
    badge: "MERN · Full Stack",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    icon: <Globe className="w-5 h-5 text-rose-400" />,
  },
];

export function Projects() {
  const scrollRef = useSmoothScroll();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-screen overflow-y-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <div className="relative z-10 pt-20 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1.0 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">What I've Built</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex justify-center">
            <TextReveal text="Featured Projects" />
          </h2>
          <p className="text-zinc-400 mt-3 text-base max-w-xl mx-auto">Real products, real problems solved — React career tools and full-stack MERN applications.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {projects.map((p, idx) => {
            return (
              <motion.div key={p.title}
                layout
                initial={{ opacity: 0, y: -50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ 
                  layout: { type: "spring", stiffness: 180, damping: 25 }
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`bg-black/45 backdrop-blur-md bg-gradient-to-br ${p.color} border ${p.border} ${p.hoverColor} rounded-3xl p-6 md:p-8 flex flex-col transition-[border-color,box-shadow] duration-300 h-[480px] md:h-[500px]`}>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 15, scale: 1.15 }} className="p-2.5 bg-black/40 rounded-2xl border border-white/10">
                      {p.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white">{p.title}</h3>
                      <p className="text-primary font-semibold text-xs mt-0.5">{p.subtitle}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${p.badgeColor} shrink-0`}>{p.badge}</span>
                </div>

                <p className="text-zinc-300 font-medium text-xs md:text-sm italic mb-4 leading-relaxed">"{p.tagline}"</p>

                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{p.overview}</p>

                <div className="mb-5 mt-auto">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 text-[11px] rounded-lg bg-black/30 text-zinc-300 border border-white/5 font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,113,227,0.4)] transition-all duration-300">
                      <Globe className="w-3.5 h-3.5" /> Live Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <a href={p.github} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/18 text-white text-xs font-semibold border border-white/15 transition-all duration-300">
                    <SiGithub className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button onClick={() => setSelectedProject(p)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-4 rounded-xl bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-white text-xs font-bold transition-all border border-white/5">
                  Show Details & Learnings <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="mt-14 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <p className="text-zinc-500 text-sm mb-4">More projects on GitHub</p>
          <a href="https://github.com/Manoha-r" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm hover:bg-white/8 transition-all">
            <Github className="w-4 h-4" /> Explore All Repositories
          </a>
        </motion.div>
      </div>

      {/* Modern Centered Modal Details Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] cursor-pointer"
            />

            {/* Modal Box */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="pointer-events-auto w-full max-w-2xl bg-[#090b10]/95 border border-white/10 rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[85vh] shadow-[0_0_50px_rgba(0,113,227,0.22)] flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-black/40 rounded-2xl border border-white/10">
                      {selectedProject.icon}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white">{selectedProject.title}</h3>
                      <p className="text-primary font-semibold text-xs mt-0.5">{selectedProject.subtitle}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${selectedProject.badgeColor} shrink-0`}>
                    {selectedProject.badge}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-zinc-300 font-medium text-xs md:text-sm italic mb-5 leading-relaxed border-l-2 border-primary pl-3">
                  "{selectedProject.tagline}"
                </p>

                {/* Grid details */}
                <div className="space-y-5 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">The Problem</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">{selectedProject.problem}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1.5">The Solution</p>
                      <p className="text-zinc-400 text-xs leading-relaxed">{selectedProject.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Key Features</p>
                      <div className="space-y-1.5">
                        {selectedProject.features.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">What I Learned</p>
                      <div className="space-y-1.5">
                        {selectedProject.learned.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {selectedProject.live && (
                      <a href={selectedProject.live} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,113,227,0.4)] transition-all duration-300">
                        <Globe className="w-3.5 h-3.5" /> Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <a href={selectedProject.github} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/18 text-white text-xs font-semibold border border-white/15 transition-all duration-300">
                      <SiGithub className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/15"
                  >
                    Close Details
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
