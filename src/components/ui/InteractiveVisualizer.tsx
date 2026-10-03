import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, FastForward, Shuffle, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

type Algorithm = 'bubbleSort' | 'selectionSort' | 'linearSearch' | 'binarySearch';

export default function InteractiveVisualizer() {
  const [algo, setAlgo] = useState<Algorithm>('bubbleSort');
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(600); // ms delay
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [target, setTarget] = useState<number>(45); // target for searching
  
  // Visual tracking states
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [binaryRange, setBinaryRange] = useState<{ low: number; mid: number; high: number } | null>(null);

  // Simulation execution queues
  const stepsRef = useRef<any[]>([]);
  const stepIndexRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  // Generate random array
  const generateArray = (size = arraySize) => {
    setIsPlaying(false);
    clearSimulationState();
    
    let arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 85) + 15);
    }
    
    if (algo === 'binarySearch') {
      // Binary search requires sorted array!
      arr.sort((a, b) => a - b);
    }
    setArray(arr);
  };

  const clearSimulationState = () => {
    setActiveIndex(null);
    setCompareIndex(null);
    setSortedIndices([]);
    setFoundIndex(null);
    setBinaryRange(null);
    stepsRef.current = [];
    stepIndexRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    generateArray();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [algo, arraySize]);

  // Generate steps for Bubble Sort
  const buildBubbleSortSteps = () => {
    const steps: any[] = [];
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Step 1: Highlight comparison
        steps.push({
          type: 'compare',
          index1: j,
          index2: j + 1,
          array: [...arr],
          sorted: [...sortedIndices],
          desc: `Compare element at index ${j} (${arr[j]}) and index ${j+1} (${arr[j+1]})`
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          
          // Step 2: Highlight swap
          steps.push({
            type: 'swap',
            index1: j,
            index2: j + 1,
            array: [...arr],
            sorted: [...sortedIndices],
            desc: `${arr[j+1]} > ${arr[j]}, swap elements!`
          });
        }
      }
      // Add sorted index
      steps.push({
        type: 'sorted',
        index1: null,
        index2: null,
        array: [...arr],
        sorted: [...Array(n).keys()].slice(n - i - 1),
        desc: `Element at index ${n - i - 1} is in its final position.`
      });
    }
    steps.push({
      type: 'sorted',
      index1: null,
      index2: null,
      array: [...arr],
      sorted: [...Array(n).keys()],
      desc: 'Array fully sorted!'
    });
    return steps;
  };

  // Generate steps for Selection Sort
  const buildSelectionSortSteps = () => {
    const steps: any[] = [];
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        type: 'compare',
        index1: i,
        index2: minIdx,
        array: [...arr],
        sorted: [...Array(i).keys()],
        desc: `Assume minimum index is ${i} (${arr[i]})`
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          type: 'compare',
          index1: j,
          index2: minIdx,
          array: [...arr],
          sorted: [...Array(i).keys()],
          desc: `Check if index ${j} (${arr[j]}) < minIndex element (${arr[minIdx]})`
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'compare',
            index1: j,
            index2: minIdx,
            array: [...arr],
            sorted: [...Array(i).keys()],
            desc: `New minimum element found at index ${j} (${arr[j]})`
          });
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        steps.push({
          type: 'swap',
          index1: i,
          index2: minIdx,
          array: [...arr],
          sorted: [...Array(i).keys()],
          desc: `Swap current element (${arr[minIdx]}) with min element (${arr[i]})`
        });
      }

      steps.push({
        type: 'sorted',
        index1: null,
        index2: null,
        array: [...arr],
        sorted: [...Array(i + 1).keys()],
        desc: `Element at index ${i} is in its final position.`
      });
    }

    steps.push({
      type: 'sorted',
      index1: null,
      index2: null,
      array: [...arr],
      sorted: [...Array(n).keys()],
      desc: 'Array fully sorted!'
    });
    return steps;
  };

  // Generate steps for Linear Search
  const buildLinearSearchSteps = () => {
    const steps: any[] = [];
    const arr = [...array];
    let found = false;

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        type: 'compare',
        index1: i,
        index2: null,
        array: [...arr],
        desc: `Checking if element at index ${i} (${arr[i]}) matches target ${target}`
      });

      if (arr[i] === target) {
        steps.push({
          type: 'found',
          index1: i,
          index2: null,
          array: [...arr],
          desc: `Target ${target} found at index ${i}!`
        });
        found = true;
        break;
      }
    }

    if (!found) {
      steps.push({
        type: 'notFound',
        index1: null,
        index2: null,
        array: [...arr],
        desc: `Target ${target} was not found in the array.`
      });
    }

    return steps;
  };

  // Generate steps for Binary Search
  const buildBinarySearchSteps = () => {
    const steps: any[] = [];
    const arr = [...array]; // Sorted
    let low = 0;
    let high = arr.length - 1;
    let found = false;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      steps.push({
        type: 'binaryBounds',
        low,
        mid,
        high,
        array: [...arr],
        desc: `Set search boundaries: Low=${low}, Mid=${mid} (${arr[mid]}), High=${high}`
      });

      if (arr[mid] === target) {
        steps.push({
          type: 'found',
          index1: mid,
          index2: null,
          array: [...arr],
          desc: `Target ${target} found at index ${mid}!`
        });
        found = true;
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
        steps.push({
          type: 'binaryBounds',
          low,
          mid,
          high,
          array: [...arr],
          desc: `${arr[mid]} < target ${target}, shift search to right boundary (Low = mid + 1 = ${low})`
        });
      } else {
        high = mid - 1;
        steps.push({
          type: 'binaryBounds',
          low,
          mid,
          high,
          array: [...arr],
          desc: `${arr[mid]} > target ${target}, shift search to left boundary (High = mid - 1 = ${high})`
        });
      }
    }

    if (!found) {
      steps.push({
        type: 'notFound',
        index1: null,
        index2: null,
        array: [...arr],
        desc: `Search range exhausted. Target ${target} not found.`
      });
    }

    return steps;
  };

  // Prepare and start execution simulation
  const startSimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (stepIndexRef.current === 0) {
      // Generate step history
      let steps: any[] = [];
      if (algo === 'bubbleSort') steps = buildBubbleSortSteps();
      else if (algo === 'selectionSort') steps = buildSelectionSortSteps();
      else if (algo === 'linearSearch') steps = buildLinearSearchSteps();
      else if (algo === 'binarySearch') steps = buildBinarySearchSteps();
      
      stepsRef.current = steps;
    }

    setIsPlaying(true);
    runNextStep();
  };

  const runNextStep = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const idx = stepIndexRef.current;
      const steps = stepsRef.current;

      if (idx >= steps.length) {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        toast.success('Simulation Completed!');
        return;
      }

      const step = steps[idx];
      setArray(step.array);
      
      if (step.type === 'compare' || step.type === 'swap') {
        setActiveIndex(step.index1);
        setCompareIndex(step.index2);
        setSortedIndices(step.sorted || []);
        setFoundIndex(null);
        setBinaryRange(null);
      } else if (step.type === 'sorted') {
        setActiveIndex(null);
        setCompareIndex(null);
        setSortedIndices(step.sorted);
      } else if (step.type === 'found') {
        setFoundIndex(step.index1);
        setActiveIndex(null);
        setCompareIndex(null);
      } else if (step.type === 'binaryBounds') {
        setBinaryRange({ low: step.low, mid: step.mid, high: step.high });
        setActiveIndex(null);
        setCompareIndex(null);
      } else if (step.type === 'notFound') {
        setActiveIndex(null);
        setCompareIndex(null);
        setBinaryRange(null);
      }

      stepIndexRef.current = idx + 1;
    }, speed);
  };

  // Update speed during run
  useEffect(() => {
    if (isPlaying) {
      runNextStep();
    }
  }, [speed]);

  const stepForward = () => {
    if (stepIndexRef.current === 0) {
      let steps: any[] = [];
      if (algo === 'bubbleSort') steps = buildBubbleSortSteps();
      else if (algo === 'selectionSort') steps = buildSelectionSortSteps();
      else if (algo === 'linearSearch') steps = buildLinearSearchSteps();
      else if (algo === 'binarySearch') steps = buildBinarySearchSteps();
      stepsRef.current = steps;
    }

    const idx = stepIndexRef.current;
    const steps = stepsRef.current;

    if (idx >= steps.length) {
      toast.success('Simulation Completed!');
      return;
    }

    const step = steps[idx];
    setArray(step.array);
    
    if (step.type === 'compare' || step.type === 'swap') {
      setActiveIndex(step.index1);
      setCompareIndex(step.index2);
      setSortedIndices(step.sorted || []);
      setFoundIndex(null);
      setBinaryRange(null);
    } else if (step.type === 'sorted') {
      setActiveIndex(null);
      setCompareIndex(null);
      setSortedIndices(step.sorted);
    } else if (step.type === 'found') {
      setFoundIndex(step.index1);
    } else if (step.type === 'binaryBounds') {
      setBinaryRange({ low: step.low, mid: step.mid, high: step.high });
    }

    stepIndexRef.current = idx + 1;
  };

  const getStepDescription = () => {
    const idx = stepIndexRef.current - 1;
    if (idx >= 0 && idx < stepsRef.current.length) {
      return stepsRef.current[idx].desc;
    }
    return 'Click "Play" or "Step" to begin the algorithm execution.';
  };

  // Check custom class for bars
  const getBarClass = (idx: number) => {
    if (foundIndex === idx) return 'bg-brand-green shadow-[0_0_20px_rgba(34,197,94,0.4)] border-brand-green';
    if (binaryRange) {
      if (binaryRange.mid === idx) return 'bg-brand-yellow border-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.3)]';
      if (idx >= binaryRange.low && idx <= binaryRange.high) return 'bg-brand-blue/30 border-brand-blue/50';
    }
    if (activeIndex === idx) return 'bg-brand-cyan shadow-cyan-glow border-brand-cyan';
    if (compareIndex === idx) return 'bg-brand-purple shadow-purple-glow border-brand-purple';
    if (sortedIndices.includes(idx)) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    return 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-text-muted';
  };

  return (
    <div className="glass p-6 sm:p-8 rounded-3xl border border-brand-border/15 space-y-6">
      
      {/* Visualizer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/10 pb-4">
        <div className="flex items-center gap-3">
          <Settings className="text-brand-cyan" size={18} />
          <select
            value={algo}
            onChange={(e) => { setAlgo(e.target.value as Algorithm); }}
            className="bg-[#071A26]/85 border border-brand-border/20 text-brand-text-white text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-brand-cyan"
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="linearSearch">Linear Search</option>
            <option value="binarySearch">Binary Search (Sorted Array)</option>
          </select>
        </div>

        {/* Searching Targets */}
        {(algo === 'linearSearch' || algo === 'binarySearch') && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-text-muted uppercase">Target:</span>
            <input
              type="number"
              value={target}
              onChange={(e) => { setTarget(parseInt(e.target.value) || 0); clearSimulationState(); }}
              className="w-16 bg-[#071A26]/85 border border-brand-border/20 text-brand-cyan text-xs font-semibold text-center py-1.5 rounded-lg focus:outline-none focus:border-brand-cyan"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase mr-1">Speed:</span>
            <input 
              type="range" 
              min="100" 
              max="1500" 
              step="100"
              value={1600 - speed} 
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value))}
              className="w-20 accent-brand-cyan"
            />
          </div>
          <button
            onClick={() => generateArray()}
            className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-all"
            title="Randomize array"
          >
            <Shuffle size={14} />
          </button>
        </div>
      </div>

      {/* Simulator workspace view */}
      <div className="bg-[#071A26]/60 border border-brand-border/10 rounded-2xl p-6 min-h-[220px] flex flex-col justify-end items-center relative overflow-hidden shadow-inner">
        {/* Dynamic visual bars */}
        <div className="flex items-end gap-1.5 sm:gap-2.5 w-full max-w-2xl h-44 justify-center">
          {array.map((val, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center flex-1 max-w-[45px]"
            >
              <div 
                style={{ height: `${val * 1.5}px` }}
                className={`w-full rounded-t-lg border transition-all duration-300 flex items-end justify-center pb-2 text-[9px] sm:text-xs font-black text-brand-text-white shadow-inner ${getBarClass(idx)}`}
              >
                <span className="opacity-90">{val}</span>
              </div>
              <span className="text-[9px] font-bold text-brand-text-muted mt-2 select-none">
                [{idx}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps descriptor */}
      <div className="bg-[#0D2538]/70 border border-brand-border/15 p-4 rounded-xl flex items-start gap-3">
        <ChevronRight className="text-brand-cyan mt-0.5 flex-shrink-0" size={16} />
        <p className="text-xs sm:text-sm font-semibold text-brand-text-white leading-relaxed">
          {getStepDescription()}
        </p>
      </div>

      {/* Simulator control buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => { clearSimulationState(); generateArray(); }}
          className="flex items-center gap-1.5 px-4 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-all bg-[#071A26]/30"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
        <button
          onClick={startSimulation}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
            isPlaying 
              ? 'bg-brand-purple text-brand-text-white shadow-purple-glow hover:opacity-90' 
              : 'bg-brand-cyan text-[#071A26] shadow-cyan-glow hover:opacity-90'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={14} fill="currentColor" />
              <span>Pause Simulation</span>
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              <span>Play Simulation</span>
            </>
          )}
        </button>
        <button
          disabled={isPlaying}
          onClick={stepForward}
          className="flex items-center gap-1.5 px-4 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-all bg-[#071A26]/30 disabled:opacity-20"
        >
          <FastForward size={14} />
          <span>Step</span>
        </button>
      </div>

    </div>
  );
}
