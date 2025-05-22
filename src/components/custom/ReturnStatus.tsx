import { MdWatchLater } from 'react-icons/md'
import dayjs, { Dayjs } from 'dayjs'

interface IProps {
  returnDate: Dayjs
}

const today = dayjs(new Date())
const week = today.add(7, 'day')

const ReturnStatus = ({ returnDate }: IProps) => {
  return (
    <div className="flex items-center">
      {returnDate.format('DD/MM/YYYY')}
      <span className="ml-1">
        {today < returnDate ? (
          week < returnDate ? (
            <MdWatchLater color="green" className="text-lg" />
          ) : (
            <MdWatchLater color="orange" className="text-lg" />
          )
        ) : (
          <MdWatchLater color="red" className="text-lg" />
        )}
      </span>
    </div>
  )
}

export default ReturnStatus
