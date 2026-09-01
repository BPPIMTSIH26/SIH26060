import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Html, useProgress } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

// 1. The actual model loader component
function Model({ url }) {
    // This hook automatically loads and parses the .glb file
    const { scene } = useGLTF(url);
    
    // You can adjust scale and position if your model is too big/small
    return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

// 2. A custom loading spinner that matches your theme
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl backdrop-blur-sm shadow-xl">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
                <p className="text-sm font-bold font-sans text-gray-700 dark:text-slate-300">
                    Loading Model {Math.round(progress)}%
                </p>
            </div>
        </Html>
    );
}

// 3. The main wrapper component
export default function StationModel({ modelPath = '/maitri.glb' }) {
    return (
        <div className="w-full h-full min-h-[400px] bg-amber-100/30 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 cursor-move">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 5, 10], fov: 45 }}>
                
                <Suspense fallback={<Loader />}>
                    {/* Stage automatically creates beautiful studio lighting and centers the model */}
                    <Stage environment="city" intensity={0.5} adjustCamera>
                        <Model url={modelPath} />
                    </Stage>
                </Suspense>

                {/* Allows the user to rotate, zoom, and pan with their mouse/finger */}
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}

// Preload the model so it loads faster
useGLTF.preload('/maitri.glb');