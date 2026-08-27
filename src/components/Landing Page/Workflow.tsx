import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, MonitorPlay, Code2, Bot, ClipboardCheck, TrendingUp, ArrowRight, ArrowDown } from 'lucide-react';

export default function Workflow() {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId: any;
    
    const handleAutoScroll = () => {
      if (window.innerWidth < 1024) return;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 4) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1.5;
      }
    };

    if (!isHovered) {
      intervalId = setInterval(handleAutoScroll, 20);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered]);

  const steps = [
    {
      num: '1',
      icon: BookOpen,
      title: 'Select Course',
      desc: 'Choose your Course, Module and Lesson to begin your structured learning journey.',
      glowColor: 'rgba(6, 182, 212, 0.4)', // Cyan
      borderClass: 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6, 182, 212, 0.2)]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      badgeBg: 'bg-cyan-500 text-black',
    },
    {
      num: '2',
      icon: Brain,
      title: 'Understand Theory',
      desc: 'Learn concepts through beginner-friendly explanations, visuals and examples.',
      glowColor: 'rgba(59, 130, 246, 0.4)', // Blue
      borderClass: 'hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59, 130, 246, 0.2)]',
      iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      badgeBg: 'bg-blue-500 text-white',
    },
    {
      num: '3',
      icon: MonitorPlay,
      title: 'Interactive Simulator',
      desc: 'Explore real-time simulations to understand every data structure and algorithm visually.',
      glowColor: 'rgba(139, 92, 246, 0.4)', // Purple
      borderClass: 'hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(139, 92, 246, 0.2)]',
      iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      badgeBg: 'bg-purple-500 text-white',
    },
    {
      num: '4',
      icon: Code2,
      title: 'Practice in C++',
      desc: 'Write, compile and execute C++ code directly inside the interactive compiler.',
      glowColor: 'rgba(16, 185, 129, 0.4)', // Green
      borderClass: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16, 185, 129, 0.2)]',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badgeBg: 'bg-emerald-500 text-black',
    },
    {
      num: '5',
      icon: Bot,
      title: 'AI Code Review',
      desc: 'Receive instant feedback, optimization tips and personalized coding suggestions.',
      glowColor: 'rgba(249, 115, 22, 0.4)', // Orange
      borderClass: 'hover:border-orange-400/50 hover:shadow-[0_0_30px_rgba(249, 115, 22, 0.2)]',
      iconBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      badgeBg: 'bg-orange-500 text-white',
    },
    {
      num: '6',
      icon: ClipboardCheck,
      title: 'Solve Quiz',
      desc: 'Test your understanding with topic-wise quizzes and coding challenges.',
      glowColor: 'rgba(234, 179, 8, 0.4)', // Yellow
      borderClass: 'hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(234, 179, 8, 0.2)]',
      iconBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      badgeBg: 'bg-yellow-500 text-black',
    },
    {
      num: '7',
      icon: TrendingUp,
      title: 'Track Progress',
      desc: 'Monitor learning progress, achievements, streaks and placement readiness.',
      glowColor: 'rgba(20, 184, 166, 0.4)', // Teal
      borderClass: 'hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(20, 184, 166, 0.2)]',
      iconBg: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
      badgeBg: 'bg-teal-500 text-black',
    },
  ];

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
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
    <section id="workflow" className="pt-0 pb-20 relative overflow-hidden bg-transparent">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-brand-cyan/5 rounded-full radial-glow pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Scrollable container on desktop / Stacked layout on mobile */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full overflow-x-auto pb-10 pt-4 px-4 no-scrollbar"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col lg:flex-row items-center lg:items-stretch lg:min-w-max gap-8 lg:gap-0 mx-auto justify-center"
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.title} className="flex flex-col lg:flex-row items-center">
                  
                  {/* Card Container */}
                  <motion.div
                    variants={cardVariants}
                    className={`w-[240px] h-[280px] rounded-[22px] bg-[#0D1928]/55 border border-white/8 backdrop-blur-[18px] shadow-[0_0_25px_rgba(0,229,255,0.08)] hover:-translate-y-2.5 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center group cursor-default relative ${step.borderClass}`}
                  >
                    {/* Glowing effect inside card */}
                    <div 
                      className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 20px ${step.glowColor}` }}
                    ></div>

                    {/* Circular Icon Container */}
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-solid mb-4 flex-shrink-0 ${step.iconBg}`}>
                      
                      {/* Floating Icon animation wrapper */}
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Icon size={64} strokeWidth={1.0} />
                      </motion.div>

                      {/* Floating Pulsing Number Badge at bottom center */}
                      <div className="absolute -bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                        <motion.span 
                          animate={{ scale: [1, 1.06, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                          className="w-6 h-6 text-xs font-bold text-white rounded-full bg-[#071A26] border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center select-none pointer-events-auto"
                        >
                          {step.num}
                        </motion.span>
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-base font-semibold text-brand-text-white mb-2 leading-snug">
                      {step.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs font-medium text-brand-text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Connected Neon Arrow */}
                  {!isLast && (
                    <div className="flex items-center justify-center py-2 lg:py-0 lg:px-5 flex-shrink-0">
                      {/* Desktop horizontal arrow */}
                      <motion.div 
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden lg:block text-brand-cyan/40"
                      >
                        <ArrowRight size={24} className="drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
                      </motion.div>

                      {/* Mobile vertical arrow */}
                      <motion.div 
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="lg:hidden text-brand-cyan/40"
                      >
                        <ArrowDown size={24} className="drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
                      </motion.div>

                    </div>
                  )}

                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
