import { useState } from 'react'
import { Button, Dialog } from '../ui'

interface IProps {
  branchName: string
  bookTitle: string
  amount: number
  salesAmount: number
  loanId: number
  handleSubmitIncoming(loanId: number): void
}

const NewIncoming = ({
  branchName,
  bookTitle,
  amount,
  salesAmount,
  loanId,
  handleSubmitIncoming,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  async function handleSubmit() {
    handleSubmitIncoming(loanId)
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
            Quantidade: <span className="font-bold">{amount}</span>
          </p>
          <p>
            Vendas: <span className="font-bold">{salesAmount}</span>
          </p>
          <p>
            Quantidade Total:{' '}
            <span className="font-bold">{amount - salesAmount}</span>
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

export default NewIncoming
