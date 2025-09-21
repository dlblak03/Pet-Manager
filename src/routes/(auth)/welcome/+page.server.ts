import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const email = cookies.get('email');

	if (!email) {
		throw redirect(303, '/sign-in');
	}

	return {
		email
	};
}) satisfies PageServerLoad;
