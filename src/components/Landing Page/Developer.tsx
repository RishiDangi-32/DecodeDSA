import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Developer() {
  return (
    <section className="py-24 bg-transparent relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-brand-text-white tracking-tight"
          >
            Meet the Developer
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[3px] w-24 bg-brand-cyan mx-auto rounded-full"
          ></motion.div>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto glass p-8 rounded-2xl border border-brand-border/20 shadow-cyan-glow flex flex-col items-center gap-6"
        >
          {/* Circular avatar image placeholder using creative vector elements */}
          <div className="relative h-28 w-28 rounded-full border-2 border-brand-cyan shadow-cyan-glow-intense flex items-center justify-center bg-[#071A26] overflow-hidden group">
            <span className="text-3xl font-extrabold text-brand-cyan group-hover:scale-110 transition-transform select-none">
              RD
            </span>
            <div className="absolute inset-0 bg-gradient-cyan-blue opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-brand-text-white">Rishi Dangi</h3>
            <p className="text-sm font-semibold text-brand-cyan">Creator & Principal Engineer</p>
            <p className="text-xs font-semibold text-brand-text-muted">DSA & Visualizations Enthusiast</p>
          </div>

          <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
            Building open-source educational software to make complex computer science topics accessible and engaging for college students and engineering beginners.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 pt-4 border-t border-brand-border/30 w-full justify-center">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 bg-brand-bg-primary border border-brand-border/40 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 bg-brand-bg-primary border border-brand-border/40 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:contact@dsaverse.com"
              className="p-2.5 bg-brand-bg-primary border border-brand-border/40 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
            >
              <Mail size={20} />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
