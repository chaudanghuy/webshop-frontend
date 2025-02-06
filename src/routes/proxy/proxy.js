import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormText,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPlus, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { auto } from '@popperjs/core';
import TreeSelect from '../../components/TreeSelect';
import apiRequest from '../../lib/apiRequest';

const Proxy = () => {
    const navigate = useNavigate();

    const [proxy, setProxy] = useState([]);
    const [error, setError] = useState('');

    const redirect = () => {
        navigate('/proxies');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await apiRequest.post('/proxy', {
                name: formData.get('name'),
                type: formData.get('type'),
                hostname: formData.get('hostname'),
                port: formData.get('port'),
                isActive: formData.get('isActive'),
                username: formData.get('username'),
                password: formData.get('password')
            });

            navigate('/proxies');
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        }
    };

    return (
        <>
            <CButton className='mb-3' color="warning" onClick={redirect}>
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CForm onSubmit={handleSubmit} method='post' className="row g-3">
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    Tạo Proxy
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <CCol xs={12}>
                                    <CFormInput id="name" name="name" label="Tên" placeholder="" aria-describedby='helpName' required/>
                                    <CFormText id="helpName">Tên cho cấu hình Proxy</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="inputAddress">Type</CFormLabel>
                                    <CFormSelect id="type" name='type' aria-describedby='helpType' required>
                                        <option>-- Select --</option>
                                        <option value="HTTP">HTTP</option>
                                        <option value="HTTPS">HTTPS</option>
                                        <option value="SOCKS5">SOCKS5</option>
                                    </CFormSelect>
                                    <CFormText id="helpType">Ví dụ: SOCKS5</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="hostname" name="hostname" label="Hostname" placeholder="" aria-describedby='helpHostname' required/>
                                    <CFormText id="helpHostname">Ví dụ: 127.0.0.1</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="port" name="port" label="Port" placeholder="" aria-describedby='helpPort' required/>
                                    <CFormText id="helpPort">Ví dụ: 8080</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput id="username" name="username" label="Username" placeholder="" aria-describedby='helpUsername' required/>
                                    <CFormText id="helpUsername">Ví dụ: admin</CFormText>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormInput type='password' id="password" name='password' label="Password" placeholder="" aria-describedby='helpPassword' required/>
                                    <CFormText id="helpPassword">Ví dụ: 123456789</CFormText>
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-3'>
                    <CCol xs={12} className='justify-content-center text-center'>
                        <CButton type='submit' className='mb-5' color="primary">
                            Lưu cài đặt
                        </CButton>
                    </CCol>
                </CRow>
            </CForm>
        </>
    )
}

export default Proxy;
