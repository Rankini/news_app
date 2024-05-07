import React from 'react'
import IArticle from '../api/IArticle'
import { Divider, List, Space } from 'antd';
import dayjs from 'dayjs';

interface IProps {
    articles: IArticle[];
}

const NewsList: React.FC<IProps> = ( { articles }: IProps ) => {
    return (
        <div className='news-list'>
            <List
                itemLayout='vertical'
                size='large'
                dataSource={articles}
                renderItem={(article, index) => (
                    <a
                        href={article.url}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <List.Item
                            className='story'
                            key={index}
                            extra={
                                <img
                                    width={272}
                                    alt={article.title}
                                    src={article.urlToImage}
                                />
                            }
                        >
                            <List.Item.Meta
                                className='article-info'
                                title={article.title}
                                description={article.description}
                            />
                            <Space className='bottom-info' split={<Divider type='vertical' />}>
                                <p>{article.name}</p>
                                <p>{dayjs(article.publishedAt).format('h:mma D MMMM YYYY')}</p>
                            </Space>
                        </List.Item>
                    </a>
                )}
            />
        </div>
    )
}

export default NewsList