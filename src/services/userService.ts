import ApiService from './ApiService'

export interface IUser {
  id: number
  name: string
  email: string
  admin: boolean
}

export interface IUserCreate {
  name: string
  email: string
  admin: boolean
}

export interface IUserUpdate {
  name?: string
  email?: string
  admin?: boolean
}

export async function userGetAll() {
  return ApiService.fetchData<IUser[]>({
    url: '/user',
    method: 'get',
  })
}

export async function userCreate<IUser, IUserCreate>(data: IUserCreate) {
  return ApiService.fetchData<IUser, IUserCreate>({
    url: '/user',
    method: 'post',
    data,
  })
}

export async function userGetOne(id: number) {
  return ApiService.fetchData<IUser>({
    url: `/user/${id}`,
    method: 'get',
  })
}

export async function userUpdate(id: number, data: IUserUpdate) {
  return ApiService.fetchData<IUser, IUserUpdate>({
    url: `/user/${id}`,
    method: 'patch',
    data,
  })
}
