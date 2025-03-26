import ApiService from './ApiService'
import { IBook } from './bookService'
import { IStore } from './storeService'

export interface IBookstore {
  id: number
  bookId: number
  storeId: number
  tax: number
  consignmentDate: Date | string
  returnDate: Date
  amount: number
  discount: number
  closed: boolean
  closedDate: Date | string
  book?: IBook
  store?: IStore
}

export interface IBookstoreCreate {
  bookId: number
  storeId: number | string
  tax: number | string
  returnDate: Date
  amount: number | string
  discount: number | string
}

export interface IBookstoreUpdate {
  bookId?: number
  storeId?: number
  tax?: number
  returnDate?: Date
  amount?: number
  discount?: number
  closed?: boolean
  closedDate?: Date
}

export async function bookstoreCreate(data: IBookstoreCreate) {
  return ApiService.fetchData<IBookstore, IBookstoreCreate>({
    url: '/book-store',
    method: 'post',
    data,
  })
}

export async function bookstoreUpdate<IBookstore, IBookstoreUpdate>(
  id: number,
  data: IBookstoreUpdate,
) {
  return ApiService.fetchData<IBookstore, IBookstoreUpdate>({
    url: `/book-store/${id}`,
    method: 'patch',
    data,
  })
}

export async function bookstoreGetAll() {
  return ApiService.fetchData<IBookstore[]>({
    url: '/book-store',
    method: 'get',
  })
}

export async function bookstoreGetAllByBookId(bookId: number) {
  return ApiService.fetchData<IBookstore[]>({
    url: `/book-store/book/${bookId}`,
    method: 'get',
  })
}

export async function bookstoreGetOne(id: number) {
  return ApiService.fetchData<IBookstore>({
    url: `/book-store/${id}`,
    method: 'get',
  })
}

export async function bookstoreRemove(id: number) {
  return ApiService.fetchData<IBookstore>({
    url: `/book-store/${id}`,
    method: 'delete',
  })
}
