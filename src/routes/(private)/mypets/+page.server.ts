import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database/database.types';

type Pet = Database['pets']['Tables']['pets']['Row'];

export const load = (async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:pets');

	const { data: pets, error: petsError } = await supabase.schema('pets').from('pets').select('*').order('name');

	if (petsError) {
		console.error("Pets loading error: " + petsError.message);
		return {
			petsError: petsError.message,
			pets: pets ?? [],
			species: [],
			genders: []
		}
	}

	const species = [
		...new Map(
			pets.map((pet: Pet) => [pet.species, { value: pet.species ?? '', label: pet.species ?? '' }])
		).values()
	];
	const genders = [
		...new Map(
			pets.map((pet: Pet) => [pet.gender, { value: pet.gender ?? '', label: pet.gender ?? '' }])
		).values()
	];

	return {
		petsError: null,
		pets: pets,
		species,
		genders
	};
}) satisfies PageServerLoad;
