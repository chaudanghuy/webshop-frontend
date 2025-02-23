import React, { useEffect, useState } from 'react'

import {
  CAlert,
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
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CImage,
  CInputGroup,
  CLink,
  CListGroup,
  CListGroupItem,
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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCog, cilPlus, cilReload, cilTrash, cilX } from '@coreui/icons'

import { format } from 'timeago.js'
import apiRequest from '../../lib/apiRequest'
import MultiSelect from 'multiselect-react-dropdown'
import { ToastNoti } from '../../components/notification/ToastNoti'

import DataTable from 'react-data-table-component'
import { Eye, Edit, Trash2, Hand, Zap, CirclePercent, CircleHelp, X, Plus } from 'lucide-react'
import UploadWidget from '../../components/uploadWidget/UploadWidget'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DeactiveActivity from './deactiveActivity'
import moment from 'moment'
import './promo.css'

// Enum
import { PromoHelp } from '../../utils/enums/promo'
import { PromoPriceList } from '../../utils/constant/promoPriceList'
import AddActivity from './addActivity'
import DeleteActivity from './deleteActivity'

const customTooltipStyle = {
  '--cui-tooltip-bg': 'var(--cui-primary)',
}

const Acvitites = () => {
  // Shops
  const [shops, setShops] = useState([])

  // Product deal - for flash deal
  const [tempProducts, setTempProducts] = useState([])
  const [products, setProducts] = useState([])

  // Acitivty Add
  const [isAddActivity, setIsAddActivity] = useState(false)
  const [onChangeActivity, setOnChangeActivity] = useState(0)

  //  Promos
  const [total, setTotal] = useState(0)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  // Toast Noti
  const [toast, setToast] = useState(null)

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [filterText, setFilterText] = useState('')
  const [filterStatus, setFilterStatus] = useState([])
  const [filterShop, setFilterShop] = useState([])
  const [sortBy, setSortBy] = useState('dateCreated')
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal
  const [modalData, setModalData] = useState(null)
  const [modalType, setModalType] = useState('')
  const [visible, setVisible] = useState(false)

  // Delete
  const [activity, setActivity] = useState(null)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [deleteActivityObject, setDeleteActivityObject] = useState({})

  // Update Price
  const [isUpdateDeal, setIsUpdateDeal] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [percentage, setPercentage] = useState('')
  const [progress, setProgress] = useState(0)
  const [updating, setUpdating] = useState(false)

  //////////  Flash Deal ////////////////////////////////////
  const [isFlashDeal, setIsFlashDeal] = useState(false)
  const [visibleFlashDeal, setVisibleFlashDeal] = useState(false)
  const [detailFlashDeal, setDetailFlashDeal] = useState({})
  const [dealSearchTerm, setDealSearchTerm] = useState('')
  const [searchShop, setSearchShop] = useState('')
  /// Flash info
  const [dealId, setDealId] = useState('')
  const [dealProducts, setDealProducts] = useState([])
  const [dealStatus, setDealStatus] = useState('')
  const [dealShopId, setDealShopId] = useState('')
  const [dealTitle, setDealTitle] = useState('Promo ' + new Date().toLocaleString())
  const [dealDiscount, setDealDiscount] = useState()
  const [dealQtyLimit, setDealQtyLimit] = useState(-1)
  const [dealQtyPerUser, setDealQtyPerUser] = useState(-1)
  const [dealStartTime, setDealStartTime] = useState('')
  const [dealEndTime, setDealEndTime] = useState('')
  const [dealActivityType, setDealActivityType] = useState('')
  const [dealProductLevel, setDealProductLevel] = useState('')
  const [updatingFlashDeal, setUpdatingFlashDeal] = useState(false)
  const [discountType, setDiscountType] = useState('ALL')
  const [discountPriceList, setDiscountPriceList] = useState([])
  //////////// Flash Deal ////////////////////////////////////

  const [alert, setAlert] = useState('')

  // Enums
  const StatusEnum = {
    PRODUCT_STATUS: [
      { id: 'IN_REVIEW', name: 'IN_REVIEW' },
      { id: 'DRAFT', name: 'DRAFT' },
      { id: 'FAILED', name: 'FAILED' },
      { id: 'ACTIVATE', name: 'ACTIVATE' },
      { id: 'SELLER_DEACTIVATED', name: 'SELLER_DEACTIVATED' },
      { id: 'ACCOUNT_DEACTIVATED', name: 'ACCOUNT_DEACTIVATED' },
      { id: 'FREEZE', name: 'FREEZE' },
      { id: 'DELETED', name: 'DELETED' },
    ],
    PUBLISH_STATUS: [
      { id: 'PENDING', name: 'PENDING' },
      { id: 'PROCESSING', name: 'PROCESSING' },
      { id: 'ERROR', name: 'ERROR' },
      { id: 'NOT_PUBLISHED', name: 'NOT_PUBLISHED' },
    ],
  }

  useEffect(() => {
    console.log(searchShop)
    const filterActivities = activities
      .filter((activity) => activity.title.toLowerCase().includes(filterText.toLowerCase()))
      .filter((activity) => (filterShop.length > 0 ? filterShop.includes(activity.shopId) : true))
      .filter((activity) => activity.title.includes(searchTerm))
      .sort((a, b) => (sortBy === 'dateCreated' ? b.create_time - a.create_time : a.id - b.id))

    setActivities(filterActivities)

    if (discountType == 'PRICE') {
      setDiscountPriceList(PromoPriceList.PRICE)
    } else {
      setDiscountPriceList([])
    }
  }, [filterText, filterStatus, filterShop, sortBy, discountType, searchTerm, searchShop])

  // For Flash Deal , filter products
  useEffect(() => {
    if (!dealSearchTerm) {
      setProducts(tempProducts)
      return
    }
    const filterProducts = products.filter((product) =>
      product.title.toLowerCase().includes(dealSearchTerm.toLowerCase()),
    )
    setProducts(filterProducts)
  }, [dealSearchTerm])

  useEffect(() => {
    setLoading(true)
    const fetchPromos = async () => {
      try {
        const res = await apiRequest.get('/promos/json')

        // console.log(res.data.products);
        setTotal(res.data.total)
        setActivities(res.data.promos)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchShops = async () => {
      try {
        const res = await apiRequest.get('/shops/all')
        // console.log(res.data);
        setShops(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    const getDefaultShop = async () => {
      try {
        const defaultShop = await apiRequest.post('/users/getDefaultShop')
        if (defaultShop.status === 200) {
          apiRequest
            .post('/proxy/connect', { shopId: defaultShop.data.defaultShop.id })
            .then((res) => {
              setAlert(res.data.message)
            })
            .catch((err) => {
              console.log(err)
              setAlert(err.response.data.message)
            })
        }
        // console.log(defaultShop);
      } catch (error) {
        setAlert(error.response.data.message)
        console.log(error)
      }
    }

    fetchPromos()
    fetchShops()
    getDefaultShop()
  }, [])

  const eventAddActivity = async () => {
    handleShowToast('Tạo promo thành công!')
    // call fetch promos
    await syncPromos()
  }

  const openModal = (type, activity) => {
    handleShowToast('Đang tiến hành lấy dữ liệu...')
    // console.log(type, product);
    try {
      if (type == 'delete') {
        setActivity(activity)
        setVisibleDelete(true)
        setDeleteActivityObject(activity)
      } else if (type == 'tiktok') {
      } else {
        setModalType(type)
        apiRequest
          .post('/promos/' + activity.id, {
            shopId: activity.shopId,
          })
          .then((res) => {
            // console.log(res.data);
            setModalData(res.data)
          })
        setVisible(true)
      }
    } catch (error) {
      handleShowToast('Đã có lỗi xảy ra. Xin vui lòng thử lại!')
      console.log(error)
    }
  }

  const closeModal = () => {
    setModalType('')
    setModalData(null)
    setVisible(false)
  }

  const fetchProducts = async (row) => {
    try {
      const res = await apiRequest.get('/products/json')
      const filterRes = res.data.products.filter((product) => product.shop_id == row.shop_id)
      setTotal(filterRes.length)
      setTempProducts(filterRes)
      setProducts(filterRes)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDeal = async (shopId, dealId) => {
    try {
      const res = await apiRequest.get(`/deals/shop/${shopId}/promo/${dealId}`)
      console.log(res.data)
      setDetailFlashDeal(res.data)
      const flashDeal = res.data
      setDealShopId(shopId)
      setDealId(dealId)
      setDealProducts(flashDeal.products)
      setDealStatus(flashDeal.status)
      setDealTitle(flashDeal.title)
      setDealActivityType(flashDeal.activity_type)
      setDealProductLevel(flashDeal.product_level)
      setDealStartTime(formatDateTimeLocal(new Date(flashDeal.begin_time * 1000)))
      setDealEndTime(formatDateTimeLocal(new Date(flashDeal.end_time * 1000)))
    } catch (error) {
      console.log(error)
    }
  }

  const formatDateTimeLocal = (date) => {
    const pad = (num) => String(num).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const callFlashDeal = async (row) => {
    try {
      await fetchProducts(row)
        .then((res) => {
          fetchDeal(row.shopId, row.id)
        })
        .finally(() => {
          console.log(row)
          setIsFlashDeal(true)
          setVisibleFlashDeal(true)
        })
    } catch (error) {}
  }

  const closeFlashDeal = () => {
    setIsFlashDeal(false)
    setVisibleFlashDeal(false)
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
      </CToast>,
    )
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(activities.map((product) => product.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }

  // search filter
  const filterBy = (selectedList, selectedItem) => {
    if (selectedList.length === 0) {
      window.location.reload()
    }
    let statuses = []
    for (const item of selectedList) {
      statuses.push(item.name)
    }
    setFilterStatus(statuses)
  }

  const filterByShop = (selectedList, selectedItem) => {
    if (selectedList.length === 0) {
      window.location.reload()
    }
    let selectedShops = []
    for (const item of selectedList) {
      selectedShops.push(item.id)
    }
    setFilterShop(selectedShops)
  }

  const updatePrices = async () => {
    setUpdating(true)
    setProgress(0)
    try {
      let skus = []
      activities.forEach((pd) => {
        if (selectedRows.includes(pd.id)) {
          skus.push({
            shopId: pd.shop.id,
            pId: pd.id,
          })
        }
      })
      const resp = await apiRequest.post('/products/tiktok-price', {
        products: skus,
        percentage: percentage,
      })
      // console.log(resp.data);
      if (resp.data) {
        handleShowToast('Update price thành công!')
      }

      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(progressInterval)
            setUpdating(false)
            closeModal()
            return 100
          }
          return oldProgress + 20
        })
      }, 500)
    } catch (error) {
      console.log(error)
    }
  }

  const submitFlashDeal = async () => {
    try {
      let skus = []
      products.forEach((pd) => {
        if (selectedRows.includes(pd.id)) {
          skus.push({
            shopId: pd.shop.id,
            pId: pd.id,
          })
        }
      })

      if (skus.length == 0) {
        handleShowToast('Vui lòng chọn sản phẩm!')
        return
      }
      // Flash deal
      if (dealStartTime && !dealEndTime) {
        // set end date to start date + 23 hours
        const endDate = new Date(dealStartTime)
        endDate.setHours(endDate.getHours() + 23)

        // Format to 'YYYY-MM-DDTHH:mm'
        const formatDateTimeLocal = (date) => {
          const pad = (num) => String(num).padStart(2, '0')
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
        }
        setDealEndTime(formatDateTimeLocal(endDate))
      }
      if (!dealStartTime || !dealEndTime) {
        handleShowToast('Vui lòng nhập thời gian!')
        return
      }

      setProgress(0)
      setUpdatingFlashDeal(true)

      let payload = {}
      if (discountType == 'ALL') {
        payload = {
          shopId: dealShopId,
          activityId: dealId,
          pIds: skus,
          discount: dealDiscount,
          qtyLimit: dealQtyLimit,
          qtyPerUser: dealQtyPerUser,
          activity_type: dealActivityType,
          product_level: dealProductLevel,
        }
      } else {
        payload = {
          shopId: dealShopId,
          activityId: dealId,
          pIds: skus,
          title: dealTitle,
          discount: discountPriceList,
          qtyLimit: dealQtyLimit,
          qtyPerUser: dealQtyPerUser,
          activity_type: dealActivityType,
          product_level: dealProductLevel,
        }
      }

      console.log(payload)

      const resp = await apiRequest
        .post('/deals', payload)
        .then((response) => {
          const payload2 = {
            shop_id: dealShopId,
            activity_type: dealActivityType,
            product_level: dealProductLevel,
            activity_id: response.data.activity_id,
            products: response.data.products,
          }
          apiRequest.post(`/deals/activities`, payload2)
        })
        .finally(() => {
          console.log('done')
        })
      if (resp.data) {
        handleShowToast('Flash Deal thành cong!')
      }

      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            setUpdatingFlashDeal(false)
            return 100
          }
          return oldProgress + 20
        })
      }, 500)
    } catch (error) {
      console.log(error)
      setUpdatingFlashDeal(false)
    }
  }

  const switchDiscountType = (type) => {
    setDiscountType(type)
  }

  const addDiscountPrice2List = () => {
    discountPriceList.push({
      price: '',
      discount: '',
    })
    setDiscountPriceList([...discountPriceList])
  }

  const removeDiscountFromList = (index) => {
    discountPriceList.splice(index, 1)
    setDiscountPriceList([...discountPriceList])
  }

  const updateDiscountToList = (index, key, value) => {
    discountPriceList[index][key] = value
    setDiscountPriceList([...discountPriceList])
  }

  const syncPromos = async () => {
    try {
      apiRequest.get('/shops/sync-promos-all').then((res) => {
        handleShowToast('Sync sản phẩm thành công!')
        window.location.reload()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    { name: 'Title', selector: (row) => row.title, sortable: true, width: '250px' },
    {
      name: 'Shop',
      selector: (row) => {
        const shop = shops.find((s) => s.id == row.shopId)
        return shop ? shop.name : ''
      },
      sortable: true,
      width: '200px',
    },
    {
      name: 'Create Time',
      selector: (row) => moment(new Date(row.create_time)).format('DD/MM/YYYY HH:mm'),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="d-flex flex-column align-items-center">
          {row.status === 'NOT_START' ? (
            <CBadge color="info">{row.status}</CBadge>
          ) : row.status === 'ONGOING' ? (
            <CBadge color="success">{row.status}</CBadge>
          ) : row.status === 'EXPIRED' ? (
            <CBadge color="warning">{row.status}</CBadge>
          ) : (
            <CBadge color="danger">{row.status}</CBadge>
          )}
          <span>{row.quality}</span>
        </div>
      ),
      width: '150px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex flex-row items-center">
          <CButton size="icon" variant="ghost" onClick={() => callFlashDeal(row)}>
            <Edit className="w-4 h-4" />
          </CButton>
          <CButton size="icon" variant="ghost" onClick={() => openModal('delete', row)}>
            <Trash2 className="w-4 h-4" />
          </CButton>
        </div>
      ),
      width: '200px',
    },
  ]

  const tableColumns = [
    {
      name: <CFormCheck checked={selectAll} onChange={toggleSelectAll} />,
      cell: (row) => (
        <CFormCheck
          checked={selectedRows.includes(row.id) || dealProducts.find((p) => p.id == row.id)}
          onChange={() => toggleRowSelection(row.id)}
        />
      ),
      grow: 0.2,
      width: '50px',
    },
    { name: 'Title', selector: (row) => row.title, sortable: true, width: '250px' },
    {
      name: 'Promo',
      selector: (row) => {
        // check row.id in dealProducts product id
        const product = dealProducts.find((p) => p.id == row.id)
        return product ? '✅' : ''
      },
      sortable: true,
      width: '200px',
    },
    {
      name: 'Promo Discount',
      selector: (row) => {
        // check row.id in dealProducts product id
        const product = dealProducts.find((p) => p.id == row.id)
        return product ? (
          <CListGroup>
            {product.activity_price.amount ? (
              <CBadge color="success">{product.activity_price.amount}</CBadge>
            ) : (
              ''
            )}
            {product.skus.map((sku) => (
              <CListGroupItem>
                {sku.id} - {sku.discount ? sku.discount + '%' : ''}
              </CListGroupItem>
            ))}
          </CListGroup>
        ) : (
          ''
        )
      },
      sortable: false,
      width: '200px',
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="d-flex flex-column align-items-center">
          {row.status == 'ACTIVATE' ? (
            <CBadge color="success">{row.status}</CBadge>
          ) : (
            <CBadge color="danger">{row.status}</CBadge>
          )}
          <span>{row.quality}</span>
        </div>
      ),
      width: '150px',
    },
  ]

  return (
    <>
      {alert && <CAlert color="success">{alert}</CAlert>}
      <ToastNoti toast={toast} setToast={setToast} />
      <AddActivity
        visible={isAddActivity}
        setVisible={setIsAddActivity}
        onChangeActivityEvent={eventAddActivity}
      />
      <CRow>
        <CCol sm={5}>
          <h4 id="traffic" className="card-title mb-0">
            Promo ({total})
            <CButton color="warning" className="ms-2 mb-2" onClick={() => syncPromos()}>
              <CIcon icon={cilReload} className="me-1" />
            </CButton>
          </h4>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CInputGroup className="mb-3">
            <CFormInput
              placeholder="Tìm theo mã hoặc tên"
              aria-label="Tìm theo mã hoặc tên"
              aria-describedby="basic-addon2"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol>
          <MultiSelect
            displayValue="name"
            options={shops}
            value={filterShop}
            onSelect={filterByShop}
            onRemove={filterByShop}
            placeholder="Lọc theo shop"
          />
        </CCol>
        <CCol>
          <CDropdown>
            <CDropdownToggle color="white">
              <CIcon icon={cilCog} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>
                <strong>SẮP XẾP THEO</strong>
              </CDropdownItem>
              <CDropdownItem
                onClick={() => setSortBy('id')}
                className={sortBy === 'id' ? 'active' : ''}
              >
                ID
              </CDropdownItem>
              <CDropdownItem
                onClick={() => setSortBy('dateCreated')}
                className={sortBy === 'dateCreated' ? 'active' : ''}
              >
                Ngày tạo
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol>
          <CButton
            // disabled={selectedRows.length === 0}
            color="primary"
            className="float-start"
            onClick={() => setIsAddActivity(true)}
          >
            <Zap className="me-1" /> Tạo Deal
          </CButton>
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
                  className="table table-hover"
                  columns={columns}
                  data={activities}
                  pagination
                  highlightOnHover
                  noHeader
                  fixedHeader
                  responsive={false}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {modalData && (
        <ModalProduct
          type={modalType}
          visible={visible}
          setVisible={setVisible}
          product={modalData}
        />
      )}
      {activity && (
        <DeleteActivity
          visible={visibleDelete}
          setVisible={setVisibleDelete}
          activity={deleteActivityObject}
        />
      )}
      {isFlashDeal && products && (
        <div className="app">
          <CModal
            visible={visibleFlashDeal}
            onClose={closeFlashDeal}
            alignment="center"
            size="xl"
            scrollable
          >
            <CModalHeader>
              <CModalTitle className="ms-5">
                <Zap className="me-1" />
                Flash Deal
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <ToastNoti toast={toast} setToast={setToast} />
              <div className="modal-body">
                <div className="column input-section">
                  <CRow className="mt-3">
                    <CCol className="col-2">
                      <CFormLabel>Status</CFormLabel>
                    </CCol>
                    <CCol className="col-4">
                      <CBadge color="success">{dealStatus}</CBadge>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CFormLabel>
                      Shop {shops.find((shop) => shop.id === dealShopId)?.name}
                    </CFormLabel>
                  </CRow>
                  <CRow className="mt-3">
                    <CFormInput
                      type="text"
                      className="col-4 ms-2"
                      placeholder=""
                      value={dealTitle}
                      onChange={(e) => setDealTitle(e.target.value)}
                      label="Tên chiến dịch"
                      readOnly
                      disabled
                    />
                  </CRow>
                  <CRow className="mt-3">
                    <CFormInput
                      type="datetime-local"
                      placeholder="Start"
                      aria-label="Start"
                      aria-describedby="basic-addon2"
                      value={dealStartTime}
                      onChange={(e) => setDealStartTime(e.target.value)}
                      label="Ngày hiệu lực"
                      readOnly
                      disabled
                    />
                  </CRow>
                  <CRow className="mt-3">
                    <CFormLabel>
                      Ngày kết thúc
                      <CTooltip
                        content={PromoHelp.DATE_END}
                        placement="top"
                        style={customTooltipStyle}
                      >
                        <CircleHelp className="ms-1" />
                      </CTooltip>
                    </CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      placeholder="End"
                      aria-label="End"
                      aria-describedby="basic-addon2"
                      value={dealEndTime}
                      onChange={(e) => setDealEndTime(e.target.value)}
                      readOnly
                      disabled
                    />
                  </CRow>
                  <CRow>
                    <CInputGroup className="mt-3 d-flex ms-auto">
                      <CFormCheck
                        type="radio"
                        name="discountType"
                        id="discountAll"
                        label="Tất cả"
                        className="me-3"
                        value="ALL"
                        checked={discountType === 'ALL'}
                        onChange={(e) => setDiscountType(e.target.value)}
                      />
                      <CFormCheck
                        type="radio"
                        name="discountType"
                        id="discountPrice"
                        label="Theo giá"
                        className="me-3"
                        value="PRICE"
                        checked={discountType === 'PRICE'}
                        onChange={(e) => setDiscountType(e.target.value)}
                      />
                    </CInputGroup>
                  </CRow>
                  {discountPriceList.length > 0 ? (
                    <CRow className="mt-3">
                      <CFormLabel>
                        Giá trị giảm giá (%)
                        <CTooltip
                          content={PromoHelp.DISCOUNT}
                          placement="top"
                          style={customTooltipStyle}
                        >
                          <CircleHelp className="ms-1" />
                        </CTooltip>
                      </CFormLabel>
                      {discountPriceList.map((item, index) => (
                        <CRow>
                          <CCol>
                            <CFormInput
                              key={index}
                              type="text"
                              className="col-4 ms-2"
                              placeholder=""
                              value={item.price}
                              label="Giá"
                              onChange={(e) => {
                                updateDiscountToList(index, 'price', e.target.value)
                              }}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              key={index}
                              type="text"
                              className="col-4 ms-2"
                              placeholder=""
                              value={item.percent}
                              label="Giá trị (%)"
                              onChange={(e) => {
                                updateDiscountToList(index, 'percent', e.target.value)
                              }}
                            />
                          </CCol>
                          <CCol>
                            <CInputGroup className="mt-4 d-flex ms-auto">
                              <CLink
                                className="float-end"
                                onClick={() => removeDiscountFromList(index)}
                              >
                                <X className="me-1" />
                              </CLink>
                            </CInputGroup>
                          </CCol>
                        </CRow>
                      ))}
                      <CInputGroup className="mt-4 d-flex ms-auto">
                        <CButton
                          color="primary"
                          className="float-end"
                          onClick={addDiscountPrice2List}
                        >
                          <Plus className="me-1" /> Thêm giá
                        </CButton>
                      </CInputGroup>
                    </CRow>
                  ) : (
                    <CRow className="mt-3">
                      <CFormLabel>
                        Giá trị giảm giá (%)
                        <CTooltip
                          content={PromoHelp.DISCOUNT}
                          placement="top"
                          style={customTooltipStyle}
                        >
                          <CircleHelp className="ms-1" />
                        </CTooltip>
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        className="col-4 ms-2"
                        placeholder=""
                        value={dealDiscount}
                        onChange={(e) => setDealDiscount(e.target.value)}
                      />
                    </CRow>
                  )}
                  <CRow className="mt-3">
                    <CFormLabel>
                      Số lượng sản phẩm
                      <CTooltip
                        content={PromoHelp.QUANTITY_LIMIT}
                        placement="top"
                        style={customTooltipStyle}
                      >
                        <CircleHelp className="ms-1" />
                      </CTooltip>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="col-4 ms-2"
                      placeholder=""
                      value={dealQtyLimit}
                      onChange={(e) => setDealQtyLimit(e.target.value)}
                    />
                  </CRow>
                  <CRow className="mt-3">
                    <CFormLabel>
                      Giới hạn mua sản phẩm
                      <CTooltip
                        content={PromoHelp.PRODUCT_LIMIT}
                        placement="top"
                        style={customTooltipStyle}
                      >
                        <CircleHelp className="ms-1" />
                      </CTooltip>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      className="col-4 ms-2"
                      placeholder=""
                      value={dealQtyPerUser}
                      onChange={(e) => setDealQtyPerUser(e.target.value)}
                    />
                  </CRow>
                </div>
                <div className="column product-list">
                  <CRow className="header-fixed d-flex flex-row">
                    <CCol className="d-flex" cols="6">
                      <CFormInput
                        type="text"
                        className="col-4 ms-2"
                        placeholder=""
                        label="Search"
                        value={dealSearchTerm}
                        onChange={(e) => setDealSearchTerm(e.target.value)}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3"></CRow>
                  <div className="header-fixed d-flex justify-content-between align-items-center">
                    <h5>Products</h5>
                  </div>
                  <div className="scrollable">
                    <DataTable
                      columns={tableColumns}
                      data={products}
                      noHeader
                      pagination
                      highlightOnHover
                    />
                  </div>
                </div>
              </div>
            </CModalBody>
            <CFooter className="d-flex justify-content-center">
              <div>
                {updatingFlashDeal ? (
                  <div>
                    <div>Đang thực hiện tiến trình ..</div>
                    <CProgress color="success" value={progress} max={100} />
                  </div>
                ) : (
                  <>
                    <CButton color="primary" className="me-5" onClick={submitFlashDeal}>
                      Cập nhật
                    </CButton>
                  </>
                )}
              </div>
            </CFooter>
          </CModal>
        </div>
      )}
    </>
  )
}

