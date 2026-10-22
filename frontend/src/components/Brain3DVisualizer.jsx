import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Brain, Activity, Zap, Play, RotateCcw, Info, ArrowRight } from 'lucide-react';

export const Brain3DVisualizer = ({ onSelectTest, compact = false }) => {
  const canvasRef = useRef(null);
  const { t } = useLanguage();
  const [selectedLobe, setSelectedLobe] = useState('temporal');
  const [isRotating, setIsRotating] = useState(true);
  const [synapsesActive, setSynapsesActive] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });

  // 3D Rotation angles
  const rotRef = useRef({ x: 0.3, y: 0.8 });

  // Anatomical definitions with 3D centroids and colors
  const lobesConfig = {
    frontal: {
      id: 'frontal',
      name: t.brain3D.lobes.frontal.name,
      function: t.brain3D.lobes.frontal.function,
      desc: t.brain3D.lobes.frontal.description,
      testName: t.brain3D.lobes.frontal.associatedTests,
      testKey: 'flexibility',
      color: '#A855F7', // Violet
      centroid: { x: 0, y: 0.3, z: 0.7 }
    },
    temporal: {
      id: 'temporal',
      name: t.brain3D.lobes.temporal.name,
      function: t.brain3D.lobes.temporal.function,
      desc: t.brain3D.lobes.temporal.description,
      testName: t.brain3D.lobes.temporal.associatedTests,
      testKey: 'memory',
      color: '#06B6D4', // Teal/Cyan
      centroid: { x: 0.65, y: -0.2, z: 0.1 }
    },
    parietal: {
      id: 'parietal',
      name: t.brain3D.lobes.parietal.name,
      function: t.brain3D.lobes.parietal.function,
      desc: t.brain3D.lobes.parietal.description,
      testName: t.brain3D.lobes.parietal.associatedTests,
      testKey: 'attention',
      color: '#F59E0B', // Amber
      centroid: { x: 0, y: 0.65, z: -0.2 }
    },
    occipital: {
      id: 'occipital',
      name: t.brain3D.lobes.occipital.name,
      function: t.brain3D.lobes.occipital.function,
      desc: t.brain3D.lobes.occipital.description,
      testName: t.brain3D.lobes.occipital.associatedTests,
      testKey: 'visual',
      color: '#10B981', // Emerald
      centroid: { x: 0, y: 0.1, z: -0.85 }
    },
    cerebellum: {
      id: 'cerebellum',
      name: t.brain3D.lobes.cerebellum.name,
      function: t.brain3D.lobes.cerebellum.function,
      desc: t.brain3D.lobes.cerebellum.description,
      testName: t.brain3D.lobes.cerebellum.associatedTests,
      testKey: 'tapping',
      color: '#F43F5E', // Rose
      centroid: { x: 0, y: -0.65, z: -0.5 }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Generate high-density 3D brain particle mesh
    const particles = [];
    const numParticles = 480;

    for (let i = 0; i < numParticles; i++) {
      // Hemisphere distribution with ellipsoidal contours
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      // Brain morphology adjustments (bi-hemispheric fissure and frontal bulb)
      let r = 1.0;
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.sin(phi) * Math.sin(theta);
      let z = Math.cos(phi);

      // Hemisphere separation indentation
      const hemisphereDist = Math.abs(x);
      if (hemisphereDist < 0.12 && y > -0.4) {
        x *= 0.75;
      }

      // Morph into brain shape: wider in parietal, elongated in frontal-occipital
      x *= 0.85;
      y *= 0.75;
      z *= 1.1;

      // Classify into anatomical lobe
      let lobe = 'temporal';
      if (z > 0.35 && y > -0.2) lobe = 'frontal';
      else if (z < -0.4 && y < -0.2) lobe = 'cerebellum';
      else if (z < -0.35) lobe = 'occipital';
      else if (y > 0.3) lobe = 'parietal';
      else lobe = 'temporal';

      particles.push({
        origX: x,
        origY: y,
        origZ: z,
        x, y, z,
        lobe,
        pulseOffset: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    // Neural firing impulses
    const impulses = [];
    for (let i = 0; i < 16; i++) {
      impulses.push({
        sourceIdx: Math.floor(Math.random() * numParticles),
        targetIdx: Math.floor(Math.random() * numParticles),
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Adjust canvas resolution for sharp retina display
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation
      if (isRotating) {
        rotRef.current.y += 0.007;
      }

      const rx = rotRef.current.x;
      const ry = rotRef.current.y;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // Project particles to 2D
      const projected = particles.map(p => {
        // Rotate around Y axis
        const x1 = p.origX * cosY - p.origZ * sinY;
        const z1 = p.origX * sinY + p.origZ * cosY;

        // Rotate around X axis
        const y2 = p.origY * cosX - z1 * sinX;
        const z2 = p.origY * sinX + z1 * cosX;

        // Perspective camera projection
        const cameraDistance = 2.4;
        const fov = cameraDistance / (cameraDistance - z2);
        const px = cx + x1 * scale * fov;
        const py = cy - y2 * scale * fov;

        return {
          ...p,
          px,
          py,
          depth: z2,
          fov
        };
      });

      // Sort by depth for correct 3D rendering order (back to front)
      projected.sort((a, b) => a.depth - b.depth);

      // Draw neural connections/synapses
      if (synapsesActive) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < projected.length; i += 4) {
          const p1 = projected[i];
          for (let j = i + 1; j < Math.min(i + 8, projected.length); j++) {
            const p2 = projected[j];
            const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
            if (dist < 38) {
              const alpha = (1 - dist / 38) * 0.22 * (p1.depth + 1.2);
              const isSelected = p1.lobe === selectedLobe || p2.lobe === selectedLobe;
              ctx.strokeStyle = isSelected
                ? `rgba(6, 182, 212, ${alpha * 2.5})`
                : `rgba(139, 92, 246, ${alpha * 0.7})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }

        // Draw animated synaptic firing pulses
        impulses.forEach(imp => {
          imp.progress += imp.speed;
          if (imp.progress >= 1.0) {
            imp.progress = 0;
            imp.sourceIdx = Math.floor(Math.random() * numParticles);
            imp.targetIdx = Math.floor(Math.random() * numParticles);
          }
          const p1 = projected[imp.sourceIdx % projected.length];
          const p2 = projected[imp.targetIdx % projected.length];
          if (p1 && p2) {
            const ix = p1.px + (p2.px - p1.px) * imp.progress;
            const iy = p1.py + (p2.py - p1.py) * imp.progress;
            const pulseGlow = ctx.createRadialGradient(ix, iy, 0, ix, iy, 6);
            pulseGlow.addColorStop(0, '#67E8F9');
            pulseGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
            ctx.fillStyle = pulseGlow;
            ctx.beginPath();
            ctx.arc(ix, iy, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Draw brain particles
      projected.forEach(p => {
        const isSelected = p.lobe === selectedLobe;
        const baseColor = lobesConfig[p.lobe]?.color || '#8B5CF6';
        const pulse = Math.sin(time * 3 + p.pulseOffset) * 0.25 + 0.75;
        const radius = (isSelected ? 3.4 : 2.2) * (p.fov * 0.8) * (isSelected ? pulse : 1);

        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.8, radius), 0, Math.PI * 2);

        if (isSelected) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = baseColor;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRotating, synapsesActive, selectedLobe]);

  // Mouse drag handlers for interactive 3D rotation
  const handleMouseDown = (e) => {
    setIsRotating(false);
    setMousePos({
      isDown: true,
      lastX: e.clientX,
      lastY: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (!mousePos.isDown) return;
    const deltaX = e.clientX - mousePos.lastX;
    const deltaY = e.clientY - mousePos.lastY;

    rotRef.current.y += deltaX * 0.008;
    rotRef.current.x = Math.max(-0.9, Math.min(0.9, rotRef.current.x + deltaY * 0.008));

    setMousePos(prev => ({
      ...prev,
      lastX: e.clientX,
      lastY: e.clientY
    }));
  };

  const handleMouseUp = () => {
    setMousePos(prev => ({ ...prev, isDown: false }));
  };

  const currentLobeData = lobesConfig[selectedLobe] || lobesConfig.temporal;

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-neuro-navy/95 via-neuro-deep/90 to-neuro-card/90 border border-neuro-border/60 p-4 sm:p-6 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-neuro-teal/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-neuro-purple/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Top Header & Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neuro-border/40 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neuro-teal/20 border border-neuro-teal/40 text-neuro-teal">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {t.brain3D.title}
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
                Interactive 3D
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {t.brain3D.rotateHint}
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              isRotating
                ? 'bg-neuro-teal/20 text-neuro-teal border-neuro-teal/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <Play className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            {isRotating ? 'Rotating' : 'Paused'}
          </button>

          <button
            onClick={() => setSynapsesActive(!synapsesActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              synapsesActive
                ? 'bg-neuro-purple/20 text-neuro-purple-light border-neuro-purple/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Neural Synapse Connections"
          >
            <Zap className="w-3.5 h-3.5" />
            Synapses
          </button>

          <button
            onClick={() => {
              rotRef.current = { x: 0.3, y: 0.8 };
              setIsRotating(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-700 transition"
            title="Reset Orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            className="relative w-full aspect-square max-h-[380px] cursor-grab active:cursor-grabbing rounded-xl flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
            />
          </div>

          {/* Lobe Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 w-full">
            {Object.entries(lobesConfig).map(([key, lobe]) => {
              const active = selectedLobe === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedLobe(key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    active
                      ? 'scale-105 shadow-lg shadow-black/50 text-white'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  style={{
                    borderColor: active ? lobe.color : undefined,
                    backgroundColor: active ? `${lobe.color}25` : undefined
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lobe.color }}
                  />
                  {lobe.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lobe Inspection HUD Card */}
        <div className="lg:col-span-5 bg-neuro-dark/80 border border-neuro-border rounded-xl p-5 shadow-xl relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-2 h-full"
            style={{ backgroundColor: currentLobeData.color }}
          />

          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-black font-mono"
              style={{ backgroundColor: currentLobeData.color }}
            >
              Lobe Focus
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {currentLobeData.id}
            </span>
          </div>

          <h4 className="text-xl font-extrabold text-white mb-1">
            {currentLobeData.name}
          </h4>

          <div className="flex items-center gap-1.5 text-neuro-teal text-xs font-medium mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>{currentLobeData.function}</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {currentLobeData.desc}
          </p>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-neuro-border/60 mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-neuro-purple-light" />
              Associated Screening Test:
            </div>
            <div className="text-sm font-bold text-white">
              {currentLobeData.testName}
            </div>
          </div>

          {onSelectTest && (
            <button
              onClick={() => onSelectTest(currentLobeData.testKey)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: currentLobeData.color }}
            >
              <span>Launch {currentLobeData.name.split(' ')[0]} Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
