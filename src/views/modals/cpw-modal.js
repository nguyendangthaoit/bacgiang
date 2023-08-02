import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qlnd';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { MESSAGESERR } from '../../constants/common';
import CPW from '../../constants/field-modal/cpw';
import { useHistory } from 'react-router-dom';

const CPWModal = (props) => {


    const [fields, setFields] = useState(CPW);
    const [errors, setErrors] = useState(CPW);
    const history = useHistory();

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        if (field === 'currentPassword' || !field) {
            if (!fieldsT.currentPassword)
                errorsT.currentPassword = MESSAGESERR.field_required;
        }
        if (field === 'password' || !field) {
            if (!fieldsT.password)
                errorsT.password = MESSAGESERR.field_required;
            else {
                const regux = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
                const result = regux.test(fieldsT.password);
                if (!result)
                    errorsT.password = MESSAGESERR.passW_required;
            }
        }
        if (field === 'confirmPassword' || !field) {
            if (!fieldsT.confirmPassword)
                errorsT.confirmPassword = MESSAGESERR.field_required;
            else if (fieldsT.confirmPassword !== fieldsT.password) {
                errorsT.confirmPassword = MESSAGESERR.passW_confirm_wrong;
            }
        }
        setErrors(errorsT);
        return Object.values(errorsT).every(x => !x);
    }
    const handleChange = (e, field) => {
        let fieldsT = { ...fields };
        fieldsT[field] = e.target.value;
        handleValidation(field, fieldsT);
        setFields(fieldsT);
    }
    const save = async () => {
        if (handleValidation('', fields))
            swal({
                title: "Bạn có chắc?",
                text: "Muốn thay đổi mật khẩu không.",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then((res) => {
                    if (res) {
                        changePassword()
                    } else {
                        props.close();
                    }
                });
    }
    const changePassword = async () => {
        const obj = { ...fields };
        await api.changePassword(obj).then(res => {
            if (res.data.code == 1) {
                toast.success("Thay đổi mật khẩu thành công.");
                swal({
                    title: "Bạn có muốn?",
                    text: "Đăng xuất để cập nhật thông tin không.",
                    icon: "warning",
                    buttons: ["Hủy bỏ", "Đồng ý"],
                })
                    .then((res) => {
                        if (res) {
                            return history.push('/logout');
                        } else {
                            props.close();
                        }
                    });
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Thay đổi mật khẩu thất bại.");
            console.log(error);
        });

    }
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-ms">
                    <ModalHeader toggle={() => props.close()}>Thay đổi mật khẩu</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={12}>
                                <FormGroup>
                                    <Label className="required" for="currentPassword">Mật khẩu cũ</Label>
                                    <Input onChange={(e) => handleChange(e, 'currentPassword')} type="password" name="currentPassword" id="currentPassword" placeholder="Mật khẩu cũ" invalid={!!errors.currentPassword} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.currentPassword}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label className="required" for="password">Mật khẩu mới</Label>
                                    <Input onChange={(e) => handleChange(e, 'password')} type="password" name="password" id="password" placeholder="Mật khẩu mới" invalid={!!errors.password} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.password}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label className="required" for="confirmPassword">Xác nhận mật khẩu mới</Label>
                                    <Input onChange={(e) => handleChange(e, 'confirmPassword')} type="password" name="confirmPassword" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" invalid={!!errors.confirmPassword} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.confirmPassword}</FormFeedback>
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
        </Card>
    );
}
export default CPWModal;
