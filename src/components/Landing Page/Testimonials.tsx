import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Aman Sharma',
      role: 'BTech CS (2nd Year)',
      initials: 'AS',
      avatarBg: 'bg-gradient-to-tr from-brand-cyan to-brand-blue',
      rating: 5,
      feedback: 'Visualizing pointers solved my heap allocation errors. Reading theory for hours never made pointers click, but seeing the address changes on this playground made it instant.',
    },
    {
      name: 'Priya Nair',
      role: 'BCA Student (1st Year)',
      initials: 'PN',
      avatarBg: 'bg-gradient-to-tr from-brand-purple to-brand-blue',
      rating: 5,
      feedback: 'The stack push/pop visualizer made understanding recursion so straightforward! It is a must-use platform for college students struggling with structural logic.',
    },
    {
      name: 'Rohan Gupta',
      role: 'Engineering Student (1st Year)',
      initials: 'RG',
      avatarBg: 'bg-gradient-to-tr from-brand-green to-brand-cyan',
      rating: 5,
      feedback: 'Highly interactive interface. Love writing my custom C++ templates in the playground, running compilation, and watching element swaps update live on the visualizer.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-brand-text-white tracking-tight"
          >
            What Learners Say
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
            className="text-base text-brand-text-muted font-medium"
          >
            Real feedback from university students and programming beginners.
          </motion.p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-8 rounded-2xl border border-brand-border/20 flex flex-col justify-between hover:border-brand-cyan/30 transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-brand-yellow fill-brand-yellow" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                  "{rev.feedback}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-border/30">
                {/* Avatar Initial */}
                <div className={`h-11 w-11 rounded-full ${rev.avatarBg} flex items-center justify-center font-bold text-xs text-[#071A26] shadow-md`}>
                  {rev.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-text-white">{rev.name}</h4>
                  <p className="text-[11px] font-semibold text-brand-text-muted">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
