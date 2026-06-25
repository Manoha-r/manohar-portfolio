import { useEffect, useRef } from "react";

interface Background3DProps {
  location: string;
  isIntroPlaying: boolean;
  onIntroComplete: () => void;
}

interface Particle {
  x: number; // world x
  y: number; // world y
  vx: number;
  vy: number;
  radius: number;
}

interface Formula {
  text: string;
  x: number; // world x
  y: number; // world y
  page: string;
  currentOpacity: number;
}

interface IntroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  size: number;
}

export function Background3D({ location, isIntroPlaying, onIntroComplete }: Background3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track camera positions (pan and zoom in world space)
  const cameraRef = useRef({
    currentX: 0,
    currentY: 0,
    currentScale: 1.0,
    targetX: 0,
    targetY: 0,
    targetScale: 1.0,
  });

  // Track mouse coordinates in screen space and smooth mouse coordinates
  const mouseRef = useRef({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    active: false,
  });

  const timeRef = useRef(0);
  const introElapsedRef = useRef(0);

  // Set up world coordinates for each page
  useEffect(() => {
    const targets: Record<string, { x: number; y: number; scale: number }> = {
      "/":           { x: 0,    y: 0,    scale: 1.0 },
      "/about":      { x: -350, y: -150, scale: 1.05 },
      "/skills":     { x: 300,  y: 250,  scale: 0.95 },
      "/projects":   { x: 0,    y: -450, scale: 1.1 },
      "/experience": { x: -450, y: 200,  scale: 1.0 },
      "/education":  { x: 400,  y: -350, scale: 1.05 },
      "/contact":    { x: -100, y: 100,  scale: 1.15 },
    };

    const target = targets[location] || targets["/"];
    cameraRef.current.targetX = target.x;
    cameraRef.current.targetY = target.y;
    cameraRef.current.targetScale = target.scale;
  }, [location]);

  // Initialize and run canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Responsive Canvas Resizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.restore();
      ctx.save();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse positioning
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initialize 45 world space drifting particles
    const particles: Particle[] = Array.from({ length: 45 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 20;
      return {
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2,
      };
    });

    // Initialize formulas with current opacity
    const formulas: Formula[] = [
      // Home page: centered
      { text: "∫ e^x dx = e^x + C", x: -200, y: -120, page: "/", currentOpacity: 0 },
      { text: "lim (n→∞) (1 + 1/n)^n = e", x: 180, y: -160, page: "/", currentOpacity: 0 },
      { text: "e^{iπ} + 1 = 0", x: -220, y: 150, page: "/", currentOpacity: 0 },
      { text: "∑_{i=1}^n i = n(n+1)/2", x: 200, y: 120, page: "/", currentOpacity: 0 },
      { text: "∇ × E = -∂B/∂t", x: -80, y: -220, page: "/", currentOpacity: 0 },
      
      // About page: shifted right and down
      { text: "h_θ(x) = g(θ^T x)", x: 200, y: 60, page: "/about", currentOpacity: 0 },
      { text: "f(x) = max(0, x)", x: 420, y: 240, page: "/about", currentOpacity: 0 },
      { text: "w_{ij} = w_{ij} - α ∂L/∂w_{ij}", x: 280, y: 260, page: "/about", currentOpacity: 0 },
      { text: "DNA = {A, T, C, G}", x: 480, y: 80, page: "/about", currentOpacity: 0 },

      // Skills page: shifted left and up
      { text: "A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C)", x: -450, y: -300, page: "/skills", currentOpacity: 0 },
      { text: "O(N log N)", x: -220, y: -160, page: "/skills", currentOpacity: 0 },
      { text: "H(X) = -∑ P(x_i) log_2 P(x_i)", x: -380, y: -120, page: "/skills", currentOpacity: 0 },
      { text: "P(A|B) = P(B|A)P(A)/P(B)", x: -180, y: -320, page: "/skills", currentOpacity: 0 },

      // Projects page: shifted down
      { text: "sin²θ + cos²θ = 1", x: -180, y: 350, page: "/projects", currentOpacity: 0 },
      { text: "A · B = |A||B| cosθ", x: 180, y: 380, page: "/projects", currentOpacity: 0 },
      { text: "tanθ = y/x", x: -150, y: 550, page: "/projects", currentOpacity: 0 },
      { text: "a² + b² = c²", x: 160, y: 520, page: "/projects", currentOpacity: 0 },

      // Experience page: shifted right and up
      { text: "y = β_0 + β_1 x + ε", x: 320, y: -320, page: "/experience", currentOpacity: 0 },
      { text: "σ² = (1/N) ∑ (x_i - μ)²", x: 550, y: -120, page: "/experience", currentOpacity: 0 },
      { text: "f(x|μ,σ) = 1/(σ√(2π)) e^{-(x-μ)²/2σ²}", x: 380, y: -80, page: "/experience", currentOpacity: 0 },

      // Education page: shifted left and down
      { text: "φ = (1 + √5)/2 ≈ 1.61803", x: -550, y: 250, page: "/education", currentOpacity: 0 },
      { text: "A = π r²", x: -300, y: 280, page: "/education", currentOpacity: 0 },
      { text: "e^{iθ} = cosθ + i sinθ", x: -480, y: 450, page: "/education", currentOpacity: 0 },

      // Contact page: shifted slightly
      { text: "f(t) = A sin(2π f t + φ)", x: -80, y: 80, page: "/contact", currentOpacity: 0 },
      { text: "H(s) = Y(s)/X(s)", x: 100, y: -120, page: "/contact", currentOpacity: 0 },
      { text: "C = B log_2(1 + S/N)", x: -120, y: -90, page: "/contact", currentOpacity: 0 }
    ];

    // Neural Network nodes for About page
    const neuralNodes = [
      { x: 260, y: 100 }, { x: 260, y: 150 }, { x: 260, y: 200 }, // Input Layer
      { x: 350, y: 75 },  { x: 350, y: 125 }, { x: 350, y: 175 }, { x: 350, y: 225 }, // Hidden Layer
      { x: 440, y: 110 }, { x: 440, y: 190 } // Output Layer
    ];

    const neuralSignals = Array.from({ length: 10 }, () => {
      const fromIdx = Math.floor(Math.random() * 3); // input layers index
      const toIdx = 3 + Math.floor(Math.random() * 4); // hidden layer index
      const nextToIdx = 7 + Math.floor(Math.random() * 2); // output layer index
      
      const step = Math.random() > 0.5 ? 1 : 2;
      const start = step === 1 ? neuralNodes[fromIdx] : neuralNodes[toIdx];
      const end = step === 1 ? neuralNodes[toIdx] : neuralNodes[nextToIdx];

      return {
        start,
        end,
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.4,
      };
    });

    // Cinematic Intro particles
    const introChars = ["f(x)", "∫", "∑", "e", "π", "θ", "λ", "∞", "√", "∇", "Δ", "log", "1", "0", "+", "-", "="];
    const introColors = ["#0071E3", "#4499ff", "#002266", "#ffffff"];
    const introParticles: IntroParticle[] = Array.from({ length: 180 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 40; // clustered closely at start
      const speed = 150 + Math.random() * 350; // fast expansion speed
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        char: introChars[Math.floor(Math.random() * introChars.length)],
        color: introColors[Math.floor(Math.random() * introColors.length)],
        size: 8 + Math.random() * 12,
      };
    });

    // Main animation loop
    const render = (now: number) => {
      if (document.visibilityState === "hidden") {
        lastTime = now;
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min(0.05, (now - lastTime) / 1000); // capped delta
      lastTime = now;

      timeRef.current += delta;
      const time = timeRef.current;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // 1. Lerp camera pan & zoom
      const camera = cameraRef.current;
      camera.currentX += (camera.targetX - camera.currentX) * delta * 4.5;
      camera.currentY += (camera.targetY - camera.currentY) * delta * 4.5;
      camera.currentScale += (camera.targetScale - camera.currentScale) * delta * 4.5;

      // 2. Lerp smooth mouse position for parallax/interactive networking
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.smoothX += (mouse.x - mouse.smoothX) * delta * 5.0;
        mouse.smoothY += (mouse.y - mouse.smoothY) * delta * 5.0;
      } else {
        // center mouse drift if inactive
        mouse.smoothX += (width / 2 - mouse.smoothX) * delta * 2.0;
        mouse.smoothY += (height / 2 - mouse.smoothY) * delta * 2.0;
      }

      // Parallax shifts the camera slightly based on mouse position
      const parallaxX = (mouse.smoothX - width / 2) * 0.15;
      const parallaxY = (mouse.smoothY - height / 2) * 0.15;

      // Coordinate converter helper: World coordinates -> Screen space coordinates
      const worldToScreen = (wx: number, wy: number) => {
        return {
          x: width / 2 + (wx + camera.currentX) * camera.currentScale + parallaxX,
          y: height / 2 + (wy + camera.currentY) * camera.currentScale + parallaxY,
        };
      };

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background dark gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height));
      bgGrad.addColorStop(0, "#070714");
      bgGrad.addColorStop(1, "#030308");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw global blueprint-style mathematical coordinates grid
      const gridSpacing = 80;
      const scaledSpacing = gridSpacing * camera.currentScale;
      
      const origin = worldToScreen(0, 0);

      // Draw minor grid lines
      ctx.strokeStyle = "rgba(0, 113, 227, 0.03)";
      ctx.lineWidth = 1;

      let startX = origin.x % scaledSpacing;
      if (startX < 0) startX += scaledSpacing;
      for (let sx = startX; sx < width; sx += scaledSpacing) {
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }

      let startY = origin.y % scaledSpacing;
      if (startY < 0) startY += scaledSpacing;
      for (let sy = startY; sy < height; sy += scaledSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }

      // Draw X & Y axes
      ctx.strokeStyle = "rgba(0, 113, 227, 0.07)";
      ctx.lineWidth = 1.5;

      if (origin.x >= 0 && origin.x <= width) {
        ctx.beginPath();
        ctx.moveTo(origin.x, 0);
        ctx.lineTo(origin.x, height);
        ctx.stroke();

        // draw y-axis tick values
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.font = "9px monospace";
        for (let y = origin.y % (scaledSpacing * 2); y < height; y += scaledSpacing * 2) {
          const val = Math.round((origin.y - y) / camera.currentScale);
          if (val !== 0) ctx.fillText(val.toString(), origin.x + 6, y + 3);
        }
      }

      if (origin.y >= 0 && origin.y <= height) {
        ctx.beginPath();
        ctx.moveTo(0, origin.y);
        ctx.lineTo(width, origin.y);
        ctx.stroke();

        // draw x-axis tick values
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.font = "9px monospace";
        for (let x = origin.x % (scaledSpacing * 2); x < width; x += scaledSpacing * 2) {
          const val = Math.round((x - origin.x) / camera.currentScale);
          if (val !== 0) ctx.fillText(val.toString(), x - 8, origin.y - 6);
        }
      }

      // Check Intro State drawing
      if (isIntroPlaying) {
        introElapsedRef.current += delta;
        const elapsed = introElapsedRef.current;
        const explodeStart = 2.35;
        const explodeProgress = elapsed > explodeStart ? Math.min(1, (elapsed - explodeStart) / 0.65) : 0;

        ctx.save();
        ctx.translate(width / 2, height / 2);

        if (elapsed < explodeStart) {
          // Pre-explosion: Draw a mathematical spiral nexus rotating and gathering energy
          const nexusRadius = 80 + Math.sin(elapsed * 12) * 10;
          ctx.strokeStyle = "rgba(0, 113, 227, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          
          // Outer shell circles
          ctx.arc(0, 0, nexusRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(68, 153, 255, 0.15)";
          ctx.beginPath();
          ctx.arc(0, 0, nexusRadius * 1.5, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating inner geometry lines
          ctx.rotate(elapsed * 2.2);
          ctx.strokeStyle = "rgba(0, 113, 227, 0.5)";
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * nexusRadius, Math.sin(angle) * nexusRadius);
          }
          ctx.stroke();

          // Pulse Core
          ctx.beginPath();
          ctx.arc(0, 0, 20 + Math.sin(elapsed * 20) * 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#0071E3";
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner equations spinning and shrinking into core
          ctx.fillStyle = "rgba(0, 113, 227, 0.6)";
          ctx.font = "11px monospace";
          introChars.forEach((ch, idx) => {
            const angle = (idx * Math.PI * 2) / introChars.length + elapsed * 0.5;
            const radius = nexusRadius - 10 - Math.sin(elapsed * 6 + idx) * 15;
            ctx.fillText(ch, Math.cos(angle) * radius - 5, Math.sin(angle) * radius + 4);
          });

        } else {
          // Explosion phase: blast math equations and particles outward
          const t = explodeProgress;
          const scale = 1.0 + Math.pow(t, 2.5) * 8.0;

          // Expanding wave ring
          ctx.strokeStyle = `rgba(0, 113, 227, ${1 - t})`;
          ctx.lineWidth = 4 - t * 3;
          ctx.beginPath();
          ctx.arc(0, 0, t * Math.max(width, height) * 0.9, 0, Math.PI * 2);
          ctx.stroke();

          // Draw fast-expanding particles
          introParticles.forEach((p) => {
            const px = p.x + p.vx * (elapsed - explodeStart);
            const py = p.y + p.vy * (elapsed - explodeStart);
            const alpha = Math.max(0, 1 - t - (Math.sqrt(px*px + py*py) / Math.max(width, height)) * 0.55);

            if (alpha > 0) {
              ctx.fillStyle = p.color;
              ctx.font = `${p.size}px monospace`;
              ctx.globalAlpha = alpha;
              ctx.fillText(p.char, px - p.size/2, py + p.size/2);
            }
          });
          ctx.globalAlpha = 1.0;
        }

        ctx.restore();

        if (elapsed >= 3.0) {
          onIntroComplete();
        }
      } else {
        // 3. PAGE SCENE DRAWINGS (Drawn on the chalkboard space)

        // PAGE: Home "/" (Trigonometric waveform graph)
        if (location === "/" || camera.targetX === 0) {
          const homeCenter = worldToScreen(0, 0);
          ctx.save();
          ctx.strokeStyle = "rgba(0, 113, 227, 0.4)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          const w = 320 * camera.currentScale;
          
          for (let x = -w / 2; x <= w / 2; x += 2) {
            const angle = (x / w) * Math.PI * 6.5 - time * 1.5;
            const y = Math.sin(angle) * 35 * camera.currentScale;
            if (x === -w / 2) {
              ctx.moveTo(homeCenter.x + x, homeCenter.y + y);
            } else {
              ctx.lineTo(homeCenter.x + x, homeCenter.y + y);
            }
          }
          ctx.stroke();

          // Complementary Cosine wave
          ctx.strokeStyle = "rgba(68, 153, 255, 0.15)";
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          for (let x = -w / 2; x <= w / 2; x += 2) {
            const angle = (x / w) * Math.PI * 6.5 - time * 1.5 + Math.PI / 2;
            const y = Math.cos(angle) * 35 * camera.currentScale;
            if (x === -w / 2) {
              ctx.moveTo(homeCenter.x + x, homeCenter.y + y);
            } else {
              ctx.lineTo(homeCenter.x + x, homeCenter.y + y);
            }
          }
          ctx.stroke();
          ctx.restore();
        }

        // PAGE: About "/about" (DNA Double Helix + Neural Network Nodes)
        if (location === "/about" || Math.abs(camera.targetX - (-350)) < 10) {
          const aboutCenter = worldToScreen(350, 150);
          ctx.save();

          // A. Draw Sine-wave DNA Helix spinning
          const helixLength = 220 * camera.currentScale;
          const helixWidth = 25 * camera.currentScale;
          const steps = 24;

          ctx.rotate(-Math.PI / 12);
          
          // Draw connecting rungs first
          for (let i = 0; i < steps; i++) {
            const hx = aboutCenter.x - helixLength / 2 + (i / steps) * helixLength;
            const angle = (i / steps) * Math.PI * 3.5 + time * 1.8;
            const hy1 = aboutCenter.y + Math.sin(angle) * helixWidth;
            const hy2 = aboutCenter.y + Math.sin(angle + Math.PI) * helixWidth;

            ctx.strokeStyle = `rgba(68, 153, 255, ${0.1 + 0.35 * Math.abs(Math.cos(angle))})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hx, hy1);
            ctx.lineTo(hx, hy2);
            ctx.stroke();
          }

          // Draw helix nodes
          for (let i = 0; i < steps; i++) {
            const hx = aboutCenter.x - helixLength / 2 + (i / steps) * helixLength;
            const angle = (i / steps) * Math.PI * 3.5 + time * 1.8;
            const hy1 = aboutCenter.y + Math.sin(angle) * helixWidth;
            const hy2 = aboutCenter.y + Math.sin(angle + Math.PI) * helixWidth;

            ctx.shadowBlur = 3;
            // Strand 1 node (blue)
            ctx.beginPath();
            ctx.arc(hx, hy1, 3.2 * camera.currentScale, 0, Math.PI * 2);
            ctx.fillStyle = "#0071E3";
            ctx.shadowColor = "#0071E3";
            ctx.fill();

            // Strand 2 node (white)
            ctx.beginPath();
            ctx.arc(hx, hy2, 3.2 * camera.currentScale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffffff";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.restore();

          // B. Draw Neural Network
          ctx.save();
          // Draw connections
          ctx.strokeStyle = "rgba(0, 113, 227, 0.08)";
          ctx.lineWidth = 1;
          for (let i = 0; i < 3; i++) {
            const nStart = worldToScreen(neuralNodes[i].x, neuralNodes[i].y);
            for (let j = 3; j < 7; j++) {
              const nEnd = worldToScreen(neuralNodes[j].x, neuralNodes[j].y);
              ctx.beginPath();
              ctx.moveTo(nStart.x, nStart.y);
              ctx.lineTo(nEnd.x, nEnd.y);
              ctx.stroke();
            }
          }
          for (let i = 3; i < 7; i++) {
            const nStart = worldToScreen(neuralNodes[i].x, neuralNodes[i].y);
            for (let j = 7; j < 9; j++) {
              const nEnd = worldToScreen(neuralNodes[j].x, neuralNodes[j].y);
              ctx.beginPath();
              ctx.moveTo(nStart.x, nStart.y);
              ctx.lineTo(nEnd.x, nEnd.y);
              ctx.stroke();
            }
          }

          // Update & Draw pulsing neural signals
          neuralSignals.forEach((sig) => {
            sig.progress += sig.speed * delta;
            if (sig.progress >= 1) {
              sig.progress = 0;
              // Reset to new path
              const step = Math.random() > 0.5 ? 1 : 2;
              const fromIdx = Math.floor(Math.random() * 3);
              const toIdx = 3 + Math.floor(Math.random() * 4);
              const nextToIdx = 7 + Math.floor(Math.random() * 2);
              sig.start = step === 1 ? neuralNodes[fromIdx] : neuralNodes[toIdx];
              sig.end = step === 1 ? neuralNodes[toIdx] : neuralNodes[nextToIdx];
            }

            const pStart = worldToScreen(sig.start.x, sig.start.y);
            const pEnd = worldToScreen(sig.end.x, sig.end.y);
            const px = pStart.x + (pEnd.x - pStart.x) * sig.progress;
            const py = pStart.y + (pEnd.y - pStart.y) * sig.progress;

            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#4499ff";
            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Draw nodes
          neuralNodes.forEach((node, idx) => {
            const pos = worldToScreen(node.x, node.y);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 4.5 * camera.currentScale, 0, Math.PI * 2);
            ctx.fillStyle = idx < 3 ? "#0071E3" : idx < 7 ? "#4499ff" : "#ffffff";
            ctx.strokeStyle = "#030308";
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
          });

          ctx.restore();
        }

        // PAGE: Skills "/skills" (Logic diagram / matrix pattern)
        if (location === "/skills" || Math.abs(camera.targetX - 300) < 10) {
          const skillsCenter = worldToScreen(-300, -250);
          ctx.save();
          // Render a simple digital logic tree diagram in background
          ctx.strokeStyle = "rgba(0, 113, 227, 0.12)";
          ctx.lineWidth = 1.2;

          const drawGate = (sx: number, sy: number, type: string) => {
            ctx.fillStyle = "rgba(3, 3, 8, 0.9)";
            ctx.beginPath();
            ctx.rect(sx - 20, sy - 12, 40, 24);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "8px monospace";
            ctx.fillText(type, sx - 10, sy + 3);
          };

          const p1 = worldToScreen(-400, -200);
          const p2 = worldToScreen(-300, -200);
          const p3 = worldToScreen(-200, -200);
          const pMid1 = worldToScreen(-350, -150);
          const pMid2 = worldToScreen(-250, -150);
          const pOut = worldToScreen(-300, -100);

          // Lines
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y); ctx.lineTo(pMid1.x, pMid1.y);
          ctx.moveTo(p2.x, p2.y); ctx.lineTo(pMid1.x, pMid1.y);
          ctx.moveTo(p2.x, p2.y); ctx.lineTo(pMid2.x, pMid2.y);
          ctx.moveTo(p3.x, p3.y); ctx.lineTo(pMid2.x, pMid2.y);
          ctx.moveTo(pMid1.x, pMid1.y); ctx.lineTo(pOut.x, pOut.y);
          ctx.moveTo(pMid2.x, pMid2.y); ctx.lineTo(pOut.x, pOut.y);
          ctx.stroke();

          // Gate boxes
          drawGate(pMid1.x, pMid1.y, "AND");
          drawGate(pMid2.x, pMid2.y, "OR");
          drawGate(pOut.x, pOut.y, "XOR");

          // Inputs
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.font = "9px monospace";
          ctx.fillText("A", p1.x - 4, p1.y - 6);
          ctx.fillText("B", p2.x - 4, p2.y - 6);
          ctx.fillText("C", p3.x - 4, p3.y - 6);
          ctx.fillText("X", pOut.x - 4, pOut.y + 22);

          ctx.restore();
        }

        // PAGE: Projects "/projects" (Geometry and blueprints)
        if (location === "/projects" || Math.abs(camera.targetY - (-450)) < 10) {
          const projCenter = worldToScreen(0, 450);
          ctx.save();
          // Draw geometric triangle + circle blueprints
          ctx.strokeStyle = "rgba(0, 113, 227, 0.25)";
          ctx.lineWidth = 1.2;

          const size = 65 * camera.currentScale;

          // Draw Right Triangle
          ctx.beginPath();
          const tx1 = projCenter.x - size, ty1 = projCenter.y + size;
          const tx2 = projCenter.x + size, ty2 = projCenter.y + size;
          const tx3 = projCenter.x + size, ty3 = projCenter.y - size;
          
          ctx.moveTo(tx1, ty1);
          ctx.lineTo(tx2, ty2);
          ctx.lineTo(tx3, ty3);
          ctx.closePath();
          ctx.stroke();

          // Helper circle
          ctx.strokeStyle = "rgba(68, 153, 255, 0.08)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(projCenter.x, projCenter.y, size * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Side Labels
          ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
          ctx.font = "10px monospace";
          ctx.fillText("θ", tx1 + 30, ty1 - 10);
          ctx.fillText("a", projCenter.x, ty1 + 14);
          ctx.fillText("b", tx2 + 10, projCenter.y);
          ctx.fillText("c = √(a²+b²)", projCenter.x - size/2 - 15, projCenter.y - 10);

          ctx.restore();
        }

        // PAGE: Experience "/experience" (Plotting data scatter & regression lines & bell curve)
        if (location === "/experience" || Math.abs(camera.targetX - (-450)) < 10) {
          const expCenter = worldToScreen(450, -200);
          ctx.save();

          const w = 180 * camera.currentScale;
          const h = 80 * camera.currentScale;

          // Gaussian Bell curve
          ctx.beginPath();
          ctx.moveTo(expCenter.x - w / 2, expCenter.y);
          const sigma = w / 6 + Math.sin(time) * 4;
          for (let x = -w / 2; x <= w / 2; x += 2) {
            const exponent = -(x * x) / (2 * sigma * sigma);
            const y = -h * Math.exp(exponent);
            ctx.lineTo(expCenter.x + x, expCenter.y + y);
          }
          ctx.lineTo(expCenter.x + w / 2, expCenter.y);
          ctx.closePath();

          const grad = ctx.createLinearGradient(expCenter.x, expCenter.y - h, expCenter.x, expCenter.y);
          grad.addColorStop(0, "rgba(0, 113, 227, 0.18)");
          grad.addColorStop(1, "rgba(0, 113, 227, 0.0)");
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = "rgba(0, 113, 227, 0.4)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          for (let x = -w / 2; x <= w / 2; x += 2) {
            const exponent = -(x * x) / (2 * sigma * sigma);
            const y = -h * Math.exp(exponent);
            if (x === -w / 2) ctx.moveTo(expCenter.x + x, expCenter.y + y);
            else ctx.lineTo(expCenter.x + x, expCenter.y + y);
          }
          ctx.stroke();

          // Scatter points & regression line
          const regressionOffset = expCenter.y + 60 * camera.currentScale;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(expCenter.x - w/2 - 10, regressionOffset);
          ctx.lineTo(expCenter.x + w/2 + 10, regressionOffset);
          ctx.stroke();

          // regression line
          ctx.strokeStyle = "rgba(68, 153, 255, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(expCenter.x - w / 2, regressionOffset + 25 * camera.currentScale);
          ctx.lineTo(expCenter.x + w / 2, regressionOffset - 25 * camera.currentScale);
          ctx.stroke();

          // Dots
          ctx.fillStyle = "#ffffff";
          const dotOffsets = [
            { dx: -70, dy: 30 }, { dx: -50, dy: 10 }, { dx: -30, dy: 20 },
            { dx: -10, dy: -5 }, { dx: 10, dy: 5 }, { dx: 30, dy: -20 },
            { dx: 50, dy: -10 }, { dx: 70, dy: -35 }
          ];
          dotOffsets.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(expCenter.x + pt.dx * camera.currentScale, regressionOffset + pt.dy * camera.currentScale, 2.5 * camera.currentScale, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        }

        // PAGE: Education "/education" (Golden spiral coordinates & Venn diagrams)
        if (location === "/education" || Math.abs(camera.targetX - 400) < 10) {
          const eduCenter = worldToScreen(-400, 350);
          ctx.save();

          // Draw Logarithmic Golden Spiral exact calculation
          ctx.strokeStyle = "rgba(0, 113, 227, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();

          const a = 1.5;
          const b = 0.3063489; // ln(phi)/(pi/2)
          
          let movingTheta = time * 0.2;
          
          for (let theta = 0; theta < Math.PI * 7; theta += 0.04) {
            // Apply slight sinusoidal breathing
            const r = a * Math.exp(b * theta) * camera.currentScale * (1 + 0.02 * Math.sin(theta * 2 - time * 2));
            const sx = eduCenter.x + r * Math.cos(theta + movingTheta);
            const sy = eduCenter.y + r * Math.sin(theta + movingTheta);
            
            if (theta === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();

          // Helper circle/arcs
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.beginPath();
          ctx.arc(eduCenter.x, eduCenter.y, 100 * camera.currentScale, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        }

        // PAGE: Contact "/contact" (Radiating signals and concentric communications waves)
        if (location === "/contact" || Math.abs(camera.targetX - (-100)) < 10) {
          const contactCenter = worldToScreen(100, -120);
          ctx.save();

          // Concentric wireless radiating circles
          for (let r = 20; r < 140; r += 30) {
            const pulseR = (r + time * 35) % 130;
            const alpha = Math.max(0, 1 - pulseR / 130);
            ctx.strokeStyle = `rgba(0, 113, 227, ${alpha * 0.35})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(contactCenter.x, contactCenter.y, pulseR * camera.currentScale, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Node center dot
          ctx.beginPath();
          ctx.arc(contactCenter.x, contactCenter.y, 6.0 * camera.currentScale, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#0071E3";
          ctx.fill();
          ctx.shadowBlur = 0;

          // Waveform line underneath
          ctx.strokeStyle = "rgba(68, 153, 255, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const w = 220 * camera.currentScale;
          const yBase = contactCenter.y + 120 * camera.currentScale;
          for (let x = -w/2; x <= w/2; x += 1.5) {
            const mod = Math.sin(0.015 * x + time * 1.5);
            const dy = 20 * Math.sin(0.05 * x + 3.8 * mod) * camera.currentScale;
            if (x === -w/2) ctx.moveTo(contactCenter.x + x, yBase + dy);
            else ctx.lineTo(contactCenter.x + x, yBase + dy);
          }
          ctx.stroke();

          ctx.restore();
        }

        // 4. DRAW WORLD DRIFTING FORMULAS
        formulas.forEach((f) => {
          const isTargetPage = f.page === location;
          // Interpolate opacity towards 0.0 or 0.35 depending on active page
          const targetOp = isTargetPage ? 0.38 : 0.0;
          f.currentOpacity += (targetOp - f.currentOpacity) * delta * 4.0;

          if (f.currentOpacity > 0.01) {
            const pos = worldToScreen(f.x, f.y);
            ctx.fillStyle = `rgba(255, 255, 255, ${f.currentOpacity})`;
            ctx.font = `${11.5 * camera.currentScale}px monospace`;
            ctx.fillText(f.text, pos.x, pos.y);
          }
        });

        // 5. UPDATE AND DRAW DRIFTING NETWORK PARTICLES
        particles.forEach((p) => {
          // Drifting
          p.x += p.vx * delta;
          p.y += p.vy * delta;

          // Boundary wraps (in world coordinates relative to size)
          const bound = 800;
          if (p.x < -bound) p.x = bound;
          if (p.x > bound) p.x = -bound;
          if (p.y < -bound) p.y = bound;
          if (p.y > bound) p.y = -bound;

          const screenPos = worldToScreen(p.x, p.y);

          // Draw particle
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, p.radius * camera.currentScale, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 113, 227, 0.45)";
          ctx.fill();
        });

        // Draw connections between nearby particles (within 115px)
        ctx.strokeStyle = "rgba(0, 113, 227, 0.075)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          const pi = worldToScreen(particles[i].x, particles[i].y);
          if (pi.x < 0 || pi.x > width || pi.y < 0 || pi.y > height) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const pj = worldToScreen(particles[j].x, particles[j].y);
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 115) {
              const alpha = (1 - dist / 115) * 0.08 * camera.currentScale;
              ctx.strokeStyle = `rgba(0, 113, 227, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }

          // Connect to cursor if active
          if (mouse.active) {
            const dx = pi.x - mouse.smoothX;
            const dy = pi.y - mouse.smoothY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 135) {
              const alpha = (1 - dist / 135) * 0.16 * camera.currentScale;
              ctx.strokeStyle = `rgba(68, 153, 255, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(mouse.smoothX, mouse.smoothY);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isIntroPlaying, onIntroComplete]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full bg-[#030308]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
