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
    CRow,
    CToast,
    CToastBody,
    CToastHeader,
} from '@coreui/react'
import {
    BellRing
} from 'lucide-react'
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilCloudDownload, cilCloudy, cilCopy, cilInputPower } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import { ToastNoti } from '../../components/notification/ToastNoti';

const Tool = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');
    const [message, setMessage] = useState('');
    const [toast, setToast] = useState(null);

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

    const downloadExtension = async () => {
        const downloadURL = "https://drive.google.com/file/d/1KUozbhWQFvqdk7JUyAsRI6QehMQBOT9x/view?usp=sharing";
        try {
            handleShowToast("Tiến hành tải..");
            const response = await fetch(downloadURL);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'amazon_crawl.zip';
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error);
        }
    }

    const handleShowToast = (message) => {
        setToast(
            <CToast>
                <CToastHeader closeButton>
                    <BellRing className="me-2" />
                    <div className="fw-bold me-auto">Thông báo hệ thống</div>
                    <small>Just now</small>
                </CToastHeader>
                <CToastBody>{message}</CToastBody>
            </CToast>
        )
    }

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <strong>
                                Tạo Token
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CButton className='mb-2' color="warning" onClick={downloadExtension}>
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
                                <CRow className='d-flex justify-content-center mt-2'>
                                    <CFormLabel>Xem cách hướng dẫn thêm extension trong Chrome:</CFormLabel>
                                    <CImage src="https://img.hoangweb.com/2014/08/install-external-chrome-extension1.png" width={600} height={600} />
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Tool;
