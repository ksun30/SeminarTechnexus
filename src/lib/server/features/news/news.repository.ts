import { desc, eq } from 'drizzle-orm';

import { getDb } from '$server/db/client';
import { newsArticles } from '$server/db/schema';

export const newsRepository = {
	async findAll() {
		const db = getDb();
		return db.query.newsArticles.findMany({
			orderBy: [desc(newsArticles.createdAt)]
		});
	},

	async findAllPublished() {
		const db = getDb();
		return db.query.newsArticles.findMany({
			where: eq(newsArticles.status, 'published'),
			orderBy: [desc(newsArticles.publishedAt)]
		});
	},

	async findById(articleId: string) {
		const db = getDb();
		return db.query.newsArticles.findFirst({
			where: eq(newsArticles.id, articleId)
		});
	},

	async insert(input: {
		title: string;
		summary: string;
		body: string;
		authorId: string;
		authorName: string;
	}) {
		const db = getDb();
		const [created] = await db
			.insert(newsArticles)
			.values({
				title: input.title,
				summary: input.summary || null,
				body: input.body,
				status: 'draft',
				authorId: input.authorId,
				authorName: input.authorName
			})
			.returning();
		return created;
	},

	async update(input: {
		id: string;
		title: string;
		summary: string;
		body: string;
	}) {
		const db = getDb();
		const [updated] = await db
			.update(newsArticles)
			.set({
				title: input.title,
				summary: input.summary || null,
				body: input.body,
				updatedAt: new Date()
			})
			.where(eq(newsArticles.id, input.id))
			.returning();
		return updated ?? null;
	},

	async publish(articleId: string) {
		const db = getDb();
		const [updated] = await db
			.update(newsArticles)
			.set({
				status: 'published',
				publishedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(newsArticles.id, articleId))
			.returning();
		return updated ?? null;
	},

	async unpublish(articleId: string) {
		const db = getDb();
		const [updated] = await db
			.update(newsArticles)
			.set({
				status: 'draft',
				publishedAt: null,
				updatedAt: new Date()
			})
			.where(eq(newsArticles.id, articleId))
			.returning();
		return updated ?? null;
	},

	async delete(articleId: string) {
		const db = getDb();
		const [deleted] = await db
			.delete(newsArticles)
			.where(eq(newsArticles.id, articleId))
			.returning();
		return deleted ?? null;
	}
};
