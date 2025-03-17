import { Button } from '../ui'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

export interface IItem {
  id: number
  title: string
  amount: number
  totalAmount: number
  price: number
}

interface IProps {
  items: IItem[]
  removeItem(id: number): void
  cleanItems(): void
  submit(): void
}

const Cart = ({ items, removeItem, cleanItems, submit }: IProps) => {
  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between mb-5">
        <p>
          Items:{' '}
          <span className="font-bold text-lg">
            {items.reduce((acc, i) => (acc += i.amount), 0)}
          </span>
        </p>
        <p>
          Total:{' '}
          <span className="font-bold text-lg">
            {items
              .reduce((acc, i) => (acc += i.amount * i.price), 0)
              .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </p>
      </div>
      {items.length > 0 ? (
        <Table compact>
          <THead>
            <Tr>
              <Th>Título</Th>
              <Th>Quantidade</Th>
              <Th>Preço</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {items.map((i) => (
              <Tr key={i.id}>
                <Td>{i.title}</Td>
                <Td>{i.amount}</Td>
                <Td>{i.price}</Td>
                <Td>
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => removeItem(i.id)}
                  >
                    Remover
                  </Button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : null}
      <div className="flex justify-end mt-5">
        <Button type="button" variant="solid" className="mr-2" onClick={submit}>
          Finalizar
        </Button>
        <Button type="button" variant="twoTone" onClick={cleanItems}>
          Limpar
        </Button>
      </div>
    </div>
  )
}

export default Cart
