import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { WhiteFullLogo, OrangeFullLogo } from '../components/Logo';

// Microsoft icon SVG
const MicrosoftIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="10" fill="#F25022"/>
    <rect x="11" width="10" height="10" fill="#7FBA00"/>
    <rect y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
);

// Splash Screen Component
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    setTimeout(() => setOpacity(1), 50);

    // Auto complete after 2 seconds
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 400);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1F2937',
      backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity,
      transition: 'opacity 400ms ease-in-out'
    }}>
      {/* White Logo */}
      <div style={{ marginBottom: '48px' }}>
        <WhiteFullLogo 
          style={{ 
            height: '160px',
            width: 'auto'
          }} 
        />
      </div>

      {/* Platform Name */}
      <div style={{
        fontSize: '18px',
        fontWeight: '500',
        color: '#D1D5DB',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        ZG Scheduling, Construction, Progress & Execution
      </div>

      {/* Loading Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#9CA3AF',
        fontSize: '14px'
      }}>
        <Loader2 size={18} style={{
          animation: 'spin 1s linear infinite'
        }} />
        <span>Initializing secure workspace...</span>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Azure SSO Login Screen Component
const AzureLoginScreen = () => {
  const [opacity, setOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);
  }, []);

  const handleSignIn = () => {
    // Direct navigation to My Projects
    navigate('/app');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      opacity,
      transition: 'opacity 500ms ease-in-out'
    }}>
      {/* LEFT PANEL - Brand Experience (60%) */}
      <div style={{
        flex: '0 0 60%',
        position: 'relative',
        backgroundImage: `url('/image.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        color: '#FFFFFF'
      }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          zIndex: 1
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          {/* Headline */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '24px',
            color: '#FFFFFF',
            letterSpacing: '-0.5px'
          }}>
            Scheduling, Construction, Progress & Execution
          </h1>

          {/* Supporting Text */}
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#FD4314',
            marginBottom: '16px',
            letterSpacing: '-0.3px'
          }}>
            Plan. Track. Deliver.
          </div>

          <p style={{
            fontSize: '18px',
            color: '#E2E8F0',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Managing project execution with precision and enterprise-grade security.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Login Area (40%) */}
      <div style={{
        flex: '0 0 40%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px'
      }}>
        {/* OPTION 1 - Clean Microsoft SSO */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Orange Logo */}
          <div style={{ 
            marginBottom: '32px'
          }}>
            <OrangeFullLogo 
              style={{ 
                height: '120px',
                width: 'auto'
              }} 
            />
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: '48px',
            lineHeight: '1.5'
          }}>
            Sign in securely using your corporate account
          </p>

          {/* Microsoft SSO Button */}
          <button
            onClick={handleSignIn}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#FD4314',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E63D12';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(253, 67, 20, 0.4), 0 8px 16px -8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FD4314';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              transform: 'scale(1.15)'
            }}>
              <MicrosoftIcon />
            </div>
            <span style={{ letterSpacing: '0.2px' }}>
              Sign in with Microsoft
            </span>
          </button>

          {/* Footer */}
          <div style={{
            marginTop: '80px',
            fontSize: '11px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            © 2026 Zauner Group. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component with Flow Management
export default function SplashAndLogin() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && <AzureLoginScreen />}
    </>
  );
}