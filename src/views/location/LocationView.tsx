import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '@/components/custom/BackButton'
import {
  ILocation,
  ILocationUpdate,
  locationGetOne,
  locationUpdate,
} from '@/services/locationService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Spinner,
} from '@/components/ui'

const LocationView = () => {
  const [location, setLocation] = useState<ILocation>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams()

  async function handleSubmit(values: ILocationUpdate) {
    try {
      await locationUpdate(Number(id), values)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getLocation() {
      setIsLoading(true)
      try {
        const { data } = await locationGetOne(Number(id))
        setLocation(data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    getLocation()
  }, [id])

  return (
    <>
      <BackButton />
      <h3 className="mb-5">Localização | {location?.title}</h3>
      {!isLoading ? (
        <div>
          <Formik
            initialValues={{ title: location?.title }}
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
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem>
                    {isEditing ? (
                      <Button type="submit">Salvar</Button>
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
        </div>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default LocationView
