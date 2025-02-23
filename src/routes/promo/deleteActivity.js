import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest'
import { ToastNoti } from '../../components/notification/ToastNoti'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'

const DeleteActivity = ({ visible, setVisible, activity }) => {
  // Toast
  const [toast, setToast] = useState(null)
  const [deleteActivityConfirm, setDeleteActivityConfirm] = useState(false)

  useEffect(() => {
    console.log(activity)
    setDeleteActivityConfirm(activity)
  }, [activity])

  const submitDeleteActivity = async () => {
    try {
      const response = await apiRequest.delete(
        `/deals/shop/${activity.shopId}/promo/${activity.id}`,
      )
      if (response.status === 200) {
        handleShowToast('Xóa sản phẩm thành công!')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {}
  }

  const handleShowToast = (message) => {
    setToast(
      <CToast>
        <CToastHeader closeButton>
          <CIcon icon={cilBell} className="me-2" />
          <div className="fw-bold me-auto">Thông báo hệ thống</div>
          <small>Just now</small>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  return (
    <>
      <ToastNoti toast={toast} setToast={setToast} />
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">
            Xác nhận xóa promo {deleteActivityConfirm.title}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Bấm xóa để tiếp tục</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={() => submitDeleteActivity()}>
            Xóa
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default DeleteActivity
