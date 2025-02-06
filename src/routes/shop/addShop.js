import React, { useEffect, useState } from "react";
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
    CToastBody
} from "@coreui/react";
import { ToastNoti } from "../../components/notification/ToastNoti";
import CIcon from "@coreui/icons-react";
import apiRequest from "../../lib/apiRequest";

const AddShop = ({ visible, setVisible }) => {
    const [shopName, setShopName] = useState('');
    const [shopId, setShopId] = useState('');
    const [cipher, setCipher] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [toast, setToast] = useState(null);

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

    const handleAddShop = async () => {
        try {
            const resp = await apiRequest.post('/shops', {
                name: shopName,
                tiktokShopId: shopId,
                tiktokShopCipher: cipher,
                accessToken: accessToken,
                shopRefreshToken: refreshToken
            });

            if (resp) {
                handleShowToast('Tạo shop thành công');
                // Thực hiện xử lý tạo shop ở đây
                setVisible(false);
            }            
        } catch (error) {
            
        }
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
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="text" id="name" name="name" label="Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="text" id="name" name="name" label="Shop ID" value={shopId}  onChange={(e) => setShopId(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="text" id="name" name="name" label="Cipher" value={cipher} onChange={(e) => setCipher(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormTextarea type="text" id="name" name="name" label="Access Token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormTextarea type="text" id="name" name="name" label="Refresh Token" value={refreshToken} onChange={(e) => setRefreshToken(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3 d-flex justify-content-center" >
                        <CButtonGroup className="col-6">
                            <CButton color="primary" onClick={handleAddShop}>Authorize Shop</CButton>
                        </CButtonGroup>
                    </CRow>
                </CForm>
            </CModalBody>
        </CModal>
    );
}

export default AddShop;
