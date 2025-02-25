import ApiService from './ApiService'
import { IBook } from './bookService'
import { ILoan } from './loanService'
import { IStore } from './storeService'

export interface IBookstore {
  id: number
  bookId: number
  storeId: number
  coverPrice: string | number
  tax: number
  consignmentDate: Date | string
  returnDate: Date
  amount: number
  closed: boolean
  closedDate: Date | string
  book?: IBook
  store?: IStore
  loans?: ILoan[]
}

export interface IBookstoreCreate {
  bookId: number
  storeId: number
  coverPrice: number
  tax: number
  returnDate: Date
  amount: number
}

export interface IBookstoreUpdate {
  bookId?: number
  storeId?: number
  coverPrice?: number
  tax: number
  returnDate?: Date
  amount?: number
  closed?: boolean
  closedDate?: Date
}

export async function bookstoreCreate<IBookstore, IBookstoreCreate>(
  data: IBookstoreCreate,
) {
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
