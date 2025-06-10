import ApiService from './ApiService'
import { IBookstore } from './bookstoreService'
import { IExpense } from './expenseService'
import { IIncoming } from './incomingService'
import { ILoan } from './loanService'
import { ILocation } from './locationService'
import { IPublisher } from './publisherService'

export interface IBook {
  id: number
  title: string
  isbn: string
  author: string
  publicationDate: Date | string
  description: string
  pages: number
  edition: number
  amount: number
  coverPrice: string | number
  locationId: number
  location?: ILocation
  publishierId: number
  publishier?: IPublisher
  stores?: IBookstore[]
  loans: ILoan[]
  expenses?: IExpense[]
  incomings?: IIncoming[]
}

export interface IBookCreate {
  title: string
  isbn: string
  author: string
  publicationDate: Date
  description: string
  pages: number | string
  edition: number | string
  amount: number | string
  coverPrice: number | string
  locationId: number | string
  publishierId: number | string
}

export interface IBookUpdate {
  title?: string
  isbn?: string
  author?: string
  publicationDate?: Date
  description?: string
  pages?: number
  edition?: number
  amount?: number
  coverPrice?: number | string
  locationId?: number
  publishierId?: number
}

export async function bookGetAll() {
  return ApiService.fetchData<IBook[]>({
    url: '/book',
    method: 'get',
  })
}

export async function bookCreate<IBook, IBookCreate>(data: IBookCreate) {
  return ApiService.fetchData<IBook, IBookCreate>({
    url: '/book',
    method: 'post',
    data,
  })
}

export async function bookGetOne(id: number) {
  return ApiService.fetchData<IBook>({
    url: `/book/${id}`,
    method: 'get',
  })
}

export async function bookUpdate(id: number, data: IBookUpdate) {
  return ApiService.fetchData<IBook, IBookUpdate>({
    url: `/book/${id}`,
    method: 'patch',
    data,
  })
}

export async function bookGetByBookTitle(title: string) {
  return ApiService.fetchData<IBook[]>({
    url: `/book/title/${title}`,
    method: 'get',
  })
}

export async function bookGetByBookISBN(isbn: string) {
  return ApiService.fetchData<IBook[]>({
    url: `/book/isbn/${isbn}`,
    method: 'get',
  })
}
