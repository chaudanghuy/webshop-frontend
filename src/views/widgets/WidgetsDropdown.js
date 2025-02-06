import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilOptions, cilArrowTop } from '@coreui/icons';
import apiRequest from '../../lib/apiRequest';

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
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
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  const calculatePercentageChange = (data) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    if (previous === 0) return 0;
    return ((latest - previous) / previous) * 100;
  };

  const percentageChangeOrders = calculatePercentageChange(totalOrders);
  const percentageChangeRevenue = calculatePercentageChange(revenue);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {totalOrders[totalOrders.length - 1] || 0}{' '}
              <span className="fs-6 fw-normal">
                ({percentageChangeOrders.toFixed(1)}% {percentageChangeOrders >= 0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="Đơn hàng"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Đơn hàng',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: totalOrders,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...totalOrders) - 10,
                    max: Math.max(...totalOrders) + 10,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              ${revenue[revenue.length - 1] || 0}{' '}
              <span className="fs-6 fw-normal">
                ({percentageChangeRevenue.toFixed(1)}% {percentageChangeRevenue >= 0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="Lợi nhuận"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: months,
                datasets: [
                  {
                    label: 'Lợi nhuận',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: revenue,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...revenue) - 10,
                    max: Math.max(...revenue) + 10,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>      
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
