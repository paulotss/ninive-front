import ApiService from './ApiService'
import { IBook } from './bookService'

export interface ILocation {
  id: number
  title: string
  books?: IBook[]
}

export interface ILocationCreate {
  title: string
}

export interface ILocationUpdate {
  title?: string
}

export async function locationGetAll() {
  return ApiService.fetchData<ILocation[]>({
    url: '/location',
    method: 'get',
  })
}

export async function locationCreate<ILocation, ILocationCreate>(
  data: ILocationCreate,
) {
  return ApiService.fetchData<ILocation, ILocationCreate>({
    url: '/location',
    method: 'post',
    data,
  })
}

export async function locationGetOne(id: number) {
  return ApiService.fetchData<ILocation>({
    url: `/location/${id}`,
    method: 'get',
  })
}

export async function locationUpdate(id: number, data: ILocationUpdate) {
  return ApiService.fetchData<ILocation, ILocationUpdate>({
    url: `/location/${id}`,
    method: 'patch',
    data,
  })
}

export async function locationRemove(id: number) {
  return ApiService.fetchData<ILocation>({
    url: `/location/${id}`,
    method: 'delete',
  })
}
