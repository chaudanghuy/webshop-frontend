import React, { useEffect, useRef, useState } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import apiRequest from '../../lib/apiRequest'

const MainChart = () => {
  const chartRef = useRef(null)
  const [months, setMonths] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const orders = await apiRequest.get('/orders/stats');        
        const tmpMonths = [];
        const tmpOrders = [];
        const tmpRevenues = [];
        orders.data.forEach(order => {
          tmpMonths.push(order.month);          
          tmpOrders.push(order.total);
          tmpRevenues.push(order.revenue);
        });        
        setMonths(tmpMonths);        
        setTotalOrders(tmpOrders);
        setRevenue(tmpRevenues);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalOrders();
  }, []);

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const random = () => Math.round(Math.random() * 100)

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: months,
          datasets: [
            {
              label: 'Đơn hàng',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: totalOrders,
              fill: true,
            },
            {
              label: 'Doanh thu',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: revenue,
            },
            // {
            //   label: 'My Third dataset',
            //   backgroundColor: 'transparent',
            //   borderColor: getStyle('--cui-danger'),
            //   pointHoverBackgroundColor: getStyle('--cui-danger'),
            //   borderWidth: 1,
            //   borderDash: [8, 5],
            //   data: [65, 65, 65, 65, 65, 65, 65],
            // },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
