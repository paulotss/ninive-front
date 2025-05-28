import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  bookstoreGetOne,
  bookstoreRemove,
  bookstoreUpdate,
  IBookstore,
  IBookstoreUpdate,
} from '../../services/bookstoreService'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import {
  FormContainer,
  FormItem,
  Button,
  DatePicker,
  Input,
  Select,
  Spinner,
  Dialog,
} from '../../components/ui'
import { IStore, storeGetAll } from '../../services/storeService'
import { discountPrice } from '../../utils/amount'
import BackButton from '../../components/custom/BackButton'

const validationSchema = Yup.object().shape({
  storeId: Yup.string().required('Obrigatório'),
  returnDate: Yup.date().required('Obrigatório'),
  discount: Yup.string().required('Obrigatório'),
  tax: Yup.string().required('Obrigatório'),
})

const BookstoreView = () => {
  const [bookStore, setBookStore] = useState<IBookstore>()
  const [stores, setStores] = useState<IStore[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [removeAlertIsOpen, setRemoveAlertIsOpen] = useState<boolean>(false)
  const { id } = useParams()
  const navigate = useNavigate()

  async function handleSubmit(values: IBookstoreUpdate) {
    setIsLoading(true)
    try {
      await bookstoreUpdate(Number(id), values)
      const { data } = await bookstoreGetOne(Number(id))
      setBookStore(data)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  async function submitRemove() {
    try {
      await bookstoreRemove(Number(id))
      navigate(-1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getBookStore() {
      setIsLoading(true)
      try {
        const { data } = await bookstoreGetOne(Number(id))
        setBookStore(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    async function getStores() {
      setIsLoading(true)
      try {
        const { data } = await storeGetAll()
        setStores(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getBookStore()
    getStores()
  }, [id])

  return (
    <>
      {bookStore && !isLoading ? (
        <>
          <BackButton />
          <h2 className="mb-3">Consignação</h2>
          <h4>{bookStore.book.title}</h4>
          <p className="mb-3">ISBN: {bookStore.book.isbn}</p>
          <p className="mb-5">
            <span className="font-bold">Quantidade:</span>{' '}
            <span className="font-bold text-lg">{bookStore.amount}</span>
          </p>
          <Formik
            initialValues={{
              storeId: bookStore.storeId,
              returnDate: bookStore.returnDate,
              discount: bookStore.discount,
              tax: bookStore.tax,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Loja"
                    invalid={errors.storeId && touched.storeId ? true : false}
                    errorMessage={errors.storeId?.toString()}
                  >
                    <Field name="storeId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          form={form}
                          placeholder="Selecione"
                          options={stores.map((s) => ({
                            value: s.id,
                            label: s.name,
                          }))}
                          value={stores
                            .filter((option) => option.id === values.storeId)
                            .map((s) => ({
                              value: s.id,
                              label: s.name,
                            }))}
                          isDisabled={!isEditing}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>
                  <div className="flex">
                    <div>
                      <FormItem
                        label="Desconto %"
                        invalid={
                          touched.discount && errors.discount ? true : false
                        }
                        errorMessage={errors.discount?.toString()}
                      >
                        <Field
                          type="text"
                          autoComplete="off"
                          name="discount"
                          placeholder="%"
                          component={Input}
                          disabled={!isEditing}
                        />
                      </FormItem>
                      <FormItem
                        label="Frete %"
                        invalid={touched.tax && errors.tax ? true : false}
                        errorMessage={errors.tax?.toString()}
                      >
                        <Field
                          type="text"
                          autoComplete="off"
                          name="tax"
                          placeholder="%"
                          component={Input}
                          disabled={!isEditing}
                        />
                      </FormItem>
                    </div>
                    <div className="p-5 text-right w-full">
                      <p className="mb-5">
                        Preço de capa:{' '}
                        <span className="text-blue-600 font-bold text-lg">
                          {Number(bookStore?.book.coverPrice).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          )}
                        </span>
                      </p>
                      <p>
                        Preço final:{' '}
                        <span className="text-green-600 font-bold text-lg">
                          {discountPrice(
                            Number(bookStore?.book.coverPrice),
                            Number(values.tax),
                            Number(values.discount),
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <FormItem
                    label="Devolução"
                    invalid={
                      errors.returnDate && touched.returnDate ? true : false
                    }
                    errorMessage={String(errors.returnDate)}
                  >
                    <Field name="returnDate" placeholder="Devolução">
                      {({ field, form }: FieldProps) => (
                        <DatePicker
                          field={field}
                          form={form}
                          value={new Date(values.returnDate)}
                          disabled={!isEditing}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <div className="flex justify-between">
                    <FormItem>
                      {isEditing ? (
                        <Button type="submit" variant="solid">
                          Salvar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="twoTone"
                          onClick={(e) => {
                            e.preventDefault()
                            setIsEditing(true)
                          }}
                        >
                          Editar
                        </Button>
                      )}
                    </FormItem>
                    <FormItem>
                      <Button
                        type="button"
                        variant="solid"
                        color="red-600"
                        onClick={(e) => {
                          e.preventDefault()
                          setRemoveAlertIsOpen(true)
                        }}
                      >
                        Excluir
                      </Button>
                    </FormItem>
                  </div>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <Spinner />
      )}
      <Dialog
        isOpen={removeAlertIsOpen}
        onClose={() => setRemoveAlertIsOpen(false)}
      >
        <h5 className="mb-4">Atenção!</h5>
        <p>
          A remoção desta consignação não irá alterar o estoque, o que pode
          levar a inconsistências no sistema. Deseja realmente remover este
          consignação?
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={() => setRemoveAlertIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button variant="solid" onClick={submitRemove}>
            Confirmar
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default BookstoreView
