import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useState } from 'react'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CLink,
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
    cilHouse,
    cilReload,
    cilTrash,
    cilLinkAlt,
    cilPencil,
    cilAppsSettings,
    cilCheck,
    cilBan
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../../views/widgets/WidgetsBrand'
import WidgetsDropdown from '../../views/widgets/WidgetsDropdown'
import MainChart from '../../views/dashboard/MainChart'

import apiRequest from '../../lib/apiRequest'
import { useNavigate } from 'react-router-dom'
import DeleteProxy from './deleteProxy'

const Proxies = () => {
    const [visible, setVisible] = useState(false)
    const [proxies, setProxies] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        apiRequest('/proxy').then((res) => {
            setProxies(res.data)
        })
    }, [])

    const addProxy = () => {
        navigate('/proxy')
    }

    const openDeleteModal = (id) => {
        setVisible(true)
        setDeleteId(id)
    }

    const handleProxyStatus = (id, status) => {
        apiRequest.put(`/proxy/${id}`, { isActive: status }).then(() => {
            apiRequest('/proxy').then((res) => {
                setProxies(res.data)
            })
        })
    }

    const removeProxy = () => {
        try {
            const id = deleteId
            apiRequest.delete(`/proxy/${id}`).then(() => {
                apiRequest('/proxy').then((res) => {
                    setProxies(res.data)
                })
            })
            setVisible(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <DeleteProxy visible={visible} setVisible={setVisible} removeProxy={removeProxy} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Cấu hình Proxy
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block mb-3">
                    <CButton color="primary" className="float-end" onClick={() => addProxy()}>
                        <CIcon icon={cilPlus} /> Thêm mới proxy
                    </CButton>
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
                                            <CIcon icon={cilAppsSettings} /> Proxy
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Loại
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Hostname
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">Port</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Active</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {proxies.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.type}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.hostname}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{item.port}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton color={item.isActive == 1 ? 'success' : 'danger'} size="sm">
                                                    {item.isActive == 1 ? 'Active' : 'Inactive'}
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton className='me-2 text-white' color="danger" size="sm" onClick={() => openDeleteModal(item.id)}>
                                                    <CIcon icon={cilTrash} className="me-2" />
                                                    Delete
                                                </CButton>                                                
                                                {item.isActive == 1 ? (
                                                    <CButton className='me-2' color="warning" size="sm" onClick={() => handleProxyStatus(item.id, 0)}>
                                                        <CIcon icon={cilBan} className="me-2" />
                                                        Disable
                                                    </CButton>
                                                ) : (
                                                    <CButton className='me-2' color="success" size="sm" onClick={() => handleProxyStatus(item.id, 1)}>
                                                        <CIcon icon={cilCheck} className="me-2" />
                                                        Enable
                                                    </CButton>
                                                )}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Proxies