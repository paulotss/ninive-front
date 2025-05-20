import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewExpense from './NewExpense'
import { IExpenseCreate } from '@/services/expenseService'
import { discountPrice } from '@/utils/amount'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  coverPrice: number | string
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(bookstoreId: number, values: IExpenseCreate): void
}

const RowCompactBookstore = ({
  bookstore,
  coverPrice,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>
        {discountPrice(
          Number(coverPrice),
          bookstore.tax,
          bookstore.discount,
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Td>
      <Td>{`${bookstore.discount}%`}</Td>
      <Td>{`${bookstore.tax}%`}</Td>
      <Td>
        <div className="flex items-center">
          <NewExpense
            payload={{
              bookId: bookstore.bookId,
              storeId: bookstore.storeId,
              amount: 0,
              totalValue: 0,
            }}
            storeName={bookstore.store.name}
            bookTitle={bookstore.book.title}
            bookstoreId={bookstore.id}
            coverPrice={coverPrice}
            tax={bookstore.tax}
            discount={bookstore.discount}
            bookstore={bookstore}
            handleSubmitExpense={handleSubmitExpense}
          />
        </div>
      </Td>
    </Tr>
  )
}

export default RowCompactBookstore
