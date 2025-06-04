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
import { BsFileArrowUpFill } from 'react-icons/bs'
import { ILoanCreate } from '../../services/loanService'
import { IBranch, branchGetAll } from '../../services/branchService'
import { salePrice } from '../../utils/amount'

interface IProps {
  bookId: number
  coverPrice: number | string
  maxAmount: number
  handleSubmitLoan(values: ILoanCreate): void
}

const NewLoan = ({
  bookId,
  coverPrice,
  maxAmount,
  handleSubmitLoan,
}: IProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [branchs, setBranchs] = useState<IBranch[]>([])

  async function handleOpenDialog() {
    setIsLoading(true)
    setDialogIsOpen(true)
    try {
      const { data } = await branchGetAll()
      setBranchs(data)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  async function handleDialogOk(values: ILoanCreate) {
    handleSubmitLoan(values)
    setDialogIsOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        className="mt-1 w-32"
        icon={<BsFileArrowUpFill />}
        color="red-500"
        variant="solid"
        disabled={!(maxAmount > 0)}
        onClick={handleOpenDialog}
      >
        {' '}
        Emprestar{' '}
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
              branchId: '',
              returnDate: new Date(),
              amount: '',
              discount: '',
              salesAmount: 0,
            }}
            validationSchema={Yup.object().shape({
              branchId: Yup.string().required('Obrigatório'),
              returnDate: Yup.date().required('Obrigatório'),
              amount: Yup.number()
                .max(maxAmount, `Máximo: ${maxAmount}`)
                .min(1, 'Mínimo: 1')
                .required('Obrigatório'),
              discount: Yup.string()
                .required()
                .matches(
                  /^(((\d+)(\.\d{3})*(,\d{2}))|(\d*))$/,
                  'Formato: 0,00',
                ),
            })}
            onSubmit={handleDialogOk}
          >
            {({ values, touched, errors }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Local"
                    invalid={errors.branchId && touched.branchId ? true : false}
                    errorMessage={errors.branchId?.toString()}
                  >
                    <Field name="branchId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          form={form}
                          placeholder="Local"
                          options={branchs.map((b) => ({
                            value: b.id,
                            label: b.name,
                          }))}
                          value={branchs
                            .filter((option) => option.id === values.branchId)
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
                    label={`Quantidade (disponpivel: ${maxAmount})`}
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
                  <div className="flex">
                    <FormItem
                      label="Desconto(%)"
                      invalid={
                        errors.discount && touched.discount ? true : false
                      }
                      errorMessage={errors.discount?.toString()}
                    >
                      <Field
                        type="text"
                        autoComplete="off"
                        name="discount"
                        component={Input}
                      />
                    </FormItem>
                    <div className="p-5 text-right w-full">
                      <p>
                        Preço de capa:{' '}
                        <span className="text-blue-600 font-bold text-lg">
                          {Number(coverPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                      <p>
                        Preço de venda:{' '}
                        <span className="text-green-600 font-bold text-lg">
                          {salePrice(
                            Number(coverPrice),
                            Number(
                              values.discount.toString().replace(',', '.'),
                            ),
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
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

export default NewLoan
