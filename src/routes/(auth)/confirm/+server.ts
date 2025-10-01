import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({
	url,
	locals: { supabase, safeGetSession, tracker },
	cookies
}) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;

	if (token_hash && type) {
		const {
			data: { user },
			error: verifyError
		} = await supabase.auth.verifyOtp({ type, token_hash });

		if (!verifyError) {
			cookies.delete('email', { path: '/' });

			const { data: owner, error: ownerError } = await supabase
				.schema('pets')
				.from('owners')
				.select('*')
				.limit(1);

			if (ownerError) {
				console.error('Auth owner select error: ' + ownerError);
			}

			if (owner && owner.length == 0) {
				if (user) {
					await supabase.schema('pets').from('owners').insert({
						owner_name: '',
						owner_email: user.email,
						language: 'UTC',
						time_zone: 'en'
					});
				}
			}

			const oldSessionId = cookies.get('session-id')
			await tracker.untrackSession(oldSessionId || '-1');
			cookies.set('session-id', await tracker.trackSession('authenticated', user!.email || '', oldSessionId), {
				sameSite: true,
				secure: true,
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 * 1000
			});
			
			return redirect(303, '/dashboard');
		}

		console.error('Auth verify error: ' + verifyError);
	}

	return redirect(303, '/error');
};