const ModalProduct = ({ type, visible, setVisible, product }) => {
  const [toast, setToast] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [price, setPrice] = useState(0)
  const [packageWeight, setPackageWeight] = useState(0)
  const [status, setStatus] = useState('')
  const [originProduct, setOriginProduct] = useState(null)

  const [editMode, setEditMode] = useState(false)

  const StatusEnum = {
    PRODUCT_STATUS: [
      { id: 'IN_REVIEW', name: 'IN_REVIEW' },
      { id: 'DRAFT', name: 'DRAFT' },
      { id: 'FAILED', name: 'FAILED' },
      { id: 'ACTIVATE', name: 'ACTIVATE' },
      { id: 'SELLER_DEACTIVATED', name: 'SELLER_DEACTIVATED' },
      { id: 'ACCOUNT_DEACTIVATED', name: 'ACCOUNT_DEACTIVATED' },
      { id: 'FREEZE', name: 'FREEZE' },
      { id: 'DELETED', name: 'DELETED' },
    ],
    PUBLISH_STATUS: [
      { id: 'PENDING', name: 'PENDING' },
      { id: 'PROCESSING', name: 'PROCESSING' },
      { id: 'ERROR', name: 'ERROR' },
      { id: 'NOT_PUBLISHED', name: 'NOT_PUBLISHED' },
    ],
  }

  useEffect(() => {
    if (product) {
      setOriginProduct(product)
      setEditMode(type == 'view' ? false : true)
      setTitle(product.title)
      setDescription(product.description)
      setPrice(product.price)
      setPackageWeight(product.package_weight)
      setStatus(product.status)

      // loop each image in images
      let images = []
      for (const image of product.images) {
        // loop url in image.urls
        for (const url of image.urls) {
          images.push(url)
        }
      }
      setImages(images)
    }
  }, [product])

  const handleShowToast = (message) => {
    setToast(
      <CToast>
        <CToastHeader closeButton>
          <CIcon icon={cilBell} className="me-2" />
          <div className="fw-bold me-auto">Thông báo hệ thống</div>
          <small>Just now</small>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  const updateProduct = async (shopId) => {
    try {
      const payload = {
        shopId: shopId,
        originProduct: product,
        title,
        description,
        images,
      }

      const res = await apiRequest.put(`/products/tiktok-product/${product.id}`, payload)
      console.log(res)
      if (res.data.message == 'Success') {
        await apiRequest.get(`/shops/sync-products/${shopId}`)
        handleShowToast('Cập nhật sản phẩm lên shop thành công!')
        setVisible(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <ToastNoti toast={toast} setToast={setToast} />
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex flex-column">
          <CRow className="mb-2 mt-2 d-flex justify-content-center">
            {product &&
              images &&
              images.map((image, index) => (
                <CCol xs={3} key={index} className="position-relative">
                  <CImage
                    className="m-2 img-thumbnail"
                    rounded
                    src={image}
                    width={100}
                    height={100}
                  />
                  {editMode && (
                    <CIcon
                      icon={cilX}
                      className="position-absolute top-0 float-start text-danger fw-bold"
                      onClick={() => {
                        const newImages = images.filter((img, i) => i !== index)
                        setImages(newImages)
                      }}
                    />
                  )}
                </CCol>
              ))}
            {editMode && (
              <div className="text-center">
                <UploadWidget
                  uwConfig={{
                    multiple: true,
                    cloudName: 'dg5multm4',
                    uploadPreset: 'estate_3979',
                    folder: 'posts',
                  }}
                  setState={setImages}
                />
              </div>
            )}
          </CRow>
          <CForm method="post">
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormTextarea
                  id="name"
                  name="name"
                  label="Tên sản phẩm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  {...(!editMode && { disabled: true })}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormInput
                  id="price"
                  label="Giá ($)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  {...(!editMode && { disabled: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  id="package_weight"
                  label={'Cân nặng' + packageWeight.unit}
                  value={packageWeight.value}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  {...(!editMode && { disabled: true })}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={12}>
                <CFormSelect
                  id="status"
                  label="Trạng thái"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  readOnly
                  disabled
                >
                  {StatusEnum.PRODUCT_STATUS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-5">
              <label className="col-12">Mô tả</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                {...(!editMode && { disabled: true })}
              />
            </CRow>
            <div className="clearfix"></div>
            <CRow className="mt-5 d-flex justify-content-center">
              {editMode && (
                <CButton
                  color="primary"
                  className=" col-3"
                  onClick={() => updateProduct(product.shopId)}
                >
                  Cập nhật sản phẩm
                </CButton>
              )}
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

const ModalDeleteProduct = ({ visible, setVisible, product }) => {
  const deleteProduct = () => {
    try {
      apiRequest.delete('/products/' + product.id)
      setVisible(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Xác nhận xóa sản phẩm</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Bấm xóa để tiếp tục</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Đóng
        </CButton>
        <CButton color="primary" onClick={() => deleteProduct()}>
          Xóa
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default Acvitites
