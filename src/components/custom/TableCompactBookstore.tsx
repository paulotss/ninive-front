import { Table } from '../ui'
import RowCompactBookstore from './RowCompactBookstore'
import { ILoanCreate } from '@/services/loanService'
import { IExpenseCreate } from '@/services/expenseService'
import { IBook } from '@/services/bookService'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  book: IBook
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(
    bookstoreId: number,
    newBookAmount: number,
    values: IExpenseCreate,
  ): void
}

const TableCompactBookstore = ({
  book,
  handleSubmitLoan,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Fornecedor</Th>
          <Th>Quant.</Th>
          <Th>Valor Total</Th>
          <Th>Valor Desc.</Th>
          <Th>Devolução</Th>
          <Th>Ações</Th>
        </Tr>
      </THead>
      <TBody>
        {book?.stores.map((b) => (
          <RowCompactBookstore
            key={b.id}
            handleSubmitLoan={handleSubmitLoan}
            bookstore={b}
            handleSubmitExpense={handleSubmitExpense}
            coverPrice={book.coverPrice}
          />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactBookstore
