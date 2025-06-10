import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import { useEffect, useState } from 'react'
import {
  IIncomingMostSeller,
  incomingGetMostSellers,
} from '@/services/incomingService'
import { bookGetAll } from '@/services/bookService'

const Home = () => {
  const [incomingsMostSeller, setIncomingsMostSeller] = useState<
    IIncomingMostSeller[]
  >([])

  // const data = [
  //   {
  //     name: 'Net Profit',
  //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  //   },
  //   {
  //     name: 'Revenue',
  //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  //   },
  //   {
  //     name: 'Free Cash Flow',
  //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  //   },
  // ]

  useEffect(() => {
    async function getIncomingsMostSeller() {
      try {
        const resultIncomings = await incomingGetMostSellers()
        const resultBooks = await bookGetAll()
        const incomings = resultIncomings.data.map((ri) => {
          ri.book = resultBooks.data.find((rb) => rb.id === ri.bookId)
          return ri
        })
        setIncomingsMostSeller(
          incomings.sort((a, b) => b._sum.amount - a._sum.amount).slice(0, 5),
        )
      } catch (error) {
        console.log(error)
      }
    }

    getIncomingsMostSeller()
  }, [])

  return (
    <>
      <h3>Mais vendidos</h3>
      <Chart
        options={{
          colors: COLORS,
          labels: incomingsMostSeller.map((ims) => ims.book.title),
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
        series={incomingsMostSeller?.map((ims) => ims._sum.amount)}
        height={300}
        type="pie"
      />
      {/* <div className="m-5">
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
      </div> */}
    </>
  )
}

export default Home
