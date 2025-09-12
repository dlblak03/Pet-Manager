import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';

const passwordProtectSite: Handle = async ({ event, resolve }) => {
    const auth = event.request.headers.get('authorization');

    if (!auth || !auth.startsWith('Basic ')) {
        return new Response('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
        });
    }

    try {
        const base64Credentials = auth.split(' ')[1];
        const [username, password] = atob(base64Credentials).split(':');

        if (username !== env.PRIVATE_WEBSITE_AUTH_USER || password !== env.PRIVATE_WEBSITE_AUTH_PASSWORD) {
            return new Response('Unauthorized', { status: 401 });
        }
    } catch (error) {
        return new Response('Invalid credentials format', { status: 401 });
    }

    return resolve(event);
}

const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	Object.entries({
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
		'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Embedder-Policy': 'cross-origin',
		'Cross-Origin-Resource-Policy': 'cross-origin',
		'Access-Control-Allow-Origin': 'cross-origin'
	}).forEach(([header, value]) => response.headers.set(header, value));

	return response;
};

const cacheHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (event.route.id?.startsWith('/(protected)')) {
		Object.entries({
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0',
			'Surrogate-Control': 'no-store'
		}).forEach(([header, value]) => {
			response.headers.set(header, value);
		});
	}

	if (event.route.id?.startsWith('/(public)')) {
		Object.entries({
			'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
			Vary: 'Accept-Encoding'
		}).forEach(([header, value]) => {
			response.headers.set(header, value);
		});
	}

	return response;
};

export const handle: Handle = sequence(passwordProtectSite, securityHeaders, cacheHeaders);
