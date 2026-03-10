import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';

// Material defaults
const robotMaterial = new THREE.MeshStandardMaterial({
    color: '#e0e0e0',
    roughness: 0.3,
    metalness: 0.8
});

const jointMaterial = new THREE.MeshStandardMaterial({
    color: '#333333',
    roughness: 0.7,
    metalness: 0.2
});

const accentMaterial = new THREE.MeshStandardMaterial({
    color: '#00f0ff',
    roughness: 0.2,
    metalness: 0.9,
    emissive: '#00f0ff',
    emissiveIntensity: 0.5
});

const RoboticArm = () => {
    const {
        baseRotation, shoulderRotation, elbowRotation,
        wristRotation, gripperOpen, setEffectorPosition
    } = useStore();

    // Refs for animation
    const baseRef = useRef<THREE.Group>(null);
    const upperArmRef = useRef<THREE.Group>(null);
    const lowerArmRef = useRef<THREE.Group>(null);
    const wristRef = useRef<THREE.Group>(null);
    const leftGripperRef = useRef<THREE.Group>(null);
    const rightGripperRef = useRef<THREE.Group>(null);
    const effectorRef = useRef<THREE.Group>(null);
    const targetPos = new THREE.Vector3();

    useFrame(() => {
        // Smoothly interpolate current rotations to target rotations from store
        if (baseRef.current) {
            baseRef.current.rotation.y = THREE.MathUtils.lerp(
                baseRef.current.rotation.y, THREE.MathUtils.degToRad(baseRotation), 0.1
            );
        }
        if (upperArmRef.current) {
            upperArmRef.current.rotation.z = THREE.MathUtils.lerp(
                upperArmRef.current.rotation.z, THREE.MathUtils.degToRad(shoulderRotation), 0.1
            );
        }
        if (lowerArmRef.current) {
            lowerArmRef.current.rotation.z = THREE.MathUtils.lerp(
                lowerArmRef.current.rotation.z, THREE.MathUtils.degToRad(elbowRotation), 0.1
            );
        }
        if (wristRef.current) {
            wristRef.current.rotation.x = THREE.MathUtils.lerp(
                wristRef.current.rotation.x, THREE.MathUtils.degToRad(wristRotation), 0.1
            );
        }
        if (leftGripperRef.current && rightGripperRef.current) {
            // Gripper open range: 0 (closed) to 1 (open)
            // Map it to translation (e.g. 0.2 to 0.5)
            const gripperTarget = 0.2 + (gripperOpen * 0.3);
            leftGripperRef.current.position.z = THREE.MathUtils.lerp(
                leftGripperRef.current.position.z, gripperTarget, 0.1
            );
            rightGripperRef.current.position.z = THREE.MathUtils.lerp(
                rightGripperRef.current.position.z, -gripperTarget, 0.1
            );
        }
        if (effectorRef.current) {
            effectorRef.current.getWorldPosition(targetPos);
            setEffectorPosition([targetPos.x, targetPos.y, targetPos.z]);
        }
    });

    return (
        <group position={[0, 0, 0]} castShadow receiveShadow>

            {/* Base Platform */}
            <Cylinder args={[1.5, 1.8, 0.5, 32]} position={[0, 0.25, 0]} material={jointMaterial} castShadow receiveShadow />

            {/* Rotating Base */}
            <group ref={baseRef} position={[0, 0.5, 0]}>
                <Cylinder args={[1.2, 1.2, 0.8, 32]} position={[0, 0.4, 0]} material={robotMaterial} castShadow receiveShadow />

                {/* Base Joint Sphere */}
                <Sphere args={[0.7, 32, 32]} position={[0, 1.1, 0]} material={accentMaterial} castShadow />

                {/* Shoulder / Upper Arm Group */}
                <group ref={upperArmRef} position={[0, 1.1, 0]}>
                    <Box args={[0.8, 4, 0.8]} position={[0, 1.5, 0]} material={robotMaterial} castShadow receiveShadow />

                    {/* Elbow Joint Sphere */}
                    <Sphere args={[0.6, 32, 32]} position={[0, 3.5, 0]} material={jointMaterial} castShadow />

                    {/* Elbow / Lower Arm Group */}
                    <group ref={lowerArmRef} position={[0, 3.5, 0]}>
                        <Box args={[0.6, 3, 0.6]} position={[0, 1.5, 0]} material={robotMaterial} castShadow receiveShadow />

                        {/* Wrist Joint Sphere */}
                        <Sphere args={[0.5, 32, 32]} position={[0, 3, 0]} material={accentMaterial} castShadow />

                        {/* Wrist / End Effector Group */}
                        <group ref={wristRef} position={[0, 3, 0]}>
                            <Cylinder args={[0.4, 0.4, 0.8, 16]} position={[0, 0.4, 0]} rotation={[0, 0, 0]} material={jointMaterial} castShadow />

                            {/* Gripper Base */}
                            <Box args={[0.8, 0.2, 1.2]} position={[0, 0.9, 0]} material={robotMaterial} castShadow receiveShadow />

                            {/* Grippers */}
                            <group position={[0, 1.0, 0]}>
                                <group ref={effectorRef} position={[0, 1.0, 0]} />
                                {/* Left Finger */}
                                <group ref={leftGripperRef} position={[0, 0, 0.5]}>
                                    <Box args={[0.2, 1.5, 0.1]} position={[0, 0.75, 0]} material={jointMaterial} castShadow receiveShadow />
                                    <Box args={[0.1, 1.0, 0.2]} position={[0.05, 1.0, -0.1]} material={accentMaterial} />
                                </group>

                                {/* Right Finger */}
                                <group ref={rightGripperRef} position={[0, 0, -0.5]}>
                                    <Box args={[0.2, 1.5, 0.1]} position={[0, 0.75, 0]} material={jointMaterial} castShadow receiveShadow />
                                    <Box args={[0.1, 1.0, 0.2]} position={[0.05, 1.0, 0.1]} material={accentMaterial} />
                                </group>
                            </group>

                        </group>
                    </group>
                </group>
            </group>

        </group>
    );
};

export default RoboticArm;
