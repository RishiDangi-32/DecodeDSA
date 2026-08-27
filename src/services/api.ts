import toast from 'react-hot-toast';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : headers,
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMsg = result.message || 'An error occurred while making the request.';
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  return result.data as T;
}

export const api = {
  // Stats
  getStats: () => request<{
    totalCourses: number;
    totalModules: number;
    totalLessons: number;
    publishedLessons: number;
    draftLessons: number;
    recentlyUpdatedLessons: any[];
  }>('/stats'),

  // Global Search
  search: (query: string) => request<{
    courses: any[];
    modules: any[];
    lessons: any[];
  }>(`/search?q=${encodeURIComponent(query)}`),

  // Courses
  getCourses: (params?: { page?: number; limit?: number; search?: string; status?: string; sortBy?: string; sortOrder?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') query.append(key, String(value));
      });
    }
    return fetch(`${API_BASE_URL}/courses?${query.toString()}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error(res.message);
        return {
          courses: res.data as any[],
          pagination: res.pagination as { total: number; page: number; limit: number; pages: number }
        };
      });
  },
  createCourse: (data: any) => request<any>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) => request<any>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) => request<any>(`/courses/${id}`, { method: 'DELETE' }),

  // Modules
  getModules: (courseId?: string, search?: string) => {
    const query = new URLSearchParams();
    if (courseId) query.append('courseId', courseId);
    if (search) query.append('search', search);
    return request<any[]>(`/modules?${query.toString()}`);
  },
  createModule: (data: any) => request<any>('/modules', { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (id: string, data: any) => request<any>(`/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModule: (id: string) => request<any>(`/modules/${id}`, { method: 'DELETE' }),
  reorderModules: (orders: { id: string; order: number }[]) => request<any>('/modules/reorder', {
    method: 'PUT',
    body: JSON.stringify({ orders }),
  }),

  // Lessons
  getLessons: (params?: { page?: number; limit?: number; moduleId?: string; courseId?: string; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') query.append(key, String(value));
      });
    }
    return fetch(`${API_BASE_URL}/lessons?${query.toString()}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error(res.message);
        return {
          lessons: res.data as any[],
          pagination: res.pagination as { total: number; page: number; limit: number; pages: number }
        };
      });
  },
  getLessonBySlug: (slug: string) => request<any>(`/lessons/${slug}`),
  createLesson: (data: any) => request<any>('/lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (id: string, data: any) => request<any>(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLesson: (id: string) => request<any>(`/lessons/${id}`, { method: 'DELETE' }),

  // Media Library
  getMedia: (page?: number, limit?: number) => {
    const query = new URLSearchParams();
    if (page) query.append('page', String(page));
    if (limit) query.append('limit', String(limit));
    return fetch(`${API_BASE_URL}/media?${query.toString()}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error(res.message);
        return {
          media: res.data as any[],
          pagination: res.pagination as { total: number; page: number; limit: number; pages: number }
        };
      });
  },
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error(res.message);
        return res.data;
      });
  },
  deleteMedia: (id: string) => request<any>(`/media/${id}`, { method: 'DELETE' }),

  // Student Portal
  getStudentCourses: () => request<any[]>('/student/courses'),
  getStudentCourseDetails: (courseSlug: string) => request<{
    course: any;
    modules: any[];
    lessons: any[];
  }>(`/student/courses/${courseSlug}`),
  getStudentLesson: (lessonSlug: string) => request<any>(`/student/lessons/${lessonSlug}`),
};
