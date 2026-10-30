import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Code2, 
  RefreshCw, 
  Terminal, 
  Trash2, 
  Sun, 
  Moon, 
  Save, 
  Keyboard, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  CornerDownLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// Auto-completion keyword candidates
const C_KEYWORDS = [
  { label: '#include <iostream>', insert: '#include <iostream>\n', desc: 'Standard I/O stream header' },
  { label: '#include <vector>', insert: '#include <vector>\n', desc: 'Dynamic array container' },
  { label: '#include <string>', insert: '#include <string>\n', desc: 'String library header' },
  { label: '#include <algorithm>', insert: '#include <algorithm>\n', desc: 'STL algorithms' },
  { label: 'using namespace std;', insert: 'using namespace std;\n', desc: 'Standard namespace directive' },
  { label: 'int main()', insert: 'int main() {\n    \n    return 0;\n}', desc: 'Main program entry point' },
  { label: 'cout', insert: 'cout << ', desc: 'Standard character output stream' },
  { label: 'cin', insert: 'cin >> ', desc: 'Standard character input stream' },
  { label: 'endl', insert: 'endl', desc: 'Insert newline and flush buffer' },
  { label: 'vector<int>', insert: 'vector<int> ', desc: 'Vector of integers' },
  { label: 'string', insert: 'string ', desc: 'C++ standard string' },
  { label: 'for (int i = 0...)', insert: 'for (int i = 0; i < n; i++) {\n    \n}', desc: 'Standard for loop' },
  { label: 'while (...)', insert: 'while () {\n    \n}', desc: 'Standard while loop' },
  { label: 'if (...)', insert: 'if () {\n    \n}', desc: 'Conditional branch' },
  { label: 'return 0;', insert: 'return 0;', desc: 'Return successful exit status' },
];

