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
    CLink,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck,
    CInputGroup,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider,
    CFormSelect,
    CPagination,
    CPaginationItem,
    CBadge,
    CAlert,
    CFormLabel,
    CToast,
    CToastHeader,
    CToastBody
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
    cilThumbUp,
    cilThumbDown,
    cibGoogleCloud,
    cilArrowCircleTop,
    cilArrowCircleBottom,
    cilDisabled,
    cilToggleOff,
    cilViewQuilt,
    cilPencil,
    cilMagnifyingGlass,
    cilSync,
    cilBuilding,
    cilCog,
    cilToggleOn,
    cilStorage,
    cilBell,

} from '@coreui/icons'

import apiRequest from '../../lib/apiRequest'
import MultiSelect from 'multiselect-react-dropdown';
import "react-toggle/style.css";
import AddShop from './addShop'
import EditShop from './editShop'
import DefaultShopModal from './defaultShopModal'
import ToggleShopModal from './toggleShopStatus'
import AssignToModal from './assignTo'
import { ToastNoti } from "../../components/notification/ToastNoti";


const Shops = () => {
    const [shops, setShops] = useState([]);
    const [activeShops, setActiveShops] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    //TODO: Check default shop. If not found, set alert 
    const [requestUser, setRequestUser] = useState({});
    const [alert, setAlert] = useState('');

    // authorized shop
    const [visibleAuthShop, setVisibleAuthShop] = useState(false);

    // edit shop
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [shop2Edit, setShop2Edit] = useState({});

    // default shop
    const [requestShop, setRequestShop] = useState({});
    const [defaultShop, setDefaultShop] = useState(null);
    const [visibleDefault, setVisibleDefault] = useState(false);

    // toggle shop    
    const [visibleToggle, setVisibleToggle] = useState(false);

    // assign to
    const [visibleAssignTo, setVisibleAssignTo] = useState(false);

    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    // Toast
    const [toast, setToast] = useState(null);

    // enum
    const StatusEnum = {
        SHOP_STATUS: [
            { id: 'CONNECTED', name: 'CONNECTED' },
            { id: 'DISCONNECTED', name: 'DISCONNECTED' },
            { id: 'DEACTIVATED', name: 'DEACTIVATED' }
        ]
    };

    useEffect(() => {
        const getDefaultShop = async () => {
            try {
                const defaultShop = await apiRequest.post('/users/getDefaultShop');
                if (defaultShop.status === 200) {
                    setDefaultShop(defaultShop.data.defaultShop);
                }
                console.log(defaultShop);
            } catch (error) {
                setAlert(error.response.data.message);
                console.log(error);
            }
        }

        const getUserStorage = async () => {
            try {
                const user = localStorage.getItem('user');
                console.log(JSON.parse(user));
                setRequestUser(JSON.parse(user));
            } catch (error) {
                console.log(error);
            }
        }

        getDefaultShop();
        getUserStorage();
    }, []);

    useEffect(() => {
        const fetchShops = async () => {
            apiRequest('shops', {
                params: {
                    search: searchTerm,
                    page,
                    limit,
                    sort
                }
            }).then((res) => {
                setShops(res.data.shops);
                setTotal(res.data.total);
                setTotalPages(Math.ceil(res.data.total / limit));
            }).catch((err) => {
                console.log(err)
            })
        };

        fetchShops();
    }, [searchTerm, page, limit, sort]);

    const handleChangeShopStatus = (shopId, status) => {
        try {
            console.log(shopId, status);
        } catch (error) {
            console.log(error);
        }
    };

    const handleHeaderCheckboxChange = (e) => {
        e.preventDefault();
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setShops(shops.map(shop => {
            return {
                ...shop,
                checked: newSelectAll
            }
        }))
    }

    const handleProductCheckboxChange = (e, id) => {
        e.preventDefault();
        const checkShops = shops.map(shop => {
            if (shop.id === id) {
                return {
                    ...shop,
                    checked: !shop.checked
                }
            }
            return shop;
        });
        setShops(checkShops);
        setSelectAll(checkShops.every(listing => listing.checked));
    }

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    }

    // search filter
    const searchBy = (selectedList, selectedItem) => {
        console.log(selectedList);
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

    const editShop = (shop) => {
        setVisibleEdit(true);
        setShop2Edit(shop);
    }

    const processDefaultShop = (shop) => {
        try {
            setRequestShop(shop);
            setVisibleDefault(true);
        } catch (error) {
            console.log(error);
        }
    }

    const processToggleShop = (shop) => {
        try {
            setRequestShop(shop);
            setVisibleToggle(true);
        } catch (error) {
            console.log(error);
        }
    }

    const processAssignTo = (shop) => {
        try {
            setRequestShop(shop);
            setVisibleAssignTo(true);
        } catch (error) {
            console.log(error);
        }
    }

    const processSyncOrders = async (shop) => {
        try {
            const response = await apiRequest.get('/shops/sync-orders/' + shop.id);
            handleShowToast('Bắt đầu sync đơn hàng!');
        } catch (error) {
            console.log(error);
        }
    }

    const processSyncProducts = async (shop) => {
        try {
            const response = await apiRequest.get('/shops/sync-products/' + shop.id);
            handleShowToast('Bắt đầu sync sản phẩm!');
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

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <DefaultShopModal visible={visibleDefault} setVisible={setVisibleDefault} shop={requestShop} user={requestUser} />
            <ToggleShopModal visible={visibleToggle} setVisible={setVisibleToggle} shop={requestShop} status={requestShop.status} />
            <AddShop visible={visibleAuthShop} setVisible={setVisibleAuthShop} />
            <EditShop visible={visibleEdit} setVisible={setVisibleEdit} shop={shop2Edit} />
            <AssignToModal visible={visibleAssignTo} setVisible={setVisibleAssignTo} shop={requestShop} user={requestUser} />
            {alert && <CAlert color="warning">{alert}</CAlert>}
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Danh sách Shop
                        <CButton color="" className="ms-2 mb-2 border-1 border-dark">
                            <CIcon icon={cilSync} className="me-1" />
                        </CButton>
                    </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                    <CButton color="warning" className="float-end" onClick={() => setVisibleAuthShop(true)}>
                        <CIcon icon={cilPlus} /> Liên kết shop
                    </CButton>
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Tìm theo tên"
                            aria-label="Tìm theo tên"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Manager"
                            aria-label="Manager"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={StatusEnum.SHOP_STATUS}
                        onSelect={searchBy}
                        placeholder='Trạng thái shop'
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
                                            <CIcon icon={cilBuilding} /> Shop
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Profile
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Code
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Trạng thái
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {shops.map((shop, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell>
                                                <CFormCheck
                                                    className="form-check-input"
                                                    checked={shop.checked}
                                                    onChange={(e) => handleProductCheckboxChange(e, shop.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{shop.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{shop.profile}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <code>{shop.code}</code>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {shop.status === "authorized" || shop.status === "CONNECTED" ? (
                                                    <CBadge color="success">CONNECTED</CBadge>
                                                ) : (
                                                    <CBadge color="danger">{shop.status}</CBadge>
                                                )}
                                                {defaultShop && defaultShop.id == shop.id && <CFormLabel className="ms-2 font-bold">SHOP MẶC ĐỊNH</CFormLabel>}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton color='warning' size="sm" className='me-2 mb-2' onClick={() => editShop(shop)}>
                                                    <CIcon icon={cilPencil} className='me-2' />
                                                    Sửa
                                                </CButton>
                                                {shop.status === "authorized" || shop.status === "CONNECTED" ? (
                                                    <CButton color="danger" size="sm" className='me-2 mb-2' onClick={() => processToggleShop(shop)}>
                                                        <CIcon icon={cilToggleOff} className='me-2 danger' />Tắt Shop
                                                    </CButton>
                                                ) : (
                                                    <CButton color="success" size="sm" className='me-2 mb-2' onClick={() => processToggleShop(shop)}>
                                                        <CIcon icon={cilToggleOn} className='me-2 success' />Kích hoạt Shop
                                                    </CButton>
                                                )}
                                                <CButton color="primary" size="sm" className='me-2 mb-2' onClick={() => processSyncOrders(shop)}>
                                                    <CIcon icon={cilSync} className='me-2' />
                                                    Sync đơn hàng
                                                </CButton>
                                                <CButton color="primary" size="sm" className='me-2 mb-2' onClick={() => processSyncProducts(shop)}>
                                                    <CIcon icon={cilSync} className='me-2' />
                                                    Sync sản phẩm
                                                </CButton>
                                                <CButton color="secondary" size="sm" className='me-2 mb-2' onClick={() => processAssignTo(shop)}>
                                                    <CIcon icon={cilUser} className='me-2' />
                                                    Assign to
                                                </CButton>
                                                {defaultShop && defaultShop.id != shop.id && <CButton color="danger" size="sm" className='me-2 mb-2 color-white' onClick={() => processDefaultShop(shop)}>
                                                    <CIcon icon={cilHouse} className='me-2 color-white' />
                                                    Make default
                                                </CButton>}
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
            </CRow >
        </>
    )
}

export default Shops
