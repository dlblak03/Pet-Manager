import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
    const { data: appointments } = await supabase.from('appointments').select(`*, pet:pets (name)`).gte('appointment_date', new Date().toISOString()).order('appointment_date', { ascending: true }).limit(3)

    return new Response(
        JSON.stringify(appointments)
    );
};