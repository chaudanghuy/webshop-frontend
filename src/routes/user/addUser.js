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
    CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import DOMPurify from "dompurify";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilTrash, cilX } from "@coreui/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import MultiSelect from 'multiselect-react-dropdown'

const AddUser = ({ visible, setVisible, onChange }) => {

    const [teams, setTeams] = useState(null);
    const [shops, setShops] = useState([]);
    const [selectedShops, setSelectedShops] = useState([]);
    const [avatar, setAvatar] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teams = await apiRequest.get('/teams')
                    .then(res => {
                        setTeams(res.data.teams);
                        const shops = apiRequest.get(`/shops`)
                            .then(res2 => {                                
                                setShops(res2.data);
                            })
                    });
            } catch (error) {
                console.log(error);
            }
        }
        fetchTeams();
        setSelectedShops([]);
        setAvatar([]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const payload = {
                username: formData.get('username'),
                password: formData.get('password'),
                email: formData.get('email'),
                avatar: avatar[0],
                teamId: formData.get('team'),
                shops: JSON.stringify(selectedShops),
            }

            const res = await apiRequest.post('/users', payload);
            setVisible(false);
            onChange(true);
        } catch (error) {
            console.log(error);
        }
    }

    const searchBy = (selectedList, selectedItem) => {        
        setSelectedShops(selectedList.map(item => item.id));
    }

    return (
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
            alignment="center"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Tạo tài khoản</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className="mt-3 col-3">
                    <CImage src={avatar[0]} className="col-12 img-fluid mb-2" />
                    <div style={{ height: "15%" }} className="d-flex justify-content-center">
                        <UploadWidget
                            className="col-3"
                            uwConfig={{
                                multiple: true,
                                cloudName: "dg5multm4",
                                uploadPreset: "estate_3979",
                                folder: "users",
                            }}
                            multiple={false}
                            setState={setAvatar}
                        />
                    </div>
                </CRow>
                <CForm className="row g-3" method='post' onSubmit={handleSubmit}>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="text" id="username" name="username" label="Tài khoản" />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="password" id="password" name="password" label="Mật khẩu" />
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormInput type="email" id="email" name="email" label="Email" />
                        </CCol>
                    </CRow>
                    <CRow className="mt-2">
                        <CCol md={12}>
                            <CFormSelect id="team" name="team" label="Team">
                                <option value={null}>-- Chọn team --</option>
                                {teams && teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <CFormLabel>
                                Shop quản lý
                            </CFormLabel>
                            <MultiSelect
                                displayValue='name'
                                options={shops}
                                onSelect={searchBy}
                                placeholder='Chọn shop'                                
                            />
                        </CCol>
                    </CRow>
                    <div className="clearfix"></div>
                    <CRow className="mt-5 d-flex justify-content-center" >
                        <CButton type="submit" color="primary" className=" col-3">
                            Tạo mới
                        </CButton>
                    </CRow>
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default AddUser
