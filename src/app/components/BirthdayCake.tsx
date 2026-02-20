"use client";

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ── Color map for GLB node names ── */
const MATERIAL_COLORS: Record<string, { color: string; emissive?: string; emissiveIntensity?: number; roughness?: number }> = {
  // Cake body
  "Cylinder.002": { color: "#F5A9C4", roughness: 0.4 },     // Pink icing top
  "Cylinder": { color: "#FFE4B5", roughness: 0.6 },          // Cream sponge
  "Cube.001": { color: "#FFDEAD", roughness: 0.5 },          // Plate / base

  // Candle bodies (Cylinder.001 through Cylinder.010)
  "Cylinder.001": { color: "#FF6B6B", roughness: 0.3 },
  "Cylinder.003": { color: "#4ECDC4", roughness: 0.3 },
  "Cylinder.004": { color: "#FFE66D", roughness: 0.3 },
  "Cylinder.005": { color: "#A78BFA", roughness: 0.3 },
  "Cylinder.006": { color: "#FF6B6B", roughness: 0.3 },
  "Cylinder.007": { color: "#4ECDC4", roughness: 0.3 },
  "Cylinder.008": { color: "#FFE66D", roughness: 0.3 },
  "Cylinder.009": { color: "#A78BFA", roughness: 0.3 },
  "Cylinder.010": { color: "#FF6B6B", roughness: 0.3 },

  // Candle flames (Cone nodes)
  "Cone.001": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.002": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.003": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.004": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.005": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.006": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.007": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.008": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
};

/* ── Procedural Candle with realistic flame glow ── */
function Candle({ position, color, lit }: { position: [number, number, number]; color: string; lit: boolean }) {
  const flameGroupRef = useRef<THREE.Group>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!flameGroupRef.current) return;
    if (!lit) {
      flameGroupRef.current.visible = false;
      return;
    }
    flameGroupRef.current.visible = true;

    const t = Date.now() * 0.001;
    const seed = position[0] * 137.5 + position[2] * 73.1;

    // Multi-frequency flicker for realistic flame
    const flicker1 = Math.sin(t * 8 + seed) * 0.12;
    const flicker2 = Math.sin(t * 13 + seed * 2.3) * 0.08;
    const flicker3 = Math.sin(t * 21 + seed * 0.7) * 0.05;
    const flicker = flicker1 + flicker2 + flicker3;

    // Scale the inner flame
    const scaleY = 1 + flicker;
    const scaleXZ = 1 + flicker * 0.4;
    flameGroupRef.current.scale.set(scaleXZ, scaleY, scaleXZ);

    // Sway slightly
    flameGroupRef.current.rotation.z = Math.sin(t * 5 + seed) * 0.06;

    // Pulse the outer glow
    if (outerGlowRef.current) {
      const glowPulse = 1 + Math.sin(t * 6 + seed) * 0.2;
      outerGlowRef.current.scale.setScalar(glowPulse);
    }

    // Flicker the light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 0.6 + flicker * 2;
    }
  });

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Flame group — animated together */}
      <group ref={flameGroupRef} position={[0, 0.37, 0]}>
        {/* Outer glow (large, soft, transparent) */}
        <mesh ref={outerGlowRef}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.15} />
        </mesh>
        {/* Mid glow */}
        <mesh>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color="#FF8C00" transparent opacity={0.4} />
        </mesh>
        {/* Flame core (bright teardrop shape — elongated sphere) */}
        <mesh scale={[0.7, 1.3, 0.7]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial
            color="#FFCC00"
            emissive="#FFA500"
            emissiveIntensity={5}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Hot white center */}
        <mesh scale={[0.4, 0.8, 0.4]} position={[0, -0.005, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Flame point light — warm glow */}
      {lit && (
        <pointLight ref={lightRef} position={[0, 0.42, 0]} color="#FF9933" intensity={0.6} distance={1.8} decay={2} />
      )}
    </group>
  );
}

