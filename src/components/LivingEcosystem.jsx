import { useRef, useEffect, useState } from 'react';
import { loadData } from '../utils/storage';
import './LivingEcosystem.css';

// --- Particle class ---
class Particle {
  constructor(canvas, type, ecosystem) {
    this.canvas = canvas;
    this.type = type;
    this.eco = ecosystem;
    this.reset();
  }

  reset() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.type === 'leaf') {
      this.x = Math.random() * w;
      this.y = -10;
      this.size = 4 + Math.random() * 6;
      this.speedY = 0.3 + Math.random() * 0.8;
      this.speedX = -0.5 + Math.random() * 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = 0.01 + Math.random() * 0.03;
      this.opacity = 0.5 + Math.random() * 0.5;
    } else if (this.type === 'firefly') {
      this.x = Math.random() * w;
      this.y = h * 0.4 + Math.random() * (h * 0.4);
      this.size = 2 + Math.random() * 3;
      this.speedX = -0.3 + Math.random() * 0.6;
      this.speedY = -0.3 + Math.random() * 0.6;
      this.pulse = Math.random() * Math.PI * 2;
      this.opacity = 0;
    } else if (this.type === 'smoke') {
      this.x = w * 0.7 + Math.random() * 60;
      this.y = h * 0.45;
      this.size = 8 + Math.random() * 12;
      this.speedY = -0.3 - Math.random() * 0.5;
      this.speedX = 0.1 + Math.random() * 0.3;
      this.opacity = 0.2 + Math.random() * 0.3;
    } else if (this.type === 'bird') {
      this.x = -20;
      this.y = h * 0.15 + Math.random() * (h * 0.2);
      this.speedX = 0.5 + Math.random() * 1;
      this.wingPhase = Math.random() * Math.PI * 2;
      this.size = 6 + Math.random() * 4;
      this.opacity = 0.7;
    }
  }

  update() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.type === 'leaf') {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.3;
      this.rotation += this.rotSpeed;
      if (this.y > h + 10) this.reset();
    } else if (this.type === 'firefly') {
      this.pulse += 0.04;
      this.opacity = 0.3 + Math.sin(this.pulse) * 0.5;
      this.x += this.speedX + Math.sin(this.pulse * 0.7) * 0.3;
      this.y += this.speedY + Math.cos(this.pulse * 0.5) * 0.3;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    } else if (this.type === 'smoke') {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.002;
      this.size += 0.15;
      if (this.opacity <= 0 || this.y < 0) this.reset();
    } else if (this.type === 'bird') {
      this.x += this.speedX;
      this.wingPhase += 0.08;
      if (this.x > w + 20) this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    if (this.type === 'leaf') {
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.eco.health > 0.5 ? '#059669' : '#D97706';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.4, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'firefly') {
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = '#FDE68A';
      ctx.shadowColor = '#FDE68A';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'smoke') {
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = '#6B7280';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'bird') {
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 1.5;
      const wingY = Math.sin(this.wingPhase) * 4;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y + wingY);
      ctx.quadraticCurveTo(this.x - this.size * 0.3, this.y - 2, this.x, this.y);
      ctx.quadraticCurveTo(this.x + this.size * 0.3, this.y - 2, this.x + this.size, this.y + wingY);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// --- Draw functions ---
function drawSky(ctx, w, h, health) {
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  if (health > 0.7) {
    grad.addColorStop(0, '#7DD3FC'); // Clear blue
    grad.addColorStop(1, '#BAE6FD');
  } else if (health > 0.4) {
    grad.addColorStop(0, '#D4A76A'); // Hazy
    grad.addColorStop(1, '#E5DDD3');
  } else {
    grad.addColorStop(0, '#9CA3AF'); // Polluted gray
    grad.addColorStop(1, '#D1D5DB');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.65);
}

function drawSun(ctx, w, health) {
  if (health < 0.3) return; // No sun when polluted
  ctx.save();
  const sunX = w * 0.82;
  const sunY = 50;
  const sunSize = 20 + health * 15;
  ctx.globalAlpha = 0.3 + health * 0.5;
  ctx.fillStyle = '#FBBF24';
  ctx.shadowColor = '#FBBF24';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMountains(ctx, w, h, health) {
  ctx.fillStyle = health > 0.5 ? '#065F46' : '#78716C';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.55);
  ctx.lineTo(w * 0.15, h * 0.3);
  ctx.lineTo(w * 0.3, h * 0.5);
  ctx.lineTo(w * 0.45, h * 0.25);
  ctx.lineTo(w * 0.6, h * 0.5);
  ctx.lineTo(w * 0.75, h * 0.32);
  ctx.lineTo(w * 0.9, h * 0.48);
  ctx.lineTo(w, h * 0.55);
  ctx.lineTo(w, h * 0.65);
  ctx.lineTo(0, h * 0.65);
  ctx.closePath();
  ctx.fill();

  // Snow caps when healthy
  if (health > 0.6) {
    ctx.fillStyle = '#F0FDF4';
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.25);
    ctx.lineTo(w * 0.42, h * 0.31);
    ctx.lineTo(w * 0.48, h * 0.31);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGround(ctx, w, h, health) {
  const grad = ctx.createLinearGradient(0, h * 0.6, 0, h);
  if (health > 0.6) {
    grad.addColorStop(0, '#059669');
    grad.addColorStop(1, '#065F46');
  } else if (health > 0.3) {
    grad.addColorStop(0, '#A3A86E');
    grad.addColorStop(1, '#78716C');
  } else {
    grad.addColorStop(0, '#A8A29E');
    grad.addColorStop(1, '#78716C');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);
}

function drawWater(ctx, w, h, health, time) {
  const waterY = h * 0.72;
  const waterH = h * 0.12;
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = health > 0.5 ? '#0EA5E9' : '#78716C';
  ctx.beginPath();
  ctx.moveTo(w * 0.05, waterY);
  // Gentle wave
  for (let x = w * 0.05; x <= w * 0.45; x += 5) {
    const waveY = waterY + Math.sin((x + time * 40) * 0.03) * 3;
    ctx.lineTo(x, waveY);
  }
  ctx.lineTo(w * 0.45, waterY + waterH);
  ctx.lineTo(w * 0.05, waterY + waterH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx, x, y, size, health, leafCount) {
  // Trunk
  ctx.fillStyle = '#92400E';
  const tw = size * 0.15;
  ctx.fillRect(x - tw / 2, y - size * 0.5, tw, size * 0.5);

  // Leaves
  const leafColor = health > 0.6 ? '#059669' : health > 0.3 ? '#D97706' : '#9CA3AF';
  ctx.fillStyle = leafColor;
  const layers = Math.max(1, Math.floor(leafCount * 3));
  for (let i = 0; i < layers; i++) {
    const ly = y - size * 0.4 - i * size * 0.22;
    const lr = size * (0.35 - i * 0.06);
    ctx.beginPath();
    ctx.arc(x, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTrees(ctx, w, h, health) {
  const treeCount = Math.floor(2 + health * 8);
  const positions = [0.12, 0.22, 0.35, 0.52, 0.62, 0.72, 0.82, 0.88, 0.15, 0.95];
  for (let i = 0; i < treeCount; i++) {
    const tx = w * positions[i % positions.length];
    const ty = h * (0.6 + Math.random() * 0.08);
    const size = 30 + Math.random() * 30;
    drawTree(ctx, tx, ty, size, health, health);
  }
}

function drawFlowers(ctx, w, h, health) {
  if (health < 0.5) return;
  const count = Math.floor(health * 12);
  const colors = ['#F472B6', '#FBBF24', '#A78BFA', '#FB923C', '#34D399'];
  for (let i = 0; i < count; i++) {
    const fx = w * 0.08 + Math.random() * w * 0.84;
    const fy = h * 0.64 + Math.random() * (h * 0.15);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(fx, fy, 3 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
    // Stem
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 3);
    ctx.lineTo(fx, fy + 10);
    ctx.stroke();
  }
}

function drawFactory(ctx, w, h, health) {
  if (health > 0.6) return; // No factory when green
  ctx.fillStyle = '#4B5563';
  const fx = w * 0.7;
  const fy = h * 0.45;
  // Building
  ctx.fillRect(fx, fy, 40, h * 0.6 - fy);
  // Chimney
  ctx.fillRect(fx + 10, fy - 25, 12, 25);
  ctx.fillRect(fx + 28, fy - 18, 10, 18);
}

function drawClouds(ctx, w, h, health, time) {
  const cloudCount = health > 0.5 ? 3 : 5;
  ctx.save();
  ctx.globalAlpha = health > 0.5 ? 0.6 : 0.8;
  ctx.fillStyle = health > 0.5 ? '#FFFFFF' : '#9CA3AF';
  for (let i = 0; i < cloudCount; i++) {
    const cx = ((i * w * 0.3 + time * 15 * (i + 1) * 0.3) % (w + 100)) - 50;
    const cy = h * (0.1 + i * 0.08);
    const cs = 25 + i * 10;
    ctx.beginPath();
    ctx.arc(cx, cy, cs, 0, Math.PI * 2);
    ctx.arc(cx + cs * 0.8, cy - cs * 0.2, cs * 0.7, 0, Math.PI * 2);
    ctx.arc(cx + cs * 1.3, cy, cs * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawStatusLabel(ctx, w, health) {
  ctx.save();
  ctx.font = '600 13px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  let label, color, bg;
  if (health > 0.7) { label = '🌿 Thriving Ecosystem'; color = '#065F46'; bg = '#D1FAE5'; }
  else if (health > 0.4) { label = '🌤️ Recovering'; color = '#92400E'; bg = '#FEF3C7'; }
  else { label = '🏭 Stressed Ecosystem'; color = '#991B1B'; bg = '#FEE2E2'; }

  const metrics = ctx.measureText(label);
  const px = 16, py = 16, pad = 8;
  ctx.fillStyle = bg;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.roundRect(px, py, metrics.width + pad * 2, 28, 8);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(label, px + pad, py + 19);
  ctx.restore();
}

// --- Main Component ---
export default function LivingEcosystem() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const [health, setHealth] = useState(0.5);

  useEffect(() => {
    const data = loadData();
    const hasFootprint = data.footprintHistory.length > 0;
    if (!hasFootprint) {
      setHealth(0.5);
      return;
    }

    const latest = data.footprintHistory[data.footprintHistory.length - 1];
    const total = latest.total;
    // Map: 0t = 1.0 health, 15t+ = 0.0 health
    const h = Math.max(0, Math.min(1, 1 - total / 15));

    // Boost health based on daily actions logged
    const today = new Date().toISOString().split('T')[0];
    const todayActions = data.dailyActions[today] || [];
    const actionBonus = Math.min(todayActions.length * 0.03, 0.15);

    setHealth(Math.min(1, h + actionBonus));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles based on health
    const particles = [];
    const eco = { health };

    // Leaves (more when healthy)
    const leafCount = Math.floor(health * 15) + 3;
    for (let i = 0; i < leafCount; i++) {
      particles.push(new Particle(canvas, 'leaf', eco));
    }

    // Fireflies (only when healthy)
    if (health > 0.5) {
      for (let i = 0; i < Math.floor(health * 8); i++) {
        particles.push(new Particle(canvas, 'firefly', eco));
      }
    }

    // Smoke (only when unhealthy)
    if (health < 0.5) {
      for (let i = 0; i < Math.floor((1 - health) * 10); i++) {
        particles.push(new Particle(canvas, 'smoke', eco));
      }
    }

    // Birds (only when healthy)
    if (health > 0.6) {
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(canvas, 'bird', eco));
      }
    }

    particlesRef.current = particles;

    let startTime = Date.now();

    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const time = (Date.now() - startTime) / 1000;

      ctx.clearRect(0, 0, w, h);

      // Draw scene layers
      drawSky(ctx, w, h, health);
      drawSun(ctx, w, health);
      drawClouds(ctx, w, h, health, time);
      drawMountains(ctx, w, h, health);
      drawGround(ctx, w, h, health);
      drawWater(ctx, w, h, health, time);
      drawFactory(ctx, w, h, health);
      drawTrees(ctx, w, h, health);
      drawFlowers(ctx, w, h, health);

      // Draw + update particles
      for (const p of particlesRef.current) {
        p.update();
        p.draw(ctx);
      }

      drawStatusLabel(ctx, w, health);

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [health]);

  return (
    <div className="ecosystem-wrapper fade-up">
      <canvas ref={canvasRef} className="ecosystem-canvas" />
      <div className="ecosystem-caption">
        <span className="ecosystem-caption-icon">🌍</span>
        <span>Your living world — it reacts to your footprint and daily actions</span>
      </div>
    </div>
  );
}
