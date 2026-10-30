export interface Course {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  courseId: string | { _id: string; name: string };
  name: string;
  slug: string;
  description?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PracticeQuestion {
  _id?: string;
  type: 'mcq' | 'short_answer';
  question: string;
  image?: string; // Optional screenshot / diagram
  options?: string[]; // for mcq
  correctAnswer: string | number; // option index (number) for MCQ or text (string) for short answer
  explanation?: string;
}

export interface Lesson {
  _id: string;
  moduleId: string | { 
    _id: string; 
    name: string; 
    courseId: string | { _id: string; name: string } 
  };
  title: string;
  slug?: string;
  shortDescription?: string;
  content: any; // Structured Tiptap JSON node
  simulationHtml?: string;
  youtubeUrl?: string;
  practiceQuestions?: PracticeQuestion[];
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  _id: string;
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  recentlyUpdatedLessons: Lesson[];
}
