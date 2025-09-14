import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error)
    }

    redirect(303, '/sign-in')
};