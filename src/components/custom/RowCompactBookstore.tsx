import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewLoan from './NewLoan'
import NewExpense from './NewExpense'
import { IExpenseCreate } from '@/services/expenseService'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  salesAmount: number
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(bookstoreId: number, values: IExpenseCreate): void
}

const RowCompactBookstore = ({
  bookstore,
  salesAmount,
  handleSubmitLoan,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>{salesAmount}</Td>
      <Td>{bookstore.coverPrice}</Td>
      <Td>
        <div className="flex items-center">
          <NewLoan
            bookstoreId={bookstore.id}
            maxAmount={bookstore.amount - salesAmount}
            handleSubmitLoan={handleSubmitLoan}
          />
          <NewExpense
            payload={{
              bookId: bookstore.bookId,
              storeId: bookstore.storeId,
              amount: bookstore.amount,
              totalValue: Number(bookstore.coverPrice) * salesAmount,
            }}
            salesAmount={salesAmount}
            isLoan={
              bookstore.loans.filter((l) => l.closed === false).length > 0
            }
            storeName={bookstore.store.name}
            bookTitle={bookstore.book.title}
            bookstoreId={bookstore.id}
            handleSubmitExpense={handleSubmitExpense}
          />
        </div>
      </Td>
    </Tr>
  )
}

export default RowCompactBookstore
