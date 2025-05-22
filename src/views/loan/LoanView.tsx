import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, FieldProps } from 'formik'
import {
  FormContainer,
  FormItem,
  Select,
  DatePicker,
  Button,
  Input,
  Dialog,
  Spinner,
} from '@/components/ui'
import * as Yup from 'yup'
import {
  ILoan,
  ILoanUpdate,
  loanGetOne,
  loanRemove,
  loanUpdate,
} from '@/services/loanService'
import { branchGetAll, IBranch } from '@/services/branchService'
import { salePrice } from '@/utils/amount'
import BackButton from '@/components/custom/BackButton'

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required('Obrigatório'),
  returnDate: Yup.date().required('Obrigatório'),
  discount: Yup.number()
    .max(100, 'Máximo: 100')
    .min(1, 'Mínimo: 1')
    .required('Obrigatório'),
})

const LoanView = () => {
  const [loan, setLoan] = useState<ILoan>()
  const [branchs, setBranchs] = useState<IBranch[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [removeAlertIsOpen, setRemoveAlertIsOpen] = useState<boolean>(false)
  const { id } = useParams()
  const navigate = useNavigate()

  async function handleSubmit(values: ILoanUpdate) {
    try {
      await loanUpdate(Number(id), values)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function submitRemove() {
    try {
      await loanRemove(Number(id))
      navigate(-1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getLoan() {
      setIsLoading(true)
      try {
        const { data } = await loanGetOne(Number(id))
        setLoan(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    async function getBranchs() {
      setIsLoading(true)
      try {
        const { data } = await branchGetAll()
        setBranchs(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getLoan()
    getBranchs()
  }, [id])

  return (
    <>
      {loan && !isLoading ? (
        <>
          <BackButton />
          <h2 className="mb-3">Empréstimo</h2>
          <h4>{loan.book.title}</h4>
          <p className="mb-3">ISBN: {loan.book.isbn}</p>
          <Formik
            initialValues={{
              branchId: loan.branchId,
              returnDate: new Date(loan.returnDate),
              discount: loan.discount,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                          isDisabled={!isEditing}
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
                          disabled={!isEditing}
                          onChange={(date) => {
                            form.setFieldValue(field.name, date)
                          }}
                        />
                      )}
                    </Field>
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
                        type="number"
                        autoComplete="off"
                        name="discount"
                        component={Input}
                        disabled={!isEditing}
                      />
                    </FormItem>
                    <div className="p-5 text-right w-full">
                      <p>
                        Preço de capa:{' '}
                        <span className="text-blue-600 font-bold text-lg">
                          {Number(loan.book.coverPrice).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          )}
                        </span>
                      </p>
                      <p>
                        Preço de venda:{' '}
                        <span className="text-green-600 font-bold text-lg">
                          {salePrice(
                            Number(loan.book.coverPrice),
                            Number(values.discount),
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
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
          A remoção deste empréstimo não irá alterar o estoque, o que pode levar
          a inconsistências no sistema. Deseja realmente remover este
          empréstimo?
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

export default LoanView
