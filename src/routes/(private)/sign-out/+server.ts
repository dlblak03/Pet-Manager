import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' });

	if (signOutError) {
		console.error(signOutError);
	}

	redirect(303, '/sign-in');
};
