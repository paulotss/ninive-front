import { Button, Input, Radio } from '@/components/ui'
import { ChangeEvent, FormEvent, useState } from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import Table from '@/components/ui/Table'
import Cart, { IItem } from '@/components/custom/Cart'
import { IIncomingCreate, incomingCreateMany } from '@/services/incomingService'
import {
  bookGetByBookISBN,
  bookGetByBookTitle,
  bookUpdate,
  IBook,
} from '@/services/bookService'
import { discountPrice } from '@/utils/amount'

const { Tr, Th, Td, THead, TBody } = Table

interface ISearch {
  term: string
  method: string
}

const Cashier = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [search, setSearch] = useState<ISearch>({ term: '', method: 'isbn' })
  const [books, setBooks] = useState<IBook[]>([])
  const [items, setItems] = useState<IItem[]>([])

  function handleChangeSearch({ target }: ChangeEvent<HTMLInputElement>) {
    setSearch({ ...search, [target.name]: target.value })
  }

  // Perda de desempenho se array de expenses for muito grande
  function getAverageCost(bookId: number): number {
    interface ICost {
      value: number[]
      amount: number
    }
    const book = books.find((b) => b.id === bookId)
    const storeCosts: ICost = book.stores.reduce(
      (acc, s) => {
        acc.value.push(
          discountPrice(Number(book.coverPrice), s.tax, s.discount),
        )
        acc.amount += s.amount
        return acc
      },
      { value: [], amount: 0 },
    )
    const expenseCosts: ICost = book.expenses.reduce(
      (acc, e) => {
        if (acc.amount < book.amount + 1) {
          acc.value.push(Number(e.totalValue) / e.amount)
          acc.amount += e.amount
        }
        return acc
      },
      { value: [], amount: 0 },
    )
    const totalCosts: number[] = [...storeCosts.value, ...expenseCosts.value]
    return totalCosts.reduce((acc, t) => (acc += t), 0) / totalCosts.length
  }

  function handleClickAddItem(id: number) {
    const book = books.find((l) => l.id === id)
    if (book.amount > 0) {
      const isExist = items.find((i) => i.id === id)
      if (isExist) {
        const newItems = items.filter((i) => i.id !== isExist.id)
        isExist.amount = isExist.amount + 1
        newItems.push(isExist)
        setItems(newItems)
      } else {
        const newItem: IItem = {
          id: id,
          title: book.title,
          amount: 1,
          price: Number(book.coverPrice),
          cost: getAverageCost(book.id),
        }
        setItems([...items, newItem])
      }
      book.amount = book.amount - 1
      const newBook = books.filter((b) => b.id !== book.id)
      setBooks([...newBook, book])
    }
  }

  async function handleClickButtonSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      let bookList: IBook[] = []
      if (search.method === 'title') {
        const { data } = await bookGetByBookTitle(search.term)
        bookList = data
      } else {
        const { data } = await bookGetByBookISBN(search.term)
        bookList = data
      }
      setBooks(bookList)
    } catch (error) {
      console.log(error)
    }
  }

  function removeItem(id: number) {
    const book = books.find((l) => l.id === id)
    book.amount = book.amount + items.find((i) => i.id === id).amount
    const newBooks = books.filter((l) => l.id !== id)
    const newItems = items.filter((i) => i.id !== id)
    setBooks([...newBooks, book])
    setItems(newItems)
  }

  async function handleSubmit(totalValue: number) {
    try {
      const incomings: IIncomingCreate[] = items.map((i) => ({
        bookId: books.find((b) => b.id === i.id).id,
        branchId: Number(user.id),
        amount: i.amount,
        totalValue,
      }))
      await incomingCreateMany(incomings)
      items.forEach(async (i) => {
        await bookUpdate(i.id, {
          amount: i.amount,
        })
      })
      setSearch({ term: '', method: 'isbn' })
      setBooks([])
      setItems([])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h3>Caixa | {user.userName}</h3>
      <div className="mt-4">
        <div>
          <Radio.Group
            value={search.method}
            onChange={(val: string) => {
              setSearch({ ...search, method: val })
            }}
          >
            <Radio value={'isbn'} className="mr-4">
              ISBN
            </Radio>
            <Radio value={'title'}>Título</Radio>
          </Radio.Group>
        </div>
        <form className="flex" onSubmit={handleClickButtonSearch}>
          <Input
            type="text"
            name="term"
            placeholder="Busca"
            className="mr-1"
            onChange={handleChangeSearch}
          />
          <Button type="submit">Buscar</Button>
        </form>
      </div>
      {books.length > 0 ? (
        <Table compact className="mt-4">
          <THead>
            <Tr>
              <Th>Título</Th>
              <Th>ISBN</Th>
              <Th>Autor</Th>
              <Th>Editora</Th>
              <Th>Estoque</Th>
              <Th>Preço</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {books?.map((b) => (
              <Tr key={b.id}>
                <Td>{b.title}</Td>
                <Td>{b.isbn}</Td>
                <Td>{b.author}</Td>
                <Td>{b.publishier?.name}</Td>
                <Td>{b.amount}</Td>
                <Td>
                  {Number(b.coverPrice).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Td>
                <Td className="flex justify-end">
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => handleClickAddItem(b.id)}
                  >
                    Adicionar
                  </Button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : (
        <p className="mt-4 italic">Nada por aqui</p>
      )}
      <div className="mt-5">
        <Cart
          items={items}
          removeItem={removeItem}
          cleanItems={() => {
            setItems([])
            setBooks([])
          }}
          submit={handleSubmit}
        />
      </div>
    </>
  )
}

export default Cashier
