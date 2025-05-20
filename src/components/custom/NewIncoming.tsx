import { useState } from 'react'
import { Button, Dialog, FormContainer, FormItem, Input } from '../ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { IIncomingCreate } from '@/services/incomingService'

interface IProps {
  bookId: number
  branchId: number
  branchName: string
  bookTitle: string
  amount: number
  salePrice: number
  loanId: number
  handleSubmitIncoming(
    loanId: number,
    returningAmount: number,
    newIncoming: IIncomingCreate,
  ): void
}

const NewIncoming = ({
  bookId,
  branchId,
  branchName,
  bookTitle,
  amount,
  salePrice,
  loanId,
  handleSubmitIncoming,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  async function handleSubmit(values: { salesAmount: number }) {
    const newIncoming: IIncomingCreate = {
      bookId,
      branchId,
      amount: amount - Number(values.salesAmount),
      totalValue: (amount - Number(values.salesAmount)) * salePrice,
    }
    handleSubmitIncoming(loanId, Number(values.salesAmount), newIncoming)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        Devolver
      </Button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
        }}
      >
        <h3>Devolução | {bookTitle}</h3>
        <div className="mt-5 mb-5">
          <p className="mb-2">
            Loja: <span className="font-bold">{branchName}</span>
          </p>
          <p className="mb-3">
            Quantidade consignada: <span className="font-bold">{amount}</span>
          </p>
          <Formik
            initialValues={{
              salesAmount: 0,
            }}
            validationSchema={Yup.object().shape({
              salesAmount: Yup.number()
                .max(amount, `Máximo: ${amount}`)
                .min(0, 'Mínimo: 0')
                .required('Obrigatório')
                .typeError('Somente números'),
            })}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, values }) => (
              <Form>
                <FormContainer>
                  <div className="flex">
                    <FormItem
                      label="Informe a quantidade para devolução:"
                      invalid={
                        touched.salesAmount && errors.salesAmount ? true : false
                      }
                      errorMessage={errors.salesAmount?.toString()}
                    >
                      <Field
                        type="text"
                        autoComplete="off"
                        name="salesAmount"
                        placeholder="Quantidade"
                        component={Input}
                      />
                    </FormItem>
                    <div className="p-5">
                      <p>
                        Vendidos:{' '}
                        <span className="font-bold">
                          {amount - Number(values.salesAmount)}
                        </span>
                      </p>
                      <p>
                        Receita:{' '}
                        <span className="text-green-600 font-bold text-lg">
                          {(
                            salePrice *
                            (amount - Number(values.salesAmount))
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <FormItem>
                    <Button
                      type="submit"
                      variant="solid"
                      color="green-500"
                      className="mr-2"
                    >
                      Confirmar
                    </Button>
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </>
  )
}

export default NewIncoming
