import { motion } from 'framer-motion';
import { Eye, Activity, Code, Cpu, Gauge, ClipboardCheck, BarChart4 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Interactive Visualizations',
      desc: 'Manipulate data structures directly on screen. Drag pointers, insert nodes, and watch memory elements update in real time.',
      icon: Eye,
      color: 'text-brand-cyan group-hover:text-[#22D3EE]',
      glow: 'shadow-cyan-glow',
    },
    {
      title: 'Step-by-Step Simulation',
      desc: 'Pause, rewind, or forward algorithm execution. Trace pseudocode line-by-line along with visual memory changes.',
      icon: Activity,
      color: 'text-brand-purple group-hover:text-[#A78BFA]',
      glow: 'shadow-purple-glow',
    },
    {
      title: 'Code Playground',
      desc: 'Write C++ code in our embedded playground and compile it instantly via sandboxed compilers to test outputs.',
      icon: Code,
      color: 'text-brand-blue group-hover:text-[#60A5FA]',
      glow: 'shadow-blue-glow',
    },
    {
      title: 'Memory Visualization',
      desc: 'Demystify pointers, recursion, and structures with dynamic memory maps visualizing stack and heap space.',
      icon: Cpu,
      color: 'text-brand-green group-hover:text-[#34D399]',
      glow: 'shadow-green-glow',
    },
    {
      title: 'Algorithm Speed Control',
      desc: 'Adjust execution speeds from 0.25x to 3x to thoroughly analyze fast-sorting swaps or slow tree balancing.',
      icon: Gauge,
      color: 'text-brand-yellow group-hover:text-[#FBBF24]',
      glow: 'shadow-yellow-glow',
    },
    {
      title: 'Quiz & Assessment',
      desc: 'Validate learning curves with module-wise interactive quizzes, edge-case evaluations, and execution output predictors.',
      icon: ClipboardCheck,
      color: 'text-brand-cyan group-hover:text-[#22D3EE]',
      glow: 'shadow-cyan-glow',
    },
    {
      title: 'Progress Tracking',
      desc: 'Monitor learning streaks, track completed algorithm certifications, and evaluate playground code portfolios.',
      icon: BarChart4,
      color: 'text-brand-blue group-hover:text-[#60A5FA]',
      glow: 'shadow-blue-glow',
    },
  ];

  // Card staggered display animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier easing for premium feel
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-transparent relative overflow-hidden">
      
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Background Glowing Ambient Light Blobs */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          {/* Styled Pill Heading */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="px-10 py-3.5 rounded-2xl border border-brand-cyan/70 bg-[#0D2538]/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-shadow duration-300 flex items-center justify-center mb-6"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-[0.18em] uppercase select-none">
              Core Functionalities
            </h2>
          </motion.div>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-brand-text-muted font-medium mt-6 leading-relaxed max-w-2xl text-center"
          >
            A cohesive virtual lab equipped with state-of-the-art tools for C++ coding and visual feedback.
          </motion.p>
        </div>

        {/* Features 3-Column Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover="hover"
                className="relative group h-full bg-gradient-to-b from-[#0D2538]/40 to-[#071A26]/80 backdrop-blur-xl border border-white/[0.04] hover:border-brand-cyan/30 rounded-[24px] p-8 flex flex-col items-center text-center justify-between shadow-2xl transition-all duration-400 overflow-hidden cursor-pointer"
              >
                {/* Glow Overlay behind borders on Hover */}
                <div className="absolute -inset-px bg-gradient-to-b from-brand-cyan/20 to-brand-blue/20 rounded-[24px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-400 pointer-events-none"></div>

                {/* Subtle internal gradient highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-radial from-brand-cyan/8 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center space-y-6 h-full justify-center">
                  
                  {/* Floating Icon Container */}
                  <motion.div 
                    variants={{
                      hover: { 
                        y: -8, 
                        rotate: 8,
                        scale: 1.05,
                        boxShadow: "0 0 25px rgba(0, 229, 255, 0.35)",
                        borderColor: "rgba(0, 229, 255, 0.45)",
                        backgroundColor: "rgba(13, 37, 56, 0.9)"
                      }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-[#0D2538]/80 rounded-2xl border border-white/[0.08] shadow-lg transition-all duration-300 ${feature.color}`}
                  >
                    <Icon size={28} />
                  </motion.div>

                  {/* Info Block */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-brand-text-white tracking-tight group-hover:text-brand-cyan transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-brand-text-muted font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
