import { motion } from "framer-motion";
import { Link } from "wouter";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { ArrowRight, Sparkles, Code2, Layout, Server, GitBranch, Layers, Globe, Mail } from "lucide-react";
import { SiGithub, SiLeetcode } from "react-icons/si";
import { Linkedin } from "lucide-react";
import { TextReveal } from "../components/TextReveal";
import { cn } from "@/lib/utils";

// Elegant fade-up entry — smooth, professional
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};



const keywords1 = ["Full Stack Developer", "MERN Stack", "React.js", "Node.js", "MongoDB", "JavaScript", "Express.js", "Java", "REST APIs", "Tailwind CSS", "HTML5 & CSS3", "GitHub", "DSA", "Passport.js", "Bootstrap"];
const keywords2 = ["Problem Solver", "Clean Code", "Backend Engineering", "API Design", "Authentication Systems", "Database Design", "Responsive Design", "OOP", "Scalable Architecture", "Continuous Learner"];

const whatIDo = [
  { icon: <Layout className="w-5 h-5 text-primary" />, title: "Frontend Engineering", desc: "React, Tailwind CSS, Bootstrap and EJS. Pixel-perfect, responsive interfaces that feel fast and alive." },
  { icon: <Server className="w-5 h-5 text-primary" />, title: "Backend Development", desc: "Node.js + Express REST APIs with MVC architecture, Passport.js auth, and MongoDB data design." },
  { icon: <Code2 className="w-5 h-5 text-primary" />, title: "DSA & Problem Solving", desc: "100+ LeetCode problems in Java. Algorithms and data structures applied to real engineering." },
  { icon: <GitBranch className="w-5 h-5 text-primary" />, title: "Authentication Systems", desc: "Session-based Passport.js auth, route protection, and secure user management end-to-end." },
  { icon: <Globe className="w-5 h-5 text-primary" />, title: "Database Design", desc: "MongoDB + Mongoose schemas, validation, relationships, and efficient document query design." },
  { icon: <Layers className="w-5 h-5 text-primary" />, title: "Software Architecture", desc: "MVC patterns, component-based React, clean separation of concerns, maintainable codebases." },
];

const stats = [
  { value: "2+", label: "Full Stack Projects" },
  { value: "100+", label: "DSA Problems Solved" },
  { value: "8.52", label: "CGPA" },
];

