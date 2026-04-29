/**
 * @fileoverview Predictor Service - Business logic for the college predictor tool.
 *
 * This is a RULE-BASED predictor that:
 * 1. Takes an exam type and student's rank as input
 * 2. Queries the college_exams table for cutoff data
 * 3. Returns matching colleges with admission chance levels
 *
 * Admission Chance Logic:
 * - "High"     → Student's rank is BELOW the min_rank (well above cutoff)
 * - "Moderate" → Student's rank is between min_rank and max_rank
 * - "Low"      → Student's rank is near or slightly above max_rank
 *
 * This approach uses historical cutoff data stored in the database,
 * making it data-driven rather than hardcoded.
 */

import supabase from '../config/database';
import { Exam, PredictorResult } from '../types';

class PredictorService {
  /**
   * Get all available exams for the predictor form dropdown.
   * Returns exams sorted by category and name.
   */
  async getExams(): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('category')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch exams: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Predict colleges based on exam and rank.
   *
   * Algorithm:
   * 1. Find all college_exams entries for the given exam
   * 2. Filter to entries where the student's rank falls within a viable range
   *    (we use 120% of max_rank as buffer to include "Low chance" colleges)
   * 3. Calculate admission chance based on where the rank falls relative to cutoffs
   * 4. Sort results by admission chance (High → Moderate → Low) then by college rating
   *
   * @param examId - UUID of the exam
   * @param rank - Student's rank in the exam
   * @returns Array of predictor results with college info and admission chances
   */
  async predictColleges(examId: string, rank: number): Promise<PredictorResult[]> {
    // Step 1: Get all college-exam mappings for this exam
    // We fetch entries where the student's rank could potentially qualify
    // Using max_rank * 1.2 as buffer to show "Low chance" colleges too
    const { data: examData, error: examError } = await supabase
      .from('college_exams')
      .select('*')
      .eq('exam_id', examId)
      .order('min_rank', { ascending: true });

    if (examError) {
      throw new Error(`Failed to fetch exam data: ${examError.message}`);
    }

    if (!examData || examData.length === 0) {
      return [];
    }

    // Step 2: Filter and categorize by admission chance
    const viableEntries = examData.filter((entry) => {
      // Include colleges where rank is within 120% of max_rank (buffer for "Low" chance)
      return rank <= entry.max_rank * 1.2;
    });

    if (viableEntries.length === 0) {
      return [];
    }

    // Step 3: Fetch college details for all matching entries
    const collegeIds = [...new Set(viableEntries.map((e) => e.college_id))];
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('*')
      .in('id', collegeIds);

    if (collegeError) {
      throw new Error(`Failed to fetch college details: ${collegeError.message}`);
    }

    // Create a map for quick college lookup
    const collegeMap = new Map((colleges || []).map((c) => [c.id, c]));

    // Step 4: Build results with admission chance calculation
    const results: PredictorResult[] = viableEntries
      .map((entry) => {
        const college = collegeMap.get(entry.college_id);
        if (!college) return null;

        return {
          college,
          cutoff: {
            min_rank: entry.min_rank,
            max_rank: entry.max_rank,
            year: entry.year,
          },
          admission_chance: this.calculateAdmissionChance(rank, entry.min_rank, entry.max_rank),
        };
      })
      .filter((r): r is PredictorResult => r !== null);

    // Step 5: Sort by admission chance priority, then by rating
    const chancePriority = { High: 1, Moderate: 2, Low: 3 };
    results.sort((a, b) => {
      const chanceDiff = chancePriority[a.admission_chance] - chancePriority[b.admission_chance];
      if (chanceDiff !== 0) return chanceDiff;
      return (b.college.rating || 0) - (a.college.rating || 0);
    });

    return results;
  }

  /**
   * Calculate admission chance based on rank relative to cutoff range.
   *
   * Logic:
   * - Rank ≤ min_rank (top cutoff): HIGH chance — student is well above the cutoff
   * - min_rank < Rank ≤ max_rank: MODERATE chance — student is in the range
   * - Rank > max_rank (but within buffer): LOW chance — student is borderline
   */
  private calculateAdmissionChance(
    rank: number,
    minRank: number,
    maxRank: number
  ): 'High' | 'Moderate' | 'Low' {
    if (rank <= minRank) {
      return 'High';
    } else if (rank <= maxRank) {
      return 'Moderate';
    } else {
      return 'Low';
    }
  }
}

export default new PredictorService();
