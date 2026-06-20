import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { SafeCanvas } from "../components/SafeCanvas";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import * as THREE from "three";
import { Code2, Brain, Rocket, Heart, MapPin, BookOpen, Laptop, Server, Database } from "lucide-react";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};

// 3D SCENE: Full-size DNA Double Helix rising from below — takes ~3.5s to complete
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const steps = 32;

  const helixData = useMemo(() => {
    const pts: Array<{ pos: [number, number, number]; strand: number }> = [];
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 5;
      const y = (i / steps) * 14 - 7;
      pts.push({ pos: [Math.cos(t) * 2.5, y, Math.sin(t) * 2.5], strand: 0 });
      pts.push({ pos: [Math.cos(t + Math.PI) * 2.5, y, Math.sin(t + Math.PI) * 2.5], strand: 1 });
    }
    return pts;
  }, []);

  const rungs = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const t = (i / 16) * Math.PI * 5;
      const y = (i / 16) * 14 - 7;
      return { y, t };
    });
  }, []);

  const sphereRefs = useRef<Array<THREE.Mesh | null>>([]);
  const rungRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    // ~3.5 seconds to animate in
    progress.current = Math.min(1, progress.current + delta * 0.28);
    const ease = 1 - Math.pow(1 - progress.current, 3);

    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.22;
      // rise up from below
      groupRef.current.position.y = (1 - ease) * -6;
      groupRef.current.scale.setScalar(0.3 + ease * 0.7);
    }

    sphereRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const delay = (i / helixData.length) * 0.6;
      const sp = Math.max(0, Math.min(1, (progress.current - delay) * 2.5));
      const se = 1 - Math.pow(1 - sp, 3);
      mesh.scale.setScalar(se);
    });

    rungRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const delay = 0.3 + (i / rungs.length) * 0.5;
      const rp = Math.max(0, Math.min(1, (progress.current - delay) * 3));
      const re = 1 - Math.pow(1 - rp, 3);
      mesh.scale.setScalar(re);
      if (mesh.material) (mesh.material as THREE.MeshStandardMaterial).opacity = re * 0.7;
    });
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]} scale={0}>
      {/* Helix spheres */}
      {helixData.map((p, i) => (
        <Sphere key={i} args={[0.22, 14, 14]} position={p.pos} scale={0}
          ref={(el) => { sphereRefs.current[i] = el as THREE.Mesh | null; }}>
          <meshStandardMaterial
            color={p.strand === 0 ? "#0071E3" : "#ffffff"}
            emissive={p.strand === 0 ? "#0071E3" : "#4499ff"}
            emissiveIntensity={1.0} />
        </Sphere>
      ))}
      {/* Rungs */}
      {rungs.map((r, i) => {
        const x1 = Math.cos(r.t) * 2.5, z1 = Math.sin(r.t) * 2.5;
        const x2 = Math.cos(r.t + Math.PI) * 2.5, z2 = Math.sin(r.t + Math.PI) * 2.5;
        const len = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        const midX = (x1 + x2) / 2, midZ = (z1 + z2) / 2;
        const angle = Math.atan2(z2 - z1, x2 - x1);
        return (
          <mesh key={`rung-${i}`} position={[midX, r.y, midZ]} rotation={[0, -angle, Math.PI / 2]} scale={0}
            ref={(el) => { rungRefs.current[i] = el as THREE.Mesh | null; }}>
            <cylinderGeometry args={[0.05, 0.05, len, 6]} />
            <meshStandardMaterial color="#4499ff" emissive="#4499ff" emissiveIntensity={0.6} transparent opacity={0} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D SCENE: Swirling double-helix of particles wrapping the DNA strand
function HelixParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const particles = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const strand = i % 2;
      const t = (i / 200) * Math.PI * 8;
      const y = (i / 200) * 16 - 8;
      const angleOffset = strand === 0 ? 0 : Math.PI;
      const final: [number, number, number] = [
        Math.cos(t + angleOffset) * 3.5,
        y,
        Math.sin(t + angleOffset) * 3.5
      ];
      const start: [number, number, number] = [
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
      ];
      return {
        startPos: start,
        finalPos: final,
        color: strand === 0 ? "#0071E3" : "#ffffff",
        size: 0.04 + Math.random() * 0.08,
        delay: (i / 200) * 0.5,
      };
    });
  }, []);

  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    progress.current = Math.min(1, progress.current + delta * 0.28);
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = particles[i];
      const lp = Math.max(0, Math.min(1, (progress.current - p.delay) * 2.5));
      const le = 1 - Math.pow(1 - lp, 3);
      mesh.position.set(
        p.startPos[0] + (p.finalPos[0] - p.startPos[0]) * le,
        p.startPos[1] + (p.finalPos[1] - p.startPos[1]) * le,
        p.startPos[2] + (p.finalPos[2] - p.startPos[2]) * le,
      );
      mesh.scale.setScalar(le);
    });
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[p.size, 6, 6]} position={p.startPos}
          ref={(el) => { meshRefs.current[i] = el as THREE.Mesh | null; }}>
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

export function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#0071E3" />
      <pointLight position={[-8, -5, 5]} intensity={1.5} color="#4499ff" />
      <Stars radius={100} depth={50} count={5000} factor={5} saturation={0} fade speed={0.7} />
      <DNAHelix />
      <HelixParticles />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  );
}

const highlights = [
  { icon: <Code2 className="w-5 h-5 text-primary" />, title: "Clean Code Advocate", desc: "Every line I write is intentional — readable, maintainable, and built to last." },
  { icon: <Brain className="w-5 h-5 text-primary" />, title: "DSA & Problem Solver", desc: "100+ problems solved in Java on LeetCode. Strong in data structures, algorithms, and OOP." },
  { icon: <Rocket className="w-5 h-5 text-primary" />, title: "Fast Learner", desc: "I pick up new technologies fast and apply them in real projects immediately." },
  { icon: <Heart className="w-5 h-5 text-primary" />, title: "Passionate Builder", desc: "I build full-stack apps that solve real problems — from backend APIs to polished UIs." },
];

const interests = [
  { icon: <Laptop className="w-4 h-4" />, label: "Full Stack Development" },
  { icon: <Server className="w-4 h-4" />, label: "Backend Engineering" },
  { icon: <Code2 className="w-4 h-4" />, label: "REST API Design" },
  { icon: <Database className="w-4 h-4" />, label: "Database Design" },
  { icon: <Brain className="w-4 h-4" />, label: "Data Structures & Algorithms" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Software Architecture" },
  // { icon: <MapPin className="w-4 h-4" />, label: "Visakhapatnam, India 🇮🇳" },
];

const quickFacts = [
  { label: "University", value: "Mohan Babu University, Tirupati" },
  { label: "Degree", value: "B.Tech Computer Science Engineering" },
  { label: "CGPA", value: "8.52 / 10" },
  { label: "Batch", value: "2023 – 2027" },
  { label: "Stack", value: "MERN — MongoDB · Express · React · Node.js" },
  { label: "DSA Language", value: "Java" },
  { label: "Problem Solving", value: "100+ LeetCode problems solved" },
];

const timeline = [
  { year: "2020–21", event: "SSC — State Board, 93.67%", detail: "Strong academic foundation in core subjects." },
  { year: "2021–23", event: "Intermediate — Srinivasa Junior College, 93%", detail: "Excelled in Maths and Science, building the base for engineering." },
  { year: "2023", event: "Enrolled at Mohan Babu University — B.Tech CSE", detail: "Started the journey into Computer Science and picked up Java as my first programming language." },
  { year: "2024", event: "DSA Mastery with Java", detail: "Dived deep into Data Structures and Algorithms using Java — solved 130+ problems and completed ExcelR DSA certification." },
  { year: "2025", event: "MERN Stack Development + Internship", detail: "Built Airbnb Clone and NextStep as full-stack projects. Completed Apna College Delta certification and worked as a Frontend Developer Intern at Eunoia MUN." },
  { year: "2026", event: "Leveling Up — Actively Growing", detail: "Currently sharpening my skills in advanced full-stack development, system design, and DSA to prepare for real-world opportunities." },
];

export function About() {
  const scrollRef = useSmoothScroll();
  return (
    <motion.div ref={scrollRef} className="relative w-full min-h-screen overflow-y-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div className="bg-[#0b0b14]/85 rounded-3xl border border-white/10 p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }}>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Who I Am</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-7 tracking-tight text-white leading-tight flex flex-col">
              <TextReveal text="Building the Future," />
              <TextReveal text="One Line at a Time" />
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed text-[15px]">
              <p>I'm <span className="text-white font-semibold">Manohar Naidu Bugatha</span> — an aspiring software developer and Computer Science Engineering student at <span className="text-white font-semibold">Mohan Babu University</span> (Class of 2027), currently maintaining a CGPA of 8.52.</p>
              <p>I have hands-on experience building full-stack web applications using the MERN stack (MongoDB, Express.js, React, Node.js), with a solid grounding in Java, OOP principles, and algorithm design. I've delivered projects like an <span className="text-white font-semibold">Airbnb Clone</span> with authentication and REST APIs, and <span className="text-white font-semibold">NextStep</span> — a career guidance platform built with React.</p>
              <p>I've also gained real-world experience as a <span className="text-white font-semibold">Frontend Developer Intern at Eunoia MUN</span>, where I built and maintained responsive web pages for a live event platform.</p>
              <p>Beyond coding, I've completed certifications in Full Stack Web Development and DSA with Java, and solved <span className="text-white font-semibold">130+ problems on LeetCode</span> to sharpen my problem-solving skills. I'm actively seeking opportunities to apply my technical skills and grow as a developer in a collaborative, real-world environment.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 px-4 max-w-4xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Core Traits</p>
          <h2 className="text-3xl font-extrabold text-white flex justify-center">
            <TextReveal text="What Drives Me" />
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {highlights.map((h, i) => (
            <motion.div key={h.title} className="flex gap-4 p-5 rounded-2xl bg-[#0b0b14]/80 border border-white/8 hover:border-primary/35 transition-all"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }} whileHover={{ y: -4 }}>
              <div className="p-2.5 bg-primary/10 rounded-xl h-fit">{h.icon}</div>
              <div>
                <p className="text-white font-bold text-sm mb-1">{h.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4 max-w-4xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">At a Glance</p>
          <h2 className="text-3xl font-extrabold text-white flex justify-center">
            <TextReveal text="Quick Facts" />
          </h2>
        </motion.div>
        <motion.div className="bg-[#0b0b14]/85 border border-white/8 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          {quickFacts.map((f, i) => (
            <div key={f.label} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-4 ${i !== quickFacts.length - 1 ? "border-b border-white/5" : ""}`}>
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-wider w-36 shrink-0">{f.label}</span>
              <span className="text-zinc-300 text-sm">{f.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="py-10 px-4 max-w-4xl mx-auto">
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <h2 className="text-2xl font-extrabold text-white flex justify-center">
            <TextReveal text="Areas of Interest" />
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {interests.map((item, i) => (
            <motion.div key={item.label} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm hover:border-primary/35 hover:text-primary transition-all"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.65 }}>
              {item.icon} {item.label}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4 max-w-3xl mx-auto pb-20">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}>
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">My Journey</p>
          <h2 className="text-3xl font-extrabold text-white flex justify-center">
            <TextReveal text="The Story So Far" />
          </h2>
        </motion.div>
        <div className="relative pl-6 border-l border-primary/20 space-y-8">
          {timeline.map((item, i) => (
            <motion.div key={i} className="relative"
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.75 }}>
              <div className="absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(0,113,227,0.8)]" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">{item.year}</span>
              <h3 className="text-white font-bold text-sm mt-1 mb-1">{item.event}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
