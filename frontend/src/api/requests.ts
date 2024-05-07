import axios from 'axios';
import IArticle from '../api/IArticle';
import IGetArticlesParameters from './IGetArticlesParameters';
import { parseArticle } from './parsers';

const API_HOST = process.env.REACT_APP_API_HOST;

const fetchArticles = async (getArticleParameters: IGetArticlesParameters): Promise<IArticle[]> => {
    try {
        const response = await axios.get(`${API_HOST}/articles`, {
            params: {
                searchQuery: getArticleParameters.searchQuery,
                fromDate: getArticleParameters.fromDate,
                toDate: getArticleParameters.toDate,
                sortBy: getArticleParameters.sortBy,
            },
        });

        return response.data.map(parseArticle);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export default fetchArticles;
