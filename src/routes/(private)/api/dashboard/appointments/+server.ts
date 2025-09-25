import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: appointments, error: appointmentsError } = await supabase
		.schema('pets')
		.from('appointments')
		.select(`*, pet:pets (name)`)
		.gte('appointment_date', new Date().toISOString())
		.order('appointment_date', { ascending: true })
		.limit(3);

	if (appointmentsError) {
		return new Response(JSON.stringify({
			success: false,
			appointments: null,
			appointmentsError: appointmentsError.message,
		}))
	}

	return new Response(JSON.stringify({
		success: true,
		appointments: appointments,
		appointmentsError: null,
	}));
};
