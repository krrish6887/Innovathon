import React from 'react';
import { Box, Play, Move3d, Zap } from 'lucide-react';

interface LandingPageProps {
    onEnterLab: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterLab }) => {
    return (
        <div className="landing-page">
            <div className="grid-bg"></div>

            <div className="landing-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                    <Box size={48} className="logo-icon" />
                    <h1 className="hero-title text-gradient">VirtuBot Lab</h1>
                </div>

                <p className="hero-subtitle">
                    Experience the future of industrial robotics education. Immersive, interactive, and completely safe. Train on simulated industrial arms directly in your browser or VR headset.
                </p>

                <button className="btn-primary" onClick={onEnterLab}>
                    <Play size={20} />
                    Enter Virtual Lab
                </button>

                <div className="features-grid">
                    <div className="feature-card glass">
                        <Move3d size={32} className="feature-icon" />
                        <h3 className="font-heading">Forward Kinematics</h3>
                        <p>Interact with hierarchical realistic joint models and visualize complex 3D coordination.</p>
                    </div>
                    <div className="feature-card glass">
                        <Zap size={32} className="feature-icon" />
                        <h3 className="font-heading">Real-time Simulation</h3>
                        <p>Experience precise, fluid motion and instant feedback with our high-performance WebXR engine.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
