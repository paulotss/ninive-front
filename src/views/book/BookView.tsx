import { bookGetOne, IBook } from '@/services/bookService'
import { Input, Select, Spinner } from '@/components/ui'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Formik, Field, Form, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { IPublisher, publisherGetAll } from '@/services/publisherService'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Obrigatório'),
  isbn: Yup.string()
    .min(13, 'ISBN deve conter 13 caracteres')
    .max(13, 'ISBN deve conter 13 caracteres')
    .required('Obrigatório'),
  description: Yup.string().required('Obrigatório'),
  publishier: Yup.string().required('Obrigatório'),
  pages: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
  amount: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
  edition: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/),
})

const BookView = () => {
  const [book, setBook] = useState<IBook>()
  const [publishers, setPublishers] = useState<IPublisher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams()

  const handleSubmit = (values) => {
    console.log(values)
  }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        console.log('teste')
        const respBook = await bookGetOne(Number(id))
        const respPublishers = await publisherGetAll()
        console.log(respBook.data)
        setBook(respBook.data)
        setPublishers(respPublishers.data)
      } catch (e) {
        console.log(e)
      }
      setIsLoading(false)
    }
    getData()
  }, [id])

  return (
    <>
      {!isLoading ? (
        <Formik
          initialValues={{
            title: book?.title,
            isbn: book?.isbn,
            description: book?.description,
            publishier: book?.publishierId,
            pages: book?.pages,
            amount: book?.amount,
            edition: book?.edition,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Título"
                  invalid={touched.title && errors.title ? true : false}
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
                <FormItem
                  label="ISBN"
                  invalid={errors.isbn && touched.isbn ? true : false}
                  errorMessage={errors.isbn?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="isbn"
                    placeholder="ISBN"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Descrição"
                  invalid={
                    errors.description && touched.description ? true : false
                  }
                  errorMessage={errors.description?.toString()}
                >
                  <Field
                    autoComplete="off"
                    name="description"
                    placeholder="Descrição"
                    component={Input}
                    textArea={true}
                  />
                </FormItem>
                <FormItem
                  label="Editora"
                  invalid={
                    errors.publishier && touched.publishier ? true : false
                  }
                  errorMessage={errors.publishier?.toString()}
                >
                  <Field name="publishier">
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        form={form}
                        options={publishers.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))}
                        value={publishers
                          .filter((option) => option.id === values.publishier)
                          .map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Páginas"
                  invalid={errors.pages && touched.pages ? true : false}
                  errorMessage={errors.pages?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="pages"
                    placeholder="Páginas"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Quantidade"
                  invalid={errors.amount && touched.amount ? true : false}
                  errorMessage={errors.amount?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="amount"
                    placeholder="Quantidade"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Edição"
                  invalid={errors.edition && touched.edition ? true : false}
                  errorMessage={errors.edition?.toString()}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="edition"
                    placeholder="Edição"
                    component={Input}
                  />
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BookView
