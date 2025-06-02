import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import { useEffect, useState } from 'react'
import { IIncoming, incomingGetMostSellers } from '@/services/incomingService'

const Home = () => {
  const [incomings, setIncomings] = useState<IIncoming[]>([])

  const data = [
    {
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ]

  useEffect(() => {
    async function getIncomings() {
      try {
        const { data } = await incomingGetMostSellers(5)
        setIncomings(data)
      } catch (error) {
        console.log(error)
      }
    }

    getIncomings()
  }, [])

  return (
    <>
      <div className="m-5">
        <Chart
          options={{
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
              },
            },
            colors: COLORS,
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent'],
            },
            xaxis: {
              categories: [
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
              ],
            },
            fill: {
              opacity: 1,
            },
            tooltip: {
              y: {
                formatter: (val) => `$${val} thousands`,
              },
            },
          }}
          series={data}
          height={300}
          type="bar"
        />
      </div>
      <Chart
        options={{
          colors: COLORS,
          labels: incomings.map((i) => i.book.title),
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        }}
        series={incomings.map((i) => i.amount)}
        height={300}
        type="pie"
      />
    </>
  )
}

export default Home
