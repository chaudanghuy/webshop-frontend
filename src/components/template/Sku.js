import { cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
    CRow,
    CCol,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton,
    CFormLabel,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import ImageUpload from "react-image-easy-upload";
import { uploadToCloudinary } from "../../services/cloudinaryService";

const Sku = ({ parentId, skuFields, handleSKUDataChange }) => {

    const [rows, setRows] = useState([]);
    const [skuImage, setSkuImage] = useState('');
    const [skuPrice, setSkuPrice] = useState(0);
    const [skuQty, setSkuQty] = useState(0);
    const [skuCode, setSkuCode] = useState('{{code}}');

    useEffect(() => {
        // loop skuFields and create array rows with id match parentId
        const rows = skuFields.filter(row => row.id === parentId);
        setRows(rows);
    }, [skuFields]);

    const handleDeleteSku = (idSku) => {
        const updateDeleteSkus = skuFields.filter(item => item.idSku !== idSku);
        setRows(
            updateDeleteSkus.filter(row => row.id === parentId)
        );
    }

    const handleImageUpload = async (file) => {
        try {
            const imageUrl = await uploadToCloudinary(file);
            setSkuImage(imageUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddSku = (idSku, name) => {
        // find row with idSku and update row.isAdd to true
        rows.map(row => row.idSku === idSku ? { ...row, isAdd: true } : row);
        setRows(rows);

        handleSKUDataChange(idSku, {
            id: idSku,
            parentId: parentId,
            name: name,
            image: skuImage,
            price: skuPrice,
            qty: skuQty,
            code: skuCode
        });
    }

    return (
        <>
            {rows && rows.map(row => (
                <CRow key={row.idSku} className="mb-3 border p-3 rounded">
                    <CRow>
                        <ImageUpload
                            setImage={handleImageUpload}
                            width="150px"
                            height="150px"
                            shape="square"
                        />
                        <CCol col='auto'>
                            {row.name && <CFormLabel color='danger'>{row.name}</CFormLabel>}
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText>Giá</CInputGroupText>
                                <CFormInput id="skuAttributePrice" name="skuAttributePrice" aria-label="Amount (to the nearest dollar)" onChange={(e) => setSkuPrice(e.target.value)} />
                                <CInputGroupText>$</CInputGroupText>
                            </CInputGroup>
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                <CFormInput id="skuAttributeQuantity" name="skuAttributeQuantity" aria-describedby="basic-addon3" onChange={(e) => setSkuQty(e.target.value)} />
                            </CInputGroup>
                        </CCol>
                        <CCol col={3}>
                            <CInputGroup className="mt-5">
                                <CInputGroupText id="basic-addon3">SKU</CInputGroupText>
                                <CFormInput id="basic-url" aria-describedby="basic-addon3" onChange={(e) => setSkuCode(e.target.value)} />
                            </CInputGroup>
                        </CCol>
                        <CCol col={2} className="d-flex flex-column">
                            {row.isAdd ? <CButton color="danger" className="mt-2" onClick={() => handleDeleteSku(row.idSku)}>
                                <CIcon icon={cilTrash} className="me-1" /> Xóa
                            </CButton> : <CButton color="primary" className="mt-5" onClick={() => handleAddSku(row.idSku, row.name)}>
                                <CIcon icon={cilPlus} className="me-1" /> Tạo
                            </CButton>}
                        </CCol>
                    </CRow>
                </CRow>
            ))}
        </>
    );
};

export default Sku;