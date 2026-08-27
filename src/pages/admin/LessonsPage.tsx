import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ArrowUpDown, ChevronLeft, 
  ChevronRight, RefreshCw, X, Eye, BookOpen, Milestone, 
  AlertTriangle, Save, Send, EyeOff, LayoutTemplate
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import RichTextEditor from '../../components/ui/RichTextEditor';
import ImageUpload from '../../components/ui/ImageUpload';
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
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
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
    if (!editingId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  };

  const handleOpenForm = (lesson?: Lesson) => {
    if (lesson) {
      setEditingId(lesson._id);
      setTitle(lesson.title);
      setSlug(lesson.slug);
      setShortDescription(lesson.shortDescription || '');
      setFeaturedImage(lesson.featuredImage || '');
      setContent(lesson.content || { type: 'doc', content: [] });
      setStatus(lesson.status);
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setShortDescription('');
      setFeaturedImage('');
      setContent({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing your lesson content here...' }]
          }
        ]
      });
      setStatus('draft');
    }
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingId(null);
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

    const currentStatus = publishedState || status;

    const payload = {
      moduleId: selectedModuleId,
      title,
      slug: slug || undefined,
      shortDescription,
      content,
      featuredImage: featuredImage || undefined,
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
    setPreviewContent({ title, shortDescription, featuredImage, content });
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
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Slug (Auto-Generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm font-mono text-brand-cyan focus:outline-none focus:border-brand-cyan"
                  placeholder="introduction-to-binary-search"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl p-4 text-sm text-brand-text-white focus:outline-none focus:border-brand-cyan resize-none"
                  placeholder="Summarize what this lesson covers..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  Lesson Rich Content *
                </label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>

            {/* Right featured image column */}
            <div className="space-y-5">
              <ImageUpload value={featuredImage} onChange={setFeaturedImage} />

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
                      <th className="p-4 pl-6">Featured Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/5">
                    {lessons.map((lesson) => (
                      <tr key={lesson._id} className="hover:bg-brand-card/10 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="w-14 h-9 rounded-lg border border-brand-border/20 overflow-hidden bg-[#071A26]">
                            {lesson.featuredImage ? (
                              <img src={lesson.featuredImage} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                                <LayoutTemplate size={14} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-brand-text-white max-w-xs truncate">
                          {lesson.title}
                        </td>
                        <td className="p-4 text-xs font-mono text-brand-cyan">
                          {lesson.slug}
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
