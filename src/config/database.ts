/**
 * @fileoverview Supabase client configuration.
 * Initializes and exports the Supabase client using environment variables.
 * This client is used by all services to interact with the PostgreSQL database.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate that required env variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables.');
  console.error('   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

/**
 * Singleton Supabase client instance.
 * Used across all services for database operations.
 */
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
