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
import { BellRing } from "lucide-react";

const AddShop = ({ visible, setVisible }) => {
    const [authCode, setAuthCode] = useState('');    
    const [toast, setToast] = useState(null);

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

    const handleAddShop = async () => {
        try {
            const resp = await apiRequest.post('/shops', {
                tiktokAuthCode: authCode
            });

            if (resp) {
                handleShowToast('Tạo shop thành công');
                // Thực hiện xử lý tạo shop ở đây
                window.location.reload();
            }            
        } catch (error) {
            console.log(error);
            handleShowToast('Tạo shop không thành công');
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
                            <CFormTextarea type="text" id="name" name="name" label="Auth Code" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
                        </CCol>
                    </CRow>                
                    <CRow className="mt-3 d-flex justify-content-center" >
                        <CButtonGroup className="col-6">
                            <CButton color="primary" onClick={handleAddShop}>Add Shop</CButton>
                        </CButtonGroup>
                    </CRow>
                </CForm>
            </CModalBody>
        </CModal>
    );
}

export default AddShop;
