import { 
    CButton, 
    CModal, 
    CModalBody, 
    CModalFooter, 
    CModalHeader, 
    CModalTitle 
} from "@coreui/react";
import React from "react";

const LinkShop = ({ visible, setVisible }) => {
    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Xác nhận xóa sản phẩm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>Bấm xóa để tiếp tục</p>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Đóng
                </CButton>
                <CButton color="primary">Xóa</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default LinkShop
