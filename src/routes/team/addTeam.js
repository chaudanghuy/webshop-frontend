import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

import "./addTeam.css";

const AddTeam = ({ visible, setVisible, onChange }) =>{

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);    

    return (
        <div className="app">
            <CModal visible={visible} onClose={closeModal} alignment="center" size="lg" scrollable>
                <CModalHeader>
                    <CModalTitle>Tạo nhóm mới</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ModalContent onClose={closeModal} onChange={onChange}/>
                </CModalBody>
            </CModal>
        </div>
    );
};

const ModalContent = ({ onClose, onChange }) => {
    const [teamName, setTeamName] = useState('');
    const [teamMessage, setTeamMessage] = useState('');       

    const addTeam = async () => {
        try {
            apiRequest.post("/teams", { name: teamName });
            onClose();
            onChange();
        } catch (error) {
            setTeamMessage("Tạo thất bại");
            console.log(error);
        }
    }

    return (
        <div className="modal-body">
            <div className="column input-section">
                <input
                    type="text"
                    className="form-control mb-3"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Tên nhóm"
                />
                {teamMessage && <p className="text-danger">{teamMessage}</p>}
                <CButton className="text-center" color="primary" onClick={addTeam}>Tạo</CButton>
            </div>            
        </div>
    );
}

export default AddTeam

