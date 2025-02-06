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


const Filter = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState({});
    const [asin, setAsin] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                apiRequest.get('/filters').then(res => {
                    setAsin(res.data.asin);
                });
            } catch (error) {
                console.log(error);
            }
        }

        fetchSetting();
    }, []);

    const updateFilter = async (e) => {
        e.preventDefault();
        try {
            apiRequest.put('/filters', {
                asin: asin
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
                                ASIN
                            </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CCol xs={12}>
                                <CFormTextarea
                                    placeholder=""
                                    id="floatingTextarea2"
                                    floatingLabel="Nhập danh sách ASIN. Cách nhau bằng dấu ,"
                                    style={{ height: '100px' }}
                                    value={asin}
                                    onChange={(e) => setAsin(e.target.value)}                                    
                                />
                            </CCol>
                        </CCardBody>
                    </CCard>
                    <CRow xs={12} className='d-flex justify-content-center mt-2'>
                        <CCol xs={4}>
                            <CButton color="warning" onClick={updateFilter}>
                                Save changes
                            </CButton>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    )
}

export default Filter;
