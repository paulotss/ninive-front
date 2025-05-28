import ApiService from './ApiService'
import { IBook } from './bookService'

export interface IPublisher {
  id: number
  name: string
  books?: IBook[]
}

export interface IPublisherCreate {
  name: string
}

export interface IPublisherUpdate {
  name?: string
}

export async function publisherCreate(data: IPublisherCreate) {
  return ApiService.fetchData<IPublisher, IPublisherCreate>({
    url: '/publisher',
    method: 'post',
    data,
  })
}

export async function publisherGetAll() {
  return ApiService.fetchData<IPublisher[]>({
    url: '/publisher',
    method: 'get',
  })
}

export async function publisherGetOne(id: number) {
  return ApiService.fetchData<IPublisher>({
    url: `/publisher/${id}`,
    method: 'get',
  })
}

export async function publisherUpdate(id: number, data: IPublisherUpdate) {
  return ApiService.fetchData<IPublisher, IPublisherUpdate>({
    url: `/publisher/${id}`,
    method: 'patch',
    data,
  })
}

export async function publisherRemove(id: number) {
  return ApiService.fetchData<IPublisher>({
    url: `/publisher/${id}`,
    method: 'delete',
  })
}
