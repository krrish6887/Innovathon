import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';

const targetMaterial = new THREE.MeshStandardMaterial({
    color: '#ff0055',
    roughness: 0.1,
    metalness: 0.5,
    emissive: '#ff0055',
    emissiveIntensity: 0.4
});

const dropZoneMaterial = new THREE.MeshBasicMaterial({
    color: '#00f0ff',
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});

const PickAndPlaceTask = () => {
    const {
        activeTask, setTaskProgress, baseRotation, shoulderRotation,
        elbowRotation, gripperOpen
    } = useStore();

    const objectRef = useRef<THREE.Mesh>(null);
    const targetPos = new THREE.Vector3(-4, 0.5, 4);
    const dropPos = new THREE.Vector3(4, 0.1, -2);

    // A naive simulation logic to calculate "Progress" based on arm proximity to target & drop zone.
    useFrame(() => {
        if (activeTask !== 'pickAndPlace') return;

        // Simulate "Pick" phase
        let progress = 0;

        // Simplistic heuristic for demo purposes:
        // If base is turned towards object (approx -45 deg)
        if (baseRotation > -60 && baseRotation < -30) progress += 10;

        // If arm reaches down (shoulder up, elbow down)
        if (shoulderRotation > 20) progress += 10;
        if (elbowRotation > 30) progress += 10;

        // If gripper is closed
        if (gripperOpen < 0.2) progress += 20;

        // Simulate "Place" phase
        // If base turned towards drop zone (approx +115 deg)
        if (baseRotation > 90 && baseRotation < 130) progress += 30;

        // If gripper opened at drop zone
        if (baseRotation > 90 && gripperOpen > 0.8) progress += 20;

        // In a real app, calculate actual end-effector position using forward kinematics (matrices).
        // Here we just use joint angles to fake progress for the hackathon UI.
        setTaskProgress(Math.min(100, progress));

        // Visually move the object if "grabbed"
        if (progress >= 50 && progress < 80 && objectRef.current) {
            // Fake attach to effector
            objectRef.current.position.set(0, 4, 3); // relative position if it was attached
        } else if (progress >= 80 && objectRef.current) {
            // Fake drop
            objectRef.current.position.copy(dropPos).add(new THREE.Vector3(0, 0.4, 0));
        } else if (progress < 50 && objectRef.current) {
            // Reset position
            objectRef.current.position.copy(targetPos);
        }
    });

    if (activeTask !== 'pickAndPlace') return null;

    return (
        <group>
            {/* Simulation Instructions in 3D Space */}
            <Text position={[-4, 2, 4]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
                1. Pick
            </Text>

            {/* Target Object to Pick */}
            <Sphere ref={objectRef} args={[0.4, 32, 32]} position={targetPos} material={targetMaterial} castShadow />

            {/* Target Drop Zone */}
            <Text position={[4, 1.5, -2]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
                2. Place
            </Text>
            <Box args={[2, 0.1, 2]} position={dropPos} material={dropZoneMaterial} receiveShadow />

            {/* Highlight ring for drop zone */}
            <mesh position={[4, 0.2, -2]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1, 32]} />
                <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export default PickAndPlaceTask;
