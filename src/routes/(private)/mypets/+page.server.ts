import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database/database.types';

type Pet = Database['pets']['Tables']['pets']['Row'];

export const load = (async ({ depends, locals: { supabase } }) => {
    depends('supabase:db:pets')

    const { data: pets } = await supabase.from('pets').select('*').order('name')
    const species: { value: string, label: string }[] = [...new Set(pets?.map((pet: Pet) => { return { value: pet.species ?? '', label: pet.species ?? '' } }))];
    const genders: { value: string, label: string }[] = [...new Set(pets?.map((pet: Pet) => { return { value: pet.gender ?? '', label: pet.gender ?? '' } }))];
    
    return {
        pets: pets ?? [],
        species,
        genders
    };
}) satisfies PageServerLoad;