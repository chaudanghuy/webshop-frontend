import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";

const CrawlListing = ({ visible, setVisible }) => {    
    
    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Cập nhật sản phẩm hiện tại</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>Bấm refresh để lấy thông tin cào mới nhất</p>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Đóng
                </CButton>
                <CButton color="primary">Refresh</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default CrawlListing;
