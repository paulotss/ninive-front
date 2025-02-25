import { Table } from '../ui'
import { ILoan } from '@/services/loanService'

interface IProps {
  loan: ILoan
}

const { Tr, Td } = Table

const RowCompactLoan = ({ loan }: IProps) => {
  return (
    <Tr>
      <Td>{loan.bookstore.book.title}</Td>
      <Td>{loan.bookstore.book.isbn}</Td>
      <Td>{loan.amount}</Td>
      <Td>{loan.bookstore.coverPrice}</Td>
      <Td></Td>
    </Tr>
  )
}

export default RowCompactLoan
