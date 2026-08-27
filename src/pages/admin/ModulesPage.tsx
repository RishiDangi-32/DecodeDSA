import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, X, 
  BookOpen, Milestone, AlertTriangle, Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Module } from '../../types';
import toast from 'react-hot-toast';

export default function ModulesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);

  // Form State
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState('0');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await api.getCourses({ limit: 100, sortBy: 'order', sortOrder: 'asc' });
      setCourses(res.courses);
      if (res.courses.length > 0) {
        setSelectedCourseId(res.courses[0]._id);
      }
    } catch (error) {
      // api handles toast
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchModules = async () => {
    if (!selectedCourseId) return;
    setLoadingModules(true);
    try {
      const data = await api.getModules(selectedCourseId);
      setModules(data);
    } catch (error) {
      // api handles toast
    } finally {
      setLoadingModules(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchModules();
  }, [selectedCourseId]);

  const handleOpenDrawer = (mod?: Module) => {
    if (mod) {
      setEditingId(mod._id);
      setName(mod.name);
      setSlug(mod.slug);
      setDescription(mod.description || '');
      setOrder(String(mod.order));
      setStatus(mod.status);
    } else {
      setEditingId(null);
      setName('');
      setSlug('');
      setDescription('');
      setOrder(String(modules.length)); // default to end of list
      setStatus('active');
    }
    setShowDrawer(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('Please select a Course first.');
      return;
    }
    if (!name.trim()) {
      toast.error('Module Name is required.');
      return;
    }

    const payload = {
      courseId: selectedCourseId,
      name,
      slug: slug || undefined,
      description,
      order: parseInt(order) || 0,
      status
    };

    try {
      if (editingId) {
        await api.updateModule(editingId, payload);
        toast.success('Module updated successfully!');
      } else {
        await api.createModule(payload);
        toast.success('Module created successfully!');
      }
      setShowDrawer(false);
      fetchModules();
    } catch (error) {
      // Handled in api helper
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete the module "${name}"?\n\nWARNING: This will CASCADE delete all associated lessons in this module! This action is irreversible.`)) {
      try {
        await api.deleteModule(id);
        toast.success('Module and associated content deleted.');
        fetchModules();
      } catch (error) {
        // Handled in api helper
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedList = [...modules];

    // Swap items in memory list
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    // Map new orders matching array index positions
    const payload = reorderedList.map((mod, idx) => ({
      id: mod._id,
      order: idx
    }));

    // Optimistic UI updates
    setModules(reorderedList);

    try {
      await api.reorderModules(payload);
      toast.success('Order saved successfully.');
    } catch (error) {
      // Revert back on error
      fetchModules();
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 relative">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
            Module Management
          </h1>
          <p className="text-sm text-brand-text-muted font-medium mt-1">
            Group syllabus units and reorder modules inside courses.
          </p>
        </div>
        <button
          onClick={() => handleOpenDrawer()}
          disabled={!selectedCourseId}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold text-sm shadow-cyan-glow hover:bg-brand-cyan hover:text-[#071A26] transition-all self-start sm:self-center disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus size={16} />
          <span>Create Module</span>
        </button>
      </div>

      {/* Select Course Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#0D2538]/40 border border-brand-border/10 p-4 rounded-2xl">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <BookOpen className="text-brand-cyan" size={18} />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses}
            className="flex-1 bg-[#071A26]/80 border border-brand-border/20 text-brand-text-white text-sm font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-brand-cyan"
          >
            {loadingCourses ? (
              <option>Loading courses...</option>
            ) : courses.length > 0 ? (
              courses.map(course => (
                <option key={course._id} value={course._id}>{course.name}</option>
              ))
            ) : (
              <option>No Courses Created Yet</option>
            )}
          </select>
        </div>

        <button 
          onClick={fetchModules} 
          disabled={!selectedCourseId}
          className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors self-end md:self-center disabled:opacity-30"
          title="Refresh list"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Modules List Display */}
      {loadingModules ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="animate-spin text-brand-cyan" size={28} />
          <span className="text-xs font-semibold text-brand-text-muted">Loading modules...</span>
        </div>
      ) : modules.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 max-w-4xl">
          {modules.map((mod, idx) => (
            <div 
              key={mod._id}
              className="glass p-5 rounded-2xl border border-brand-border/10 hover:border-brand-cyan/20 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Index badge */}
                <div className="w-8 h-8 rounded-lg bg-brand-cyan/5 border border-brand-cyan/15 flex items-center justify-center text-brand-cyan text-xs font-black shadow-cyan-glow">
                  {idx + 1}
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-bold text-brand-text-white hover:text-brand-cyan transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-xs font-mono text-brand-text-muted">
                    slug: {mod.slug}
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3">
                {/* Status indicator */}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  mod.status === 'active' 
                    ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green' 
                    : 'bg-brand-text-muted/10 border border-brand-text-muted/20 text-brand-text-muted'
                }`}>
                  {mod.status}
                </span>

                <div className="h-6 w-px bg-brand-border/15" />

                {/* Move arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-2 border border-brand-border/10 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none"
                    title="Move up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    disabled={idx === modules.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-2 border border-brand-border/10 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none"
                    title="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div className="h-6 w-px bg-brand-border/15" />

                {/* Edit & Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDrawer(mod)}
                    className="p-2 border border-brand-border/10 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan bg-[#071A26]/40 rounded-xl transition-all"
                    title="Edit Module"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(mod._id, mod.name)}
                    className="p-2 border border-red-500/10 text-brand-text-muted hover:text-red-400 hover:border-red-500/30 bg-[#071A26]/40 rounded-xl transition-all"
                    title="Delete Module"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0D2538]/20 border border-brand-border/10 rounded-2xl max-w-4xl">
          <AlertTriangle size={36} className="text-brand-yellow mx-auto mb-3" />
          <p className="text-sm font-semibold text-brand-text-white">No modules created yet</p>
          <p className="text-xs text-brand-text-muted mt-1">Create a new module to start building the course curriculum.</p>
        </div>
      )}

      {/* Drawer Overlay for Create/Edit */}
      {showDrawer && (
        <>
          <div 
            onClick={() => setShowDrawer(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          />
          <div className="fixed top-0 right-0 h-screen w-full sm:max-w-md bg-[#071A26] border-l border-brand-border/30 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border/15 pb-4">
                <h3 className="text-lg font-bold text-brand-text-white">
                  {editingId ? 'Edit Module Details' : 'Create New Module'}
                </h3>
                <button 
                  onClick={() => setShowDrawer(false)}
                  className="p-2 text-brand-text-muted hover:text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                    Module Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm text-brand-text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-cyan"
                    placeholder="e.g. Memory Layout & Pointers"
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
                    placeholder="memory-layout-and-pointers"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl p-4 text-sm text-brand-text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-cyan resize-none"
                    placeholder="Describe the module focus..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                      Order Position
                    </label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm text-brand-text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm text-brand-text-white focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-cyan text-[#071A26] font-bold text-sm rounded-xl shadow-cyan-glow hover:opacity-90 transition-opacity mt-4"
                >
                  {editingId ? 'Save Module Details' : 'Create Module'}
                </button>
              </form>
            </div>
            
          </div>
        </>
      )}

    </div>
  );
}
