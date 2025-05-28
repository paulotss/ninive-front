import { useNavigate } from 'react-router-dom'
import { IBookstore } from '@/services/bookstoreService'
import { Button, Table } from '../ui'
import { ILoanCreate } from '@/services/loanService'
import NewExpense from './NewExpense'
import { IExpenseCreate } from '@/services/expenseService'
import { discountPrice } from '@/utils/amount'
import dayjs from 'dayjs'
import ReturnStatus from './ReturnStatus'
import { MdEdit } from 'react-icons/md'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
  coverPrice: number | string
  handleSubmitLoan(values: ILoanCreate): void
  handleSubmitExpense(
    bookstoreId: number,
    newBookAmount: number,
    values: IExpenseCreate,
  ): void
}

const RowCompactBookstore = ({
  bookstore,
  coverPrice,
  handleSubmitExpense,
}: IProps) => {
  const navigate = useNavigate()

  return (
    <Tr>
      <Td>{bookstore.store.name}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>
        {discountPrice(
          Number(coverPrice),
          bookstore.tax,
          bookstore.discount,
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Td>
      <Td>{`${bookstore.discount}%`}</Td>
      <Td>{`${bookstore.tax}%`}</Td>
      <Td>
        <ReturnStatus returnDate={dayjs(bookstore.returnDate)} />
      </Td>
      <Td>
        <div className="flex items-center">
          <NewExpense
            coverPrice={coverPrice}
            bookstore={bookstore}
            handleSubmitExpense={handleSubmitExpense}
          />
          <Button
            shape="circle"
            variant="twoTone"
            size="xs"
            icon={<MdEdit />}
            className="ml-2"
            onClick={() => navigate(`/consignado/${bookstore.id}`)}
          />
        </div>
      </Td>
    </Tr>
  )
}

export default RowCompactBookstore
