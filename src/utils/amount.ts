import { IBookstore } from '@/services/bookstoreService'

export function getBookstoreAmount(stores: IBookstore[]): number {
  return stores.reduce((acc, s) => (acc += s.amount), 0)
}

export function getLoanAmount(stores: IBookstore[]): number {
  return stores.reduce(
    (accs, s) => (accs += s.loans.reduce((accl, l) => (accl += l.amount), 0)),
    0,
  )
}

export function getTotalAmount(stores: IBookstore[]) {
  return getBookstoreAmount(stores) - getLoanAmount(stores)
}
