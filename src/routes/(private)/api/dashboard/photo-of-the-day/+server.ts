import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';

type Media = Database['pets']['Tables']['pet_media']['Row'];

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
    const { data: media } = await supabase.from('pet_media').select(`*`).order('created_at', { ascending: false }).limit(1)

    if (media) {
        const image: Media = media[0];

        const pathParts = image.file_path.split('/')
        const fileUserId = pathParts[0]

        if (fileUserId !== (await safeGetSession()).user?.id) {
            throw error(403, 'Access denied')
        }

        console.log(image.file_path)
        const { data, error: supabaseError } = await supabase.storage
            .from('private')
            .createSignedUrl(image.file_path, 3600)

        if (supabaseError) {
            console.error(supabaseError)
            throw error(500, `Failed to get image: ${supabaseError.message}`)
        }

        return new Response(
            JSON.stringify(data.signedUrl)
        );
    }

    return new Response();
};