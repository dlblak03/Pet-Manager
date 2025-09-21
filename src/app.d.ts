import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/database/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database, string, string>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
