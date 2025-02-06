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
    CToastBody
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import CIcon from "@coreui/icons-react";
import { cilAlarm, cilBell, cilCheck, cilNoteAdd, cilPlus, cilTrash, cilX } from "@coreui/icons";
import 'react-quill/dist/quill.snow.css';
import "./addTeam.css";
import { ToastNoti } from "../../components/notification/ToastNoti";

const AddMember = ({ visible, setVisible, onChange, team }) => {

    const openModal = () => setVisible(true);
    const closeModal = () => {
        onChange();
        setVisible(false)
    };

    return (
        <div className="app">
            <CModal visible={visible} onClose={closeModal} alignment="center" size="xl" scrollable>
                <CModalHeader>
                    <CModalTitle>Quản lý nhóm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ModalContent onClose={closeModal} team={team} />
                </CModalBody>
            </CModal>
        </div>
    );
};

const ModalContent = ({ onClose, team }) => {
    const [teamName, setTeamName] = useState(team.name);
    const [teamMessage, setTeamMessage] = useState('');
    const [members, setMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState(team.members || []);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await apiRequest.get("/users");
                setMembers(response.data.users.filter(item => item.teamId === team.id || item.teamId === null));
            } catch (error) {
                console.log(error);
            }
        }

        fetchMembers();
    }, [teamMembers]);

    const editTeam = async () => {
        try {
            apiRequest.put(`/teams/${team.id}`, { name: teamName });
            setTeamMessage("Sửa thành công");
            setTimeout(() => {
                setTeamMessage("");
            }, 2000);
        } catch (error) {
            setTeamMessage("Tạo thất bại");
            console.log(error);
        }
    }

    const addMemberToTeam = async (memberId) => {
        try {
            await apiRequest.post(`/teams/${team.id}/members`, { userId: memberId });
            setTeamMembers([...teamMembers, memberId]);
            handleShowToast();
        } catch (error) {
            console.log(error);
        }
    }

    const removeMemberFromTeam = async (memberId) => {
        try {
            await apiRequest.delete(`/teams/${team.id}/members`, { data: { userId: memberId } });
            setTeamMembers(teamMembers.filter(memberId => memberId !== memberId));
            handleShowToast();
        } catch (error) {
            console.log(error);
        }
    }

    const filterMembers = (term) => {
        const filteredMembers = members.filter(member => member.name.toLowerCase().includes(term.toLowerCase()));
        setMembers(filteredMembers);
    }

    const handleShowToast = () => {
        setToast(
            <CToast>
                <CToastHeader closeButton>
                    <CIcon icon={cilBell} className="me-2" />
                    <div className="fw-bold me-auto">Thông báo hệ thống</div>
                    <small>Just now</small>
                </CToastHeader>
                <CToastBody>Thêm thành viên vào nhóm thanh cong!</CToastBody>
            </CToast>
        )
    }

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <div className="modal-body">
                <div className="column input-section">
                    <h5>Nhập tên nhóm</h5>
                    <input
                        type="text"
                        className="form-control mb-3"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Tên nhóm"
                    />
                    {teamMessage && <p className="text-danger">{teamMessage}</p>}
                    <CButton className="text-center" color="warning" onClick={editTeam}>Sửa tên</CButton>
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
                                        <CTableHeaderCell></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {members.map((member, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>
                                                {member.username}
                                            </CTableDataCell>
                                            <CTableDataCell>{member.email}</CTableDataCell>
                                            <CTableDataCell>
                                                {member.teamId == team.id || member.teamId == null && (
                                                    <CButton color="warning" className="me-2" onClick={() => addMemberToTeam(member.id)}>
                                                        <CIcon icon={cilPlus} /> Thêm
                                                    </CButton>
                                                )}
                                                {member.teamId == team.id && (
                                                    <CButton color="danger" onClick={() => removeMemberFromTeam(member.id)}>
                                                        <CIcon icon={cilTrash} /> Xóa
                                                    </CButton>
                                                )}
                                            </CTableDataCell>
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

export default AddMember
