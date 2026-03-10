import { create } from 'zustand';

interface RobotState {
    baseRotation: number;
    shoulderRotation: number;
    elbowRotation: number;
    wristRotation: number;
    gripperOpen: number;
    activeTask: 'freestyle' | 'pickAndPlace';
    taskProgress: number; // 0 to 100
    setJoint: (joint: string, value: number) => void;
    setTask: (task: 'freestyle' | 'pickAndPlace') => void;
    setTaskProgress: (progress: number) => void;
    resetPose: () => void;
}

export const useStore = create<RobotState>((set) => ({
    baseRotation: 0,
    shoulderRotation: 0,
    elbowRotation: 0,
    wristRotation: 0,
    gripperOpen: 1, // 1 = open, 0 = closed
    activeTask: 'freestyle',
    taskProgress: 0,

    setJoint: (joint, value) => set((state) => ({ ...state, [joint]: value })),

    setTask: (task) => set({ activeTask: task, taskProgress: 0 }),

    setTaskProgress: (progress) => set({ taskProgress: progress }),

    resetPose: () => set({
        baseRotation: 0,
        shoulderRotation: 0,
        elbowRotation: 0,
        wristRotation: 0,
        gripperOpen: 1
    })
}));
