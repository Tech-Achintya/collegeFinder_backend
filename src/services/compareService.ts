/**
 * @fileoverview Compare Service - Business logic for college comparison.
 * This is a DECISION FEATURE, not just a UI feature.
 *
 * The service:
 * 1. Fetches complete data for 2-3 colleges
 * 2. Aggregates related data (courses, placements, reviews)
 * 3. Returns structured comparison data for side-by-side analysis
 *
 * Key metrics compared:
 * - Fees (min/max)
 * - Placement stats (percentage, avg/highest/median packages)
 * - Rating
 * - Location & type
 * - Courses offered
 * - Review scores
 */

import supabase from '../config/database';
import { CollegeComparison } from '../types';

class CompareService {
  /**
   * Compare 2-3 colleges by fetching and aggregating all relevant data.
   *
   * For each college, this method:
   * 1. Gets base college info
   * 2. Gets the latest placement data
   * 3. Gets course list
   * 4. Calculates average review rating
   *
   * All queries run in parallel per college for optimal performance.
   *
   * @param collegeIds - Array of 2-3 college UUIDs
   * @returns Array of comparison data for each college
   * @throws Error if any college ID is not found
   */
  async compareColleges(collegeIds: string[]): Promise<CollegeComparison[]> {
    // Fetch data for all colleges in parallel
    const comparisonPromises = collegeIds.map((id) => this.getCollegeComparisonData(id));
    const results = await Promise.all(comparisonPromises);

    // Check if any college was not found
    const notFound = results.findIndex((r) => r === null);
    if (notFound !== -1) {
      throw new Error(`College with ID '${collegeIds[notFound]}' not found`);
    }

    return results as CollegeComparison[];
  }

  /**
   * Fetch and aggregate all comparison-relevant data for a single college.
   * Runs multiple DB queries in parallel for performance.
   */
  private async getCollegeComparisonData(collegeId: string): Promise<CollegeComparison | null> {
    // Run all queries in parallel
    const [collegeResult, placementResult, coursesResult, reviewsResult] = await Promise.all([
      // Base college info
      supabase.from('colleges').select('*').eq('id', collegeId).single(),

      // Latest placement data (most recent year)
      supabase
        .from('placements')
        .select('*')
        .eq('college_id', collegeId)
        .order('year', { ascending: false })
        .limit(1)
        .single(),

      // All courses for this college
      supabase.from('courses').select('name, degree_type').eq('college_id', collegeId),

      // All reviews to calculate average rating
      supabase.from('reviews').select('rating').eq('college_id', collegeId),
    ]);

    // If college doesn't exist, return null
    if (collegeResult.error || !collegeResult.data) {
      return null;
    }

    const college = collegeResult.data;
    const placement = placementResult.data;
    const courses = coursesResult.data || [];
    const reviews = reviewsResult.data || [];

    // Calculate average review rating
    const validRatings = reviews.filter((r) => r.rating !== null).map((r) => r.rating as number);
    const avgReviewRating =
      validRatings.length > 0
        ? Math.round((validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length) * 10) / 10
        : null;

    // Build the comparison object with all relevant metrics
    return {
      id: college.id,
      name: college.name,
      location: `${college.city}, ${college.state}`,
      type: college.type,
      established_year: college.established_year,
      rating: college.rating,
      min_fees: college.min_fees,
      max_fees: college.max_fees,
      placement_percentage: placement?.placement_percentage || null,
      avg_package_lpa: placement?.avg_package_lpa || null,
      highest_package_lpa: placement?.highest_package_lpa || null,
      median_package_lpa: placement?.median_package_lpa || null,
      top_recruiters: placement?.top_recruiters || [],
      total_courses: courses.length,
      courses: [...new Set(courses.map((c) => c.degree_type))], // Unique degree types
      avg_review_rating: avgReviewRating,
    };
  }
}

export default new CompareService();
