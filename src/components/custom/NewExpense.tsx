import { useState } from 'react'
import { Button, Dialog, FormContainer, FormItem, Input } from '../ui'
import { IExpenseCreate } from '../../services/expenseService'
import { discountPrice } from '../../utils/amount'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { IBookstore } from '../../services/bookstoreService'

interface IProps {
  bookstore: IBookstore
  coverPrice: number | string
  handleSubmitExpense(
    bookstoreId: number,
    newBookAmount: number,
    values: IExpenseCreate,
  ): void
}

const NewExpense = ({ bookstore, coverPrice, handleSubmitExpense }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  async function handleSubmit(values: {
    amount: number
    discount: number
    tax: number
  }) {
    const newExpense: IExpenseCreate = {
      bookId: bookstore.bookId,
      storeId: bookstore.storeId,
      amount: values.amount,
      totalValue:
        discountPrice(Number(coverPrice), values.tax, values.discount) *
        values.amount,
    }
    const newBookAmount = bookstore.amount - values.amount
    handleSubmitExpense(bookstore.id, newBookAmount, newExpense)
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
        Faturar
      </Button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
        }}
      >
        <h3>Faturar | {bookstore.book.title}</h3>
        <div className="mt-5 mb-5">
          <p className="mb-3">
            Editora: <span className="font-bold">{bookstore.store.name}</span>
          </p>
          <Formik
            initialValues={{
              amount: 0,
              discount: 0,
              tax: 0,
            }}
            validationSchema={Yup.object().shape({
              amount: Yup.number()
                .min(0, 'Mínimo: 0')
                .max(bookstore.amount, 'Quantidade superior ao estoque')
                .required('Obrigatório')
                .typeError('Valor inválido'),
              discount: Yup.number()
                .min(0, 'Mínimo: 0')
                .max(100, 'Máximo: 100')
                .required('Obrigatório')
                .typeError('Valor inválido'),
              tax: Yup.number()
                .min(0, 'Mínimo: 0')
                .max(100, 'Máximo: 100')
                .required('Obrigatório')
                .typeError('Valor inválido'),
            })}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors }) => (
              <Form>
                <FormContainer>
                  <div className="flex">
                    <div className="w-2/3">
                      <FormItem
                        label="Quantidade"
                        invalid={touched.amount && errors.amount ? true : false}
                        errorMessage={errors.amount?.toString()}
                      >
                        <Field
                          type="number"
                          autoComplete="off"
                          name="amount"
                          placeholder="Quantidade"
                          component={Input}
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Desconto (%)"
                        invalid={
                          touched.discount && errors.discount ? true : false
                        }
                        errorMessage={errors.discount?.toString()}
                      >
                        <Field
                          type="number"
                          autoComplete="off"
                          name="discount"
                          placeholder="Desconto"
                          component={Input}
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Taxa (%)"
                        invalid={touched.tax && errors.tax ? true : false}
                        errorMessage={errors.tax?.toString()}
                      >
                        <Field
                          type="number"
                          autoComplete="off"
                          name="tax"
                          placeholder="Taxa"
                          component={Input}
                        ></Field>
                      </FormItem>
                    </div>
                    <div className="w-1/3">
                      <p className="text-right mb-3">
                        Preço de capa
                        <br />
                        <span className="text-blue-600 font-bold text-xl">
                          {Number(coverPrice).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                      <p className="text-right mb-3">
                        Valor total
                        <br />
                        <span className="text-red-600 font-bold text-xl">
                          {(
                            discountPrice(
                              Number(coverPrice),
                              values.tax,
                              values.discount,
                            ) * values.amount
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </p>
                      <p className="text-right">
                        Devolução
                        <br />
                        <span className="text-red-400 font-bold text-xl">
                          {bookstore.amount - values.amount} und.
                        </span>
                      </p>
                    </div>
                  </div>
                  <FormItem>
                    <Button
                      type="submit"
                      variant="solid"
                      color="red-500"
                      className="mr-2"
                      disabled={bookstore.amount - values.amount < 0}
                    >
                      Faturar
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

export default NewExpense