export function Hero() {
  const scrollRef = useSmoothScroll();

  // Check if first load cinematic is playing to offset page entrance animations
  const isFirstLoad = typeof window !== "undefined" && !sessionStorage.getItem("intro_played");
  const delayOffset = isFirstLoad ? 3.25 : 0;

  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-[calc(100vh-4rem)]" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ——— HERO ——— */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between text-center px-4 pt-4 pb-6">
        
        {/* Top spacer to balance the bottom content for vertical alignment */}
        <div className="h-4 w-full shrink-0" />

        {/* Main Content Area */}
        <div className="flex flex-col items-center max-w-4xl w-full shrink-0">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6"
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delayOffset + 0.4, duration: 1.0 }}>
            <Sparkles className="w-4 h-4" /> Open to internships & full-time opportunities
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-3 md:mb-4 leading-none flex flex-col items-center">
            <TextReveal text="Manohar" className="text-white" delay={0.4} variant="chars" />
            <TextReveal text="Naidu Bugatha" className="text-primary" delay={0.65} variant="chars" />
          </h1>

          <div className="text-lg md:text-2xl text-zinc-300 mb-2 font-semibold flex justify-center">
            <TextReveal text="Full Stack Developer · MERN Stack · Java & DSA Enthusiast" delay={1.1} variant="words" />
          </div>

          <motion.p className="text-sm md:text-base text-zinc-500 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: delayOffset + 0.9, duration: 1.0 }}>
            Building scalable web applications with clean architecture and modern technologies. CS undergraduate passionate about full-stack development, backend engineering, and problem solving.
          </motion.p>

          <motion.div className="flex flex-wrap items-center justify-center gap-4 mb-2"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delayOffset + 1.05, duration: 1.0 }}>
            <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold text-base hover:bg-primary/90 hover:shadow-[0_0_32px_rgba(0,113,227,0.5)] transition-all duration-300">
              View Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold text-base hover:bg-white/8 hover:border-white/40 transition-all duration-300">
              <Mail className="w-4 h-4" /> Contact Me
            </Link>
          </motion.div>
        </div>

        {/* Bottom Area: Social Links & Scroll Down in a structured flow */}
        <div className="flex flex-col items-center gap-4 md:gap-5 mt-6 w-full shrink-0 z-20">
          {/* Social Media Links */}
          <motion.div className="flex items-center justify-center gap-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delayOffset + 1.2, duration: 1.0 }}>
            {[
              { href: "https://github.com/Manoha-r", icon: <SiGithub className="w-6 h-6" />, label: "GitHub", hoverClass: "hover:text-white" },
              { href: "https://www.linkedin.com/in/manoharnaidubugatha/", icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn", hoverClass: "hover:text-[#0077b5]" },
              { href: "https://leetcode.com/u/myselfManu29/", icon: <SiLeetcode className="w-6 h-6" />, label: "LeetCode", hoverClass: "hover:text-[#ffa116]" },
            ].map(({ href, icon, label, hoverClass }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noreferrer" 
                className={cn(
                  "flex flex-col items-center gap-1 text-zinc-500 transition-colors duration-200",
                  hoverClass
                )}
              >
                {icon}<span className="text-xs">{label}</span>
              </a>
            ))}
          </motion.div>

          {/* Bouncing scroll down indicator */}
          <motion.div 
            className="flex flex-col items-center gap-2 cursor-pointer select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delayOffset + 1.5, duration: 0.8 }}
            onClick={() => {
              const nextSection = document.querySelector("section:nth-of-type(2)") as HTMLElement;
              if (nextSection) {
                const elementPosition = nextSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - 64; // 64px navbar offset
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
              } else {
                window.scrollTo({
                  top: window.innerHeight - 64,
                  behavior: "smooth"
                });
              }
            }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-semibold">Scroll Down</span>
            <motion.div 
              className="w-5 h-8 rounded-full border border-zinc-500/60 flex justify-center p-1"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-1 h-2 bg-primary rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ——— MARQUEE ——— */}
      <section className="py-8 overflow-hidden bg-black/30 border-y border-white/5">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-600 mb-5">Skills & Technologies</p>
        <div className="flex gap-3 animate-[marquee_35s_linear_infinite] whitespace-nowrap mb-3">
          {[...keywords1, ...keywords1].map((kw, i) => (
            <span key={i} className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium shrink-0">{kw}</span>
          ))}
        </div>
        <div className="flex gap-3 animate-[marquee_42s_linear_infinite_reverse] whitespace-nowrap">
          {[...keywords2, ...keywords2].map((kw, i) => (
            <span key={i} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium shrink-0">{kw}</span>
          ))}
        </div>
      </section>

      {/* ——— WHAT I DO ——— */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">What I Bring</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white flex justify-center">
            <TextReveal text="What I Do" />
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {whatIDo.map((item, i) => (
            <motion.div key={item.title}
              className="p-6 rounded-2xl bg-[#0a0b10]/90 border border-white/8 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(0,113,227,0.12)] transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }} whileHover={{ y: -5 }}>
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">{item.icon}</div>
              <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— STATS ——— */}
      <section className="py-12 px-4 border-t border-white/5 bg-black/20">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/15"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }}>
              <div className="text-4xl font-extrabold text-primary mb-1">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 flex justify-center">
            <TextReveal text="Ready to collaborate?" />
          </h2>
          <p className="text-zinc-500 mb-7 max-w-md mx-auto text-sm">Seeking software engineering roles and internships. Let's connect and build.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-[0_0_32px_rgba(0,113,227,0.45)]">
            Get In Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
}
