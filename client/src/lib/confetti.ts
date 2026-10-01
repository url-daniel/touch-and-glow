// Lightweight, high-performance luxury particle confetti for cart interactions

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

const LUXURY_PALETTE = [
  "#C98F76", // Clay
  "#E8A87C", // Peach Gold
  "#A86B52", // Terracotta
  "#F0D9CE", // Blush
  "#FBF5EF", // Cream Ivory
  "#D4AF37", // Warm Gold
  "#E07A5F"  // Coral
];

export function fireCartConfetti(originX?: number, originY?: number) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const startX = originX ?? width * 0.85;
  const startY = originY ?? height * 0.15;

  const particles: Particle[] = [];
  const particleCount = 65;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
    const speed = Math.random() * 8 + 4;
    const shapes: ("rect" | "circle" | "star")[] = ["rect", "rect", "circle", "star"];

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
      vy: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4) - 2.5,
      size: Math.random() * 7 + 4,
      color: LUXURY_PALETTE[Math.floor(Math.random() * LUXURY_PALETTE.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    });
  }

  let animationFrameId: number;
  const gravity = 0.22;
  const drag = 0.96;
  const startTime = Date.now();
  const duration = 2200; // 2.2 seconds

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration || particles.length === 0) {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / duration);

      if (ctx) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw tiny 4-point star sparkle
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
}
