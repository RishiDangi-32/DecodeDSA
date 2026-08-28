import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Layers3, Network } from 'lucide-react';

const roadmapModules = [
  {
    id: 1, title: 'C++ Fundamentals', short: 'Build your core C++ knowledge: syntax, memory, OOP and STL.', topicCount: 18, completedTopics: 6,
    route: '/modules/cpp-fundamentals', color: '#ff4f73', icon: Code2,
    topics: ['Basic Syntax', 'Operators', 'Control Flow', 'Functions', 'Arrays & Strings', 'Pointers', 'References', 'OOP Basics', 'Constructors', 'Memory Model', 'Recursion', 'STL Basics'],
  },
  {
    id: 2, title: 'Data Structures', short: 'Learn essential data structures from basics to advanced.', topicCount: 30, completedTopics: 0,
    route: '/modules/data-structures', color: '#8bdc38', icon: Layers3,
    topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Hashing', 'Trees', 'Binary Search Trees', 'Heaps', 'Tries', 'Graphs', 'Union-Find', 'Advanced Structures'],
  },
  {
    id: 3, title: 'Algorithms', short: 'Master algorithms, problem solving and placement preparation.', topicCount: 35, completedTopics: 0,
    route: '/modules/algorithms', color: '#8755ff', icon: Network,
    topics: ['Searching', 'Sorting', 'Two Pointers', 'Sliding Window', 'Prefix Sums', 'Recursion', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms', 'Shortest Paths', 'MST', 'Bit Manipulation'],
  },
];

function Road() {
  const roadPath = 'M-40 82 C70 15 130 145 245 80 S420 15 535 80 S710 145 825 80 S1000 15 1120 80 S1240 145 1300 80';
  return (
    <div className="pointer-events-none absolute left-1/2 top-[56px] z-0 hidden h-36 w-[calc(100%+12rem)] -translate-x-1/2 overflow-visible md:block">
      <svg viewBox="0 0 1200 150" className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="road-edge-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff4f73" /><stop offset=".34" stopColor="#ff4f73" />
            <stop offset=".5" stopColor="#8bdc38" /><stop offset=".67" stopColor="#8bdc38" />
            <stop offset="1" stopColor="#8755ff" />
          </linearGradient>
        </defs>
        <path d={roadPath} fill="none" stroke="#071020" strokeWidth="78" strokeLinecap="round" />
        <path d={roadPath} fill="none" stroke="#18263f" strokeWidth="70" strokeLinecap="round" />
        <path d={roadPath} fill="none" stroke="url(#road-edge-gradient)" strokeOpacity=".95" strokeWidth="3" strokeLinecap="round" />
        <path d={roadPath} fill="none" stroke="#d6e0ef" strokeOpacity=".8" strokeWidth="2" strokeDasharray="15 14" />
        <path id="road-car-path" d={roadPath} fill="none" />
        <g>
          <animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#road-car-path" /></animateMotion>
          <g transform="translate(-30 -15)">
            <ellipse cx="30" cy="30" rx="34" ry="7" fill="#020914" opacity=".65" />
            {/* Rolls-Royce Body */}
            <path d="M 2 20 L 6 13 Q 12 10 22 9 L 34 9 Q 44 10 52 14 L 58 17 Q 60 21 57 24 L 5 24 Q 2 23 2 20 Z" fill="#88ded4" stroke="#5eead4" strokeWidth="1" />
            {/* Roof & Pillars */}
            <path d="M 16 10 L 23 3 Q 32 2 41 4 L 49 13 Z" fill="#88ded4" stroke="#5eead4" strokeWidth="0.8" />
            {/* Tinted Windows with Chrome Trim */}
            <path d="M 18 10.5 L 24 4.5 Q 31 3.5 39 5 L 39 10.5 Z" fill="#091827" stroke="#e2e8f0" strokeWidth="0.8" />
            <path d="M 40.5 10.5 L 40.5 5.2 Q 44.5 6 47.5 12 L 40.5 10.5 Z" fill="#091827" stroke="#e2e8f0" strokeWidth="0.8" />
            {/* Pantheon Grille */}
            <rect x="55" y="14" width="4" height="9" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="56.3" y1="15" x2="56.3" y2="22" stroke="#475569" strokeWidth="0.6" />
            <line x1="57.7" y1="15" x2="57.7" y2="22" stroke="#475569" strokeWidth="0.6" />
            {/* Spirit of Ecstasy Emblem */}
            <path d="M 57 12 L 56 10 C 56 9 58 9 58 10 Z" fill="#ffffff" />
            {/* Headlight & Taillight */}
            <rect x="53" y="14.5" width="2.5" height="2" rx="0.5" fill="#a5f3fc" />
            <rect x="2" y="16" width="2" height="3" rx="0.5" fill="#ef4444" />
            {/* Side Chrome Line */}
            <line x1="8" y1="17" x2="52" y2="17" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
            <rect x="28" y="18" width="4" height="1.5" rx="0.5" fill="#f8fafc" />
            {/* Wheels with RR Hubcaps */}
            <g transform="translate(14, 23)">
              <circle cx="0" cy="0" r="5.5" fill="#090d16" stroke="#94a3b8" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
              <circle cx="0" cy="0" r="1.2" fill="#0f172a" />
            </g>
            <g transform="translate(46, 23)">
              <circle cx="0" cy="0" r="5.5" fill="#090d16" stroke="#94a3b8" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
              <circle cx="0" cy="0" r="1.2" fill="#0f172a" />
            </g>
            {/* Light Streak */}
            <path d="M -12 19 L 0 19" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Roadmap() {
  const shouldReduceMotion = useReducedMotion();
  const [openModule, setOpenModule] = useState<number | null>(null);
  return (
    <section id="roadmap" className="relative overflow-hidden bg-[#020a18] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Syllabus Roadmap</h2>
          <div className="mx-auto my-4 h-[3px] w-24 rounded-full bg-cyan-400" />
          <p className="text-base leading-7 text-slate-400 sm:text-lg">A carefully structured learning path from C++ fundamentals to advanced algorithms and placement-ready problem solving.</p>
        </motion.div>
        <div className="relative z-10">
          <Road />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 pt-28 md:grid-cols-3 md:gap-7 md:pt-24">
            {roadmapModules.map((mod, index) => {
              const progress = Math.round((mod.completedTopics / mod.topicCount) * 100);
              const Icon = mod.icon;
              return (
                <motion.div key={mod.id} initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12, duration: 0.45 }} className="group relative text-center" onMouseEnter={() => setOpenModule(mod.id)} onMouseLeave={() => setOpenModule(null)} onFocus={() => setOpenModule(mod.id)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpenModule(null); }}>
                  <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-[#071328] shadow-[0_0_25px]" style={{ borderColor: mod.color, color: mod.color, boxShadow: `0 0 24px ${mod.color}55` }}><Icon size={29} strokeWidth={2.5} /><span className="absolute -bottom-5 h-5 border-l border-dashed" style={{ borderColor: `${mod.color}99` }} /></div>
                  <article className="relative rounded-xl border bg-[#081326]/95 p-5 text-left transition-transform duration-300 group-hover:-translate-y-1" style={{ borderColor: `${mod.color}aa`, boxShadow: `0 10px 30px ${mod.color}12` }}>
                    <Link to={mod.route} className="block rounded focus:outline-none focus:ring-2 focus:ring-cyan-400/60">
                      <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: mod.color }}>{mod.id}</div>
                      <h3 className="mt-2 text-center text-lg font-bold text-white">{mod.title}</h3>
                      <p className="mt-3 text-center text-sm leading-6 text-slate-400">{mod.short}</p>
                      <div className="mt-5 flex items-center justify-between text-xs font-semibold" style={{ color: mod.color }}><span>{mod.completedTopics} / {mod.topicCount} topics</span><span>{progress}%</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: mod.color }} /></div>
                    </Link>
                  </article>
                  <div className={`grid overflow-hidden rounded-b-xl border-x border-b bg-[#071124] text-left transition-all duration-500 ease-out ${openModule === mod.id ? 'max-h-72 translate-y-0 opacity-100' : 'max-h-0 translate-y-[-8px] opacity-0'}`} style={{ borderColor: `${mod.color}88` }} aria-hidden={openModule !== mod.id}>
                    <div className="p-4"><h4 className="mb-3 text-xs font-bold" style={{ color: mod.color }}>Topics you'll learn</h4><div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-300">{mod.topics.map((topic) => <span key={topic} className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: mod.color }} />{topic}</span>)}</div><p className="mt-3 text-center text-[11px]" style={{ color: mod.color }}>+{mod.topicCount - mod.topics.length} more topics</p></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-5 rounded-xl border border-slate-800 bg-[#071124]/80 px-6 py-5 sm:grid-cols-4">
          {[['#ff4f73', 'Completed', 'Well done!'], ['#8bdc38', 'In Progress', 'Keep going!'], ['#00bfff', 'Available', 'Start learning'], ['#71809b', 'Locked', 'Complete previous']].map(([color, label, caption]) => <div key={label} className="flex items-center gap-3"><span className="h-6 w-6 shrink-0 rounded-full border" style={{ borderColor: color }} /><div><div className="text-sm font-semibold text-white">{label}</div><div className="text-xs text-slate-400">{caption}</div></div></div>)}
        </div>
      </div>
    </section>
  );
}
