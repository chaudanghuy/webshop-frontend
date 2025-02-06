import React, { useEffect, useState } from 'react'
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPencil, cilPlus, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { auto } from '@popperjs/core';
import TreeSelect from '../../components/TreeSelect';
import apiRequest from '../../lib/apiRequest';
import DropdownSearch from '../../components/dropdownSearch/DropdownSearch';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import ImageUpload from 'react-image-easy-upload';
import Sku from '../../components/template/SKU';
import { IdentifierCode } from '../../utils/enums/product';

const EditTemplate = () => {
    const navigate = useNavigate();

    // Initial state
    const params = useParams();
    const { id } = params;
    const [template, setTemplate] = useState(null);

    // Form fields
    const [templateDescription, setTemplateDescription] = useState('{{description}}');
    const [categoryId, setCategoryId] = useState(null);
    const [formAttributes, setFormAttributes] = useState([]);
    const [formCompliances, setFormCompliances] = useState([]);
    const [formSkus, setFormSkus] = useState([]);
    const [isSale, setIsSale] = useState(false);
    const [isCOD, setIsCOD] = useState(false);
    const [identifierCodes, setIdentifierCodes] = useState([
        IdentifierCode.GTIN, IdentifierCode.EAN, IdentifierCode.UPC, IdentifierCode.ISBN
    ]);
    const [identifierCode, setIdentifierCode] = useState(IdentifierCode.GTIN);
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * RENDER FROM TITKOK
     */
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [sku, setSku] = useState([]);

    /**
     * SKU Fields
     */
    const [skus, setSkus] = useState([]);
    const [skuFields, setSkuFields] = useState([]);
    const [skuTempValue, setSkuTempValue] = useState({});
    const [skuTempAttribute, setSkuTempAttribute] = useState([]);
    const [skuImage, setSkuImage] = useState("");
    const [tempSkuImageId, setTempSkuImageId] = useState(null);

    // Dynamic Form Fields
    const [formFields, setFormFields] = useState([]);

    // PARSE ATTRIBUTES
    const [existingAttributes, setExistingAttributes] = useState([]);
    const [existingCompliances, setExistingCompliances] = useState([]);

    /** LOAD TEMPLATE */
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await apiRequest.get('/templates/' + id);
                console.log('Template:', response.data);
                setTemplate(response.data);
                setCategoryId(response.data.categoryId);

                // Parse attributes and set existing attributes
                const attributes = JSON.parse(response.data.attributes);
                setExistingAttributes(attributes);

                // Parse compliances and set existing compliances
                const compliances = JSON.parse(response.data.compliances);
                setExistingCompliances(compliances);

                // set sku fields
                const skus = JSON.parse(response.data.skus);
                const parsedSkus = skus.map(sku => ({
                    idSku: sku.id,
                    image: sku.image,
                    price: sku.price,
                    qty: sku.qty,
                    code: sku.code
                }));
                console.log(parsedSkus);
                setSkus(parsedSkus);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplate();
    }, []);

    useEffect(() => {
        if (categoryId === null) return;
        fetchAttributes(template?.categoryId);
    }, [categoryId]);

    const handleFieldChange = (fieldKey, value) => {
        const isExisting = formFields.some(item => item.id === fieldKey);
        if (!isExisting) {
            return setFormFields([...formFields, { id: fieldKey, value }]);
        } else {
            const updatedFormFields = formFields.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value };
                }
                return item;
            });
            return setFormFields(updatedFormFields);
        }
    };

    /** SKU PROCESS */
    useEffect(() => {
        handleSKUImageChange();
    }, [skuImage]);

    const handleAddSku = (fieldKey) => {
        if (!skuTempAttribute || !skuTempValue) {
            return;
        }

        // if skuTempValue id is not match with fieldKey, return
        if (skuTempValue.id !== fieldKey) {
            return;
        }

        const newSku = {
            id: fieldKey,
            idSku: Date.now(),
            name: skuTempValue.name,
        }
        setSkuTempAttribute([]);
        return setSkuFields([...skuFields, newSku]);
    }

    const handleDeleteSku = (id) => {
        setSkuFields(skuFields.filter(item => item.idSku !== id));
    }

    const handleFormSKUTempChange = (fieldKey, value) => {
        if (!value) {
            return;
        }
        setSkuTempValue({ id: fieldKey, name: value });

        const isExisting = Array.isArray(skuTempAttribute) && skuTempAttribute.some(item => item.id === fieldKey);
        if (isExisting) {
            // if existing , add value to existing array value
            const updatedFormSkus = skuTempAttribute.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value: [...item.value, value] };
                }
                return item;
            });
            return setSkuTempAttribute(updatedFormSkus);
        }

        return setSkuTempAttribute({ id: fieldKey, value: [value] });
    }

    const handleFormSKUChange = (fieldKey, value) => {
        if (!value) {
            return;
        }

        const isExisting = formSkus.some(item => item.id === fieldKey);
        if (isExisting) {
            const updatedFormSkus = formSkus.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value };
                }
                return item;
            });
            return setFormSkus(updatedFormSkus);
        }

        return setFormSkus([...formSkus, { id: fieldKey, value }]);
    }

    const handleSKUImageChange = () => {
        if (!tempSkuImageId || !skuImage) {
            return;
        }

        const isExisting = formSkus.some(item => item.id === tempSkuImageId);
        if (isExisting) {
            const updatedFormSkus = formSkus.map(item => {
                if (item.id === tempSkuImageId) {
                    return { ...item, image: skuImage };
                }
                return item;
            });
            // clear tempSkuImageId and skuImage
            setTempSkuImageId(null);
            setSkuImage("");
            return setFormSkus(updatedFormSkus);
        } else {
            const newSku = {
                id: tempSkuImageId,
                image: skuImage,
            }
            // clear tempSkuImageId and skuImage
            setTempSkuImageId(null);
            setSkuImage("");
            return setFormSkus([...formSkus, newSku]);
        }
    }
    /** END SKU PROCESS */

    /** CATEGORIES PROCESS */

    function transformToTree(data) {
        // Map to store nodes by tiktokId for quick lookup
        const nodeMap = new Map();

        // Final tree structure
        const tree = [];

        // Step 1: Initialize nodes with their basic structure
        data.forEach((item) => {
            const node = {
                id: item.id,
                label: item.name,
                tiktokId: item.tiktokId,
                level: item.tiktokParentId === "0" ? 0 : null, // Level will be adjusted later
                children: [],
            };
            nodeMap.set(item.tiktokId, node);
        });

        // Step 2: Build the tree by assigning children to their parents
        data.forEach((item) => {
            const node = nodeMap.get(item.tiktokId);

            if (item.tiktokParentId === "0") {
                // Top-level nodes go directly to the tree
                tree.push(node);
            } else {
                // Find the parent and add this node to its children
                const parent = nodeMap.get(item.tiktokParentId);
                if (parent) {
                    node.level = (parent.level || 0) + 1;
                    parent.children.push(node);
                }
            }
        });

        return tree;
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiRequest.get('/categories');
                const treeData = transformToTree(response.data);
                setCategories(treeData);
                //TODO
                //WAIT FOR API LOAD CATEGORIES BEFORE SHOW FORM
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const reloadCategories = async () => {
        try {
            const response = await apiRequest.get('/categories');
            const treeData = transformToTree(response.data);
            setCategories(treeData);
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    }

    const fetchAttributes = async (categoryId) => {
        try {
            setAttributes([]);
            setCompliances([]);
            setSku([]);
            setCategoryId(categoryId);
            const response = await apiRequest.get(`/categories/attributes?category_id=${categoryId}`);
            // loop response if item.is_required true add to attributes, otherwise add to compliances
            response.data.forEach(item => {
                if (item.type == 'PRODUCT_PROPERTY') {
                    if (item.is_customizable) {
                        setAttributes(prevAttributes => [...prevAttributes, {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            options: item.values
                        }]);
                    } else {
                        setCompliances(prevCompliances => [...prevCompliances, {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            options: item.values
                        }])
                    }
                } else {
                    setSku(prevSku => [...prevSku, {
                        id: item.id,
                        name: item.name,
                        type: item.type
                    }])
                }
            })
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

    /** END CATEGORIES */

    /** FORM FIELDS */
    const handleFormAttributeChange = (fieldKey, value, label) => {
        if (!value) {
            return;
        }
        const isExisting = formAttributes.some(item => item.id === fieldKey);

        if (isExisting) {
            const updatedFormAttributes = formAttributes.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value };
                }
                return item;
            });
            return setFormAttributes(updatedFormAttributes);
        }

        return setFormAttributes([...formAttributes, { id: fieldKey, value, label }]);
    }

    const handleFormComplianceChange = (fieldKey, value) => {
        if (!value) {
            return;
        }
        const isExisting = formCompliances.some(item => item.id === fieldKey);
        if (isExisting) {
            const updatedFormCompliances = formCompliances.map(item => {
                if (item.id === fieldKey) {
                    return { ...item, value };
                }
                return item;
            });
            return setFormCompliances(updatedFormCompliances);
        }

        return setFormCompliances([...formCompliances, { id: fieldKey, value }]);
    }

    const handleIdentifierCodeChange = (code) => {
        setIdentifierCode(code);
    }

    /** END FORM FIELDS */

    // back to templates
    const redirect = () => {
        navigate('/templates');
    }

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);

            const payload = {
                name: formData.get('name'),
                type: formData.get('type'),
                productTemplate: formData.get('productTemplate'),
                templateDescription: templateDescription,
                categoryId: categoryId,
                attributes: JSON.stringify(formAttributes),
                compliances: JSON.stringify(formCompliances),
                skus: JSON.stringify(formSkus),
                identifierCode: identifierCode,
                identifierCodeValue: formData.get('identifierCodeValue'),
                skuPrice: formData.get('skuPrice'),
                inventoryQuantity: formData.get('inventoryQuantity'),
                sellerSku: formData.get('sellerSku'),
                isSale: isSale,
                isCOD: isCOD,
                packageWeightValue: formData.get('packageWeightValue'),
                packageDimensionLength: formData.get('packageDimensionLength'),
                packageDimensionWidth: formData.get('packageDimensionWidth'),
                packageDimensionHeight: formData.get('packageDimensionHeight')
            }

            const res = await apiRequest.post('/templates', payload);
            console.log('Template created:', res.data);

            redirect('/templates');
        } catch (error) {
            setErrorMessage(error.response.data.message);
            console.error('Error adding template:', error);
        }
    };

    return (
        <>
            <CButton className='mb-3' color="warning" onClick={redirect}>
                <CIcon icon={cilArrowLeft} className="me-1" /> Quay lại
            </CButton>
            <CForm method='post' onSubmit={handleSubmit}>
                <CRow>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    THÔNG TIN TEMPLATE
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3">
                                    <CCol md={6}>
                                        <CFormInput type="text" id="name" name="name" label="Tên" value={template && template.name} readOnly disabled />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel>Loại</CFormLabel>
                                        <CFormSelect id='type' name='type' aria-label='Loại' defaultValue={template && template.type ? template.type : 'Dropshipping'} readOnly disabled>
                                            <option value='Dropshipping'>Dropshipping</option>
                                            <option value='POD'>POD</option>
                                        </CFormSelect>
                                    </CCol>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    THÔNG TIN SẢN PHẨM
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3">
                                    <CCol xs={12}>
                                        <CFormInput id="productTemplate" name='productTemplate' label="Tên" placeholder="" value={template && template.productTemplate} readOnly disabled />
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel>Mô tả</CFormLabel>
                                        <ReactQuill
                                            theme="snow"
                                            value={template && template.productTemplateDescription}
                                            onChange={setTemplateDescription}
                                            readOnly
                                            disabled
                                        />
                                    </CCol>
                                    <CCol xs={12}>
                                        <CFormLabel htmlFor="inputAddress2">Danh mục</CFormLabel>
                                        {template && template.categoryName ?
                                            <CFormInput
                                                type="text"
                                                id="inputCategoryName"
                                                value={template.categoryName}
                                                disabled
                                                readOnly
                                            />
                                            : <>
                                                <CButton color='warning' className='mt-2 mb-3 ms-2'>
                                                    <CIcon icon={cilReload} className="me-1" onClick={reloadCategories} />
                                                </CButton>
                                                <TreeSelect treeData={categories} onCategorySelect={fetchAttributes} />
                                            </>}
                                    </CCol>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    THUỘC TÍNH SẢN PHẨM
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3">
                                    {attributes.map(field => (
                                        existingAttributes.some(item => item.id == field.id) ? (
                                            <div className="col-4" key={field.id}>
                                                <CFormInput
                                                    type="text"
                                                    id={field.id}
                                                    name={field.id}
                                                    value={existingAttributes.find(item => item.id == field.id).label}
                                                    label={field.name}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        ) : <div className="col-4" key={field.id}>
                                            <CFormInput
                                                type="text"
                                                id={field.id}
                                                name={field.id}
                                                value=''
                                                label={field.name}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    PRODUCT COMPLIANCE
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3">
                                    {compliances.map((compliance, index) => (
                                        existingCompliances.some(item => item.id != compliance.id) ? (
                                            <div className="col-4" key={compliance.id}>
                                                <CFormLabel>{compliance.name}</CFormLabel>
                                                <CIcon icon={cilPencil} size="sm" className="ms-2" />
                                                <CFormInput
                                                    type="text"
                                                    id={compliance.id}
                                                    name={compliance.id}
                                                    value={existingCompliances.find(item => item.id == compliance.id)?.label}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        ) :
                                            <CCol md={4} key={index}>
                                                <CFormLabel>{compliance.name}</CFormLabel>
                                                <CFormSelect aria-label="Product Compliance" onChange={(e) => handleFormComplianceChange(compliance.id, e.target.value)}>
                                                    <option>Select..</option>
                                                    {compliance.options && compliance.options.map((value, index) => (
                                                        <option key={index} value={value.id}>{value.name}</option>
                                                    ))}
                                                </CFormSelect>
                                            </CCol>
                                    ))}
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    SKUS SẢN PHẨM
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <CForm className="row g-3">
                                    {skus && skus.map(row => (
                                        <CRow key={row.idSku} className="mb-3 border p-3 rounded">
                                            <CRow>
                                                <CCol col='auto'>
                                                    <CImage
                                                        src={row.image}
                                                        width="150px"
                                                        height="150px"
                                                        shape="square"
                                                    />
                                                </CCol>
                                                <CCol col='auto'>
                                                    <CFormInput
                                                        className='mt-5'
                                                        type="text"
                                                        id="skuAttributeName"
                                                        name="skuAttributeName"
                                                        value={row.idSku}
                                                        readOnly
                                                        disabled
                                                    />
                                                </CCol>
                                                <CCol col={3}>
                                                    <CInputGroup className="mt-5">
                                                        <CInputGroupText>Giá</CInputGroupText>
                                                        <CFormInput 
                                                            id="skuAttributePrice" 
                                                            name="skuAttributePrice" 
                                                            aria-label="Amount (to the nearest dollar)" 
                                                            value={row.price}
                                                            readOnly
                                                            disabled
                                                        />
                                                        <CInputGroupText>$</CInputGroupText>
                                                    </CInputGroup>
                                                </CCol>
                                                <CCol col={3}>
                                                    <CInputGroup className="mt-5">
                                                        <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                                        <CFormInput 
                                                            id="skuAttributeQuantity" 
                                                            name="skuAttributeQuantity" 
                                                            aria-describedby="basic-addon3" 
                                                            value={row.qty}
                                                            readOnly
                                                            disabled
                                                        />
                                                    </CInputGroup>
                                                </CCol>
                                                <CCol col={3}>
                                                    <CInputGroup className="mt-5">
                                                        <CInputGroupText id="basic-addon3">SKU</CInputGroupText>
                                                        <CFormInput 
                                                            id="basic-url"
                                                            aria-describedby="basic-addon3" 
                                                            value={row.code}
                                                            readOnly
                                                            disabled
                                                        />
                                                    </CInputGroup>
                                                </CCol>
                                            </CRow>
                                        </CRow>
                                    ))}
                                </CForm>
                                <CForm className="row row-cols-lg-auto g-3 align-items-center mt-3">
                                    <CRow col={12}>
                                        <CFormLabel htmlFor="inputPassword4">Mặc định</CFormLabel>
                                    </CRow>
                                    <CRow>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CDropdown variant="input-group">
                                                    <CDropdownToggle color="secondary" variant="outline">{identifierCode}</CDropdownToggle>
                                                    <CDropdownMenu>
                                                        {identifierCodes.map((code, index) => (
                                                            <CDropdownItem key={index} onClick={() => handleIdentifierCodeChange(code)}>{code}</CDropdownItem>
                                                        ))}
                                                    </CDropdownMenu>
                                                </CDropdown>
                                                <CFormInput 
                                                    id='identifierCodeValue' 
                                                    name='identifierCodeValue' 
                                                    aria-label="Text input with dropdown button" 
                                                    value={template && template.identifierValue}
                                                    required 
                                                    readOnly
                                                    disabled
                                                />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>Giá</CInputGroupText>
                                                <CFormInput 
                                                    type='number' 
                                                    id='skuPrice' 
                                                    name='skuPrice' 
                                                    aria-label="Amount (to the nearest dollar)" 
                                                    readOnly
                                                    disabled
                                                    value={template && template.skuPrice}
                                                />
                                                <CInputGroupText>$</CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText id="basic-addon3">Số lượng</CInputGroupText>
                                                <CFormInput 
                                                    type='number' 
                                                    id="inventoryQuantity" 
                                                    name='inventoryQuantity' 
                                                    aria-describedby="basic-addon3"
                                                    readOnly
                                                    disabled
                                                    value={template && template.skuQty}
                                                />
                                            </CInputGroup>
                                        </CCol>
                                        <CCol col={3}>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText id="basic-addon3">Seller SKU</CInputGroupText>
                                                <CFormInput 
                                                    id="sellerSku" 
                                                    name='sellerSku' 
                                                    aria-describedby="basic-addon3" 
                                                    value={template && template.skuSeller}
                                                    readOnly
                                                    disabled
                                                />
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-5'>
                    <CCol xs={12}>
                        <CCard>
                            <CCardHeader>
                                <strong>
                                    VẬN CHUYỂN
                                </strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row g-3">
                                    <CCol md={4}>
                                        <CFormInput 
                                            type="number" 
                                            id="packageWeightValue" 
                                            name='packageWeightValue' 
                                            label="Trọng lượng gói hàng (KILOGRAM)*"
                                            value={template && template.packageWeight}
                                            readOnly
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className='col-12'>Đang giảm giá</CFormLabel>
                                        <Toggle
                                            className='mt-2 me-2'
                                            defaultChecked={template && template.isSale == 1 ? true : false}
                                            id="iSale"
                                            name='isSale'
                                            value='yes'               
                                            readOnly
                                            disabled                             
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel className='col-12'>Thanh toán khi nhận hàng (COD)</CFormLabel>
                                        <Toggle
                                            className='mt-2 me-2'
                                            defaultChecked={template && template.isCOD == 1 ? true : false}
                                            id='isCODAllowed'
                                            name='isCODAllowed'
                                            value='yes'
                                            readOnly
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput 
                                            type="number" 
                                            id="packageDimensionLength" 
                                            name='packageDimensionLength' 
                                            label="Kích thước chiều dài gói hàng (CENTIMETER) " 
                                            value={template && template.packageLength}
                                            readOnly
                                            disabled 
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput 
                                            type="number" 
                                            id="packageDimensionWidth" 
                                            name='packageDimensionWidth' 
                                            label="Kích thước chiều rộng gói hàng (CENTIMETER)" 
                                            value={template && template.packageWidth}
                                            readOnly
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormInput 
                                            type="number" 
                                            id="packageDimensionHeight" 
                                            name='packageDimensionHeight' 
                                            label="Kích thước chiều cao gói hàng (CENTIMETER)" 
                                            value={template && template.packageHeight}
                                            readOnly
                                            disabled
                                        />
                                    </CCol>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow className='mt-3'>
                    <CFormLabel color='danger' className='text-danger'>{errorMessage}</CFormLabel>
                </CRow>
            </CForm>
        </>
    )
}

export default EditTemplate;
