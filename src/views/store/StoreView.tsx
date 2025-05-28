import { useParams } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Spinner,
} from '@/components/ui'
import BackButton from '@/components/custom/BackButton'
import {
  IStore,
  IStoreUpdate,
  storeGetOne,
  storeUpdate,
} from '@/services/storeService'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const StoreView = () => {
  const [store, setStore] = useState<IStore>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams()

  async function handleSubmit(values: IStoreUpdate) {
    try {
      await storeUpdate(Number(id), values)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getStore = async () => {
      setIsLoading(true)
      try {
        const { data } = await storeGetOne(Number(id))
        setStore(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getStore()
  }, [id])

  return (
    <>
      {!isLoading ? (
        <>
          <BackButton />
          <h3 className="mb-5">Fornecedor | {store?.name}</h3>
          <Formik
            initialValues={{ name: store?.name }}
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
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem>
                    {isEditing ? (
                      <Button type="submit" variant="solid">
                        Confirmar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsEditing(true)
                        }}
                      >
                        Editar
                      </Button>
                    )}
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default StoreView
