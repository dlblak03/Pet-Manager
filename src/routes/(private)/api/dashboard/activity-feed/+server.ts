import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
    const { data: activityFeed } = await supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(10)

    return new Response(
        JSON.stringify(activityFeed)
    );
};