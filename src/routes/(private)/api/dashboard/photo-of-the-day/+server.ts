import type { RequestHandler } from './$types';
import type { Database } from '$lib/database/database.types';

type Media = Database['pets']['Tables']['pet_media']['Row'];
type POTD = Database['pets']['Tables']['picture_of_the_day']['Row'];

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: potd, error: potdError } = await supabase
		.schema('pets')
		.from('picture_of_the_day')
		.select(`*, pet_media(*)`)
		.eq('date', new Date().toISOString().split('T')[0])
		.limit(1);

	if (potdError) {
		console.error('Picture of the day fetch error: ' + potdError.message);
		return new Response(
			JSON.stringify({
				success: false,
				potd: null,
				mimeType: null,
				potdError: potdError.message
			})
		);
	}
	
	if (potd && potd.length != 0) {
		const image: POTD & { pet_media: Media | null } = potd[0];

		const { data: potdFile, error: potdFileError } = await supabase.storage
			.from('private')
			.download(image.pet_media!.file_path);

		if (!potdFile || potdFileError) {
			console.error('Picture of the day download error: ' + potdError);
			return new Response(
				JSON.stringify({
					success: false,
					potd: null,
					mimeType: null,
					potdError: potdFileError.message
				})
			);
		}

		const arrayBuffer = await potdFile.arrayBuffer();

		return new Response(
			JSON.stringify({
				success: true,
				potd: Array.from(new Uint8Array(arrayBuffer || [])),
				mimeType: 'image/' + image.pet_media!.mime_type,
				potdError: null
			})
		);
	} else {
		const { data: media, error: mediaError } = await supabase
			.schema('pets')
			.from('pet_media')
			.select(`*, picture_of_the_day(*)`)
			.eq('media_type', 'image')
			.order('created_at', { ascending: false });

		if (!media || mediaError) {
			console.error('Picture of the day media error: ' + mediaError);
			return new Response(
				JSON.stringify({
					success: false,
					potd: null,
					mimeType: null,
					potdError: mediaError.message
				})
			);
		}

		if (media.length == 0) {
			return new Response(
				JSON.stringify({
					success: true,
					potd: null,
					mimeType: null,
					potdError: null
				})
			);
		}

		const scoredMedia = media.map((media: Media & { picture_of_the_day: POTD[] }) => {
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

		const { error: potdInsertError } = await supabase
			.schema('pets')
			.from('picture_of_the_day')
			.insert({
				date: new Date().toISOString().split('T')[0],
				pet_media_id: selected.id
			})
			.select('*')
			.single();

		if (potdInsertError) {
			console.error('Picture of the day insert error: ' + potdInsertError);
			return new Response(
				JSON.stringify({
					success: false,
					potd: null,
					mimeType: null,
					potdError: potdInsertError.message
				})
			);
		}

		const { data: potdFile, error: potdFileError } = await supabase.storage
			.from('private')
			.download(selected.file_path);

		if (!potdFile || potdFileError) {
			console.error('Picture of the day download error: ' + potdError);
			return new Response(
				JSON.stringify({
					success: false,
					potd: null,
					mimeType: null,
					potdError: potdFileError.message
				})
			);
		}

		const arrayBuffer = await potdFile.arrayBuffer();

		return new Response(
			JSON.stringify({
				success: true,
				potd: Array.from(new Uint8Array(arrayBuffer || [])),
				mimeType: 'image/' + selected.mime_type,
				potdError: null
			})
		);
	}
};
