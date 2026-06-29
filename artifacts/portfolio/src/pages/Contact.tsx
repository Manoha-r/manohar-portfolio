import { motion } from "framer-motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { Linkedin, Mail, Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { SiGithub, SiLeetcode } from "react-icons/si";
import { TextReveal } from "../components/TextReveal";

// Apple-Style Scale + Blur entry
const pageVariants = {
  initial: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)",
    transition: { duration: 0.35 }
  }
};



const socials = [
  { label: "Email", handle: "manoharnaidubugatha@gmail.com", href: "mailto:manoharnaidubugatha@gmail.com", icon: <Mail className="w-5 h-5" />, color: "hover:border-red-500/50", iconBg: "bg-red-500/10 text-red-400", desc: "Best way to reach me." },
  { label: "Phone", handle: "+91 7207228389", href: "tel:+917207228389", icon: <Phone className="w-5 h-5" />, color: "hover:border-green-500/50", iconBg: "bg-green-500/10 text-green-400", desc: "Available during IST hours." },
  { label: "GitHub", handle: "@Manoha-r", href: "https://github.com/Manoha-r", icon: <SiGithub className="w-5 h-5" />, color: "hover:border-white/40", iconBg: "bg-white/10 text-white", desc: "Browse my projects and code." },
  { label: "LinkedIn", handle: "manoharnaidubugatha", href: "https://www.linkedin.com/in/manoharnaidubugatha/", icon: <Linkedin className="w-5 h-5" />, color: "hover:border-[#0077b5]/50", iconBg: "bg-blue-600/15 text-blue-400", desc: "Professional profile and network." },
  { label: "LeetCode", handle: "myselfManu29", href: "https://leetcode.com/u/myselfManu29/", icon: <SiLeetcode className="w-5 h-5" />, color: "hover:border-[#ffa116]/50", iconBg: "bg-yellow-500/10 text-yellow-400", desc: "150+ DSA problems solved." },
];

const openTo = [
  "Full-time Software Engineer roles",
  "Full-Stack or Frontend/Backend positions",
  "Remote or on-site opportunities",
  "Early-stage startups & product teams",
  "Internship extensions and new roles",
  "Collaborative engineering environments",
];

const faqs = [
  { q: "Where are you located?", a: "Maddi, Visakhapatnam, Andhra Pradesh, India. Open to remote work or relocation for the right opportunity." },
  { q: "Are you available for full-time roles?", a: "Yes — I'm a final-year B.Tech CSE student (2023–2027) actively seeking internships and full-time opportunities now." },
  { q: "What's your preferred stack?", a: "MERN Stack — MongoDB, Express.js, React.js, Node.js. I also write Java for DSA and backend logic." },
  { q: "Can I see your code?", a: "Yes! GitHub.com/ManoharNaidu16 — both major projects (NextStep & Airbnb Clone) have full source available." },
];

export function Contact() {
  const scrollRef = useSmoothScroll();

  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-screen overflow-y-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <div className="relative z-10 pt-20 pb-16 px-4 max-w-3xl mx-auto">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1.0 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Open to Opportunities</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex flex-col items-center">
            <TextReveal text="Let's Connect &" />
            <TextReveal text="Build Something Great" className="text-primary" />
          </h2>
          <p className="text-zinc-400 mt-4 text-base max-w-xl mx-auto">
            Actively seeking internships and full-time software engineering roles. Whether you have an opportunity or just want to talk tech — reach out.
          </p>
        </motion.div>

        <motion.div className="mb-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.0 }}>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {socials.map((s, i) => (
              <motion.a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className={`flex items-center gap-4 p-5 rounded-2xl bg-[#08090e]/92 border border-white/10 transition-all duration-300 ${s.color} group`}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.09, duration: 0.85 }}
                whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.98 }}>
                <div className={`p-2.5 rounded-xl shrink-0 ${s.iconBg}`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold">{s.label}</p>
                  <p className="text-zinc-500 text-xs truncate mb-0.5">{s.handle}</p>
                  <p className="text-zinc-600 text-xs">{s.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          {[
            { icon: <Clock className="w-4 h-4" />, text: "Responds within 24 hours" },
            { icon: <MapPin className="w-4 h-4" />, text: "Visakhapatnam, India · Open to Remote" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/35 border border-white/10 text-zinc-500 text-sm">
              {item.icon} {item.text}
            </div>
          ))}
        </motion.div>

        <motion.div className="mb-10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <div className="bg-[#08090e]/92 border border-white/10 rounded-3xl p-7">
            <h3 className="text-white font-extrabold text-lg mb-5"><TextReveal text="What I'm Open To" /></h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {openTo.map((item, i) => (
                <motion.div key={i} className="flex items-center gap-2 text-sm text-zinc-400"
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.65 }}>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <h3 className="text-xl font-extrabold text-white mb-6 text-center flex justify-center"><TextReveal text="Common Questions" /></h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="p-5 rounded-2xl bg-[#08090e]/92 border border-white/8"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.75 }}>
                <p className="text-white font-bold text-sm mb-1.5">{faq.q}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p className="text-center text-zinc-700 text-xs mt-12"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          Designed & built by Manohar Naidu Bugatha · React · Three.js · Framer Motion · 2025
        </motion.p>
      </div>
    </motion.div>
  );
}
