import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase }}) => {

    return new Response();
};