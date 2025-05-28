import BackButton from '@/components/custom/BackButton'
import { Button, FormContainer, FormItem } from '@/components/ui'
import Input from '@/components/ui/Input'
import { branchCreate, IBranchCreate } from '@/services/branchService'
import { Field, Form, Formik } from 'formik'
// import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const initialValues: IBranchCreate = {
  name: '',
}

const BranchNew = () => {
  //const [branch, setBranch] = useState<IBranchCreate | null>(null)
  const navigate = useNavigate()

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { target } = e
  //   setBranch({ ...branch, [target.name]: target.value })
  // }

  async function handleSubmit(values: IBranchCreate) {
    try {
      await branchCreate(values)
      navigate(-1)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <BackButton />
      <h3 className="mb-5">Novo ponto de venda</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Nome"
                invalid={touched.name && errors.name ? true : false}
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

export default BranchNew
