import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewLoan from './NewLoan'
import NewExpense from './NewExpense'
import { IExpenseCreate } from '@/services/expenseService'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  maxAmount: number
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(bookstoreId: number, values: IExpenseCreate): void
}

const RowCompactBookstore = ({
  bookstore,
  maxAmount,
  handleSubmitLoan,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>{maxAmount}</Td>
      <Td>{bookstore.coverPrice}</Td>
      <Td>
        <NewLoan
          bookstoreId={bookstore.id}
          maxAmount={bookstore.amount - maxAmount}
          handleSubmitLoan={handleSubmitLoan}
        />
        <NewExpense
          payload={{
            bookId: bookstore.bookId,
            storeId: bookstore.storeId,
            amount: bookstore.amount,
            totalValue: Number(bookstore.coverPrice) * maxAmount,
          }}
          maxAmount={maxAmount}
          storeName={bookstore.store.name}
          bookTitle={bookstore.book.title}
          bookstoreId={bookstore.id}
          handleSubmitExpense={handleSubmitExpense}
        />
      </Td>
    </Tr>
  )
}

export default RowCompactBookstore
