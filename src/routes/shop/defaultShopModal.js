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

const DefaultShopModal = ({ visible, setVisible, shop, user }) => {

    // Toast
    const [toast, setToast] = useState(null); 
    
    useEffect(() => {
        console.log(shop);
    }, [shop]);

    const makeDefaultShop = async () => {
        try {
            const response = await apiRequest.put('/users/' + user.id, {
                defaultShop: shop.id
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
                    <CModalTitle id="LiveDemoExampleLabel">Cập nhật shop làm mặc định</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Bấm đồng ý để tiếp tục</p>
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

export default DefaultShopModal