import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals: { supabase }, params }) => {
	const petId = params.petid;

	if (!petId) {
		return new Response(JSON.stringify({ error: 'Pet ID is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { error } = await supabase.schema('pets').from('pets').delete().eq('id', petId);

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
