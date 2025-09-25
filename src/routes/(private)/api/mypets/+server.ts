import type { RequestHandler } from './$types';
import type { Database } from '$lib/database/database.types';

type Owner = Database['pets']['Tables']['owners']['Row'];

export const PUT: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const addPetInput = await request.json();

	const { data: owner } = await supabase.from('owners').select('*').single();
	const { user } = await safeGetSession();

	if (!owner) {
		const { error } = await supabase
			.schema('pets')
			.from('owners')
			.insert({
				owner_name: '',
				owner_email: user?.email,
				language: 'en'
			})
			.select('*')
			.single();

		const { error: error2 } = await supabase
			.schema('pets')
			.from('pets')
			.insert({
				name: addPetInput.petName,
				species: addPetInput.species,
				breed: addPetInput.breed,
				gender: addPetInput.gender,
				birth_date:
					addPetInput.birthDate.year +
					'-' +
					addPetInput.birthDate.month +
					'-' +
					addPetInput.birthDate.day,
				color: addPetInput.color,
				microchip_id: addPetInput.microchip,
				owner_name: '',
				owner_email: user?.email
			});
	} else {
		const { error } = await supabase
			.schema('pets')
			.from('pets')
			.insert({
				name: addPetInput.petName,
				species: addPetInput.species,
				breed: addPetInput.breed,
				gender: addPetInput.gender,
				birth_date:
					addPetInput.birthDate.year +
					'-' +
					addPetInput.birthDate.month +
					'-' +
					addPetInput.birthDate.day,
				color: addPetInput.color,
				microchip_id: addPetInput.microchip,
				owner_name: (owner as Owner).owner_name,
				owner_email: (owner as Owner).owner_email
			});
	}

	return new Response(JSON.stringify({ success: true }));
};
