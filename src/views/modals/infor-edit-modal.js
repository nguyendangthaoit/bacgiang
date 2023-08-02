import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback,
} from 'reactstrap';
import * as api from '../../services/qlnd';
import { toast } from 'react-toastify';
import { MESSAGESERR, ROLES } from '../../constants/common';
import QLND from '../../constants/field-modal/qlnd';
import { Avatar } from '../../bg';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const InforEditModal = (props) => {

    const [fields, setFields] = useState({ ...QLND });
    const [errors, setErrors] = useState({ ...QLND });
    const userInfo = cookies.get("userInfo");
    const [roles, setRoles] = useState([]);

    useEffect(() => { getAllRoles() }, []);

    async function getAllRoles() {
        await api.getAllRoles().then(res => {
            if (res.data.code === 1) {
                setRoles(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lấy dữ liệu vai trò thất bại.");
            console.log(error);
        });
    }
    useEffect(() => {
        if (userInfo) {
            let fieldsT = { ...fields };
            fieldsT.userName = userInfo.userName;
            fieldsT.fullName = userInfo.fullName;
            fieldsT.phoneNumber = userInfo.phoneNumber;
            fieldsT.role = userInfo.role;
            fieldsT.avatar = userInfo.avatar;
            setFields(fieldsT);
        }
    }, [])

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        if (field === 'userName' || !field) {
            if (!fieldsT.userName)
                errorsT.userName = MESSAGESERR.field_required;
        }
        if (field === 'role' || !field) {
            if (!fieldsT.role)
                errorsT.role = MESSAGESERR.field_required;
        }
        setErrors(errorsT);
        return Object.values(errorsT).every(x => !x);
    }
    const handleChange = (e, field) => {
        let fieldsT = { ...fields };
        fieldsT[field] = e.target.value;
        setFields(fieldsT);
        handleValidation(field, fieldsT);
    }
    const save = async () => {
        if (handleValidation('', fields)) {
            const obj = {
                ...fields, id: userInfo.id
            };
            await api.edit(obj).then(res => {
                if (res.data.code === 1) {
                    toast.success("Cập nhật thành công.");
                    let user = { ...obj };
                    user['avatar'] = '';
                    delete user.password;
                    cookies.set("userInfo", JSON.stringify(user));
                    // localStorage.setItem("userInfo", JSON.stringify(user));
                    props.close();
                } else
                    toast.warning(res.data.message);
            }).catch((error) => {
                toast.warning("Cập nhật thất bại.");
                console.log(error);
            });
        }

    }
    const changeImage = (e) => {
        e.preventDefault();
        let input = document.getElementById("fileInputImage");
        input.click()
    }
    const handleChangeImage = (e) => {
        const formData = new FormData();
        // Update the formData object 
        formData.append("file", e.target.files[0]);
        // api.importExcel(formData)
        //     .then(res => {
        //         if (res.data.code == 1) {
        //             toast.success("Nhập từ Excel thành công.");
        //             search();
        //         } else
        //             toast.warning(res.data.message);
        //     }).catch((error) => {
        //         toast.warning("Nhập từ Excel thất bại.");
        //         console.log(error);
        //     });
    }
    const keyPressPhone = (e) => {
        if (e.charCode < 48 || e.charCode > 57)
            e.preventDefault();
    }
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-ms">
                    <ModalHeader toggle={() => props.close()}>Chỉnh sửa thông tin cá nhân</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={12} style={{ textAlign: 'center' }}>
                                <Avatar size="small" color="white" className="image-infor" initials="JS" image={fields.avatar} />
                                {/* < Label onClick={save}>Kích vào đây để chọn ảnh mới</Label> */}
                                <Button className="col-md-12" color="success" style={{ marginBottom: '1rem' }} onClick={changeImage}>Kích vào đây để chọn ảnh mới</Button>
                                <Input type="file" hidden id="fileInputImage" onChange={handleChangeImage} accept="image/*" />
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label className="required" for="userName">Tên tài khoản</Label>
                                    <Input value={fields.userName} onChange={(e) => handleChange(e, 'userName')} type="text" name="userName" id="userName" placeholder="Tên tài khoản" invalid={!!errors.userName} disabled />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.userName}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="fullName">Tên đầy đủ</Label>
                                    <Input value={fields.fullName} onChange={(e) => handleChange(e, 'fullName')} type="text" name="fullName" id="fullName" placeholder="Tên đầy đủ" />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="phoneNumber">Số điện thoại</Label>
                                    <Input value={fields.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} type="text" name="phoneNumber" id="phoneNumber" placeholder="Số điện thoại" onKeyPress={keyPressPhone} />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label className="required" for="role">Vai trò</Label>
                                    <Input type="select" name="role" id="role" value={fields.role} onChange={(e) => handleChange(e, 'role')} disabled={userInfo && userInfo.role === ROLES.USER} invalid={!!errors.role}>
                                        <option value="">Chọn vai trò</option>
                                        {
                                            roles.map(e =>
                                                <option value={e} key={e}>{e}</option>
                                            )
                                        }
                                    </Input>
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.role}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={save}>Lưu lại</Button>
                        <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card >
    );
}
export default InforEditModal;
