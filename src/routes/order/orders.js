import React, { useEffect, useState } from 'react'

import {
  CAlert,
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
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CImage,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
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
import { cilBell, cilCog, cilPlus, cilReload, cilX } from '@coreui/icons'

import { format } from 'timeago.js'
import apiRequest from '../../lib/apiRequest'
import MultiSelect from 'multiselect-react-dropdown'
import { ToastNoti } from '../../components/notification/ToastNoti'

import DataTable from 'react-data-table-component'
import UploadWidget from '../../components/uploadWidget/UploadWidget'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Edit, Trash2 } from 'lucide-react'
import moment from 'moment-timezone'

const Orders = () => {
  // Enum
  const ORDER_STATUS = [
    { id: 'AWAITING_SHIPMENT', name: 'AWAITING_SHIPMENT' },
    { id: 'AWAITING_COLLECTION', name: 'AWAITING_COLLECTION' },
    { id: 'DELIVERED', name: 'DELIVERED' },
    { id: 'CANCELLED', name: 'CANCELLED' },
  ]

  // Toast Noti
  const [toast, setToast] = useState(null)

  const [noneFilterOrders, setNoneFilterOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('dateCreated')
  const [filterSearch, setFilterSearch] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [filterShops, setFilterShops] = useState([])
  const [filterStatus, setFilterStatus] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [shops, setShops] = useState([])

  const [alert, setAlert] = useState('')
  const [progress, setProgress] = useState(0)

  // Sync
  const [isSyncWithShop, setIsSyncWithShop] = useState(false)
  const [syncShopModal, setSyncShopModal] = useState(false)
  const [syncShopChoose, setSyncShopChoose] = useState(false)

  // Order detail
  const [orderDetail, setOrderDetail] = useState(null)
  const [orderDetailModal, setOrderDetailModal] = useState(false)

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

  useEffect(() => {
    fetchOrders()
    fetchShops()
  }, [])

  useEffect(() => {
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

    getDefaultShop()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [filterSearch, filterDateFrom, filterDateTo, filterShops, filterStatus, sortBy])

  const formatDateTimeDisplay = (timestamp) => {
    return moment.unix(timestamp).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm A')
  }

  const filterOrders = () => {
    let filtered = noneFilterOrders
    if (filterSearch) {
      filtered = filtered.filter(
        (order) =>
          order.id.includes(filterSearch) ||
          order.line_items.some(
            (item) =>
              item.seller_sku.includes(filterSearch) ||
              item.product_name.toLowerCase().includes(filterSearch.toLowerCase()),
          ),
      )
    }
    if (filterDateFrom) {
      filtered = filtered.filter(
        (order) => new Date(order.create_time * 1000) >= new Date(filterDateFrom),
      )
    }
    if (filterDateTo) {
      filtered = filtered.filter(
        (order) => new Date(order.create_time * 1000) <= new Date(filterDateTo),
      )
    }
    if (filterShops.length > 0) {
      filtered = filtered.filter((order) => filterShops.includes(order.shopId))
    }

    if (filterStatus.length > 0) {
      filtered = filtered.filter((order) => filterStatus.includes(order.status))
    }
    setOrders(
      filtered.sort((a, b) =>
        sortBy === 'dateCreated'
          ? b.create_time - a.create_time
          : sortBy === 'dateUpdated'
            ? b.update_time - a.update_time
            : a.id - b.id,
      ),
    )
    setTotal(filtered.length)
  }

  const fetchOrders = async () => {
    setLoading(true)
    const res = await apiRequest.get('/orders/tiktok/all-orders')
    setOrders(res.data)
    if (res.data.length === 0) {
      handleShowToast('Đang cập nhật dữ liệu...')
      // fetch orders and refresh page
      const res = await apiRequest.get('/shops/sync-initial-orders')
      window.location.reload()
    }
    setTotal(res.data.length)
    setNoneFilterOrders(res.data)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
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

  const syncOrders = async () => {
    try {
      setIsSyncWithShop(true)
      setSyncShopModal(true)
    } catch (error) {
      console.log(error)
      handleShowToast('Đã có lỗi xảy ra. Xin vui lòng thử lại!')
    }
  }

  const filterByShop = (selectedList, selectedItem) => {
    if (selectedList.length === 0) {
      window.location.reload()
    }
    let selectedShops = []
    for (const item of selectedList) {
      selectedShops.push(item.id)
    }
    setFilterShops(selectedShops)
  }

  const filterByStatus = (selectedList, selectedItem) => {
    if (selectedList.length === 0) {
      window.location.reload()
    }
    let selectedStatus = []
    for (const item of selectedList) {
      selectedStatus.push(item.id)
    }
    setFilterStatus(selectedStatus)
  }

  const toggleSyncShop = () => {
    setIsSyncWithShop(!isSyncWithShop)
    setSyncShopModal(!syncShopModal)
  }

  const handleSyncShop = async () => {
    try {
      if (!syncShopChoose) {
        handleShowToast('Vui lồng chọn cửa hàng để sync!')
        return
      }
      setProgress(10)

      const syncShop = shops.find((shop) => shop.id == syncShopChoose)

      apiRequest.get(`/shops/sync-orders/${syncShop.id}`).then((res) => {
        setProgress(0)
        handleShowToast(`Sync order của shop ${syncShop.name} thành công!`)
        toggleSyncShop()
        setOrders([])
        setTotal(0)
        fetchOrders()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getOrderDetail = async (row) => {
    try {
      await apiRequest.get(`/orders/tiktok/${row.shopId}/${row.id}`).then((res) => {
        console.log(res.data.order.orders[0])
        setOrderDetail(res.data.order.orders[0])
        setOrderDetailModal(true)
      })
    } catch (error) {}
  }

  const toggleOrderModal = () => {
    setOrderDetailModal(!orderDetailModal)
  }

  const columns = [
    {
      name: <CFormCheck checked={selectAll} onChange={() => setSelectAll(!selectAll)} />,
      cell: (row) => (
        <CFormCheck
          checked={selectedRows.includes(row.id)}
          onChange={() =>
            setSelectedRows(
              selectedRows.includes(row.id)
                ? selectedRows.filter((id) => id !== row.id)
                : [...selectedRows, row.id],
            )
          }
        />
      ),
      width: '50px',
    },
    { name: 'Order', selector: (row) => row.id, sortable: true, width: '200px' },
    {
      name: 'Items',
      cell: (row) => (
        <div>
          {row.line_items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CAvatar
                src={item.sku_image}
                alt={item.product_name}
                className="w-10 h-10 object-cover"
              />
              <span>
                {item.product_name} - ${item.sale_price}
              </span>
            </div>
          ))}
        </div>
      ),
      width: '300px',
    },
    {
      name: 'Total Price',
      selector: (row) => `$${row.payment.total_amount}`,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Status',
      cell: (row) => (
        <div>
          <CBadge color={row.status === 'COMPLETED' ? 'success' : 'warning'}>{row.status}</CBadge>
          <div className="text-xs text-gray-500">{format(row.update_time * 1000)}</div>
        </div>
      ),
      sortable: true,
      width: '150px',
    },
    {
      name: 'Shipping',
      cell: (row) => (
        <div>
          <div>{row.recipient_address.name}</div>
          <div className="text-xs text-gray-500">{row.recipient_address.full_address}</div>
        </div>
      ),
      width: '250px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex flex-row items-center">
          <CButton size="icon" variant="ghost" onClick={() => getOrderDetail(row)}>
            <Edit className="w-4 h-4" />
          </CButton>
        </div>
      ),
      width: '150px',
    },
  ]

  return (
    <>
      {alert && <CAlert color="success">{alert}</CAlert>}
      <CRow>
        <CCol sm={5}>
          <h4 id="traffic" className="card-title mb-0">
            Đơn hàng ({total})
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
            displayValue="name"
            options={shops}
            value={filterShops}
            onSelect={filterByShop}
            onRemove={filterByShop}
            placeholder="Lọc theo shop"
          />
        </CCol>
        <CCol>
          <MultiSelect
            displayValue="name"
            options={ORDER_STATUS}
            placeholder="Lọc theo trang thai"
            onSelect={filterByStatus}
            onRemove={filterByStatus}
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
                onClick={() => setSortBy('dateCreated')}
                className={sortBy === 'dateCreated' ? 'active' : ''}
              >
                Ngày tạo
              </CDropdownItem>
              <CDropdownItem
                onClick={() => setSortBy('dateUpdated')}
                className={sortBy === 'dateUpdated' ? 'active' : ''}
              >
                Ngày cập nhật
              </CDropdownItem>
              <CDropdownItem
                onClick={() => setSortBy('id')}
                className={sortBy === 'id' ? 'active' : ''}
              >
                ID
              </CDropdownItem>
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
                  className="table table-hover"
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
      {isSyncWithShop && (
        <CModal visible={syncShopModal} onClose={toggleSyncShop}>
          <CModalHeader closeButton>Sync Đơn Hàng</CModalHeader>
          <CModalBody className="d-flex justify-content-center">
            <CRow className="mt-3" cols={12}>
              <CFormLabel>Chọn cửa hàng</CFormLabel>
              <CFormSelect onChange={(e) => setSyncShopChoose(e.target.value)}>
                <option value="">Chọn cửa hàng</option>
                {shops.map((shop) => (
                  <option value={shop.id}>{shop.name}</option>
                ))}
              </CFormSelect>
            </CRow>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            {progress > 0 ? (
              <diV>Đang sync..</diV>
            ) : (
              <>
                <CButton color="primary" onClick={handleSyncShop}>
                  Sync
                </CButton>
                <CButton color="secondary" onClick={toggleSyncShop}>
                  Cancel
                </CButton>
              </>
            )}
          </CModalFooter>
        </CModal>
      )}
      {orderDetailModal && (
        <CModal visible={orderDetailModal} onClose={toggleOrderModal}>
          <CModalHeader closeButton>Đơn hàng #{orderDetail.id} </CModalHeader>
          <CModalBody className="d-flex flex-column">
            <CRow className="mt-3 mx-3" cols={12}>
              <CCol className="d-flex justify-content-center" cols={3}>
                {orderDetail.paid_time ? (
                  <CBadge color="success">Đã thanh toán</CBadge>
                ) : (
                  <CBadge color="warning">Unpaid</CBadge>
                )}
              </CCol>
              <CCol className="d-flex justify-content-center" cols={3}>
                <CBadge color="info">{orderDetail.delivery_option_name}</CBadge>
              </CCol>
              <CCol className="d-flex justify-content-center" cols={3}>
                <CBadge color="warning">
                  {formatDateTimeDisplay(orderDetail.cancel_order_sla_time)}
                </CBadge>
              </CCol>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Name</CFormLabel>
              <code>{orderDetail.recipient_address.name}</code>
            </CRow>
            <hr className="w-100" />
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Address</CFormLabel>
              <code>{orderDetail.recipient_address.full_address}</code>
              <br />
              <CFormLabel>Zip Code</CFormLabel>
              <code>{orderDetail.recipient_address.postal_code}</code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Phone</CFormLabel>
              <code>{orderDetail.recipient_address.phone_number}</code>
            </CRow>
            <hr className="w-100" />
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Tracking Number</CFormLabel>
              <code>{orderDetail.tracking_number}</code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Fulfillment Type</CFormLabel>
              <code>
                {orderDetail.fulfillment_type == 'FULFILLMENT_BY_SELLER'
                  ? 'SELLER'
                  : orderDetail.fulfillment_type == 'FULFILLMENT_BY_TIKTOK'
                    ? 'TIKTOK'
                    : 'OTHER'}
              </code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Shipping Provider</CFormLabel>
              <code>{orderDetail.shipping_provider}</code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Đơn hàng phải được giao trước thời gian này</CFormLabel>
              <code>
                {formatDateTimeDisplay(orderDetail.delivery_option_required_delivery_time)}
              </code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Thời gian giao hàng dự kiến</CFormLabel>
              <code>{formatDateTimeDisplay(orderDetail.rts_sla_time)}</code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Delivery Instruction</CFormLabel>
              <code>
                {orderDetail.delivery_type == 'HOME_DELIVERY'
                  ? 'Giao hàng tận nhà'
                  : 'Giao hàng tận cửa'}
              </code>
            </CRow>
            <CRow className="mt-3 mx-3" cols={12}>
              <CFormLabel>Buyer message</CFormLabel>
              <code>{orderDetail.buyer_message}</code>
            </CRow>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton color="secondary" onClick={toggleOrderModal}>
              OK
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  )
}

const ModalProduct = ({ type, visible, setVisible, product }) => {
  const [toast, setToast] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [originProduct, setOriginProduct] = useState(null)

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (product) {
      setOriginProduct(product)
      setEditMode(type == 'view' ? false : true)
      setTitle(product.title)
      setDescription(product.description)

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

export default Orders
