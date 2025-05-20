import { Table } from '../ui'
import { ILoan } from '@/services/loanService'
import RowCompactLoan from './RowCompactLoan'
import { IIncomingCreate } from '@/services/incomingService'

const { Tr, Th, THead, TBody } = Table

interface IProps {
  loans: ILoan[]
  bookTitle: string
  coverPrice: number | string
  handleSubmitIncoming(
    loanId: number,
    returningAmount: number,
    newIncoming: IIncomingCreate,
  ): void
}

const TableCompactLoan = ({
  loans,
  bookTitle,
  coverPrice,
  handleSubmitIncoming,
}: IProps) => {
  return (
    <Table compact>
      <THead>
        <Tr>
          <Th>Local</Th>
          <Th>Quantidade</Th>
          <Th>Devolução</Th>
          <Th>Desconto</Th>
          <Th>Valor de venda</Th>
          <Th>Ações</Th>
        </Tr>
      </THead>
      <TBody>
        {loans?.map((l) => (
          <RowCompactLoan
            key={l.id}
            loan={l}
            bookTitle={bookTitle}
            coverPrice={coverPrice}
            handleSubmitIncoming={handleSubmitIncoming}
          />
        ))}
      </TBody>
    </Table>
  )
}

export default TableCompactLoan
