import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { SafeCanvas } from "../components/SafeCanvas";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import * as THREE from "three";
import { ExternalLink, Github, Zap, Globe, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { SiGithub, SiReact, SiNodedotjs, SiMongodb } from "react-icons/si";
import { TextReveal } from "../components/TextReveal";

// Smooth fade-up entry
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.4, ease: "easeIn" as any } }
};

// 3D SCENE: 4×4 wireframe cube grid crashes in from far above — takes ~3.5s
function CubeGrid() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const cubes = useMemo(() => {
    const items: Array<{ pos: [number, number, number]; delay: number; color: string; size: number }> = [];
    const cols = 5, rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({
          pos: [(c - 2) * 2.8, (r - 1.5) * 2.8, (Math.random() - 0.5) * 3] as [number, number, number],
          delay: (r * cols + c) / (rows * cols) * 0.75,
          color: (r + c) % 3 === 0 ? "#0071E3" : (r + c) % 3 === 1 ? "#4499ff" : "#003d99",
          size: 0.6 + Math.random() * 0.4,
        });
      }
    }
    return items;
  }, []);

  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    progress.current = Math.min(1, progress.current + delta * 0.28);
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.25;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.08;
    }
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = cubes[i];
      const lp = Math.max(0, Math.min(1, (progress.current - d.delay) * 3));
      const ease = 1 - Math.pow(1 - lp, 3);
      const [tx, ty, tz] = d.pos;
      mesh.position.set(tx, ty + (1 - ease) * 20, tz);
      mesh.scale.setScalar(ease * d.size);
      mesh.rotation.x += delta * 0.5;
      mesh.rotation.y += delta * 0.35;
    });
  });

  return (
    <group>
      <group ref={groupRef} position={[0, 0, -4]}>
        {cubes.map((c, i) => (
          <mesh key={i} position={[c.pos[0], c.pos[1] + 20, c.pos[2]]}
            ref={(el) => { meshRefs.current[i] = el as THREE.Mesh | null; }}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.7} wireframe />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 3D SCENE: Waving grid of digital flow particles in the background
function GridFlowParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const particles = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => {
      // Assemble into 10 rows and 15 columns
      const row = Math.floor(i / 15);
      const col = i % 15;
      const final: [number, number, number] = [
        (col - 7) * 1.8,
        (row - 4.5) * 1.8,
        -5 + (Math.random() - 0.5) * 2
      ];
      const start: [number, number, number] = [
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
      ];
      return {
        startPos: start,
        finalPos: final,
        color: i % 2 === 0 ? "#0071E3" : "#4499ff",
        size: 0.05 + Math.random() * 0.07,
        delay: (i / 150) * 0.55,
      };
    });
  }, []);

  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    progress.current = Math.min(1, progress.current + delta * 0.28);
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15;
    }
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = particles[i];
      const lp = Math.max(0, Math.min(1, (progress.current - p.delay) * 2.5));
      const le = 1 - Math.pow(1 - lp, 3);
      // Wave motion
      const wave = Math.sin(t * 1.5 + p.finalPos[0] * 0.3) * 0.4;
      mesh.position.set(
        p.startPos[0] + (p.finalPos[0] - p.startPos[0]) * le,
        p.startPos[1] + (p.finalPos[1] - p.startPos[1]) * le + wave * le,
        p.startPos[2] + (p.finalPos[2] - p.startPos[2]) * le
      );
      mesh.scale.setScalar(le);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -4]}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[p.size, 6, 6]} position={p.startPos}
          ref={(el) => { meshRefs.current[i] = el as THREE.Mesh | null; }}>
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

export function ProjectsScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 8, 5]} intensity={4} color="#0071E3" />
      <pointLight position={[0, -5, 5]} intensity={1.5} color="#4499ff" />
      <Stars radius={120} depth={60} count={6000} factor={5} saturation={0} fade speed={0.6} />
      <CubeGrid />
      <GridFlowParticles />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  );
}

const projects = [
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const collapsedHeight = isMobile ? 480 : 440;

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

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
            const isExpanded = expandedCard === p.id;
            return (
              <motion.div key={p.title}
                layout
                initial={{ opacity: 0, y: -50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                animate={{ height: isExpanded ? "auto" : collapsedHeight }}
                transition={{ 
                  height: { type: "spring", stiffness: 180, damping: 25 },
                  layout: { type: "spring", stiffness: 180, damping: 25 }
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`bg-gradient-to-br ${p.color} border ${p.border} ${p.hoverColor} rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden`}>

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

                <button onClick={() => toggleExpand(p.id)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-2 rounded-xl bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-white text-xs font-bold transition-all border border-white/5">
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Show Details & Learnings <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }} 
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className="mt-4 pt-4 border-t border-white/10">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">The Problem</p>
                            <p className="text-zinc-400 text-xs leading-relaxed">{p.problem}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">The Solution</p>
                            <p className="text-zinc-400 text-xs leading-relaxed">{p.solution}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Key Features</p>
                            <div className="space-y-1.5">
                              {p.features.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />{item}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">What I Learned</p>
                            <div className="space-y-1.5">
                              {p.learned.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
    </motion.div>
  );
}
