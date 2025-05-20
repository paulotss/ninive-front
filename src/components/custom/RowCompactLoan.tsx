import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import NewIncoming from './NewIncoming'
import dayjs from 'dayjs'
import { salePrice } from '@/utils/amount'
import { IIncomingCreate } from '@/services/incomingService'

interface IProps {
  loan: ILoan
  bookTitle: string
  coverPrice: number | string
  handleSubmitIncoming(
    loanId: number,
    returningAmount: number,
    newIncoming: IIncomingCreate,
  ): void
}

const { Tr, Td } = Table

const RowCompactLoan = ({
  loan,
  bookTitle,
  coverPrice,
  handleSubmitIncoming,
}: IProps) => {
  return (
    <Tr>
      <Td>{loan.branch?.name}</Td>
      <Td>{loan.amount}</Td>
      <Td>{dayjs(loan.loanDate).format('DD/MM/YYYY')}</Td>
      <Td>{`${loan.discount}%`}</Td>
      <Td>
        {salePrice(Number(coverPrice), loan.discount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Td>
      <Td>
        <NewIncoming
          bookId={loan.bookId}
          branchId={loan.branchId}
          bookTitle={bookTitle}
          branchName={loan.branch?.name}
          amount={loan.amount}
          salePrice={salePrice(Number(coverPrice), loan.discount)}
          loanId={loan.id}
          handleSubmitIncoming={handleSubmitIncoming}
        />
      </Td>
    </Tr>
  )
}

export default RowCompactLoan
