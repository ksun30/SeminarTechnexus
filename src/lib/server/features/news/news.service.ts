import { createNewsSchema, updateNewsSchema } from './news.schema';
import { newsQueries } from './news.queries';
import { newsRepository } from './news.repository';

import type { AuthActor } from '$server/auth/permissions';
import {
	canCreateNews,
	canDeleteNews,
	canPublishNews
} from '$server/auth/permissions';
import {
	AuthorizationError,
	NotFoundError,
	ValidationError
} from '$server/shared/errors/app-error';
import { parseUuid } from '$server/shared/utils/ids';

export const newsService = {
	/** Admins/managers get all; members get published only. */
	async listArticles(actor: AuthActor) {
		if (canCreateNews(actor.role)) {
			return newsQueries.listAll();
		}
		return newsQueries.listPublished();
	},

	async getArticle(articleId: string) {
		const safeId = parseUuid(articleId, 'articleId');
		const article = await newsQueries.getById(safeId);

		if (!article) {
			throw new NotFoundError('News article not found.', { articleId: safeId });
		}

		return article;
	},

	async createArticle(actor: AuthActor, input: unknown) {
		if (!canCreateNews(actor.role)) {
			throw new AuthorizationError();
		}

		const parsed = createNewsSchema.safeParse(input);

		if (!parsed.success) {
			throw new ValidationError('Article data is invalid.', {
				fieldErrors: parsed.error.flatten().fieldErrors
			});
		}

		return newsRepository.insert({
			...parsed.data,
			authorId: actor.userId,
			authorName: actor.name
		});
	},

	async updateArticle(actor: AuthActor, input: unknown) {
		if (!canCreateNews(actor.role)) {
			throw new AuthorizationError();
		}

		const parsed = updateNewsSchema.safeParse(input);

		if (!parsed.success) {
			throw new ValidationError('Article data is invalid.', {
				fieldErrors: parsed.error.flatten().fieldErrors
			});
		}

		const updated = await newsRepository.update(parsed.data);

		if (!updated) {
			throw new NotFoundError('News article not found.', { articleId: parsed.data.id });
		}

		return updated;
	},

	async publishArticle(actor: AuthActor, articleId: string) {
		if (!canPublishNews(actor.role)) {
			throw new AuthorizationError();
		}

		const safeId = parseUuid(articleId, 'articleId');
		const published = await newsRepository.publish(safeId);

		if (!published) {
			throw new NotFoundError('News article not found.', { articleId: safeId });
		}

		return published;
	},

	async unpublishArticle(actor: AuthActor, articleId: string) {
		if (!canPublishNews(actor.role)) {
			throw new AuthorizationError();
		}

		const safeId = parseUuid(articleId, 'articleId');
		const unpublished = await newsRepository.unpublish(safeId);

		if (!unpublished) {
			throw new NotFoundError('News article not found.', { articleId: safeId });
		}

		return unpublished;
	},

	async deleteArticle(actor: AuthActor, articleId: string) {
		if (!canDeleteNews(actor.role)) {
			throw new AuthorizationError();
		}

		const safeId = parseUuid(articleId, 'articleId');
		const deleted = await newsRepository.delete(safeId);

		if (!deleted) {
			throw new NotFoundError('News article not found.', { articleId: safeId });
		}

		return deleted;
	}
};
