import React, { useEffect, useState } from 'react'
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
    CFormText,
    CFormTextarea,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCloudDownload, cilCloudy, cilCopy, cilInputPower } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

const Tool = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                apiRequest.get('/settings').then(res => {
                    saveTokenToLocalStorage(res.data.accessToken);
                    setAccessToken(res.data.accessToken);
                });
            } catch (error) {
                console.log(error);
            }
        }

        fetchSetting();
    }, []);

    const updateSetting = async (e) => {
        e.preventDefault();
        try {
            apiRequest.post('/settings').then(res => {
                saveTokenToLocalStorage(res.data.accessToken);
                setAccessToken(res.data.accessToken);
            });
        } catch (error) {

        }
    }

    const saveTokenToLocalStorage = (token) => {
        localStorage.setItem('crawlAccessToken', token);
    }

    const redirect = () => {
        navigate('/listings');
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(accessToken);
        setMessage('Sao chép thành công!');
        setTimeout(() => {
            setMessage('');
        }, 2000);
    }

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                Tạo Token
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CButton className='mb-2' color="warning" onClick={redirect}>
                                <CIcon icon={cilCloudDownload} className="me-1" /> Tải tiện ích
                            </CButton>
                            <CButton className='float-end' color="primary" onClick={copyToClipboard}>
                                <CIcon icon={cilCopy} className="me-1" /> Sao chép
                            </CButton>
                            <CForm className="row">
                                <CCol xs={12}>
                                    <CFormTextarea
                                        placeholder="Leave a comment here"
                                        id="floatingTextarea2"
                                        floatingLabel="Comments"
                                        style={{ height: '100px' }}
                                        value={accessToken}
                                        readOnly
                                    >
                                    </CFormTextarea>
                                </CCol>
                                <CCol xs={12} className='d-flex justify-content-center mt-2'>
                                    <CButton color="info" onClick={updateSetting}>
                                        <CIcon icon={cilInputPower} className="me-1" /> Tạo Token
                                    </CButton>
                                </CCol>
                                <CFormText className="text-muted" style={{ textAlign: 'center' }} >
                                    {message}
                                </CFormText>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Tool;
