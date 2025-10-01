import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	signin: async ({ request, locals: { supabase, tracker }, cookies }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;

		const { error: signInError } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				shouldCreateUser: true
			}
		});

		if (signInError) {
			console.error('Auth sign-in error: ' + signInError);

			return redirect(303, '/error');
		} else {
			cookies.set('email', email, {
				sameSite: true,
				secure: true,
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 * 1000
			});

			cookies.set('session-id', await tracker.trackSession('pre-authentication', email), {
				sameSite: true,
				secure: true,
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 * 1000
			});

			return redirect(303, '/welcome');
		}
	}
};
