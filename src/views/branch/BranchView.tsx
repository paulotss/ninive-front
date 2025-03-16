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
import { IBranch, branchGetOne } from '@/services/branchService'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const BranchView = () => {
  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [branch, setBranch] = useState<IBranch | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const getBranch = async () => {
      try {
        const { data } = await branchGetOne(Number(id))
        setBranch(data)
      } catch (error) {
        console.log(error)
      }
    }
    getBranch()
  }, [id])

  const table = useReactTable({
    data: branch.books,
    columns: [
      { header: 'Título', accessorKey: 'bookstore.book.title' },
      { header: 'ISBN', accessorKey: 'bookstore.book.isbn' },
      { header: 'Quantidade', accessorKey: 'amount' },
      { header: 'Qtd. Vendas', accessorKey: 'books.amount' },
    ],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
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
  )
}

export default BranchView
