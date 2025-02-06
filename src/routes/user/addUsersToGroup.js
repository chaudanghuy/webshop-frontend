import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormText,
    CFormTextarea,
    CImage,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableDataCell,
    CTableRow,
    CFormCheck,
    CAvatar,
    CInputGroup,
    CToast,
    CToastHeader,
    CToastBody,
    CFormSelect
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import CIcon from "@coreui/icons-react";
import { cilAlarm, cilBell, cilCheck, cilNoteAdd, cilPlus, cilTrash, cilX } from "@coreui/icons";
import 'react-quill/dist/quill.snow.css';
import "./addUsersToGroup.css";
import { ToastNoti } from "../../components/notification/ToastNoti";
import MultiSelect from "multiselect-react-dropdown";
import { format } from 'timeago.js'

const AddUsersToGroup = ({ visible, setVisible, members, onChange }) => {

    const openModal = () => setVisible(true);
    const closeModal = () => {
        setVisible(false)
        onChange(true);        
    };

    return (
        <div className="app">
            <CModal visible={visible} onClose={closeModal} alignment="center" size="xl" scrollable>
                <CModalHeader>
                    <CModalTitle>Thêm vào nhóm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ModalContent members={members} onClose={closeModal} />
                </CModalBody>
            </CModal>
        </div>
    );
};

const ModalContent = ({ members, onClose }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [teams, setTeams] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await apiRequest.get("/teams");
                setSelectedUserIds(members.map(member => member.id));
                setTeams(response.data.teams);
            } catch (error) {
                console.log(error);
            }
        }        

        fetchTeams();
    }, [members]);

    const handleAddTeamProcess = async () => {
        try {
            if (selectedTeam === null) {
                throw new Error("Vui lồng chọn nhóm");
            }
            const data = {
                userIds: JSON.stringify(selectedUserIds),
                teamId: selectedTeam
            }

            const response = await apiRequest.post("/users/addToGroup", data);     
            handleShowToast('Thêm thành viên vào nhóm thanh cong!');
            onClose();       
        } catch (error) {
            handleShowToast(error.response.data.message);
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

    const searchBy = (selectedList, selectedItem) => {
        console.log(selectedList);
    }

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <div className="modal-body">
                <div className="column input-section">
                    <h5>Nhóm</h5>
                    {teams && teams.length > 0 &&
                        <CFormSelect onChange={(e) => setSelectedTeam(e.target.value)}>
                            <option value="">Chọn nhóm</option>
                            {teams.map((team, index) => (
                                <option key={index} value={team.id}>{team.name}</option>
                            ))}
                        </CFormSelect>
                    }
                    <CRow className="mt-3 d-flex justify-content-center">
                        <CCol md={6}>
                            <CButton color="primary" onClick={handleAddTeamProcess}>
                                Thêm
                            </CButton>
                        </CCol>
                    </CRow>
                </div>
                <div className="column product-list">
                    <div className="header-fixed">
                        <h5>Danh sách thành viên</h5>
                    </div>
                    <div className="scrollable">
                        {members.length > 0 ? (
                            <CTable striped>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Tên</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Nhóm hiện tại</CTableHeaderCell>
                                        <CTableHeaderCell>Ngày tạo</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {members.map((member, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>
                                                {member.username}
                                            </CTableDataCell>
                                            <CTableDataCell>{member.email}</CTableDataCell>
                                            <CTableDataCell>{member.team && member.team.name}</CTableDataCell>
                                            <CTableDataCell>{format(member.createdAt)}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <p>Chưa có thành viên</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddUsersToGroup
