import { useState } from 'react'
import { Button, Dialog } from '../ui'
import { IExpenseCreate } from '@/services/expenseService'

interface IProps {
  payload: IExpenseCreate
  storeName: string
  bookTitle: string
  salesAmount: number
  bookstoreId: number
  isLoan: boolean
  handleSubmitExpense(bookstoreId, values: IExpenseCreate): void
}

const NewExpense = ({
  payload,
  storeName,
  bookTitle,
  salesAmount,
  bookstoreId,
  isLoan,
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
        disabled={isLoan}
        size="xs"
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        Faturar
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
            Quantidade:{' '}
            <span className="font-bold">{payload.amount - salesAmount}</span>{' '}
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
      </Dialog>
    </>
  )
}

export default NewExpense
