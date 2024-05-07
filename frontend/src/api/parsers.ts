import IArticle from './IArticle';

export function parseArticle(raw: any): IArticle {
    return {
        description:raw.description,
        name: raw.source.name,
        publishedAt: raw.publishedAt,
        title: raw.title,
        url: raw.url,
        urlToImage: raw.urlToImage,
    };
}