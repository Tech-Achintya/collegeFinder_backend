/**
 * @fileoverview College Service - Business logic for college operations.
 * Handles all database queries related to colleges, including:
 * - Listing with pagination, search, and filters
 * - Fetching single college details with related data
 * - Getting featured colleges
 * - Providing filter options (distinct locations, courses)
 *
 * All Supabase queries are centralized here to keep controllers thin.
 */

import supabase from '../config/database';
import { College, CollegeDetail, CollegeQueryParams } from '../types';

class CollegeService {
  /**
   * Get paginated list of colleges with optional search & filters.
   *
   * Search: Uses case-insensitive partial match on college name.
   * Filters: Supports state, city, course type, and fee range.
   * Sorting: Supports rating, name, or fees with asc/desc order.
   *
   * @param params - Query parameters from the request
   * @returns Object containing colleges array and total count
   */
  async getColleges(params: CollegeQueryParams): Promise<{ colleges: College[]; total: number }> {
    const {
      page = 1,
      limit = 12,
      search,
      state,
      city,
      course,
      min_fees,
      max_fees,
      sort_by = 'rating',
      sort_order = 'desc',
    } = params;

    const offset = (page - 1) * limit;

    // Start building the query
    let query = supabase
      .from('colleges')
      .select('*', { count: 'exact' });

    // Apply search filter (case-insensitive partial match on name)
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply location filters
    if (state) {
      query = query.eq('state', state);
    }
    if (city) {
      query = query.eq('city', city);
    }

    // Apply fee range filter
    if (min_fees) {
      query = query.gte('min_fees', min_fees);
    }
    if (max_fees) {
      query = query.lte('max_fees', max_fees);
    }

    // Apply sorting
    const sortColumn = sort_by === 'fees' ? 'min_fees' : sort_by;
    query = query.order(sortColumn, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch colleges: ${error.message}`);
    }

    // If course filter is specified, we need to filter by related courses table
    // This requires a separate query since Supabase doesn't support JOIN-based filtering directly
    if (course) {
      return this.filterByCourseName(data || [], course, count || 0);
    }

    return {
      colleges: data || [],
      total: count || 0,
    };
  }

  /**
   * Filter colleges that offer a specific course/degree type.
   * Since Supabase doesn't support JOIN-based WHERE clauses easily,
   * we fetch college IDs from courses table and filter in-memory.
   */
  private async filterByCourseName(
    colleges: College[],
    courseName: string,
    _total: number
  ): Promise<{ colleges: College[]; total: number }> {
    // Get college IDs that offer this course type
    const { data: courseData } = await supabase
      .from('courses')
      .select('college_id')
      .ilike('degree_type', `%${courseName}%`);

    if (!courseData) return { colleges: [], total: 0 };

    const collegeIds = new Set(courseData.map((c) => c.college_id));
    const filtered = colleges.filter((college) => collegeIds.has(college.id));

    return {
      colleges: filtered,
      total: filtered.length,
    };
  }

  /**
   * Get a single college by ID along with all related data.
   * Fetches courses, placements, and reviews in parallel for performance.
   *
   * @param id - College UUID
   * @returns Full college detail or null if not found
   */
  async getCollegeById(id: string): Promise<CollegeDetail | null> {
    // Fetch college and related data in parallel for better performance
    const [collegeResult, coursesResult, placementsResult, reviewsResult] = await Promise.all([
      supabase.from('colleges').select('*').eq('id', id).single(),
      supabase.from('courses').select('*').eq('college_id', id).order('name'),
      supabase.from('placements').select('*').eq('college_id', id).order('year', { ascending: false }),
      supabase.from('reviews').select('*').eq('college_id', id).order('created_at', { ascending: false }),
    ]);

    if (collegeResult.error || !collegeResult.data) {
      return null;
    }

    return {
      ...collegeResult.data,
      courses: coursesResult.data || [],
      placements: placementsResult.data || [],
      reviews: reviewsResult.data || [],
    };
  }

  /**
   * Get featured colleges for the homepage.
   * Returns colleges flagged as `is_featured`, sorted by rating.
   */
  async getFeaturedColleges(): Promise<College[]> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(8);

    if (error) {
      throw new Error(`Failed to fetch featured colleges: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get distinct state values for location filter dropdown.
   * Returns sorted list of unique states from all colleges.
   */
  async getDistinctLocations(): Promise<{ states: string[]; cities: string[] }> {
    const [statesResult, citiesResult] = await Promise.all([
      supabase.from('colleges').select('state'),
      supabase.from('colleges').select('city'),
    ]);

    const states = [...new Set((statesResult.data || []).map((r) => r.state))].sort();
    const cities = [...new Set((citiesResult.data || []).map((r) => r.city))].sort();

    return { states, cities };
  }

  /**
   * Get distinct course/degree types for the course filter dropdown.
   */
  async getDistinctCourses(): Promise<string[]> {
    const { data } = await supabase.from('courses').select('degree_type');

    return [...new Set((data || []).map((r) => r.degree_type))].sort();
  }
}

export default new CollegeService();
