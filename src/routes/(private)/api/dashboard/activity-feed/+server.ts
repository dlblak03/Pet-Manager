import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data: activityFeed, error: activityFeedError } = await supabase
		.schema('pets')
		.from('activity_feed')
		.select('*, pets(*), appointments(*), medical_records(*), pet_vaccinations(*)')
		.order('created_at', { ascending: false })
		.limit(8);

	console.log(activityFeedError)

	if (activityFeedError) {
		return new Response(JSON.stringify(
			{
				succeess: false,
				activityFeed: [],
				activityFeedError: activityFeedError
			}
		));
	}

	if (activityFeed) {
		return new Response(JSON.stringify({
			success: true,
			activityFeed: activityFeed,
			activityFeedError: null
		}));
	}

	return new Response(JSON.stringify({
		success: true,
		activityFeed: [],
		activityFeedError: null
	}));
};
