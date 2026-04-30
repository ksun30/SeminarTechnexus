import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const newsStatusEnum = pgEnum('news_status', ['draft', 'published']);

export const newsArticles = pgTable('news_articles', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	summary: text('summary'),
	body: text('body').notNull(),
	status: newsStatusEnum('status').default('draft').notNull(),
	publishedAt: timestamp('published_at', { withTimezone: true }),
	authorId: text('author_id').notNull(),
	authorName: text('author_name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
