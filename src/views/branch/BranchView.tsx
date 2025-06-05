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
import { ILoan, loanUpdate } from '@/services/loanService'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import ReturnStatus from '@/components/custom/ReturnStatus'
import BackButton from '@/components/custom/BackButton'
import NewIncoming from '@/components/custom/NewIncoming'
import { salePrice } from '@/utils/amount'
import { IIncomingCreate, incomingCreate } from '@/services/incomingService'
import { bookGetOne, bookUpdate } from '@/services/bookService'
import ExportButton from '@/components/custom/ExportButton'

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

  async function handleSubmitIncoming(
    loanId: number,
    returningAmount: number,
    newIncoming: IIncomingCreate,
  ) {
    try {
      await loanUpdate(loanId, {
        closed: true,
        closedDate: new Date(),
        salesAmount: newIncoming.amount,
      })
      await incomingCreate(newIncoming)
      const { data } = await bookGetOne(newIncoming.bookId)
      await bookUpdate(newIncoming.bookId, {
        amount: data.amount + returningAmount,
      })
      const result = await branchGetOne(Number(id))
      setBranch(result.data)
      setLoans(result.data.books)
    } catch (e) {
      console.log(e)
    }
  }

  const table = useReactTable({
    data: loans,
    columns: [
      { header: 'Título', accessorKey: 'book.title' },
      { header: 'ISBN', accessorKey: 'book.isbn' },
      { header: 'Quant.', accessorKey: 'amount' },
      {
        header: 'Valor',
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
        header: 'Desconto',
        cell: (props) => {
          const { discount } = props.row.original
          return `${discount}%`
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
          const {
            bookId,
            id,
            amount,
            book: { title, coverPrice },
            discount,
          } = props.row.original
          return (
            <NewIncoming
              bookId={bookId}
              branchId={branch.id}
              branchName={branch.name}
              bookTitle={title}
              amount={amount}
              salePrice={salePrice(Number(coverPrice), discount)}
              loanId={id}
              handleSubmitIncoming={handleSubmitIncoming}
            />
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
          <h4 className="mt-5 mb-3">Livros em venda</h4>
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
          <div className="mt-5">
            <ExportButton
              payload={loans.map((l) => ({
                Título: l.book.title,
                Autor: l.book.author,
                Editora: l.book.publishier?.name,
                ISBN: l.book.isbn,
                Quantidade: l.amount,
                PCapa: Number(l.book.coverPrice).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
                PDesconto: salePrice(
                  Number(l.book.coverPrice),
                  l.discount,
                ).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
                Desconto: `${l.discount}%`,
                Devolução: dayjs(l.returnDate).format('DD/MM/YYYY'),
                Vendas: '',
              }))}
              filename={branch?.name}
            />
          </div>
        </>
      )}
    </>
  )
}

export default BranchView
