import { useState } from 'react'
import {
  Button,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Select,
  Spinner,
} from '../ui'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { BsFileArrowDownFill } from 'react-icons/bs'
import { storeGetAll, IStore } from '../../services/storeService'
import { IExpenseCreate } from '../../services/expenseService'

interface IProps {
  bookId: number
  handleSubmitAquisition(values: IExpenseCreate): void
}

const NewAquisition = ({ bookId, handleSubmitAquisition }: IProps) => {
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

  async function handleDialogOk(values: IExpenseCreate) {
    handleSubmitAquisition(values)
    setDialogIsOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        className="mt-1 w-32"
        icon={<BsFileArrowDownFill />}
        color="blue-500"
        variant="solid"
        onClick={handleOpenDialog}
      >
        {' '}
        Comprar{' '}
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
              amount: 0,
              totalValue: '',
            }}
            validationSchema={Yup.object().shape({
              storeId: Yup.string().required('Obrigatório'),
              amount: Yup.number().min(1, 'Mínimo: 1').required('Obrigatório'),
              totalValue: Yup.string()
                .required()
                .matches(
                  /^(((\d+)(\.\d{3})*(,\d{2}))|(\d*))$/,
                  'Somento números',
                )
                .required('Obrigatório'),
            })}
            onSubmit={handleDialogOk}
          >
            {({ values, touched, errors }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Fornecedor"
                    invalid={errors.storeId && touched.storeId ? true : false}
                    errorMessage={errors.storeId?.toString()}
                  >
                    <Field name="storeId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          form={form}
                          placeholder="Fornecedor"
                          options={stores.map((b) => ({
                            value: b.id,
                            label: b.name,
                          }))}
                          value={stores
                            .filter((option) => option.id === values.storeId)
                            .map((b) => ({
                              value: b.id,
                              label: b.name,
                            }))}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
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
                      type="number"
                      autoComplete="off"
                      name="amount"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Valor total"
                    invalid={
                      errors.totalValue && touched.totalValue ? true : false
                    }
                    errorMessage={errors.totalValue?.toString()}
                  >
                    <Field
                      type="text"
                      placeholder="R$"
                      autoComplete="off"
                      name="totalValue"
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

export default NewAquisition
