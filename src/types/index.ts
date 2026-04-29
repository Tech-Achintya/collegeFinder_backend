/**
 * @fileoverview TypeScript type definitions for the College Discovery Platform.
 * These types mirror the database schema and are used throughout the backend
 * for type safety in controllers, services, and API responses.
 */

// =============================================
// DATABASE MODEL TYPES
// =============================================

/** Represents a college record from the `colleges` table */
export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  type: 'Government' | 'Private' | 'Deemed' | 'Autonomous';
  affiliation: string | null;
  established_year: number | null;
  description: string | null;
  website: string | null;

  rating: number;
  min_fees: number | null;
  max_fees: number | null;

  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Represents a course record from the `courses` table */
export interface Course {
  id: string;
  college_id: string;
  name: string;
  degree_type: string;
  duration_years: number | null;
  fees: number | null;
  specialization: string | null;
  seats: number | null;
  created_at: string;
}

/** Represents a placement record from the `placements` table */
export interface Placement {
  id: string;
  college_id: string;
  year: number;
  placement_percentage: number | null;
  avg_package_lpa: number | null;
  highest_package_lpa: number | null;
  median_package_lpa: number | null;
  top_recruiters: string[];
  created_at: string;
}

/** Represents a review record from the `reviews` table */
export interface Review {
  id: string;
  college_id: string;
  author_name: string;
  rating: number | null;
  title: string | null;
  content: string | null;
  course_studied: string | null;
  graduation_year: number | null;
  created_at: string;
}

/** Represents an exam record from the `exams` table */
export interface Exam {
  id: string;
  name: string;
  full_name: string | null;
  category: 'Engineering' | 'Medical' | 'Management' | 'Law' | 'Design' | 'Other';
  created_at: string;
}

/** Represents the college-exam mapping from the `college_exams` table */
export interface CollegeExam {
  id: string;
  college_id: string;
  exam_id: string;
  min_rank: number;
  max_rank: number;
  year: number;
  created_at: string;
}

// =============================================
// API REQUEST TYPES
// =============================================

/** Query parameters for the college listing endpoint */
export interface CollegeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  city?: string;
  course?: string;
  min_fees?: number;
  max_fees?: number;
  sort_by?: 'rating' | 'name' | 'fees';
  sort_order?: 'asc' | 'desc';
}

/** Request body for the compare endpoint */
export interface CompareRequest {
  college_ids: string[]; // Array of 2-3 college UUIDs
}

/** Request body for the predictor endpoint */
export interface PredictorRequest {
  exam_id: string;
  rank: number;
}

// =============================================
// API RESPONSE TYPES
// =============================================

/** Standard paginated API response wrapper */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/** Standard single-item API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/** Error response structure */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

/** Full college detail including related data */
export interface CollegeDetail extends College {
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
}

/** Comparison data for a single college */
export interface CollegeComparison {
  id: string;
  name: string;
  location: string;
  type: string;
  established_year: number | null;
  rating: number;
  min_fees: number | null;
  max_fees: number | null;

  placement_percentage: number | null;
  avg_package_lpa: number | null;
  highest_package_lpa: number | null;
  median_package_lpa: number | null;
  top_recruiters: string[];
  total_courses: number;
  courses: string[];
  avg_review_rating: number | null;
}

/** Predictor result - a college with its cutoff info */
export interface PredictorResult {
  college: College;
  cutoff: {
    min_rank: number;
    max_rank: number;
    year: number;
  };
  admission_chance: 'High' | 'Moderate' | 'Low';
}
