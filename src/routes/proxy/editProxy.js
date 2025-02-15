import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CFormTextarea,
  CImage,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest'
import DOMPurify from 'dompurify'
import CIcon from '@coreui/icons-react'
import { cilBell, cilPlus, cilTrash, cilX } from '@coreui/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ToastNoti } from '../../components/notification/ToastNoti'
import UploadWidget from '../../components/uploadWidget/UploadWidget'

const EditPoxy = ({ visible, setVisible, proxy }) => {
  const [name, setName] = useState('')
  const [shops, setShops] = useState([])
  const [shopId, setShopId] = useState('')
  const [type, setType] = useState('')
  const [hostname, setHostname] = useState('')
  const [port, setPort] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [toast, setToast] = useState(null)

  const PROXY_TYPE_ENUM = {
    HTTP: 'HTTP',
    HTTPS: 'HTTPS',
    SOCKS5: 'SOCKS5',
  }

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await apiRequest.get(`/shops`)
        setShops(res.data.shops)
      } catch (error) {
        console.log(error)
      }
    }

    if (proxy) {
      setName(proxy.name)
      setShopId(proxy.shopId)
      setType(proxy.type)
      setHostname(proxy.hostname)
      setPort(proxy.port)
      setUsername(proxy.username)
      setPassword(proxy.password)
      setIsActive(proxy.isActive)

      fetchShops()
    }
  }, [proxy])

  const selectShop = (e) => {
    console.log(e.target.value)
    setShopId(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const payload = {
      name: formData.get('name'),
      shopId: formData.get('shopId'),
      type: formData.get('type'),
      hostname: formData.get('hostname'),
      port: formData.get('port'),
      username: formData.get('username'),
      password: formData.get('password'),
      isActive: isActive,
    }

    try {
      const res = await apiRequest.put(`/proxy/${proxy.id}`, payload)

      handleShowToast('Cập nhật thành công!')
      setVisible(false)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      handleShowToast('Cập nhật lỗi. Xin vui lòng thử lại!')
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
    <>
      <ToastNoti toast={toast} setToast={setToast} />
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Chỉnh Proxy</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex flex-column">
          <CForm method="post" onSubmit={handleSubmit}>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormSelect name="shopId" defaultValue={shopId} onChange={(e) => selectShop(e)}>
                  <option>Chọn Shop</option>
                  {shops.map((shop) => (
                    <option value={shop.id} key={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  label="Tên proxy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormSelect name="type" defaultValue={type}>
                  <option value={PROXY_TYPE_ENUM.HTTP}>HTTP</option>
                  <option value={PROXY_TYPE_ENUM.HTTPS}>HTTPS</option>
                  <option value={PROXY_TYPE_ENUM.SOCKS5}>SOCKS5</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="hostname"
                  name="hostname"
                  label="Hostname"
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="port"
                  name="port"
                  label="Port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="port"
                  name="port"
                  label="Port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="username"
                  name="username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="password"
                  name="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CCol>
            </CRow>
            <div className="clearfix"></div>
            <CRow className="mt-5 d-flex justify-content-center">
              <CButton type="submit" color="primary" className=" col-3">
                Cập nhật
              </CButton>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default EditPoxy
