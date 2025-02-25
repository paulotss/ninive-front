import { IBookstore } from '@/services/bookstoreService'
import { Table } from '../ui'

const { Tr, Td } = Table

interface IProps {
  bookstore: IBookstore
}

const RowCompactBookstore = ({ bookstore }: IProps) => {
  return (
    <Tr>
      <Td>{bookstore.book.title}</Td>
      <Td>{bookstore.book.isbn}</Td>
      <Td>{bookstore.amount}</Td>
      <Td>{bookstore.coverPrice}</Td>
      <Td></Td>
    </Tr>
  )
}

export default RowCompactBookstore
