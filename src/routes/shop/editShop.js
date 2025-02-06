import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormText,
    CFormTextarea,
    CImage,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CToast,
    CToastBody,
    CToastHeader
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import CIcon from "@coreui/icons-react";
import { cilBell, cilPlus, cilTrash, cilX } from "@coreui/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import MultiSelect from "multiselect-react-dropdown";
import { ToastNoti } from "../../components/notification/ToastNoti";

const EditShop = ({ visible, setVisible, shop }) => {

    // set noti
    const [toast, setToast] = useState(null);

    const [images, setImages] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const STATUS_ENUMS = ['CONNECTED', 'DISCONNECTED'];

    const [shopProfile, setShopProfile] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopTeamId, setShopTeamId] = useState('');
    const [shopCode, setShopCode] = useState('');
    const [shopCreatedBy, setShopCreatedBy] = useState('');
    const [shopPriceDiff, setShopPriceDiff] = useState('');
    const [shopItems, setShopItems] = useState([]);
    const [shopStatus, setShopStatus] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                apiRequest.get('/teams')
                    .then(res => {
                        setTeams(res.data.teams);
                    })
            } catch (error) {
                console.log(error);
            }
        }

        if (shop) {
            setShopProfile(shop.profile);
            setShopName(shop.name);
            setShopTeamId(shop.teamId);
            setShopCode(shop.code);
            setShopCreatedBy(shop.createdBy);
            setShopPriceDiff(shop.priceDiff);
            setShopItems(shop.shopItems);
            setShopStatus(shop.status);
            setImages(shop.images);
        }

        fetchTeams();
    }, [shop]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (selectedTeam === null) {
                    return;
                }
                apiRequest.get(`/users/ids/${selectedTeam}`).then(res => {
                    if (res.data.length === 0) {
                        handleShowToast("Chưa có user nào trong nhóm");
                        setUsers([]);
                    }
                    setUsers(res.data);
                })
            } catch (error) {
                console.log(error);
            }
        }

        setUsers([]);
        fetchUsers();
    }, [selectedTeam, shopTeamId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: shopName || shop.name,
                profile: shopProfile || shop.profile,
                code: shopCode || shop.code,
                priceDiff: shopPriceDiff || shop.priceDiff,
                shopItems: shopItems || shop.shopItems,
                images: JSON.stringify(images),                                
                status: shopStatus || shop.status,
            }

            const res = await apiRequest.put(`/shops/${shop.id}`, payload);
            setVisible(false);
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

    const handleSelectUsers = (selectedList, selectedItem) => {        
        setSelectedUsers(selectedList.map(item => item.id));
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
                    <CModalTitle id="LiveDemoExampleLabel">Cập nhật shop #{shop.sku}</CModalTitle>
                </CModalHeader>
                <CModalBody className="d-flex flex-column">
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="name" name="name" label="Shop name" value={shop.name} onChange={(e) => setShopName(e.target.value)} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="profile" name="profile" label="Profile name" value={shopProfile} onChange={(e) => setShopProfile(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="code" name="code" label="Shop code" value={shop.code} onChange={(e) => setShopCode(e.target.value)} />
                        </CCol>
                    </CRow>                                        
                    <CRow className="mt-3">
                        <CCol md={6}>
                            <CFormInput type="text" id="priceDiff" name="priceDiff" label="Price List" value={shopPriceDiff} onChange={(e) => setShopPriceDiff(e.target.value)} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="shopItems" name="shopItems" label="Quantity" value={shopItems} onChange={(e) => setShopItems(e.target.value)} />
                        </CCol>
                    </CRow>
                    <CRow className="clearfix">
                        <CFormLabel className="col-2 col-form-label">
                            Images Frames
                        </CFormLabel>
                        {images && images.map((image, index) => (
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
                                        const newImages = images.filter((img, i) => i !== index);
                                        setImages(newImages);
                                    }} />
                            </CCol>
                        ))}
                        <div className="text-center">
                            <UploadWidget
                                uwConfig={{
                                    multiple: true,
                                    cloudName: "dg5multm4",
                                    uploadPreset: "estate_3979",
                                    folder: "posts",
                                }}
                                setState={setImages}
                            />
                        </div>
                    </CRow>
                    <CRow className="mt-3 mb-2">
                        <CCol md={12}>
                            <CFormLabel>
                                Status
                            </CFormLabel>
                            <CFormSelect aria-label="Default select example" defaultValue={shop.status} onChange={(e) => setShopStatus(e.target.value)}>
                                <option>--Chọn status--</option>
                                {STATUS_ENUMS.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>                    
                    <CRow className="d-flex justify-content-center" >
                        <CButton color="primary" className=" col-3" onClick={handleSubmit}>
                            Cập nhật
                        </CButton>
                    </CRow>
                </CModalBody>
            </CModal>
        </>
    );
};

export default EditShop
