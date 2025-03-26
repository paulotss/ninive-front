import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewLoan from './NewLoan'
import NewExpense from './NewExpense'
import { IExpenseCreate } from '@/services/expenseService'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(bookstoreId: number, values: IExpenseCreate): void
}

const RowCompactBookstore = ({
  bookstore,
  handleSubmitLoan,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>
        <div className="flex items-center">
          <NewLoan
            bookId={bookstore.bookId}
            maxAmount={bookstore.amount}
            handleSubmitLoan={handleSubmitLoan}
          />
          <NewExpense
            payload={{
              bookId: bookstore.bookId,
              storeId: bookstore.storeId,
              amount: bookstore.amount,
              totalValue: 0,
            }}
            isLoan={
              bookstore.book?.loans?.filter((l) => l.closed === false).length >
              0
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
