import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals: { supabase } }) => {
	const addPetInput = await request.json();

	const { error: petsInsertError } = await supabase
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
			microchip_id: addPetInput.microchip
		});

	return new Response(JSON.stringify({
		success: true
	}));
};