/* ── GLB Cake Model ── */
function CakeModel({ candleLit }: { candleLit: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const flameRefs = useRef<THREE.Object3D[]>([]);

  // Load GLB model
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/cake.glb",
      (gltf) => {
        const loadedScene = gltf.scene;
        flameRefs.current = [];

        // Auto-scale: measure bounding box, scale to fit ~2 units
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim;
        loadedScene.scale.setScalar(scale);

        // Center horizontally, sit on "floor"
        loadedScene.position.set(
          -center.x * scale,
          -box.min.y * scale - 0.6,
          -center.z * scale
        );

        // Apply materials based on node name (parent Object3D name)
        loadedScene.traverse((child) => {
          // Try matching on the object's own name or its parent's name
          const name = child.name;
          const config = MATERIAL_COLORS[name];

          if (child instanceof THREE.Mesh) {
            if (config) {
              child.material = new THREE.MeshStandardMaterial({
                color: config.color,
                roughness: config.roughness ?? 0.5,
                metalness: 0.05,
                emissive: config.emissive ? new THREE.Color(config.emissive) : undefined,
                emissiveIntensity: config.emissiveIntensity ?? 0,
              });
            } else {
              // Check parent name too (GLB nests mesh under node)
              const parentConfig = child.parent ? MATERIAL_COLORS[child.parent.name] : undefined;
              if (parentConfig) {
                child.material = new THREE.MeshStandardMaterial({
                  color: parentConfig.color,
                  roughness: parentConfig.roughness ?? 0.5,
                  metalness: 0.05,
                  emissive: parentConfig.emissive ? new THREE.Color(parentConfig.emissive) : undefined,
                  emissiveIntensity: parentConfig.emissiveIntensity ?? 0,
                });
              } else {
                // Default cream color
                child.material = new THREE.MeshStandardMaterial({
                  color: "#FFE4C4",
                  roughness: 0.5,
                  metalness: 0.05,
                });
              }
            }
          }

          // Track flame objects (Cone nodes) for animation
          if (name.startsWith("Cone")) {
            flameRefs.current.push(child);
          }
        });

        setModel(loadedScene);
      },
      undefined,
      (error) => {
        console.error("Error loading cake model:", error);
      }
    );
  }, []);

  // Animate flames or hide when blown
  useFrame(() => {
    flameRefs.current.forEach((flame) => {
      flame.visible = candleLit;
      if (candleLit) {
        const flicker = Math.sin(Date.now() * 0.015 + flame.id) * 0.08;
        flame.scale.setScalar(1 + flicker);
      }
    });
  });

  // Candle positions (arranged in a circle on top of the cake)
  const candleColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B"];
  const candlePositions: [number, number, number][] = candleColors.map((_, i) => {
    const angle = (i / candleColors.length) * Math.PI * 2;
    const radius = 0.35;
    return [Math.cos(angle) * radius, 0.45, Math.sin(angle) * radius];
  });

  return (
    <group ref={groupRef}>
      {model && <primitive object={model} />}

      {/* Procedural candles on top */}
      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} color={candleColors[i]} lit={candleLit} />
      ))}

      {/* "Happy Birthday" text on top */}
      <Text
        position={[0, 0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.14}
        color="#8B0000"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        textAlign="center"
      >
        Happy Birthday
      </Text>

      {/* Warm point light from candles */}
      {candleLit && (
        <pointLight position={[0, 1.5, 0]} color="#FF9933" intensity={4} distance={5} decay={2} />
      )}
    </group>
  );
}

/* ── 3D Scene ── */
function CakeScene({ candleLit }: { candleLit: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.5} />
      <directionalLight position={[0, -1, 3]} intensity={0.3} />

      <CakeModel candleLit={candleLit} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </>
  );
}

