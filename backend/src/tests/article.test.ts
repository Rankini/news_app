import { Request, Response } from 'express';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getArticlesHandler } from '../controller/article.controller';

// Mocking Axios
const mockAxios = new MockAdapter(axios);

const mockArticles = [
    {
        title: 'Article 1',
        description: 'Description 1',
        source: { name: 'News Org' },
        url: 'news-org.com',
        urlToImage: 'news-org.com/media',
        publishedAt: '2024-04-16T05:06:26Z'
    },
    {
        title: 'Article 2',
        description: 'Description 2',
        source: { name: 'news.com' },
        url: 'news.com',
        urlToImage: 'news.com/media',
        publishedAt: '2024-05-16T05:06:26Z'
    },
];

describe('getArticlesHandler', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            query: {
                fromDate: '2024-01-01',
                toDate: '2024-01-02',
                searchQuery: 'example',
                sortBy: 'publishedAt',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return articles when request is valid', async () => {
        // Mock Axios response
        const mockResponse = { articles: mockArticles };
        mockAxios.onGet().reply(200, mockResponse);

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockResponse.articles);
    });

    it('should return 400 error if query parameter fromDate is missing', async () => {
        req.query = { ...req.query, fromDate: undefined };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"fromDate\" is required" });
    });

    it('should return 400 error when fromDate is not a valid date', async () => {
        req.query = { ...req.query, fromDate: 'invalid_date' };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"fromDate" must be in ISO 8601 date format' });
    });

    it('should return 400 error when fromDate is in the future', async () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1)
        req.query = { ...req.query, fromDate: currentDate.toISOString() };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"fromDate" must be less than or equal to "now"' });
    });

    it('should return 400 error if query parameter toDate is missing', async () => {
        req.query = { ...req.query, toDate: undefined };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"toDate\" is required" });
    });

    it('should return 400 error when toDate is not a valid date', async () => {
        req.query = { ...req.query, toDate: 'invalid_date' };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"toDate" must be in ISO 8601 date format' });
    });

    it('should return 400 error when toDate is in the future', async () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1)
        req.query = { ...req.query, toDate: currentDate.toISOString() };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"toDate" must be less than or equal to "now"' });
    });

    it('should return 400 error when searchQuery is missing', async () => {
        req.query = { ...req.query, searchQuery: undefined };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"searchQuery" is required' });
    });

    it('should return 400 error when sortBy is missing', async () => {
        req.query = { ...req.query, sortBy: undefined };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"sortBy" is required' });
    });

    it('should return 400 error when sortBy is invalid', async () => {
        req.query = { ...req.query, sortBy: 'invalidSortBy' };

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '"sortBy" must be one of [publishedAt, popularity, relevancy]' });
    });


    it('should return 500 if an internal error occurs', async () => {
        // Mocking Axios to throw an error
        mockAxios.onGet().networkError();

        await getArticlesHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});
