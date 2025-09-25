import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase }, cookies }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;

	if (token_hash && type) {
		const { error: verifyError } = await supabase.auth.verifyOtp({ type, token_hash });

		if (!verifyError) {
			cookies.delete('email', { path: '/' });

			return redirect(303, '/dashboard');
		}
	}

	return redirect(303, '/error');
};
