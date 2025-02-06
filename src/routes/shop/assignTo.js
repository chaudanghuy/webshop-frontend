import {
    CButton,
    CCol,
    CFormLabel,
    CFormSelect,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CToast,
    CToastBody,
    CToastHeader
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { ToastNoti } from "../../components/notification/ToastNoti";
import CIcon from "@coreui/icons-react";
import { cilBell, cilPlus, cilTrash } from "@coreui/icons";
import "./assignTo.css";

const AssignToModal = ({ visible, setVisible, shop, user }) => {

    // Toast
    const [toast, setToast] = useState(null);

    // Team    
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [requestUser, setRequestUser] = useState({});

    // Members on shop
    const [membersOnShop, setMembersOnShop] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                await apiRequest.get('/users/members')
                    .then(res => {
                        setMembers(res.data);
                        if (shop.id) {
                            apiRequest.get('/shops/members-on-shop/' + shop.id)
                                .then(res2 => {
                                    setMembersOnShop(res2.data);
                                })
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchMembers();
    }, [shop]);

    // Assign member to shop
    const assignMemberToShop = async () => {
        try {
            const response = await apiRequest.put('/users/' + selectedMember, {
                shopId: shop.id
            })

            if (response.status === 200) {
                apiRequest.get('/shops/members-on-shop/' + shop.id)
                    .then(res2 => {
                        setMembersOnShop(res2.data);
                    })
                handleShowToast('Thêm thành viên nhóm thành công!');
            }
        } catch (error) {
            handleShowToast(error.response.data.message);
            console.log(error);
        }
    }

    // Remove member from shop
    const removeMemberFromShop = async (selectedMember) => {
        try {
            const response = await apiRequest.post('/users/removeDefaultShop/' + selectedMember, {
                shopId: shop.id
            })

            if (response.status === 200) {
                apiRequest.get('/shops/members-on-shop/' + shop.id)
                    .then(res2 => {
                        setMembersOnShop(res2.data);
                    })
                handleShowToast('Xóa thành viên nhóm thành công!');
            }
        }
        catch (error) {
            handleShowToast(error.response.data.message);
            console.log(error);
        }
    }

    // Assign managers to shop
    const assignManagersToShop = async () => {
        try {
            const response = await apiRequest.put('/shops/' + shop.id, {
                shopId: shop.id
            })

            if (response.status === 200) {
                handleShowToast('Thêm quản lý nhóm thành công!');
            }
        } catch (error) {
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

    const fetchTeam = async (team) => {
        try {
            console.log(team);
            setSelectedTeam(team);
            const response = await apiRequest.get('/teams/' + team);
            if (response.status === 200) {
                if (response.data.users.length > 0) {
                    setMembers(response.data.users);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="app">
            <ToastNoti toast={toast} setToast={setToast} />
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
                size="xl"
                scrollable
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Cập nhật shop #{shop.sku}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="modal-body">
                        <div className="column input-section">
                            <CRow className="mt-3 mb-3">
                                <CCol md={12}>
                                    <CFormLabel className="col-5 col-form-label">
                                        Thành viên
                                    </CFormLabel>
                                    <CFormSelect aria-label="Thành viên" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                                        <option>--Chọn thành viên--</option>
                                        {members && members.map((member, index) => (
                                            <option key={index} value={member.id}>{member.username}</option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mt-3 d-flex align-items-center">
                                <CButton className="text-center ms-auto" color="warning" onClick={assignMemberToShop}>Thêm</CButton>
                            </CRow>
                        </div>
                        <div className="column product-list">
                            <div className="header-fixed">
                                <h5>Danh sách thành viên quản lý</h5>
                            </div>
                            <div className="scrollable">
                                {membersOnShop.length > 0 ? (
                                    <CTable striped>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>Tên</CTableHeaderCell>
                                                <CTableHeaderCell>Email</CTableHeaderCell>
                                                <CTableHeaderCell></CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {membersOnShop.map((member, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>
                                                        {member.username}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{member.email}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {member.shops.includes(shop.id) ? <CButton color="danger" onClick={() => removeMemberFromShop(member.id)}>
                                                            <CIcon icon={cilTrash} /> Xóa
                                                        </CButton> : (
                                                            <CButton color="warning" className="me-2" onClick={() => addMemberToTeam(member.id)}>
                                                                <CIcon icon={cilPlus} /> Thêm
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
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default AssignToModal