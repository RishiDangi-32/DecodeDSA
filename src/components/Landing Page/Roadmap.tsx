import { motion } from 'framer-motion';

export default function Roadmap() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Basic C++',
      desc: 'Syntax, pointers, references, control structures, functions, and C++ memory layouts (stack vs heap).',
      badgeColor: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5',
      glow: 'shadow-cyan-glow',
    },
    {
      phase: 'Phase 2',
      title: 'Arrays & Vectors',
      desc: 'Dynamic arrays, sequential search, sorting algorithms (Bubble, Selection, Insertion, Merge, Quick).',
      badgeColor: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5',
      glow: 'shadow-blue-glow',
    },
    {
      phase: 'Phase 3',
      title: 'Linked Lists & Sequences',
      desc: 'Singly linked nodes, chains, insertion/deletion arithmetic, Stacks LIFO, and Queues FIFO.',
      badgeColor: 'text-brand-purple border-brand-purple/20 bg-brand-purple/5',
      glow: 'shadow-purple-glow',
    },
    {
      phase: 'Phase 4',
      title: 'Tree Structures',
      desc: 'Binary search trees, heap structures, segment trees, traversals, and balance factors.',
      badgeColor: 'text-brand-green border-brand-green/20 bg-brand-green/5',
      glow: 'shadow-green-glow',
    },
    {
      phase: 'Phase 5',
      title: 'Graphs Meshes',
      desc: 'Adjacency lists/matrices, traversals (DFS/BFS), shortest path search, and minimum spanning trees.',
      badgeColor: 'text-brand-yellow border-brand-yellow/20 bg-brand-yellow/5',
      glow: 'shadow-yellow-glow',
    },
    {
      phase: 'Phase 6',
      title: 'Advanced Algorithms',
      desc: 'Dynamic Programming (DP), memoization, greedy strategies, string algorithms (KMP), and bit arithmetic.',
      badgeColor: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5',
      glow: 'shadow-cyan-glow',
    },
  ];

  return (
    <section id="roadmap" className="py-24 bg-transparent relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-brand-text-white tracking-tight"
          >
            Syllabus Roadmap
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
            A carefully mapped roadmap starting from compiler basics and leading up to competitive programming standards.
          </motion.p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-brand-cyan/20 ml-4 md:ml-8 space-y-12">
          {phases.map((item, idx) => (
            <div key={item.phase} className="relative pl-8 md:pl-12 group">
              {/* Checkpoint Dot Node */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-brand-bg-primary border-2 border-brand-cyan flex items-center justify-center ${item.glow} group-hover:scale-110 transition-transform`}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-brand-cyan"></div>
              </motion.div>

              {/* Checkpoint Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0D2538]/70 border border-brand-border/20 p-6 rounded-2xl glow-cyan-hover"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${item.badgeColor}`}>
                    {item.phase}
                  </span>
                  <span className="text-[10px] font-bold text-brand-text-muted">WEEK 0{idx + 1} - 0{idx + 2}</span>
                </div>
                <h3 className="text-lg font-bold text-brand-text-white mb-2 group-hover:text-brand-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-text-muted font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
