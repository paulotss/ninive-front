import { bookstoreGetOne, IBookstore } from "@/services/bookstoreService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookstoreView = () => {
    const [bookstore, setBookstore] = useState<IBookstore | null>(null);
    const { id } = useParams();

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

    return (
        <div> Título: <span className="font-bold">{ bookstore?.book.title }</span> </div>
    )
}

export default BookstoreView;