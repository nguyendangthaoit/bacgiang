import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qlgh-tdtt';
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { QLGHTDTT, QLGHTDTTVALID } from '../../constants/field-modal/qlgh-tdtt';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
const QLGHTDTTModal = (props) => {

    // droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const requestTypelst = useGetCategoriesByType(CATEGORIES.REQUESTTYPE);
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
            obj.cvDateTime = formatStrToDate(obj.cvDateTime || '');
            obj.province = provincelst.filter(x => x.name === props.item.province);
            obj.agencyLevel1 = [obj.agencyLevel1 || ''];
            obj.agencyLevel2 = [obj.agencyLevel2 || ''];
            obj.agencyLevel3 = [obj.agencyLevel3 || ''];
            obj.agencyLevel4 = [obj.agencyLevel4 || ''];
            setFields(obj);
        }
    }, [props.item, provincelst])

    const [fields, setFields] = useState({ ...QLGHTDTT });
    const [errors, setErrors] = useState({ ...QLGHTDTTVALID });

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, Object.keys({ ...QLGHTDTTVALID }));

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
            obj.cvDateTime = formatDateDDMMYY(obj.cvDateTime);
            obj.province = obj.province[0] ? obj.province[0].name : '';
            obj.agencyLevel1 = obj.agencyLevel1[0];
            obj.agencyLevel2 = obj.agencyLevel2[0];
            obj.agencyLevel3 = obj.agencyLevel3[0];
            obj.agencyLevel4 = obj.agencyLevel4[0];
            if (!props.item)
                await api.save(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Thêm mới gia hạn thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Thêm mới gia hạn thất bại.");
                    console.log(error);
                });
            else {
                obj['id'] = props.item.id;
                await api.edit(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Cập nhật gia hạn thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Cập nhật gia hạn thất bại.");
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
                                    <Label className="required" for="ctsCode">Số hiệu CTS</Label>
                                    <Input value={fields.ctsCode || ''} onChange={(e) => handleChange(e, 'ctsCode')} type="text" name="ctsCode" id="ctsCode" placeholder="Số hiệu CTS" invalid={!!errors.ctsCode} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.ctsCode}</FormFeedback>
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
                                    <Label className="required" for="agencyLevel2">Tên cơ quan cấp 2</Label>
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
                                    <Label className="required" for="agencyLevel3">Tên cơ quan cấp 3</Label>
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
                                    <Label className="required" for="agencyLevel4">Tên cơ quan cấp 4</Label>
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
                                    <Label for="fileNameInfoChange">Trường thông tin thay đổi</Label>
                                    <Input value={fields.fileNameInfoChange || ''} onChange={(e) => handleChange(e, 'fileNameInfoChange')} type="text" name="fileNameInfoChange" id="fileNameInfoChange" placeholder="Trường thông tin thay đổi" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="requestType">Loại yêu cầu</Label>
                                    <Input type="select" name="requestType" id="requestType" value={fields.requestType || ''} onChange={(e) => handleChange(e, 'requestType')}>
                                        <option value="">Chọn loại yêu cầu</option>
                                        {
                                            requestTypelst.map(e =>
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
                                    <Label for="cvRequestCode">Công CV đề nghị</Label>
                                    <Input value={fields.cvRequestCode || ''} onChange={(e) => handleChange(e, 'cvRequestCode')} type="text" name="cvRequestCode" id="cvRequestCode" placeholder="Công CV đề nghị" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="cvDateTime">Ngày CV</Label>
                                    <DatePicker selected={fields.cvDateTime} onChange={value => handleChange({ target: { value } }, 'cvDateTime')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày CV" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="contact">Đầu mối liên hệ</Label>
                                    <Input value={fields.contact || ''} onChange={(e) => handleChange(e, 'contact')} type="text" name="contact" id="contact" placeholder="Đầu mối liên hệ" />
                                </FormGroup>
                            </Col>
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
export default QLGHTDTTModal;
