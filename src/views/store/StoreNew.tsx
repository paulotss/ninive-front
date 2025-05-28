import BackButton from '@/components/custom/BackButton'
import { Button, FormContainer, FormItem } from '@/components/ui'
import Input from '@/components/ui/Input'
import { IStoreCreate, storeCreate } from '@/services/storeService'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const StoreNew = () => {
  const navigate = useNavigate()

  async function handleSubmit(values: IStoreCreate) {
    try {
      await storeCreate(values)
      navigate(-1)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <BackButton />
      <h3 className="mb-5">Novo Fornecedor</h3>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Nome"
                invalid={errors.name && touched.name ? true : false}
                errorMessage={errors.name?.toString()}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Nome"
                  component={Input}
                />
              </FormItem>
              <FormItem>
                <Button type="submit" variant="solid">
                  Cadastrar
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default StoreNew
