import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { IExpense, expenseGetAllByDate } from '@/services/expenseService'
import DatePicker from '@/components/ui/DatePicker'
import dayjs from 'dayjs'

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const ExpenseList = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [period, setPeriod] = useState({ 
      startDate: dayjs().subtract(30, 'days').toDate(),
      endDate: new Date()
    })

    const columns = useMemo<ColumnDef<IExpense>[]>(
        () => [
            { header: 'Título', accessorKey: 'book.title',  },
            { header: 'ISBN', accessorKey: 'book.isbn' },
            { header: 'Loja', accessorKey: 'store.name' },
            { header: 'Quantidade', accessorKey: 'amount' },
            { header: 'Despesa', accessorKey: 'totalValue'},
            {
                header: 'Data',
                accessorKey: 'createdAt',
                cell: props => {
                    const df = new Date(props.row.original.createdAt)
                    return `${df.getDay()}/${df.getMonth()}/${df.getFullYear()}`
                }
            },
        ],
        []
    )

    const [expenseData, setExpenseData] = useState<IExpense[]>([])

    useEffect(() => {
        async function getExpenses() {
            try {
                const { startDate, endDate } = period;
                const resp = await expenseGetAllByDate(startDate, endDate)
                setExpenseData(resp.data);
            } catch(e) {
                console.log(e)
            }
        }
        getExpenses()
    }, [period])

    const table = useReactTable({
        data: expenseData,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <>
          <div className='flex justify-between items-center m-5'>
            <p>
              Total: <span className='font-bold text-red-600 text-lg'>{
                expenseData.reduce((acc, e) => (acc += Number(e.totalValue)), 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                }</span>
            </p>
            <div className='flex justify-start w-64'>
              <div>
                <DatePicker
                  placeholder="Início"
                  defaultValue={period.startDate}
                  onChange={(date) => { setPeriod({...period, startDate: date}) }}
                />
                <p className='text-[10px] italic'>Início</p>
              </div>
              <div>
                <DatePicker
                  placeholder="Fim"
                  defaultValue={period.endDate}
                  onChange={(date) => { setPeriod({...period, endDate: date}) }}
                />
                <p className='text-[10px] italic'>Fim</p>
              </div>
            </div>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="font-lg shadow border border-block"
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
          </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
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

export default ExpenseList