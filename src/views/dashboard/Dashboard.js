import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import apiRequest from '../../lib/apiRequest'

const Dashboard = () => {

  const [year, setYear] = useState(new Date().getFullYear());    

  return (
    <>
      <WidgetsDropdown year={year} />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Thống kê
              </h4>
              <div className="small text-body-secondary">January - December</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CCol sm={12} lg={6} className="mb-3 mb-lg-0 text-center text-lg-end d-flex flex-row space-between">
                <CFormLabel className="me-2 pe-2 mt-2">Năm</CFormLabel>
                <CFormSelect                  
                  className="text-center"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </CFormSelect>
              </CCol>
            </CCol>
          </CRow>
          <MainChart year={year} />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
