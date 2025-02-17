import { ChangeEvent, useState } from "react";
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { bookUpdate } from "@/services/bookService";
import { IBookstore, IBookstoreUpdate, bookstoreRemove, bookstoreUpdate } from "@/services/bookstoreService";
import { expenseCreate } from "@/services/expenseService";
import dayjs from "dayjs";

interface IProps {
  bookstore: IBookstore
  setSwitcher(s: boolean)
  switcher: boolean
}

const CardBookstore = (props: IProps) => {
  const { bookstore, setSwitcher, switcher } = props;
  const [dialogExpenseIsOpen, setDialogExpenseIsOpen] = useState(false)
  const [dialogRemoveIsOpen, setDialogRemoveIsOpen] = useState(false)
  const [amountInput, setAmountInput] = useState<number>(bookstore.amount);

  const openExpenseDialog = () => {
    setDialogExpenseIsOpen(true)
  }

  const onDialogExpenseClose = () => {
    setDialogExpenseIsOpen(false)
  }

  const onDialogExpenseOk = async () => {
    try {
      await expenseCreate({
        bookId: bookstore.bookId,
        storeId: bookstore.storeId,
        amount: amountInput,
        totalValue: bookstore.costPrice * amountInput
      });
      await bookstoreUpdate<IBookstore, IBookstoreUpdate>(bookstore.id, { closed: true, closedDate: new Date() })
      await bookUpdate(bookstore.bookId, { amount: Number(bookstore.book.amount) + Number(amountInput) })
      setSwitcher(!switcher)
    } catch (e) {
      console.log(e)
    }
    setDialogExpenseIsOpen(false)
  }

  const openRemoveDialog = () => {
    setDialogRemoveIsOpen(true)
  }

  const onDialogRemoveClose = () => {
    setDialogRemoveIsOpen(false)
  }

  const onDialogRemoveOk = async () => {
    try {
      await bookstoreRemove(bookstore.id)
      setSwitcher(!switcher)
    } catch (e) {
      console.log(e)
    }
    setDialogRemoveIsOpen(false)
  }

  const cardFooter = (
    <div className="flex justify-end">
        <Button size="sm" className="ltr:mr-2 rtl:ml-2" onClick={openExpenseDialog}>
            Encerrar
        </Button>
        <Button size="sm" variant="solid" onClick={openRemoveDialog}>
            Excluir
        </Button>
    </div>
  )

  return (
    <>
      <div key={bookstore.id} className="mb-5 mr-5">
        <Card
          header={bookstore.store.name}
          footer={cardFooter}
        >
          <p>Quantidade: <span className="font-bold">{ bookstore.amount }</span></p>
          <p>Preço de custo: <span className="font-bold">{ Number(bookstore.costPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</span></p>
          <p>Data da consignação: <span className="font-bold">{ dayjs(bookstore.consignmentDate).format('DD/MM/YYYY') }</span></p>
          <p>Data de retorno: <span className="font-bold">{ dayjs(bookstore.returnDate).format('DD/MM/YYYY') }</span></p>
        </Card>
      </div>

      <Dialog
        isOpen={dialogExpenseIsOpen}
        onClose={onDialogExpenseClose}
        onRequestClose={onDialogExpenseClose}
      >
        <h5 className="mb-4">Consignar</h5>
        <div>
            <Input
              name="amountInput"
              type="number"
              placeholder="Quantidade"
              value={amountInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {setAmountInput(Number(e.target.value))}}
            />
            <p>Receita total: { 
              (Number(bookstore.costPrice) * Number(amountInput)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })
            }</p>
        </div>
        <div className="text-right mt-6">
            <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onDialogExpenseClose}
            >
                Cancelar
            </Button>
            <Button variant="solid" onClick={onDialogExpenseOk}>
                Confirmar
            </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={dialogRemoveIsOpen}
        onClose={onDialogRemoveClose}
        onRequestClose={onDialogRemoveClose}
      >
        <h5 className="mb-4">Exclusão</h5>
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

export default CardBookstore;