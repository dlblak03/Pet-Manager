import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
    const { data: media } = await supabase
        .schema('pets')
        .from('pet_media')
        .select(`*`)
        .eq('media_type', 'image')
        .order('created_at', { ascending: false })
        .limit(8);

    if (media) {
        const imagePromises = media.map(async pic => {
            const { data, error } = await supabase.storage
                .from('private')
                .download(pic.file_path);

            if (error) throw error;

            const arrayBuffer = await data.arrayBuffer();

            return {
                data: Array.from(new Uint8Array(arrayBuffer)),
                mimeType: 'image/' + pic.mime_type
            };
        });

        const allImages = await Promise.all(imagePromises);
        return new Response(JSON.stringify(allImages), {
            headers: {
                'Cache-Control': 'private, max-age=3600',
                'Vary': 'Authorization',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY'
            }
        });
    }

    return new Response();
};