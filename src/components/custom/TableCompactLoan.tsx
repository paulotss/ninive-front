import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import RowCompactLoan from './RowCompactLoan'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  loans: ILoan[]
}

const TableCompactLoan = ({ loans }: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Quantidade</Th>
          <Th>Preço de capa</Th>
          <Th>Ações</Th>
        </Tr>
      </THead>
      <TBody>{loans?.map((l) => <RowCompactLoan key={l.id} loan={l} />)}</TBody>
    </Table>
  )
}

export default TableCompactLoan
