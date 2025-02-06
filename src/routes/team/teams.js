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
    CFormInput,
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
    cilGroup
} from '@coreui/icons'

import apiRequest from '../../lib/apiRequest'
import AddTeam from './addTeam'
import AddMember from './addMember'
import Toggle from 'react-toggle'
import "react-toggle/style.css";
import MultiSelect from 'multiselect-react-dropdown'
import { format } from 'timeago.js'

const Teams = () => {
    const [visibleAddTeam, setVisibleAddTeam] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [visibleMember, setVisibleMember] = useState(false)
    const [teams, setTeams] = useState([])
    const [flagAddTeam, setFlagAddTeam] = useState(null)

    const [shops, setShops] = useState([]);

    // search
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSearchResults, setTempSearchResults] = useState([]);
    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        const getTeams = async () => {
            const res = await apiRequest.get('/teams', {
                params: {
                    page,
                    limit,
                    sort
                }
            }).then(res => {
                setTeams(res.data.teams)
                setTotal(res.data.total);
                setTotalPages(Math.ceil(res.data.total / limit));

                apiRequest.get('/shops')
                    .then(res => {
                        setShops(res.data.shops)
                    })
            })
        }
        getTeams()
        setFlagAddTeam(null)
    }, [flagAddTeam, page, limit, sort]);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team)
        setVisibleMember(true)
    }

    const toggleTeamStatus = async (team) => {
        try {
            await apiRequest.put(`/teams/${team.id}`, { isActive: team.isActive ? 0 : 1 });
            setFlagAddTeam(1)
        } catch (error) {
            console.log(error);
        }
    }

    const onChange = () => {
        setFlagAddTeam(1)
    }

    const handleSearchChange = (e) => {
        e.preventDefault();
        if (!e.target.value) {
            window.location.reload();
        }
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        setTempSearchResults(teams);
        const filteredTeams = tempSearchResults.filter(team => {
            return team.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setTeams(filteredTeams);
    }, [searchTerm]);

    // search filter
    const searchBy = (selectedList, selectedItem) => {
        if (selectedList.length === 0) {
            window.location.reload();
        }
        let selectedTeamFromShop = [];
        selectedList.forEach(team => {
            selectedTeamFromShop.push(team.id);
        });
        setTeams(teams.filter(team => selectedTeamFromShop.includes(team.id)));
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

    return (
        <>
            <AddTeam visible={visibleAddTeam} setVisible={setVisibleAddTeam} onChange={onChange} />
            <AddMember visible={visibleMember} setVisible={setVisibleMember} onChange={onChange} team={selectedTeam} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách nhóm
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block mb-3">
                    <CButton color="primary" className="float-end" onClick={() => setVisibleAddTeam(true)}>
                        <CIcon icon={cilPlus} /> Tạo nhóm
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol className='col-3'>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Tìm theo tên nhóm"
                            aria-label="Tìm theo tên nhóm"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol className='col-3'>
                    <MultiSelect
                        displayValue='name'
                        options={shops}
                        onSelect={searchBy}
                        onRemove={searchBy}
                        placeholder='Chọn shop'
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CTable align="middle" className="mb-0" responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">Nhóm</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Số thành viên
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Ngày tạo
                                        </CTableHeaderCell>
                                        {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Tình trạng
                                        </CTableHeaderCell> */}
                                        <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {teams.map((team, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                {team.name}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{team.members.length}</div>
                                            </CTableDataCell >
                                            <CTableDataCell className="text-center">
                                                {format(team.createdAt)}
                                            </CTableDataCell>
                                            {/* <CTableDataCell className="text-center">
                                                <Toggle
                                                    className='mt-2 me-2'
                                                    defaultChecked={team.isActive}
                                                    id="isActive"
                                                    name='isActive'
                                                    value={team.isActive ? "yes" : "no"}
                                                    onChange={() => toggleTeamStatus(team)}
                                                />
                                            </CTableDataCell> */}
                                            <CTableDataCell>
                                                <CButton color='warning' size="sm" className='ms-2' onClick={() => handleSelectTeam(team)}>
                                                    <CIcon icon={cilGroup} className="me-2 " />
                                                    Thành viên
                                                </CButton>
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

export default Teams
