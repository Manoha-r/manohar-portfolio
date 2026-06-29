import { motion } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { GraduationCap, BookOpen, Trophy, Star, Code2, Brain } from "lucide-react";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};



const educationCards = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science Engineering",
    institution: "Mohan Babu University",
    score: "CGPA: 8.52",
    years: "2023 – 2027",
    status: "In Progress",
    statusColor: "bg-primary/20 text-primary border-primary/30",
    border: "border-primary/30",
    desc: "Pursuing B.Tech CSE with strong focus on data structures, algorithms, software engineering, and web development. Maintaining a 8.52 CGPA while working on real projects alongside academics.",
  },
  {
    degree: "Intermediate",
    field: "Mathematics, Physics, Chemistry",
    institution: "Srinivasa Junior College",
    score: "Score: 93%",
    years: "2021 – 2023",
    status: "Completed",
    statusColor: "bg-green-500/20 text-green-400 border-green-400/30",
    border: "border-white/15",
    desc: "Excelled in Mathematics and Sciences, building strong analytical foundations that directly support algorithmic thinking and engineering problem solving.",
  },
  {
    degree: "SSC",
    field: "State Board",
    institution: "State Board School",
    score: "Score: 93.67%",
    years: "2020 – 2021",
    status: "Completed",
    statusColor: "bg-green-500/20 text-green-400 border-green-400/30",
    border: "border-white/15",
    desc: "Strong academic performance in core subjects, demonstrating discipline and commitment to excellence from an early stage.",
  },
];

const coursework = [
  { name: "Data Structures & Algorithms", desc: "Arrays, trees, graphs, heaps, sorting — 150+ problems solved in Java." },
  { name: "Object-Oriented Programming", desc: "Encapsulation, inheritance, polymorphism in Java — core to all backend work." },
  { name: "Database Management Systems", desc: "SQL, normalization, transactions, indexing — applied with MongoDB and Mongoose." },
  { name: "Computer Networks", desc: "TCP/IP, HTTP, DNS — essential for REST API and web application development." },
  { name: "Operating Systems", desc: "Processes, threads, scheduling, memory management foundations." },
  { name: "Software Engineering", desc: "SDLC, Agile, requirements engineering, and software testing principles." },
];

const achievements = [
  { icon: <Trophy className="w-5 h-5 text-yellow-400" />, title: "CGPA: 8.52", desc: "Consistent academic performance at Mohan Babu University, B.Tech CSE." },
  { icon: <Code2 className="w-5 h-5 text-blue-400" />, title: "150+ DSA Problems", desc: "LeetCode practice in Java — strong algorithmic thinking beyond the classroom." },
  { icon: <Star className="w-5 h-5 text-violet-400" />, title: "93% in Intermediate", desc: "Excellent academic record at Srinivasa Junior College, 2021–2023." },
  { icon: <Brain className="w-5 h-5 text-pink-400" />, title: "2 Full-Stack Projects", desc: "Built NextStep and Airbnb Clone end-to-end while studying full-time." },
];

export function Education() {
  const scrollRef = useSmoothScroll();
  return (
    <motion.div
      ref={scrollRef}
      className="relative w-full min-h-screen overflow-y-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >

      <div className="relative z-10 pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Academic Foundation</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex justify-center">
            <TextReveal text="Education" />
          </h2>
          <p className="text-zinc-400 mt-3 text-base max-w-xl mx-auto">
            Strong academics at every level — from school to university — paired with real-world application.
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="space-y-5 mb-12">
          {educationCards.map((edu, idx) => (
            <motion.div
              key={edu.institution}
              className={`bg-black/65 border ${edu.border} rounded-3xl p-5 sm:p-8`}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.8 }}>
              <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shrink-0">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-xl font-extrabold text-white">{edu.degree}</h3>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${edu.statusColor}`}>{edu.status}</span>
                  </div>
                  <p className="text-primary font-semibold mb-0.5">{edu.field}</p>
                  <p className="text-zinc-400 text-sm font-medium mb-0.5">{edu.institution}</p>
                  <div className="flex items-center gap-4 text-zinc-500 text-xs mb-3">
                    <span>{edu.score}</span>
                    <span>{edu.years}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{edu.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coursework */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-extrabold text-white flex justify-center"><TextReveal text="Key Coursework" /></h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {coursework.map((c, i) => (
              <motion.div key={c.name}
                className="p-5 rounded-2xl bg-black/50 border border-white/8 hover:border-primary/25 transition-all"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }}
                whileHover={{ y: -2 }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <p className="text-white text-sm font-bold">{c.name}</p>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-extrabold text-white flex justify-center"><TextReveal text="Achievements" /></h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((a, i) => (
              <motion.div key={i}
                className="flex gap-4 p-5 rounded-2xl bg-black/50 border border-white/8"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
                whileHover={{ y: -3 }}>
                <div className="p-2.5 bg-white/6 rounded-xl h-fit shrink-0">{a.icon}</div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{a.title}</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="p-5 sm:p-8 rounded-3xl bg-primary/8 border border-primary/20 text-center"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h3 className="text-xl font-extrabold text-white mb-3 flex justify-center"><TextReveal text="My Learning Philosophy" /></h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
            "I don't learn to pass exams. I learn to build things. Every concept I study — whether it's a sorting algorithm, a database index, or an authentication flow — I immediately ask: how can I apply this in a real project?"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