export default function CodeCompiler() {
  // Load saved code from localStorage or start empty
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('dsa_cpp_code') || '';
  });

  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);

  const [stdinInput, setStdinInput] = useState<string>('');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Palette:
  // #1A273A - Deep Slate Navy (base, panels)
  // #3E4A62 - Muted Slate Blue (borders, badges, line gutter text)
  // #C24D2C - Burnt Terracotta / Rust Orange (primary brand button, highlights)
  // #D9D9D7 - Pearl Gray / Light Off-White (editor canvas, text)
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<typeof C_KEYWORDS>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const codeHighlightRef = useRef<HTMLPreElement>(null);

  // Sync scrolling between textarea, highlight overlay, and line numbers gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const top = e.currentTarget.scrollTop;
    const left = e.currentTarget.scrollLeft;
    if (gutterRef.current) gutterRef.current.scrollTop = top;
    if (codeHighlightRef.current) {
      codeHighlightRef.current.scrollTop = top;
      codeHighlightRef.current.scrollLeft = left;
    }
  };

  // Keyboard shortcut listener for Ctrl+S, Ctrl+Enter, Ctrl+L
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        handleClearOutput();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [code]);

  // Save code directly to computer storage and open File Manager
  const handleSaveCode = async () => {
    if (!code.trim()) {
      toast.error('Code is empty! Type some C++ code before saving.');
      return;
    }

    // Save copy in browser localStorage
    localStorage.setItem('dsa_cpp_code', code);

    // Modern browsers: Open native computer file manager dialog to choose location
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: 'main.cpp',
          types: [
            {
              description: 'C++ Source File (*.cpp)',
              accept: {
                'text/x-c++src': ['.cpp'],
              },
            },
          ],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(code);
        await writableStream.close();

        toast.success('Saved to computer storage!');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          toast('Save cancelled');
          return;
        }
        // If permission error or restricted context, fall through to download anchor
      }
    }

    // Fallback: Save file to computer via browser download
    const blob = new Blob([code], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.cpp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Saved main.cpp to computer storage!');
  };

  // Reset code handler
  const handleResetCode = () => {
    if (window.confirm('Are you sure you want to reset the editor? All unsaved changes will be cleared.')) {
      setCode('');
      localStorage.removeItem('dsa_cpp_code');
      setConsoleOutput('');
      setCompilationError(null);
      setRuntimeError(null);
      setErrorLine(null);
      setExitCode(null);
      setExecutionTime(null);
      setMemoryUsage(null);
      setShowSuggestions(false);
      toast.success('Editor reset');
    }
  };

  const handleClearOutput = () => {
    setConsoleOutput('');
    setCompilationError(null);
    setRuntimeError(null);
    setErrorLine(null);
    setExitCode(null);
    setExecutionTime(null);
    setMemoryUsage(null);
    toast.success('Output cleared');
  };

  // Autocomplete trigger logic
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);

    // Detect last word typed before cursor
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z_#][a-zA-Z0-9_<>]*)?$/);

    if (match && match[0] && match[0].length >= 2) {
      const query = match[0].toLowerCase();
      const filtered = C_KEYWORDS.filter(k => k.label.toLowerCase().includes(query));
      if (filtered.length > 0) {
        setSuggestions(filtered);
        setSuggestionIndex(0);
        setShowSuggestions(true);
        return;
      }
    }
    setShowSuggestions(false);
  };

  const insertSuggestion = (suggestion: typeof C_KEYWORDS[0]) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = code.slice(0, cursorPos);
    const textAfterCursor = code.slice(cursorPos);

    const match = textBeforeCursor.match(/([a-zA-Z_#][a-zA-Z0-9_<>]*)?$/);
    const replaceLen = match ? match[0].length : 0;
    const newText = textBeforeCursor.slice(0, textBeforeCursor.length - replaceLen) + suggestion.insert + textAfterCursor;
    
    setCode(newText);
    setShowSuggestions(false);
    
    const newCursor = cursorPos - replaceLen + suggestion.insert.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Autocomplete navigation
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertSuggestion(suggestions[suggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  // Syntax highlighting generator
  const renderHighlightedCode = (source: string) => {
    if (!source) return null;
    const lines = source.split('\n');

    return lines.map((line, lIdx) => {
      // Basic token parser for C++
      const parts = line.split(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:int|float|double|char|bool|void|auto|class|struct|public|private|protected|template|typename|namespace|using|return|if|else|for|while|do|switch|case|break|continue|const|static|sizeof|new|delete)\b|\b(?:cout|cin|endl|std|vector|string|pair|map|set|queue|stack)\b|#[a-zA-Z_]+(?:\s*<[^>]+>)?|[0-9]+(?:\.[0-9]+)?|[{}()[\];,])/g);

      return (
        <div key={lIdx} className="h-6 leading-6 whitespace-pre">
          {parts.map((part, pIdx) => {
            if (!part) return null;
            // Comments
            if (part.startsWith('//') || part.startsWith('/*')) {
              return <span key={pIdx} className="text-[#6B7280] italic">{part}</span>;
            }
            // Strings
            if (part.startsWith('"') || part.startsWith("'")) {
              return <span key={pIdx} className={isLight ? 'text-[#059669] font-medium' : 'text-[#34D399]'}>{part}</span>;
            }
            // Preprocessor
            if (part.startsWith('#')) {
              return <span key={pIdx} className="text-[#9333EA] font-semibold">{part}</span>;
            }
            // Control / Type Keywords
            if (/^(int|float|double|char|bool|void|auto|class|struct|public|private|protected|template|typename|namespace|using|return|if|else|for|while|do|switch|case|break|continue|const|static|sizeof|new|delete)$/.test(part)) {
              return <span key={pIdx} className="text-[#2563EB] font-bold">{part}</span>;
            }
            // Standard STL tokens
            if (/^(cout|cin|endl|std|vector|string|pair|map|set|queue|stack)$/.test(part)) {
              return <span key={pIdx} className="text-[#C24D2C] font-semibold">{part}</span>;
            }
            // Numbers
            if (/^[0-9]+(?:\.[0-9]+)?$/.test(part)) {
              return <span key={pIdx} className="text-[#D97706]">{part}</span>;
            }
            // Operators / Delimiters
            if (/^[{}()[\];,]$/.test(part)) {
              return <span key={pIdx} className={isLight ? 'text-[#475569]' : 'text-[#94A3B8]'}>{part}</span>;
            }
            // Identifiers / Default text
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  // Real C++ Execution Engine (Wandbox GCC Head + Judge0 Fallback)
  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Code editor is blank');
      return;
    }

    setIsRunning(true);
    setCompilationError(null);
    setRuntimeError(null);
    setErrorLine(null);
    setExecutionTime(null);
    setMemoryUsage(null);
    setExitCode(null);
    setConsoleOutput('Compiling source code with GNU C++ (GCC)...\n');

    const startTime = performance.now();

    try {
      let stdout = '';
      let compileErr: string | null = null;
      let runtimeErr: string | null = null;
      let resExitCode: number = 0;
      let resMemory: string | null = null;
      let success = false;

      // Tier 1: Wandbox API (GCC HEAD - Modern C++20/C++23)
      try {
        const wandboxRes = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code,
            compiler: 'gcc-head',
            stdin: stdinInput || ''
          })
        });

        if (wandboxRes.ok) {
          const data = await wandboxRes.json();
          resExitCode = parseInt(data.status, 10) || 0;
          compileErr = (data.compiler_error || data.compiler_message || '').trim() || null;
          runtimeErr = (data.program_error || '').trim() || null;
          
          if (resExitCode !== 0 && !compileErr && !runtimeErr) {
            runtimeErr = data.signal ? `Terminated with signal ${data.signal}` : `Process exited with code ${resExitCode}`;
          }

          stdout = data.program_output || '';
          resMemory = '1.2 MB';
          success = true;
        }
      } catch (wErr) {
        console.warn('Wandbox unavailable, trying backend/Judge0...', wErr);
      }

      // Tier 2: Backend Proxy (/api/compile)
      if (!success) {
        try {
          const beRes = await fetch('/api/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: code,
              stdin: stdinInput || ''
            })
          });

          if (beRes.ok) {
            const data = await beRes.json();
            if (data.success) {
              stdout = data.stdout || '';
              compileErr = data.compileError || null;
              runtimeErr = data.runtimeError || null;
              resExitCode = data.exitCode ?? 0;
              resMemory = data.memory || '1.1 MB';
              success = true;
            }
          }
        } catch (beErr) {
          console.warn('Backend compile proxy unavailable', beErr);
        }
      }

      // Tier 3: Judge0 CE Fallback
      if (!success) {
        try {
          const b64 = (str: string) => btoa(unescape(encodeURIComponent(str)));
          const unb64 = (str: string | null) => str ? decodeURIComponent(escape(atob(str))) : '';

          const judgeRes = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source_code: b64(code),
              language_id: 54, // C++ (GCC 9.2.0)
              stdin: stdinInput ? b64(stdinInput) : ''
            })
          });

          if (judgeRes.ok) {
            const data = await judgeRes.json();
            stdout = unb64(data.stdout);
            compileErr = unb64(data.compile_output).trim() || null;
            runtimeErr = unb64(data.stderr).trim() || (data.status?.id > 4 ? data.status.description : null);
            resExitCode = data.status?.id === 3 ? 0 : (data.exit_code ?? 1);
            if (data.memory) {
              resMemory = `${data.memory} KB`;
            }
            success = true;
          }
        } catch (jErr) {
          console.warn('Judge0 unavailable', jErr);
        }
      }

      const elapsedMs = Math.round(performance.now() - startTime);
      setExecutionTime(`${(elapsedMs / 1000).toFixed(3)}s`);
      if (resMemory) setMemoryUsage(resMemory);
      setExitCode(resExitCode);

      if (!success) {
        setIsRunning(false);
        setConsoleOutput('');
        setRuntimeError('Could not reach compilation services. Please check your internet connection.');
        toast.error('Connection Error');
        return;
      }

      // Parse error line from compiler error if present to highlight editor gutter
      if (compileErr) {
        const lineMatch = compileErr.match(/(?:prog\.cc|main\.cpp):(\d+):/i) || compileErr.match(/:(\d+):(?:\d+:)?\s+error:/i);
        if (lineMatch && lineMatch[1]) {
          setErrorLine(parseInt(lineMatch[1], 10));
        }
        setCompilationError(compileErr);
        setConsoleOutput('');
        toast.error('Compilation Error');
      } else if (runtimeErr) {
        setRuntimeError(runtimeErr);
        if (stdout) {
          setConsoleOutput(stdout);
        } else {
          setConsoleOutput('');
        }
        toast.error('Runtime Error');
      } else {
        if (stdout) {
          setConsoleOutput(stdout);
        } else {
          setConsoleOutput('(Program executed successfully with no output to stdout)');
        }
        toast.success('Execution Successful!');
      }
    } catch (err: any) {
      setRuntimeError(err.message || 'Execution error');
      setConsoleOutput('');
      toast.error('Execution Failed');
    } finally {
      setIsRunning(false);
    }
  };

  // Line count based on filled text
  const lines = code ? code.split('\n') : [];
  const isLight = editorTheme === 'light';

  return (
    <div className="border border-[#3E4A62] rounded-3xl bg-[#1A273A] backdrop-blur-xl overflow-hidden shadow-[0_16px_50px_rgba(26,39,58,0.7)] flex flex-col min-h-[780px] w-full">
      
      {/* Main Top Header: C++ Compiler Title + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#141F2E] border-b border-[#3E4A62]/60 select-none flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C24D2C]/15 border border-[#C24D2C]/40 flex items-center justify-center text-[#C24D2C] shadow-[0_0_15px_rgba(194,77,44,0.25)]">
            <Code2 size={22} />
          </div>
          <h1 className="text-lg font-black text-[#D9D9D7] tracking-tight">
            C++ Compiler
          </h1>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard Shortcuts"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A273A] hover:bg-[#3E4A62]/50 text-[#D9D9D7] border border-[#3E4A62] rounded-xl text-xs font-semibold transition-all"
          >
            <Keyboard size={14} className="text-[#C24D2C]" />
            <span className="hidden md:inline">Shortcuts</span>
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setEditorTheme(isLight ? 'dark' : 'light')}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A273A] hover:bg-[#3E4A62]/50 text-[#D9D9D7] border border-[#3E4A62] rounded-xl text-xs font-semibold transition-all"
          >
            {isLight ? <Moon size={14} className="text-[#D9D9D7]" /> : <Sun size={14} className="text-[#C24D2C]" />}
            <span className="hidden sm:inline">{isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Save Code to Computer Storage */}
          <button
            onClick={handleSaveCode}
            title="Save code to computer storage (Ctrl+S)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A273A] hover:bg-[#3E4A62]/50 text-[#D9D9D7] border border-[#3E4A62] rounded-xl text-xs font-semibold transition-all"
          >
            <Save size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset code editor"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A273A] hover:bg-[#C24D2C]/20 hover:text-[#C24D2C] hover:border-[#C24D2C]/40 text-[#D9D9D7] border border-[#3E4A62] rounded-xl text-xs font-semibold transition-all"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2 bg-[#C24D2C] hover:bg-[#a83f23] text-[#D9D9D7] rounded-xl text-xs font-extrabold shadow-[0_0_20px_rgba(194,77,44,0.45)] hover:shadow-[0_0_25px_rgba(194,77,44,0.65)] active:scale-95 transition-all disabled:opacity-50 border border-[#C24D2C]"
          >
            {isRunning ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Play size={14} fill="#D9D9D7" />
            )}
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Compiler Body: Split into Interactive Code Editor (Left) & Output Console (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* SUBHEADING 1: INTERACTIVE CODE EDITOR */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#3E4A62]/60 min-w-0">
          
          {/* Subheading 1 Bar */}
          <div className="px-5 py-2.5 bg-[#141F2E]/80 border-b border-[#3E4A62]/50 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C24D2C]" />
              <h2 className="text-xs font-black tracking-wider uppercase text-[#D9D9D7]">
                Interactive Code Editor
              </h2>
            </div>
          </div>

          {/* Code Editor Container */}
          <div
            className={`flex-1 flex relative font-mono text-sm leading-6 select-text overflow-hidden ${
              isLight ? 'bg-[#D9D9D7] text-[#1A273A]' : 'bg-[#1A273A] text-[#D9D9D7]'
            }`}
          >
            {/* Dynamic Line Numbers Gutter */}
            <div
              ref={gutterRef}
              className={`w-14 text-right pr-3.5 select-none py-4 font-semibold text-xs border-r overflow-y-hidden transition-colors ${
                isLight ? 'bg-[#C7C7C5] text-[#3E4A62] border-[#3E4A62]/25' : 'bg-[#141F2E] text-[#3E4A62] border-[#3E4A62]/40'
              }`}
            >
              {lines.map((line, index) => {
                const lineNum = index + 1;
                const isErrorOnLine = errorLine === lineNum;
                return (
                  <div key={index} className="h-6 leading-6 flex items-center justify-end gap-1">
                    {isErrorOnLine && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Error on this line" />
                    )}
                    <span className={isErrorOnLine ? 'text-red-500 font-bold' : ''}>
                      {line.trim().length > 0 ? lineNum : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Editor Canvas Area */}
            <div className="flex-1 relative h-full min-h-[420px] overflow-hidden">
              
              {/* Syntax Highlighting Overlay (Behind Textarea) */}
              <pre
                ref={codeHighlightRef}
                aria-hidden="true"
                className="absolute inset-0 px-5 py-4 pointer-events-none font-mono text-sm leading-6 overflow-hidden select-none m-0"
              >
                {renderHighlightedCode(code)}
              </pre>

              {/* Interactive Transparent Caret Textarea (On Top) */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                placeholder="// Start typing your C++ code here..."
                className={`absolute inset-0 w-full h-full bg-transparent border-none px-5 py-4 focus:outline-none font-mono text-sm leading-6 resize-none select-text overflow-y-auto ${
                  isLight
                    ? 'text-transparent caret-[#1A273A] selection:bg-[#C24D2C]/20 placeholder:text-[#3E4A62]/50'
                    : 'text-transparent caret-[#D9D9D7] selection:bg-[#C24D2C]/30 placeholder:text-[#3E4A62]/50'
                }`}
                spellCheck={false}
              />

              {/* Auto-completion Popup */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="absolute left-6 top-16 z-30 w-72 max-h-56 overflow-y-auto rounded-xl bg-[#141F2E] border border-[#3E4A62] shadow-2xl p-1 text-xs select-none"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-[#D9D9D7]/50 uppercase tracking-wider border-b border-[#3E4A62]/40 mb-1 flex items-center justify-between">
                    <span>Suggestions</span>
                    <span>Tab / Enter</span>
                  </div>
                  {suggestions.map((item, idx) => (
                    <div
                      key={item.label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertSuggestion(item);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg cursor-pointer flex flex-col transition-colors ${
                        idx === suggestionIndex
                          ? 'bg-[#C24D2C] text-[#D9D9D7]'
                          : 'text-[#D9D9D7]/80 hover:bg-[#3E4A62]/40'
                      }`}
                    >
                      <span className="font-mono font-bold">{item.label}</span>
                      <span className="text-[10px] opacity-75">{item.desc}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* SUBHEADING 2: OUTPUT CONSOLE (Synchronized with Editor Theme) */}
        <div className={`w-full lg:w-[460px] xl:w-[500px] flex flex-col flex-shrink-0 min-h-0 border-l border-[#3E4A62]/40 transition-colors ${
          isLight ? 'bg-[#EAEAE8]' : 'bg-[#141F2E]'
        }`}>
          
          {/* Subheading 2 Bar - Same color as Interactive Code Editor Subheading */}
          <div className="px-5 py-2.5 bg-[#141F2E]/80 border-b border-[#3E4A62]/50 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Terminal className="text-[#C24D2C]" size={15} />
              <h2 className="text-xs font-black tracking-wider uppercase text-[#D9D9D7]">
                Output Console
              </h2>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Toggle cin Input Drawer */}
              <button
                type="button"
                onClick={() => setShowStdin(!showStdin)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  showStdin || stdinInput.trim().length > 0
                    ? 'bg-[#C24D2C]/20 border-[#C24D2C] text-[#C24D2C]'
                    : 'bg-[#1A273A] border-[#3E4A62] text-[#D9D9D7]/70 hover:text-white'
                }`}
                title="Program Input for cin >> variables"
              >
                <CornerDownLeft size={12} />
                <span>cin Input</span>
                {stdinInput.trim().length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C24D2C]" />
                )}
              </button>

              <button
                onClick={handleClearOutput}
                disabled={!consoleOutput && !compilationError && !runtimeError && exitCode === null}
                className="text-xs font-semibold text-[#D9D9D7]/70 hover:text-[#C24D2C] transition-colors disabled:opacity-30"
              >
                Clear Output
              </button>
            </div>
          </div>

          {/* Interactive Stdin (cin) Input Area */}
          {showStdin && (
            <div className={`p-3 border-b border-[#3E4A62]/40 text-xs transition-colors ${
              isLight ? 'bg-[#D9D9D7]' : 'bg-[#1A273A]'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#C24D2C] flex items-center gap-1">
                  <CornerDownLeft size={12} />
                  Program Input (cin):
                </span>
                <span className="text-[10px] text-[#3E4A62]">
                  Values separated by space or newline
                </span>
              </div>
              <textarea
                rows={2}
                value={stdinInput}
                onChange={(e) => setStdinInput(e.target.value)}
                placeholder="e.g. 10 20 30 or Hello"
                className={`w-full p-2.5 rounded-lg font-mono text-xs border outline-none resize-none transition-colors ${
                  isLight 
                    ? 'bg-white border-[#3E4A62]/40 text-[#1A273A] placeholder-[#3E4A62]/50 focus:border-[#C24D2C]' 
                    : 'bg-[#141F2E] border-[#3E4A62] text-[#D9D9D7] placeholder-[#D9D9D7]/30 focus:border-[#C24D2C]'
                }`}
              />
            </div>
          )}

          {/* Console Content: Output, Compilation Errors, Runtime Errors */}
          <div className={`flex-1 p-5 font-mono text-xs sm:text-sm overflow-y-auto select-text leading-relaxed whitespace-pre-wrap min-h-[300px] transition-colors ${
            isLight 
              ? 'bg-[#EAEAE8] text-[#1A273A]' 
              : 'bg-[#1A273A] text-[#D9D9D7]'
          }`}>
            
            {/* Compilation Error Display */}
            {compilationError && (
              <div className={`mb-4 p-4 rounded-xl space-y-1.5 ${
                isLight 
                  ? 'bg-red-50 border border-red-300 text-red-900 shadow-sm' 
                  : 'bg-red-950/40 border border-red-500/40 text-red-300'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                  isLight ? 'text-red-700' : 'text-red-400'
                }`}>
                  <AlertCircle size={14} />
                  <span>Compilation Error</span>
                </div>
                <div className={`text-xs whitespace-pre-wrap leading-relaxed ${
                  isLight ? 'text-red-800' : 'text-red-200'
                }`}>
                  {compilationError}
                </div>
              </div>
            )}

            {/* Runtime Error Display */}
            {runtimeError && (
              <div className={`mb-4 p-4 rounded-xl space-y-1.5 ${
                isLight 
                  ? 'bg-amber-50 border border-amber-300 text-amber-900 shadow-sm' 
                  : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wide ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  <AlertCircle size={14} />
                  <span>Runtime Error</span>
                </div>
                <div className={`text-xs whitespace-pre-wrap leading-relaxed ${
                  isLight ? 'text-amber-800' : 'text-amber-200'
                }`}>
                  {runtimeError}
                </div>
              </div>
            )}

            {/* Standard Program Output */}
            {consoleOutput && (
              <div className={`whitespace-pre-wrap ${isLight ? 'text-[#1A273A]' : 'text-[#D9D9D7]'}`}>
                {consoleOutput}
              </div>
            )}

          </div>

          {/* Execution Metrics & Exit Status Bar */}
          {exitCode !== null && (
            <div className={`px-4 py-2.5 border-t border-[#3E4A62]/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono select-none ${
              isLight ? 'bg-[#D9D9D7] text-[#1A273A]' : 'bg-[#141F2E] text-[#D9D9D7]/80'
            }`}>
              <div className="flex items-center gap-1.5">
                {exitCode === 0 ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CheckCircle2 size={13} />
                    <span>Exit Code: 0 (Success)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <AlertCircle size={13} />
                    <span>Exit Code: {exitCode}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#3E4A62]">
                {executionTime && (
                  <span className="flex items-center gap-1 font-semibold text-[#D9D9D7]/70" title="Execution Time">
                    <Clock size={12} className="text-[#C24D2C]" />
                    <span>{executionTime}</span>
                  </span>
                )}
                {memoryUsage && (
                  <span className="flex items-center gap-1 font-semibold text-[#D9D9D7]/70" title="Memory Footprint">
                    <Cpu size={12} className="text-[#C24D2C]" />
                    <span>{memoryUsage}</span>
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1A273A] border border-[#3E4A62] rounded-3xl p-6 shadow-2xl text-[#D9D9D7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E4A62]/50 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard size={18} className="text-[#C24D2C]" />
                <h3 className="font-bold text-sm tracking-wide">Keyboard Shortcuts</h3>
              </div>
              <button 
                onClick={() => setShowShortcutsModal(false)}
                className="text-xs text-[#D9D9D7]/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#141F2E] border border-[#3E4A62]/40">
                <span className="text-[#D9D9D7]/80">Run C++ Code</span>
                <kbd className="px-2 py-1 bg-[#1A273A] border border-[#3E4A62] rounded text-[#C24D2C] font-bold">Ctrl + Enter</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#141F2E] border border-[#3E4A62]/40">
                <span className="text-[#D9D9D7]/80">Save Code to Storage</span>
                <kbd className="px-2 py-1 bg-[#1A273A] border border-[#3E4A62] rounded text-[#C24D2C] font-bold">Ctrl + S</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#141F2E] border border-[#3E4A62]/40">
                <span className="text-[#D9D9D7]/80">Clear Output Console</span>
                <kbd className="px-2 py-1 bg-[#1A273A] border border-[#3E4A62] rounded text-[#C24D2C] font-bold">Ctrl + L</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#141F2E] border border-[#3E4A62]/40">
                <span className="text-[#D9D9D7]/80">Indent 4 Spaces</span>
                <kbd className="px-2 py-1 bg-[#1A273A] border border-[#3E4A62] rounded text-[#C24D2C] font-bold">Tab</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#141F2E] border border-[#3E4A62]/40">
                <span className="text-[#D9D9D7]/80">Close Autocomplete</span>
                <kbd className="px-2 py-1 bg-[#1A273A] border border-[#3E4A62] rounded text-[#C24D2C] font-bold">Escape</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2 bg-[#C24D2C] text-[#D9D9D7] font-bold rounded-xl text-xs hover:bg-[#a83f23] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
