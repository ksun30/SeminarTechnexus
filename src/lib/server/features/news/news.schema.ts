import { z } from 'zod';

export const newsIdSchema = z.uuid();

const summarySchema = z
	.string()
	.trim()
	.max(300, 'Summary must be 300 characters or fewer.')
	.default('');

export const createNewsSchema = z.object({
	title: z
		.string()
		.trim()
		.min(3, 'Title must be at least 3 characters.')
		.max(200, 'Title must be 200 characters or fewer.'),
	summary: summarySchema,
	body: z
		.string()
		.trim()
		.min(10, 'Body must be at least 10 characters.')
		.max(20000, 'Body must be 20 000 characters or fewer.')
});

export const updateNewsSchema = createNewsSchema.extend({
	id: newsIdSchema
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
