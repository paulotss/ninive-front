import { ILoan, ILoanUpdate, loanRemove, loanUpdate } from "@/services/loanService";
import { ChangeEvent, useState } from "react";
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { incomingCreate } from "@/services/incomingService";
import { bookUpdate } from "@/services/bookService";
import dayjs from "dayjs";

interface IProps {
  loan: ILoan
  setSwitcher(s: boolean)
  switcher: boolean
}

const CardLoan = (props: IProps) => {
  const { loan, setSwitcher, switcher} = props;
  const [dialogIncomingIsOpen, setDialogIncomingIsOpen] = useState(false)
  const [dialogRemoveIsOpen, setDialogRemoveIsOpen] = useState(false)
  const [amountInput, setAmountInput] = useState<number>(loan.amount);

  const openIncomingDialog = () => {
    setDialogIncomingIsOpen(true)
  }

  const onDialogIncomingClose = () => {
    setDialogIncomingIsOpen(false)
  }

  const onDialogIncomingOk = async () => {
    try {
      await incomingCreate({
        bookId: loan.bookId,
        branchId: loan.branchId,
        amount: amountInput,
        totalValue: loan.salePrice * amountInput
      });
      await loanUpdate<ILoan, ILoanUpdate>(loan.id, { closed: true, closedDate: new Date() })
      await bookUpdate(loan.bookId, { amount: Number(loan.book.amount) - Number(amountInput) })
      setSwitcher(!switcher)
    } catch (e) {
      console.log(e)
    }
    setDialogIncomingIsOpen(false)
  }

  const openRemoveDialog = () => {
    setDialogRemoveIsOpen(true)
  }

  const onDialogRemoveClose = () => {
    setDialogRemoveIsOpen(false)
  }

  const onDialogRemoveOk = async () => {
    try {
      await loanRemove(loan.id)
      setSwitcher(!switcher)
    } catch (e) {
      console.log(e)
    }
    setDialogRemoveIsOpen(false)
  }

  const cardFooter = (
    <div className="flex justify-end">
        <Button size="sm" className="ltr:mr-2 rtl:ml-2" onClick={openIncomingDialog}>
            Encerrar
        </Button>
        <Button size="sm" variant="solid" onClick={openRemoveDialog}>
            Excluir
        </Button>
    </div>
  )

  return (
    <>
      <div key={loan.id} className="mb-5 mr-5">
        <Card
          header={loan.branch.name}
          footer={cardFooter}
        >
          <p>Quantidade: <span className="font-bold">{ loan.amount }</span></p>
          <p>Preço de venda: <span className="font-bold">{ Number(loan.salePrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</span></p>
          <p>Data do empréstimo: <span className="font-bold">{ dayjs(loan.loanDate).format('DD/MM/YYYY') }</span></p>
          <p>Data de retorno: <span className="font-bold">{ dayjs(loan.returnDate).format('DD/MM/YYYY') }</span></p>
        </Card>
      </div>

      <Dialog
        isOpen={dialogIncomingIsOpen}
        onClose={onDialogIncomingClose}
        onRequestClose={onDialogIncomingClose}
      >
        <h5 className="mb-4">Emprestar</h5>
        <div>
            <Input
              name="amountInput"
              type="number"
              placeholder="Quantidade vendida"
              value={amountInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {setAmountInput(Number(e.target.value))}}
            />
            <p>Quantidade de retorno: { Number(loan.amount) - Number(amountInput) }</p>
            <p>Receita total: <span className="text-green-600 font-bold">{ (Number(loan.salePrice) * Number(amountInput))
              .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</span></p>
        </div>
        <div className="text-right mt-6">
            <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onDialogIncomingClose}
            >
                Cancelar
            </Button>
            <Button variant="solid" color="green-600" onClick={onDialogIncomingOk}>
                Confirmar
            </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={dialogRemoveIsOpen}
        onClose={onDialogRemoveClose}
        onRequestClose={onDialogRemoveClose}
      >
        <h5 className="mb-4">Emprestar</h5>
          <p>Tem certeza que deseja excluir?</p>
          <p className="italic">Essa ação não é reversível e pode causar inconsistência no estoque</p>
        <div className="text-right mt-6">
            <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onDialogRemoveClose}
            >
                Cancelar
            </Button>
            <Button variant="solid" onClick={onDialogRemoveOk}>
                Sim
            </Button>
        </div>
      </Dialog>
    </>
  )
}

export default CardLoan;