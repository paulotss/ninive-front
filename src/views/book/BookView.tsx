import {
  bookGetOne,
  bookUpdate,
  IBook,
  IBookCreate,
  IBookUpdate,
} from '@/services/bookService'
import { DatePicker, Input, Select, Spinner, Button } from '@/components/ui'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Tabs from '@/components/ui/Tabs'
import { Formik, Field, Form, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { IPublisher, publisherGetAll } from '@/services/publisherService'
import { BsFileArrowDownFill, BsFileArrowUpFill } from 'react-icons/bs'
import TableCompactBookstore from '@/components/custom/TableCompactBookstore'
import { getBookstoreAmount, getLoanAmount } from '@/utils/amount'
import TableCompactLoan from '@/components/custom/TableCompactLoan'
import NewBookstore from '@/components/custom/NewBookstore'
import {
  bookstoreCreate,
  bookstoreUpdate,
  IBookstoreCreate,
} from '@/services/bookstoreService'
import { ILoanCreate, loanCreate, loanUpdate } from '@/services/loanService'
import { expenseCreate, IExpenseCreate } from '@/services/expenseService'
import NewLoan from '@/components/custom/NewLoan'
import { IIncomingCreate, incomingCreate } from '@/services/incomingService'
import NewAquisition from '@/components/custom/NewAquisition'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Obrigatório'),
  isbn: Yup.string()
    .min(13, 'ISBN deve conter 13 caracteres')
    .max(13, 'ISBN deve conter 13 caracteres')
    .required('Obrigatório'),
  author: Yup.string().required('Obrigatório'),
  description: Yup.string().required('Obrigatório'),
  publishierId: Yup.string().required('Obrigatório'),
  publicationDate: Yup.string().required('Obrigatório'),
  pages: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
  edition: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
  coverPrice: Yup.string()
    .required()
    .matches(/^(((\d+)(\.\d{3})*(,\d{2}))|(\d*))$/, 'Formato: 0,00'),
})

const { TabNav, TabList, TabContent } = Tabs

