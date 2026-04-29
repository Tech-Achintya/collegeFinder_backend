/**
 * @fileoverview Database seed script - Populates Supabase with mock college data.
 * Run with: npx tsx src/seed/seedData.ts
 * 
 * This inserts 20 colleges, their courses, placements, reviews, exams, and cutoff data.
 * All data is AI-generated but realistic for Indian engineering/management colleges.
 */

import supabase from '../config/database';

// =============================================
// MOCK DATA - 20 Indian Colleges
// =============================================

const colleges = [
  { name: 'Indian Institute of Technology Bombay', location: 'Mumbai, Maharashtra', state: 'Maharashtra', city: 'Mumbai', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1958, description: 'IIT Bombay is one of the premier engineering institutions in India, known for its cutting-edge research and world-class faculty.', website: 'https://www.iitb.ac.in', rating: 4.8, min_fees: 200000, max_fees: 250000, is_featured: true },
  { name: 'Indian Institute of Technology Delhi', location: 'New Delhi, Delhi', state: 'Delhi', city: 'New Delhi', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1961, description: 'IIT Delhi is a leading institution offering world-class education in engineering, technology, and sciences.', website: 'https://home.iitd.ac.in', rating: 4.7, min_fees: 210000, max_fees: 260000, is_featured: true },
  { name: 'Indian Institute of Technology Madras', location: 'Chennai, Tamil Nadu', state: 'Tamil Nadu', city: 'Chennai', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1959, description: 'IIT Madras consistently ranks as India\'s top engineering institute with strong industry connections.', website: 'https://www.iitm.ac.in', rating: 4.9, min_fees: 200000, max_fees: 250000, is_featured: true },
  { name: 'Indian Institute of Technology Kanpur', location: 'Kanpur, Uttar Pradesh', state: 'Uttar Pradesh', city: 'Kanpur', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1959, description: 'IIT Kanpur is known for its rigorous academic programs and pioneering research in computer science.', website: 'https://www.iitk.ac.in', rating: 4.6, min_fees: 200000, max_fees: 240000, is_featured: true },
  { name: 'Indian Institute of Technology Kharagpur', location: 'Kharagpur, West Bengal', state: 'West Bengal', city: 'Kharagpur', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1951, description: 'The oldest IIT, known for its sprawling campus and diverse academic programs.', website: 'https://www.iitkgp.ac.in', rating: 4.5, min_fees: 195000, max_fees: 235000, is_featured: true },
  { name: 'BITS Pilani', location: 'Pilani, Rajasthan', state: 'Rajasthan', city: 'Pilani', type: 'Private', affiliation: 'UGC', established_year: 1964, description: 'BITS Pilani is a premier private university known for its flexible academic system and strong industry ties.', website: 'https://www.bits-pilani.ac.in', rating: 4.5, min_fees: 450000, max_fees: 550000, is_featured: true },
  { name: 'National Institute of Technology Trichy', location: 'Tiruchirappalli, Tamil Nadu', state: 'Tamil Nadu', city: 'Tiruchirappalli', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1964, description: 'NIT Trichy is among the top NITs, known for excellent placements and research output.', website: 'https://www.nitt.edu', rating: 4.3, min_fees: 150000, max_fees: 200000, is_featured: true },
  { name: 'Delhi Technological University', location: 'New Delhi, Delhi', state: 'Delhi', city: 'New Delhi', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1941, description: 'DTU (formerly DCE) is a premier state engineering university with a strong alumni network.', website: 'https://dtu.ac.in', rating: 4.1, min_fees: 170000, max_fees: 220000, is_featured: true },
  { name: 'Vellore Institute of Technology', location: 'Vellore, Tamil Nadu', state: 'Tamil Nadu', city: 'Vellore', type: 'Private', affiliation: 'UGC, NAAC', established_year: 1984, description: 'VIT is a top private university with a global outlook and excellent placement record.', website: 'https://vit.ac.in', rating: 4.2, min_fees: 300000, max_fees: 400000, is_featured: false },
  { name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu', state: 'Tamil Nadu', city: 'Chennai', type: 'Private', affiliation: 'UGC, NAAC', established_year: 1985, description: 'SRMIST offers diverse programs with state-of-the-art facilities and strong industry partnerships.', website: 'https://www.srmist.edu.in', rating: 4.0, min_fees: 250000, max_fees: 350000, is_featured: false },
  { name: 'NIT Warangal', location: 'Warangal, Telangana', state: 'Telangana', city: 'Warangal', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1959, description: 'NIT Warangal is one of the top NITs known for its excellent faculty and research.', website: 'https://www.nitw.ac.in', rating: 4.2, min_fees: 140000, max_fees: 190000, is_featured: false },
  { name: 'NIT Surathkal', location: 'Mangalore, Karnataka', state: 'Karnataka', city: 'Mangalore', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1960, description: 'NITK Surathkal is a premier NIT known for its coastal campus and strong technical programs.', website: 'https://www.nitk.ac.in', rating: 4.3, min_fees: 145000, max_fees: 195000, is_featured: false },
  { name: 'Jadavpur University', location: 'Kolkata, West Bengal', state: 'West Bengal', city: 'Kolkata', type: 'Government', affiliation: 'UGC, NAAC', established_year: 1955, description: 'Jadavpur University is a prestigious state university known for its engineering and arts programs.', website: 'http://www.jaduniv.edu.in', rating: 4.1, min_fees: 50000, max_fees: 80000, is_featured: false },
  { name: 'IIT Roorkee', location: 'Roorkee, Uttarakhand', state: 'Uttarakhand', city: 'Roorkee', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1847, description: 'One of India\'s oldest technical institutions, IIT Roorkee has a rich legacy of engineering excellence.', website: 'https://www.iitr.ac.in', rating: 4.5, min_fees: 200000, max_fees: 250000, is_featured: false },
  { name: 'IIT Guwahati', location: 'Guwahati, Assam', state: 'Assam', city: 'Guwahati', type: 'Government', affiliation: 'UGC, AICTE', established_year: 1994, description: 'IIT Guwahati is known for its scenic campus and growing research infrastructure.', website: 'https://www.iitg.ac.in', rating: 4.4, min_fees: 200000, max_fees: 245000, is_featured: false },
  { name: 'Manipal Institute of Technology', location: 'Manipal, Karnataka', state: 'Karnataka', city: 'Manipal', type: 'Private', affiliation: 'UGC, NAAC', established_year: 1957, description: 'MIT Manipal is a top private engineering college known for its world-class infrastructure.', website: 'https://manipal.edu', rating: 4.1, min_fees: 380000, max_fees: 480000, is_featured: false },
  { name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', state: 'Telangana', city: 'Hyderabad', type: 'Autonomous', affiliation: 'UGC', established_year: 1998, description: 'IIIT-H is a research-focused institute excelling in CS, AI, and machine learning.', website: 'https://www.iiit.ac.in', rating: 4.4, min_fees: 300000, max_fees: 380000, is_featured: false },
  { name: 'College of Engineering Pune', location: 'Pune, Maharashtra', state: 'Maharashtra', city: 'Pune', type: 'Government', affiliation: 'Savitribai Phule Pune University', established_year: 1854, description: 'COEP is one of the oldest engineering colleges in Asia with a strong heritage.', website: 'https://www.coep.org.in', rating: 4.0, min_fees: 120000, max_fees: 160000, is_featured: false },
  { name: 'PES University', location: 'Bangalore, Karnataka', state: 'Karnataka', city: 'Bangalore', type: 'Private', affiliation: 'UGC', established_year: 1972, description: 'PES University is known for its innovation-driven curriculum and strong tech placements.', website: 'https://pes.edu', rating: 3.9, min_fees: 350000, max_fees: 450000, is_featured: false },
  { name: 'Thapar Institute of Engineering', location: 'Patiala, Punjab', state: 'Punjab', city: 'Patiala', type: 'Deemed', affiliation: 'UGC', established_year: 1956, description: 'Thapar is a top deemed university in North India with strong industry connections.', website: 'https://www.thapar.edu', rating: 4.0, min_fees: 280000, max_fees: 350000, is_featured: false },
];


// Courses per college (mapped by index)
const coursesData = [
  // B.Tech courses common to most engineering colleges
  { name: 'Computer Science and Engineering', degree_type: 'B.Tech', duration_years: 4, specialization: 'Computer Science', seats: 120 },
  { name: 'Electrical Engineering', degree_type: 'B.Tech', duration_years: 4, specialization: 'Electrical', seats: 80 },
  { name: 'Mechanical Engineering', degree_type: 'B.Tech', duration_years: 4, specialization: 'Mechanical', seats: 80 },
  { name: 'Civil Engineering', degree_type: 'B.Tech', duration_years: 4, specialization: 'Civil', seats: 60 },
  { name: 'Chemical Engineering', degree_type: 'B.Tech', duration_years: 4, specialization: 'Chemical', seats: 50 },
  { name: 'M.Tech Computer Science', degree_type: 'M.Tech', duration_years: 2, specialization: 'Computer Science', seats: 40 },
  { name: 'MBA', degree_type: 'MBA', duration_years: 2, specialization: 'Management', seats: 60 },
  { name: 'M.Sc Physics', degree_type: 'M.Sc', duration_years: 2, specialization: 'Physics', seats: 30 },
];

const exams = [
  { name: 'JEE Advanced', full_name: 'Joint Entrance Examination Advanced', category: 'Engineering' },
  { name: 'JEE Main', full_name: 'Joint Entrance Examination Main', category: 'Engineering' },
  { name: 'BITSAT', full_name: 'BITS Admission Test', category: 'Engineering' },
  { name: 'CAT', full_name: 'Common Admission Test', category: 'Management' },
  { name: 'GATE', full_name: 'Graduate Aptitude Test in Engineering', category: 'Engineering' },
];

const reviewTemplates = [
  { author_name: 'Rahul Sharma', rating: 4.5, title: 'Great campus life', content: 'The college has excellent infrastructure and faculty. Placements are top-notch. Highly recommend for engineering aspirants.', course_studied: 'B.Tech CSE', graduation_year: 2024 },
  { author_name: 'Priya Patel', rating: 4.0, title: 'Good academic experience', content: 'Strong academics with plenty of opportunities for research. The campus facilities could be improved.', course_studied: 'B.Tech ECE', graduation_year: 2023 },
  { author_name: 'Amit Kumar', rating: 3.8, title: 'Decent college overall', content: 'Average faculty but great peer group. Placement support is good for CS branches.', course_studied: 'B.Tech ME', graduation_year: 2024 },
  { author_name: 'Sneha Reddy', rating: 4.2, title: 'Wonderful experience', content: 'Loved the campus environment and extracurricular activities. Academics are challenging but rewarding.', course_studied: 'B.Tech CSE', graduation_year: 2023 },
];

// =============================================
// SEED FUNCTION
// =============================================

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Step 1: Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await supabase.from('college_exams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('placements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('exams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('colleges').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Step 2: Insert colleges
    console.log('🏫 Inserting colleges...');
    const { data: insertedColleges, error: collegeError } = await supabase
      .from('colleges')
      .insert(colleges)
      .select();

    if (collegeError) throw new Error(`Colleges: ${collegeError.message}`);
    console.log(`   ✅ Inserted ${insertedColleges!.length} colleges`);

    // Step 3: Insert exams
    console.log('📝 Inserting exams...');
    const { data: insertedExams, error: examError } = await supabase
      .from('exams')
      .insert(exams)
      .select();

    if (examError) throw new Error(`Exams: ${examError.message}`);
    console.log(`   ✅ Inserted ${insertedExams!.length} exams`);

    // Step 4: Insert courses, placements, reviews, and exam cutoffs for each college
    for (const college of insertedColleges!) {
      const idx = insertedColleges!.indexOf(college);

      // Courses - assign 4-6 random courses per college with varying fees
      const numCourses = 4 + Math.floor(Math.random() * 3);
      const selectedCourses = coursesData.slice(0, numCourses).map((c) => ({
        ...c,
        college_id: college.id,
        fees: college.min_fees + Math.floor(Math.random() * (college.max_fees - college.min_fees)),
      }));
      await supabase.from('courses').insert(selectedCourses);

      // Placements - 2 years of data
      const placementData = [2024, 2023].map((year) => ({
        college_id: college.id,
        year,
        placement_percentage: 75 + Math.random() * 20,
        avg_package_lpa: 8 + Math.random() * 20 + (college.rating > 4.5 ? 10 : 0),
        highest_package_lpa: 30 + Math.random() * 70 + (college.rating > 4.5 ? 50 : 0),
        median_package_lpa: 6 + Math.random() * 15 + (college.rating > 4.5 ? 5 : 0),
        top_recruiters: JSON.stringify(['Google', 'Microsoft', 'Amazon', 'Flipkart', 'TCS', 'Infosys'].slice(0, 3 + Math.floor(Math.random() * 4))),
      }));
      await supabase.from('placements').insert(placementData);

      // Reviews - 2-3 per college
      const numReviews = 2 + Math.floor(Math.random() * 2);
      const reviews = reviewTemplates.slice(0, numReviews).map((r) => ({
        ...r,
        college_id: college.id,
        rating: Math.max(3, Math.min(5, r.rating + (Math.random() - 0.5))),
      }));
      await supabase.from('reviews').insert(reviews);

      // College-Exam mappings (cutoffs for predictor)
      // IITs accept JEE Advanced, NITs accept JEE Main, etc.
      const isIIT = college.name.includes('IIT');
      const isNIT = college.name.includes('NIT');
      const isBITS = college.name.includes('BITS');
      const jeeAdvanced = insertedExams!.find((e) => e.name === 'JEE Advanced');
      const jeeMain = insertedExams!.find((e) => e.name === 'JEE Main');
      const bitsat = insertedExams!.find((e) => e.name === 'BITSAT');

      const examMappings = [];

      if (isIIT && jeeAdvanced) {
        examMappings.push({
          college_id: college.id,
          exam_id: jeeAdvanced.id,
          min_rank: 100 + idx * 500,
          max_rank: 2000 + idx * 1500,
          year: 2024,
        });
      }

      if ((isNIT || !isIIT) && jeeMain) {
        examMappings.push({
          college_id: college.id,
          exam_id: jeeMain.id,
          min_rank: 1000 + idx * 2000,
          max_rank: 15000 + idx * 5000,
          year: 2024,
        });
      }

      if (isBITS && bitsat) {
        examMappings.push({
          college_id: college.id,
          exam_id: bitsat.id,
          min_rank: 50,
          max_rank: 3000,
          year: 2024,
        });
      }

      // All colleges accept JEE Main as fallback
      if (!isIIT && !isBITS && jeeMain && !examMappings.find(e => e.exam_id === jeeMain.id)) {
        examMappings.push({
          college_id: college.id,
          exam_id: jeeMain.id,
          min_rank: 5000 + idx * 3000,
          max_rank: 50000 + idx * 5000,
          year: 2024,
        });
      }

      if (examMappings.length > 0) {
        await supabase.from('college_exams').insert(examMappings);
      }

      console.log(`   ✅ Seeded data for: ${college.name}`);
    }

    console.log('\n🎉 Database seeding complete!');
    console.log(`   📊 ${insertedColleges!.length} colleges with courses, placements, reviews, and exam cutoffs`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
