import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, CustomInput, FormFeedback
} from 'reactstrap';
import * as api from '../../services/dm';
import * as apiLDM from '../../services/ldm';
import { toast } from 'react-toastify';
import QLDM from '../../constants/field-modal/qldm';
import { MESSAGESERR } from '../../constants/common';
const DMModal = (props) => {

    const [defaults, setDefault] = useState(true);
    const [types, setTypes] = useState([]);
    const [fields, setFields] = useState({ ...QLDM });
    const [errors, setErrors] = useState({ ...QLDM });

    useEffect(() => {
        if (props.item) {
            props.item['type'] = props.item.categoryTypeCode;
            setFields(props.item);
            setDefault(props.item.default);
        }
    }, [props.item])

    useEffect(() => { getAllTypes() }, []);

    async function getAllTypes() {
        await apiLDM.getAll().then(res => {
            if (res.data.code == 1) {
                setTypes(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lấy loại danh mục thất bại.");
        });
    }

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        if (field === 'name' || !field) {
            if (!fieldsT.name)
                errorsT.name = MESSAGESERR.field_required;
        }
        if (field === 'type' || !field) {
            if (!fieldsT.type)
                errorsT.type = MESSAGESERR.field_required;
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
            const obj = { ...fields, default: defaults };
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
    return (
        <Card>
            <CardBody>
                <Modal isOpen={true} toggle={() => props.close()} className="modal-lg">
                    <ModalHeader toggle={() => props.close()}>{props.item ? 'Cập nhật' : 'Thêm mới'}</ModalHeader>
                    <ModalBody>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="name">Tên danh mục</Label>
                                    <Input value={fields.name} onChange={(e) => handleChange(e, 'name')} type="text" name="name" id="name" placeholder="Tên danh mục" invalid={!!errors.name} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.name}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="type">Loại danh mục</Label>
                                    <Input value={fields.type} onChange={(e) => handleChange(e, 'type')} type="select" name="type" id="type" disabled={props.item} invalid={!!errors.type}>
                                        <option value="">Chọn loại danh mục</option>
                                        {
                                            types.map(e =>
                                                <option value={e.code} key={e.code}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.type}</FormFeedback>
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
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="defaults">Mặc định</Label>
                                    <Row style={{ marginLeft: '0rem' }}>
                                        <CustomInput type="radio" id="exampleCustomRadio" name="customRadio" checked={defaults} label="Có" onChange={(e) => setDefault(true)} />
                                        <CustomInput type="radio" id="exampleCustomRadio2" name="customRadio" checked={!defaults} label="Không" onChange={(e) => setDefault(false)} />
                                    </Row>
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
export default DMModal;
