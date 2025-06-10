import { Button } from '../ui'
import Table from '@/components/ui/Table'
import DiscountButton from './DiscountButton'
import { useState } from 'react'
import { salePrice } from '@/utils/amount'

const { Tr, Th, Td, THead, TBody } = Table

export interface IItem {
  id: number
  title: string
  amount: number
  price: number
  cost: number
}

interface IProps {
  items: IItem[]
  removeItem(id: number): void
  cleanItems(): void
  submit(totalValue: number): void
}

const Cart = ({ items, removeItem, cleanItems, submit }: IProps) => {
  const [discount, setDiscount] = useState<number>(0)

  function getTotalPrice() {
    return items.reduce((acc, i) => (acc += i.amount * i.price), 0)
  }

  function handleApplyDiscountButton(discount: number) {
    setDiscount(discount)
  }

  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between">
        <p>
          Items:{' '}
          <span className="font-bold text-lg">
            {items.reduce((acc, i) => (acc += i.amount), 0)}
          </span>
        </p>
        <p>
          Total:{' '}
          <span className="font-bold text-lg">
            {salePrice(getTotalPrice(), discount).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </p>
      </div>
      <div className="flex justify-end mb-5">
        <p>Desconto: {`${discount}%`}</p>
      </div>
      {items.length > 0 ? (
        <Table compact>
          <THead>
            <Tr>
              <Th>Título</Th>
              <Th>Quantidade</Th>
              <Th>Preço</Th>
              <Th>Custo</Th>
              <Th>Desconto</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {items.map((i) => (
              <Tr key={i.id}>
                <Td>{i.title}</Td>
                <Td>{i.amount}</Td>
                <Td>
                  {i.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Td>
                <Td>
                  <span
                    className={
                      salePrice(i.price, discount) < i.cost
                        ? 'text-red-600 font-bold'
                        : 'text-green-600 font-bold'
                    }
                  >
                    {i.cost.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </Td>
                <Td>{`${salePrice(i.price, discount).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`}</Td>
                <Td className="text-end">
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
        <Button
          type="button"
          variant="solid"
          className="mr-2"
          onClick={() => submit(salePrice(getTotalPrice(), discount))}
        >
          Finalizar
        </Button>
        <DiscountButton handleApplyDiscountButton={handleApplyDiscountButton} />
        <Button
          type="button"
          variant="twoTone"
          className="ml-2"
          onClick={cleanItems}
        >
          Limpar
        </Button>
      </div>
    </div>
  )
}

export default Cart
