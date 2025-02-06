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
    CProgress 
} from "@coreui/react";
import apiRequest from "../../lib/apiRequest";
import MultiSelect from 'multiselect-react-dropdown'
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

const UploadToShop = ({ visible, setVisible, listings }) => {

    // step 1 - shop, template
    const [shops, setShops] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedShops, setSelectedShops] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // step 2 - review listings
    const [isStep2, setIsStep2] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const shops = await apiRequest.get(`/shops`);
                setShops(shops.data.shops);
            } catch (error) {
                console.log(error);
            }
        }
        fetchShops();
    }, [listings]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const templates = await apiRequest.get(`/templates`);
                setTemplates(templates.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchTemplates();
    }, [shops]);

    const onSelectShops = (selectedList) => {
        setSelectedShops(selectedList);
    }

    const onSelectTemplate = (selectTpl) => {
        setSelectedTemplate(selectTpl);
    }

    const goToStep2 = (callback) => {
        if (!selectedShops || !selectedTemplate) {
            callback();
            return;
        }
        setIsStep2(true);
    }

    return (
        <>
            <ChooseTemplate
                visible={visible}
                setVisible={setVisible}
                shops={shops}
                templates={templates}
                onChange={goToStep2}
                onSelectShops={onSelectShops}
                onSelectTemplate={onSelectTemplate}
            />
            <ChooseListings
                visible={isStep2}
                setVisible={setIsStep2}
                listings={listings}
                selectedShops={selectedShops}
                selectedTemplate={selectedTemplate}
            />
        </>
    );
};

const ChooseTemplate = ({ visible, setVisible, shops, templates, onChange, onSelectShops, onSelectTemplate }) => {
    const [toast, setToast] = useState(null);

    const goToStep2 = () => {
        onChange(() => {
            handleShowToast('Vui lòng chọn cửa hàng và template');
        });
        setVisible(false);
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
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Đăng sản phẩm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                            <CFormLabel>Chọn cửa hàng</CFormLabel>
                            <MultiSelect
                                displayValue='name'
                                options={shops}
                                onSelect={onSelectShops}
                                onRemove={onSelectShops}
                            />
                        </CRow>
                        <CRow className="mb-3" controlId="exampleForm.ControlInput1">
                            <CFormLabel>Chọn template</CFormLabel>
                            <CFormSelect className="ms-2" aria-label="Default select example" onChange={(e) => onSelectTemplate(e.target.value)}>
                                <option value="">-- Chọn template --</option>
                                {templates && templates.map((template, index) => (
                                    <option key={index} value={template.id}>{template.name}</option>
                                ))}
                            </CFormSelect>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <div className="mx-auto">
                        <CButton type="submit" color="primary" className="me-3" onClick={goToStep2}>
                            Tiếp tục
                        </CButton>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Đóng
                        </CButton>
                    </div>
                </CModalFooter>
            </CModal>
        </>
    );
};

