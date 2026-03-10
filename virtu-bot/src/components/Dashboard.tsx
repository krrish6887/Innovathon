import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Home, RefreshCw, Settings, Box, Activity } from 'lucide-react';

interface DashboardProps {
    onExit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onExit }) => {
    const {
        baseRotation, shoulderRotation, elbowRotation,
        wristRotation, gripperOpen, activeTask, taskProgress,
        setJoint, setTask, resetPose
    } = useStore();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSliderChange = (joint: string, e: React.ChangeEvent<HTMLInputElement>) => {
        setJoint(joint, parseFloat(e.target.value));
    };

    return (
        <div className={`dashboard-overlay ${mounted ? 'fade-enter-active' : 'fade-enter'}`}>

            {/* Top Header */}
            <header className="dashboard-header glass" style={{ padding: '15px 20px', borderRadius: '12px' }}>
                <div className="brand">
                    <Box size={24} className="logo-icon" />
                    <span>VirtuBot Console</span>
                </div>

                <div className="dashboard-controls">
                    <button className="btn-icon" title="Reset Pose" onClick={resetPose}>
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon" title="Settings">
                        <Settings size={18} />
                    </button>
                    <button className="btn-icon" title="Exit Lab" onClick={onExit} style={{ color: 'var(--accent)', borderColor: 'rgba(255,0,85,0.3)' }}>
                        <Home size={18} />
                    </button>
                </div>
            </header>

            {/* VR Badge Hint */}
            <div className="ar-vr-badge glass">
                <span>Click "Enter VR" on the bottom right if you have a headset!</span>
            </div>

            {/* Main Bottom Area */}
            <main className="dashboard-main">

                {/* Left Panel - Task Info */}
                <div className="panel glass">
                    <h3 className="panel-title">
                        <Activity size={18} className="text-gradient" />
                        Active Simulation
                    </h3>

                    <div className="task-selector">
                        <button
                            className={`task-btn ${activeTask === 'freestyle' ? 'active' : ''}`}
                            onClick={() => setTask('freestyle')}
                        >
                            Freestyle
                        </button>
                        <button
                            className={`task-btn ${activeTask === 'pickAndPlace' ? 'active' : ''}`}
                            onClick={() => setTask('pickAndPlace')}
                        >
                            Pick & Place
                        </button>
                    </div>

                    {activeTask === 'pickAndPlace' && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div className="control-label">
                                <span>Task Progress</span>
                                <span className="control-val">{Math.round(taskProgress)}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${taskProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Kinematics Control */}
                <div className="panel glass">
                    <h3 className="panel-title">
                        <Settings size={18} className="text-gradient" />
                        Forward Kinematics
                    </h3>

                    <div className="control-group">
                        <div className="control-label">
                            <span>Base Rotation</span>
                            <span className="control-val">{baseRotation.toFixed(1)}°</span>
                        </div>
                        <input type="range" min="-180" max="180" step="1"
                            value={baseRotation} onChange={(e) => handleSliderChange('baseRotation', e)} />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span>Shoulder Angle</span>
                            <span className="control-val">{shoulderRotation.toFixed(1)}°</span>
                        </div>
                        <input type="range" min="-90" max="90" step="1"
                            value={shoulderRotation} onChange={(e) => handleSliderChange('shoulderRotation', e)} />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span>Elbow Angle</span>
                            <span className="control-val">{elbowRotation.toFixed(1)}°</span>
                        </div>
                        <input type="range" min="-120" max="120" step="1"
                            value={elbowRotation} onChange={(e) => handleSliderChange('elbowRotation', e)} />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span>Wrist Rotation</span>
                            <span className="control-val">{wristRotation.toFixed(1)}°</span>
                        </div>
                        <input type="range" min="-180" max="180" step="1"
                            value={wristRotation} onChange={(e) => handleSliderChange('wristRotation', e)} />
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <span>Gripper</span>
                            <span className="control-val">{gripperOpen > 0.5 ? 'Open' : 'Closed'}</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.01"
                            value={gripperOpen} onChange={(e) => handleSliderChange('gripperOpen', e)} />
                    </div>

                </div>

            </main>

        </div>
    );
};

export default Dashboard;
