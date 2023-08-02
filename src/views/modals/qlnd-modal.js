import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qlnd';
import { toast } from 'react-toastify';
import { ROLES, MESSAGESERR } from '../../constants/common';
import QLND from '../../constants/field-modal/qlnd';
const QLNDModal = (props) => {

    const [fields, setFields] = useState({ ...QLND });
    const [errors, setErrors] = useState({ ...QLND });
    const [roles, setRoles] = useState([]);

    useEffect(() => { getAllRoles() }, []);

    useEffect(() => {
        if (props.item) {
            setFields(props.item);
        }
    }, [props.item])

    async function getAllRoles() {
        await api.getAllRoles().then(res => {
            if (res.data.code == 1) {
                setRoles(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("lấy dữ liệu vai trò thất bại.");
            console.log(error);
        });
    }

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
        if (!props.item && (field === 'password' || !field)) {
            if (!fieldsT.password)
                errorsT.password = MESSAGESERR.field_required;
            else {
                const regux = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
                const result = regux.test(fieldsT.password);
                if (!result)
                    errorsT.password = MESSAGESERR.passW_required;
            }
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
            let obj = {
                ...fields
            };
            if (!props.item) {
                await api.save(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Thêm mới thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Thêm mới thất bại.");
                    console.log(error);
                });
            } else {
                obj['id'] = props.item.id;
                await api.edit(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Cập nhật thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Cập nhật thất bại.");
                    console.log(error);
                });
            }
        }
    }
    const keyPressPhone = (e) => {
        if (e.charCode < 48 || e.charCode > 57)
            e.preventDefault();
    }
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-lg">
                    <ModalHeader toggle={() => props.close()}>{props.item ? 'Cập nhật' : 'Thêm mới'}</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="userName">Tên tài khoản</Label>
                                    <Input value={fields.userName} onChange={(e) => handleChange(e, 'userName')} type="text" name="userName" id="userName" placeholder="Tên tài khoản" disabled={props.item} invalid={!!errors.userName} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.userName}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="fullName">Tên đầy đủ</Label>
                                    <Input value={fields.fullName} onChange={(e) => handleChange(e, 'fullName')} type="text" name="fullName" id="fullName" placeholder="Tên tài khoản" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phoneNumber">Số điện thoại</Label>
                                    <Input value={fields.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} type="text" name="phoneNumber" id="phoneNumber" placeholder="Số điện thoại" onKeyPress={keyPressPhone} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="role">Vai trò</Label>
                                    <Input value={fields.role} onChange={(e) => handleChange(e, 'role')} type="select" name="type" id="type" disabled={props.item && props.item.role === ROLES.USER} invalid={!!errors.role}>
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
                        {
                            !props.item &&
                            <Row >
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="required" for="password">Mật khẩu</Label>
                                        <Input value={fields.password} onChange={(e) => handleChange(e, 'password')} type="password" name="password" id="password" placeholder="Mật khẩu" invalid={!!errors.password} />
                                        <FormFeedback style={{ marginTop: '-20px' }} >{errors.password}</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={save}>Lưu lại</Button>
                        <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    );
}
export default QLNDModal;
