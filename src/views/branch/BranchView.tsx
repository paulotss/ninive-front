import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnSort } from '@tanstack/react-table'
import { useParams } from 'react-router-dom'
import {
  IBranch,
  IBranchUpdate,
  branchGetOne,
  branchUpdate,
} from '@/services/branchService'
import { ILoan } from '@/services/loanService'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import ReturnStatus from '@/components/custom/ReturnStatus'
import BackButton from '@/components/custom/BackButton'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
})

const BranchView = () => {
  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [branch, setBranch] = useState<IBranch>()
  const [loans, setLoans] = useState<ILoan[]>([])
  const [isEditing, setEditing] = useState<boolean>(false)
  const { id } = useParams()

  const table = useReactTable({
    data: loans,
    columns: [
      { header: 'Título', accessorKey: 'book.title' },
      { header: 'ISBN', accessorKey: 'book.isbn' },
      { header: 'Quant.', accessorKey: 'amount' },
      {
        header: 'Devolução',
        accessorKey: 'returnDate',
        cell: (props) => {
          return (
            <ReturnStatus returnDate={dayjs(props.row.original.returnDate)} />
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

  async function handleSubmit(values: IBranchUpdate) {
    try {
      await branchUpdate(Number(id), values)
      setEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getBranch = async () => {
      try {
        const { data } = await branchGetOne(Number(id))
        setBranch(data)
        setLoans(data.books)
      } catch (error) {
        console.log(error)
      }
    }
    getBranch()
  }, [id])

  return (
    <>
      {branch && (
        <>
          <BackButton />
          <h3 className="mb-5">Ponto de venda | {branch?.name}</h3>
          <Formik
            initialValues={{
              name: branch?.name,
            }}
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
                      disabled={!isEditing}
                    />
                  </FormItem>
                  <FormItem>
                    {isEditing ? (
                      <Button type="submit" variant="solid">
                        Salvar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setEditing(true)
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
      )}
      {loans && (
        <>
          <h4 className="mt-5 mb-3">Livro em venda</h4>
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
                              onClick: header.column.getToggleSortingHandler(),
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
  )
}

export default BranchView
