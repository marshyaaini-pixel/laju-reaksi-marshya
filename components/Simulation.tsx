import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  reacted: boolean;
}

const Simulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temperature, setTemperature] = useState(50); // 1-100
  const [concentration, setConcentration] = useState(20); // Number of particles
  const [reactedCount, setReactedCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  
  // Simulation state refs to avoid closure staleness in animation loop
  const particlesRef = useRef<Particle[]>([]);
  const reqIdRef = useRef<number>(0);

  const initParticles = () => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    const newParticles: Particle[] = [];
    
    // Speed multiplier based on temperature
    const speedBase = (temperature / 20) + 0.5;

    for (let i = 0; i < concentration; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedBase * 2,
        vy: (Math.random() - 0.5) * speedBase * 2,
        radius: 6,
        color: '#3b82f6', // Blue (Unreacted)
        reacted: false
      });
    }
    particlesRef.current = newParticles;
    setReactedCount(0);
  };

  const update = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    // Physics Update
    const particles = particlesRef.current;
    
    // Check collisions
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < p1.radius + p2.radius) {
          // Simple elastic collision response (reverse velocities)
          // In a real physics engine this is more complex, but this suffices for visual
          const tempVx = p1.vx;
          const tempVy = p1.vy;
          p1.vx = p2.vx;
          p1.vy = p2.vy;
          p2.vx = tempVx;
          p2.vy = tempVy;

          // Reaction Logic: High temp = High Energy = Reaction
          // Threshold is arbitrary for demo
          if (temperature > 60 && (!p1.reacted || !p2.reacted)) {
            p1.reacted = true;
            p1.color = '#ef4444'; // Red (Reacted)
            p2.reacted = true;
            p2.color = '#ef4444';
          }
        }
      }
    }

    // Movement & Boundary
    let currentReacted = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < p.radius || p.x > width - p.radius) p.vx *= -1;
      if (p.y < p.radius || p.y > height - p.radius) p.vy *= -1;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.closePath();

      if (p.reacted) currentReacted++;
    });

    setReactedCount(currentReacted);

    if (isRunning) {
      reqIdRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concentration]); // Re-init on concentration change

  // Handle temp change without resetting positions, just speed
  useEffect(() => {
    const speedBase = (temperature / 20) + 0.5;
    particlesRef.current.forEach(p => {
      // Normalize and rescale
      const mag = Math.sqrt(p.vx*p.vx + p.vy*p.vy) || 1;
      p.vx = (p.vx / mag) * speedBase * (Math.random() + 0.5);
      p.vy = (p.vy / mag) * speedBase * (Math.random() + 0.5);
    });
  }, [temperature]);

  useEffect(() => {
    if (isRunning) {
      reqIdRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(reqIdRef.current);
    }
    return () => cancelAnimationFrame(reqIdRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Simulasi Tumbukan Partikel</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative border rounded-lg overflow-hidden bg-slate-50">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={300} 
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-mono">
            Produk: {reactedCount} / {concentration}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suhu (Energi Kinetik)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dingin</span>
              <span>Panas</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {temperature > 60 ? "Cukup energi untuk reaksi!" : "Energi belum cukup untuk reaksi efektif."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konsentrasi (Jumlah Partikel)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={concentration}
              onChange={(e) => setConcentration(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rendah</span>
              <span>Tinggi</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isRunning 
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Jeda' : 'Mulai'}
            </button>
            <button
              onClick={initParticles}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
