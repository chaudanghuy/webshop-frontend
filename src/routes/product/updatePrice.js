import React, { useEffect, useState } from "react";
import { 
    CModal, 
    CModalHeader, 
    CModalTitle, 
    CModalBody, 
    CModalFooter, 
    CButton, 
    CForm,
    CRow, 
    CFormLabel, 
    CTable, 
    CTableHead, 
    CTableRow, 
    CTableHeaderCell, 
    CTableBody, 
    CTableDataCell, 
    CAvatar, 
    CCol, 
    CBadge, 
    CFooter, 
    CFormSelect, 
    CToast, 
    CToastHeader, 
    CToastBody, 
    CFormTextarea, 
    CImage, 
    CProgress, 
    CFormInput
} from "@coreui/react";
import apiRequest from "../../lib/apiRequest";
import { ToastNoti } from "../../components/notification/ToastNoti";
import { 
    cilBell, 
    cilCheckCircle, 
    cilCloudUpload, 
    cilLockLocked, 
    cilPencil, 
    cilX 
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import "./uploadToShop.css";
import Toggle from 'react-toggle'
import "react-toggle/style.css";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

const UpdatePrice = ({ visible, setVisible, products }) => {
    const [toast, setToast] = useState(null);
    const [progress, setProgress] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [quantity, setQuantity] = useState(0);

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

    const closeModal = () => {
        setVisible(false)
    };

    const uploadTiktokProducts = async () => {
        try {
            // initial state for upload, should reset all fields            
            setUploadBtnStatus(true);
            setProgress(0);
            setIsUploading(true);

            const res = await apiRequest.post("/products/update-price",
                {
                    products: selectedProducts,
                    percentage: percentage,
                    quantity: quantity                                        
                },
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }
            );

            console.log(res);
            if (res.data.message === 'Success') {
                handleShowToast('Đăng sản phẩm thành công!');

                // reset state
                setIsUploading(false);
                setUploadBtnStatus(false);
                setProgress(0);
                setVisible(false);
                
                window.location.reload();
            }
        } catch (error) {
            handleShowToast('Đã có lỗi xảy ra. Xin vui lòng thử lại!');
            console.log(error);
            // reset state
            setIsUploading(false);
            setUploadBtnStatus(false);
            setProgress(0);            
        }
    }

    return (
        <div className="app">
            <CModal visible={visible} onClose={closeModal} alignment="center" size="xl" scrollable>
                <CModalHeader>
                    <CModalTitle className="ms-5">Update price</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ToastNoti toast={toast} setToast={setToast} />
                    <div className="modal-body">
                        <div className="column input-section">
                            <CRow className="mt-3">
                                <CFormInput type="text" className="col-4" placeholder="" value="" label="Percent" />
                            </CRow>
                            <CRow className="mt-3">
                                <CFormInput type="text" className="col-4" placeholder="" value="" label="Quantity" />
                            </CRow>
                        </div>
                        <div className="column product-list">
                            <div className="header-fixed d-flex justify-content-between align-items-center">
                                <h5>Products</h5>                                
                            </div>
                            <div className="scrollable">
                                {products.length > 0 ? (
                                    <CTable striped>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell></CTableHeaderCell>
                                                <CTableHeaderCell>Tên</CTableHeaderCell>
                                                <CTableHeaderCell></CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {products.map((product, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>
                                                        <CAvatar size="md" src={product.images[0]} />
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {product.isEdit ?
                                                            <CFormTextarea name="name" value={product.name} onChange={(e) => processEditListing(product.id, e.target.value)} />
                                                            : <CFormLabel>{product.name}</CFormLabel>
                                                        }
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CRow className="d-flex flex-column">
                                                            <CCol>
                                                                {product.isEdit ?
                                                                    <CButton color="success" className="me-2 mb-2" onClick={() => finishEditListing(product.id, product.name)}>
                                                                        <CIcon icon={cilCheckCircle} className="me-2" /> Xong
                                                                    </CButton>
                                                                    : <CButton color="info" className="me-2 mb-2" onClick={() => editListing(product.id)}>
                                                                        <CIcon icon={cilPencil} className="me-2" /> Sửa
                                                                    </CButton>
                                                                }
                                                            </CCol>
                                                            <CCol>
                                                                {product.isCertUpload == 0 ? <CButton color="warning" onClick={() => showUploadCertModal(product.id)}>
                                                                    <CIcon icon={cilLockLocked} className="me-2" />  Chứng chỉ
                                                                </CButton> : <CBadge color="success">Đã up cert</CBadge>}
                                                            </CCol>
                                                        </CRow>
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
                <CFooter className="d-flex justify-content-center">
                    <div>
                        {isUploading ?
                            <div>
                                <div>Đang thực hiện tiến trình ..</div>
                                <CProgress color='success' value={100} max={100} />
                            </div>
                            :
                            <>
                                <CButton color="primary" className="me-5" onClick={uploadTiktokProducts} disabled={uploadBtnStatus ? true : false}>
                                    Update
                                </CButton>                                
                            </>
                        }
                    </div>
                </CFooter>
            </CModal>            
        </div>
    );
};

export default UpdatePrice;
