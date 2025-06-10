import { useState } from 'react'
import { Button, Dialog, FormContainer, FormItem, Input } from '../ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

interface IProps {
  handleApplyDiscountButton(discount: number): void
}

interface IValuesForm {
  discount: string
}

const DiscountButton = ({ handleApplyDiscountButton }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function handleSubmit(values: IValuesForm) {
    const newDiscount = values.discount.replace(',', '.')
    handleApplyDiscountButton(Number(newDiscount))
    setIsOpen(false)
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Desconto
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Formik
          initialValues={{ discount: '' }}
          validationSchema={Yup.object().shape({
            discount: Yup.string()
              .required('Obrigatório')
              .matches(/^(((\d+)(\.\d{3})*(,\d{2}))|(\d*))$/, 'Format: 00,00'),
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Desconto"
                  invalid={touched.discount && errors.discount ? true : false}
                  errorMessage={errors.discount?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="discount"
                    placeholder="%"
                    component={Input}
                  ></Field>
                </FormItem>
                <FormItem>
                  <Button type="submit" variant="solid" color="emerald-500">
                    Confirmar
                  </Button>
                  <Button
                    type="button"
                    className="ml-2"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsOpen(false)
                    }}
                  >
                    Cancelar
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}

export default DiscountButton
