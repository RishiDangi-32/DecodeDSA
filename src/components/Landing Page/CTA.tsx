import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { navigate } from '../../utils/navigation';

export default function CTA() {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background Neon Blur Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[220px] bg-brand-cyan/10 rounded-full radial-glow pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-brand-purple/10 rounded-full radial-glow pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main CTA Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-7 sm:p-9 rounded-2xl border border-brand-border/40 text-center relative overflow-hidden shadow-cyan-glow"
        >
          {/* Animated background gradient shine */}
          <div className="absolute inset-0 bg-gradient-cyan-blue opacity-5 mix-blend-overlay pointer-events-none animate-pulse-slow"></div>

          <div className="space-y-4 relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight leading-tight">
              Ready to Master Data Structures?
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted font-medium max-w-md mx-auto leading-relaxed">
              Step into the visual sandbox playground. Compile code, manipulate pointers, and level up your software engineering foundation today.
            </p>
            <div className="pt-2 flex justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-[#071A26] bg-brand-cyan shadow-cyan-glow hover:shadow-cyan-glow-intense hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Start Learning Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Decorative floating dots */}
          <div className="absolute top-5 left-5 h-1.5 w-1.5 rounded-full bg-brand-cyan opacity-40 animate-ping"></div>
          <div className="absolute bottom-5 right-5 h-1.5 w-1.5 rounded-full bg-brand-purple opacity-40 animate-ping"></div>
        </motion.div>
      </div>
    </section>
  );
}
