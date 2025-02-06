import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CToast,
    CToastBody,
    CToastHeader
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { ToastNoti } from "../../components/notification/ToastNoti";
import CIcon from "@coreui/icons-react";
import { cilBell } from "@coreui/icons";

const ToggleShopModal = ({ visible, setVisible, shop, status }) => {

    // Toast
    const [toast, setToast] = useState(null); 
    
    useEffect(() => {
        console.log(shop);
    }, [shop]);

    const changeShopStatus = async () => {
        try {
            const response = await apiRequest.put('/shops/' + shop.id, {
                status: status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED'
            });
            if (response.status === 200) {                
                handleShowToast('Cập nhật thành công!');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) { }
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
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Cập nhật trạng thái shop</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Bấm đồng ý để chuyển thành {status === 'CONNECTED' ? 'khóa' : 'hoạt động'}</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Đóng
                    </CButton>
                    <CButton color="primary" onClick={() => makeDefaultShop()}>Đồng ý</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default ToggleShopModal