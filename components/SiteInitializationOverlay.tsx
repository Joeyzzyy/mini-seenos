'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface InitializationPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface SiteInitializationOverlayProps {
  domain: string;
  messages: any[];
  isLoading: boolean;
  initPhase?: 'brand' | 'competitors' | 'planning' | 'done';
  onComplete?: () => void;
}

// Phase card component - minimal, elegant design
const PhaseCard = ({ phase, index, totalPhases }: { phase: InitializationPhase; index: number; totalPhases: number }) => {
  const isActive = phase.status === 'running';
  const isCompleted = phase.status === 'completed';
  
  return (
    <div 
      className="relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        className={`
          flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-400
          ${isActive 
            ? 'bg-white/80 backdrop-blur-sm' 
            : 'bg-transparent'
          }
        `}
      >
        {/* Step indicator */}
        <div 
          className={`
            flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300
            ${isActive 
              ? 'bg-gray-900 text-white' 
              : isCompleted
                ? 'bg-gray-200 text-gray-500'
                : 'bg-gray-100 text-gray-300'
            }
          `}
        >
          {isCompleted ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            index + 1
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className={`text-sm transition-colors duration-300 ${
              isActive ? 'text-gray-900 font-medium' : isCompleted ? 'text-gray-400' : 'text-gray-300'
            }`}
          >
            {phase.name}
          </h3>
          {isActive && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {phase.description}
            </p>
          )}
        </div>
        
        {/* Loading indicator for active */}
        {isActive && (
          <div className="flex-shrink-0">
            <div className="w-3.5 h-3.5 border-[1.5px] border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

// Animated particles background
const ParticleField = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-400/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Main component
export default function SiteInitializationOverlay({ 
  domain, 
  messages, 
  isLoading,
  initPhase = 'brand',
  onComplete 
}: SiteInitializationOverlayProps) {
  const [showTip, setShowTip] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Timer for elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Check for errors in messages
  useEffect(() => {
    const errorMsg = messages.find(m => 
      m.content?.includes('Error:') ||
      m.role === 'assistant' && m.content?.toLowerCase().includes('error')
    );
    if (errorMsg) {
      setHasError(true);
      // Auto-complete after short delay to exit initialization mode
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    }
  }, [messages, onComplete]);
  
  // Timeout protection - exit after 5 minutes if stuck (increased from 3 due to competitor discovery)
  useEffect(() => {
    if (elapsedTime >= 300 && !hasError) { // 5 minutes
      console.log('[Initialization] Timeout reached, exiting initialization mode');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  }, [elapsedTime, hasError, onComplete]);
  
  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };
  
  // Determine phase status based on initPhase prop (from parent state)
  const phases: InitializationPhase[] = useMemo(() => {
    let phase1Status: 'pending' | 'running' | 'completed' = 'pending';
    let phase2Status: 'pending' | 'running' | 'completed' = 'pending';
    let phase3Status: 'pending' | 'running' | 'completed' = 'pending';
    
    // Use initPhase prop to determine status
    switch (initPhase) {
      case 'brand':
        phase1Status = isLoading ? 'running' : 'completed';
        break;
      case 'competitors':
        phase1Status = 'completed';
        phase2Status = 'running';
        break;
      case 'planning':
        phase1Status = 'completed';
        phase2Status = 'completed';
        phase3Status = 'running';
        break;
      case 'done':
        phase1Status = 'completed';
        phase2Status = 'completed';
        phase3Status = 'completed';
        break;
    }
    
    return [
      {
        id: 'brand',
        name: 'Brand Assets',
        description: 'Extracting logo, colors, header & footer',
        status: phase1Status,
      },
      {
        id: 'competitors',
        name: 'Competitor Discovery',
        description: 'Finding competitors via AI + web search',
        status: phase2Status,
      },
      {
        id: 'planning',
        name: 'Page Planning',
        description: 'Creating comparison & listicle page blueprints',
        status: phase3Status,
      },
    ];
  }, [initPhase, isLoading]);
  
  // Check if all phases completed
  useEffect(() => {
    const allCompleted = phases.every(p => p.status === 'completed');
    if (allCompleted && onComplete) {
      setTimeout(onComplete, 1200);
    }
  }, [phases, onComplete]);
  
  // Show tip after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowTip(true), 10000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate progress
  const completedCount = phases.filter(p => p.status === 'completed').length;
  const progress = (completedCount / phases.length) * 100;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        
        {/* Subtle gradient orbs - very light */}
        <div 
          className="absolute w-[600px] h-[600px] -top-40 -right-40 rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo - clean, minimal */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-5">
            <div className="relative w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <img 
                src="/new-logo.png" 
                alt="seopages.pro" 
                className="w-9 h-9 object-contain"
              />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
            Setting up your workspace
          </h1>
          
          {/* Domain badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-100">
            <div className="relative w-1.5 h-1.5">
              <div className="absolute inset-0 rounded-full bg-gray-400 animate-ping opacity-50" />
              <div className="relative w-1.5 h-1.5 rounded-full bg-gray-400" />
            </div>
            <span className="text-xs text-gray-500">{domain}</span>
          </div>
        </div>
        
        {/* Progress section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-400">{formatTime(elapsedTime)}</span>
            <span className="text-[11px] text-gray-400">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress bar - thin and subtle */}
          <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
            {/* Progress fill */}
            <div 
              className="h-full bg-gray-300 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Phases */}
        <div className="space-y-3 mb-6">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} totalPhases={phases.length} />
          ))}
        </div>
        
        {/* Tip - shown after 10 seconds */}
        {showTip && (
          <div className="animate-fade-in bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-center">
            <p className="text-[11px] text-gray-400">
              First-time setup takes 1-2 minutes
            </p>
          </div>
        )}
      </div>
      
      {/* Bottom line - subtle */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
