import { fail, isRedirect, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

import { requirePermission } from '$server/auth/guards';
import { newsService } from '$server/features/news/news.service';
import { getHttpErrorDetails } from '$server/shared/errors/http-error-map';

export const load: PageServerLoad = async (event) => {
	requirePermission(event, 'create-news');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const actor = requirePermission(event, 'create-news');
		const formData = await event.request.formData();

		const values = {
			title: String(formData.get('title') ?? ''),
			summary: String(formData.get('summary') ?? ''),
			body: String(formData.get('body') ?? '')
		};

		try {
			const article = await newsService.createArticle(actor, values);
			throw redirect(303, `/news/${article.id}`);
		} catch (error) {
			if (isRedirect(error)) throw error;

			const details = getHttpErrorDetails(error);
			return fail(details.status, {
				form: values,
				errors:
					(details.details?.fieldErrors as Record<string, string[] | undefined> | undefined) ?? {},
				message: details.message
			});
		}
	}
};
