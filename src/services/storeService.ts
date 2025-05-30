import ApiService from './ApiService'
import { IBookstore } from './bookstoreService'

export interface IStore {
  id: number
  name: string
  books?: IBookstore[]
}

export interface IStoreCreate {
  name: string
}

export interface IStoreUpdate {
  name?: string
}

export async function storeCreate(data: IStoreCreate) {
  return ApiService.fetchData<IStore, IStoreCreate>({
    url: '/store',
    method: 'post',
    data,
  })
}

export async function storeGetAll() {
  return ApiService.fetchData<IStore[]>({
    url: '/store',
    method: 'get',
  })
}

export async function storeGetOne(id: number) {
  return ApiService.fetchData<IStore>({
    url: `/store/${id}`,
    method: 'get',
  })
}

export async function storeUpdate(id: number, data: IStoreUpdate) {
  return ApiService.fetchData<IStore, IStoreUpdate>({
    url: `/store/${id}`,
    method: 'patch',
    data,
  })
}

export async function storeRemove(id: number) {
  return ApiService.fetchData<IStore>({
    url: `/store/${id}`,
    method: 'delete',
  })
}
