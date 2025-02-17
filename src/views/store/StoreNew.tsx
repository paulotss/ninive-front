import { Button } from '@/components/ui';
import Input from '@/components/ui/Input'
import { IStoreCreate, storeCreate } from '@/services/storeService';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StoreNew = () => {
  const [store, setStore] = useState<IStoreCreate | null>(null)
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target } = e;
    setStore({...store, [target.name]: target.value})
  }
  
  async function handleSubmit() {
    try {
      await storeCreate(store);
      navigate('/lojas')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <h3 className='mb-5'>Nova Loja</h3>
      <Input placeholder="Nome" name='name' className='mb-5' onChange={handleChange} />
      <Button variant='solid' className='w-48' onClick={handleSubmit}>Cadastrar</Button>
    </>
  )
}

export default StoreNew;