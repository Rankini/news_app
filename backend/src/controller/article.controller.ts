import { Request, Response } from 'express';
import Joi from 'joi';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Validation schema for query parameters
const querySchema = Joi.object({
    fromDate: Joi.date().iso().max('now').required(),
    toDate: Joi.date().iso().max('now').required(),
    searchQuery: Joi.string().required(),
    sortBy: Joi.string().valid('publishedAt', 'popularity', 'relevancy').required()
});

export async function getArticlesHandler(req: Request, res: Response) {
    try {
        // TODO: Move validation out to middleware
        // Validate query parameters
        const { error } = querySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { fromDate, toDate, searchQuery, sortBy } = req.query;

        const from = new Date(fromDate as string);
        const to = new Date(toDate as string);
        to.setHours(23, 59, 59);

        // TODO: move this request out to a service
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                apiKey: NEWS_API_KEY,
                from: from.toString(),
                language: 'en',
                q: searchQuery,
                sortBy: sortBy,
                to: to.toString(),
                pageSize: 20,
            },
        });

        return res.send(response.data.articles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}