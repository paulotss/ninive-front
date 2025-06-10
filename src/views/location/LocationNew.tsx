import { useNavigate } from 'react-router-dom'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { ILocationCreate, locationCreate } from '@/services/locationService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import BackButton from '@/components/custom/BackButton'

const LocationNew = () => {
  const navigate = useNavigate()

  async function handleSubmit(values: ILocationCreate) {
    try {
      await locationCreate(values)
      navigate(-1)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <BackButton />
      <h3 className="mb-5">Novo Local</h3>
      <div>
        <Formik
          initialValues={{ title: '' }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Obrigatório'),
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Título"
                  invalid={errors.title && touched.title ? true : false}
                  errorMessage={errors.title?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="title"
                    placeholder="Título"
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
      </div>
    </>
  )
}

export default LocationNew
