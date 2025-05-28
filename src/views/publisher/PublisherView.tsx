import { useParams } from 'react-router-dom'
import {
  IPublisher,
  IPublisherUpdate,
  publisherGetOne,
  publisherUpdate,
} from '@/services/publisherService'
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const PublishierView = () => {
  const [publisher, setPublisher] = useState<IPublisher>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams()

  async function handleSubmit(values: IPublisherUpdate) {
    try {
      await publisherUpdate(Number(id), values)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getPublisher = async () => {
      setIsLoading(true)
      try {
        const { data } = await publisherGetOne(Number(id))
        setPublisher(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getPublisher()
  }, [id])

  return (
    <>
      {!isLoading ? (
        <>
          <BackButton />
          <h3 className="mb-5">Editora | {publisher?.name}</h3>
          <Formik
            initialValues={{ name: publisher?.name }}
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

export default PublishierView
