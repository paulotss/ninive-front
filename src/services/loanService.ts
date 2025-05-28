import ApiService from './ApiService'
import { IBook } from './bookService'
import { IBranch } from './branchService'

export interface ILoan {
  id: number
  bookId: number
  branchId: number
  amount: number
  discount: number
  salesAmount: number
  loanDate: Date
  returnDate: Date | string
  closed: boolean
  closedDate: Date | string
  branch?: IBranch
  book?: IBook
}

export interface ILoanCreate {
  bookId: number
  branchId: number | string
  amount: number | string
  discount: number | string
  salesAmount: number
  returnDate: Date
}

export interface ILoanUpdate {
  bookId?: number
  branchId?: number
  amount?: number
  discount?: number | string
  salesAmount?: number
  returnDate?: Date
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

export async function loanGetAllByBookstoreId(bookId: number) {
  return ApiService.fetchData<ILoan[]>({
    url: `/loan/bookstore/${bookId}`,
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
