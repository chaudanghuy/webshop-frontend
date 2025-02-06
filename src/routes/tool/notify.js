import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormTextarea,
    CRow,
    CToast,
    CToastBody,
    CToastHeader,
} from '@coreui/react'
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import { ToastNoti } from '../../components/notification/ToastNoti';
import CIcon from '@coreui/icons-react';
import { cilBell } from '@coreui/icons';


const Notify = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [setting, setSetting] = useState({});
    const [telegramToken, setTelegramToken] = useState('');
    const [telegramReceiver, setTelegramReceiver] = useState('');

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                apiRequest.get('/settings').then(res => {
                    setSetting(res.data);
                    setTelegramToken(res.data.telegramToken);
                    setTelegramReceiver(res.data.telegramReceiver);
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
            apiRequest.put('/settings', {
                telegramToken: telegramToken,
                telegramReceiver: telegramReceiver
            }).then(res => {
                handleShowToast('Cập nhật thành công!');
            });
        } catch (error) {
            console.log(error);
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
                                Telegram Token
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CCol xs={12}>
                                <CFormTextarea
                                    placeholder=""
                                    id="floatingTextarea2"
                                    floatingLabel="Nhập Telegram Token"
                                    style={{ height: '100px' }}
                                    value={telegramToken}
                                    onChange={(e) => setTelegramToken(e.target.value)}
                                />
                            </CCol>
                        </CCardBody>
                    </CCard>
                    <CCard className='mt-3'>
                        <CCardHeader>
                            <strong>
                                Chat ID nhận thông báo <a href="https://t.me/webshop_tiktok_bot" target="_blank" rel="noreferrer">(Đăng ký bot trước. Bấm vào đây)</a>
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CCol xs={12}>
                                <CFormTextarea
                                    placeholder=""
                                    id="floatingTextarea2"
                                    floatingLabel="Nhập Chat ID, cách nhau dấu ,"
                                    style={{ height: '100px' }}
                                    value={telegramReceiver}
                                    onChange={(e) => setTelegramReceiver(e.target.value)}
                                />
                            </CCol>
                        </CCardBody>
                    </CCard>
                    <CRow xs={12} className='d-flex justify-content-center mt-2'>
                        <CCol xs={4}>
                            <CButton color="warning" onClick={updateSetting}>
                                Save changes
                            </CButton>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    )
}

export default Notify;
