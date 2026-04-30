import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

import { getActor, requireAuth, requirePermission } from '$server/auth/guards';
import { canCreateNews, canDeleteNews, canPublishNews } from '$server/auth/permissions';
import { newsService } from '$server/features/news/news.service';
import { getHttpErrorDetails } from '$server/shared/errors/http-error-map';

export const load: PageServerLoad = async (event) => {
	const actor = requireAuth(event);
	const { articleId } = event.params;

	const article = await newsService.getArticle(articleId);

	// Members can only read published articles
	if (article.status === 'draft' && !canCreateNews(actor.role)) {
		throw error(404, 'Article not found.');
	}

	return {
		article,
		canManage: canCreateNews(actor.role),
		canPublish: canPublishNews(actor.role),
		canDelete: canDeleteNews(actor.role)
	};
};

export const actions: Actions = {
	publish: async (event) => {
		const actor = requirePermission(event, 'publish-news');
		const { articleId } = event.params;

		try {
			await newsService.publishArticle(actor, articleId);
			throw redirect(303, `/news/${articleId}`);
		} catch (err) {
			if (isRedirect(err)) throw err;
			const details = getHttpErrorDetails(err);
			return fail(details.status, { message: details.message });
		}
	},

	unpublish: async (event) => {
		const actor = requirePermission(event, 'publish-news');
		const { articleId } = event.params;

		try {
			await newsService.unpublishArticle(actor, articleId);
			throw redirect(303, `/news/${articleId}`);
		} catch (err) {
			if (isRedirect(err)) throw err;
			const details = getHttpErrorDetails(err);
			return fail(details.status, { message: details.message });
		}
	},

	delete: async (event) => {
		const actor = requirePermission(event, 'delete-news');
		const { articleId } = event.params;

		try {
			await newsService.deleteArticle(actor, articleId);
			throw redirect(303, '/news');
		} catch (err) {
			if (isRedirect(err)) throw err;
			const details = getHttpErrorDetails(err);
			return fail(details.status, { message: details.message });
		}
	}
};
