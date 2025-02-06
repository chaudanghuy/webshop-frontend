import React, { useEffect, useState } from 'react'

import {
    CAvatar,
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCardImage,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormCheck,
    CFormInput,
    CFormSelect,
    CImage,
    CInputGroup,
    CInputGroupText,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
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
    CToast,
    CToastBody,
    CToastHeader,
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
    cilPencil,
    cilTrash,
    cilEyedropper,
    cilLinkAlt,
    cilSearch,
    cilFilter,
    cilApplicationsSettings,
    cilCog,
    cilBell
} from '@coreui/icons'

import apiRequest from '../../lib/apiRequest'
import DeleteListing from './deleteListing'
import CrawlListing from './crawlListing'
import ViewListing from './viewListing'
import EditListing from './editListing'
import UploadToShop from './uploadToShop'
import { useNavigate } from 'react-router-dom'
import MultiSelect from 'multiselect-react-dropdown'
import { format } from 'timeago.js'
import { ToastNoti } from "../../components/notification/ToastNoti";

const Listings = () => {

    // enum
    const StatusEnum = {
        PRODUCT_STATUS: [
            { id: 'IN_REVIEW', name: 'IN-REVIEW' },
            { id: 'DRAFT', name: 'DRAFT' },
            { id: 'FAILED', name: 'FAILED' },
            { id: 'ACTIVATE', name: 'ACTIVATE' },
            { id: 'SELLER_DEACTIVATED', name: 'SELLER_DEACTIVATED' },
            { id: 'ACCOUNT_DEACTIVATED', name: 'ACCOUNT_DEACTIVATED' },
            { id: 'FREEZE', name: 'FREEZE' },
            { id: 'DELETED', name: 'DELETED' }
        ],
        PUBLISH_STATUS: [
            { id: 'PENDING', name: 'PENDING' },
            { id: 'PROCESSING', name: 'PROCESSING' },
            { id: 'ERROR', name: 'ERROR' },
            { id: 'NOT_PUBLISHED', name: 'NOT_PUBLISHED' }
        ]
    };

    // danh sach s/p
    const [listings, setListings] = useState([]);
    // paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');

    // filter risk
    const [filter, setFilter] = useState({});

    // listings on shops
    const [listingOnShops, setListingOnShops] = useState([]);

    // search
    const [searchTerm, setSearchTerm] = useState('');

    // crawl modal
    const [visibleCrawl, setVisibleCrawl] = useState(false)

    // delete modal
    const [deleteListingName, setDeleteListingName] = useState('');
    const [visible, setVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // detail listing modal
    const [visibleListing, setVisibleListing] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    // edit listing modal
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [editListing, setEditListing] = useState(null);

    // upload to shop modal
    const [visibleUpload, setVisibleUpload] = useState(false);
    const [uploadListings, setUploadListings] = useState(null);

    // checkbox
    const [selectAll, setSelectAll] = useState(false);

    // nút [đăng san pham]
    const [uploadStatusBtn, setUploadStatusBtn] = useState(false);

    // Toast
    const [toast, setToast] = useState(null);

    /**
     * Load listings
     * TODO: Add pagination
     */
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await apiRequest.get('/listings', {
                    params: {
                        page,
                        limit,
                        sort
                    }
                });
                setListings(res.data.listings);
                setTotal(res.data.total);
                setTotalPages(Math.ceil(res.data.total / limit));

            } catch (error) {
                console.log(error);
            }
        }

        fetchListings();
    }, [page, limit, sort]);

    useEffect(() => {
        const fetchListingsOnShops = async () => {
            try {
                const res = await apiRequest.get('/listings/listing-on-shops');
                console.log(res.data);
                setListingOnShops(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchFilter = async () => {
            try {
                const res = await apiRequest.get('/filters');
                setFilter(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchFilter();

        fetchListingsOnShops();
    }, []);

    useEffect(() => {
        const filteredListings = listings.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        });
        setListings(filteredListings);
    }, [searchTerm]);

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

    // search filter
    const searchBy = (selectedList, selectedItem) => {
        console.log(selectedList);
    }

    const handleSearchChange = (e) => {
        e.preventDefault();
        if (!e.target.value) {
            window.location.reload();
        }
        setSearchTerm(e.target.value);
    }

    // detail listing modal
    const callDetail = (id) => {
        try {
            const fetchListing = async () => {
                const res = await apiRequest.get(`/listings/${id}`);
                setSelectedListing(res.data);
            }
            fetchListing();
            setVisibleListing(true);
        } catch (error) {
            console.log(error);
        }
    }

    // edit listing modal
    const callEdit = (id) => {
        try {
            const fetchListing = async () => {
                const res = await apiRequest.get(`/listings/${id}`);
                // loop listing and add checked false
                setEditListing(res.data);
            }
            fetchListing();
            setVisibleEdit(true);
        } catch (error) {
            console.log(error);
        }
    }

    // modal dang san pham
    const callUpload = () => {
        try {
            const fetchListings = async () => {
                setUploadListings(listings.filter(listing => listing.checked));
            }
            fetchListings();
            setVisibleUpload(true);
        } catch (error) {
            console.log(error);
        }
    }

    // delete modal
    const callDelete = (id, name) => {
        setVisible(true);
        setDeleteId(id);
        setDeleteListingName(name);
    }

    const deleteListing = () => {
        try {
            const id = deleteId
            apiRequest.delete(`/listings/${id}`);
            setVisible(false);
            setListings(listings.filter(listing => listing.id !== id));
            handleShowToast(`Xóa sản phẩm thành công!`);
            setDeleteListingName('');
        } catch (error) {
            console.log(error);
        }
    }

    // checkbox
    const handleHeaderCheckboxChange = (e) => {
        e.preventDefault();
        const newSelectAll = !selectAll;
        setUploadStatusBtn(newSelectAll);
        setSelectAll(newSelectAll);
        setListings(listings.map(listing => {
            return {
                ...listing,
                checked: newSelectAll
            }
        }))
    }

    const handleProductCheckboxChange = (e, id) => {
        e.preventDefault();
        const checkListings = listings.map(listing => {
            if (listing.id === id) {
                return {
                    ...listing,
                    checked: !listing.checked
                }
            }
            return listing;
        });
        setListings(checkListings);
        setUploadStatusBtn(checkListings.some(listing => listing.checked));
        setSelectAll(checkListings.every(listing => listing.checked));
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    const handleLimitChange = (limit) => {
        setLimit(limit);
    }

    const handleSortChange = (sort) => {
        console.log(sort);
        setSort(sort);
        setPage(1);
    }

    return (
        <>
            <ToastNoti toast={toast} setToast={setToast} />
            <DeleteListing visible={visible} setVisible={setVisible} deleteListing={deleteListing} />
            <CrawlListing visible={visibleCrawl} setVisible={setVisibleCrawl} />
            <ViewListing visible={visibleListing} setVisible={setVisibleListing} listing={selectedListing} />
            <EditListing visible={visibleEdit} setVisible={setVisibleEdit} listing={editListing} />
            <UploadToShop visible={visibleUpload} setVisible={setVisibleUpload} listings={uploadListings} />
            <CRow>
                <CCol sm={5}>
                    <h4 id="traffic" className="card-title mb-0">
                        Sản phẩm cào ({total})
                        {/* <CButton color="warning" className="ms-2 mb-2" onClick={() => setVisibleCrawl(!visibleCrawl)}>
                            <CIcon icon={cilReload} className="me-1" />
                        </CButton> */}
                    </h4>
                </CCol>
            </CRow>
            <CRow className="mt-3">
                <CCol>
                    <CInputGroup className="mb-3">
                        <CFormInput
                            placeholder="Tìm theo mã hoặc tên"
                            aria-label="Tìm theo mã hoặc tên"
                            aria-describedby="basic-addon2"
                            onChange={handleSearchChange}
                        />
                    </CInputGroup>
                </CCol>
                {/* <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={StatusEnum.PRODUCT_STATUS}
                        onSelect={searchBy}
                        placeholder='Trạng thái sản phẩm'
                    />
                </CCol>
                <CCol>
                    <MultiSelect
                        displayValue='name'
                        options={StatusEnum.PUBLISH_STATUS}
                        placeholder='Trạng thái đăng sản phẩm'
                    />
                </CCol> */}
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
                <CCol className="d-none d-md-block">
                    <CButton color="primary" className="float-end" disabled={!uploadStatusBtn} onClick={() => callUpload()}>
                        <CIcon icon={cilPlus} /> Đăng sản phẩm
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
                                            <CFormCheck
                                                className="form-check-input checkAddListing"
                                                checked={selectAll}
                                                onChange={(e) => handleHeaderCheckboxChange(e)}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            <CIcon icon={cilHouse} /> Sản phẩm
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">

                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Giá
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Cào lúc
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary">
                                            Cập nhật lúc
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">
                                            Cửa hàng đăng lên
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Chức năng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {listings.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index} color={filter && filter.asin.includes(item.sku) ? 'danger' : ''}>
                                            <CTableDataCell>
                                                <CFormCheck
                                                    className="form-check-input"
                                                    checked={item.checked}
                                                    onChange={(e) => handleProductCheckboxChange(e, item.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CCardImage src={item.images[0]} className='rounded img-thumbnail w-50' />
                                                <div className="small text-medium-emphasis d-block text-start">#{item.sku}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div>{item.price}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{format(item.createdAt)}</div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div>{format(item.updatedAt)}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {listingOnShops && listingOnShops.map((los) => (
                                                    los.listingId === item.id ? (
                                                        <>
                                                            <div key={los.id} className="d-flex flex-row justify-content-between ">
                                                                <div class="p-2">{los.shop.name}</div>
                                                                <div class="p-2">{format(los.createdAt)}</div>
                                                                <div class="p-2">
                                                                    {los.status === 'FAILURE' ?
                                                                        <>
                                                                            <CBadge color='danger'>{los.status}</CBadge>
                                                                            <CLink color='info' href='#' target="_blank">
                                                                                <CIcon icon={cilReload} className="me-2" />
                                                                            </CLink>
                                                                        </> :
                                                                        <CBadge color='warning'>{los.status}</CBadge>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </>
                                                    ) : null
                                                ))}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center d-none d-md-table-cell">
                                                <CButton className='me-2 mb-2 d-block' color="warning" size="sm" onClick={() => callEdit(item.id)}>
                                                    <CIcon icon={cilPencil} className="me-2" />
                                                    Sửa
                                                </CButton>
                                                <CButton className='me-2 mb-2 d-block' color="danger" size="sm" onClick={() => callDelete(item.id, item.name)}>
                                                    <CIcon icon={cilTrash} className="me-2" />
                                                    Xóa
                                                </CButton>
                                                <CButton className='me-2 mb-2 d-block' color="info" size="sm" onClick={() => callDetail(item.id)}>
                                                    <CIcon icon={cilLinkAlt} className="me-2" />
                                                    Xem
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

export default Listings