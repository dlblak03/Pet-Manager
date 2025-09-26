import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database/database.types';
import { fail } from '@sveltejs/kit';

type Owner = Database['pets']['Tables']['owners']['Row'];

export const load = (async ({ locals: { supabase, safeGetSession } }) => {
	const { data: owner, error: ownerError } = await supabase.schema('pets').from('owners').select('*').limit(1);

	if (owner && owner.length == 0) {
		const { user } = await safeGetSession();

		if (user) {
			await supabase
				.schema('pets')
				.from('owners')
				.insert({
					owner_name: '',
					owner_email: user.email,
					language: 'en',
					time_zone: 'UTC'
				})

			return {
				success: true,
				owner_name: '',
				owner_email: user?.email,
				language: 'en',
				time_zone: ''
			};
		}
	}

	if (ownerError) {
		return {
			success: false,
			owner_name: '',
			owner_email: '',
			language: '',
			time_zone: ''
		}
	}

	return {
		success: true,
		owner_name: owner[0].owner_name,
		owner_email: owner[0].owner_email,
		language: owner[0].language,
		time_zone: owner[0].time_zone
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updategeneralinformation: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();

		const fullName = formData.get('name') as string;
		const email = formData.get('email') as string;

		if (email.trim().length == 0) {
			return fail(401, {
				emailRequired: true
			})
		}

		const { user } = await safeGetSession();

		if (user) {
			const { error: updateError } = await supabase
				.schema('pets')
				.from('owners')
				.update({
					owner_name: fullName,
					owner_email: email
				})
				.eq('owner_id', user.id);

			if (updateError) {
				console.error('General information update error: ' + updateError.message);
				return fail(500, {
					emailRequired: false
				});
			}
		}

		return {
			emailRequired: false
		};
	},
	updatelocalization: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();

		const language = formData.get('language') as string;
		const timezone = formData.get('timezone') as string;

		const { user } = await safeGetSession();

		if (user) {
			const { error: updateError } = await supabase
				.schema('pets')
				.from('owners')
				.update({
					language: language,
					time_zone: timezone
				})
				.eq('owner_id', user.id);

			if (updateError) {
				console.error('Localization update error: ' + updateError.message);
				return fail(500, {});
			}
		}

		return {};
	}
};
