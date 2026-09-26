/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Stars, Environment, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const DEFAULT_DOME_CONFIG = { d1X: -22.3, d1Z: -10.1, d2X: 1.6, d2Z: -21.3 };
const DEFAULT_PIPE_TARGET = { x: 5.1, z: -3.2 };

const seededRandom = (seed) => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
};

const getTerrainHeight = (x, z) => {
    const dist = Math.sqrt(x * x + z * z);
    let height =
        Math.sin(x * 0.1) * Math.cos(z * 0.1) * 8.0 +
        Math.sin(x * 0.25) * Math.cos(z * 0.25) * 2.5 +
        Math.sin(x * 0.7) * Math.cos(z * 0.7) * 0.8 +
        Math.sin(x * 1.5) * Math.cos(z * 1.5) * 0.2;
    if (dist < 24) {
        height *= 0.15;
    } else if (dist < 34) {
        height *= 0.15 + 0.85 * ((dist - 24) / 10);
    }
    if (height < -2) height = -2;
    return height - 0.5;
};

function BharatiFacilities({ viewMode, domeConfig = DEFAULT_DOME_CONFIG, pipeTarget = DEFAULT_PIPE_TARGET, activeCategory }) {
    const [activeDot, setActiveDot] = useState(null);
    const isEnergyHighlight = activeCategory === "Energy";
    const dome2Ref = useRef();

    useFrame((state) => {
        if (dome2Ref.current) {
            dome2Ref.current.emissiveIntensity = isEnergyHighlight
                ? 0.5 + ((Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2) * 2.0
                : 0;
        }
    });

    useEffect(() => {
        const handleClose = () => setActiveDot(null);
        window.addEventListener("close-popovers", handleClose);
        return () => window.removeEventListener("close-popovers", handleClose);
    }, []);

    const dome1X = domeConfig?.d1X ?? DEFAULT_DOME_CONFIG.d1X;
    const dome1Z = domeConfig?.d1Z ?? DEFAULT_DOME_CONFIG.d1Z;
    const dome1Y = getTerrainHeight(dome1X, dome1Z);
    const dome2X = domeConfig?.d2X ?? DEFAULT_DOME_CONFIG.d2X;
    const dome2Z = domeConfig?.d2Z ?? DEFAULT_DOME_CONFIG.d2Z;
    const dome2Y = getTerrainHeight(dome2X, dome2Z);
    const targetX = pipeTarget?.x ?? DEFAULT_PIPE_TARGET.x;
    const targetZ = pipeTarget?.z ?? DEFAULT_PIPE_TARGET.z;

    const pipeCurves = useMemo(() => {
        const p1Start = new THREE.Vector3(dome1X, dome1Y, dome1Z);
        const p1End = new THREE.Vector3(dome2X, dome2Y, dome2Z);
        const p1Mid = new THREE.Vector3().addVectors(p1Start, p1End).multiplyScalar(0.5);
        p1Mid.x -= 2;
        p1Mid.y = getTerrainHeight(p1Mid.x, p1Mid.z) + 0.1;
        const curve1 = new THREE.CatmullRomCurve3([p1Start, p1Mid, p1End]);

        const p2Start = new THREE.Vector3(dome2X, dome2Y, dome2Z);
        const p2End = new THREE.Vector3(targetX, getTerrainHeight(targetX, targetZ), targetZ);
        const p2Mid = new THREE.Vector3().addVectors(p2Start, p2End).multiplyScalar(0.5);
        p2Mid.x += 1.5;
        p2Mid.y = getTerrainHeight(p2Mid.x, p2Mid.z) + 0.1;
        const curve2 = new THREE.CatmullRomCurve3([p2Start, p2Mid, p2End]);

        return { curve1, curve2 };
    }, [dome1X, dome1Y, dome1Z, dome2X, dome2Y, dome2Z, targetX, targetZ]);

    return (
        <group>
            <group position={[dome1X, dome1Y, dome1Z]}>
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.2} />
                </mesh>
                {viewMode === "xray" && (
                    <Html position={[0, 2.8, 0]} center zIndexRange={[100, 0]}>
                        <div className="relative flex items-center justify-center cursor-pointer group" onClick={(e) => { e.stopPropagation(); setActiveDot((prev) => (prev === "dome1" ? null : "dome1")); }}>
                            <div className={`w-1.5 h-1.5 rounded-full ${activeDot === "dome1" ? "bg-cyan-400 scale-150" : "bg-white/90"} shadow-[0_0_8px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-white transition-all`} />
                            {activeDot === "dome1" && (
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-white pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-[0.6rem] font-bold text-cyan-400 mb-1 uppercase tracking-wider">Observatory Alpha</h3>
                                    <div className="flex flex-col gap-1 text-[0.55rem] text-slate-300">
                                        <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">Active</span></div>
                                        <div className="flex justify-between"><span>System:</span> <span>Life Support</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                )}
            </group>
            <group position={[dome2X, dome2Y, dome2Z]}>
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial ref={dome2Ref} color={isEnergyHighlight ? "#06b6d4" : "#ffffff"} metalness={0.1} roughness={0.2} emissive={isEnergyHighlight ? "#0891b2" : "#000000"} emissiveIntensity={isEnergyHighlight ? 1.5 : 0} />
                </mesh>
                {viewMode === "xray" && (
                    <Html position={[0, 3.5, 0]} center zIndexRange={[100, 0]}>
                        <div className="relative flex items-center justify-center cursor-pointer group" onClick={(e) => { e.stopPropagation(); setActiveDot((prev) => (prev === "dome2" ? null : "dome2")); }}>
                            <div className={`w-1.5 h-1.5 rounded-full ${activeDot === "dome2" ? "bg-cyan-400 scale-150" : "bg-white/90"} shadow-[0_0_8px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-white transition-all`} />
                            {activeDot === "dome2" && (
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-white pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-[0.6rem] font-bold text-cyan-400 mb-1 uppercase tracking-wider">Observatory Beta</h3>
                                    <div className="flex flex-col gap-1 text-[0.55rem] text-slate-300">
                                        <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">Active</span></div>
                                        <div className="flex justify-between"><span>System:</span> <span>Power Gen</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                )}
            </group>
            <mesh castShadow>
                <tubeGeometry args={[pipeCurves.curve1, 64, 0.02, 8, false]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh castShadow>
                <tubeGeometry args={[pipeCurves.curve2, 64, 0.02, 8, false]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </mesh>
        </group>
    );
}

function BharatiTerrain({ viewMode, domeConfig, pipeTarget, activeCategory }) {
    const isEnvHighlight = activeCategory === "Environment";
    const isLogisticsHighlight = activeCategory === "Logistics";
    const logisticsRefs = useRef([]);

    useFrame((state) => {
        const targetIntensity = isLogisticsHighlight ? 0.5 + ((Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2) * 2.0 : 0;
        logisticsRefs.current.forEach((ref) => { if (ref) ref.emissiveIntensity = targetIntensity; });
    });

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(500, 500, 256, 256);
        geo.rotateX(-Math.PI / 2);
        const pos = geo.attributes.position;
        const colors = [];
        const colorRock = new THREE.Color("#9c7a59");
        const colorSnow = new THREE.Color("#e2e8f0");
        const colorIce = new THREE.Color("#7dd3fc");

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const finalHeight = getTerrainHeight(x, z);
            pos.setY(i, finalHeight);
            const noise = Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.5 + Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.5;
            if (finalHeight <= -2.5) {
                colors.push(colorIce.r, colorIce.g, colorIce.b);
            } else if (noise > 0.7) {
                colors.push(colorRock.r, colorRock.g, colorRock.b);
            } else {
                colors.push(colorSnow.r, colorSnow.g, colorSnow.b);
            }
        }
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    useEffect(() => () => geometry.dispose(), [geometry]);

    const containers = useMemo(() => {
        const items = [];
        const colors = ["#1e3a8a", "#dc2626", "#166534", "#f97316"];
        const minX = 9, maxX = 16, minZ = -5, maxZ = 15;
        let seed = 500;
        for (let i = 0; i < 15; i++) {
            let x, y, z, rot, color;
            let isOverlapping = true;
            let attempts = 0;
            while (isOverlapping && attempts < 50) {
                x = minX + seededRandom(seed++) * (maxX - minX);
                z = minZ + seededRandom(seed++) * (maxZ - minZ);
                rot = seededRandom(seed++) * Math.PI;
                color = colors[Math.floor(seededRandom(seed++) * colors.length)];
                isOverlapping = false;
                for (const existing of items) {
                    if (Math.hypot(existing.x - x, existing.z - z) < 2.5) {
                        isOverlapping = true;
                        break;
                    }
                }
                attempts++;
            }
            if (!isOverlapping) {
                y = getTerrainHeight(x, z) + 0.25;
                items.push({ x, y, z, rot, color });
            }
        }
        return items;
    }, []);

    return (
        <group>
            <mesh geometry={geometry} receiveShadow>
                <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} color={isEnvHighlight ? "#334155" : "#ffffff"} />
            </mesh>
            {isEnvHighlight && (
                <mesh geometry={geometry}>
                    <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} wireframe transparent opacity={0.3} />
                </mesh>
            )}
            <mesh position={[0, -12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2000, 2000]} />
                <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
            </mesh>
            {containers.map((item, i) => (
                <group key={`b-container-${i}`} position={[item.x, item.y, item.z]} rotation={[0, item.rot, 0]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[0.7, 0.5, 1.8, 4, 1, 10]} />
                        <meshStandardMaterial ref={(el) => (logisticsRefs.current[i] = el)} color={isLogisticsHighlight ? "#06b6d4" : item.color} roughness={0.9} metalness={0.1} emissive={isLogisticsHighlight ? "#0891b2" : "#000000"} emissiveIntensity={isLogisticsHighlight ? 1.5 : 0} />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.701, 0.501, 1.801, 4, 1, 10]} />
                        <meshBasicMaterial color={isLogisticsHighlight ? "#22d3ee" : "#1e293b"} wireframe transparent opacity={isLogisticsHighlight ? 0.8 : 0.15} />
                    </mesh>
                </group>
            ))}
            <BharatiFacilities viewMode={viewMode} domeConfig={domeConfig} pipeTarget={pipeTarget} activeCategory={activeCategory} />
        </group>
    );
}

export default function BharatiEnvironment({ isDay = false, viewMode, domeConfig = DEFAULT_DOME_CONFIG, pipeTarget = DEFAULT_PIPE_TARGET, activeCategory }) {
    return (
        <>
            {!isDay && <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />}
            <Environment preset={isDay ? "city" : "night"} />
            <BharatiTerrain viewMode={viewMode} domeConfig={domeConfig} pipeTarget={pipeTarget} activeCategory={activeCategory} />
        </>
    );
}