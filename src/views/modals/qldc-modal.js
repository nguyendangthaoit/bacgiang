import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qldc';
import { formatDateDDMMYY, formatDateYYMMDD, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { QLDC, QLDCVALID } from '../../constants/field-modal/qldc';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";

const QLDCModal = (props) => {

    // droplist
    let provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const requestTypelst = useGetCategoriesByType(CATEGORIES.REQUESTTYPE);
    const documentStatuslst = useGetCategoriesByType(CATEGORIES.DOCUMENTSTATUS);
    let agencyLevelMinistrylst = useGetCategoriesByType(CATEGORIES.AGENCYLEVELMINISTRY);
    const documentTypelst = useGetCategoriesByType(CATEGORIES.DOCUMENTTYPE);
    useEffect(() => {
        // if (props.item && provincelst.length > 0 && agencyLevelMinistrylst.length > 0) {
        if (props.item) {
            const existPro = provincelst.some(x => x.name === props.item.province);
            if (!existPro)
                provincelst.push({ id: '', name: props.item.province });
            const axistAgency = agencyLevelMinistrylst.some(x => x.name === props.item.agencyLevelMinistry);
            if (!axistAgency)
                agencyLevelMinistrylst.push({ id: '', name: props.item.agencyLevelMinistry || '' });
            const axistRequestType = requestTypelst.some(x => x.name === props.item.requestType);
            if (!axistRequestType)
                requestTypelst.push({ id: '', name: props.item.requestType || '' });

            let obj = { ...props.item };
            obj.cvDate = formatStrToDate(obj.cvDate);
            obj.cvTakeDate = formatStrToDate(obj.cvTakeDate);
            obj.transferProductDate = formatStrToDate(obj.transferProductDate);
            obj.receiveProductDate = formatStrToDate(obj.receiveProductDate);
            obj.province = provincelst.filter(x => x.name === props.item.province);
            obj.agencyLevelMinistry = agencyLevelMinistrylst.filter(x => x.name === props.item.agencyLevelMinistry);
            obj.requestType = requestTypelst.filter(x => x.name === props.item.requestType);
            setFields(obj);
        }
    }, [props.item])
    // }, [props.item, provincelst, agencyLevelMinistrylst])


    useEffect(() => {
        if (documentStatuslst.length > 0) {
            let obj = { ...fields };
            obj.documentStatus = documentStatuslst[0].name;
            setFields(obj);
        }
    }, [documentStatuslst])


    const [fields, setFields] = useState({ ...QLDC });
    const [errors, setErrors] = useState({ ...QLDCVALID });

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, Object.keys({ ...QLDCVALID }));
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
        handleLogic(fieldsT);
        setFields(fieldsT);
    }
    const handleLogic = (fieldsT) => {
        if (fieldsT['cvTakeDate'] && fieldsT['cvDate']) {
            fieldsT.timeArriveDepartment = calculateDate(fieldsT['cvTakeDate'], fieldsT['cvDate']);
        }
        if (fieldsT['transferProductDate'] && fieldsT['cvTakeDate']) {
            fieldsT.timeDepartmentSxCts = calculateDate(fieldsT['transferProductDate'], fieldsT['cvTakeDate']);
        }
        if (fieldsT['receiveProductDate'] && fieldsT['transferProductDate']) {
            fieldsT.timeHandoverProduct = calculateDate(fieldsT['receiveProductDate'], fieldsT['transferProductDate']);
        }
        fieldsT.totalTime = +fieldsT.timeArriveDepartment + +fieldsT.timeDepartmentSxCts + +fieldsT.timeHandoverProduct;
    }
    const calculateDate = (dateStr1, dateStr2) => {
        const date1 = (new Date(dateStr1)).getTime();
        const date2 = (new Date(dateStr2)).getTime();
        return (date1 - date2) / (1000 * 3600 * 24);
    }
    const save = async () => {
        if (handleValidation('', fields)) {

            let obj = { ...fields };
            obj.cvDate = formatDateDDMMYY(obj.cvDate);
            obj.cvTakeDate = formatDateDDMMYY(obj.cvTakeDate);
            obj.transferProductDate = formatDateDDMMYY(obj.transferProductDate);
            obj.receiveProductDate = formatDateDDMMYY(obj.receiveProductDate);
            obj.agencyLevelMinistry = obj.agencyLevelMinistry[0] ? obj.agencyLevelMinistry[0].name : '';
            obj.province = obj.province[0] ? obj.province[0].name : '';
            obj.requestType = obj.requestType[0] ? obj.requestType[0].name : '';
            if (!props.item)
                await api.save(obj).then(res => {
                    if (res.data.code == 1) {
                        props.close();
                        toast.success("Thêm mới đợt cấp thành công.");
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
                                    <Label className="required" for="agencyIssued">Cơ quan ban ngành</Label>
                                    <Input value={fields.agencyIssued || ''} onChange={(e) => handleChange(e, 'agencyIssued')} type="text" name="agencyIssued" id="agencyIssued" placeholder="Cơ quan ban ngành" invalid={!!errors.agencyIssued} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.agencyIssued}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="cvNumber">Số CV</Label>
                                    <Input value={fields.cvNumber || ''} onChange={(e) => handleChange(e, 'cvNumber')} type="text" name="cvNumber" id="cvNumber" placeholder="Số CV" invalid={!!errors.cvNumber} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.cvNumber}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="cvDate">Ngày CV đơn vị</Label>
                                    {/* <Input
                                        value={fields.cvDate || ''} onChange={(e) => handleChange(e, 'cvDate')}
                                        type="date"
                                        name="cvDate"
                                        id="cvDate"
                                        invalid={!!errors.cvDate}
                                    /> */}
                                    <DatePicker selected={fields.cvDate} onChange={value => handleChange({ target: { value } }, 'cvDate')} dateFormat="dd/MM/yyyy" placeholderText="Ngày CV đơn vị" />
                                    <Input hidden invalid={!!errors.cvDate} />
                                    <FormFeedback style={{ marginTop: '0px' }} >{errors.cvDate}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="requestNumber">Số lượng đề nghị</Label>
                                    <Input value={fields.requestNumber || ''} onChange={(e) => handleChange(e, 'requestNumber')} type="text" name="requestNumber" id="requestNumber" placeholder="Số lượng đề nghị" invalid={!!errors.requestNumber} onKeyPress={keyPressPhone} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.requestNumber}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="documentType">Loại văn bản</Label>
                                    <Input value={fields.documentType || ''} onChange={(e) => handleChange(e, 'documentType')} type="select" name="select" id="documentType">
                                        <option value="">Chọn loại văn bản</option>
                                        {
                                            documentTypelst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>

                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="agencyOwner">Cơ quan chủ quản</Label>
                                    <Input value={fields.agencyOwner || ''} onChange={(e) => handleChange(e, 'agencyOwner')} type="text" name="agencyOwner" id="agencyOwner" placeholder="Cơ quan chủ quản" invalid={!!errors.agencyOwner} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.agencyOwner}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="agencyLevelMinistry">Cơ quan cấp Bộ/Tỉnh/Thành</Label>
                                    {/* <Input value={fields.agencyLevelMinistry || ''} onChange={(e) => handleChange(e, 'agencyLevelMinistry')} type="select" name="select" id="agencyLevelMinistry">
                                        <option value="">Chọn cơ quan cấp Bộ/Tỉnh/Thành</option>
                                        {
                                            agencyLevelMinistrylst.map(e =>
                                                <option value={e.id} key={e.id}>{e.name}</option>
                                            )
                                        }
                                    </Input> */}
                                    <Typeahead
                                        id="agencyLevelMinistry"
                                        labelKey="name"
                                        selected={fields.agencyLevelMinistry}
                                        onChange={value => {
                                            if (!value[0]) return;
                                            const fieldsT = { ...fields };
                                            fieldsT.agencyLevelMinistry = value;
                                            setFields(fieldsT)
                                        }}
                                        options={agencyLevelMinistrylst}
                                        placeholder="Chọn cơ quan cấp Bộ/Tỉnh/Thành"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            const fieldsT = { ...fields };
                                            fieldsT.agencyLevelMinistry = [{ id: '', name: value }];
                                            setFields(fieldsT)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="province">Tỉnh thành</Label>
                                    {/* <Input type="select" name="province" id="province" value={fields.province || ''} onChange={(e) => handleChange(e, 'province')} invalid={!!errors.province}>
                                        <option value="">Chọn Tỉnh/Thành</option>
                                        {
                                            provincelst.map(e =>
                                                <option value={e.id} key={e.id}>{e.name}</option>
                                            )
                                        }
                                    </Input> */}
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
                                            const fieldsT = { ...fields };
                                            fieldsT.province = [{ id: '', name: value }];
                                            setFields(fieldsT)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="requestType">Loại yêu cầu</Label>
                                    <Typeahead
                                        id="requestType"
                                        labelKey="name"
                                        selected={fields.requestType}
                                        onChange={value => value[0] && handleChange({ target: { value } }, 'requestType')}
                                        options={requestTypelst}
                                        placeholder="Chọn loại yêu cầu"
                                        emptyLabel={'Không có dữ liệu'}
                                        className="cs_form-control"
                                        allowNew
                                        newSelectionPrefix=""
                                        onInputChange={value => {
                                            const val = value ? [{ id: '', name: value }] : [];
                                            handleChange({ target: { value: val } }, 'requestType')
                                        }}
                                    />
                                    <Input hidden invalid={!!errors.requestType}></Input>
                                    <FormFeedback style={{ marginTop: '0px' }}  >{errors.requestType}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="userReceived">Người tiếp nhận</Label>
                                    <Input value={fields.userReceived || ''} onChange={(e) => handleChange(e, 'userReceived')} type="text" name="userReceived" id="userReceived" placeholder="Người tiếp nhận" invalid={!!errors.userReceived} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.userReceived}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="documentStatus">Trạng thái hồ sơ</Label>
                                    <Input type="select" value={fields.documentStatus || ''} onChange={(e) => handleChange(e, 'documentStatus')} name="documentStatus" id="documentStatus">
                                        {
                                            documentStatuslst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="numberAllocated">Số lượng thực cấp</Label>
                                    <Input value={fields.numberAllocated || ''} onChange={(e) => handleChange(e, 'numberAllocated')} type="text" name="numberAllocated" id="numberAllocated" placeholder="Số lượng thực cấp" onKeyPress={keyPressPhone} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="cvTakeDate">Ngày cục nhận CV</Label>
                                    {/* <Input
                                        value={fields.cvTakeDate || ''} onChange={(e) => handleChange(e, 'cvTakeDate')}
                                        type="date"
                                        name="cvTakeDate"
                                        id="cvTakeDate"
                                    /> */}
                                    <DatePicker selected={fields.cvTakeDate} onChange={value => handleChange({ target: { value } }, 'cvTakeDate')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày cục nhận CV" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="transferProductDate">Ngày cục bàn giao SP</Label>
                                    {/* <Input
                                        value={fields.transferProductDate || ''} onChange={(e) => handleChange(e, 'transferProductDate')}
                                        type="date"
                                        name="transferProductDate"
                                        id="transferProductDate"
                                    /> */}
                                    <DatePicker selected={fields.transferProductDate} onChange={value => handleChange({ target: { value } }, 'transferProductDate')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày cục bàn giao SP" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="receiveProductDate">Ngày đơn vị nhận SP</Label>
                                    {/* <Input
                                        value={fields.receiveProductDate || ''} onChange={(e) => handleChange(e, 'receiveProductDate')}
                                        type="date"
                                        name="receiveProductDate"
                                        id="receiveProductDate"
                                    /> */}
                                    <DatePicker selected={fields.receiveProductDate} onChange={value => handleChange({ target: { value } }, 'receiveProductDate')}
                                        dateFormat="dd/MM/yyyy" placeholderText="Ngày đơn vị nhận SP" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="timeArriveDepartment">Thời gian văn bản đến cục</Label>
                                    <Input
                                        value={fields.timeArriveDepartment || 0} onChange={(e) => handleChange(e, 'timeArriveDepartment')}
                                        type="text"
                                        name="timeArriveDepartment"
                                        id="timeArriveDepartment"
                                        placeholder="Thời gian văn bản đến cục" disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="timeDepartmentSxCts">Thời gian cục SX CTS</Label>
                                    <Input
                                        value={fields.timeDepartmentSxCts || 0} onChange={(e) => handleChange(e, 'timeDepartmentSxCts')}
                                        type="text"
                                        name="timeDepartmentSxCts"
                                        id="timeDepartmentSxCts"
                                        placeholder="Thời gian cục SX CTS" disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="timeHandoverProduct">Thời gian bàn giao SP</Label>
                                    <Input
                                        value={fields.timeHandoverProduct || 0} onChange={(e) => handleChange(e, 'timeHandoverProduct')}
                                        type="text"
                                        name="timeHandoverProduct"
                                        id="timeHandoverProduct"
                                        placeholder="Thời gian bàn giao SP" disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="totalTime">Tổng thời gian</Label>
                                    <Input value={fields.totalTime || 0} onChange={(e) => handleChange(e, 'totalTime')} type="text" name="totalTime" id="totalTime" placeholder="Tổng thời gian" disabled />
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
export default QLDCModal;
