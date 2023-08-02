import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback, DropdownToggle
} from 'reactstrap';
import * as api from '../../services/qlnd';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { MESSAGESERR } from '../../constants/common';
import CPW from '../../constants/field-modal/cpw';
import { Avatar } from '../../bg';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const InforModal = (props) => {

    const userInfo = cookies.get("userInfo");
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-ms">
                    <ModalHeader toggle={() => props.close()}>Thông tin cá nhân</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={12} style={{ textAlign: 'center' }}>
                                <Avatar size="small" color="white" className="image-infor" initials="JS" image={userInfo.avatar} />
                            </Col>

                            <Col md={12}>
                                <FormGroup className="row formGroup_custom">
                                    <Label md={4} className="lable-custom" for="currentPassword">Tên tài khoản:</Label>
                                    <Label md={8} for="currentPassword">{userInfo.userName}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup className="row formGroup_custom">
                                    <Label md={4} className="lable-custom" for="currentPassword">Tên đầy đủ:</Label>
                                    <Label md={8} for="currentPassword">{userInfo.fullName}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup className="row formGroup_custom">
                                    <Label md={4} className="lable-custom" for="currentPassword">Số điện thoại:</Label>
                                    <Label md={8} for="currentPassword">{userInfo.phoneNumber}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup className="row formGroup_custom">
                                    <Label md={4} className="lable-custom" for="currentPassword">Vai trò:</Label>
                                    <Label md={8} for="currentPassword">{userInfo.role}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => props.editInfor()}>Chỉnh sửa</Button>
                        <Button color="secondary" onClick={() => props.close()}>Đóng</Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    );
}
export default InforModal;
