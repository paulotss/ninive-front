import { useState } from 'react'
import { Button, Dialog } from '../ui'
import { IIncomingCreate } from '@/services/incomingService'

interface IProps {
  payload: IIncomingCreate
  branchName: string
  bookTitle: string
  amount: number
  salesAmount: number
  loanId: number
  handleSubmitIncoming(loanId, values: IIncomingCreate): void
}

const NewIncoming = ({
  payload,
  branchName,
  bookTitle,
  amount,
  salesAmount,
  loanId,
  handleSubmitIncoming,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  async function handleSubmit() {
    handleSubmitIncoming(loanId, payload)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        Devolver
      </Button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
        }}
      >
        <h3>Devolução | {bookTitle}</h3>
        <div className="mt-5 mb-5">
          <p>
            Loja: <span className="font-bold">{branchName}</span>
          </p>
          <p>
            Quantidade: <span className="font-bold">{amount}</span>{' '}
            <span className="italic">de ({payload.amount})</span>
          </p>
          <p>
            Vendas: <span className="font-bold">{salesAmount}</span>{' '}
            <span className="italic">de ({payload.amount})</span>
          </p>
          <p>
            Quantidade Total:{' '}
            <span className="font-bold">{amount - salesAmount}</span>{' '}
          </p>
          <p>
            Valor:{' '}
            <span className="font-bold">
              {payload.totalValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </p>
        </div>
        <Button
          type="button"
          variant="solid"
          color="green-500"
          className="mr-2"
          onClick={handleSubmit}
        >
          Confirmar
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={() => {
            ;() => {
              setIsDialogOpen(false)
            }
          }}
        >
          Cancelar
        </Button>
      </Dialog>
    </>
  )
}

export default NewIncoming
