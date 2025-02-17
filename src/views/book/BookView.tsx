import { bookstoreCreate, bookstoreGetAllByBookId, IBookstore, IBookstoreCreate } from "@/services/bookstoreService";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { bookGetOne, bookUpdate, IBook, IBookUpdate } from "@/services/bookService";
import { IStore, storeGetAll } from "@/services/storeService";
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker'
import { ILoan, ILoanCreate, loanCreate, loanGetAllByBookId } from "@/services/loanService";
import { branchGetAll, IBranch } from "@/services/branchService";
import CardLoan from "@/components/custom/CardLoan";
import CardBookstore from "@/components/custom/CardBookstore";
import { IPublisher, publisherGetAll } from "@/services/publisherService";

const BookstoreView = () => {
    const [book, setBook] = useState<IBook | null>(null);
    const [stores, setStores] = useState<IStore[]>([]);
    const [branchs, setBranchs] = useState<IBranch[]>([]);
    const [publishers, setPublishers] = useState<IPublisher[]>([]);
    const [bookstore, setBookstore] = useState<IBookstore[] | null>(null);
    const [loan, setLoan] = useState<ILoan[] | null>(null);
    const [bookstoreForm, setBookstoreForm] = useState<IBookstoreCreate | null>(null);
    const [loanForm, setLoanForm] = useState<ILoanCreate | null>(null);
    const [bookStoreDialogIsOpen, setBookStoreDialogIsOpen] = useState(false)
    const [loanDialogIsOpen, setLoanDialogIsOpen] = useState(false)
    const [switcher, setSwitcher] = useState<boolean>(false);
    const { id } = useParams();

    const openBookStoreDialog = () => {
        setBookStoreDialogIsOpen(true)
    }

    const onBookStoreDialogClose = () => {
        setBookStoreDialogIsOpen(false)
    }

    const onBookStoreDialogOk = async () => {
        try {
          await bookstoreCreate({...bookstoreForm, amount: Number(bookstoreForm.amount)})
          const resp = await bookUpdate<IBook, IBookUpdate>(book.id, { amount: book.amount + Number(bookstoreForm.amount) })
          setBook(resp.data);
          setSwitcher(!switcher)
        } catch (e) {
          console.log(e)
        }
        setBookStoreDialogIsOpen(false)
    }

    const openLoanDialog = () => {
        setLoanDialogIsOpen(true)
    }

    const onLoanDialogClose = () => {
        setLoanDialogIsOpen(false)
    }

    const onLoanDialogOk = async () => {
        try {
          await loanCreate({...loanForm, amount: Number(loanForm.amount)})
          await bookUpdate<IBook, IBookUpdate>(book.id, { amount: book.amount - Number(loanForm.amount) })
          setSwitcher(!switcher)
        } catch (e) {
          console.log(e)
        }
        setLoanDialogIsOpen(false)
    }

    function getTotalLoan(): number {
      return loan?.reduce((acc, l) => (acc += l.amount), 0)
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { target } = e;
        setBook({...book, [target.name]: target.value})
    }
    async function handleSubmit() {
        try {
          await bookUpdate(book.id, {
            title: book.title,
            isbn: book.isbn,
            publicationDate: book.publicationDate,
            description: book.description,
            publishierId: Number(book.publishierId),
            pages: Number(book.pages),
            amount: Number(book.amount),
            edition: Number(book.edition)
          });
        } catch (e) {
          console.log(e);
        }
    }

    function handleOnChangeBookstore (e: ChangeEvent<HTMLInputElement>) {
      const { target } = e;
      setBookstoreForm({ ...bookstoreForm, bookId: Number(id), [target.name]: target.value })
    }

    function handleOnChangeLoan (e: ChangeEvent<HTMLInputElement>) {
      const { target } = e;
      setLoanForm({ ...loanForm, bookId: Number(id), [target.name]: target.value })
    }

    useEffect(() => {
      async function getLoans() {
        try {
            const resp = await loanGetAllByBookId(Number(id));
            setLoan(resp.data);
        } catch (e) {
            console.log(e);
        }
      }
      getLoans();
    }, [id, switcher]);

    useEffect(() => {
      async function getBookstores() {
        try {
            const resp = await bookstoreGetAllByBookId(Number(id));
            setBookstore(resp.data);
        } catch (e) {
            console.log(e);
        }
      }
      getBookstores();
    }, [id, switcher]);

    useEffect(() => {
        async function getBook() {
            try {
                const resp = await bookGetOne(Number(id));
                setBook(resp.data);
            } catch (e) {
                console.log(e);
            }
        }
        getBook();
    }, [id, switcher])

    useEffect(() => {
        async function getStores() {
          try {
              const resp = await storeGetAll();
              setStores(resp.data);
          } catch (e) {
              console.log(e);
          }
        }
        async function getBranchs() {
          try {
              const resp = await branchGetAll();
              setBranchs(resp.data);
          } catch (e) {
              console.log(e);
          }
        }
        async function getPublishers() {
            try {
                const resp = await publisherGetAll();
                setPublishers(resp.data);
            } catch (e) {
                console.log(e);
            }
          }
        
        getStores();
        getBranchs();
        getPublishers();
    }, [id]);

    const cardFooter = (
        <div className="flex justify-end">
            <Button size="sm" variant="twoTone" className="ltr:mr-2 rtl:ml-2" color="green-600" onClick={openLoanDialog}>
                Emprestar
            </Button>
            <Button size="sm" variant="twoTone" className="ltr:mr-2 rtl:ml-2" color="red-600" onClick={openBookStoreDialog}>
                Consignar
            </Button>
            <Button size="sm" variant="solid" onClick={handleSubmit}>
                Alterar
            </Button>
        </div>
    )

    return (
        <>  {book &&
            <div className="mb-5">
                <Card
                    header="Informações"
                    footer={cardFooter}
                >
                    <Input placeholder="Título" name='title' className='mb-5' value={book?.title} onChange={handleChange} />
                    <Input placeholder="ISBN" name='isbn' className='mb-5' value={book?.isbn} onChange={handleChange} />
                    <DatePicker placeholder="Data de publicação" className='mb-5' value={book?.publicationDate} onChange={(date) => setBook({...book, publicationDate: date})} />
                    <Input textArea placeholder="Descrição" name='description' value={book?.description} className='mb-5' onChange={handleChange} />
                    <Input type='number' placeholder="Páginas" name='pages' value={book?.pages} className='mb-5' onChange={handleChange} />
                    <Input placeholder="Quantidade" name='amount' className='mb-5' value={book?.amount} onChange={handleChange} />
                    <Input type='number' placeholder="Edição" name='edition' value={book?.edition} className='mb-5' onChange={handleChange} />
                    <Select
                        placeholder="Editora"
                        options={publishers?.map((p) => ({
                            value: p.id,
                            label: p.name,
                        }))}
                        defaultValue={{value: book?.publishierId, label: book?.publishier.name}}
                        className='mb-5'
                        onChange={(data) => {setBook({...book, publishierId: data.value})}}
                    ></Select>

                    <div>
                      <p>Quantidade: <span className="font-bold">{ book?.amount - getTotalLoan() }</span></p>
                      <p>Quantidade Emprestada: <span className="font-bold">{ getTotalLoan() }</span></p>
                      <p>Quantidade Total: <span className="font-bold">{ book?.amount + getTotalLoan() }</span></p>
                    </div>
                </Card>
            </div>
            }

            <h3 className="mb-5 pb-3 border-b-2 text-green-600">Empréstimos</h3>
            <div className="flex flex-wrap">
                {loan?.map((l) => ( <CardLoan key={l.id} loan={l} setSwitcher={setSwitcher} switcher={switcher} /> ))}
            </div>

            <h3 className="mb-5 pb-3 border-b-2 text-red-600">Consignações</h3>
            <div className="flex flex-wrap">
                {bookstore?.map((b) => ( <CardBookstore key={b.id} bookstore={b} setSwitcher={setSwitcher} switcher={switcher} /> ))}
            </div>

            <Dialog
                isOpen={bookStoreDialogIsOpen}
                onClose={onBookStoreDialogClose}
                onRequestClose={onBookStoreDialogClose}
            >
                <h5 className="mb-4">Consignar</h5>
                <div>
                    <Select
                      name="storeId"
                      placeholder="Selecione..."
                      className="mb-3"
                      options={stores.map((s) => ({
                        value: s.id,
                        label: s.name
                      }))}
                      onChange={(v) => setBookstoreForm({...bookstoreForm, storeId: v.value })}
                    ></Select>
                    <Input name="costPrice" prefix="$" suffix=".00" className="mb-3" value={bookstoreForm?.costPrice} onChange={handleOnChangeBookstore} />
                    <Input name="amount" type="number" placeholder="Quantidade" className="mb-3" value={bookstoreForm?.amount} onChange={handleOnChangeBookstore} />
                    <DatePicker name="returnDate" placeholder="Validade" className="mb-3" onChange={(date) => { setBookstoreForm({...bookstoreForm, returnDate: date}) }} />
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onBookStoreDialogClose}
                    >
                        Cancelar
                    </Button>
                    <Button variant="solid" onClick={onBookStoreDialogOk}>
                        Confirmar
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={loanDialogIsOpen}
                onClose={onLoanDialogClose}
                onRequestClose={onLoanDialogClose}
            >
                <h5 className="mb-4">Emprestar</h5>
                <div>
                    <Select
                      name="branchId"
                      placeholder="Selecione..."
                      className="mb-3"
                      options={branchs.map((s) => ({
                        value: s.id,
                        label: s.name
                      }))}
                      onChange={(v) => setLoanForm({...loanForm, branchId: v.value })}
                    ></Select>
                    <Input name="salePrice" prefix="$" suffix=".00" value={loanForm?.salePrice} className="mb-3" onChange={handleOnChangeLoan} />
                    <Input name="amount" type="number" placeholder="Quantidade" className="mb-3" value={loanForm?.amount} onChange={handleOnChangeLoan} />
                    <DatePicker name="returnDate" placeholder="Validade" className="mb-3" onChange={(date) => { setLoanForm({...loanForm, returnDate: date}) }} />
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onLoanDialogClose}
                    >
                        Cancelar
                    </Button>
                    <Button variant="solid" onClick={onLoanDialogOk}>
                        Confirmar
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default BookstoreView;