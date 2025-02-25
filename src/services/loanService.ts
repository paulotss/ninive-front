import ApiService from './ApiService'
import { IBookstore } from './bookstoreService'
import { IBranch } from './branchService'

export interface ILoan {
  id: number
  bookstoreId: number
  branchId: number
  amount: number
  loanDate: Date
  returnDate: Date | string
  profitMargin: number
  closed: boolean
  closedDate: Date | string
  branch?: IBranch
  bookstore?: IBookstore
}

export interface ILoanCreate {
  bookstoreId: number
  branchId: number
  amount: number
  returnDate: Date
  profitMargin: number
}

export interface ILoanUpdate {
  bookstoreId?: number
  branchId?: number
  amount?: number
  returnDate?: Date
  profitMargin?: number
  closed?: boolean
  closedDate?: Date
}

export async function loanCreate<ILoan, ILoanCreate>(data: ILoanCreate) {
  return ApiService.fetchData<ILoan, ILoanCreate>({
    url: '/loan',
    method: 'post',
    data,
  })
}

export async function loanUpdate<ILoan, ILoanUpdate>(
  id: number,
  data: ILoanUpdate,
) {
  return ApiService.fetchData<ILoan, ILoanUpdate>({
    url: `/loan/${id}`,
    method: 'patch',
    data,
  })
}

export async function loanGetAll() {
  return ApiService.fetchData<ILoan[]>({
    url: '/loan',
    method: 'get',
  })
}

export async function loanGetAllByBookstoreId(bookstoreId: number) {
  return ApiService.fetchData<ILoan[]>({
    url: `/loan/bookstore/${bookstoreId}`,
    method: 'get',
  })
}

export async function loanGetOne(id: number) {
  return ApiService.fetchData<ILoan>({
    url: `/loan/${id}`,
    method: 'get',
  })
}

export async function loanRemove(id: number) {
  return ApiService.fetchData<ILoan>({
    url: `/loan/${id}`,
    method: 'delete',
  })
}
