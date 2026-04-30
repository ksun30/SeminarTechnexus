import type { PageServerLoad } from './$types';

import { requireAuth } from '$server/auth/guards';
import { canCreateNews } from '$server/auth/permissions';
import { newsService } from '$server/features/news/news.service';

export const load: PageServerLoad = async (event) => {
	const actor = requireAuth(event);

	const articles = await newsService.listArticles(actor);

	return {
		articles,
		canManageNews: canCreateNews(actor.role)
	};
};
