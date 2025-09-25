import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: photos, error: photosError } = await supabase
		.schema('pets')
		.from('pet_media')
		.select(`*`)
		.eq('media_type', 'image')
		.order('created_at', { ascending: false })
		.limit(8);

	if (photosError) {
		console.error('Photos fetch error: ' + photosError);
		return new Response(
			JSON.stringify({
				success: false,
				photos: null,
				photosError: photosError.message
			})
		);
	}

	if (photos) {
		const imagePromises = photos.map(async (photo) => {
			const { data: photoFile, error: photoFileError } = await supabase.storage
				.from('private')
				.download(photo.file_path);

			if (photoFileError) {
				console.error(`Failed to download photo: `, photoFileError);
				return null;
			}

			const arrayBuffer = await photoFile.arrayBuffer();

			return {
				photo: Array.from(new Uint8Array(arrayBuffer)),
				mimeType: 'image/' + photo.mime_type
			};
		});

		const allImages = await Promise.all(imagePromises);
		const successfulImages = allImages.filter((photo) => photo !== null);

		return new Response(
			JSON.stringify({
				success: true,
				photos: successfulImages,
				photosError: null
			})
		);
	}

	return new Response(
		JSON.stringify({
			success: true,
			photos: null,
			photosError: null
		})
	);
};
