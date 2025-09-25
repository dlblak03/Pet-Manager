import type { RequestHandler } from './$types';
import { error, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';

type Media = Database['pets']['Tables']['pet_media']['Row'];
type POTD = Database['pets']['Tables']['picture_of_the_day']['Row'];

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { data: media } = await supabase
		.from('picture_of_the_day')
		.select(`*, pet_media(*)`)
		.eq('date', new Date().toISOString().split('T')[0])
		.limit(1);

	if (media?.length != 0 && media) {
		const image: POTD & { pet_media: Media } = media[0];

		const pathParts = image.pet_media.file_path.split('/');
		const fileUserId = pathParts[0];

		if (fileUserId !== (await safeGetSession()).user?.id) {
			throw error(403, 'Access denied');
		}

		const { data, error: supabaseError } = await supabase.storage
			.from('private')
			.download(image.pet_media.file_path);

		if (supabaseError) {
			console.error(supabaseError);
			throw fail(500, `Failed to get image: ${supabaseError.message}`);
		}

		const arrayBuffer = await data?.arrayBuffer();

		return new Response(
			JSON.stringify({
				data: Array.from(new Uint8Array(arrayBuffer || [])),
				mimeType: 'image/' + image.pet_media.mime_type
			})
		);
	} else {
		const { data: petMedia } = await supabase
			.from('pet_media')
			.select(`*, picture_of_the_day(*)`)
			.eq('media_type', 'image')
			.order('created_at', { ascending: false });

		if (!petMedia || petMedia.length === 0) {
			console.error('No pet media found');
			return new Response(
				JSON.stringify({
					data: Array.from(new Uint8Array([])),
					mimeType: 'image/jpeg'
				})
			);
		}

		type allPetMedia = Media & { picture_of_the_day: POTD[] };

		const scoredMedia = petMedia.map((media: allPetMedia) => {
			const potdHistory = media.picture_of_the_day || [];
			const lastFeatured =
				potdHistory.length > 0
					? Math.max(...potdHistory.map((p) => new Date(p.date).getTime()))
					: 0;

			const daysSinceLastFeatured = lastFeatured
				? (Date.now() - lastFeatured) / (1000 * 60 * 60 * 24)
				: 365;

			return {
				...media,
				score: daysSinceLastFeatured * 2 + Math.random() * 10
			};
		});

		scoredMedia.sort((a, b) => b.score - a.score);
		const selected = scoredMedia[0];

		const { error } = await supabase
			.schema('pets')
			.from('picture_of_the_day')
			.insert({
				date: new Date().toISOString().split('T')[0],
				pet_media_id: selected.id
			})
			.select('*')
			.single();

		if (error) {
			console.error(error);
			throw fail(500, `Failed to insert image: ${error.message}`);
		}

		const { data, error: supabaseError } = await supabase.storage
			.from('private')
			.download(selected.file_path);

		if (supabaseError) {
			console.error(supabaseError);
			throw fail(500, `Failed to get image: ${supabaseError.message}`);
		}

		const arrayBuffer = await data?.arrayBuffer();

		return new Response(
			JSON.stringify({
				data: Array.from(new Uint8Array(arrayBuffer || [])),
				mimeType: 'image/' + selected.mime_type
			})
		);
	}
};
