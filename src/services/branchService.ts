import ApiService from './ApiService'
import { IBook } from './bookService'
import { IIncoming } from './incomingService'

export interface IBranch {
  id: number
  name: string
  books?: IBook[]
  incomings?: IIncoming[]
}

export interface IBranchCreate {
  id: number
  name: string
}

export async function branchCreate(data: IBranchCreate) {
  return ApiService.fetchData<IBranch, IBranchCreate>({
    url: '/branch',
    method: 'post',
    data,
  })
}

export async function branchGetAll() {
  return ApiService.fetchData<IBranch[]>({
    url: '/branch',
    method: 'get',
  })
}

export async function branchGetOne(id: number) {
  return ApiService.fetchData<IBranch>({
    url: `/branch/${id}`,
    method: 'get',
  })
}

export async function branchRemove(id: number) {
  return ApiService.fetchData<IBranch>({
    url: `/branch/${id}`,
    method: 'delete',
  })
}
