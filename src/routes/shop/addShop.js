import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
  CRow,
  CFormLabel,
  CLink,
  CFormText,
  CButtonGroup,
  CButton,
  CFormInput,
  CForm,
  CFormTextarea,
  CCol,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import { ToastNoti } from '../../components/notification/ToastNoti'
import CIcon from '@coreui/icons-react'
import apiRequest from '../../lib/apiRequest'
import { BellRing, Globe } from 'lucide-react'

const AddShop = ({ visible, setVisible }) => {
  const [name, setName] = useState('')
  const [tiktokURL, setTiktokURL] = useState('')
  const [titktokResponse, setTiktokResponse] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const APP_KEY = import.meta.env.VITE_TIKTOK_SHOP_APP_KEY
    const APP_SECRET = import.meta.env.VITE_TIKTOK_SHOP_APP_SECRET
    const url = `https://auth.tiktok-shops.com/api/v2/token/get?app_key=${APP_KEY}&app_secret=${APP_SECRET}&auth_code=${authCode}&grant_type=authorized_code`
    setTiktokURL(url)
  }, [authCode])

  useEffect(() => {
    const processTiktokResponse = async () => {
      try {
        const data = JSON.parse(titktokResponse)
        console.log(data)
        if (data.code === 0 && data.message === 'success') {
          setAccessToken(data.data.access_token)
          setRefreshToken(data.data.refresh_token)
        }
      } catch (error) {
        console.log(error)
      }
    }

    processTiktokResponse()
  }, [titktokResponse])

  const handleShowToast = (message) => {
    setToast(
      <CToast>
        <CToastHeader closeButton>
          <BellRing className="me-2" />
          <div className="fw-bold me-auto">Thông báo hệ thống</div>
          <small>Just now</small>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  const handleAddShop = async () => {
    try {
      const resp = await apiRequest.post('/shops', {
        name: name,
        tiktokAuthCode: authCode,
        accessToken: accessToken,
        refreshToken: refreshToken,
      })

      if (resp) {
        handleShowToast('Tạo shop thành công')
        // Thực hiện xử lý tạo shop ở đây
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.log(error)
      handleShowToast('Tạo shop không thành công')
    }
  }

  const copyTiktokURL = async () => {
    try {
      // Copy the text inside the text field
      navigator.clipboard.writeText(tiktokURL)

      // Alert the copied text
      alert('Link copy!')
    } catch (error) {}
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="LiveDemoExampleLabel"
      alignment="center"
      scrollable
      size="lg"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Tạo shop</CModalTitle>
      </CModalHeader>
      <CModalBody className="d-flex flex-column">
        <CForm>
          <CRow>
            <CCol md={12}>
              <CFormInput
                type="text"
                id="name"
                name="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={12}>
              <CFormTextarea
                type="text"
                id="name"
                name="name"
                label="Auth Code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={12}>
              <CButton color="primary" className="mt-3" onClick={copyTiktokURL}>
                <Globe className="me-2" />
                Lấy Tiktok Token
              </CButton>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CFormTextarea
              type="text"
              id="tiktokResponse"
              name="tiktokResponse"
              label="Chép tiktok response vào đây để lấy token"
              value={titktokResponse}
              onChange={(e) => setTiktokResponse(e.target.value)}
            />
          </CRow>
          <CRow className="mt-3">
            <CCol md={12}>
              <CFormTextarea
                type="text"
                id="accessToken"
                name="accessToken"
                label="Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={12}>
              <CFormTextarea
                type="text"
                id="refreshToken"
                name="refreshToken"
                label="Refresh Token"
                value={refreshToken}
                onChange={(e) => setRefreshToken(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3 d-flex justify-content-center">
            <CButtonGroup className="col-6">
              <CButton color="primary" onClick={handleAddShop}>
                Add Shop
              </CButton>
            </CButtonGroup>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default AddShop
