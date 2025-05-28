import { useNavigate } from 'react-router-dom'
import { Table, Button } from '../ui'
import { ILoan } from '@/services/loanService'
import NewIncoming from './NewIncoming'
import dayjs from 'dayjs'
import { salePrice } from '@/utils/amount'
import { IIncomingCreate } from '@/services/incomingService'
import ReturnStatus from './ReturnStatus'
import { MdEdit } from 'react-icons/md'

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
  const navigate = useNavigate()

  return (
    <Tr>
      <Td>{loan.branch?.name}</Td>
      <Td>{loan.amount}</Td>
      <Td>
        {salePrice(Number(coverPrice), loan.discount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Td>
      <Td>{`${loan.discount}%`}</Td>
      <Td>
        <ReturnStatus returnDate={dayjs(loan.returnDate)} />
      </Td>
      <Td>
        <div className="flex items-center">
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
          <Button
            shape="circle"
            variant="twoTone"
            size="xs"
            icon={<MdEdit />}
            className="ml-2"
            onClick={() => navigate(`/emprestimo/${loan.id}`)}
          />
        </div>
      </Td>
    </Tr>
  )
}

export default RowCompactLoan
