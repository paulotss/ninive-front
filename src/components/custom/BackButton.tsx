import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { IoArrowBack } from 'react-icons/io5'

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <div className="mb-3 text-right">
      <Button
        type="button"
        variant="plain"
        size="xs"
        icon={<IoArrowBack />}
        className="text-left"
        onClick={() => navigate(-1)}
      >
        Voltar
      </Button>
    </div>
  )
}

export default BackButton
