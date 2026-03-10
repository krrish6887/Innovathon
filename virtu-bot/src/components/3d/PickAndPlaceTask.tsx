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
        activeTask, setTaskProgress, gripperOpen, effectorPosition, isGrabbed, setGrabbed
    } = useStore();

    const objectRef = useRef<THREE.Mesh>(null);
    const targetPos = new THREE.Vector3(-4, 0.5, 4);
    const dropPos = new THREE.Vector3(4, 0.1, -2);
    const grabOffset = new THREE.Vector3(0, -0.6, 0);

    useFrame(() => {
        if (activeTask !== 'pickAndPlace') return;

        const effectorVec = new THREE.Vector3(...effectorPosition);

        if (!isGrabbed) {
            // Distance from effector to object
            const currentObjPos = objectRef.current ? objectRef.current.position : targetPos;
            const dist = effectorVec.distanceTo(currentObjPos);

            // If the effector is close to the object and gripper closes
            if (dist < 1.5 && gripperOpen < 0.2) {
                setGrabbed(true);
                setTaskProgress(50);
            }
        }

        if (isGrabbed) {
            // Object follows the effector
            if (objectRef.current) {
                objectRef.current.position.copy(effectorVec).add(grabOffset);
            }

            // Set progress based on how close we are to the drop zone
            const distToDrop = effectorVec.distanceTo(new THREE.Vector3(dropPos.x, effectorVec.y, dropPos.z));
            const progress = 50 + Math.max(0, 50 * (1 - (distToDrop / 10)));
            setTaskProgress(Math.min(99, progress));

            // If we are over the drop zone and open the gripper
            // Drop zone requires effector to be lowered slightly too. Let's just use 2D distance for ease.
            if (distToDrop < 2.0 && gripperOpen > 0.8) {
                setGrabbed(false);
                setTaskProgress(100);
            }
        }

        // Let the object fall to the floor if dropped
        if (!isGrabbed && objectRef.current && objectRef.current.position.y > 0.5) {
            objectRef.current.position.y = THREE.MathUtils.lerp(objectRef.current.position.y, 0.4, 0.1);
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
