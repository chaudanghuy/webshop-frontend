import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from "@coreui/react";
import React, { useEffect } from "react";
import apiRequest from "../../lib/apiRequest";

const DeleteUser = ({ visible, setVisible, user, members, onChange, isDeleteMultiple }) => {    

    const deleteUserProcess = async () => {
        try {
            if (isDeleteMultiple) {
                const userIds = members.map(member => member.id);
                await apiRequest.delete(`/users/multi`, { data: { userIds: JSON.stringify(userIds) } });
            } else {
                await apiRequest.delete(`/users/${user.id}`);
            }            
            onChange(true);
            setVisible(false);
        } catch (error) {
            console.log(error);
            onChange(false);
        }
    }

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="deletUserTitle"
        >
            <CModalHeader>
                <CModalTitle id="deletUserTitle">Xác nhận xóa tài khoản</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>Bấm xóa để tiếp tục</p>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Đóng
                </CButton>
                <CButton color="primary" onClick={() => deleteUserProcess()}>Xóa</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default DeleteUser
