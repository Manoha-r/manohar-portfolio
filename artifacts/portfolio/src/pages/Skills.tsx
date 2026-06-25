import { motion } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { SiJavascript, SiNodedotjs, SiMongodb, SiGithub, SiHtml5, SiBootstrap, SiTailwindcss, SiIntellijidea, SiExpress } from "react-icons/si";
import { FaJava, FaCss3Alt } from "react-icons/fa";
import { Database, Server, Terminal, Layers, Code2, Shield, BookOpen, Cpu, GitBranch } from "lucide-react";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};



const skillCategories = [
  {
    label: "Languages", icon: <Terminal className="w-4 h-4" />,
    color: "from-blue-600/15 to-blue-900/10", border: "border-blue-500/25", accent: "text-blue-400",
    skills: [
      { name: "Java", logo: <FaJava className="text-3xl text-orange-500" />, tag: "OOP · DSA", desc: "Primary language for data structures, algorithms, and OOP. Used to solve 100+ LeetCode problems." },
      { name: "SQL", logo: <Database className="w-7 h-7 text-sky-400" />, tag: "Relational DB", desc: "Relational queries, schema design, joins, and data manipulation for structured data management." },
      { name: "JavaScript", logo: <SiJavascript className="text-3xl text-yellow-400" />, tag: "ES6+", desc: "Core language for full-stack development — React frontend and Node.js backend projects." },
    ],
  },
  {
    label: "Core Concepts", icon: <Cpu className="w-4 h-4" />,
    color: "from-violet-600/15 to-violet-900/10", border: "border-violet-500/25", accent: "text-violet-400",
    skills: [
      { name: "Data Structures", logo: <Layers className="w-7 h-7 text-violet-400" />, tag: "Arrays · Trees · Graphs", desc: "Arrays, linked lists, stacks, queues, trees, heaps, graphs — applied in 100+ problems." },
      { name: "Algorithms", logo: <GitBranch className="w-7 h-7 text-violet-300" />, tag: "Sorting · DP · Greedy", desc: "Sorting, searching, dynamic programming, greedy, and divide-and-conquer in Java." },
      { name: "OOP", logo: <Code2 className="w-7 h-7 text-violet-400" />, tag: "Java", desc: "Encapsulation, inheritance, polymorphism, and abstraction — core to all Java development." },
      { name: "Time & Space Complexity", logo: <BookOpen className="w-7 h-7 text-violet-300" />, tag: "Big-O Analysis", desc: "Analyzing algorithmic efficiency — Big-O notation, worst/average/best case reasoning." },
    ],
  },
  {
    label: "Backend", icon: <Server className="w-4 h-4" />,
    color: "from-green-600/15 to-green-900/10", border: "border-green-500/25", accent: "text-green-400",
    skills: [
      { name: "Node.js", logo: <SiNodedotjs className="text-3xl text-green-400" />, tag: "Runtime", desc: "Non-blocking event-driven runtime — powers the backend of all MERN stack projects." },
      { name: "Express.js", logo: <SiExpress className="text-3xl text-white" />, tag: "MVC · REST", desc: "REST APIs with MVC architecture, middleware, routing, authentication, and error handling." },
      { name: "MongoDB", logo: <SiMongodb className="text-3xl text-green-500" />, tag: "NoSQL", desc: "Document-based storage and flexible schema design — used in Airbnb Clone backend." },
      { name: "Mongoose", logo: <Database className="w-7 h-7 text-orange-400" />, tag: "ODM", desc: "Schema definition, data validation, model relationships, and query building on MongoDB." },
      { name: "Passport.js", logo: <Shield className="w-7 h-7 text-yellow-400" />, tag: "Authentication", desc: "Session-based auth with local strategy, route protection, and secure user management." },
    ],
  },
  {
    label: "Frontend", icon: <Code2 className="w-4 h-4" />,
    color: "from-pink-600/15 to-pink-900/10", border: "border-pink-500/25", accent: "text-pink-400",
    skills: [
      { name: "HTML", logo: <SiHtml5 className="text-3xl text-orange-500" />, tag: "Semantic Markup", desc: "Semantic HTML5 structure, accessibility best practices, and clean document outlines." },
      { name: "CSS", logo: <FaCss3Alt className="text-3xl text-blue-400" />, tag: "Responsive", desc: "Flexbox, Grid, animations, and responsive layouts for all screen sizes." },
      { name: "EJS", logo: <Code2 className="w-7 h-7 text-green-400" />, tag: "Templating Engine", desc: "Server-side HTML rendering with Embedded JavaScript — used in Node.js/Express apps." },
      { name: "Bootstrap", logo: <SiBootstrap className="text-3xl text-purple-400" />, tag: "Component Library", desc: "Grid system, components, and utilities — used extensively in the Airbnb Clone." },
      { name: "Tailwind CSS", logo: <SiTailwindcss className="text-3xl text-teal-400" />, tag: "Utility-First", desc: "Fast, consistent styling with utility classes — dark mode, responsive, custom tokens." },
    ],
  },
  {
    label: "Tools", icon: <Terminal className="w-4 h-4" />,
    color: "from-zinc-600/15 to-zinc-900/10", border: "border-zinc-500/25", accent: "text-zinc-400",
    skills: [
      { name: "GitHub", logo: <SiGithub className="text-3xl text-white" />, tag: "Version Control", desc: "Branching, commits, PRs, and repository management for all personal projects." },
      { name: "VS Code", logo: <Code2 className="w-7 h-7 text-blue-500" />, tag: "Code Editor", desc: "Primary editor with extensions for JavaScript, React, Node.js, and full-stack dev." },
      { name: "IntelliJ IDEA", logo: <SiIntellijidea className="text-3xl text-red-400" />, tag: "Java IDE", desc: "Used for Java development, DSA practice, and debugging complex algorithmic solutions." },
    ],
  },
];

export function Skills() {
  const scrollRef = useSmoothScroll();
  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-screen overflow-y-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <div className="relative z-10 pt-20 pb-20 px-4 max-w-5xl mx-auto">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 1.0 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">What I Work With</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex justify-center">
            <TextReveal text="Technical Skills" />
          </h2>
          <p className="text-zinc-400 mt-3 text-base max-w-xl mx-auto">Every skill below represents a technology I've used to build real-world projects.</p>
        </motion.div>

        <div className="space-y-12">
          {skillCategories.map((cat, catIdx) => (
            <motion.div key={cat.label}
              initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: catIdx * 0.07, duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-1.5 rounded-lg bg-white/8 ${cat.accent}`}>{cat.icon}</div>
                <h3 className="text-white font-extrabold text-base uppercase tracking-widest">{cat.label}</h3>
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-zinc-600 text-xs">{cat.skills.length} skills</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.skills.map((skill, i) => (
                  <motion.div key={skill.name}
                    className={`bg-[#0b0b14]/85 bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl p-5 flex gap-4 items-start`}
                    initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.04 + i * 0.07, duration: 0.7 }} whileHover={{ y: -5, scale: 1.02 }}>
                    <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-black/30">{skill.logo}</div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-bold mb-0.5">{skill.name}</p>
                      <span className={`text-xs font-semibold ${cat.accent} block mb-2`}>{skill.tag}</span>
                      <p className="text-zinc-500 text-xs leading-relaxed">{skill.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-14 p-8 rounded-3xl bg-[#0b0b14]/85 border border-white/8 text-center"
          initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <h3 className="text-lg font-extrabold text-white mb-3">My Stack Philosophy</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">"MERN for building full-stack applications. Java for algorithmic thinking. Every skill here was earned by shipping real code — not just tutorials. I learn by building."</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
