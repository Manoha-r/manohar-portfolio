import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { SafeCanvas } from "../components/SafeCanvas";
import { OrbitControls, Stars, Sphere, Float } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import * as THREE from "three";
import { Linkedin, Mail, Send, Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";
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

function WireframeGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[3, 32, 32]}>
        <meshStandardMaterial 
          color="#0a0a0f" 
          wireframe 
          emissive="#0071E3" 
          emissiveIntensity={0.3} 
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

export function ContactScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#0071E3" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <WireframeGlobe />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

const socials = [
  { label: "Email", handle: "manoharnaidubugatha@gmail.com", href: "mailto:manoharnaidubugatha@gmail.com", icon: <Mail className="w-5 h-5" />, color: "hover:border-red-500/50", iconBg: "bg-red-500/10 text-red-400", desc: "Best way to reach me." },
  { label: "Phone", handle: "+91 7207228389", href: "tel:+917207228389", icon: <Phone className="w-5 h-5" />, color: "hover:border-green-500/50", iconBg: "bg-green-500/10 text-green-400", desc: "Available during IST hours." },
  { label: "GitHub", handle: "@Manoha-r", href: "https://github.com/Manoha-r", icon: <SiGithub className="w-5 h-5" />, color: "hover:border-white/40", iconBg: "bg-white/10 text-white", desc: "Browse my projects and code." },
  { label: "LinkedIn", handle: "manoharnaidubugatha", href: "https://www.linkedin.com/in/manoharnaidubugatha/", icon: <Linkedin className="w-5 h-5" />, color: "hover:border-[#0077b5]/50", iconBg: "bg-blue-600/15 text-blue-400", desc: "Professional profile and network." },
  { label: "LeetCode", handle: "myselfManu29", href: "https://leetcode.com/u/myselfManu29/", icon: <SiLeetcode className="w-5 h-5" />, color: "hover:border-[#ffa116]/50", iconBg: "bg-yellow-500/10 text-yellow-400", desc: "100+ DSA problems solved." },
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
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      setEmailError("Only Gmail addresses are allowed (ending in @gmail.com)");
      return;
    }

    setFormStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setFormStatus("error");
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-4 p-7 rounded-3xl bg-[#08090e]/92 border border-white/10 hover:border-primary/20 transition-colors">
            <h3 className="text-white font-extrabold text-lg mb-4"><TextReveal text="Send a Message" /></h3>
            
            {formStatus === "success" ? (
              <motion.div className="flex flex-col items-center justify-center py-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
                <h4 className="text-white font-bold text-lg mb-1">Message Sent Successfully!</h4>
                <p className="text-zinc-400 text-sm max-w-sm">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                <button type="button" onClick={() => setFormStatus("idle")} className="mt-6 text-primary hover:underline text-sm font-bold">
                  Send another message
                </button>
              </motion.div>
            ) : formStatus === "error" ? (
              <motion.div className="flex flex-col items-center justify-center py-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 rotate-45" />
                </div>
                <h4 className="text-white font-bold text-lg mb-1">Failed to Send Message</h4>
                <p className="text-zinc-400 text-sm max-w-sm">Something went wrong. Please check your network connection and try again.</p>
                <button type="button" onClick={() => setFormStatus("idle")} className="mt-6 text-primary hover:underline text-sm font-bold">
                  Try Again
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Your Name</label>
                    <input type="text" id="name" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:outline-none transition-all placeholder:text-zinc-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Your Email</label>
                    <input type="email" id="email" required value={formData.email}
                      onChange={(e) => {
                        setEmailError(null);
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      placeholder="john@gmail.com"
                      className={`w-full px-4 py-3 bg-white/5 border ${emailError ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-primary"} rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-zinc-600`} />
                    {emailError && (
                      <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-1">{emailError}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Subject</label>
                  <input type="text" id="subject" required value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Collaboration opportunities"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:outline-none transition-all placeholder:text-zinc-600" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Message</label>
                  <textarea id="message" required rows={4} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Manohar, I'd like to talk about..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:outline-none transition-all resize-none placeholder:text-zinc-600" />
                </div>
                <button type="submit" disabled={formStatus === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(0,113,227,0.3)] disabled:opacity-50">
                  {formStatus === "submitting" ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </>
            )}
          </form>
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
