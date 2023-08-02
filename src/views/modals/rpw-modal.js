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
const RPWModal = (props) => {

    const [password, setPassword] = useState('');
    const [messageErr, setMessageErr] = useState(MESSAGESERR.field_required);
    const [isSubmit, setIsSubmit] = useState(false);

    const save = async () => {
        setIsSubmit(true);
        if (!messageErr && password)
            swal({
                title: "Bạn có chắc?",
                text: "Muốn làm mới mật khẩu không.",
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then((res) => {
                    if (res) {
                        resetPassword()
                    } else {
                        props.close();
                    }
                });
    }
    const resetPassword = async () => {
        const obj = {
            password, id: props.idReset
        };
        await api.resetPassword(obj).then(res => {
            if (res.data.code == 1) {
                props.close();
                toast.success("Làm mới mật khẩu thành công.");
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Làm mới mật khẩu thất bại.");
            console.log(error);
        });

    }
    const handleChange = (password) => {
        // Minimum 6 characters, at least one lowercase letter, one uppercase , one number and one special character:
        const regux = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
        setMessageErr('');
        if (!password) {
            setMessageErr(MESSAGESERR.field_required);
        } else if (!regux.test(password)) {
            setMessageErr(MESSAGESERR.passW_required);
        }
        setPassword(password);
    }
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-ms">
                    <ModalHeader toggle={() => props.close()}>Làm mới mật khẩu</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="name">Mật khẩu mới</Label>
                                    <Input value={password} onChange={(e) => handleChange(e.target.value)} type="password" name="password" id="password" placeholder="Mật khẩu mới" invalid={!!messageErr && isSubmit} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{messageErr}</FormFeedback>
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
export default RPWModal;
