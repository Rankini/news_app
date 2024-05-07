import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import SortByEnum from '../api/SortByEnum';
import IGetArticlesParameters from '../api/IGetArticlesParameters';

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchFormProps {
    onSubmit: (getArticleParameters: IGetArticlesParameters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()]);
    const [sortBy, setSortBy] = useState<SortByEnum>(SortByEnum.RELEVANCY);

    const handleSubmit = () => {
        const getArticleParameters: IGetArticlesParameters = {
            searchQuery,
            fromDate: dateRange[0].format('YYYY-MM-DD'),
            toDate: dateRange[1].format('YYYY-MM-DD'),
            sortBy,
        }

        onSubmit(getArticleParameters);
    };

    const validateDateRange = (_: any, value: [Dayjs, Dayjs]) => {
        if (value[0].isAfter(dayjs(), 'day') || value[1].isAfter(dayjs(), 'day')) {
            return Promise.reject('Neither date can be in the future');
        }
        return Promise.resolve();
    };

    return (
        <Form
            className='search-form'
            onFinish={handleSubmit}
            layout='inline'
            // Set the date-range initial values here as they are not preloading in the RangePicker component
            initialValues={{
                'date-range': [
                    dateRange[0],
                    dateRange[1],
                ],
            }}
        >
            <Item
                name='search'
                rules={[{ required: true, message: 'Search term is required' }]}
            >
                <Input
                    addonBefore={<SearchOutlined />}
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
            </Item>
            <Item
                name='date-range'
                rules={[
                    { required: true, message: 'Date range is required' },
                    { validator: validateDateRange },
                ]}
            >
                <RangePicker
                    value={dateRange}
                    format='DD/MM/YYYY'
                    allowEmpty={false}
                    allowClear={false}
                    onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                />
            </Item>
            <Item>
                <Select className='sort-by' value={sortBy} onChange={(value) => setSortBy(value)}>
                    <Option value={SortByEnum.RELEVANCY}>Most Relevant</Option>
                    <Option value={SortByEnum.POPULARITY}>Popular Sources</Option>
                    <Option value={SortByEnum.PUBLISHED_AT}>Latest</Option>
                </Select>
            </Item>
            <Item>
                <Button type='primary' htmlType='submit'>
                    Search
                </Button>
            </Item>
        </Form>
    );
};

export default SearchForm;
