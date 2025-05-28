import dayjs from 'dayjs'
import ApiService from './ApiService'
import { IBook } from './bookService'

export interface IIncoming {
  id?: number
  bookId: number
  branchId: number
  amount: number
  createdAt?: Date | string
  totalValue: string | number
  book?: IBook
}

export interface IIncomingCreate {
  bookId: number
  branchId: number
  amount: number
  totalValue: number
}

export async function incomingCreate(data: IIncomingCreate) {
  return ApiService.fetchData<IIncoming, IIncomingCreate>({
    url: '/incoming',
    method: 'post',
    data: data,
  })
}

export async function incomingCreateMany(data: IIncomingCreate[]) {
  return ApiService.fetchData<IIncoming[], IIncomingCreate[]>({
    url: '/incoming/create-many',
    method: 'post',
    data: data,
  })
}

export async function incomingGetAll() {
  return ApiService.fetchData<IIncoming[]>({
    url: '/incoming',
    method: 'get',
  })
}

export async function incomingGetAllByDate(startDate: Date, endDate: Date) {
  return ApiService.fetchData<IIncoming[]>({
    url: `/incoming/sd/${dayjs(startDate).format()}/ed/${dayjs(
      endDate,
    ).format()}`,
    method: 'get',
  })
}

export async function incomingGetOne(id: number) {
  return ApiService.fetchData<IIncoming>({
    url: `/incoming/${id}`,
    method: 'get',
  })
}

export async function incomingRemove(id: number) {
  return ApiService.fetchData<IIncoming>({
    url: `/incoming/${id}`,
    method: 'delete',
  })
}
