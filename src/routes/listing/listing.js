import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

const Listing = () => {
    const navigate = useNavigate();

    const redirect = () => {
        navigate('/listings');
    }

    return (
        <>
            <CButton className='mb-2' color="warning" onClick={redirect}> 
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                Cập nhật sản phẩm
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm className="row g-3">
                                <div className="clearfix">
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CImage className='m-2' rounded src="/images/react400.jpg" width={200} height={200} />
                                    <CButton color="primary" className='m-2'>
                                        <CIcon icon="cil-cloud-upload" /> Upload
                                    </CButton>
                                </div>
                                <CCol md={6}>
                                    <CFormInput type="email" id="inputEmail4" label="Mã sản phẩm" />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput type="password" id="inputPassword4" label="Giá" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="inputAddress" label="Tên sản phẩm" placeholder="1234 Main St" />
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress2">Mô tả</CFormLabel>
                                    <ReactQuill theme="snow" />
                                </CCol>
                                <CCol xs={12} className='d-flex justify-content-center'>
                                    <CButton color="success" type="submit">
                                        Cập nhật sản phẩm
                                    </CButton>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Listing;
