import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormTextarea,
  CImage,
  CInputGroup,
  CInputGroupText,
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

const EditListing = ({ visible, setVisible, listing }) => {
  const [images, setImages] = useState([])
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [listingName, setListingName] = useState('')
  const [description, setDescription] = useState('')
  const [dimension1, setDimension1] = useState('')
  const [dimension2, setDimension2] = useState('')
  const [dimension3, setDimension3] = useState('')
  const [crawlUrl, setCrawlUrl] = useState('')

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (listing) {
      setPrice(listing.price)
      setSku(listing.sku)
      setListingName(listing.name)
      setImages(listing.images)
      setDescription(listing.description)
      setCrawlUrl(listing.crawlUrl)
      if (listing.productDimension) {
        const dimensionsArr = listing.productDimension
          .split(' x ')
          .map((dim) => dim.replace(' inches', ''))
        setDimension1(dimensionsArr[0])
        setDimension2(dimensionsArr[1])
        setDimension3(dimensionsArr[2])
      }
    }
  }, [listing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      const res = await apiRequest.put(`/listings/${listing.id}`, {
        sku: sku,
        name: listingName,
        description: description,
        price: price,
        images: images,
        productDimension: `${dimension1} x ${dimension2} x ${dimension3} inches`,
      })

      handleShowToast('Cập nhật thành công!')
      setVisible(false)
      window.location.reload()
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
          <CModalTitle id="LiveDemoExampleLabel">Sản phẩm #{listing && listing.sku}</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex flex-column">
          <CRow className="mb-2 mt-2 d-flex justify-content-center">
            {listing &&
              images &&
              images.map((image, index) => (
                <CCol xs={3} key={index} className="position-relative">
                  <CImage
                    className="m-2 img-thumbnail"
                    rounded
                    src={image}
                    width={100}
                    height={100}
                  />
                  <CIcon
                    icon={cilX}
                    className="position-absolute top-0 float-start text-danger fw-bold"
                    onClick={() => {
                      const newImages = images.filter((img, i) => i !== index)
                      setImages(newImages)
                    }}
                  />
                </CCol>
              ))}
            <div className="text-center">
              <UploadWidget
                uwConfig={{
                  multiple: true,
                  cloudName: 'dg5multm4',
                  uploadPreset: 'estate_3979',
                  folder: 'posts',
                }}
                setState={setImages}
              />
            </div>
          </CRow>
          <CForm method="post" onSubmit={handleSubmit}>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormTextarea
                  id="crawlUrl"
                  name="crawlUrl"
                  label="Link amazon"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  readOnly
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="sku"
                  name="sku"
                  label="SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="price"
                  name="price"
                  label="Giá"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CFormLabel className="col-12">Dimension</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  id="dimension1"
                  name="dimension1"
                  placeholder=""
                  value={dimension1}
                  onChange={(e) => setDimension1(e.target.value)}
                />
                <CInputGroupText>x</CInputGroupText>
                <CFormInput
                  id="dimension2"
                  name="dimension2"
                  placeholder=""
                  value={dimension2}
                  onChange={(e) => setDimension2(e.target.value)}
                />
                <CInputGroupText>x</CInputGroupText>
                <CFormInput
                  id="dimension3"
                  name="dimension3"
                  placeholder=""
                  value={dimension3}
                  onChange={(e) => setDimension3(e.target.value)}
                />
              </CInputGroup>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormTextarea
                  id="name"
                  name="name"
                  label="Tên sản phẩm"
                  value={listingName}
                  onChange={(e) => setListingName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-5">
              <label className="col-12">Mô tả</label>
              <ReactQuill theme="snow" onChange={setDescription} value={listing && description} />
            </CRow>
            <div className="clearfix"></div>
            <CRow className="mt-5 d-flex justify-content-center">
              <CButton type="submit" color="primary" className=" col-3">
                Cập nhật sản phẩm
              </CButton>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default EditListing
