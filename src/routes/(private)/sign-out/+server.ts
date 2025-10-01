import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase, tracker }, cookies }) => {
	const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' });

	const oldSessionId = cookies.get('session-id')
	await tracker.untrackSession(oldSessionId || '-1');

	if (signOutError) {
		console.error(signOutError);
	}

	redirect(303, '/sign-in');
};
