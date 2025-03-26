import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import NewIncoming from './NewIncoming'

interface IProps {
  loan: ILoan
  bookTitle: string
  handleSubmitIncoming(loanId: number): void
}

const { Tr, Td } = Table

const RowCompactLoan = ({ loan, bookTitle, handleSubmitIncoming }: IProps) => {
  return (
    <Tr>
      <Td>{loan.branch?.name}</Td>
      <Td>{loan.amount}</Td>
      <Td>{loan.salesAmount}</Td>
      <Td>{loan.amount - loan.salesAmount}</Td>
      <Td>
        <NewIncoming
          bookTitle={bookTitle}
          branchName={loan.branch?.name}
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
