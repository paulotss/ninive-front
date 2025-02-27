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
import { ILoanCreate } from '@/services/loanService'
import { IBranch, branchGetAll } from '@/services/branchService'

interface IProps {
  bookstoreId: number
  maxAmount: number
  handleSubmitLoan(values: ILoanCreate): void
}

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required('Obrigatório'),
  profitMargin: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/, 'Somente números'),
  returnDate: Yup.date().required('Obrigatório'),
})

const NewLoan = ({ bookstoreId, maxAmount, handleSubmitLoan }: IProps) => {
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
        icon={<BsFileArrowUpFill />}
        color="red-500"
        variant="solid"
        onClick={handleOpenDialog}
      />

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
              bookstoreId,
              branchId: '',
              profitMargin: '',
              returnDate: new Date(),
              amount: '',
            }}
            validationSchema={{
              ...validationSchema,
              amount: Yup.number()
                .max(maxAmount)
                .min(1)
                .required('Obrigatório'),
            }}
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
                    label="Margem de lucro"
                    invalid={
                      touched.profitMargin && errors.profitMargin ? true : false
                    }
                    errorMessage={errors.profitMargin?.toString()}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="profitMargin"
                      placeholder="0"
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
