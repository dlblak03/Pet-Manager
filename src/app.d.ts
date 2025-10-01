import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/database/database.types';
import type { LogTrackerServerClient } from 'logtracker.js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database, string, string>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			tracker: LogTrackerServerClient;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
