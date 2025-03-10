import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import RowCompactLoan from './RowCompactLoan'
import { IIncomingCreate } from '@/services/incomingService'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  loans: ILoan[]
  bookTitle: string
  handleSubmitIncoming(loanId: number, values: IIncomingCreate): void
}

const TableCompactLoan = ({
  loans,
  bookTitle,
  handleSubmitIncoming,
}: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Local</Th>
          <Th>Quantidade</Th>
          <Th>Vendas</Th>
          <Th>Quant. Total</Th>
          <Th>Preço de capa</Th>
          <Th>Ações</Th>
        </Tr>
      </THead>
      <TBody>
        {loans?.map((l) => (
          <RowCompactLoan
            key={l.id}
            loan={l}
            bookTitle={bookTitle}
            handleSubmitIncoming={handleSubmitIncoming}
          />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactLoan
