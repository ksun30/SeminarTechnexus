import { newsRepository } from './news.repository';

export const newsQueries = {
	listAll: () => newsRepository.findAll(),
	listPublished: () => newsRepository.findAllPublished(),
	getById: (articleId: string) => newsRepository.findById(articleId)
};
