import { useState } from 'react';
import { Play, Code, RefreshCw, Terminal, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodePreset {
  name: string;
  code: string;
  output: string;
}

export default function CodeCompiler() {
  const presets: Record<string, CodePreset> = {
    helloWorld: {
      name: 'Hello World',
      code: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to DSAverse C++ Playground!" << endl;
    cout << "Happy coding!" << endl;
    return 0;
}`,
      output: `[Compiling Code...]
[Linking Objects...]
[Executing compiled binary...]

Welcome to DSAverse C++ Playground!
Happy coding!

Process exited with code 0.`
    },
    arrayTraversal: {
      name: 'Array Traversal',
      code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {12, 34, 45, 6, 89};
    int n = sizeof(arr) / sizeof(arr[0]);

    cout << "Array elements are: " << endl;
    for (int i = 0; i < n; i++) {
        cout << "Index [" << i << "] = " << arr[i] << endl;
    }
    return 0;
}`,
      output: `[Compiling Code...]
[Linking Objects...]
[Executing compiled binary...]

Array elements are: 
Index [0] = 12
Index [1] = 34
Index [2] = 45
Index [3] = 6
Index [4] = 89

Process exited with code 0.`
    },
    binarySearch: {
      name: 'Binary Search Implementation',
      code: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int size, int target) {
    int low = 0;
    int high = size - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int sortedArray[] = {5, 12, 19, 25, 34, 45, 56};
    int n = sizeof(sortedArray) / sizeof(sortedArray[0]);
    int target = 25;
    
    int result = binarySearch(sortedArray, n, target);
    
    if (result != -1) {
        cout << "Target " << target << " found at index: " << result << endl;
    } else {
        cout << "Target " << target << " not found in array." << endl;
    }
    return 0;
}`,
      output: `[Compiling Code...]
[Linking Objects...]
[Executing compiled binary...]

Target 25 found at index: 3

Process exited with code 0.`
    }
  };

  const [selectedPreset, setSelectedPreset] = useState<string>('helloWorld');
  const [code, setCode] = useState<string>(presets.helloWorld.code);
  const [consoleOutput, setConsoleOutput] = useState<string>('Console log ready... Click "Run Code" to compile.');
  const [isRunning, setIsRunning] = useState(false);

  const handlePresetChange = (key: string) => {
    setSelectedPreset(key);
    setCode(presets[key].code);
    setConsoleOutput('Console log ready... Click "Run Code" to compile.');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Compiling iostream headers...\nLinking objects...');
    
    setTimeout(() => {
      setConsoleOutput(presets[selectedPreset].output);
      setIsRunning(false);
      toast.success('Compile Successful!');
    }, 1200);
  };

  // Generate mock line numbers
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <div className="border border-brand-border/20 rounded-3xl bg-[#0D2538]/50 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      
      {/* Editor top action bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D2538]/90 border-b border-brand-border/20 select-none flex-shrink-0">
        <div className="flex items-center gap-3">
          <Code className="text-brand-cyan" size={16} />
          <select
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="bg-[#071A26]/85 border border-brand-border/20 text-brand-text-white text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:border-brand-cyan"
          >
            <option value="helloWorld">Hello World boilerplate</option>
            <option value="arrayTraversal">Array Traversal code</option>
            <option value="binarySearch">Binary Search algorithm</option>
          </select>
        </div>

        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-cyan text-[#071A26] rounded-xl text-xs font-bold shadow-cyan-glow hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isRunning ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <Play size={12} fill="#071A26" />
          )}
          <span>Run Code</span>
        </button>
      </div>

      {/* Compiler Panels: Editor & Console Split */}
      <div className="flex-1 flex flex-col sm:flex-row min-h-0">
        {/* Code Editor block */}
        <div className="flex-1 flex bg-[#071A26] relative font-mono text-sm leading-relaxed border-r border-brand-border/10 select-text overflow-y-auto no-scrollbar">
          {/* Numbers column */}
          <div className="w-10 text-right pr-3 select-none border-r border-brand-border/5 py-4 text-brand-text-muted/40 font-semibold bg-[#071A26]/80 text-xs">
            {lineNumbers.map(n => <div key={n}>{n}</div>)}
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent border-none text-brand-cyan px-4 py-4 focus:outline-none font-mono text-xs sm:text-sm resize-none h-full min-h-[250px] no-scrollbar select-text leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output console log */}
        <div className="h-44 sm:h-auto sm:w-80 flex flex-col bg-[#071A26]/95 flex-shrink-0 min-h-0">
          <div className="px-4 py-2 border-b border-brand-border/20 bg-[#0D2538]/70 flex items-center gap-2 select-none flex-shrink-0">
            <Terminal className="text-brand-text-muted" size={14} />
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Console Output</span>
          </div>

          <div className="flex-1 p-4 font-mono text-xs text-brand-text-muted overflow-y-auto select-text no-scrollbar leading-relaxed whitespace-pre-wrap">
            {consoleOutput}
          </div>
        </div>
      </div>

    </div>
  );
}
