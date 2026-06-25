import { motion } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { Briefcase, CheckCircle2, Calendar, MapPin, TrendingUp, Users, Lightbulb, Award, ExternalLink } from "lucide-react";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};



const internshipTasks = [
  "Engineered and maintained responsive web pages using HTML, CSS, and JavaScript",
  "Executed UI updates and content changes in collaboration with the organizing team",
  "Ensured layout consistency, responsiveness, and cross-device compatibility",
  "Maintained clean, structured, and well-documented frontend code",
];
const techUsed = ["HTML5", "CSS3", "JavaScript", "Git", "GitHub"];
const keyLearnings = [
  { icon: <Users className="w-4 h-4 text-blue-400" />, title: "Team Collaboration", desc: "Coordinating with a non-technical organizing team to translate needs into working features." },
  { icon: <TrendingUp className="w-4 h-4 text-green-400" />, title: "Responsive Thinking", desc: "Mobile-first design, cross-browser testing, and ensuring real-world device consistency." },
  { icon: <Lightbulb className="w-4 h-4 text-yellow-400" />, title: "Code Quality", desc: "Writing clean, structured code that others on the team can understand and maintain." },
];
const certifications = [
  { title: "Full Stack Web Development", org: "Apna College — Delta Program", colorL: "border-l-blue-500", badge: "bg-blue-500/15 text-blue-300", desc: "Complete MERN stack — HTML, CSS, JavaScript, React, Node.js, Express.js, and MongoDB.", link: "https://github.com/Manoha-r/Certificates/blob/main/Web-Dovelopment%20Cert.pdf" },
  { title: "Ace Coding Interviews: DSA Mastery with Java", org: "ExcelR EdTech · Jan – Feb 2025", colorL: "border-l-orange-500", badge: "bg-orange-500/15 text-orange-300", desc: "DSA covering arrays, linked lists, trees, graphs, DP, and interview problem-solving in Java.", link: "https://github.com/Manoha-r/Certificates/blob/main/DSA.pdf" },
];

export function Experience() {
  const scrollRef = useSmoothScroll();
  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-screen overflow-y-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <div className="relative z-10 pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 1.0 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Professional Journey</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex justify-center">
            <TextReveal text="Experience" />
          </h2>
          <p className="text-zinc-400 mt-3 text-base max-w-xl mx-auto">Real-world internship experience plus industry-recognized certifications.</p>
        </motion.div>

        <motion.div className="bg-black/35 border-l-4 border-primary/70 border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 mb-10"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div className="flex gap-4">
              <div className="p-3 bg-primary/15 rounded-2xl border border-primary/30 shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white">Frontend Developer Intern</h3>
                <p className="text-primary font-semibold text-lg mt-0.5">Eunoia MUN</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-zinc-500 text-xs">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />May 2025 – June 2025</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Remote</span>
                </div>
              </div>
            </div>
            <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/30 h-fit">Internship</span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Responsibilities</p>
            <div className="space-y-3">
              {internshipTasks.map((h, j) => (
                <motion.div key={j} className="flex gap-3"
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: j * 0.1, duration: 0.7 }}>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-zinc-400 text-sm leading-relaxed">{h}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Technologies Used</p>
            <div className="flex flex-wrap gap-2">
              {techUsed.map((t) => <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20">{t}</span>)}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Key Learnings</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {keyLearnings.map((k, i) => (
                <motion.div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/8"
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.13, duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-2">{k.icon}<p className="text-white text-xs font-bold">{k.title}</p></div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{k.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <div className="flex items-center gap-2 mb-6"><Award className="w-5 h-5 text-primary" /><h3 className="text-xl font-extrabold text-white flex justify-center"><TextReveal text="Certifications" /></h3></div>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <a
                key={i}
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                className="block group cursor-pointer"
              >
                <motion.div className={`bg-black/30 border-l-4 ${cert.colorL} border border-white/8 group-hover:border-primary/40 rounded-2xl p-4 sm:p-6 transition-all duration-300`}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.75 }} whileHover={{ scale: 1.01 }}>
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h4 className="text-white font-bold text-base flex-1 group-hover:text-primary transition-colors flex items-center gap-2">
                      {cert.title} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h4>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cert.badge} shrink-0`}>Certified</span>
                  </div>
                  <p className="text-primary text-xs font-semibold mb-3">{cert.org}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{cert.desc}</p>
                </motion.div>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-12 p-5 sm:p-8 rounded-3xl bg-black/30 border border-white/8 text-center"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <h3 className="text-xl font-extrabold text-white mb-3">What I'm Looking For</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Actively seeking full-time software engineering roles and internships. Ready to contribute to meaningful products, collaborate with great teams, and grow as an engineer — remote or on-site.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
