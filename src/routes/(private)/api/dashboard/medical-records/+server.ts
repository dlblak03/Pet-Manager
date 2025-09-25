import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: medicalRecords } = await supabase
		.from('medical_records')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(4);

	return new Response(JSON.stringify(medicalRecords));
};
