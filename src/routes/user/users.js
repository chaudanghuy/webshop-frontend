import React, { useEffect, useState } from 'react'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormCheck,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CPagination,
    CPaginationItem,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cilPlus,
    cilPencil,
    cilTrash,
    cilCog
} from '@coreui/icons'

import avatarDefault from 'src/assets/images/avatars/default.png'

import WidgetsBrand from '../../views/widgets/WidgetsBrand'
import WidgetsDropdown from '../../views/widgets/WidgetsDropdown'
import MainChart from '../../views/dashboard/MainChart'
import EditUser from './editUser'
import AddUser from './addUser'

import apiRequest from '../../lib/apiRequest'
import { format } from 'timeago.js'
import MultiSelect from 'multiselect-react-dropdown'
import AddUsersToGroup from './addUsersToGroup'
import DeleteUser from './deleteUser'

const Users = () => {
    const [users, setUsers] = useState([])
    const [tempUsers, setTempUsers] = useState([])
    const [teams, setTeams] = useState([])

    //flag
    const [done, setDone] = useState(false);

    // show action
    const [showAction, setShowAction] = useState(false);

    // shops
    const [shops, setShops] = useState([]);

    // checkbox
    const [selectAll, setSelectAll] = useState(false);

    // search
    const [searchTerm, setSearchTerm] = useState('');
    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    // modal edit user
    const [visibleEdit, setVisibleEdit] = useState(false)    
    const [visibleAddMembersToGroup, setVisibleAddMembersToGroup] = useState(false)
    const [selectUser, setSelectUser] = useState({})

    // modal delete
    const [visibleDelete, setVisibleDelete] = useState(false)
    const [isDeleteMultiple, setIsDeleteMultiple] = useState(false)

    // modal add new user
    const [visibleAddUser, setVisibleAddUser] = useState(false)

    // modal add user to group or delete
    const [usersToModify, setUsersToModify] = useState([])


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiRequest.get('/users', {
                    params: {
                        page,
                        limit,
                        sort
                    }
                }).then(res => {
                    setUsers(res.data.users);
                    setTempUsers(res.data.users);
                    setTotal(res.data.total);
                    setTotalPages(Math.ceil(res.data.total / limit));

                    apiRequest.get('/shops')
                        .then(res => {
                            setShops(res.data.shops)
                        })
                });
            } catch (error) {
                console.log(error);
            }
        }

        fetchUsers();
        setIsDeleteMultiple(false);
        setDone(false)
    }, [done]);

    useEffect(() => {
        const filteredUsers = tempUsers.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        });
        setUsers(filteredUsers);
    }, [searchTerm]);

    const handleEditUser = (user) => {
        setVisibleEdit(true)
        setSelectUser(user)
    }

    const handleDeleteUser = (user) => {
        setVisibleDelete(true)
        setSelectUser(user)
    }

    const handleSearchChange = (e) => {
        e.preventDefault();
        if (!e.target.value) {
            window.location.reload();
        }
        setSearchTerm(e.target.value);
    }

    const handleLimitChange = (limit) => {
        setLimit(limit);
    }

    const handleSortChange = (sort) => {
        console.log(sort);
        setSort(sort);
        setPage(1);
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <CPaginationItem key={i} active={i === page} onClick={() => handlePageChange(i)}>{i}</CPaginationItem>
            );
        }
        return pageNumbers;
    }

    const handleHeaderCheckboxChange = (e) => {
        e.preventDefault();
        const newSelectAll = !selectAll;
        // setUploadStatusBtn(newSelectAll);
        setShowAction(newSelectAll);
        setSelectAll(newSelectAll);

        // set users with check
        const usersWithCheckFlag = users.map(user => {
            return {
                ...user,
                checked: newSelectAll
            }
        });
        setUsers(usersWithCheckFlag);
        setUsersToModify(usersWithCheckFlag.filter(user => user.checked));
    }

    const handleUserCheckboxChange = (e, id) => {
        e.preventDefault();
        const checkUsers = users.map(user => {
            if (user.id === id) {
                return {
                    ...user,
                    checked: !user.checked
                }
            }
            return user;
        });
        setUsers(checkUsers);
        setUsersToModify(checkUsers.filter(user => user.checked));
        setShowAction(checkUsers.some(user => user.checked));
        setSelectAll(checkUsers.every(user => user.checked));
    }

    const handleMultipleAction = (action) => {
        switch (action) {
            case 'addToTeam':                
                setVisibleAddMembersToGroup(true);                
                break;
            case 'deleteAll':
                setVisibleDelete(true);
                setIsDeleteMultiple(true);
                break;
            default:
                break;
        }
    }

    const searchByShop = (selectedList, selectedItem) => {
        if (selectedList.length === 0) {
            window.location.reload();
        }

        const selectedShop = selectedList.map(item => item.id);
        const usersHasShop = [];
        users.forEach(user => {
            if (user.shops.some(shop => selectedShop.includes(shop.id))) {
                usersHasShop.push(user);
            }
        });
        setUsers(usersHasShop);
    }

    const setModifyStatus = (status) => {
        setDone(status);
    }

    return (
        <>
            <EditUser visible={visibleEdit} setVisible={setVisibleEdit} user={selectUser} />
            <AddUser visible={visibleAddUser} setVisible={setVisibleAddUser} onChange={setModifyStatus} />
            <DeleteUser visible={visibleDelete} setVisible={setVisibleDelete} user={selectUser} members={usersToModify} onChange={setModifyStatus} isDeleteMultiple={isDeleteMultiple}/>
            <AddUsersToGroup  visible={visibleAddMembersToGroup} setVisible={setVisibleAddMembersToGroup} members={usersToModify} onChange={setModifyStatus}/>
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách user
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="primary" className="float-end mb-2" onClick={() => setVisibleAddUser(true)}>
                        <CIcon icon={cilPlus} /> Tạo mới tài khoản
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol className={showAction ? 'd-block' : 'd-none'}>
                    <CInputGroup className="mb-3">
                        <CFormSelect id='multipleAction'>
                            <option value="addToTeam">Thêm vào nhóm</option>
                            <option value="deleteAll">Xóa tất cả</option>
                        </CFormSelect>
                        <CButton type="button" color="primary" variant="outline" id="button-addon2" onClick={() => handleMultipleAction(document.getElementById('multipleAction').value)}>
                            Apply
                        </CButton>
                    </CInputGroup>
                </CCol>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Tìm theo email hoặc username"
                            aria-label="Tìm theo email hoặc username"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={shops}
                        onSelect={searchByShop}
                        onRemove={searchByShop}
                        placeholder='Lọc theo team'
                    />
                </CCol>
                <CCol>
                    <CDropdown>
                        <CDropdownToggle color='white'>
                            <CIcon icon={cilCog} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>
                                <strong>HIỂN THỊ</strong>
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(10)} className={limit === 10 ? 'active' : ''}>10</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(20)} className={limit === 20 ? 'active' : ''}>20</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(50)} className={limit === 50 ? 'active' : ''}>50</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(100)} className={limit === 100 ? 'active' : ''}>100</CDropdownItem>
                            <CDropdownItem onClick={() => handleLimitChange(500)} className={limit === 500 ? 'active' : ''}>500</CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem>
                                <strong>SẮP XẾP THEO</strong>
                            </CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("newest")} className={sort === "newest" ? 'active' : ''}>Mới nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("oldest")} className={sort === "oldest" ? 'active' : ''}>Cũ nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("updated_newest")} className={sort === "updated_newest" ? 'active' : ''}>Cập nhật mới nhất</CDropdownItem>
                            <CDropdownItem onClick={() => handleSortChange("updated_oldest")} className={sort === "updated_oldest" ? 'active' : ''}>Cập nhật cũ nhất</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            <CFormCheck
                                                className="form-check-input checkAddListing"
                                                checked={selectAll}
                                                onChange={(e) => handleHeaderCheckboxChange(e)}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Account
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className='bg-body-tertiary'>
                                            Email
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Ngày tạo
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Nhóm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            #
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {users.map((user, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                {user.isActive ? (
                                                    <CFormCheck
                                                        className="form-check-input"
                                                        checked={user.checked}
                                                        onChange={(e) => handleUserCheckboxChange(e, user.id)}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {user.isActive ?
                                                    <div className="fw-bold">
                                                        <CAvatar size="md" src={user.avatar || avatarDefault} /> {user.username}
                                                    </div> :
                                                    <div className='text-decoration-line-through'>
                                                        {user.username}
                                                    </div>
                                                }
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {user.isActive ?
                                                    <div className="fw-bold">
                                                        {user.email}
                                                    </div> :
                                                    <div className='text-decoration-line-through'>
                                                        {user.email}
                                                    </div>
                                                }
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{format(user.createdAt)}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="">
                                                {user.Team && user.isActive && user.Team.name ? user.Team.name : "Chưa có nhóm"}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {user.isActive ?
                                                    (
                                                        <>
                                                            <CButton color="info" size="sm" className='text-white' onClick={() => handleEditUser(user)}>
                                                                <CIcon icon={cilPencil} className="me-2" />
                                                                Sửa tài khoản
                                                            </CButton>
                                                            <CButton color="danger" size="sm" className="ms-2 text-white" onClick={() => handleDeleteUser(user)}>
                                                                <CIcon icon={cilTrash} className="me-2" />
                                                                Xóa
                                                            </CButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CButton color="secondary" size="sm" className='text-white'>
                                                                Tài khoản bị xóa
                                                            </CButton>
                                                        </>
                                                    )
                                                }
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                            <CPagination className='d-flex justify-content-center mt-3' aria-label="Page navigation example">
                                <CPaginationItem
                                    aria-label="Previous"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </CPaginationItem>
                                {renderPagination()}
                                <CPaginationItem
                                    aria-label="Next"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </CPaginationItem>
                            </CPagination>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Users
