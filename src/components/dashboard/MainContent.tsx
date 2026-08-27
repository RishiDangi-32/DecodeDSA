import { motion } from 'framer-motion';
import { Sparkles, Terminal, Activity, Code2, Bot, GraduationCap } from 'lucide-react';

export default function MainContent() {
  // Features that are "coming soon" to display as a premium visual list
  const previewFeatures = [
    { label: 'Interactive DSA Simulations', icon: Activity, color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5' },
    { label: 'C++ Code Playground', icon: Code2, color: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5' },
    { label: 'AI Code Review Feedback', icon: Bot, color: 'text-brand-purple border-brand-purple/20 bg-brand-purple/5' },
    { label: 'Placement Certification', icon: GraduationCap, color: 'text-brand-green border-brand-green/20 bg-brand-green/5' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full radial-glow pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-brand-purple/5 rounded-full radial-glow pointer-events-none animate-pulse-slow" />
      
      {/* Inner Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center space-y-8 z-10"
      >
        
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-cyan/25 text-brand-cyan text-xs font-semibold shadow-cyan-glow">
          <Sparkles size={12} className="animate-spin-slow" />
          <span>V1.0 INITIALIZED</span>
        </div>

        {/* Welcome Text Section */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-brand-text-white tracking-tight leading-tight">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-cyan-blue font-black">
              Learn DSA
            </span>
          </h1>
          <p className="text-sm sm:text-base text-brand-text-muted font-medium max-w-xl mx-auto leading-relaxed">
            Your personalized learning dashboard is under construction. Soon you'll be able to access courses, simulations, coding practice, quizzes, AI code review, and progress tracking from here.
          </p>
        </div>

        {/* Coming Soon Illustration Card */}
        <div className="glass p-8 sm:p-10 rounded-3xl border border-brand-border/40 relative overflow-hidden shadow-cyan-glow">
          {/* Subtle grid background mask inside card */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Animated Constructing Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative h-20 w-20 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="text-brand-cyan"
              >
                <Terminal size={38} strokeWidth={1.5} />
              </motion.div>
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-2xl border border-brand-cyan/20 animate-ping opacity-25 pointer-events-none" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-brand-text-white mb-2">
            Module Construction in Progress
          </h3>
          <p className="text-xs text-brand-text-muted font-medium max-w-md mx-auto leading-relaxed mb-6">
            We are preparing the interactive sandboxes and compiler engines. Below are the key visual components currently in development:
          </p>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {previewFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.label}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-[11px] font-semibold text-brand-text-white transition-all ${feat.color}`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="truncate text-left">{feat.label}</span>
                </div>
              );
            })}
          </div>

          {/* Coming Soon Ribbon overlay */}
          <div className="absolute top-3.5 right-3.5 text-[9px] font-bold tracking-widest text-[#071A26] bg-brand-cyan px-2.5 py-0.5 rounded-full select-none shadow-cyan-glow uppercase">
            COMING SOON
          </div>
        </div>

      </motion.div>
    </div>
  );
}
