import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import NewIncoming from './NewIncoming'
import { IIncomingCreate } from '@/services/incomingService'

interface IProps {
  loan: ILoan
  bookTitle: string
  handleSubmitIncoming(loanId: number, values: IIncomingCreate): void
}

const { Tr, Td } = Table

const RowCompactLoan = ({ loan, bookTitle, handleSubmitIncoming }: IProps) => {
  return (
    <Tr>
      <Td>{loan.branch.name}</Td>
      <Td>{loan.amount}</Td>
      <Td>{loan.salesAmount}</Td>
      <Td>{loan.amount - loan.salesAmount}</Td>
      <Td>{loan.bookstore.coverPrice}</Td>
      <Td>
        <NewIncoming
          payload={{
            bookId: loan.bookstore.bookId,
            branchId: loan.branchId,
            amount: loan.salesAmount,
            totalValue: loan.amount * Number(loan.bookstore.coverPrice),
          }}
          bookTitle={bookTitle}
          branchName={loan.branch.name}
          amount={loan.amount}
          salesAmount={loan.salesAmount}
          loanId={loan.id}
          handleSubmitIncoming={handleSubmitIncoming}
        />
      </Td>
    </Tr>
  )
}

export default RowCompactLoan
