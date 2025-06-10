import ApiService from './ApiService'
import { IIncoming } from './incomingService'
import { ILoan } from './loanService'

export interface IBranch {
  id: number
  name: string
  books?: ILoan[]
  incomings?: IIncoming[]
}

export interface IBranchCreate {
  name: string
}

export interface IBranchUpdate {
  name?: string
}

export async function branchCreate(data: IBranchCreate) {
  return ApiService.fetchData<IBranch, IBranchCreate>({
    url: '/branch',
    method: 'post',
    data,
  })
}

export async function branchUpdate(id: number, data: IBranchUpdate) {
  return ApiService.fetchData<IBranch, IBranchUpdate>({
    url: `/branch/${id}`,
    method: 'patch',
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
