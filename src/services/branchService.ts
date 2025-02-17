import ApiService from "./ApiService"

export interface IBranch {
    id: number;
    name: string;
}

export async function branchCreate<IBranch>(data) {
    return ApiService.fetchData<IBranch>({
        url: '/branch',
        method: 'post',
        data
    })
}

export async function branchGetAll() {
    return ApiService.fetchData<IBranch[]>({
        url: '/branch',
        method: 'get'
    })
}

export async function branchGetOne(id: number) {
    return ApiService.fetchData<IBranch>({
        url: `/branch/${id}`,
        method: 'get'
    })
}

export async function branchRemove(id: number) {
    return ApiService.fetchData<IBranch>({
        url: `/branch/${id}`,
        method: 'delete'
    })
}