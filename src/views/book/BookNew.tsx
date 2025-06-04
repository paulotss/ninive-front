import { Button, FormContainer, FormItem } from '@/components/ui'
import Input from '@/components/ui/Input'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import { IPublisher, publisherGetAll } from '@/services/publisherService'
import { IBookCreate, bookCreate } from '@/services/bookService'
import * as Yup from 'yup'
import { Form, Formik, Field, FieldProps } from 'formik'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Obrigatório'),
  isbn: Yup.string()
    .min(13, 'ISBN deve conter 13 caracteres')
    .max(13, 'ISBN deve conter 13 caracteres')
    .required('Obrigatório'),
  author: Yup.string().required('Obrigatório'),
  description: Yup.string().required('Obrigatório'),
  publishierId: Yup.string().required('Obrigatório'),
  publicationDate: Yup.string().required('Obrigatório'),
  pages: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/, 'Somente números'),
  edition: Yup.string()
    .required('Obrigatório')
    .matches(/^(0|[1-9][0-9]*)$/, 'Somente números'),
  coverPrice: Yup.string()
    .required()
    .matches(/^(((\d+)(\.\d{3})*(,\d{2}))|(\d*))$/, 'Formato: 0,00'),
})

const BookNew = () => {
  const [publishers, setPublishers] = useState<IPublisher[]>([])
  const navigate = useNavigate()

  async function handleSubmit(values: IBookCreate) {
    try {
      await bookCreate({
        ...values,
        pages: Number(values.pages),
        edition: Number(values.edition),
        coverPrice: values.coverPrice.toString().replace(',', '.'),
      })
      navigate('/livros')
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    async function getPublishers() {
      try {
        const resp = await publisherGetAll()
        setPublishers(resp.data)
      } catch (e) {
        console.log(e)
      }
    }
    getPublishers()
  }, [])

  return (
    <>
      <h3 className="mb-5">Novo Livro</h3>
      <Formik
        initialValues={{
          title: '',
          isbn: '',
          author: '',
          description: '',
          publishierId: '',
          publicationDate: new Date(),
          pages: '',
          edition: '',
          amount: 0,
          coverPrice: '',
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
                label="Autor"
                invalid={errors.author && touched.author ? true : false}
                errorMessage={errors.author?.toString()}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="author"
                  placeholder="Autor"
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
                  errors.publishierId && touched.publishierId ? true : false
                }
                errorMessage={errors.publishierId}
              >
                <Field name="publishierId">
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      form={form}
                      placeholder="Selecione"
                      options={publishers.map((p) => ({
                        value: p.id,
                        label: p.name,
                      }))}
                      value={publishers
                        .filter((option) => option.id === values.publishierId)
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
                label="Data de publicação"
                invalid={
                  errors.publicationDate && touched.publicationDate
                    ? true
                    : false
                }
                errorMessage={String(errors.publicationDate)}
              >
                <Field name="publicationDate" placeholder="Data de publicação">
                  {({ field, form }: FieldProps<IBookCreate>) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={values.publicationDate}
                      onChange={(date) => {
                        form.setFieldValue(field.name, date)
                      }}
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
              <FormItem
                label="Preço de capa"
                invalid={errors.coverPrice && touched.coverPrice ? true : false}
                errorMessage={errors.coverPrice?.toString()}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="coverPrice"
                  placeholder="00,00"
                  component={Input}
                />
              </FormItem>
              <FormItem>
                <Button type="submit" variant="solid" className="w-48">
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

export default BookNew
