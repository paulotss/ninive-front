import {
  bookGetOne,
  bookUpdate,
  IBook,
  IBookCreate,
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
import {
  getBookstoreAmount,
  getLoanAmount,
  getTotalAmount,
} from '@/utils/amount'
import TableCompactLoan from '@/components/custom/TableCompactLoan'
import NewBookstore from '@/components/custom/NewBookstore'
import { bookstoreCreate, IBookstoreCreate } from '@/services/bookstoreService'
import { ILoanCreate, loanCreate } from '@/services/loanService'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Obrigatório'),
  isbn: Yup.string()
    .min(13, 'ISBN deve conter 13 caracteres')
    .max(13, 'ISBN deve conter 13 caracteres')
    .required('Obrigatório'),
  description: Yup.string().required('Obrigatório'),
  publishierId: Yup.string().required('Obrigatório'),
  publicationDate: Yup.string().required('Obrigatório'),
  pages: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
  edition: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
})

const { TabNav, TabList, TabContent } = Tabs

const BookView = () => {
  const [book, setBook] = useState<IBook>()
  const [publishers, setPublishers] = useState<IPublisher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setEditing] = useState<boolean>(false)
  const { id } = useParams()

  const handleSubmit = async (values: IBookCreate) => {
    setIsLoading(true)
    try {
      const { data } = await bookUpdate(Number(id), {
        ...values,
        pages: Number(values.pages),
        edition: Number(values.edition),
        publishierId: Number(values.publishierId),
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
        profitMargin: Number(values.profitMargin),
        branchId: Number(values.branchId),
        amount: Number(values.amount),
      })
      const { data } = await bookGetOne(Number(id))
      setBook(data)
    } catch (e) {
      console.log(e)
    }
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
          <Formik
            initialValues={{
              title: book?.title,
              isbn: book?.isbn,
              description: book?.description,
              publishierId: book?.publishierId,
              publicationDate: new Date(book?.publicationDate),
              pages: book?.pages,
              edition: book?.edition,
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
          <div className="flex">
            <div className="p-2 mb-5 border-2 border-dotted rounded-md">
              <p>
                Estoque:{' '}
                <span className="font-bold">
                  {book && getTotalAmount(book.stores)}
                </span>
              </p>
              <p>
                Consignados:{' '}
                <span className="font-bold text-green-500">
                  {book && getBookstoreAmount(book.stores)}
                </span>
              </p>
              <p>
                Consignados NA:{' '}
                <span className="font-bold text-red-500">
                  {book && getLoanAmount(book.stores)}
                </span>
              </p>
            </div>
            <div className="p-3">
              <NewBookstore
                bookId={Number(id)}
                handleSubmitBookstore={handleSubmitBookstore}
              />
            </div>
          </div>
          <Tabs defaultValue="tab1">
            <TabList>
              <TabNav value="tab1" icon={<BsFileArrowUpFill />}>
                Consignados NA
              </TabNav>
              <TabNav value="tab2" icon={<BsFileArrowDownFill />}>
                Consignados
              </TabNav>
            </TabList>
            <TabContent value="tab1">
              <TableCompactLoan loans={book?.stores.flatMap((s) => s.loans)} />
            </TabContent>
            <TabContent value="tab2">
              <TableCompactBookstore
                bookstores={book?.stores}
                handleSubmitLoan={handleSubmitLoan}
              />
            </TabContent>
          </Tabs>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BookView
