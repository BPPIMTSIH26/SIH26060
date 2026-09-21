import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Stars, Environment } from '@react-three/drei';

// Helper to calculate exact terrain height at any point, ensuring sharp roughness
const getTerrainHeight = (x, z) => {
    const dist = Math.hypot(x, z);

    // Standard uneven rocky terrain
    const baseBumps = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.4;
    let height = baseBumps;

    // Station foundation
    if (dist < 12) {
        height = baseBumps * 0.3;
    } else if (dist < 20) {
        height = baseBumps * (0.3 + 0.7 * ((dist - 12) / 8));
    }

    // Rolling hills in the distance
    if (dist > 25) {
        const hills = Math.max(
            0,
            Math.sin(x * 0.1) * Math.cos(z * 0.1) * 4 +
            Math.sin(x * 0.05) * Math.cos(z * 0.05) * 8
        );
        height += hills * Math.min(1, (dist - 25) / 20);
    }

    return height - 0.5;
};

// 1. Evaluated outside component to keep renders pure and satisfy the React Compiler
const STATIC_ROCKS = (() => {
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
})();

const STATIC_CONTAINERS = (() => {
    const items = [];
    const colors = ['#a6683f', '#445a7a', '#9ca3af', '#994b4b'];
    const minX = 8, maxX = 16, minZ = -15, maxZ = -8;

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
                (existing) => Math.hypot(existing.x - x, existing.z - z) < 2.2
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

function MaitriTerrain() {
    // 2. Pre-allocated typed array for vertex colors avoids ~198k dynamic push reallocations
    const terrainGeometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(300, 300, 256, 256);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const vertexCount = pos.count;
        const colors = new Float32Array(vertexCount * 3);

        const colorRock = new THREE.Color('#5c544d');
        const colorSnow = new THREE.Color('#e2e8f0');
        const colorDirt = new THREE.Color('#8b7765');

        for (let i = 0; i < vertexCount; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const finalHeight = getTerrainHeight(x, z);
            pos.setY(i, finalHeight);

            const noise =
                Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.5 +
                Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.5;

            const offset = i * 3;
            if (finalHeight + 0.5 > 2 || noise > 0.3) {
                colors[offset] = colorSnow.r;
                colors[offset + 1] = colorSnow.g;
                colors[offset + 2] = colorSnow.b;
            } else if (noise < -0.2) {
                colors[offset] = colorDirt.r;
                colors[offset + 1] = colorDirt.g;
                colors[offset + 2] = colorDirt.b;
            } else {
                colors[offset] = colorRock.r;
                colors[offset + 1] = colorRock.g;
                colors[offset + 2] = colorRock.b;
            }
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    // 3. Shared geometries & materials to avoid 180+ individual geometry allocations on the GPU
    const { rockGeo, boxGeo, wireGeo, wireMaterial } = useMemo(() => ({
        rockGeo: new THREE.DodecahedronGeometry(1, 0),
        boxGeo: new THREE.BoxGeometry(0.7, 0.5, 1.8, 4, 1, 10),
        wireGeo: new THREE.BoxGeometry(0.701, 0.501, 1.801, 4, 1, 10),
        wireMaterial: new THREE.MeshBasicMaterial({
            color: '#1e293b',
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        }),
    }), []);

    // 4. WebGL memory disposal to avoid leaks on unmount or page transitions
    useEffect(() => {
        return () => {
            terrainGeometry.dispose();
            rockGeo.dispose();
            boxGeo.dispose();
            wireGeo.dispose();
            wireMaterial.dispose();
        };
    }, [terrainGeometry, rockGeo, boxGeo, wireGeo, wireMaterial]);

    return (
        <group>
            {/* Terrain */}
            <mesh geometry={terrainGeometry} receiveShadow>
                <meshStandardMaterial vertexColors roughness={1.0} metalness={0.0} />
            </mesh>

            {/* 150 Rocks sharing 1 unit geometry scaled on the mesh */}
            {STATIC_ROCKS.map((item, i) => (
                <mesh
                    key={`rock-${i}`}
                    geometry={rockGeo}
                    position={[item.x, item.y, item.z]}
                    rotation={[item.rot, item.rot, item.rot]}
                    scale={item.size}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color="#4a443f" roughness={0.9} flatShading />
                </mesh>
            ))}

            {/* Containers using shared box geometries */}
            {STATIC_CONTAINERS.map((item, i) => (
                <group key={`container-${i}`} position={[item.x, item.y, item.z]} rotation={[0, item.rot, 0]}>
                    <mesh geometry={boxGeo} castShadow receiveShadow>
                        <meshStandardMaterial color={item.color} roughness={0.9} metalness={0.1} />
                    </mesh>
                    <mesh geometry={wireGeo} material={wireMaterial} />
                </group>
            ))}
        </group>
    );
}

export default function MaitriEnvironment({ isDay = false }) {
    return (
        <>
            {!isDay && (
                <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
            )}
            <Environment preset={isDay ? 'city' : 'night'} />
            <MaitriTerrain />
        </>
    );
}