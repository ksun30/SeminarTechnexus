import type { newsArticles } from '$server/db/schema';

export type NewsArticleRecord = typeof newsArticles.$inferSelect;
export type NewNewsArticleRecord = typeof newsArticles.$inferInsert;

export type NewsStatus = 'draft' | 'published';

export interface NewsFormShape {
	title: string;
	summary: string;
	body: string;
}
