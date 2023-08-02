import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/ldm';
import { toast } from 'react-toastify';
import QLLDM from '../../constants/field-modal/qlldm';
import { MESSAGESERR } from '../../constants/common';

const LDMModal = (props) => {

    const [fields, setFields] = useState({ ...QLLDM });
    const [errors, setErrors] = useState({ ...QLLDM });

    useEffect(() => {
        if (props.item) {
            setFields(props.item);
        }
    }, [props.item])

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        if (field === 'code' || !field) {
            if (!fieldsT.code)
                errorsT.code = MESSAGESERR.field_required;
        }
        if (field === 'name' || !field) {
            if (!fieldsT.name)
                errorsT.name = MESSAGESERR.field_required;
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
            const obj = { ...fields };
            if (!props.item)
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
            else {
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

    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-lg">
                    <ModalHeader toggle={() => props.close()}>{props.item ? 'Cập nhật' : 'Thêm mới'}</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="code">Mã loại danh mục</Label>
                                    <Input value={fields.code} onChange={(e) => handleChange(e, 'code')} type="text" name="code" id="code" placeholder="Mã loại danh mục" disabled={props.item} invalid={!!errors.code} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.code}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="name">Tên loại danh mục</Label>
                                    <Input value={fields.name} onChange={(e) => handleChange(e, 'name')} type="text" name="name" id="name" placeholder="Tên loại danh mục" invalid={!!errors.name} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.name}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="description">Miêu tả</Label>
                                    <Input value={fields.description} onChange={(e) => handleChange(e, 'description')} type="text" name="description" id="description" placeholder="Miêu tả" />
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
export default LDMModal;
