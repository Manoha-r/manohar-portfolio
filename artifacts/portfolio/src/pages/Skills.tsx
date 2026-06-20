import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { SafeCanvas } from "../components/SafeCanvas";
import { Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import * as THREE from "three";
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

// 3D SCENE: 60 constellation nodes fan out from center + lines draw in — ~3.5s
function ConstellationScene3D() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const nodes = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 5.5;
    return {
      finalPos: [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)] as [number, number, number],
      color: i % 4 === 0 ? "#0071E3" : i % 4 === 1 ? "#4499ff" : i % 4 === 2 ? "#ffffff" : "#003d99",
      size: 0.07 + Math.random() * 0.15,
      delay: (i / 60) * 0.6,
    };
  }), []);

  const connections = useMemo(() => {
    const lines: Array<{ a: number; b: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const [ax, ay, az] = nodes[i].finalPos;
        const [bx, by, bz] = nodes[j].finalPos;
        if (Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2) < 4.0 && lines.length < 70) {
          lines.push({ a: i, b: j });
        }
      }
    }
    return lines;
  }, [nodes]);

  const sphereRefs = useRef<Array<THREE.Mesh | null>>([]);
  const lineRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    progress.current = Math.min(1, progress.current + delta * 0.28);
    const ease = 1 - Math.pow(1 - Math.min(progress.current, 1), 3);
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.09;

    sphereRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const n = nodes[i];
      const sp = Math.max(0, Math.min(1, (progress.current - n.delay) * 2.5));
      const se = 1 - Math.pow(1 - sp, 3);
      const [fx, fy, fz] = n.finalPos;
      mesh.position.set(fx * se, fy * se, fz * se);
      mesh.scale.setScalar(se);
    });

    lineRefs.current.forEach((mesh) => {
      if (!mesh) return;
      const lp = Math.max(0, ease - 0.35) / 0.65;
      mesh.scale.setScalar(lp);
      (mesh.material as THREE.MeshStandardMaterial).opacity = lp * 0.4;
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <Sphere key={i} args={[n.size, 8, 8]} position={[0, 0, 0]}
          ref={(el) => { sphereRefs.current[i] = el as THREE.Mesh | null; }}>
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.9} />
        </Sphere>
      ))}
      {connections.map(({ a, b }, i) => {
        const [ax, ay, az] = nodes[a].finalPos;
        const [bx, by, bz] = nodes[b].finalPos;
        const midX = (ax + bx) / 2, midY = (ay + by) / 2, midZ = (az + bz) / 2;
        const len = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2);
        const dir = new THREE.Vector3(bx - ax, by - ay, bz - az).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const euler = new THREE.Euler().setFromQuaternion(quat);
        return (
          <mesh key={i} position={[midX, midY, midZ]} rotation={euler}
            ref={(el) => { lineRefs.current[i] = el as THREE.Mesh | null; }}>
            <cylinderGeometry args={[0.016, 0.016, len, 4]} />
            <meshStandardMaterial color="#0071E3" emissive="#0071E3" emissiveIntensity={0.5} transparent opacity={0} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D SCENE: Swirling space dust particles fanning out in concentric disks
function SwirlingDustParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  const particles = useMemo(() => {
    return Array.from({ length: 180 }, (_, i) => {
      const radius = 2 + Math.random() * 7.5;
      const theta = Math.random() * Math.PI * 2;
      const final: [number, number, number] = [
        Math.cos(theta) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(theta) * radius
      ];
      const start: [number, number, number] = [
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
      ];
      return {
        startPos: start,
        finalPos: final,
        color: i % 3 === 0 ? "#0071E3" : i % 3 === 1 ? "#4499ff" : "#003d99",
        size: 0.03 + Math.random() * 0.08,
        delay: (i / 180) * 0.6,
      };
    });
  }, []);

  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }, delta) => {
    progress.current = Math.min(1, progress.current + delta * 0.28);
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.12;
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
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[p.size, 6, 6]} position={p.startPos}
          ref={(el) => { meshRefs.current[i] = el as THREE.Mesh | null; }}>
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.7} />
        </Sphere>
      ))}
    </group>
  );
}

export function SkillsScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 5]} intensity={4} color="#0071E3" />
      <Stars radius={120} depth={60} count={6000} factor={5} saturation={0} fade speed={0.5} />
      <ConstellationScene3D />
      <SwirlingDustParticles />
    </>
  );
}

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
          <p className="text-zinc-400 mt-3 text-base max-w-xl mx-auto">Every skill below is directly from my resume — technologies I've used to build real projects.</p>
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
