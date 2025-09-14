import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
    const email = url.searchParams.get('email')

    url.searchParams.delete('email')

    return {
        email
    };
}) satisfies PageServerLoad;