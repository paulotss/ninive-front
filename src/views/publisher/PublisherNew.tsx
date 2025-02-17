import { Button } from '@/components/ui';
import Input from '@/components/ui/Input'
import { IPublisherCreate, publisherCreate } from '@/services/publisherService';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublisherNew = () => {
  const [publisher, setPublisher] = useState<IPublisherCreate | null>(null)
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target } = e;
    setPublisher({...publisher, [target.name]: target.value})
  }
  
  async function handleSubmit() {
    try {
      await publisherCreate(publisher);
      navigate('/editoras')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <h3 className='mb-5'>Nova Editora</h3>
      <Input placeholder="Nome" name='name' className='mb-5' onChange={handleChange} />
      <Button variant='solid' className='w-48' onClick={handleSubmit}>Cadastrar</Button>
    </>
  )
}

export default PublisherNew;