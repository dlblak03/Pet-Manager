import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database/database.types';
import { fail } from '@sveltejs/kit';

type Owner = Database['pets']['Tables']['owners']['Row'];

export const load = (async ({ locals: { supabase, safeGetSession } }) => {
	const { data: owner } = await supabase.from('owners').select('*').single();

	if (!owner) {
		const { user } = await safeGetSession()

		const { error } = await supabase
			.schema('pets')
			.from('owners')
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
			language: 'en',
			time_zone: ''
		};
	}

	return {
		owner_name: (owner as Owner).owner_name,
		owner_email: (owner as Owner).owner_email,
		language: (owner as Owner).language,
		time_zone: (owner as Owner).time_zone
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updategeneralinformation: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();

		const fullName = formData.get('name') as string;
		const email = formData.get('email') as string;

		const { user } = await safeGetSession()

		const { error } = await supabase.schema('pets').from('owners')
			.update({
				owner_name: fullName,
				owner_email: email
			})
			.eq('owner_id', user!.id)

		if (error) {
			console.error('Update error: ' + error.message)
			return fail(500, {})
		}

		return {}
	},
	updatelocalization: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();

		const language = formData.get('language') as string;

		const { user } = await safeGetSession()

		const { error } = await supabase.schema('pets').from('owners')
			.update({
				language: language
			})
			.eq('owner_id', user!.id)

		if (error) {
			console.error('Update error: ' + error.message)
			return fail(500, {})
		}

		return {}
	}
};