/* ── Blow Detector ── */
function useBlowDetector(onBlow: () => void, enabled: boolean) {
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        let blowFrames = 0;

        const detect = () => {
          if (cancelled) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          if (avg > 45) {
            blowFrames++;
            if (blowFrames > 12) {
              onBlow();
              return;
            }
          } else {
            blowFrames = Math.max(0, blowFrames - 1);
          }
          rafRef.current = requestAnimationFrame(detect);
        };
        detect();
      } catch {
        // Mic denied — fallback button handles it
      }
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [enabled, onBlow]);
}

/* ── Loading Spinner ── */
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="w-12 h-12 rounded-full border-2 border-t-transparent"
        style={{
          borderColor: "rgba(251,191,36,0.3)",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
        Loading cake...
      </p>
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Main Component ── */
interface BirthdayCakeProps {
  onComplete: () => void;
}

export default function BirthdayCake({ onComplete }: BirthdayCakeProps) {
  const [candleLit, setCandleLit] = useState(true);
  const [micGranted, setMicGranted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [blown, setBlown] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background music
  useEffect(() => {
    const audio = new Audio("/happy_birthday_tune.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const ensureMusic = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleBlow = useCallback(() => {
    if (!candleLit) return;
    setCandleLit(false);
    setBlown(true);
  }, [candleLit]);

  useBlowDetector(handleBlow, micGranted && candleLit);

  const requestMic = useCallback(async () => {
    setShowPrompt(false);
    ensureMusic();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicGranted(true);
    } catch {
      setMicGranted(false);
    }
  }, [ensureMusic]);

  // After blow: show message, then trigger celebration with confetti
  useEffect(() => {
    if (!blown) return;
    // Fade out music
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 100);
    }
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, [blown, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(7,5,16,0.97)" }}
      onClick={ensureMusic}
    >
      {/* 3D Cake */}
      <div style={{ width: "min(90vw, 650px)", height: "min(55vh, 480px)" }}>
        {!canvasReady && <LoadingFallback />}
        <div style={{ width: "100%", height: "100%", opacity: canvasReady ? 1 : 0, transition: "opacity 0.5s ease" }}>
          <Canvas
            camera={{ position: [0, 3, 3.5], fov: 42 }}
            dpr={[1, 2]}
            gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              setCanvasReady(true);
            }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <CakeScene candleLit={candleLit} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Mic prompt */}
      {showPrompt && (
        <div className="flex flex-col items-center gap-4 mt-4 card-text-reveal">
          <p className="text-center" style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "rgba(255,255,255,0.7)", maxWidth: 320 }}>
            Blow out the candles!<br />
            <span style={{ fontSize: "0.85em", color: "rgba(255,255,255,0.4)" }}>We need microphone access to detect your blow</span>
          </p>
          <button
            onClick={requestMic}
            className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-montserrat)", background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.8))", color: "white", boxShadow: "0 4px 20px rgba(251,191,36,0.3)" }}
          >
            Allow Microphone
          </button>
        </div>
      )}

      {!showPrompt && micGranted && candleLit && (
        <p className="mt-6 card-text-reveal" style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.85rem, 1.8vw, 1rem)", color: "rgba(251,191,36,0.6)", animation: "tapFade 2s ease-in-out infinite" }}>
          Blow into the mic to extinguish the candles...
        </p>
      )}

      {!showPrompt && !micGranted && candleLit && (
        <button
          onClick={() => { handleBlow(); ensureMusic(); }}
          className="mt-6 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 card-text-reveal"
          style={{ fontFamily: "var(--font-montserrat)", background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.8))", color: "white", boxShadow: "0 4px 20px rgba(251,191,36,0.3)" }}
        >
          Tap to Blow Out Candles
        </button>
      )}

      {blown && (
        <p className="mt-6 card-text-reveal" style={{ fontFamily: "var(--font-great-vibes)", fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "rgba(251,191,36,0.7)" }}>
          Your special day!
        </p>
      )}
    </div>
  );
}
