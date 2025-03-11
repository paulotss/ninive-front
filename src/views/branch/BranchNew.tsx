import { Button } from '@/components/ui'
import Input from '@/components/ui/Input'
import { branchCreate, IBranchCreate } from '@/services/branchService'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BranchNew = () => {
  const [branch, setBranch] = useState<IBranchCreate | null>(null)
  const navigate = useNavigate()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { target } = e
    setBranch({ ...branch, [target.name]: target.value })
  }

  async function handleSubmit() {
    try {
      await branchCreate(branch)
      navigate('/lojas')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <h3 className="mb-5">Novo ponto de venda</h3>
      <Input
        placeholder="Nome"
        name="name"
        className="mb-5"
        onChange={handleChange}
      />
      <Button variant="solid" className="w-48" onClick={handleSubmit}>
        Cadastrar
      </Button>
    </>
  )
}

export default BranchNew
