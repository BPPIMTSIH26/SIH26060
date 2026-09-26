import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Stars, Environment, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Helper to calculate exact terrain height at any point, ensuring sharp roughness
const getTerrainHeight = (x, z) => {
    const dist = Math.sqrt(x * x + z * z);

    // Standard uneven rocky terrain
    const baseBumps = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.4;
    let height = baseBumps;

    // The station is built into the mountain, so it's NOT perfectly flat!
    if (dist < 12) {
        height = baseBumps * 0.3;
    } else if (dist < 20) {
        height = baseBumps * (0.3 + (0.7 * ((dist - 12) / 8)));
    }

    // Rolling hills in the distance
    if (dist > 25) {
        const hills = Math.max(0,
            Math.sin(x * 0.1) * Math.cos(z * 0.1) * 4 +
            Math.sin(x * 0.05) * Math.cos(z * 0.05) * 8
        );
        height += hills * Math.min(1, (dist - 25) / 20);
    }

    return height - 0.5; // Final terrain Y offset
};

function ExternalFacilities({ pipeTarget, viewMode, activeCategory }) {
    const [activeDot, setActiveDot] = useState(null);

    useEffect(() => {
        const handleClose = () => setActiveDot(null);
        window.addEventListener('close-popovers', handleClose);
        return () => window.removeEventListener('close-popovers', handleClose);
    }, []);
    // Placed in the container yard (Back-Right of station)
    const centerX = 6;
    const centerZ = -13;
    const baseY = getTerrainHeight(centerX, centerZ) + 0.2;

    // Generator: 3 containers joining at center (Y-shape/Triangle)
    const containerL = 1.8; // Exactly matched to shipping container length
    const containerW = 0.7; // Exactly matched to shipping container width
    const containerH = 0.5; // Exactly matched to shipping container height
    const isEnergyHighlight = activeCategory === 'Energy';
    const genColor = isEnergyHighlight ? "#06b6d4" : "#94a3b8";
    const oilColor = isEnergyHighlight ? "#06b6d4" : "#ea580c";

    const genRefs = useRef([]);
    const hubRef = useRef();
    const oilRef = useRef();

    useFrame((state) => {
        if (isEnergyHighlight) {
            const pulse = (Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2;
            const dynamicIntensity = 0.5 + (pulse * 2.0);
            genRefs.current.forEach(ref => { if (ref) ref.emissiveIntensity = dynamicIntensity; });
            if (hubRef.current) hubRef.current.emissiveIntensity = dynamicIntensity;
            if (oilRef.current) oilRef.current.emissiveIntensity = dynamicIntensity;
        }
    });

    // Oil Storage: Double headed container
    const oilTankX = centerX - 4; // Moved back to the LEFT side (-X)
    const oilTankZ = centerZ + 1; // Kept tight to the generator
    const oilTankY = getTerrainHeight(oilTankX, oilTankZ) + 0.4;

    const pipeCurves = useMemo(() => {
        const targetX = pipeTarget?.x ?? -6.00;
        const targetZ = pipeTarget?.z ?? -3.40;

        const start = new THREE.Vector3(centerX, baseY - 0.05, centerZ);
        const end = new THREE.Vector3(targetX, baseY - 0.05, targetZ);

        // Calculate a perpendicular vector to bow the curve outward
        const dx = end.x - start.x;
        const dz = end.z - start.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        // We push the curve out by a scalar (e.g. 2 units)
        const perpX = (dz / len) * -1.5; // Bow outwards
        const perpZ = (-dx / len) * -1.5;

        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.x += perpX;
        mid.z += perpZ;

        // Generate 3 parallel curves
        return [-0.1, 0, 0.1].map(offset => {
            const px = (dz / len) * offset;
            const pz = (-dx / len) * offset;

            const oStart = new THREE.Vector3(start.x + px, start.y, start.z + pz);
            const oMid = new THREE.Vector3(mid.x + px, mid.y, mid.z + pz);
            const oEnd = new THREE.Vector3(end.x + px, end.y, end.z + pz);

            return new THREE.CatmullRomCurve3([oStart, oMid, oEnd]);
        });
    }, [pipeTarget, centerX, centerZ, baseY]);

    return (
        <group>
            {/* GENERATOR: 3 containers in a triangle/Y-shape */}
            <group position={[centerX, baseY, centerZ]}>
                {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
                    <group key={`gen-${i}`} rotation={[0, angle, 0]} position={[Math.sin(angle) * (containerL / 2), 0, Math.cos(angle) * (containerL / 2)]}>
                        <mesh castShadow receiveShadow>
                            <boxGeometry args={[containerW, containerH, containerL, 4, 1, 10]} />
                            <meshStandardMaterial ref={(el) => genRefs.current[i] = el} color={genColor} metalness={0.5} roughness={0.7} emissive={isEnergyHighlight ? "#0891b2" : "#000000"} emissiveIntensity={isEnergyHighlight ? 1.5 : 0} />
                        </mesh>
                        {/* Wireframe overlay to match the "straps/ridges" of shipping containers */}
                        <mesh>
                            <boxGeometry args={[containerW + 0.001, containerH + 0.001, containerL + 0.001, 4, 1, 10]} />
                            <meshBasicMaterial color={isEnergyHighlight ? "#22d3ee" : "#1e293b"} wireframe transparent opacity={isEnergyHighlight ? 0.8 : 0.15} />
                        </mesh>
                    </group>
                ))}
                {/* Central connecting hub */}
                <mesh position={[0, containerH / 2, 0]} castShadow>
                    <cylinderGeometry args={[containerW * 0.8, containerW * 0.8, containerH * 1.5, 16]} />
                    <meshStandardMaterial ref={hubRef} color={isEnergyHighlight ? "#06b6d4" : "#64748b"} metalness={0.6} emissive={isEnergyHighlight ? "#0891b2" : "#000000"} emissiveIntensity={isEnergyHighlight ? 1.5 : 0} />
                </mesh>

                {/* Generator Interactive Dot (Only in X-Ray view) */}
                {viewMode === 'xray' && (
                    <Html position={[0, containerH + 0.8, 0]} center zIndexRange={[100, 0]}>
                        <div
                            className="relative flex items-center justify-center cursor-pointer group"
                            onClick={(e) => { e.stopPropagation(); setActiveDot(prev => prev === 'gen' ? null : 'gen'); }}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeDot === 'gen' ? 'bg-cyan-400 scale-150' : 'bg-white/90'} shadow-[0_0_8px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-white transition-all`} />
                            {activeDot === 'gen' && (
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-white pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-[0.6rem] font-bold text-cyan-400 mb-1 uppercase tracking-wider">Main Generator</h3>
                                    <div className="flex flex-col gap-1 text-[0.55rem] text-slate-300">
                                        <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">Active</span></div>
                                        <div className="flex justify-between"><span>Output:</span> <span className="text-cyan-300 font-mono">250 kW</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                )}
            </group>

            {/* OIL STORAGE: Double headed container */}
            <group position={[oilTankX, oilTankY, oilTankZ]} rotation={[0, -Math.PI / 6, 0]}>
                <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
                    <capsuleGeometry args={[0.4, 1.5, 16, 32]} />
                    <meshStandardMaterial ref={oilRef} color={oilColor} roughness={0.6} metalness={0.3} emissive={isEnergyHighlight ? "#0891b2" : "#000000"} emissiveIntensity={isEnergyHighlight ? 1.5 : 0} />
                </mesh>
                {/* Support legs */}
                <mesh position={[-0.6, -0.4, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.8, 0.6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0.6, -0.4, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.8, 0.6]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>

                {/* Fuel Tank Interactive Dot (Only in X-Ray view) */}
                {viewMode === 'xray' && (
                    <Html position={[0, 1.2, 0]} center zIndexRange={[100, 0]}>
                        <div
                            className="relative flex items-center justify-center cursor-pointer group"
                            onClick={(e) => { e.stopPropagation(); setActiveDot(prev => prev === 'fuel' ? null : 'fuel'); }}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeDot === 'fuel' ? 'bg-cyan-400 scale-150' : 'bg-white/90'} shadow-[0_0_8px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-white transition-all`} />
                            {activeDot === 'fuel' && (
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-40 bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-white pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-[0.6rem] font-bold text-orange-400 mb-1 uppercase tracking-wider">Fuel Storage</h3>
                                    <div className="flex flex-col gap-1 text-[0.55rem] text-slate-300">
                                        <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">Secure</span></div>
                                        <div className="flex justify-between"><span>Level:</span> <span className="text-orange-300 font-mono">82%</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                )}
            </group>

            {/* PIPES */}
            {/* Pipe 1: Oil Tank to Generator (2 thin pipes) */}
            {(() => {
                const dx = centerX - oilTankX;
                const dz = centerZ - oilTankZ;
                const length = Math.sqrt(dx * dx + dz * dz);
                const angle = Math.atan2(dx, dz);
                return (
                    <group position={[oilTankX + dx / 2, baseY - 0.05, oilTankZ + dz / 2]} rotation={[0, angle, 0]}>
                        {[-0.08, 0.08].map((offset, i) => (
                            <mesh key={`oilpipe-${i}`} position={[offset, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                                <cylinderGeometry args={[0.02, 0.02, length, 8]} />
                                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
                            </mesh>
                        ))}
                    </group>
                );
            })()}

            {/* Pipe 2: Curved bundle from Generator to Station */}
            {pipeCurves.map((curve, i) => (
                <mesh key={`mainpipe-${i}`} castShadow>
                    <tubeGeometry args={[curve, 32, 0.03, 8, false]} />
                    <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}
        </group>
    );
}

function MaitriTerrain({ pipeTarget, viewMode, activeCategory }) {
    const isEnvHighlight = activeCategory === 'Environment';
    const isLogisticsHighlight = activeCategory === 'Logistics';

    const logisticsRefs = useRef([]);

    useFrame((state) => {
        if (isLogisticsHighlight) {
            const pulse = (Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2;
            const dynamicIntensity = 0.5 + (pulse * 2.0);
            logisticsRefs.current.forEach(ref => { if (ref) ref.emissiveIntensity = dynamicIntensity; });
        }
    });

    const geometry = useMemo(() => {
        // Increased segment count from 128 to 256 for much smoother terrain and finer snow spots
        const geo = new THREE.PlaneGeometry(300, 300, 256, 256);
        geo.rotateX(-Math.PI / 2);
        const pos = geo.attributes.position;

        // Define colors for vertex coloring
        const colors = [];
        const colorRock = new THREE.Color('#5c544d'); // Dark brownish grey rock
        const colorSnow = new THREE.Color('#e2e8f0'); // Snow patch
        const colorDirt = new THREE.Color('#8b7765'); // Lighter dirt

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            // Use the exact helper function for terrain height
            const finalHeight = getTerrainHeight(x, z);
            pos.setY(i, finalHeight);

            // Assign Vertex Colors based on height and noise to simulate rock/snow/dirt patches
            // Added higher frequency noise to create small scattered "spots" rather than large blocks
            const noise = (Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.5) + (Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.5);
            // Height calculation is adjusted to + 0.5 since we subtract 0.5 in getTerrainHeight
            if ((finalHeight + 0.5) > 2 || noise > 0.3) {
                colors.push(colorSnow.r, colorSnow.g, colorSnow.b);
            } else if (noise < -0.2) {
                colors.push(colorDirt.r, colorDirt.g, colorDirt.b);
            } else {
                colors.push(colorRock.r, colorRock.g, colorRock.b);
            }
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    // Generate random rocks matching the rocky terrain
    const details = useMemo(() => {
        const items = [];
        for (let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 14 + Math.random() * 70;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = getTerrainHeight(x, z);
            const size = 0.2 + Math.random() * 0.8;
            items.push({ x, y, z, size, rot: Math.random() * Math.PI });
        }
        return items;
    }, []);

    // Generate shipping containers placed properly in a yard at the back-right
    const containers = useMemo(() => {
        const items = [];
        const colors = ['#a6683f', '#445a7a', '#9ca3af', '#994b4b'];
        // Restored to the closer back-right position
        const minX = 8;
        const maxX = 16;
        const minZ = -15;
        const maxZ = -8;

        for (let i = 0; i < 15; i++) { // Trying 15 times to fill the space
            let x, y, z, rot, color;
            let isOverlapping = true;
            let attempts = 0;

            // Try to find a non-overlapping spot up to 50 times
            while (isOverlapping && attempts < 50) {
                x = minX + Math.random() * (maxX - minX);
                z = minZ + Math.random() * (maxZ - minZ);
                rot = Math.random() * Math.PI;
                color = colors[Math.floor(Math.random() * colors.length)];

                isOverlapping = false;
                for (const existing of items) {
                    const dx = existing.x - x;
                    const dz = existing.z - z;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    // 2.2 units center-to-center guarantees no clipping!
                    if (distance < 2.2) {
                        isOverlapping = true;
                        break;
                    }
                }
                attempts++;
            }

            if (!isOverlapping) {
                // Ground the container exactly onto the rough terrain
                y = getTerrainHeight(x, z) + 0.25; // +0.25 is half the box height
                items.push({ x, y, z, rot, color });
            }
        }
        return items;
    }, []);

    return (
        <group>
            <mesh geometry={geometry} receiveShadow>
                {/* Removed flatShading so vertex colors interpolate smoothly instead of making jagged squares */}
                <meshStandardMaterial vertexColors={true} roughness={1.0} metalness={0.0} color={isEnvHighlight ? "#334155" : "#ffffff"} />
            </mesh>

            {/* Professional Environment Highlight Overlay */}
            {isEnvHighlight && (
                <mesh geometry={geometry}>
                    <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} wireframe transparent opacity={0.3} />
                </mesh>
            )}
            {details.map((item, i) => (
                // Use exact ground height for the random rocks
                <mesh key={i} position={[item.x, item.y, item.z]} rotation={[item.rot, item.rot, item.rot]} castShadow receiveShadow>
                    <dodecahedronGeometry args={[item.size, 0]} />
                    {/* Kept flatShading on the rocks to make them look sharp and jagged */}
                    <meshStandardMaterial color="#4a443f" roughness={0.9} flatShading />
                </mesh>
            ))}
            {containers.map((item, i) => (
                <group key={`container-${i}`} position={[item.x, item.y, item.z]} rotation={[0, item.rot, 0]}>
                    <mesh castShadow receiveShadow>
                        {/* Smaller containers: 0.7 width, 0.5 height, 1.8 length */}
                        <boxGeometry args={[0.7, 0.5, 1.8, 4, 1, 10]} />
                        <meshStandardMaterial ref={(el) => logisticsRefs.current[i] = el} color={activeCategory === 'Logistics' ? "#06b6d4" : item.color} roughness={0.9} metalness={0.1} emissive={activeCategory === 'Logistics' ? "#0891b2" : "#000000"} emissiveIntensity={activeCategory === 'Logistics' ? 1.5 : 0} />
                    </mesh>
                    {/* Faint grid overlay to simulate container ridges/structure */}
                    <mesh>
                        <boxGeometry args={[0.701, 0.501, 1.801, 4, 1, 10]} />
                        <meshBasicMaterial color={activeCategory === 'Logistics' ? "#22d3ee" : "#1e293b"} wireframe transparent opacity={activeCategory === 'Logistics' ? 0.8 : 0.15} />
                    </mesh>
                </group>
            ))}

            <ExternalFacilities pipeTarget={pipeTarget} viewMode={viewMode} activeCategory={activeCategory} />
        </group>
    );
}

export default function MaitriEnvironment({ isDay = false, pipeTarget, viewMode, activeCategory }) {
    return (
        <>
            {!isDay && <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />}
            <Environment preset={isDay ? "city" : "night"} />
            <MaitriTerrain pipeTarget={pipeTarget} viewMode={viewMode} activeCategory={activeCategory} />
        </>
    );
}
