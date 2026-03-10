import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei';
import { createXRStore, XR } from '@react-three/xr';
import RoboticArm from './RoboticArm';
import PickAndPlaceTask from './PickAndPlaceTask';

const store = createXRStore();

const VirtualLab = () => {
    return (
        <>
            <button
                className="btn-primary"
                style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 100 }}
                onClick={() => store.enterVR()}
            >
                Enter VR
            </button>
            <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
                <XR store={store}>
                    <color attach="background" args={['#050508']} />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize={2048} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <Suspense fallback={null}>
                        <Environment preset="city" />

                        <RoboticArm />
                        <PickAndPlaceTask />

                        {/* Ground Plane */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#0a0a0f" roughness={0.8} />
                        </mesh>

                        <Grid
                            position={[0, 0.01, 0]}
                            args={[50, 50]}
                            cellSize={1}
                            cellThickness={1}
                            cellColor="#222"
                            sectionSize={5}
                            sectionThickness={1.5}
                            sectionColor="#444"
                            fadeDistance={30}
                            fadeStrength={1}
                        />

                        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />

                    </Suspense>

                    <OrbitControls
                        makeDefault
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                        maxDistance={25}
                        minDistance={5}
                        target={[0, 2, 0]}
                    />
                </XR>
            </Canvas>
        </>
    );
};

export default VirtualLab;
