import { Button, Input, Radio } from '@/components/ui'
import {
  ILoan,
  loanGetByBookISBN,
  loanGetByBookTitle,
  loanUpdate,
} from '@/services/loanService'
import { ChangeEvent, FormEvent, useState } from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import Table from '@/components/ui/Table'
import Cart, { IItem } from '@/components/custom/Cart'
import { IIncomingCreate, incomingCreateMany } from '@/services/incomingService'

const { Tr, Th, Td, THead, TBody } = Table

interface ISearch {
  term: string
  method: string
}

const Cashier = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [search, setSearch] = useState<ISearch>({ term: '', method: 'isbn' })
  const [loans, setLoans] = useState<ILoan[]>([])
  const [items, setItems] = useState<IItem[]>([])

  function handleChangeSearch({ target }: ChangeEvent<HTMLInputElement>) {
    setSearch({ ...search, [target.name]: target.value })
  }

  function handleClickAddItem(id: number) {
    const loan = loans.find((l) => l.id === id)
    if (loan.amount - loan.salesAmount > 0) {
      const isExist = items.find((i) => i.id === id)
      if (isExist) {
        const newItems = items.filter((i) => i.id !== isExist.id)
        isExist.amount = isExist.amount + 1
        newItems.push(isExist)
        setItems(newItems)
      } else {
        const newItem: IItem = {
          id: id,
          title: loan.bookstore.book.title,
          amount: 1,
          totalAmount: loan.salesAmount,
          price: Number(loan.bookstore.coverPrice),
        }
        setItems([...items, newItem])
      }
      loan.salesAmount = loan.salesAmount + 1
      const newLoans = loans.filter((l) => l.id !== loan.id)
      setLoans([...newLoans, loan])
    }
  }

  async function handleClickButtonSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      let loanList: ILoan[] = []
      if (search.method === 'title') {
        const { data } = await loanGetByBookTitle(
          search.term,
          user.id.toString(),
        )
        loanList = data
      } else {
        const { data } = await loanGetByBookISBN(
          search.term,
          user.id.toString(),
        )
        loanList = data
      }
      setLoans(loanList)
    } catch (error) {
      console.log(error)
    }
  }

  function removeItem(id: number) {
    const loan = loans.find((l) => l.id === id)
    loan.salesAmount = loan.salesAmount - items.find((i) => i.id === id).amount
    const newLoans = loans.filter((l) => l.id !== id)
    const newItems = items.filter((i) => i.id !== id)
    setLoans([...newLoans, loan])
    setItems(newItems)
  }

  async function handleSubmit() {
    try {
      const incomings: IIncomingCreate[] = items.map((i) => ({
        bookId: loans.find((l) => l.id === i.id).bookstore.bookId,
        branchId: loans.find((l) => l.id === i.id).branchId,
        amount: i.amount,
        totalValue: i.amount * i.price,
      }))
      await incomingCreateMany(incomings)
      items.forEach(async (i) => {
        await loanUpdate(i.id, {
          salesAmount: i.totalAmount + i.amount,
        })
      })
      setSearch({ term: '', method: 'isbn' })
      setLoans([])
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
      {loans.length > 0 ? (
        <Table compact className="mt-4">
          <THead>
            <Tr>
              <Th>Título</Th>
              <Th>Estoque</Th>
              <Th>Preço</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {loans?.map((l) => (
              <Tr key={l.id}>
                <Td>{l.bookstore.book.title}</Td>
                <Td>{l.amount - l.salesAmount}</Td>
                <Td>
                  {Number(l.bookstore.coverPrice).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Td>
                <Td className="flex justify-end">
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => handleClickAddItem(l.id)}
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
          cleanItems={() => setItems([])}
          submit={handleSubmit}
        />
      </div>
    </>
  )
}

export default Cashier
