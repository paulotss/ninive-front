import ApiService from "./ApiService"
import { IBook } from "./bookService";
import { IStore } from "./storeService";

export interface IBookstore {
    id: number;
    bookId: number;
    storeId: number;
    costPrice: number;
    consignmentDate: Date;
    returnDate: Date;
    amount: number;
    closed: boolean;
    closedDate: Date;
    book?: IBook;
    store?: IStore;
}

export async function bookstoreGetAll() {
    return ApiService.fetchData<IBookstore[]>({
        url: '/book-store',
        method: 'get'
    })
}

export async function bookstoreGetOne(id: number) {
    return ApiService.fetchData<IBookstore>({
        url: `/book-store/${id}`,
        method: 'get'
    })
}