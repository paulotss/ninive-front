import { cloneElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
  content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div className="bg-white py-6 px-16 flex-col justify-between hidden lg:flex"></div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
          <div className="mb-8">{content}</div>
          {children
            ? cloneElement(children as React.ReactElement, {
                ...rest,
              })
            : null}
        </div>
      </div>
    </div>
  )
}

export default Side
