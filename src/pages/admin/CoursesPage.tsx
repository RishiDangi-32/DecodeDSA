import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, ArrowUpDown, ChevronLeft, 
  ChevronRight, RefreshCw, X, Eye, BookOpen, AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { Course } from '../../types';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form State
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [order, setOrder] = useState('0');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses({
        page,
        limit: 8,
        search,
        status: statusFilter,
        sortBy,
        sortOrder
      });
      setCourses(res.courses);
      setTotalPages(res.pagination.pages);
      setTotalItems(res.pagination.total);
    } catch (error) {
      // toast shown in api helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, search, statusFilter, sortBy, sortOrder]);

  const handleOpenDrawer = (course?: Course) => {
    if (course) {
      setEditingId(course._id);
      setName(course.name);
      setSlug(course.slug);
      setDescription(course.description || '');
      setIcon(course.icon);
      setOrder(String(course.order));
      setStatus(course.status);
    } else {
      setEditingId(null);
      setName('');
      setSlug('');
      setDescription('');
      setIcon('BookOpen');
      setOrder('0');
      setStatus('active');
    }
    setShowDrawer(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      // Auto-generate slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace
        .replace(/-+/g, '-'); // collapse dashes
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Course Name is required.');
      return;
    }

    const payload = {
      name,
      slug: slug || undefined,
      description,
      icon,
      order: parseInt(order) || 0,
      status
    };

    try {
      if (editingId) {
        await api.updateCourse(editingId, payload);
        toast.success('Course updated successfully!');
      } else {
        await api.createCourse(payload);
        toast.success('Course created successfully!');
      }
      setShowDrawer(false);
      fetchCourses();
    } catch (error) {
      // Handled in api helper
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete the course "${name}"?\n\nWARNING: This will CASCADE delete all associated modules and lessons in this course! This action is irreversible.`)) {
      try {
        await api.deleteCourse(id);
        toast.success('Course and associated content deleted.');
        fetchCourses();
      } catch (error) {
        // Handled in api helper
      }
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const iconOptions = ['BookOpen', 'Code', 'Terminal', 'Cpu', 'Activity', 'Sliders', 'Globe', 'Database'];

  return (
    <div className="p-6 sm:p-8 space-y-8 relative">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
            Course Management
          </h1>
          <p className="text-sm text-brand-text-muted font-medium mt-1">
            Create, update, and sort academic courses.
          </p>
        </div>
        <button
          onClick={() => handleOpenDrawer()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold text-sm shadow-cyan-glow hover:bg-brand-cyan hover:text-[#071A26] transition-all self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Create Course</span>
        </button>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#0D2538]/40 border border-brand-border/10 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-text-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#071A26]/60 border border-brand-border/20 rounded-xl py-2 pl-10 pr-4 text-sm text-brand-text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-cyan transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#071A26]/60 border border-brand-border/20 text-brand-text-muted text-xs font-bold py-2 px-4 rounded-xl focus:outline-none focus:border-brand-cyan"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button 
            onClick={fetchCourses} 
            className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Courses List Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="animate-spin text-brand-cyan" size={28} />
          <span className="text-xs font-semibold text-brand-text-muted">Loading courses...</span>
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-6">
          <div className="border border-brand-border/10 rounded-2xl overflow-hidden bg-[#0D2538]/20 backdrop-blur-md">
            <table className="w-full text-left text-sm text-brand-text-white">
              <thead className="bg-[#0D2538]/80 text-xs font-bold text-brand-text-muted uppercase tracking-wider border-b border-brand-border/10">
                <tr>
                  <th className="p-4 pl-6">Icon</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <span>Course Name</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="p-4">Slug</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('order')}>
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <span>Order</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/5">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-brand-card/10 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="w-9 h-9 rounded-xl bg-brand-cyan/5 border border-brand-cyan/15 flex items-center justify-center text-brand-cyan">
                        <BookOpen size={16} />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-brand-text-white max-w-xs truncate">
                      {course.name}
                    </td>
                    <td className="p-4 text-xs font-mono text-brand-text-muted">
                      {course.slug}
                    </td>
                    <td className="p-4 font-semibold text-brand-cyan">
                      {course.order}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        course.status === 'active' 
                          ? 'bg-brand-green/10 border border-brand-green/20 text-brand-green' 
                          : 'bg-brand-text-muted/10 border border-brand-text-muted/20 text-brand-text-muted'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenDrawer(course)}
                          className="p-2 border border-brand-border/10 text-brand-text-muted hover:text-brand-cyan hover:border-brand-cyan bg-[#071A26]/40 rounded-xl transition-all"
                          title="Edit Course"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id, course.name)}
                          className="p-2 border border-red-500/10 text-brand-text-muted hover:text-red-400 hover:border-red-500/30 bg-[#071A26]/40 rounded-xl transition-all"
                          title="Delete Course"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-brand-border/10 pt-4">
              <span className="text-xs font-bold text-brand-text-muted">
                Showing {courses.length} of {totalItems} courses
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
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
          <p className="text-sm font-semibold text-brand-text-white">No courses found</p>
          <p className="text-xs text-brand-text-muted mt-1">Try resetting the search filters or create a new course.</p>
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
                  {editingId ? 'Edit Course Details' : 'Create New Course'}
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
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#0D2538]/50 border border-brand-border/30 rounded-xl px-4 py-2.5 text-sm text-brand-text-white placeholder-brand-text-muted focus:outline-none focus:border-brand-cyan"
                    placeholder="e.g. Basic C++ Programming"
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
                    placeholder="basic-cpp-programming"
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
                    placeholder="Describe the course scope..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider block">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {iconOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setIcon(opt)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          icon === opt 
                            ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan shadow-cyan-glow' 
                            : 'border-brand-border/20 bg-[#0D2538]/40 text-brand-text-muted hover:text-white'
                        }`}
                      >
                        <BookOpen size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                      Order Number
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
                  {editingId ? 'Save Course Details' : 'Create Course'}
                </button>
              </form>
            </div>
            
          </div>
        </>
      )}

    </div>
  );
}
