import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect } from 'react'
import apiRequest from '../../lib/apiRequest'

const DeleteShop = ({ visible, setVisible, shop }) => {
  const deleteShopProcess = async () => {
    try {
      await apiRequest.delete(`/shops/${shop.id}`)
      setVisible(false)
      window.location.reload()
    } catch (error) {
      console.log(error)
      onChange(false)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} aria-labelledby="deletUserTitle">
      <CModalHeader>
        <CModalTitle id="deletUserTitle">Xác nhận xóa shop</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Bấm xóa để tiếp tục</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Đóng
        </CButton>
        <CButton color="primary" onClick={() => deleteShopProcess()}>
          Xóa
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeleteShop
