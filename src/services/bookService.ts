import ApiService from './ApiService'
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
  amount: number
  edition: number
  publishierId: number
  publishier?: IPublisher
  stores?: IBookstore[]
  branchs?: ILoan[]
  expenses?: IExpense[]
  incomings?: IIncoming[]
}

export interface IBookCreate {
  title: string
  isbn: string
  publicationDate: Date
  description: string
  pages: number
  amount: number
  edition: number
  publishierId: number
}

export interface IBookUpdate {
  title?: string
  isbn?: string
  publicationDate?: Date
  description?: string
  pages?: number
  amount?: number
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

export async function bookUpdate<IBook, IBookUpdate>(
  id: number,
  data: IBookUpdate,
) {
  return ApiService.fetchData<IBook, IBookUpdate>({
    url: `/book/${id}`,
    method: 'patch',
    data,
  })
}
