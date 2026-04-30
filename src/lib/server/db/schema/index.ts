import { relations } from 'drizzle-orm';

import { accounts, sessions, users, verifications } from './auth';
import { newsArticles } from './news';
import { projects } from './project';
import { tasks } from './task';

export { accounts, sessions, users, verifications } from './auth';
export * from './news';
export * from './project';
export * from './task';

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	newsArticles: many(newsArticles)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export const projectRelations = relations(projects, ({ many }) => ({
	tasks: many(tasks)
}));

export const taskRelations = relations(tasks, ({ one }) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id]
	})
}));

export const newsArticlesRelations = relations(newsArticles, ({ one }) => ({
	author: one(users, {
		fields: [newsArticles.authorId],
		references: [users.id]
	})
}));
