import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr'
import type { CookieSerializeOptions } from 'cookie'

const passwordProtectSite: Handle = async ({ event, resolve }) => {
	if (!event.url.host.startsWith('localhost')) {
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
	}

	return resolve(event);
}

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(env.PRIVATE_SUPABASE_URL, env.PRIVATE_SUPABASE_PUBLISHABLE_KEY, {
		db: {
			schema: 'pets'
		},
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet: { name: string, value: string, options: CookieSerializeOptions }[]) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' })
				})
			},
		},
	})

	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}
		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			return { session: null, user: null }
		}
		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})
}

const rootRedirect: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/') {
		throw redirect(302, '/sign-in')
	}

	return resolve(event)
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user
	if (!event.locals.session && event.route.id?.startsWith('/(private)')) {
		redirect(303, '/sign-in')
	}
	if (event.locals.session && event.route.id?.startsWith('/(auth)')) {
		redirect(303, '/dashboard')
	}
	return resolve(event)
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
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0',
			'Surrogate-Control': 'no-store'
		}).forEach(([header, value]) => {
			response.headers.set(header, value);
		});
	}

	return response;
};

export const handle: Handle = sequence(passwordProtectSite, supabase, rootRedirect, authGuard, securityHeaders, cacheHeaders);
