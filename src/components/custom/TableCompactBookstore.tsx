import { Table } from '../ui'
import { IBookstore } from '@/services/bookstoreService'
import RowCompactBookstore from './RowCompactBookstore'
import { ILoanCreate } from '@/services/loanService'
import { IExpenseCreate } from '@/services/expenseService'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  bookstores: IBookstore[]
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(bookstoreId: number, values: IExpenseCreate): void
}

const TableCompactBookstore = ({
  bookstores,
  handleSubmitLoan,
  handleSubmitExpense,
}: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Loja</Th>
          <Th>Quantidade</Th>
          <Th>Vendas</Th>
          <Th>Preço de capa</Th>
          <Th>Ações</Th>
        </Tr>
      </THead>
      <TBody>
        {bookstores?.map((b) => (
          <RowCompactBookstore
            key={b.id}
            handleSubmitLoan={handleSubmitLoan}
            bookstore={b}
            salesAmount={b.loans.reduce((acc, l) => (acc += l.salesAmount), 0)}
            handleSubmitExpense={handleSubmitExpense}
          />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactBookstore
