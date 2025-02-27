import { Table } from '../ui'
import { IBookstore } from '@/services/bookstoreService'
import RowCompactBookstore from './RowCompactBookstore'
import { ILoanCreate } from '@/services/loanService'
import { getTotalAmount } from '@/utils/amount'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  bookstores: IBookstore[]
  handleSubmitLoan(values: ILoanCreate): void
}

const TableCompactBookstore = ({ bookstores, handleSubmitLoan }: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Loja</Th>
          <Th>Quantidade</Th>
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
            maxAmount={getTotalAmount(bookstores)}
          />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactBookstore
