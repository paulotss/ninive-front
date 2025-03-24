import ApiService from './ApiService'
import { IAquisition } from './acquisitionService'
import { IBookstore } from './bookstoreService'
import { IExpense } from './expenseService'
import { IIncoming } from './incomingService'
import { ILoan } from './loanService'
import { IPublisher } from './publisherService'

export interface IBook {
  id: number
  title: string
  isbn: string
  publicationDate: Date | string
  description: string
  pages: number
  edition: number
  coverPrice: string | number
  publishierId: number
  publishier?: IPublisher
  stores?: IBookstore[]
  acquisitions: IAquisition[]
  loans: ILoan[]
  expenses?: IExpense[]
  incomings?: IIncoming[]
}

export interface IBookCreate {
  title: string
  isbn: string
  publicationDate: Date
  description: string
  pages: number | string
  edition: number | string
  publishierId: number | string
}

export interface IBookUpdate {
  title?: string
  isbn?: string
  publicationDate?: Date
  description?: string
  pages?: number
  edition?: number
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
