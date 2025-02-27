import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewLoan from './NewLoan'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  maxAmount: number
  handleSubmitLoan(values: ILoanCreate): void
}

const RowCompactBookstore = ({
  bookstore,
  maxAmount,
  handleSubmitLoan,
}: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>{bookstore.coverPrice}</Td>
      <Td>
        <NewLoan
          bookstoreId={bookstore.id}
          maxAmount={maxAmount}
          handleSubmitLoan={handleSubmitLoan}
        />
      </Td>
    </Tr>
  )
}

export default RowCompactBookstore
