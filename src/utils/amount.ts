import { IBookstore } from '@/services/bookstoreService'
import { ILoan } from '@/services/loanService'

export function getBookstoreAmount(stores: IBookstore[] | undefined): number {
  if (!stores) return 0
  return stores.reduce((acc, s) => (acc += s.amount), 0)
}

export function getLoanAmount(loans: ILoan[] | undefined): number {
  if (!loans) return 0
  return loans.reduce((acc, l) => (acc += l.amount), 0)
}

export function getTotalAmount(
  stores: IBookstore[] | undefined,
  loans: ILoan[] | undefined,
) {
  if (!stores || !loans) return 0
  return getBookstoreAmount(stores) - getLoanAmount(loans)
}

export function salePrice(
  price: number,
  tax: number,
  discount: number,
): number {
  const taxValue = price * (tax / 100)
  const discountValue = price * (discount / 100)
  return price - discountValue + taxValue
}
