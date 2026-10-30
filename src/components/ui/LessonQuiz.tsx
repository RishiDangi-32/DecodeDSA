import { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, Award, RotateCcw, 
  HelpCircle, ChevronRight, ChevronLeft, Check, Flag, 
  BookOpen, Clock, ArrowRight, ArrowLeft, Sparkles, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PracticeQuestion } from '../../types';

interface LessonQuizProps {
  questions?: PracticeQuestion[];
  lessonTitle?: string;
  lessonIndex?: number;
  totalLessons?: number;
  courseLevel?: string;
  onBackToLearn?: () => void;
  onNextLesson?: () => void;
}

interface QuestionState {
  isAnswered: boolean;
  isCorrect: boolean;
  selectedOpt: number | null;
  studentText: string;
}

export default function LessonQuiz({ 
  questions, 
  lessonTitle = 'Lesson',
  lessonIndex = 1,
  totalLessons = 1,
  courseLevel = 'Beginner',
  onBackToLearn,
  onNextLesson
}: LessonQuizProps) {
  const quizQuestions = questions && questions.length > 0 ? questions : [];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // If no questions are provided for this lesson
  if (quizQuestions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 select-none py-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E6E1D6]">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#26533B]">
              PRACTICE TOPIC
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B231F] mt-1">
              Practice Quiz
            </h1>
          </div>
          {onBackToLearn && (
            <button
              onClick={onBackToLearn}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#546059] hover:text-[#26533B] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Learn & Read</span>
            </button>
          )}
        </div>

        {/* Empty State Card */}
        <div className="bg-white border border-[#DDD7CD] p-10 sm:p-14 rounded-3xl shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF4EF] border border-[#CDE0D1] flex items-center justify-center text-[#26533B] shadow-2xs">
            <HelpCircle size={30} />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B231F]">
              No Practice Questions Yet
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6660] max-w-md mx-auto leading-relaxed">
              Practice questions have not been added for <strong>{lessonTitle}</strong> yet. You can revisit the lesson reading or test your code in the online C++ compiler.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            {onBackToLearn && (
              <button
                onClick={onBackToLearn}
                className="px-5 py-2.5 bg-[#26533B] hover:bg-[#1E432F] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Return to Learn & Read
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active question and its stored answer state
  const currentQuestion = quizQuestions[currentIdx];
  const currentState: QuestionState = questionStates[currentIdx] || {
    isAnswered: false,
    isCorrect: false,
    selectedOpt: null,
    studentText: ''
  };

  const isMcq = currentQuestion.type === 'mcq' || (!currentQuestion.type && Array.isArray(currentQuestion.options));
  const isFlagged = flaggedQuestions.includes(currentIdx);

  // Compute stats across all questions
  const answeredCount = Object.values(questionStates).filter(s => s.isAnswered).length;
  const correctCount = Object.values(questionStates).filter(s => s.isAnswered && s.isCorrect).length;
  const progressPercent = Math.round((answeredCount / quizQuestions.length) * 100);

  const handleOptionSelect = (optIdx: number) => {
    if (currentState.isAnswered) return;
    setQuestionStates(prev => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || { isAnswered: false, isCorrect: false, studentText: '' }),
        selectedOpt: optIdx
      }
    }));
  };

  const handleTextChange = (text: string) => {
    if (currentState.isAnswered) return;
    setQuestionStates(prev => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || { isAnswered: false, isCorrect: false, selectedOpt: null }),
        studentText: text
      }
    }));
  };

  const handleToggleFlag = (idx: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmit = () => {
    if (currentState.isAnswered) return;

    let correct = false;
    if (isMcq) {
      if (currentState.selectedOpt === null) return;
      correct = Number(currentState.selectedOpt) === Number(currentQuestion.correctAnswer);
    } else {
      if (!currentState.studentText.trim()) return;
      const userClean = currentState.studentText.trim().toLowerCase();
      const answerClean = String(currentQuestion.correctAnswer || '').trim().toLowerCase();
      
      const alternatives = answerClean.split(',').map(a => a.trim());
      correct = alternatives.includes(userClean) || userClean === answerClean;
    }

    setQuestionStates(prev => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || { selectedOpt: null, studentText: '' }),
        isAnswered: true,
        isCorrect: correct
      }
    }));

    if (correct) {
      toast.success('Correct Answer!', {
        icon: '✓',
        style: { background: '#EDF4EF', color: '#1B231F', border: '1px solid #BFD5C6' }
      });
    } else {
      toast.error('Incorrect Answer. Review the solution below.', {
        style: { background: '#FFF1F2', color: '#9F1239', border: '1px solid #FECDD3' }
      });
    }
  };

  const handleNext = () => {
    if (currentIdx === quizQuestions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setQuestionStates({});
    setFlaggedQuestions([]);
    setQuizFinished(false);
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-7 text-[#1F2623] select-none">
      
      {/* ======================================================== */}
      {/* Top Editorial Header Block (Matching Reference Image!)   */}
      {/* ======================================================== */}
      <div className="border-b border-[#E6E1D6] pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#26533B]">
            PRACTICE TOPIC
          </span>
          {onBackToLearn && (
            <button
              onClick={onBackToLearn}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#546059] hover:text-[#26533B] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Learn & Read</span>
            </button>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1B231F] tracking-tight leading-[1.2]">
          Practice Quiz
        </h1>

        <p className="text-sm sm:text-base text-[#4D5852] leading-relaxed">
          Put your understanding of <strong>{lessonTitle}</strong> into practice. Take your time, one question at a time.
        </p>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#5C6660] font-medium border-t border-[#EDE8DE]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-[#2C3630]">{lessonTitle}</span>
            <span className="w-1 h-1 rounded-full bg-[#B2BDB6]" />
            <span>Lesson {String(lessonIndex).padStart(2, '0')} of {String(totalLessons).padStart(2, '0')}</span>
            <span className="w-1 h-1 rounded-full bg-[#B2BDB6]" />
            <span>{quizQuestions.length} questions</span>
            <span className="w-1 h-1 rounded-full bg-[#B2BDB6]" />
            <span className="px-2 py-0.5 rounded-md bg-[#E5EFE7] text-[#235338] font-bold text-[11px] border border-[#BFD5C6]">
              {courseLevel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5C6660]">
            <Clock size={13} className="text-[#26533B]" />
            <span>Untimed practice</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Quiz Body                                                */}
      {/* ======================================================== */}
      {quizFinished ? (
        // Results Celebration View
        <div className="bg-white border border-[#DDD7CD] shadow-sm rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-[#EDF4EF] border-2 border-[#BFD5C6] flex items-center justify-center text-[#26533B] shadow-sm animate-bounce">
            <Award size={40} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-[#26533B] uppercase tracking-widest">
              Performance Summary
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B231F]">
              Practice Quiz Completed!
            </h3>
            <p className="text-xs sm:text-sm text-[#546059] max-w-md mx-auto leading-relaxed">
              {correctCount === quizQuestions.length
                ? 'Outstanding work! You mastered every single question in this lesson!'
                : correctCount >= quizQuestions.length / 2
                ? 'Great effort! Review the explanations to reinforce the concepts you missed.'
                : 'Keep practicing! Take another look at the reading material and test yourself again.'}
            </p>
          </div>

          {/* Score Box */}
          <div className="px-10 py-5 rounded-2xl border border-[#CDE0D1] bg-[#EDF4EF] space-y-1">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#26533B]">{correctCount}</span>
              <span className="text-lg font-bold text-[#546059]">/ {quizQuestions.length}</span>
            </div>
            <span className="text-[11px] font-extrabold text-[#235338] uppercase tracking-wider block">
              {Math.round((correctCount / quizQuestions.length) * 100)}% Accuracy
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-2.5 border border-[#DDD7CD] hover:border-[#26533B] bg-[#FAF8F4] hover:bg-white text-[#2C3630] rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all"
            >
              <RotateCcw size={15} />
              <span>Retake Quiz</span>
            </button>

            {onBackToLearn && (
              <button
                onClick={onBackToLearn}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#26533B] hover:bg-[#1E432F] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <BookOpen size={15} />
                <span>Return to Learn & Read</span>
              </button>
            )}

            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#26533B] text-[#26533B] hover:bg-[#EDF4EF] rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all"
              >
                <span>Next Lesson</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Split View: Main Question Workspace + Progress Sidebar
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Question Card (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#DDD7CD] shadow-2xs rounded-3xl p-6 sm:p-8 lg:p-9 space-y-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-extrabold text-[#26533B] tracking-wider uppercase">
                  QUESTION {currentIdx + 1} OF {quizQuestions.length}
                </span>
                <span className="text-[#9EA79F]">•</span>
                <span className="text-xs text-[#5C6660] font-medium">
                  {isMcq ? 'Multiple choice' : 'Short answer'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleFlag(currentIdx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isFlagged
                    ? 'border-amber-400 bg-[#FEF3C7] text-[#92400E]'
                    : 'border-[#DDD7CD] bg-[#FAF8F4] text-[#546059] hover:text-[#1F2623] hover:border-[#26533B]'
                }`}
                title={isFlagged ? 'Remove flag' : 'Flag question for review'}
              >
                <Flag size={12} className={isFlagged ? 'fill-[#D97706] text-[#D97706]' : ''} />
                <span>{isFlagged ? 'Flagged' : 'Flag for review'}</span>
              </button>
            </div>

            {/* Question Prompt */}
            <div className="space-y-1.5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B231F] select-text leading-snug">
                {currentQuestion.question}
              </h2>
              <p className="text-xs text-[#6B756F]">
                {isMcq ? 'Choose one answer.' : 'Type your answer below.'}
              </p>
            </div>

            {/* Optional Question Image Attachment */}
            {currentQuestion.image && (
              <div className="rounded-2xl overflow-hidden border border-[#DDD7CD] bg-[#FAF8F4] p-2 shadow-2xs group relative">
                <img
                  src={currentQuestion.image}
                  alt="Question Diagram"
                  className="w-full h-auto max-h-[380px] object-contain mx-auto block rounded-xl cursor-pointer"
                  onClick={() => window.open(currentQuestion.image, '_blank')}
                  title="Click to view full screenshot in new tab"
                />
                <button
                  type="button"
                  onClick={() => window.open(currentQuestion.image, '_blank')}
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <span>Expand</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            )}

            {/* MCQ Options with Soothing Palette */}
            {isMcq && currentQuestion.options && (
              <div className="space-y-3 pt-1">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = currentState.selectedOpt === idx;
                  const isCorrectOption = Number(currentQuestion.correctAnswer) === idx;
                  
                  let containerClass = 'border border-[#E5E0D5] bg-white hover:border-[#26533B] hover:bg-[#F4F8F5] text-[#1F2623] shadow-2xs';
                  let badgeClass = 'bg-[#F4F2EC] border-[#DDD7CD] text-[#45524B]';
                  let radioClass = 'border-[#D5CFC4]';

                  if (isSelected) {
                    containerClass = 'border-2 border-[#26533B] bg-[#F2F7F4] text-[#1B231F] shadow-xs';
                    badgeClass = 'bg-[#26533B] border-[#26533B] text-white';
                    radioClass = 'border-[#26533B] bg-[#26533B]';
                  }

                  if (currentState.isAnswered) {
                    if (isCorrectOption) {
                      containerClass = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs';
                      badgeClass = 'bg-emerald-600 border-emerald-600 text-white';
                      radioClass = 'border-emerald-600 bg-emerald-600';
                    } else if (isSelected) {
                      containerClass = 'border-2 border-rose-500 bg-rose-50 text-rose-950 shadow-xs';
                      badgeClass = 'bg-rose-600 border-rose-600 text-white';
                      radioClass = 'border-rose-600 bg-rose-600';
                    } else {
                      containerClass = 'border border-[#EDE8DE] bg-[#FAF8F4]/50 text-[#8C9690] opacity-40 shadow-none';
                      badgeClass = 'bg-[#EDE8DE] border-transparent text-[#8C9690]';
                      radioClass = 'border-[#EDE8DE]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={currentState.isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${containerClass}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${badgeClass}`}>
                          {optionLetters[idx] || idx + 1}
                        </span>
                        <span className="leading-relaxed select-text font-normal">{option}</span>
                      </div>

                      {/* Right radio / check indicator */}
                      <div className="flex-shrink-0">
                        {currentState.isAnswered && isCorrectOption ? (
                          <CheckCircle2 size={19} className="text-emerald-600" />
                        ) : currentState.isAnswered && isSelected && !isCorrectOption ? (
                          <XCircle size={19} className="text-rose-600" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${radioClass}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Short Answer Input Field */}
            {!isMcq && (
              <div className="space-y-3 pt-1">
                <input
                  type="text"
                  disabled={currentState.isAnswered}
                  value={currentState.studentText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !currentState.isAnswered && currentState.studentText.trim()) {
                      handleSubmit();
                    }
                  }}
                  placeholder="e.g. cout, O(log N), int, etc."
                  className="w-full bg-white border border-[#DDD7CD] focus:border-[#26533B] focus:ring-2 focus:ring-[#26533B]/20 rounded-xl px-4 py-3.5 text-sm text-[#1B231F] placeholder-[#8C9690] outline-none transition-all shadow-2xs disabled:bg-[#FAF8F4]"
                />

                {currentState.isAnswered && (
                  <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    currentState.isCorrect 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    {currentState.isCorrect ? <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" /> : <XCircle size={20} className="text-rose-600 flex-shrink-0" />}
                    <div className="text-xs font-semibold">
                      {currentState.isCorrect ? (
                        <span>Great job! Your answer matches the expected solution.</span>
                      ) : (
                        <span>
                          Expected Answer: <strong className="underline">{String(currentQuestion.correctAnswer)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Explanation / Solution Box */}
            {currentState.isAnswered && currentQuestion.explanation && (
              <div className="bg-[#FAF8F4] border border-[#DDD7CD] p-4 sm:p-5 rounded-2xl flex items-start gap-3 select-text shadow-2xs">
                <AlertCircle className="text-[#26533B] mt-0.5 flex-shrink-0" size={18} />
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#26533B] uppercase tracking-widest block">
                    Explanation & Solution
                  </span>
                  <p className="text-xs sm:text-sm text-[#3E4842] leading-relaxed font-normal">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Card Footer Actions (Matching Reference Image!) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-[#EDE8DE]">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#DDD7CD] bg-white hover:bg-[#FAF8F4] disabled:opacity-40 disabled:hover:bg-white text-xs font-bold text-[#4D5852] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="w-full sm:w-auto flex items-center justify-end">
                {!currentState.isAnswered ? (
                  (() => {
                    const isSubmitDisabled = isMcq 
                      ? currentState.selectedOpt === null 
                      : !currentState.studentText.trim();

                    return (
                      <button
                        type="button"
                        disabled={isSubmitDisabled}
                        onClick={handleSubmit}
                        className={`w-full sm:w-auto px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          isSubmitDisabled
                            ? 'bg-[#EAE6DE] text-[#9EA79F] cursor-not-allowed border border-[#DDD7CD]'
                            : 'bg-[#26533B] hover:bg-[#1E432F] text-white shadow-xs cursor-pointer active:scale-[0.98]'
                        }`}
                      >
                        Submit answer →
                      </button>
                    );
                  })()
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 bg-[#26533B] hover:bg-[#1E432F] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span>{currentIdx === quizQuestions.length - 1 ? 'Finish Practice Quiz' : 'Next question'}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Subtext instruction footer */}
            {!currentState.isAnswered && (
              <p className="text-center text-[11px] text-[#8C9690] pt-1">
                Select an option to enable Submit answer.
              </p>
            )}

          </div>

          {/* ======================================================== */}
          {/* Right Column: Progress Tracker + Refresher Card          */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Card 1: Your Progress Card */}
            <div className="bg-white border border-[#DDD7CD] shadow-2xs rounded-3xl p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3">
                <h4 className="text-sm font-bold text-[#1B231F]">
                  Your progress
                </h4>
                <span className="text-xs text-[#6B756F]">
                  {answeredCount}/{quizQuestions.length} answered
                </span>
              </div>

              {/* Progress Bar with Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#546059]">Progress</span>
                  <span className="font-mono font-bold text-[#26533B]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#EAE6DE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#26533B] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Jump to Question Grid */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5C6660] block">
                  JUMP TO QUESTION
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {quizQuestions.map((_, qIdx) => {
                    const state = questionStates[qIdx];
                    const isActive = currentIdx === qIdx;
                    const flagged = flaggedQuestions.includes(qIdx);

                    let pillClass = 'bg-white border border-[#DDD7CD] text-[#546059] hover:bg-[#FAF8F4]';

                    if (state?.isAnswered) {
                      if (state.isCorrect) {
                        pillClass = 'bg-[#EDF4EF] border border-[#BFD5C6] text-[#235338] font-bold';
                      } else {
                        pillClass = 'bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] font-bold';
                      }
                    }

                    if (isActive) {
                      pillClass = 'ring-2 ring-[#26533B] border-[#26533B] font-bold bg-[#E2ECE5] text-[#204A33]';
                    }

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => setCurrentIdx(qIdx)}
                        className={`relative py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${pillClass}`}
                      >
                        <span>Q{qIdx + 1}</span>
                        {flagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D97706] border-2 border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend matching reference */}
              <div className="pt-3 border-t border-[#EDE8DE] flex flex-wrap items-center gap-3 text-[11px] text-[#6B756F]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#E2ECE5] border border-[#26533B]" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-[#DDD7CD] bg-white" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#D97706]">⚐</span>
                  <span>{flaggedQuestions.length} flagged</span>
                </div>
              </div>

              {/* Score Row */}
              <div className="pt-3 border-t border-[#EDE8DE] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#546059]">Score</span>
                <span className="font-serif font-bold text-xl text-[#1B231F]">{correctCount}</span>
              </div>

            </div>

            {/* Card 2: Need a refresher? (Sage Callout Card) */}
            <div className="rounded-3xl border border-[#CDE0D1] bg-[#EDF4EF] p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#E2ECE5] border border-[#BFD5C6] flex items-center justify-center text-[#235338]">
                <BookOpen size={16} />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1B231F]">
                Need a refresher?
              </h4>
              <p className="text-xs sm:text-[13px] text-[#47554D] leading-relaxed font-normal">
                Revisit <strong>{lessonTitle}</strong> whenever you need a little context.
              </p>
              {onBackToLearn && (
                <button
                  type="button"
                  onClick={onBackToLearn}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#235338] hover:text-[#183B27] pt-1 transition-colors cursor-pointer"
                >
                  <span>Learn & Read</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
