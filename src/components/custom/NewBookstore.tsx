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

interface IProps {
  bookId: number
  handleSubmitBookstore(values: IBookstoreCreate): void
}

const validationSchema = Yup.object().shape({
  storeId: Yup.string().required('Obrigatório'),
  returnDate: Yup.date().required('Obrigatório'),
  amount: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/, 'Somente números'),
})

const NewBookstore = ({ bookId, handleSubmitBookstore }: IProps) => {
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
        {!isLoading ? (
          <Formik
            initialValues={{
              bookId,
              storeId: '',
              tax: 0,
              coverPrice: '',
              returnDate: new Date(),
              amount: '',
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
                  <FormItem
                    label="Preço de capa"
                    invalid={
                      touched.coverPrice && errors.coverPrice ? true : false
                    }
                    errorMessage={errors.coverPrice?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="coverPrice"
                      placeholder="0,00"
                      component={Input}
                    />
                  </FormItem>
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
        ) : (
          <Spinner />
        )}
      </Dialog>
    </>
  )
}

export default NewBookstore
