import { useNavigate, useParams } from 'react-router-dom'
import Table from '@/components/ui/Table'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnSort } from '@tanstack/react-table'
import ReturnStatus from '@/components/custom/ReturnStatus'
import dayjs from 'dayjs'
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
import { bookstoreUpdate, IBookstore } from '@/services/bookstoreService'
import NewExpense from '@/components/custom/NewExpense'
import { expenseCreate, IExpenseCreate } from '@/services/expenseService'
import { bookGetOne, bookUpdate } from '@/services/bookService'
import { discountPrice, salePrice } from '@/utils/amount'
import { MdEdit } from 'react-icons/md'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const StoreView = () => {
  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [store, setStore] = useState<IStore>()
  const [bookstores, setBookstores] = useState<IBookstore[]>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams()

  async function handleSubmit(values: IStoreUpdate) {
    try {
      await storeUpdate(Number(id), values)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleSubmitExpense(
    bookstoreId: number,
    newBookAmount: number,
    values: IExpenseCreate,
  ) {
    try {
      await expenseCreate(values)
      await bookstoreUpdate(bookstoreId, {
        closed: true,
        closedDate: new Date(),
      })
      const { data } = await bookGetOne(values.bookId)
      await bookUpdate(Number(id), { amount: data.amount - newBookAmount })
      const result = await storeGetOne(Number(id))
      setStore(result.data)
      setBookstores(result.data.books)
    } catch (e) {
      console.log(e)
    }
  }

  const table = useReactTable({
    data: bookstores,
    columns: [
      { header: 'Título', accessorKey: 'book.title' },
      { header: 'ISBN', accessorKey: 'book.isbn' },
      { header: 'Quant.', accessorKey: 'amount' },
      {
        header: 'Valor Total.',
        cell: (props) => {
          const {
            discount,
            tax,
            book: { coverPrice },
          } = props.row.original
          return discountPrice(
            Number(coverPrice),
            tax,
            discount,
          ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        },
      },
      {
        header: 'Valor Desc.',
        cell: (props) => {
          const {
            discount,
            book: { coverPrice },
          } = props.row.original
          return salePrice(Number(coverPrice), discount).toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' },
          )
        },
      },
      {
        header: 'Devolução',
        accessorKey: 'returnDate',
        cell: (props) => {
          return (
            <ReturnStatus returnDate={dayjs(props.row.original.returnDate)} />
          )
        },
      },
      {
        header: 'Ações',
        cell: (props) => {
          return (
            <div className="flex items-center">
              <NewExpense
                bookstore={props.row.original}
                coverPrice={props.row.original.book.coverPrice}
                handleSubmitExpense={handleSubmitExpense}
              />
              <Button
                shape="circle"
                variant="twoTone"
                size="xs"
                icon={<MdEdit />}
                className="ml-2"
                onClick={() => navigate(`/consignado/${props.row.original.id}`)}
              />
            </div>
          )
        },
      },
    ],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    const getStore = async () => {
      setIsLoading(true)
      try {
        const { data } = await storeGetOne(Number(id))
        setStore(data)
        setBookstores(data.books)
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
          {bookstores && (
            <>
              <h4 className="mt-5 mb-3">Livro consignados</h4>
              <Table>
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <Th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? 'cursor-pointer select-none'
                                    : '',
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {<Sorter sort={header.column.getIsSorted()} />}
                              </div>
                            )}
                          </Th>
                        )
                      })}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {table
                    .getRowModel()
                    .rows.slice(0, 10)
                    .map((row) => {
                      return (
                        <Tr key={row.id}>
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            )
                          })}
                        </Tr>
                      )
                    })}
                </TBody>
              </Table>
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default StoreView
