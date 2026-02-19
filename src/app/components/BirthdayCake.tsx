"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

/* ── Color map for the cake model parts ── */
const MATERIAL_COLORS: Record<string, { color: string; emissive?: string; emissiveIntensity?: number; roughness?: number }> = {
  // Cake layers
  "Cylinder.002": { color: "#F5A9C4", roughness: 0.4 },     // Pink icing (bottom layer)
  "Cylinder": { color: "#FFE4B5", roughness: 0.6 },          // Cream sponge (middle)
  "Cube.001_Cube.003": { color: "#FFDEAD", roughness: 0.5 }, // Plate / base

  // Candle bodies
  "Cylinder.001_Cylinder.011": { color: "#FF6B6B", roughness: 0.3 },
  "Cylinder.003_Cylinder.012": { color: "#4ECDC4", roughness: 0.3 },
  "Cylinder.004_Cylinder.013": { color: "#FFE66D", roughness: 0.3 },
  "Cylinder.005_Cylinder.014": { color: "#A78BFA", roughness: 0.3 },
  "Cylinder.006_Cylinder.015": { color: "#FF6B6B", roughness: 0.3 },
  "Cylinder.007_Cylinder.016": { color: "#4ECDC4", roughness: 0.3 },
  "Cylinder.008_Cylinder.017": { color: "#FFE66D", roughness: 0.3 },
  "Cylinder.009": { color: "#A78BFA", roughness: 0.3 },
  "Cylinder.010": { color: "#FF6B6B", roughness: 0.3 },

  // Candle flames (cones)
  "Cone.001": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.002_Cone.003": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.003_Cone.004": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.004_Cone.005": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.005_Cone.006": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.006_Cone.007": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
  "Cone.007_Cone.008": { color: "#FFAA00", emissive: "#FF8800", emissiveIntensity: 2 },
  "Cone.008_Cone.009": { color: "#FF8C00", emissive: "#FF6600", emissiveIntensity: 2 },
};

/* ── FBX Cake Model ── */
function CakeModel({ candleLit }: { candleLit: boolean }) {
  const fbx = useLoader(FBXLoader, "/uploads_files_2921075_Cake.fbx");
  const flameRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    flameRefs.current = [];

    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name;
        const config = MATERIAL_COLORS[name];

        if (config) {
          child.material = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: config.roughness ?? 0.5,
            metalness: 0.05,
            emissive: config.emissive ? new THREE.Color(config.emissive) : undefined,
            emissiveIntensity: config.emissiveIntensity ?? 0,
          });
        } else {
          // Default: soft cream for unmatched parts
          child.material = new THREE.MeshStandardMaterial({
            color: "#FFE4C4",
            roughness: 0.5,
            metalness: 0.05,
          });
        }

        // Track flame meshes (cones)
        if (name.startsWith("Cone")) {
          flameRefs.current.push(child);
        }
      }
    });
  }, [fbx]);

  // Animate flames / hide when blown
  useFrame(() => {
    flameRefs.current.forEach((flame) => {
      if (!candleLit) {
        flame.visible = false;
      } else {
        flame.visible = true;
        const flicker = Math.sin(Date.now() * 0.015 + flame.id) * 0.08;
        flame.scale.setScalar(1 + flicker);
      }
    });
  });

  // Scale the model to fit nicely
  const scale = 0.02;

  return (
    <group>
      <primitive object={fbx} scale={[scale, scale, scale]} position={[0, -0.8, 0]} />

      {/* "Happy Birthday" text on top */}
      <Text
        position={[0, 0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#8B0000"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        textAlign="center"
      >
        Happy Birthday
      </Text>

      {/* Warm point light from candles */}
      {candleLit && (
        <pointLight position={[0, 1.5, 0]} color="#FF9933" intensity={3} distance={5} decay={2} />
      )}
    </group>
  );
}

/* ── 3D Scene ── */
function CakeScene({ candleLit }: { candleLit: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.9} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.4} />
      <directionalLight position={[0, -1, 3]} intensity={0.2} />

      <CakeModel candleLit={candleLit} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={1.5}
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
        // Mic denied
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

/* ── Main Component ── */
interface BirthdayCakeProps {
  onComplete: () => void;
}

export default function BirthdayCake({ onComplete }: BirthdayCakeProps) {
  const [candleLit, setCandleLit] = useState(true);
  const [micGranted, setMicGranted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [blown, setBlown] = useState(false);

  const handleBlow = useCallback(() => {
    if (!candleLit) return;
    setCandleLit(false);
    setBlown(true);
  }, [candleLit]);

  useBlowDetector(handleBlow, micGranted && candleLit);

  const requestMic = useCallback(async () => {
    setShowPrompt(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicGranted(true);
    } catch {
      setMicGranted(false);
    }
  }, []);

  useEffect(() => {
    if (!blown) return;
    const t = setTimeout(onComplete, 2500);
    return () => clearTimeout(t);
  }, [blown, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "rgba(7,5,16,0.97)" }}>
      {/* 3D Cake */}
      <div style={{ width: "min(90vw, 650px)", height: "min(60vh, 520px)" }}>
        <Canvas camera={{ position: [0, 3.5, 4], fov: 40 }}>
          <CakeScene candleLit={candleLit} />
        </Canvas>
      </div>

      {/* Mic prompt */}
      {showPrompt && (
        <div className="flex flex-col items-center gap-4 mt-4 card-text-reveal">
          <p className="text-center" style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "rgba(255,255,255,0.7)", maxWidth: 320 }}>
            Blow out the candle!<br />
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
          Blow into the mic to extinguish the candle...
        </p>
      )}

      {!showPrompt && !micGranted && candleLit && (
        <button
          onClick={handleBlow}
          className="mt-6 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 card-text-reveal"
          style={{ fontFamily: "var(--font-montserrat)", background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.8))", color: "white", boxShadow: "0 4px 20px rgba(251,191,36,0.3)" }}
        >
          Tap to Blow Out Candle
        </button>
      )}

      {blown && (
        <p className="mt-4 card-text-reveal" style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(0.85rem, 1.5vw, 1rem)", color: "rgba(251,191,36,0.5)" }}>
          &#10024; Make a wish! &#10024;
        </p>
      )}
    </div>
  );
}
