import React, { useState } from 'react';
import IArticle from './api/IArticle';
import NewsList from './components/NewsList';
import SearchForm from './components/SearchForm';
import { Layout } from 'antd';
import './App.css';
import fetchArticles from './api/requests';
import IGetArticlesParameters from './api/IGetArticlesParameters';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);

    const handleFetchArticles = async (getArticleParameters: IGetArticlesParameters) => {
        const fetchedArticles = await fetchArticles(getArticleParameters);
        setArticles(fetchedArticles);
    };

    return (
        <Layout>
            <Layout className='layout'>
                <Header className='header'>
                    <div className='title'>News App</div>
                </Header>
                <Content className='content'>
                    <SearchForm onSubmit={handleFetchArticles} />
                    <NewsList articles={articles} />
                </Content>
                <Footer className='footer'/>
            </Layout>
        </Layout>
    );
};

export default App;
