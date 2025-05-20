import { useState } from 'react'
import {
  Button,
  DatePicker,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Select,
  Spinner,
} from '../ui'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { IStore, storeGetAll } from '@/services/storeService'
import { BsFileArrowDownFill } from 'react-icons/bs'
import { IBookstoreCreate } from '@/services/bookstoreService'
import { discountPrice } from '@/utils/amount'

interface IProps {
  bookId: number
  coverPrice: number
  handleSubmitBookstore(values: IBookstoreCreate): void
}

const validationSchema = Yup.object().shape({
  storeId: Yup.string().required('Obrigatório'),
  returnDate: Yup.date().required('Obrigatório'),
  discount: Yup.string().required('Obrigatório'),
  tax: Yup.string().required('Obrigatório'),
  amount: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/, 'Somente números'),
})

const NewBookstore = ({
  bookId,
  coverPrice,
  handleSubmitBookstore,
}: IProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stores, setStores] = useState<IStore[]>([])

  async function handleOpenDialog() {
    setIsLoading(true)
    setDialogIsOpen(true)
    try {
      const { data } = await storeGetAll()
      setStores(data)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  async function handleDialogOk(values: IBookstoreCreate) {
    handleSubmitBookstore(values)
    setDialogIsOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        icon={<BsFileArrowDownFill />}
        color="green-500"
        variant="solid"
        onClick={handleOpenDialog}
      >
        Consignar
      </Button>

      <Dialog
        isOpen={dialogIsOpen}
        onClose={() => {
          setDialogIsOpen(false)
        }}
        onRequestClose={() => {
          setDialogIsOpen(false)
        }}
      >
        <h4 className="mb-5">Consignação</h4>
        {!isLoading ? (
          <div className="max-h-96 overflow-y-auto">
            <Formik
              initialValues={{
                bookId,
                storeId: '',
                tax: '',
                returnDate: new Date(),
                amount: '',
                discount: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleDialogOk}
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
                          />
                        </FormItem>
                      </div>
                      <div className="p-5 text-right w-full">
                        <p className="mb-5">
                          Preço de capa:{' '}
                          <span className="text-blue-600 font-bold text-lg">
                            {coverPrice.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </p>
                        <p>
                          Preço final:{' '}
                          <span className="text-green-600 font-bold text-lg">
                            {discountPrice(
                              coverPrice,
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
                            value={values.returnDate}
                            onChange={(date) => {
                              form.setFieldValue(field.name, date)
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem
                      label="Quantidade"
                      invalid={errors.amount && touched.amount ? true : false}
                      errorMessage={errors.amount?.toString()}
                    >
                      <Field
                        type="text"
                        autoComplete="off"
                        name="amount"
                        placeholder="Quantidade"
                        component={Input}
                      />
                    </FormItem>
                    <FormItem>
                      <Button type="submit" variant="solid">
                        Salvar
                      </Button>
                    </FormItem>
                  </FormContainer>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <Spinner />
        )}
      </Dialog>
    </>
  )
}

export default NewBookstore
