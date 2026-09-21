import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Stars, Environment } from '@react-three/drei';

// Helper to calculate exact terrain height at any point for Bharati
const getTerrainHeight = (x, z) => {
    const dist = Math.hypot(x, z);

    // Layered mountain math combining 4 frequencies
    let height =
        Math.sin(x * 0.1) * Math.cos(z * 0.1) * 8.0 +
        Math.sin(x * 0.25) * Math.cos(z * 0.25) * 2.5 +
        Math.sin(x * 0.7) * Math.cos(z * 0.7) * 0.8 +
        Math.sin(x * 1.5) * Math.cos(z * 1.5) * 0.2;

    // Station foundation
    if (dist < 24) {
        height *= 0.15;
    } else if (dist < 34) {
        height *= 0.15 + 0.85 * ((dist - 24) / 10);
    }

    // Valley lakes
    if (height < -2) {
        height = -2;
    }

    return height - 0.5;
};

// Evaluated once outside component to keep renders pure and satisfy the React Compiler
const STATIC_CONTAINERS = (() => {
    const items = [];
    const colors = ['#1e3a8a', '#dc2626', '#166534', '#f97316'];
    const minX = 9, maxX = 16, minZ = -5, maxZ = 15;

    for (let i = 0; i < 15; i++) {
        let x, z, rot, color;
        let isOverlapping = true;
        let attempts = 0;

        while (isOverlapping && attempts < 50) {
            x = minX + Math.random() * (maxX - minX);
            z = minZ + Math.random() * (maxZ - minZ);
            rot = Math.random() * Math.PI;
            color = colors[Math.floor(Math.random() * colors.length)];

            isOverlapping = items.some(
                (existing) => Math.hypot(existing.x - x, existing.z - z) < 2.5
            );
            attempts++;
        }

        if (!isOverlapping) {
            const y = getTerrainHeight(x, z) + 0.25;
            items.push({ x, y, z, rot, color });
        }
    }
    return items;
})();

function BharatiTerrain() {
    // 1. Terrain generation using Float32Array for memory efficiency
    const terrainGeometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(500, 500, 256, 256);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const vertexCount = pos.count;
        const colors = new Float32Array(vertexCount * 3);

        const colorRock = new THREE.Color('#9c7a59');
        const colorSnow = new THREE.Color('#e2e8f0');
        const colorIce = new THREE.Color('#7dd3fc');

        for (let i = 0; i < vertexCount; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const finalHeight = getTerrainHeight(x, z);
            pos.setY(i, finalHeight);

            const noise =
                Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.5 +
                Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.5;

            const offset = i * 3;
            if (finalHeight <= -2.5) {
                colors[offset] = colorIce.r;
                colors[offset + 1] = colorIce.g;
                colors[offset + 2] = colorIce.b;
            } else if (noise > 0.7) {
                colors[offset] = colorRock.r;
                colors[offset + 1] = colorRock.g;
                colors[offset + 2] = colorRock.b;
            } else {
                colors[offset] = colorSnow.r;
                colors[offset + 1] = colorSnow.g;
                colors[offset + 2] = colorSnow.b;
            }
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    // 2. Shared box & wireframe assets (prevents 30 duplicate geometry instances)
    const { boxGeo, wireGeo, wireMaterial } = useMemo(() => ({
        boxGeo: new THREE.BoxGeometry(0.7, 0.5, 1.8, 4, 1, 10),
        wireGeo: new THREE.BoxGeometry(0.701, 0.501, 1.801, 4, 1, 10),
        wireMaterial: new THREE.MeshBasicMaterial({
            color: '#1e293b',
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        }),
    }), []);

    // 3. WebGL GPU disposal on component unmount
    useEffect(() => {
        return () => {
            terrainGeometry.dispose();
            boxGeo.dispose();
            wireGeo.dispose();
            wireMaterial.dispose();
        };
    }, [terrainGeometry, boxGeo, wireGeo, wireMaterial]);

    return (
        <group>
            {/* Terrain */}
            <mesh geometry={terrainGeometry} receiveShadow>
                <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} />
            </mesh>

            {/* Ocean */}
            <mesh position={[0, -12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2000, 2000]} />
                <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Containers */}
            {STATIC_CONTAINERS.map((item, i) => (
                <group key={`b-container-${i}`} position={[item.x, item.y, item.z]} rotation={[0, item.rot, 0]}>
                    <mesh geometry={boxGeo} castShadow receiveShadow>
                        <meshStandardMaterial color={item.color} roughness={0.9} metalness={0.1} />
                    </mesh>
                    <mesh geometry={wireGeo} material={wireMaterial} />
                </group>
            ))}
        </group>
    );
}

export default function BharatiEnvironment({ isDay = false }) {
    return (
        <>
            {!isDay && (
                <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
            )}
            <Environment preset={isDay ? 'city' : 'night'} />
            <BharatiTerrain />
        </>
    );
}