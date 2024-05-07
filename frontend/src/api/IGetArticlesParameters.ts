import SortByEnum from './SortByEnum';

export default interface IGetArticlesParameters {
    searchQuery: string;
    fromDate: string;
    toDate: string;
    sortBy: SortByEnum;
}