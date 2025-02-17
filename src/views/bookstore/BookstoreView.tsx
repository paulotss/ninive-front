import { bookstoreGetOne, bookstoreRemove, IBookstore } from "@/services/bookstoreService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { HiCheckCircle } from 'react-icons/hi'
import { expenseCreate, IExpense } from "@/services/expenseService";
import { bookUpdate } from "@/services/bookService";

const BookstoreView = () => {
    const [bookstore, setBookstore] = useState<IBookstore | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    async function handleClickCreateExpense() {
        try {
            const expense: IExpense = {
                bookId: bookstore.bookId,
                storeId: bookstore.storeId,
                amount: bookstore.amount,
                totalValue: bookstore.amount * bookstore.costPrice
            };
            await expenseCreate(expense);
            await bookUpdate(bookstore.bookId, { amount: bookstore.book.amount - bookstore.amount })
            await bookstoreRemove(bookstore.id);
            navigate('/estoque');
        } catch (e) {
            console.log(e)
        }
    }

    async function handleClickRemove() {
        try {
            await bookstoreRemove(bookstore.id);
            navigate('/estoque');
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        async function getBookstore() {
            try {
                const resp = await bookstoreGetOne(Number(id));
                setBookstore(resp.data);
            } catch (e) {
                console.log(e);
            }
        }
        getBookstore();
    }, [id]);

    const headerExtraContent = (
        <span className="flex items-center">
            <span className="mr-1 font-semibold">Status:</span>
            <span className="text-emerald-500 text-xl">
                <HiCheckCircle />
            </span>
            <span>{ bookstore?.returnDate.toString() }</span>
        </span>
    )

    const cardFooter = (
        <div className="flex justify-end">
            <Button size="sm" className="ltr:mr-2 rtl:ml-2" onClick={handleClickCreateExpense}>
                Encerrar
            </Button>
            <Button size="sm" variant="solid" onClick={handleClickRemove}>
                Excluir
            </Button>
        </div>
    )

    return (
        <>
            <div className="mb-5">
                <Card
                    header="Informações"
                >
                    <p>Título: <span className="font-bold">{ bookstore?.book.title }</span></p>
                    <p>ISBN: <span className="font-bold">{ bookstore?.book.isbn }</span></p>
                    <p>Edição: <span className="font-bold">{ bookstore?.book.edition }</span></p>
                </Card>
            </div>
            <div>
                <Card
                    header="Consignação"
                    headerExtra={headerExtraContent}
                    footer={cardFooter}
                >
                    <p>Loja: { bookstore?.store.name }</p>
                    <p>Quantidade: { bookstore?.amount }</p>
                    <p>Preço de custo: { bookstore?.costPrice }</p>
                    <p>Data de consignação: {bookstore?.consignmentDate.toString()}</p>
                </Card>
            </div>
        </>
    )
}

export default BookstoreView;