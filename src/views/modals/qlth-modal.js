import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qlth';
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import { QLTH, QLTHVALID } from '../../constants/field-modal/qlth';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
const QLTHModal = (props) => {

    // droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const rollbackDeviceStatuslst = useGetCategoriesByType(CATEGORIES.ROLLBACKDEVICESTATUS);
    const [agencyLevel1lst, setAgencyLevel1lst] = useState([]);
    const [agencyLevel2lst, setAgencyLevel2lst] = useState([]);
    const [agencyLevel3lst, setAgencyLevel3lst] = useState([]);
    const [agencyLevel4lst, setAgencyLevel4lst] = useState([]);

    useEffect(() => {
        if (props.item && provincelst.length > 0) {
            const existPro = provincelst.some(x => x.name === props.item.province);
            if (!existPro)
                provincelst.push({ id: '', name: props.item.province || '' });
            let obj = { ...props.item };
            obj.cvDvDateTime = formatStrToDate(obj.cvDvDateTime || '');
            obj.cvCucCTSBMTTDateTime = formatStrToDate(obj.cvCucCTSBMTTDateTime || '');
            obj.province = provincelst.filter(x => x.name === props.item.province);
            obj.agencyLevel1 = [obj.agencyLevel1 || ''];
            obj.agencyLevel2 = [obj.agencyLevel2 || ''];
            obj.agencyLevel3 = [obj.agencyLevel3 || ''];
            obj.agencyLevel4 = [obj.agencyLevel4 || ''];
            setFields(obj);
        }
    }, [props.item, provincelst])

    const [fields, setFields] = useState({ ...QLTH });
    const [errors, setErrors] = useState({ ...QLTHVALID });

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, Object.keys({ ...QLTHVALID }));

        if (field === 'email' && fieldsT['email']) {
            const pattern = /[a-zA-Z0-9]+[/\.]?([a-zA-Z0-9]+)?[/\@][a-zA-Z0-9]+[.][a-z]{2,5}/g;
            const result = pattern.test(fieldsT['email']);
            if (!result) {
                errorsT['email'] = MESSAGESERR.email_required;
            }
        }
        setErrors(errorsT);
        return Object.values(errorsT).every(x => !x);
    }
    const validateReqire = (field, fieldsT, errorsT, fiels = []) => {
        fiels.forEach(item => {
            if (field === item || !field) {
                if (!fieldsT[item] || (Array.isArray(fieldsT[item]) && !fieldsT[item][0]))
                    errorsT[item] = MESSAGESERR.field_required;
            }
        });
    }
    const handleChange = (e, field) => {
        let fieldsT = { ...fields };
        fieldsT[field] = e.target.value;
        handleValidation(field, fieldsT);
        setFields(fieldsT);
    }
    const save = async () => {
        if (handleValidation('', fields)) {

            let obj = { ...fields };
            obj.cvDvDateTime = formatDateDDMMYY(obj.cvDvDateTime);
            obj.cvCucCTSBMTTDateTime = formatDateDDMMYY(obj.cvCucCTSBMTTDateTime);
            obj.province = obj.province[0] ? obj.province[0].name : '';
            obj.agencyLevel1 = obj.agencyLevel1[0];
            obj.agencyLevel2 = obj.agencyLevel2[0];
            obj.agencyLevel3 = obj.agencyLevel3[0];
            obj.agencyLevel4 = obj.agencyLevel4[0];
            if (!props.item)
                await api.save(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Thêm mới thu hồi thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Thêm mới thu hồi thất bại.");
                    console.log(error);
                });
            else {
                obj['id'] = props.item.id;
                await api.edit(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Cập nhật thu hồi thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Cập nhật thu hồi thất bại.");
                    console.log(error);
                });
            }
        }
    }
    const agencyLevelChange = (keyword, type) => {
        const obj = {
            keyword, type
        }
        api.agencyLevel(obj).then(res => {
            if (res.data.code == 1) {
                if (type === 1)
                    setAgencyLevel1lst(res.data.data);
                if (type === 2)
                    setAgencyLevel2lst(res.data.data);
                if (type === 3)
                    setAgencyLevel3lst(res.data.data);
                if (type === 4)
                    setAgencyLevel4lst(res.data.data);
            }
        }).catch((error) => {
            console.log(error);
        });
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
                                    <Label className="required" for="subscription">Thuê bao</Label>
                                    <Input value={fields.subscription || ''} onChange={(e) => handleChange(e, 'subscription')} type="text" name="subscription" id="subscription" placeholder="Thuê bao" invalid={!!errors.subscription} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.subscription}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="ctsNumber">Số hiệu CTS</Label>
                                    <Input value={fields.ctsNumber || ''} onChange={(e) => handleChange(e, 'ctsNumber')} type="text" name="ctsNumber" id="ctsNumber" placeholder="Số hiệu CTS" invalid={!!errors.ctsNumber} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.ctsNumber}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="email">Email</Label>
                                    <Input value={fields.email || ''} onChange={(e) => handleChange(e, 'email')} type="text" name="email" id="email" placeholder="Email" invalid={!!errors.email} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.email}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="agencyLevel1">Tên cơ quan cấp 1</Label>
                                    <Typeahead
                                        id="agencyLevel1"
                                        selected={fields.agencyLevel1}
                                        onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel1')}
                                        options={agencyLevel1lst}
                                        placeholder="Chọn cơ quan cấp 1"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            agencyLevelChange(value, 1);
                                            handleChange({ target: { value: [value] } }, 'agencyLevel1')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.agencyLevel1}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.agencyLevel1}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="agencyLevel2">Tên cơ quan cấp 2</Label>
                                    <Typeahead
                                        id="agencyLevel2"
                                        selected={fields.agencyLevel2}
                                        onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel2')}
                                        options={agencyLevel2lst}
                                        placeholder="Chọn cơ quan cấp 2"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            agencyLevelChange(value, 2);
                                            handleChange({ target: { value: [value] } }, 'agencyLevel2')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.agencyLevel2}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.agencyLevel2}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="agencyLevel3">Tên cơ quan cấp 3</Label>
                                    <Typeahead
                                        id="agencyLevel3"
                                        selected={fields.agencyLevel3}
                                        onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel3')}
                                        options={agencyLevel3lst}
                                        placeholder="Chọn cơ quan cấp 3"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            agencyLevelChange(value, 3);
                                            handleChange({ target: { value: [value] } }, 'agencyLevel3')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.agencyLevel3}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.agencyLevel3}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="agencyLevel4">Tên cơ quan cấp 4</Label>
                                    <Typeahead
                                        id="agencyLevel4"
                                        selected={fields.agencyLevel4}
                                        onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel4')}
                                        options={agencyLevel4lst}
                                        placeholder="Chọn cơ quan cấp 4"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            agencyLevelChange(value, 4);
                                            handleChange({ target: { value: [value] } }, 'agencyLevel4')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.agencyLevel4}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.agencyLevel4}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="province">Tỉnh thành</Label>
                                    <Typeahead
                                        id="province"
                                        labelKey="name"
                                        selected={fields.province}
                                        onChange={value => value[0] && handleChange({ target: { value } }, 'province')}
                                        options={provincelst}
                                        placeholder="Chọn Tỉnh/Thành"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            const val = value ? [{ id: '', name: value }] : [];
                                            handleChange({ target: { value: val } }, 'province')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.province}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.province}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="reason">Lý do</Label>
                                    <Input value={fields.reason || ''} onChange={(e) => handleChange(e, 'reason')} type="text" name="reason" id="reason" placeholder="Lý do" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="cvUnit">CV đơn vị</Label>
                                    <Input value={fields.cvUnit || ''} onChange={(e) => handleChange(e, 'cvUnit')} type="text" name="cvUnit" id="cvUnit" placeholder="CV đơn vị" invalid={!!errors.cvUnit} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.cvUnit}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="cvDvDateTime">Ngày CV ĐV</Label>
                                    <DatePicker selected={fields.cvDvDateTime} onChange={value => handleChange({ target: { value } }, 'cvDvDateTime')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày CV ĐV" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="cvCucCTSBMTT">CV cục CTSBMTT</Label>
                                    <Input value={fields.cvCucCTSBMTT || ''} onChange={(e) => handleChange(e, 'cvCucCTSBMTT')} type="text" name="cvCucCTSBMTT" id="cvCucCTSBMTT" placeholder="CV cục CTSBMTT" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="cvCucCTSBMTTDateTime">Ngày CV cục CTSBMTT</Label>
                                    <DatePicker selected={fields.cvCucCTSBMTTDateTime} onChange={value => handleChange({ target: { value } }, 'cvCucCTSBMTTDateTime')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày CV cục CTSBMTT" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="rollbackDeviceStatus">Trạng thái thu hồi thiết bị</Label>
                                    <Input value={fields.rollbackDeviceStatus || ''} onChange={(e) => handleChange(e, 'rollbackDeviceStatus')} type="select" name="rollbackDeviceStatus" id="rollbackDeviceStatus">
                                        <option value="">Chọn trạng thái thu hồi thiết bị</option>
                                        {
                                            rollbackDeviceStatuslst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="deviceNumber">Số hiệu thiết bị</Label>
                                    <Input value={fields.deviceNumber || ''} onChange={(e) => handleChange(e, 'deviceNumber')} type="text" name="deviceNumber" id="deviceNumber" placeholder="Số hiệu thiết bị" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="contact">Đầu mối liên hệ</Label>
                                    <Input
                                        value={fields.contact || ''} onChange={(e) => handleChange(e, 'contact')}
                                        type="text"
                                        name="contact"
                                        id="contact"
                                        placeholder="Đầu mối liên hệ"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="note">Ghi chú</Label>
                                    <Input value={fields.note || ''} onChange={(e) => handleChange(e, 'note')} type="textarea" name="note" id="note" placeholder="Ghi chú" />
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
export default QLTHModal;
