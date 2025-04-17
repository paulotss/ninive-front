import { ChangeEvent, useState } from 'react'
import { Button, Dialog, Input } from '../ui'
import { IExpenseCreate } from '@/services/expenseService'
import { salePrice } from '@/utils/amount'

interface IProps {
  payload: IExpenseCreate
  storeName: string
  bookTitle: string
  bookstoreId: number
  coverPrice: number | string
  tax: number
  discount: number
  handleSubmitExpense(bookstoreId, values: IExpenseCreate): void
}

const NewExpense = ({
  payload,
  storeName,
  bookTitle,
  bookstoreId,
  coverPrice,
  tax,
  discount,
  handleSubmitExpense,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)

  async function handleSubmit() {
    handleSubmitExpense(bookstoreId, {
      ...payload,
      amount,
      totalValue: totalValue * amount,
    })
    setIsDialogOpen(false)
  }

  function handleAmountInput({ target }: ChangeEvent<HTMLInputElement>) {
    setAmount(Number(target.value))
    setTotalValue(salePrice(Number(coverPrice), tax, discount))
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
            <Input
              type="text"
              name="amount"
              value={amount}
              onChange={handleAmountInput}
            />
          </p>
          <p>
            Valor total:{' '}
            <span className="font-bold">
              {(totalValue * amount).toLocaleString('pt-BR', {
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
