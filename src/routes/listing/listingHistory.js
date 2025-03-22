import {
  CBadge,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { format } from 'timeago.js'

const ListingHistory = ({ visible, history }) => {
  return (
    <CModal visible={visible} aria-labelledby="LiveDemoExampleLabel">
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Lịch sử đăng</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable className="mb-0 align-middle caption-top">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Shop</CTableHeaderCell>
              <CTableHeaderCell scope="col">Thời gian</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tình trạng</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chi tiết</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {history.length > 0 ? (
              history.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.shop.name}</CTableDataCell>
                  <CTableDataCell>{format(item.createdAt)}</CTableDataCell>
                  <CTableDataCell>
                    {item.status === 'FAILURE' ? (
                      <>
                        <CBadge color="danger">{item.status}</CBadge>
                      </>
                    ) : (
                      <CBadge color="warning">{item.status}</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>{item.log && item.log.status}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <>
                <CSpinner color="primary" />
                Loading..
              </>
            )}
          </CTableBody>
        </CTable>
      </CModalBody>
    </CModal>
  )
}

export default ListingHistory
