import { Table } from '../ui'
import { IBookstore } from '@/services/bookstoreService'
import RowCompactBookstore from './RowCompactBookstore'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  bookstores: IBookstore[]
}

const TableCompactBookstore = ({ bookstores }: IProps) => {
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
          <RowCompactBookstore key={b.id} bookstore={b} />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactBookstore
