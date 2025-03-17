import { Button, Checkbox, FormContainer, FormItem } from '@/components/ui'
import Input from '@/components/ui/Input'
import { branchCreate, IBranchCreate } from '@/services/branchService'
import { Field, Form, Formik } from 'formik'
// import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  password: Yup.string().required('Obrigatório'),
})

const initialValues: IBranchCreate = {
  name: '',
  email: '',
  password: '',
  admin: false,
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
      navigate('/lojas')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
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
              <FormItem
                label="Email"
                invalid={touched.email && errors.email ? true : false}
                errorMessage={errors.email?.toString()}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Senha"
                invalid={touched.password && errors.password ? true : false}
                errorMessage={errors.password?.toString()}
              >
                <Field
                  type="password"
                  autoComplete="off"
                  name="password"
                  placeholder="Senha"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Administrador"
                invalid={touched.admin && errors.admin ? true : false}
                errorMessage={errors.admin?.toString()}
              >
                <Field
                  type="checkbox"
                  autoComplete="off"
                  name="admin"
                  placeholder="Administrador"
                  component={Checkbox}
                />
              </FormItem>
              <Button type="submit">Cadastrar</Button>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default BranchNew
