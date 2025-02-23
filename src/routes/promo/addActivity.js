import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest'
import { PromoHelp } from '../../utils/enums/promo'
import { PromoPriceList } from '../../utils/constant/promoPriceList'
import './promo.css'
import { CircleHelp } from 'lucide-react'
import { ToastNoti } from '../../components/notification/ToastNoti'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'

const ACTIVITY_TYPES = ['FIXED_PRICE', 'DIRECT_DISCOUNT', 'FLASHSALE']
const PRODUCT_LEVEL = ['VARIATION']
const customTooltipStyle = {
  '--cui-tooltip-bg': 'var(--cui-primary)',
}

const AddActivity = ({ visible, setVisible, onChangeActivityEvent }) => {
  const closeModal = () => setVisible(false)

  return (
    <div className="app">
      <CModal visible={visible} onClose={closeModal} alignment="center" size="lg" scrollable>
        <CModalHeader>
          <CModalTitle>Tạo promo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ModalContent onClose={closeModal} onChangeActivityEvent={onChangeActivityEvent} />
        </CModalBody>
      </CModal>
    </div>
  )
}

const ModalContent = ({ onClose, onChangeActivityEvent }) => {
  const [toast, setToast] = useState(null)
  const [shopId, setShopId] = useState(null)
  const [title, setTitle] = useState('Promo ' + new Date().toLocaleString())
  const [activityType, setActivityType] = useState(null)
  const [beginTime, setBeginTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [productLevel, setProductLevel] = useState(null)

  const [shops, setShops] = useState([])

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiRequest.get('/shops/all')
        console.log(response.data)
        setShops(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchShops()
  }, [])

  useEffect(() => {
    if (beginTime) {
      // set end date to start date + 23 hours
      const endDate = new Date(beginTime)
      endDate.setHours(endDate.getHours() + 23)

      // Format to 'YYYY-MM-DDTHH:mm'
      const formatDateTimeLocal = (date) => {
        const pad = (num) => String(num).padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
      }
      setEndTime(formatDateTimeLocal(endDate))
    }
  }, [beginTime])

  const submitActivity = async () => {
    try {
      if (!shopId) {
        throw new Error('Vui lý chọn shop')
      }

      if (!activityType) {
        throw new Error('Vui lý chọn loại')
      }

      if (!productLevel) {
        throw new Error('Vui lý chọn loại san pham')
      }

      const result = await apiRequest.post('/promos', {
        shopId: shopId,
        title: title,
        activityType: activityType,
        beginTime: beginTime,
        endTime: endTime,
        productLevel: productLevel,
      })

      if (result.status === 200) {
        onClose()
        onChangeActivityEvent()
      }
    } catch (error) {
      handleShowToast(error.message)
      console.log(error)
    }
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
    <div className="modal-body">
      <ToastNoti toast={toast} setToast={setToast} />
      <div className="column input-section">
        <CRow>
          <CFormLabel>Cửa hàng</CFormLabel>
          <CFormSelect value={shopId} onChange={(e) => setShopId(e.target.value)}>
            <option>Chọn cửa hàng</option>
            {shops.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </CFormSelect>
        </CRow>
        <CRow className="mt-3">
          <CFormInput
            type="text"
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Tên promo"
          />
        </CRow>
        <CRow>
          <CFormLabel>Loại</CFormLabel>
          <CFormSelect value={activityType} onChange={(e) => setActivityType(e.target.value)}>
            <option>Chọn loại</option>
            {ACTIVITY_TYPES.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </CFormSelect>
        </CRow>
        <CRow className="mt-3">
          <CFormLabel>Loại sản phẩm</CFormLabel>
          <CFormSelect value={productLevel} onChange={(e) => setProductLevel(e.target.value)}>
            <option>Chọn loại</option>
            {PRODUCT_LEVEL.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </CFormSelect>
        </CRow>
        <CRow className="mt-3">
          <CFormInput
            type="datetime-local"
            placeholder="Start"
            aria-label="Start"
            aria-describedby="basic-addon2"
            value={beginTime}
            onChange={(e) => setBeginTime(e.target.value)}
            label="Ngày hiệu lực"
          />
        </CRow>
        <CRow className="mt-3">
          <CFormLabel>
            Ngày kết thúc
            <CTooltip content={PromoHelp.DATE_END} placement="top" style={customTooltipStyle}>
              <CircleHelp className="ms-1" />
            </CTooltip>
          </CFormLabel>
          <CFormInput
            type="datetime-local"
            placeholder="End"
            aria-label="End"
            aria-describedby="basic-addon2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </CRow>
        <CRow className="mt-3">
          <CButton className="text-center " color="primary" onClick={submitActivity}>
            Tạo promo
          </CButton>
        </CRow>
      </div>
    </div>
  )
}

export default AddActivity
