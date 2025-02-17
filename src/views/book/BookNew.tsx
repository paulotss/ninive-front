import { Button } from '@/components/ui';
import Input from '@/components/ui/Input'
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import { IPublisher, publisherGetAll } from '@/services/publisherService';
import { IBookCreate, bookCreate } from '@/services/bookService';

const BookNew = () => {
  const [book, setBook] = useState<IBookCreate | null>(null)
  const [publishers, setPublishers] = useState<IPublisher[]>([])
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target } = e;
    setBook({...book, [target.name]: target.value})
  }
  
  async function handleSubmit() {
    try {
      await bookCreate({
        ...book,
        pages: Number(book.pages),
        amount: Number(book.amount),
        edition: Number(book.edition)
      });
      navigate('/livros')
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function getPublishers() {
      try {
        const resp = await publisherGetAll();
        setPublishers(resp.data)
      } catch (e) {
        console.log(e)
      }
    }
    getPublishers()
  }, [])

  return (
    <>
      <h3 className='mb-5'>Novo Livro</h3>
      <Input placeholder="Nome" name='title' className='mb-5' onChange={handleChange} />
      <Input placeholder="ISBN" name='isbn' className='mb-5' onChange={handleChange} />
      <DatePicker placeholder="Data de publicação" className='mb-5' onChange={(date) => setBook({...book, publicationDate: date})} />
      <Input textArea placeholder="Descrição" name='description' className='mb-5' onChange={handleChange} />
      <Input type='number' placeholder="Páginas" name='pages' className='mb-5' onChange={handleChange} />
      <Input placeholder="Quantidade" name='amount' className='mb-5' onChange={handleChange} />
      <Input type='number' placeholder="Edição" name='edition' className='mb-5' onChange={handleChange} />
      <Select
        placeholder="Editora"
        options={publishers.map((p) => ({
          value: p.id,
          label: p.name
        }))}
        className='mb-5'
        onChange={(data) => {setBook({...book, publishierId: data.value})}}
      ></Select>
      <Button variant='solid' className='w-48' onClick={handleSubmit}>Cadastrar</Button>
    </>
  )
}

export default BookNew;