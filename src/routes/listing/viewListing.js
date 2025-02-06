import {
    CButton,
    CFormLabel,
    CFormText,
    CImage,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";

const ViewListing = ({ visible, setVisible, listing }) => {

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
            alignment="center"
            scrollable
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Sản phẩm #{listing && listing.sku}</CModalTitle>
            </CModalHeader>
            <CModalBody className="d-flex flex-column">
                <div className="row justify-content-center mt-3 mb-3">
                    {listing && listing.images && listing.images.map((image, index) => (
                        <div className="col-3 position-relative">
                            <CImage
                                className="m-2"
                                rounded
                                src={image}
                                width={100}
                                height={100}
                                key={index}
                            />
                        </div>
                    ))}
                </div>
                <CRow className="mt-3">
                    <CFormLabel className="col-12">
                        <CLink href={listing && listing.crawlUrl}>Link sản phẩm</CLink>
                    </CFormLabel>
                </CRow>
                <CRow className="mt-3">
                    <CFormLabel className="col-8">
                        <strong>Tên sản phẩm</strong> <br />
                        {listing && listing.name}
                    </CFormLabel>
                    <CFormText className="col-4">
                        <strong>Giá</strong> <br />
                        {listing && listing.price}
                    </CFormText>
                </CRow>
                <CRow className="mt-3">
                    <CFormLabel className="col-12">
                        <strong>Mô tả</strong> <br />
                        <div
                            className="bottom mt-3"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(listing && listing.description),
                            }}
                        ></div>
                    </CFormLabel>
                </CRow>
            </CModalBody>
        </CModal>
    );
};

export default ViewListing
