import { useState } from 'react'
import { Button, Dialog } from '../ui'
import { IExpenseCreate } from '@/services/expenseService'

interface IProps {
  payload: IExpenseCreate
  storeName: string
  bookTitle: string
  maxAmount: number
  bookstoreId: number
  handleSubmitExpense(bookstoreId, values: IExpenseCreate): void
}

const NewExpense = ({
  payload,
  storeName,
  bookTitle,
  maxAmount,
  bookstoreId,
  handleSubmitExpense,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  async function handleSubmit() {
    handleSubmitExpense(bookstoreId, payload)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        disabled={maxAmount > 0}
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
        <h3>Faturar | {bookTitle}</h3>
        <div className="mt-5 mb-5">
          <p>
            Editora: <span className="font-bold">{storeName}</span>
          </p>
          <p>
            Quantidade: <span className="font-bold">{maxAmount}</span>{' '}
            <span className="italic">de ({payload.amount})</span>
          </p>
          <p>
            Valor total:{' '}
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

export default NewExpense
