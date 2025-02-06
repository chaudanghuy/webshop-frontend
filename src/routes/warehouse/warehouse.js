import React, { useEffect, useState } from 'react'

import {
    CAvatar,
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFooter,
    CForm,
    CFormCheck,
    CFormInput,
    CFormTextarea,
    CImage,
    CInputGroup,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CProgress,
    CRow,
    CSpinner,
    CToast,
    CToastBody,
    CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilBell,
    cilCog,
    cilPlus,
    cilReload,
    cilX
} from '@coreui/icons'

import { format } from 'timeago.js'
import apiRequest from '../../lib/apiRequest'
import MultiSelect from 'multiselect-react-dropdown'
import { ToastNoti } from '../../components/notification/ToastNoti'

import DataTable from "react-data-table-component";
import 'react-quill/dist/quill.snow.css'

const Warehouses = () => {

    // Toast Noti
    const [toast, setToast] = useState(null);

    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {        
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        await apiRequest.get('/orders/tiktok/all-orders')
            .then((res) => {
                console.log(res.data);
                setOrders(res.data);
                setNoneFilterOrders(res.data);
            });
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };    

    const columns = [
        {
            name: <CFormCheck checked={selectAll} onChange={() => setSelectAll(!selectAll)} />,
            cell: (row) => (
                <CFormCheck
                    checked={selectedRows.includes(row.id)}
                    onChange={() => setSelectedRows(
                        selectedRows.includes(row.id) ? selectedRows.filter(id => id !== row.id) : [...selectedRows, row.id]
                    )}
                />
            ),
            width: "50px",
        },
        { name: "Order", selector: (row) => row.id, sortable: true, width: "150px" },
        {
            name: "Items",
            cell: (row) => (
                <div>
                    {row.line_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <CAvatar src={item.sku_image} alt={item.product_name} className="w-10 h-10 object-cover" />
                            <span>{item.product_name} - ${item.sale_price}</span>
                        </div>
                    ))}
                </div>
            ),
            width: "300px",
        },
        { name: "Total Price", selector: (row) => `$${row.payment.total_amount}`, sortable: true, width: "120px" },
        {
            name: "Status",
            cell: (row) => (
                <div>
                    <CBadge color={row.status === "COMPLETED" ? "success" : "warning"}>{row.status}</CBadge>
                    <div className="text-xs text-gray-500">{format(row.update_time * 1000)}</div>
                </div>
            ),
            sortable: true,
            width: "150px",
        },
        {
            name: "Shipping",
            cell: (row) => (
                <div>
                    <div>{row.recipient_address.name}</div>
                    <div className="text-xs text-gray-500">{row.recipient_address.full_address}</div>
                </div>
            ),
            width: "250px",
        },
    ];

    return (
        <>
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Warehouse ({orders.length})
                        <CButton color="warning" className="ms-2 mb-2" onClick={() => syncOrders()}>
                            <CIcon icon={cilReload} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Search by Order ID, SKU, or Product"
                            aria-label="Search by Order ID, SKU, or Product"
                            aria-describedby="basic-addon2"
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            type="date"
                            placeholder="From"
                            aria-label="From"
                            aria-describedby="basic-addon2"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                        />
                        <CFormInput
                            type="date"
                            placeholder="To"
                            aria-label="To"
                            aria-describedby="basic-addon2"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={shops}
                        value={filterShops}
                        onSelect={filterByShop}
                        onRemove={filterByShop}
                        placeholder='Lọc theo shop'
                    />
                </CCol>
                <CCol>
                    <CDropdown>
                        <CDropdownToggle color='white'>
                            <CIcon icon={cilCog} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>
                                <strong>SẮP XẾP THEO</strong>
                            </CDropdownItem>
                            <CDropdownItem onClick={() => setSortBy("dateCreated")} className={sortBy === "dateCreated" ? 'active' : ''}>Ngày tạo</CDropdownItem>
                            <CDropdownItem onClick={() => setSortBy("dateUpdated")} className={sortBy === "dateUpdated" ? 'active' : ''}>Ngày cập nhật</CDropdownItem>
                            <CDropdownItem onClick={() => setSortBy("id")} className={sortBy === "id" ? 'active' : ''}>ID</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            {loading ? (
                                <div className="d-fflex justify-center items-center h-32">
                                    <CSpinner size="lg" />
                                </div>
                            ) : (
                                <DataTable
                                    className='table table-hover'
                                    columns={columns}
                                    data={orders}
                                    pagination
                                    highlightOnHover
                                    noHeader
                                    fixedHeader
                                    responsive={true}
                                />
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Warehouses