import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Scene, FogExp2, PerspectiveCamera, WebGLRenderer, Color, BufferGeometry, BufferAttribute, PointsMaterial, Points, AmbientLight, PointLight, Clock, AdditiveBlending } from 'three';
import { useTelemetry } from '../../context/TelemetryContext';

export const AquaSentinel3DRiver: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { data } = useTelemetry();
  const evaluation = data?.evaluation;
  const avgWqi = evaluation?.average_wqi ?? 80;
  const status = evaluation?.overall_status || 'HEALTHY';

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep refs of telemetry data to access inside the Three.js render loop without re-running useEffect
  const telemetryRef = useRef({ status, avgWqi });
  useEffect(() => {
    telemetryRef.current = { status, avgWqi };
  }, [status, avgWqi]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- SETUP THREE.JS SCENE ---
    const scene = new Scene();
    scene.fog = new FogExp2(0x02050e, 0.015); // Deep abyss dark backdrop match

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // --- CREATE PARTICLES (Increased density for ultra premium look) ---
    const particleCount = 4500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Custom arrays for multi-layered current flows
    const randomOffsets = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    // Color definitions
    const colorHealthy = new Color(0x00f2fe); // Electric Bioluminescent Cyan
    const colorWarning = new Color(0xf59e0b); // Amber
    const colorCritical = new Color(0xf43f5e); // Rose

    for (let i = 0; i < particleCount; i++) {
      // Flow along X axis (from -50 to 50)
      const x = (Math.random() - 0.5) * 100;
      
      // Spread across width on Z axis (from -30 to 30)
      const zDist = Math.pow(Math.random() - 0.5, 3) * 60;
      
      // Elevation Y
      const y = (Math.random() - 0.5) * 3;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = zDist;

      // Initial color
      const color = colorHealthy.clone();
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random offsets for individual wave motions
      randomOffsets[i] = Math.random() * Math.PI * 2;
      
      // Particle flow speed coefficient: 80% surface currents, 20% deep background
      if (Math.random() > 0.25) {
        particleSpeeds[i] = 0.75 + Math.random() * 0.5; // Fast surface flow
        sizes[i] = 0.9 + Math.random() * 2.0;
      } else {
        particleSpeeds[i] = 0.25 + Math.random() * 0.25; // Slow deep flow
        sizes[i] = 0.4 + Math.random() * 0.7;
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.setAttribute('size', new BufferAttribute(sizes, 1));

    // Custom material with blending
    const material = new PointsMaterial({
      size: 0.75,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new Points(geometry, material);
    scene.add(particleSystem);

    // --- LIGHTS ---
    const ambientLight = new AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const pointLight = new PointLight(0x00f2fe, 1.4, 100);
    pointLight.position.set(0, 25, 15);
    scene.add(pointLight);

    // --- MOUSE PARALLAX SETUP ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 12;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- SCROLL PARALLAX SETUP ---
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- RENDER LOOP ---
    const clock = new Clock();
    const currentColor = colorHealthy.clone();
    const targetColor = colorHealthy.clone();
    
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const telemetry = telemetryRef.current;

      // Update target color
      if (telemetry.status === 'CRITICAL') {
        targetColor.copy(colorCritical);
      } else if (telemetry.status === 'WARNING') {
        targetColor.copy(colorWarning);
      } else {
        targetColor.copy(colorHealthy);
      }

      // Smoothly interpolate the color over time
      currentColor.lerp(targetColor, 0.05);

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Animate Camera
      camera.position.x = mouseX;
      camera.position.y = 15 - mouseY + (scrollY * 0.015);
      camera.position.z = 35 + (scrollY * 0.01);
      camera.lookAt(0, -scrollY * 0.005, 0);

      // Dynamic flow parameters
      const wqiNorm = Math.max(0, Math.min(100, telemetry.avgWqi));
      const speedFactor = 1.0 + (100 - wqiNorm) * 0.04; 
      const amplitudeFactor = 0.5 + (100 - wqiNorm) * 0.025;

      // Update particle positions and colors
      const positionAttr = geometry.getAttribute('position') as BufferAttribute;
      const colorAttr = geometry.getAttribute('color') as BufferAttribute;
      const posArray = positionAttr.array as Float32Array;
      const colArray = colorAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const x = posArray[i * 3];
        const z = posArray[i * 3 + 2];
        const offset = randomOffsets[i];
        const currentSpeedCoeff = particleSpeeds[i];

        // Layered sinusoidal current calculations
        const wave1 = Math.sin(x * 0.07 + time * 0.8 * speedFactor * currentSpeedCoeff + offset) * 2.4 * amplitudeFactor;
        const wave2 = Math.cos(z * 0.1 + time * 1.1 * speedFactor * currentSpeedCoeff) * 1.6 * amplitudeFactor;
        const wave3 = Math.sin((x + z) * 0.03 - time * 0.4) * 0.8;
        
        posArray[i * 3 + 1] = wave1 + wave2 + wave3;

        // Apply smooth color gradient along the river
        const ratio = (x + 50) / 100; // 0 to 1 along river length
        const particleColor = currentColor.clone();
        
        if (telemetry.status !== 'HEALTHY') {
          particleColor.lerp(
            telemetry.status === 'CRITICAL' ? colorCritical : colorWarning, 
            ratio * 0.65
          );
        } else {
          const tealColor = new Color(0x06b6d4);
          particleColor.lerp(tealColor, ratio * 0.45);
        }

        colArray[i * 3] = particleColor.r;
        colArray[i * 3 + 1] = particleColor.g;
        colArray[i * 3 + 2] = particleColor.b;
      }

      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Slow drift
      particleSystem.rotation.y = time * 0.012 * speedFactor;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`fixed inset-0 w-full h-full -z-10 bg-[#070b16] ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Solid dark overlay matching theme */}
      <div className="absolute inset-0 pointer-events-none bg-[#070b16]/40" />
      
      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  status === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' :
                  status === 'WARNING' ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' :
                  'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                }`} />
                <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${
                  status === 'CRITICAL' ? 'bg-rose-500' :
                  status === 'WARNING' ? 'bg-amber-500' :
                  'bg-emerald-500'
                } animate-ping opacity-45`} />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Periyar River Basin</p>
                <p className="text-xs font-semibold text-white/50">88 km Transect · Kerala, India</p>
              </div>
            </div>
            {avgWqi !== null && (
              <div className="text-right">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Basin Average WQI</p>
                <p className="text-base font-bold font-mono text-white/80">{avgWqi.toFixed(1)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="absolute bottom-2 right-4 pointer-events-none select-none">
        <span className="text-[6px] text-white/5">Simulated 3D Volumetric Currents v2.4</span>
      </div>
    </div>
  );
};
