import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		path: url.pathname,
		pathName: getPathName(url.pathname),
		headerTitle: getHeaderTitle(url.pathname)
	};
}) satisfies LayoutLoad;

const getPathName = (pathName: string) => {
	if (pathName == '/dashboard') {
		return 'dashboard';
	}
	if (pathName == '/mypets') {
		return 'mypets';
	}
	if (pathName == '/me') {
		return 'me';
	}
};

const getHeaderTitle = (pathName: string) => {
	if (pathName == '/dashboard') {
		return 'Dashboard';
	}
	if (pathName == '/mypets') {
		return 'My Pets';
	}
	if (pathName == '/me') {
		return 'My Account';
	}
};
