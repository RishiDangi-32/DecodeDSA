import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Award, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of correct option
  explanation: string;
}

export default function LessonQuiz() {
  const quizQuestions: Question[] = [
    {
      id: 1,
      question: 'Which of the following data structures has a LIFO (Last In First Out) structure?',
      options: ['Queue', 'Stack', 'Linked List', 'Array'],
      answer: 1,
      explanation: 'A Stack is a Last In First Out (LIFO) data structure. The last element inserted (push) is the first one to be removed (pop).'
    },
    {
      id: 2,
      question: 'What is the time complexity of searching an element in a sorted array of size N using Binary Search?',
      options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(1)'],
      answer: 2,
      explanation: 'Binary Search repeatedly divides the search interval in half. Therefore, the maximum number of comparisons is log2(N), which gives O(log N) time complexity.'
    },
    {
      id: 3,
      question: 'In C++, how do you allocate memory dynamically on the heap for an integer?',
      options: ['int *p = malloc(sizeof(int));', 'int *p = &x;', 'int *p = new int;', 'int p = new int;'],
      answer: 2,
      explanation: 'In C++, the "new" operator is used to allocate memory dynamically on the heap. "int *p = new int;" allocates memory for an integer and assigns its address to pointer p.'
    },
    {
      id: 4,
      question: 'Which sorting algorithm has a worst-case time complexity of O(N^2)?',
      options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'],
      answer: 1,
      explanation: 'Quick Sort has O(N^2) worst-case time complexity (e.g., when the pivot splits the array into sizes 0 and N-1 repeatedly). Its average time complexity is O(N log N).'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleOptionSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isAnswered) return;
    
    setIsAnswered(true);
    const correct = selectedOpt === quizQuestions[currentIdx].answer;
    
    if (correct) {
      setScore(s => s + 1);
      toast.success('Correct Answer!');
    } else {
      toast.error('Incorrect Answer!');
    }
  };

  const handleNext = () => {
    if (currentIdx === quizQuestions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const currentQuestion = quizQuestions[currentIdx];

  return (
    <div className="glass p-6 sm:p-8 rounded-3xl border border-brand-border/15 max-w-2xl mx-auto space-y-6">
      {quizFinished ? (
        // Results View
        <div className="text-center py-8 space-y-5 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-cyan/15 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-cyan-glow animate-bounce">
            <Award size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-brand-text-white">Quiz Completed!</h3>
            <p className="text-sm text-brand-text-muted font-medium">Here is your performance score:</p>
          </div>

          <div className="px-8 py-3 rounded-2xl border border-brand-border/20 bg-[#071A26]/50">
            <span className="text-3xl font-black text-brand-cyan">{score}</span>
            <span className="text-sm font-bold text-brand-text-muted"> / {quizQuestions.length}</span>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#071A26]/60 border border-brand-border/25 text-brand-cyan hover:bg-brand-cyan hover:text-[#071A26] rounded-xl text-xs font-bold transition-all"
          >
            <RotateCcw size={14} />
            <span>Restart Quiz</span>
          </button>
        </div>
      ) : (
        // Question View
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border/10 pb-3 select-none">
            <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">
              Question {currentIdx + 1} of {quizQuestions.length}
            </span>
            <span className="text-[10px] font-bold text-brand-text-muted uppercase">
              Score: {score}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-brand-text-white select-text leading-snug">
            {currentQuestion.question}
          </h3>

          {/* Option list */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = currentQuestion.answer === idx;
              
              let optClass = 'border-brand-border/20 bg-[#071A26]/30 hover:border-brand-cyan/40 text-brand-text-white';
              if (isSelected) {
                optClass = 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan shadow-cyan-glow';
              }
              if (isAnswered) {
                if (isCorrect) {
                  optClass = 'border-brand-green bg-brand-green/10 text-brand-green shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                } else if (isSelected) {
                  optClass = 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                } else {
                  optClass = 'border-brand-border/10 bg-[#071A26]/10 text-brand-text-muted opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-4 border rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-4 ${optClass}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={16} className="text-brand-green flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation block */}
          {isAnswered && (
            <div className="bg-brand-cyan/5 border border-brand-cyan/15 p-4 rounded-2xl flex items-start gap-3 select-text">
              <AlertCircle className="text-brand-cyan mt-0.5 flex-shrink-0" size={16} />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider block">Explanation</span>
                <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Footer Submit/Next Actions */}
          <div className="flex justify-end pt-2">
            {!isAnswered ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-brand-cyan disabled:opacity-40 text-[#071A26] rounded-xl text-xs font-bold shadow-cyan-glow hover:opacity-90 transition-opacity"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-brand-cyan text-[#071A26] rounded-xl text-xs font-bold shadow-cyan-glow hover:opacity-90 transition-opacity"
              >
                {currentIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