const BookView = () => {
  const [book, setBook] = useState<IBook>()
  const [publishers, setPublishers] = useState<IPublisher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setEditing] = useState<boolean>(false)
  const { id } = useParams()

  const handleSubmit = async (values: IBookUpdate) => {
    setIsLoading(true)
    try {
      const { data } = await bookUpdate(Number(id), {
        ...values,
        pages: Number(values.pages),
        edition: Number(values.edition),
        publishierId: Number(values.publishierId),
        coverPrice: values.coverPrice.toString().replace(',', '.'),
      })
      setBook(data)
      setEditing(false)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  async function handleSubmitBookstore(values: IBookstoreCreate) {
    try {
      await bookstoreCreate({
        ...values,
        storeId: Number(values.storeId),
        amount: Number(values.amount),
        discount: values.discount.toString().replace(',', '.'),
        tax: values.tax.toString().replace(',', '.'),
      })
      await bookUpdate(Number(id), {
        amount: book.amount + Number(values.amount),
      })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSubmitLoan(values: ILoanCreate) {
    try {
      await loanCreate({
        ...values,
        discount: values.discount.toString().replace(',', '.'),
        branchId: Number(values.branchId),
        amount: Number(values.amount),
      })
      await bookUpdate(Number(id), {
        amount: book.amount - Number(values.amount),
      })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSubmitExpense(
    bookstoreId: number,
    newBookAmount: number,
    values: IExpenseCreate,
  ) {
    try {
      await expenseCreate(values)
      await bookstoreUpdate(bookstoreId, {
        closed: true,
        closedDate: new Date(),
      })
      await bookUpdate(Number(id), { amount: book.amount - newBookAmount })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSubmitIncoming(
    loanId: number,
    returningAmount: number,
    newIncoming: IIncomingCreate,
  ) {
    try {
      await loanUpdate(loanId, {
        closed: true,
        closedDate: new Date(),
        salesAmount: newIncoming.amount,
      })
      await incomingCreate(newIncoming)
      await bookUpdate(Number(id), {
        amount: book.amount + returningAmount,
      })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSubmitAquisition(values: IExpenseCreate) {
    try {
      await expenseCreate({ ...values, totalValue: Number(values.totalValue) })
      await bookUpdate(Number(id), { amount: book.amount + values.amount })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
  }

  function getLoansFilter(isClosed: boolean) {
    if (!book?.loans) return null
    return book?.loans.filter((s) => s.closed === isClosed)
  }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const respBook = await bookGetOne(Number(id))
        const respPublishers = await publisherGetAll()
        setBook(respBook.data)
        setPublishers(respPublishers.data)
      } catch (e) {
        console.log(e)
      }
      setIsLoading(false)
    }
    getData()
  }, [id])

  return (
    <>
      {!isLoading ? (
        <>
          <h1>{book?.title}</h1>
          <h6 className="mb-5">ISBN: {book?.isbn}</h6>
          <div className="flex justify-between items-center mb-5">
            <div className="p-2 border-2 border-dotted rounded-md w-full flex">
              <div className="text-center p-3 bg-gray-100 mr-3">
                <p>Estoque</p>
                <p className="font-bold text-4xl">{book?.amount}</p>
              </div>
              <div className="text-center p-3 bg-gray-100 mr-3">
                <p>Consignados</p>
                <p className="font-bold text-green-500 text-4xl">
                  {book && getBookstoreAmount(book?.stores)}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-100 mr-3">
                <p>Em vendas</p>
                <p className="font-bold text-red-500 text-4xl">
                  {book && getLoanAmount(getLoansFilter(false))}
                </p>
              </div>
            </div>
            <div className="ml-3">
              <NewBookstore
                bookId={Number(id)}
                coverPrice={Number(book?.coverPrice)}
                handleSubmitBookstore={handleSubmitBookstore}
              />
              <br />
              <NewLoan
                bookId={book?.id}
                coverPrice={book?.coverPrice}
                maxAmount={book?.amount}
                handleSubmitLoan={handleSubmitLoan}
              />
              <br />
              <NewAquisition
                bookId={Number(id)}
                handleSubmitAquisition={handleSubmitAquisition}
              />
            </div>
          </div>
          <Tabs defaultValue="tab1" className="mb-5">
            <TabList>
              <TabNav value="tab1" icon={<BsFileArrowDownFill />}>
                Consignações
              </TabNav>
              <TabNav value="tab2" icon={<BsFileArrowUpFill />}>
                Em vendas
              </TabNav>
            </TabList>
            <TabContent value="tab1">
              {book?.stores?.length > 0 ? (
                <TableCompactBookstore
                  book={book}
                  handleSubmitLoan={handleSubmitLoan}
                  handleSubmitExpense={handleSubmitExpense}
                />
              ) : (
                <p className="p-3 italic text-center">Nada por aqui.</p>
              )}
            </TabContent>
            <TabContent value="tab2">
              {getLoansFilter(false)?.length > 0 ? (
                <TableCompactLoan
                  loans={getLoansFilter(false)}
                  bookTitle={book?.title}
                  coverPrice={book?.coverPrice}
                  handleSubmitIncoming={handleSubmitIncoming}
                />
              ) : (
                <p className="p-3 italic text-center">Nada por aqui.</p>
              )}
            </TabContent>
          </Tabs>
          <Formik
            initialValues={{
              title: book?.title,
              isbn: book?.isbn,
              author: book?.author,
              description: book?.description,
              publishierId: book?.publishierId,
              publicationDate: new Date(book?.publicationDate),
              pages: book?.pages,
              edition: book?.edition,
              coverPrice: book?.coverPrice.toString().replace('.', ','),
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Título"
                    invalid={touched.title && errors.title ? true : false}
                    errorMessage={errors.title?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="title"
                      placeholder="Título"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="ISBN"
                    invalid={errors.isbn && touched.isbn ? true : false}
                    errorMessage={errors.isbn?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="isbn"
                      placeholder="ISBN"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="Autor"
                    invalid={errors.author && touched.author ? true : false}
                    errorMessage={errors.author?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="author"
                      placeholder="Autor"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="Descrição"
                    invalid={
                      errors.description && touched.description ? true : false
                    }
                    errorMessage={errors.description?.toString()}
                  >
                    <Field
                      autoComplete="off"
                      name="description"
                      placeholder="Descrição"
                      component={Input}
                      textArea={true}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="Editora"
                    invalid={
                      errors.publishierId && touched.publishierId ? true : false
                    }
                    errorMessage={errors.publishierId?.toString()}
                  >
                    <Field name="publishierId">
                      {({ field, form }: FieldProps<IBookCreate>) => (
                        <Select
                          field={field}
                          isDisabled={!isEditing}
                          form={form}
                          options={publishers.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))}
                          value={publishers
                            .filter(
                              (option) => option.id === values.publishierId,
                            )
                            .map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label="Data de publicação"
                    invalid={
                      errors.publicationDate && touched.publicationDate
                        ? true
                        : false
                    }
                    errorMessage={String(errors.publicationDate)}
                  >
                    <Field
                      name="publicationDate"
                      placeholder="Data de publicação"
                    >
                      {({ field, form }: FieldProps<IBookCreate>) => (
                        <DatePicker
                          field={field}
                          disabled={!isEditing}
                          form={form}
                          value={values.publicationDate}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label="Páginas"
                    invalid={errors.pages && touched.pages ? true : false}
                    errorMessage={errors.pages?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="pages"
                      placeholder="Páginas"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="Edição"
                    invalid={errors.edition && touched.edition ? true : false}
                    errorMessage={errors.edition?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="edition"
                      placeholder="Edição"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem
                    label="Preço de capa"
                    invalid={
                      errors.coverPrice && touched.coverPrice ? true : false
                    }
                    errorMessage={errors.coverPrice?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="coverPrice"
                      placeholder="00,00"
                      component={Input}
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem>
                    {isEditing ? (
                      <Button type="submit" variant="solid" className="w-48">
                        Salvar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="twoTone"
                        className="w-48"
                        onClick={(e) => {
                          e.preventDefault()
                          setEditing(true)
                        }}
                      >
                        Editar
                      </Button>
                    )}
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BookView
