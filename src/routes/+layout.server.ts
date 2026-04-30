import type { LayoutServerLoad } from './$types';

import {
	canCreateNews,
	canCreateProjects,
	canManageUsers,
	normalizeRole
} from '$server/auth/permissions';

export const load: LayoutServerLoad = async ({ locals }) => {
	const role = normalizeRole(locals.user?.role);

	return {
		auth: {
			user: locals.user,
			session: locals.session,
			isAuthenticated: locals.isAuthenticated,
			role,
			permissions: {
				canCreateProjects: locals.isAuthenticated ? canCreateProjects(role) : false,
				canManageUsers: locals.isAuthenticated ? canManageUsers(role) : false,
				canCreateNews: locals.isAuthenticated ? canCreateNews(role) : false
			}
		}
	};
};
