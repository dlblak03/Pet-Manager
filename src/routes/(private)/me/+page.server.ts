import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database/database.types';

type Owner = Database['pets']['Tables']['owners']['Row'];

export const load = (async ({ locals: { supabase, safeGetSession } }) => {
	const { data: owner } = await supabase.from('owners').select('*').single();

	if (!owner) {
		const { user } = await safeGetSession()

		const { error } = await (supabase.from('owners') as any)
			.insert({
				owner_name: '',
				owner_email: user?.email,
				language: 'en'
			})
			.select('*')
			.single();

		return {
			owner_name: '',
			owner_email: user?.email,
			language: 'en'
		};
	}

	return {
		owner_name: (owner as Owner).owner_name,
		owner_email: (owner as Owner).owner_email,
		language: (owner as Owner).language,
	};
}) satisfies PageServerLoad;