const ChooseListings = ({ visible, setVisible, listings, selectedShops, selectedTemplate }) => {
    const [toast, setToast] = useState(null);
    const [selectedListings, setSelectedListings] = useState([]);
    const [step2Shops, setStep2Shops] = useState([]);
    const [step2Template, setStep2Template] = useState({});
    const [visibleUploadCert, setVisibleUploadCert] = useState(false);
    const [listingNeedCert, setListingNeedCert] = useState({});

    const [progress, setProgress] = useState(0);

    // button upload
    const [uploadBtnStatus, setUploadBtnStatus] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // data to upload to tiktok
    const [draftMode, setDraftMode] = useState(true);

    useEffect(() => {
        listings && setSelectedListings(listings);
    }, [listings]);

    useEffect(() => {
        setStep2Shops(selectedShops);
    }, [selectedShops]);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                if (!selectedTemplate) return;
                const findTpl = await apiRequest.get(`/templates/${selectedTemplate}`);
                console.log(findTpl);
                setStep2Template(findTpl.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchTemplate();
    }, [selectedTemplate]);

    const editListing = (listingId) => {
        // loop listing and add isEdit true
        setSelectedListings(selectedListings.map(l => l.id === listingId ? { ...l, isEdit: true } : l));
        // disable upload button
        setUploadBtnStatus(true);
    }

    const processEditListing = (listingId, listingNameEdit) => {
        setSelectedListings(selectedListings.map(l => l.id === listingId ? { ...l, name: listingNameEdit } : l));
    }

    const finishEditListing = (listingId) => {
        setSelectedListings(selectedListings.map(l => l.id === listingId ? { ...l, isEdit: false } : l));
        setUploadBtnStatus(false);
    }

    const showUploadCertModal = (listingId) => {
        setListingNeedCert(selectedListings.find(l => l.id === listingId));
        setVisibleUploadCert(true);
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


    const closeModal = () => {
        // onChange();
        setVisible(false)
    };

    const uploadTiktokProducts = async () => {
        try {
            // initial state for upload, should reset all fields            
            setUploadBtnStatus(true);
            setProgress(0);
            setIsUploading(true);

            const res = await apiRequest.post('/products/upload-to-tiktok',
                {
                    listings: selectedListings,
                    shops: step2Shops,
                    template: step2Template,
                    draftMode
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
                    <CModalTitle className="ms-5">Đăng sản phẩm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <ToastNoti toast={toast} setToast={setToast} />
                    <div className="modal-body">
                        <div className="column input-section">
                            <h5>Preview</h5>
                            <CRow className="mt-3">
                                <CFormLabel className="col-4" controlId="exampleForm.ControlInput1">
                                    Shop: {step2Shops && step2Shops.map((shop, index) => (<CBadge color="danger" key={index}>{shop.name}</CBadge>))}
                                </CFormLabel>
                            </CRow>
                            <CRow className="mt-3">
                                <CFormLabel className="col-4">
                                    Template: {step2Template && <CBadge color="info">{step2Template.name}</CBadge>}
                                </CFormLabel>
                            </CRow>
                        </div>
                        <div className="column product-list">
                            <div className="header-fixed d-flex justify-content-between align-items-center">
                                <h5>Listings</h5>
                                <div className="d-flex align-items-center ms-auto">
                                    <CFormLabel htmlFor="isDraft" className="me-2 mb-0">Đăng Draft</CFormLabel>
                                    <Toggle
                                        defaultChecked={draftMode}
                                        id="isDraft"
                                        name='isDraft'
                                        value='yes'
                                        className='me-2'
                                    />
                                </div>
                            </div>
                            <div className="scrollable">
                                {selectedListings.length > 0 ? (
                                    <CTable striped>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell></CTableHeaderCell>
                                                <CTableHeaderCell>Tên</CTableHeaderCell>
                                                <CTableHeaderCell></CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {selectedListings.map((listing, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>
                                                        <CAvatar size="md" src={listing.images[0]} />
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {listing.isEdit ?
                                                            <CFormTextarea name="name" value={listing.name} onChange={(e) => processEditListing(listing.id, e.target.value)} />
                                                            : <CFormLabel>{listing.name}</CFormLabel>
                                                        }
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CRow className="d-flex flex-column">
                                                            <CCol>
                                                                {listing.isEdit ?
                                                                    <CButton color="success" className="me-2 mb-2" onClick={() => finishEditListing(listing.id, listing.name)}>
                                                                        <CIcon icon={cilCheckCircle} className="me-2" /> Xong
                                                                    </CButton>
                                                                    : <CButton color="info" className="me-2 mb-2" onClick={() => editListing(listing.id)}>
                                                                        <CIcon icon={cilPencil} className="me-2" /> Sửa
                                                                    </CButton>
                                                                }
                                                            </CCol>
                                                            <CCol>
                                                                {listing.isCertUpload == 0 ? <CButton color="warning" onClick={() => showUploadCertModal(listing.id)}>
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
                                <div>Đang đăng sản phẩm ..</div>
                                <CProgress color='success' value={100} max={100} />
                            </div>
                            :
                            <>
                                <CButton color="primary" className="me-5" onClick={uploadTiktokProducts} disabled={uploadBtnStatus ? true : false}>
                                    Đăng sản phẩm
                                </CButton>
                                <CFormLabel htmlFor="isCheckStatus" className="me-2 mb-0">Check Listing</CFormLabel>
                                <Toggle
                                    defaultChecked={false}
                                    id="isCheckStatus"
                                    name='isCheckStatus'
                                    value='yes'
                                    className='me-2'
                                />
                            </>
                        }
                    </div>
                </CFooter>
            </CModal>
            <UploadCertModal visible={visibleUploadCert} setVisible={setVisibleUploadCert} listingCert={listingNeedCert} />
        </div>
    );
};

const UploadCertModal = ({ visible, setVisible, listingCert }) => {

    const [certImages, setCertImages] = useState([]);
    const [toast, setToast] = useState(null);

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

    const processUploadImage = async () => {
        try {
            if (certImages[0] === undefined) return;
            const response = await apiRequest.post('/products/upload-cert', {
                listingId: listingCert.id,
                imageUri: certImages[0]
            });
            console.log(response);
            handleShowToast('Upload certificate thanh cong!');
            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <ToastNoti toast={toast} setToast={setToast} />
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
                scrollable
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle id="LiveDemoExampleLabel">Upload Certificate</CModalTitle>
                </CModalHeader>
                <CModalBody className="d-flex flex-column">
                    <CRow>
                        <CFormLabel htmlFor="listingName" className="me-2 mb-0">Sản phẩm {listingCert && listingCert.name}</CFormLabel>
                    </CRow>
                    <CRow>
                        <CFormLabel>Upload Certificate</CFormLabel>
                        {listingCert && certImages.length > 0 ? certImages.map((image, index) => (
                            <CCol xs={3} key={index} className="position-relative">
                                <CImage
                                    className="m-2 img-thumbnail"
                                    rounded
                                    src={image}
                                    width={100}
                                    height={100}
                                />
                                <CIcon icon={cilX} className="position-absolute top-0 float-start text-danger fw-bold"
                                    onClick={() => {
                                        const newImages = certImages.filter((img, i) => i !== index);
                                        setCertImages(newImages);
                                    }} />
                            </CCol>
                        )) : <div className="text-center">
                            <UploadWidget
                                uwConfig={{
                                    multiple: true,
                                    cloudName: "dg5multm4",
                                    uploadPreset: "estate_3979",
                                    folder: "posts",
                                }}
                                setState={setCertImages}
                            />
                        </div>}
                    </CRow>
                </CModalBody>
                <CFooter className="d-flex justify-content-end">
                    <div className="mx-auto">
                        <CButton color="primary" onClick={processUploadImage}>
                            <CIcon icon={cilCloudUpload} className="me-2" /> Gửi lên
                        </CButton>
                    </div>
                </CFooter>
            </CModal>
        </div>
    );
}

export default UploadToShop;
