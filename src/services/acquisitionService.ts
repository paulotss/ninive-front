import ApiService from './ApiService'
import { IBook } from './bookService'
import { IStore } from './storeService'

export interface IAquisition {
  id: number
  bookId: number
  storeId: number
  tax: number
  amount: number
  date: Date | string
  book?: IBook
  store?: IStore
}

export interface IAquisitionCreate {
  bookId: number
  storeId: number | string
  tax: number | string
  date: Date
  amount: number | string
}

export interface IAquisitionUpdate {
  bookId?: number
  storeId?: number
  tax?: number
  amount?: number
  date?: Date
}

export async function bookstoreCreate(data: IAquisitionCreate) {
  return ApiService.fetchData<IAquisition, IAquisitionCreate>({
    url: '/book-store',
    method: 'post',
    data,
  })
}

export async function bookstoreUpdate<IAquisition, IAquisitionUpdate>(
  id: number,
  data: IAquisitionUpdate,
) {
  return ApiService.fetchData<IAquisition, IAquisitionUpdate>({
    url: `/book-store/${id}`,
    method: 'patch',
    data,
  })
}

export async function bookstoreGetAll() {
  return ApiService.fetchData<IAquisition[]>({
    url: '/book-store',
    method: 'get',
  })
}

export async function bookstoreGetAllByBookId(bookId: number) {
  return ApiService.fetchData<IAquisition[]>({
    url: `/book-store/book/${bookId}`,
    method: 'get',
  })
}

export async function bookstoreGetOne(id: number) {
  return ApiService.fetchData<IAquisition>({
    url: `/book-store/${id}`,
    method: 'get',
  })
}

export async function bookstoreRemove(id: number) {
  return ApiService.fetchData<IAquisition>({
    url: `/book-store/${id}`,
    method: 'delete',
  })
}
