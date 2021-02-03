import { DataForHome } from './dataForHome';

//model of pagination data
export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

//model of results after pagination
export class PaginatedResult<T>{
    result: T;
    pagination: Pagination;
    generalData: DataForHome;
}