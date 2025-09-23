import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database/database.types';

type Pet = Database['pets']['Tables']['pets']['Row'];

export const load = (async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:pets');

	const { data: pets } = await supabase.from('pets').select('*').order('name');
	const species = [...new Map(
		pets?.map((pet: Pet) => [
			pet.species,
			{ value: pet.species ?? '', label: pet.species ?? '' }
		])
	).values()];
	const genders = [...new Map(
		pets?.map((pet: Pet) => [
			pet.gender,
			{ value: pet.gender ?? '', label: pet.gender ?? '' }
		])
	).values()];

	console.log(genders)

	return {
		pets: pets ?? [],
		species,
		genders
	};
}) satisfies PageServerLoad;
