import ApiService from "./ApiService"
import { IBranch } from "./branchService";
import { IExpense } from "./expenseService";
import { IIncoming } from "./incomingService";
import { IPublisher } from "./publisherService";
import { IStore } from "./storeService";

export interface IBook {
    id: number;
    title: string;
    isbn: string;
    publicationDate: Date;
    description: string;
    pages: number;
    amount: number;
    edition: number;
    publishierId: number;
    publishier?: IPublisher;
    stores?: IStore[],
    branchs?: IBranch[],
    expenses?: IExpense[],
    incomings?: IIncoming[],
}

export interface IBookCreate {
    title: string;
    isbn: string;
    publicationDate: Date;
    description: string;
    pages: number;
    amount: number;
    edition: number;
    publishierId: number;
}

export interface IBookUpdate {
    title?: string;
    isbn?: string;
    publicationDate?: Date;
    description?: string;
    pages?: number;
    amount?: number;
    edition?: number;
    publishierId?: number;
}


export async function bookGetAll() {
    return ApiService.fetchData<IBook[]>({
        url: '/book',
        method: 'get'
    })
}

export async function bookCreate<IBook, IBookCreate>(data: IBookCreate) {
    return ApiService.fetchData<IBook, IBookCreate>({
        url: '/book',
        method: 'post',
        data
    })
}

export async function bookGetOne(id: number) {
    return ApiService.fetchData<IBook>({
        url: `/book/${id}`,
        method: 'get'
    })
}

export async function bookUpdate<IBook, IBookUpdate>(id: number, data: IBookUpdate) {
    return ApiService.fetchData<IBook, IBookUpdate>({
        url: `/book/${id}`,
        method: 'patch',
        data,
    })
}