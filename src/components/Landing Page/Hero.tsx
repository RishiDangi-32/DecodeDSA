import { motion } from 'framer-motion';
import { Play, BookOpen } from 'lucide-react';
import projectLogo from '../../assets/images/Project_logo.png';
import { navigate } from '../../utils/navigation';

export default function Hero() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="home" className="relative pt-36 lg:pt-40 pb-8 overflow-hidden grid-bg">
      {/* Background Radial Glow Circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full radial-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full radial-glow pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 text-left space-y-6 flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-cyan/20 text-brand-cyan text-xs font-semibold"
            >
              <span>🚀</span>
              <span>MITS-DU Interactive Learning Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-text-white leading-tight tracking-tight"
            >
              Master DSA with {' '}
              <span className="bg-clip-text text-transparent bg-gradient-cyan-blue font-black block sm:inline">
                Interactive Visualizations
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              variants={itemVariants}
              className="text-sm sm:text-base text-brand-text-muted max-w-2xl font-medium leading-relaxed"
            >
              Build strong C++ and DSA fundamentals with Interactive Simulations, Algorithm Animated Walkthroughs, Real-Time Code Visualization, and Placement-Focused Learning Path designed for Interview success.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-start pt-2"
            >
              <a 
                href="/dashboard" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                className="px-8 py-4 rounded-xl text-base font-semibold text-[#071A26] bg-brand-cyan shadow-cyan-glow hover:shadow-cyan-glow-intense hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
              >
                <Play size={18} fill="#071A26" />
                <span>Start Learning</span>
              </a>
              <a 
                href="#roadmap" 
                className="px-8 py-4 rounded-xl text-base font-semibold text-brand-text-white glass border border-brand-cyan/20 hover:border-brand-cyan/50 hover:bg-brand-cyan/5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen size={18} />
                <span>Explore Roadmap</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Project Logo & Placement Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col items-center justify-center gap-5 relative z-10"
          >
            {/* Circular Project Logo Frame */}
            <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-white border-4 border-brand-cyan/80 shadow-[0_0_50px_rgba(0,229,255,0.4)] flex items-center justify-center overflow-hidden relative">
              <img 
                src={projectLogo} 
                alt="DSA Visualizer Logo" 
                className="h-full w-full object-cover scale-[1.03] rounded-full"
              />
            </div>

            {/* Premium Placement Badge */}
            <div className="relative w-[290px] h-[48px] rounded-2xl bg-emerald-300 border border-emerald-400 shadow-[0_0_20px_rgba(10,185,129,0.25)] flex items-center justify-center overflow-hidden select-none">
              {/* Shimmer Effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "linear",
                  repeatDelay: 1.5
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
              />
              
              {/* Text */}
              <span className="text-sm font-black text-[#071A26] tracking-[0.1em] uppercase font-sans leading-none text-center">
                Placement-Oriented Course
              </span>
            </div>
            
            {/* Outer Ambient Glow Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
