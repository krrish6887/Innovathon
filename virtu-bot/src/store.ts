import { create } from 'zustand';

interface RobotState {
    baseRotation: number;
    shoulderRotation: number;
    elbowRotation: number;
    wristRotation: number;
    gripperOpen: number;
    effectorPosition: [number, number, number];
    isGrabbed: boolean;
    activeTask: 'freestyle' | 'pickAndPlace';
    taskProgress: number; // 0 to 100
    setJoint: (joint: string, value: number) => void;
    setTask: (task: 'freestyle' | 'pickAndPlace') => void;
    setTaskProgress: (progress: number) => void;
    setEffectorPosition: (pos: [number, number, number]) => void;
    setGrabbed: (grabbed: boolean) => void;
    resetPose: () => void;
}

export const useStore = create<RobotState>((set) => ({
    baseRotation: 0,
    shoulderRotation: 0,
    elbowRotation: 0,
    wristRotation: 0,
    gripperOpen: 1, // 1 = open, 0 = closed
    effectorPosition: [0, 0, 0],
    isGrabbed: false,
    activeTask: 'freestyle',
    taskProgress: 0,

    setJoint: (joint, value) => set((state) => ({ ...state, [joint]: value })),

    setTask: (task) => set({ activeTask: task, taskProgress: 0, isGrabbed: false }),

    setTaskProgress: (progress) => set({ taskProgress: progress }),

    setEffectorPosition: (pos) => set({ effectorPosition: pos }),

    setGrabbed: (grabbed) => set({ isGrabbed: grabbed }),

    resetPose: () => set({
        baseRotation: 0,
        shoulderRotation: 0,
        elbowRotation: 0,
        wristRotation: 0,
        gripperOpen: 1,
        isGrabbed: false
    })
}));
