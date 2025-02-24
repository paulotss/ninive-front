import dayjs from 'dayjs'
import ApiService from './ApiService'
import { IBook } from './bookService'
import { IStore } from './storeService'

export interface IExpense {
  id?: number
  bookId: number
  storeId: number
  amount: number
  createdAt?: Date | string
  totalValue: string | number
  book?: IBook
  store?: IStore
}

export interface IExpenseCreate {
  bookId: number
  storeId: number
  amount: number
  totalValue: number
}

export async function expenseCreate<IExpenseCreate>(data) {
  return ApiService.fetchData<IExpenseCreate>({
    url: '/expense',
    method: 'post',
    data: data,
  })
}

export async function expenseGetAll() {
  return ApiService.fetchData<IExpense[]>({
    url: '/expense',
    method: 'get',
  })
}

export async function expenseGetAllByDate(startDate: Date, endDate: Date) {
  return ApiService.fetchData<IExpense[]>({
    url: `/expense/sd/${dayjs(startDate).format()}/ed/${dayjs(
      endDate,
    ).format()}`,
    method: 'get',
  })
}

export async function expenseGetOne(id: number) {
  return ApiService.fetchData<IExpense>({
    url: `/expense/${id}`,
    method: 'get',
  })
}

export async function expenseRemove(id: number) {
  return ApiService.fetchData<IExpense>({
    url: `/expense/${id}`,
    method: 'delete',
  })
}
