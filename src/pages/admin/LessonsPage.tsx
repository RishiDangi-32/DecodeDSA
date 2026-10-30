import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ArrowUpDown, ChevronLeft, 
  ChevronRight, RefreshCw, X, Eye, BookOpen, Milestone, 
  AlertTriangle, Save, Send, EyeOff, HelpCircle, Check, Youtube,
  Image as ImageIcon, Upload, ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson, PracticeQuestion } from '../../types';
import RichTextEditor from '../../components/ui/RichTextEditor';
import toast from 'react-hot-toast';

export default function LessonsPage() {
  // Course/Module Selection
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  // Loading states
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Listing page settings
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
  const [simulationHtml, setSimulationHtml] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [uploadingQuestionIndex, setUploadingQuestionIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Preview overlay
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Fetch filter dropdowns
  const fetchFilterData = async () => {
    setLoadingFilters(true);
    try {
      const coursesRes = await api.getCourses({ limit: 100, sortBy: 'order', sortOrder: 'asc' });
      setCourses(coursesRes.courses);
      if (coursesRes.courses.length > 0) {
        setSelectedCourseId(coursesRes.courses[0]._id);
      }
    } catch (error) {
      // API handles toast
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchModules = async () => {
    if (!selectedCourseId) return;
    try {
      const data = await api.getModules(selectedCourseId);
      setModules(data);
      if (data.length > 0) {
        setSelectedModuleId(data[0]._id);
      } else {
        setSelectedModuleId('');
        setLessons([]);
      }
    } catch (error) {
      // API handles toast
    }
  };

  const fetchLessons = async () => {
    if (!selectedModuleId) {
      setLessons([]);
      return;
    }
    setLoadingLessons(true);
    try {
      const res = await api.getLessons({
        page,
        limit: 8,
        moduleId: selectedModuleId,
        search
      });
      setLessons(res.lessons);
      setTotalPages(res.pagination.pages);
      setTotalItems(res.pagination.total);
    } catch (error) {
      // API handles toast
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchModules();
  }, [selectedCourseId]);

  useEffect(() => {
    fetchLessons();
  }, [selectedModuleId, page, search]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  const handleOpenForm = (lesson?: Lesson) => {
    if (lesson) {
      setEditingId(lesson._id);
      setTitle(lesson.title);
      setContent(lesson.content || { type: 'doc', content: [] });
      setSimulationHtml(lesson.simulationHtml || '');
      setYoutubeUrl(lesson.youtubeUrl || '');
      setPracticeQuestions(lesson.practiceQuestions ? JSON.parse(JSON.stringify(lesson.practiceQuestions)) : []);
      setStatus(lesson.status);
    } else {
      setEditingId(null);
      setTitle('');
      setContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing your lesson content here...' }]
          }
        ]
      });
      setSimulationHtml('');
      setYoutubeUrl('');
      setPracticeQuestions([]);
      setStatus('draft');
    }
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setPracticeQuestions([]);
  };

  // Practice Question helpers
  const handleAddQuestion = (type: 'mcq' | 'short_answer') => {
    if (type === 'mcq') {
      setPracticeQuestions(prev => [
        ...prev,
        {
          type: 'mcq',
          question: '',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          explanation: ''
        }
      ]);
    } else {
      setPracticeQuestions(prev => [
        ...prev,
        {
          type: 'short_answer',
          question: '',
          correctAnswer: '',
          explanation: ''
        }
      ]);
    }
  };

  const handleUpdateQuestion = (index: number, updatedFields: Partial<PracticeQuestion>) => {
    setPracticeQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedFields };
      return copy;
    });
  };

  const handleDeleteQuestion = (index: number) => {
    setPracticeQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddOption = (questionIndex: number) => {
    setPracticeQuestions(prev => {
      const copy = [...prev];
      const q = copy[questionIndex];
      const opts = q.options ? [...q.options] : [];
      opts.push(`Option ${opts.length + 1}`);
      copy[questionIndex] = { ...q, options: opts };
      return copy;
    });
  };

  const handleUpdateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setPracticeQuestions(prev => {
      const copy = [...prev];
      const q = copy[questionIndex];
      const opts = q.options ? [...q.options] : [];
      opts[optionIndex] = value;
      copy[questionIndex] = { ...q, options: opts };
      return copy;
    });
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    setPracticeQuestions(prev => {
      const copy = [...prev];
      const q = copy[questionIndex];
      const opts = q.options ? [...q.options] : [];
      if (opts.length <= 2) {
        toast.error('An MCQ must have at least 2 options.');
        return prev;
      }
      opts.splice(optionIndex, 1);
      let newCorrect = Number(q.correctAnswer);
      if (newCorrect >= opts.length) {
        newCorrect = Math.max(0, opts.length - 1);
      } else if (newCorrect === optionIndex) {
        newCorrect = 0;
      } else if (newCorrect > optionIndex) {
        newCorrect -= 1;
      }
      copy[questionIndex] = { ...q, options: opts, correctAnswer: newCorrect };
      return copy;
    });
  };

  const handleQuestionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Only image formats (PNG, JPG, WEBP, GIF) are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit.');
        return;
      }

      setUploadingQuestionIndex(questionIndex);
      const toastId = toast.loading('Uploading screenshot to Cloudinary...');
      try {
        const folder = courses.find(c => c._id === selectedCourseId)?.slug || 'practice-questions';
        const data = await api.uploadMedia(file, folder);
        if (!data || !data.url) {
          throw new Error('Upload succeeded but no image URL was returned.');
        }
        handleUpdateQuestion(questionIndex, { image: data.url });
        toast.success('Screenshot attached to question!', { id: toastId });
      } catch (err: any) {
        toast.error(err.message || 'Image upload failed.', { id: toastId });
      } finally {
        setUploadingQuestionIndex(null);
        e.target.value = '';
      }
    }
  };

  const handleSave = async (publishedState?: 'draft' | 'published') => {
    if (!selectedModuleId) {
      toast.error('Module is required.');
      return;
    }
    if (!title.trim()) {
      toast.error('Lesson Title is required.');
      return;
    }

    // Validate Practice Questions
    for (let i = 0; i < practiceQuestions.length; i++) {
      const q = practiceQuestions[i];
      if (!q.question.trim()) {
        toast.error(`Question #${i + 1} is missing the question prompt.`);
        return;
      }
      if (q.type === 'mcq') {
        if (!q.options || q.options.length < 2) {
          toast.error(`Question #${i + 1} must have at least 2 options.`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            toast.error(`Question #${i + 1}, Option #${j + 1} cannot be empty.`);
            return;
          }
        }
      } else {
        if (!String(q.correctAnswer || '').trim()) {
          toast.error(`Question #${i + 1} (Short Answer) requires an expected correct answer.`);
          return;
        }
      }
    }

    const currentStatus = publishedState || status;

    const payload = {
      moduleId: selectedModuleId,
      title,
      content,
      simulationHtml: simulationHtml && simulationHtml.trim() ? simulationHtml.trim() : null,
      youtubeUrl: youtubeUrl && youtubeUrl.trim() ? youtubeUrl.trim() : null,
      practiceQuestions,
      status: currentStatus
    };

    try {
      if (editingId) {
        await api.updateLesson(editingId, payload);
        toast.success(`Lesson updated successfully!`);
      } else {
        await api.createLesson(payload);
        toast.success(`Lesson created successfully!`);
      }
      setIsEditing(false);
      fetchLessons();
    } catch (error) {
      // Handled in api helper
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the lesson "${title}"?`)) {
      try {
        await api.deleteLesson(id);
        toast.success('Lesson deleted successfully.');
        fetchLessons();
      } catch (error) {
        // Handled in api helper
      }
    }
  };

  const handlePreview = () => {
    setPreviewContent({ title, content });
    setShowPreviewModal(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 relative">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
            Lesson Management
          </h1>
          <p className="text-sm text-brand-text-muted font-medium mt-1">
            Create, write, and publish educational lessons.
          </p>
        </div>
        {!isEditing && selectedModuleId && (
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold text-sm shadow-cyan-glow hover:bg-brand-cyan hover:text-[#071A26] transition-all self-start sm:self-center"
          >
            <Plus size={16} />
            <span>Create Lesson</span>
          </button>
        )}
      </div>

      {isEditing ? (
        // EDIT / CREATE VIEW
        <div className="space-y-6 max-w-5xl">
          <div className="flex items-center justify-between border-b border-brand-border/10 pb-4">
            <h2 className="text-lg font-bold text-brand-text-white">
              {editingId ? 'Edit Lesson' : 'Create New Lesson'}
            </h2>
            <button
              onClick={handleCloseForm}
              className="px-3.5 py-1.5 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-colors"
            >
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Inputs column */}
            <div className="space-y-5 lg:col-span-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm text-brand-text-white focus:outline-none focus:border-brand-cyan"
                  placeholder="e.g. Introduction to Binary Search"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                    Lesson Rich Content *
                  </label>
                  {simulationHtml ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                      Simulation Code Configured
                    </span>
                  ) : null}
                </div>
                <RichTextEditor 
                  value={content} 
                  onChange={setContent} 
                  simulationHtml={simulationHtml}
                  onSimulationChange={setSimulationHtml}
                  folder={courses.find(c => c._id === selectedCourseId)?.slug || 'general'} 
                />
              </div>

              {/* Optional Lesson YouTube Video Tutorial Link */}
              <div className="space-y-1.5 p-4 rounded-2xl border border-red-500/20 bg-[#0D2538]/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-white shadow-sm">
                      <Youtube size={13} />
                    </div>
                    <span>Lesson YouTube Video Tutorial (Optional)</span>
                  </label>
                  {youtubeUrl.trim() && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Video Configured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="flex-1 bg-[#071A26]/80 border border-brand-border/30 rounded-xl px-4 py-2 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-red-500"
                  />
                  {youtubeUrl.trim() && (
                    <button
                      type="button"
                      onClick={() => setYoutubeUrl('')}
                      className="p-2 text-brand-text-muted hover:text-red-400 rounded-xl border border-brand-border/20 text-xs transition-colors"
                      title="Clear video URL"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-brand-text-muted">
                  You can also insert videos anywhere directly inside the lesson text using the red YouTube button in the editor toolbar above.
                </p>
              </div>

              {/* Practice Questions Manager */}
              <div className="pt-6 border-t border-brand-border/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-brand-cyan" />
                      <h3 className="text-sm font-bold text-brand-text-white uppercase tracking-wider">
                        Practice Questions ({practiceQuestions.length})
                      </h3>
                    </div>
                    <p className="text-xs text-brand-text-muted mt-0.5">
                      Add MCQ or Short Answer questions for students to solve in the Practice Quiz tab.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('mcq')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-bold transition-all"
                    >
                      <Plus size={14} />
                      <span>Add MCQ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddQuestion('short_answer')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-blue/40 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-xs font-bold transition-all"
                    >
                      <Plus size={14} />
                      <span>Add Short Answer</span>
                    </button>
                  </div>
                </div>

                {practiceQuestions.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-brand-border/25 bg-[#0D2538]/30 text-center space-y-2">
                    <p className="text-xs font-semibold text-brand-text-muted">
                      No practice questions configured for this lesson.
                    </p>
                    <p className="text-[11px] text-brand-text-muted/60">
                      Click "+ Add MCQ" or "+ Add Short Answer" above to add questions for students.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {practiceQuestions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="p-5 rounded-2xl border border-brand-border/20 bg-[#071A26]/50 space-y-4"
                      >
                        {/* Question Header */}
                        <div className="flex items-center justify-between border-b border-brand-border/10 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-brand-cyan/15 text-brand-cyan font-black text-xs flex items-center justify-center">
                              {qIndex + 1}
                            </span>
                            <span className="text-xs font-bold text-brand-text-white">
                              {q.type === 'mcq' ? 'Multiple Choice Question (MCQ)' : 'Short Answer Question'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(qIndex)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Question Prompt */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider block">
                            Question Prompt *
                          </label>
                          <textarea
                            rows={2}
                            value={q.question}
                            onChange={(e) => handleUpdateQuestion(qIndex, { question: e.target.value })}
                            placeholder="e.g. Which of the following data structures has a LIFO structure?"
                            className="w-full bg-[#0D2538]/60 border border-brand-border/30 rounded-xl px-3.5 py-2 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-cyan resize-none"
                          />
                        </div>

                        {/* Question Screenshot / Image Attachment */}
                        <div className="space-y-2 p-3 rounded-xl border border-brand-border/20 bg-[#0D2538]/30">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon size={13} className="text-brand-cyan" />
                              <span>Question Screenshot / Diagram (Optional)</span>
                            </label>
                            {q.image && (
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(qIndex, { image: undefined })}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold transition-colors"
                              >
                                Remove Screenshot
                              </button>
                            )}
                          </div>

                          {q.image ? (
                            <div className="relative rounded-xl border border-brand-border/30 bg-[#05131D] overflow-hidden p-2 group max-w-md">
                              <img
                                src={q.image}
                                alt="Question Screenshot"
                                className="w-full h-44 object-contain rounded-lg bg-black/40"
                              />
                              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                <a
                                  href={q.image}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1"
                                  title="Open screenshot in new tab"
                                >
                                  <ExternalLink size={12} />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(qIndex, { image: undefined })}
                                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold backdrop-blur-sm transition-all"
                                  title="Delete screenshot"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <p className="text-[10px] font-mono text-brand-text-muted truncate mt-1.5 px-1">
                                {q.image}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="url"
                                value={q.image || ''}
                                onChange={(e) => handleUpdateQuestion(qIndex, { image: e.target.value.trim() || undefined })}
                                placeholder="Paste image/screenshot URL (https://...)"
                                className="flex-1 bg-[#071A26]/80 border border-brand-border/30 rounded-xl px-3 py-1.5 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-cyan"
                              />
                              <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-shrink-0">
                                {uploadingQuestionIndex === qIndex ? (
                                  <>
                                    <RefreshCw size={13} className="animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={13} />
                                    <span>Upload Screenshot</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingQuestionIndex === qIndex}
                                  onChange={(e) => handleQuestionImageUpload(e, qIndex)}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        {/* MCQ Specific: Options with radio selection for correct answer */}
                        {q.type === 'mcq' && (
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider">
                                Options & Correct Answer *
                              </label>
                              <span className="text-[10px] text-brand-cyan font-semibold">
                                Select checkmark button to mark correct option
                              </span>
                            </div>

                            <div className="space-y-2">
                              {(q.options || []).map((opt, optIndex) => {
                                const isCorrect = Number(q.correctAnswer) === optIndex;
                                return (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateQuestion(qIndex, { correctAnswer: optIndex })}
                                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                                        isCorrect
                                          ? 'border-brand-green bg-brand-green text-[#071A26] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                          : 'border-brand-border/30 bg-[#0D2538]/50 hover:border-brand-cyan text-transparent'
                                      }`}
                                      title={isCorrect ? 'Correct Answer' : 'Click to set as correct answer'}
                                    >
                                      <Check size={13} strokeWidth={3} />
                                    </button>

                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                                      placeholder={`Option ${optIndex + 1}`}
                                      className={`flex-1 bg-[#0D2538]/50 border rounded-xl px-3 py-1.5 text-xs text-brand-text-white focus:outline-none ${
                                        isCorrect ? 'border-brand-green/40' : 'border-brand-border/25 focus:border-brand-cyan'
                                      }`}
                                    />

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOption(qIndex, optIndex)}
                                      className="p-1 text-brand-text-muted hover:text-red-400 text-xs transition-colors"
                                      title="Remove option"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddOption(qIndex)}
                              className="text-xs font-bold text-brand-cyan hover:underline inline-flex items-center gap-1 pt-1"
                            >
                              <Plus size={13} />
                              <span>Add Option</span>
                            </button>
                          </div>
                        )}

                        {/* Short Answer Specific */}
                        {q.type === 'short_answer' && (
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider block">
                              Expected Correct Answer *
                            </label>
                            <input
                              type="text"
                              value={String(q.correctAnswer || '')}
                              onChange={(e) => handleUpdateQuestion(qIndex, { correctAnswer: e.target.value })}
                              placeholder="e.g. O(log N) or cin, std::cin"
                              className="w-full bg-[#0D2538]/60 border border-brand-border/30 rounded-xl px-3.5 py-2 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-cyan"
                            />
                            <span className="text-[10px] text-brand-text-muted/70 block">
                              Matching is case-insensitive. You can specify comma-separated alternatives (e.g. "cin, std::cin").
                            </span>
                          </div>
                        )}

                        {/* Explanation block */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider block">
                            Explanation / Solution Hint (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={q.explanation || ''}
                            onChange={(e) => handleUpdateQuestion(qIndex, { explanation: e.target.value })}
                            placeholder="Explanation shown to student after answering..."
                            className="w-full bg-[#0D2538]/40 border border-brand-border/20 rounded-xl px-3.5 py-2 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-brand-cyan resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right status & publication column */}
            <div className="space-y-5">
              <div className="glass p-5 rounded-2xl border border-brand-border/15 space-y-4">
                <h3 className="font-bold text-brand-text-white text-sm">Status & Publication</h3>
                
                <div className="flex items-center justify-between border-b border-brand-border/10 pb-3">
                  <span className="text-xs text-brand-text-muted font-bold uppercase">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    status === 'published' 
                      ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green' 
                      : 'bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-brand-border/10 pb-3">
                  <span className="text-xs text-brand-text-muted font-bold uppercase">Questions</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3E4A62]/30 text-brand-cyan border border-brand-border/20">
                    {practiceQuestions.length} Configured
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white hover:bg-brand-card/40 rounded-xl text-xs font-bold transition-all"
                  >
                    <Eye size={14} />
                    <span>Preview JSON Structure</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('draft')}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-brand-card border border-brand-border/20 text-brand-text-white hover:bg-brand-card/80 rounded-xl text-xs font-bold transition-all"
                  >
                    <Save size={14} />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('published')}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-brand-cyan text-[#071A26] rounded-xl text-xs font-bold shadow-cyan-glow hover:opacity-95 transition-opacity"
                  >
                    <Send size={14} />
                    <span>Publish Content</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // LISTING VIEW
        <div className="space-y-6">
          
          {/* selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0D2538]/40 border border-brand-border/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <BookOpen className="text-brand-cyan" size={16} />
              <select
                value={selectedCourseId}
                onChange={(e) => { setSelectedCourseId(e.target.value); setPage(1); }}
                className="flex-1 bg-[#071A26]/80 border border-brand-border/20 text-brand-text-white text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-brand-cyan"
              >
                {loadingFilters ? (
                  <option>Loading courses...</option>
                ) : courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Milestone className="text-brand-blue" size={16} />
              <select
                value={selectedModuleId}
                onChange={(e) => { setSelectedModuleId(e.target.value); setPage(1); }}
                className="flex-1 bg-[#071A26]/80 border border-brand-border/20 text-brand-text-white text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-brand-cyan"
              >
                {modules.length > 0 ? (
                  modules.map(mod => (
                    <option key={mod._id} value={mod._id}>{mod.name}</option>
                  ))
                ) : (
                  <option value="">No Modules inside Course</option>
                )}
              </select>
            </div>
          </div>

          {/* Search bar */}
          {selectedModuleId && (
            <div className="flex max-w-md bg-[#0D2538]/30 border border-brand-border/10 px-4 py-2 rounded-xl items-center gap-3">
              <Search className="text-brand-text-muted" size={16} />
              <input
                type="text"
                placeholder="Search lessons..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent text-xs text-brand-text-white placeholder-brand-text-muted focus:outline-none flex-1"
              />
            </div>
          )}

          {/* Table list */}
          {loadingLessons ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="animate-spin text-brand-cyan" size={28} />
              <span className="text-xs font-semibold text-brand-text-muted">Loading lessons...</span>
            </div>
          ) : lessons.length > 0 ? (
            <div className="space-y-6">
              <div className="border border-brand-border/10 rounded-2xl overflow-hidden bg-[#0D2538]/20 backdrop-blur-md">
                <table className="w-full text-left text-sm text-brand-text-white">
                  <thead className="bg-[#0D2538]/80 text-xs font-bold text-brand-text-muted uppercase tracking-wider border-b border-brand-border/10">
                    <tr>
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/5">
                    {lessons.map((lesson) => (
                      <tr key={lesson._id} className="hover:bg-brand-card/10 transition-colors">
                        <td className="p-4 pl-6 font-bold text-brand-text-white max-w-xs truncate">
                          {lesson.title}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            lesson.status === 'published' 
                              ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green' 
                              : 'bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow'
                          }`}>
                            {lesson.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleOpenForm(lesson)}
                              className="p-2 border border-brand-border/10 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan bg-[#071A26]/40 rounded-xl transition-all"
                              title="Edit Lesson"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(lesson._id, lesson.title)}
                              className="p-2 border border-red-500/10 text-brand-text-muted hover:text-red-400 hover:border-red-500/30 bg-[#071A26]/40 rounded-xl transition-all"
                              title="Delete Lesson"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paging */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-brand-border/10 pt-4">
                  <span className="text-xs font-bold text-brand-text-muted">
                    Showing {lessons.length} of {totalItems} lessons
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0D2538]/20 border border-brand-border/10 rounded-2xl">
              <AlertTriangle size={36} className="text-brand-yellow mx-auto mb-3" />
              <p className="text-sm font-semibold text-brand-text-white">No lessons found</p>
              <p className="text-xs text-brand-text-muted mt-1">Select a module or create a new lesson to begin.</p>
            </div>
          )}

        </div>
      )}

      {/* JSON Preview Modal */}
      {showPreviewModal && previewContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowPreviewModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-[#071A26] border border-brand-border/30 rounded-3xl p-6 w-full max-w-2xl h-[80vh] flex flex-col justify-between shadow-2xl z-10">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-brand-border/10 pb-3">
                <h3 className="text-base font-bold text-brand-text-white">Tiptap JSON Output Preview</h3>
                <button onClick={() => setShowPreviewModal(false)} className="p-1 text-brand-text-muted hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-brand-text-muted font-medium">This JSON structure represents the formatting nodes and text marks saved in MongoDB.</p>
              
              <div className="flex-1 bg-[#0D2538]/30 border border-brand-border/20 rounded-xl p-4 overflow-y-auto no-scrollbar font-mono text-xs text-brand-cyan select-text">
                <pre>{JSON.stringify(previewContent.content, null, 2)}</pre>
              </div>
            </div>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="mt-4 py-2 px-6 bg-brand-card hover:bg-brand-card/85 text-brand-text-white rounded-xl text-xs font-bold border border-brand-border/20 self-end transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
