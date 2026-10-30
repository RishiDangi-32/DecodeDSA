import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, GraduationCap, Calendar, Award, Code2, BookOpen } from 'lucide-react';
import rishiImg from '../../assets/images/Rishi.png';
import abhishekImg from '../../assets/images/Abhishek Dixit.png';

function ProfileAvatar({ src, fallbackText, alt, size = 'md' }: { src?: string; fallbackText: string; alt: string; size?: 'sm' | 'md' }) {
  const [imgError, setImgError] = useState(false);
  const dimensionClass = size === 'sm' ? 'h-20 w-20' : 'h-28 w-28';

  return (
    <div className={`relative ${dimensionClass} rounded-full border-2 border-brand-cyan shadow-cyan-glow-intense flex items-center justify-center bg-[#071A26] overflow-hidden group shrink-0`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setImgError(true)}
          className="h-full w-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <span className={`${size === 'sm' ? 'text-xl' : 'text-2xl sm:text-3xl'} font-extrabold text-brand-cyan group-hover:scale-110 transition-transform select-none`}>
          {fallbackText}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-cyan-blue opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
    </div>
  );
}

export default function Developer() {
  const rishiSkills = ['C++', 'Python', 'HTML', 'CSS', 'JavaScript', 'SQL', 'PostgreSQL'];

  const rishiAchievements = [
    'Quantumnurd Hackathon - Secured Top Rank in the National-Level Hackathon.',
    'Research Publication - Authored a Research Paper on "Understanding Consumer Decision Making using Explainable Artificial Intelligence (XAI)" published in the Proceedings of ISCMCTR-2025',
    'ACM Technical Society - Head of Operations, organized coding challenges and workshops for 500+ Students.',
    'NPTEL Certification - Achieved Silver Elite Certification in NPTEL course "Data Analytics using Python" and secured a place in the Topper Category.',
    'Micro Project Expo - Secured Third Prize at MITS Gwalior for developing a Linear Regression-based Salary Prediction Model using Python and data-driven analysis.',
  ];

  return (
    <section id="developers" className="py-24 bg-transparent relative overflow-hidden">
      {/* Dynamic Background Blurs matching landing page language */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full glass border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-widest uppercase mb-2"
          >
            CORE TEAM
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-text-white tracking-tight"
          >
            Meet the Developers
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[3px] w-24 bg-brand-cyan mx-auto rounded-full"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-cyan-100/90 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Engineers who designed, built, and deployed the Exam Seating Management System
          </motion.p>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-20">
          
          {/* CARD 1 — RAGHAV */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl border border-brand-border/30 p-8 sm:p-10 shadow-cyan-glow hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <ProfileAvatar fallbackText="RDB" alt="Raghav Deepal Behere" />
                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-extrabold text-brand-text-white">Raghav Deepak Behere</h3>
                  <p className="text-sm font-bold text-brand-cyan uppercase tracking-wider">Developer</p>
                  <p className="text-xs font-semibold text-cyan-200">Graphics & Logic Designer</p>
                </div>
              </div>

              {/* Information Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/20 flex items-center gap-3">
                  <GraduationCap className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">ROLE</div>
                    <div className="text-xs font-semibold text-white">Developer</div>
                  </div>
                </div>
                <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/20 flex items-center gap-3">
                  <Calendar className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">CONTRIBUTION</div>
                    <div className="text-xs font-semibold text-white">Logic & Graphics</div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} /> ABOUT
                </h4>
                <p className="text-sm text-cyan-50 leading-relaxed font-medium">
                  Building open-source educational software to make complex computer science topics accessible and engaging for college students and engineering beginners.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={14} /> TECHNICAL FOCUS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Graphics Design', 'Algorithm Logic', 'UI Systems', 'C++', 'Data Structures'].map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-cyan/15 border border-brand-cyan/30 text-cyan-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-6 mt-8 border-t border-brand-border/30 justify-center sm:justify-start">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Raghav GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Raghav LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@dsaverse.com"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Raghav Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* CARD 2 — RISHI DANGI */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="glass rounded-3xl border border-brand-border/30 p-8 sm:p-10 shadow-cyan-glow hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <ProfileAvatar src={rishiImg} fallbackText="RD" alt="Rishi Dangi" />
                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-extrabold text-brand-text-white">Rishi Dangi</h3>
                  <p className="text-sm font-bold text-brand-cyan uppercase tracking-wider">Full-Stack Developer</p>
                  <p className="text-xs font-semibold text-cyan-200">Computer Science & Business System</p>
                </div>
              </div>

              {/* Information Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/20 flex items-center gap-3">
                  <GraduationCap className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">BRANCH</div>
                    <div className="text-xs font-semibold text-white">Computer Science & Business System</div>
                  </div>
                </div>
                <div className="glass-card p-3.5 rounded-xl border border-brand-cyan/20 flex items-center gap-3">
                  <Calendar className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <div className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">BATCH</div>
                    <div className="text-xs font-semibold text-white">2024–2028</div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} /> ABOUT
                </h4>
                <p className="text-sm text-cyan-50 leading-relaxed font-medium">
                  Passionate Software Developer driven by Curiosity, Continuous Learning, and a Passion for turning Innovative Ideas into Impactful Solutions.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={14} /> TECHNICAL SKILLS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rishiSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-cyan/15 border border-brand-cyan/30 text-cyan-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Achievements */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <Award size={14} /> KEY ACHIEVEMENTS
                </h4>
                <ol className="space-y-2.5 text-xs text-cyan-100 font-medium list-decimal list-inside leading-relaxed">
                  {rishiAchievements.map((item) => (
                    <li key={item} className="pl-1">
                      <span className="text-slate-100 font-semibold">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-6 mt-8 border-t border-brand-border/30 justify-center sm:justify-start">
              <a 
                href="https://github.com/RishiDangi-32" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Rishi GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/rishi-dangi-a03ba3325" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Rishi LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:dangirishi32@gmail.com"
                className="p-2.5 bg-[#071A26] border border-brand-border/40 text-cyan-100 hover:text-brand-cyan hover:border-brand-cyan/60 rounded-xl transition-all"
                aria-label="Rishi Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

        </div>

        {/* UNDER THE GUIDANCE OF (Mentor Subsection) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl border border-brand-border/30 p-8 sm:p-12 shadow-cyan-glow text-center"
        >
          <div className="text-center mb-10 space-y-3">
            <h3 className="text-xs font-bold text-brand-cyan uppercase tracking-widest">
              ACADEMIC ADVISORS & MENTORS
            </h3>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              UNDER THE GUIDANCE OF
            </h4>
            <div className="h-[2px] w-16 bg-brand-cyan/60 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            
            {/* Mentor 1 — Dr. Abhishek Dixit */}
            <div className="glass-card p-6 rounded-2xl border border-brand-cyan/20 flex flex-col items-center text-center gap-4 hover:border-brand-cyan/40 transition-all">
              <ProfileAvatar src={abhishekImg} fallbackText="AD" alt="Dr. Abhishek Dixit" size="sm" />
              <div className="space-y-1">
                <h5 className="text-lg font-bold text-white">Dr. Abhishek Dixit</h5>
                <p className="text-xs font-semibold text-brand-cyan">Assistant Professor & Head, CCST</p>
              </div>
            </div>

            {/* Mentor 2 — Atul Chauhan */}
            <div className="glass-card p-6 rounded-2xl border border-brand-cyan/20 flex flex-col items-center text-center gap-4 hover:border-brand-cyan/40 transition-all">
              <ProfileAvatar fallbackText="AC" alt="Atul Chauhan" size="sm" />
              <div className="space-y-1">
                <h5 className="text-lg font-bold text-white">Atul Chauhan</h5>
                <p className="text-xs font-semibold text-brand-cyan">Programmer, MITS-DU</p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
