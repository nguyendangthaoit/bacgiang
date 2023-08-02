import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, Table, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qlth';
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import { QLTHEDITMUL, QLTHVALID } from '../../constants/field-modal/qlth';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
import model from '../../constants/table-model/qlth';
import cloneDeep from 'lodash.clonedeep';
import ToolTip from 'react-portal-tooltip';
const QLTHEDITMULModal = (props) => {

    // droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const rollbackDeviceStatuslst = useGetCategoriesByType(CATEGORIES.ROLLBACKDEVICESTATUS);
    const [agencyLevel1lst, setAgencyLevel1lst] = useState([]);
    const [agencyLevel2lst, setAgencyLevel2lst] = useState([]);
    const [agencyLevel3lst, setAgencyLevel3lst] = useState([]);
    const [agencyLevel4lst, setAgencyLevel4lst] = useState([]);

    const [fields, setFields] = useState(cloneDeep(QLTHEDITMUL));
    const [errors, setErrors] = useState({ ...QLTHVALID });
    const [rowData, setRowData] = useState([]);
    const [parentTooltip, setParentTooltip] = useState('');
    useEffect(() => {
        setRowData(props.dataSelect);
    }, [props.dataSelect]);

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, Object.keys({ ...QLTHVALID }));

        if (field === 'email' && fieldsT['email'].value) {
            const pattern = /[a-zA-Z0-9]+[/\.]?([a-zA-Z0-9]+)?[/\@][a-zA-Z0-9]+[.][a-z]{2,5}/g;
            const result = pattern.test(fieldsT['email'].value);
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
                if (fieldsT[item].isDelete &&
                    (!fieldsT[item].value || (Array.isArray(fieldsT[item].value) && !fieldsT[item].value[0])))
                    errorsT[item] = MESSAGESERR.field_required;
            }
        });
    }
    const handleChange = (e, field, isDelete = false, valueDelte = '') => {
        let fieldsT = { ...fields };
        if (isDelete) {
            fieldsT[field].isDelete = e.target.checked;
            fieldsT[field].value = valueDelte;
        } else {
            fieldsT[field].value = e.target.value;
        }
        handleValidation(field, fieldsT);
        setFields(fieldsT);
        setBindData(field, fieldsT);
    }
    const setBindData = (field, fieldsT) => {
        let rowDataT = [...rowData];
        rowDataT = rowDataT.map(x => {
            const value = fieldsT[field].value;
            x[field] = Array.isArray(value) ?
                (value[0] ? value[0].name || value[0] : '') :
                typeof value === 'string' ? value : formatDateDDMMYY(value);
            return x;
        });
        setRowData(rowDataT);
    }
    const save = async () => {
        if (handleValidation('', fields)) {

            let obj = { ...fields };
            const data = {};
            for (const [key, val] of Object.entries(obj)) {
                let { value } = val;
                if ('cvDvDateTime,cvCucCTSBMTTDateTime'.includes(key))
                    value = formatDateDDMMYY(value);
                if ('province'.includes(key))
                    value = value[0] ? value[0].name : '';
                if ('agencyLevel1,agencyLevel2,agencyLevel3,agencyLevel4'.includes(key))
                    value = value[0];
                if (val.isDelete)
                    value = 'Delete';
                if (!value)
                    value = null;
                data[key] = value;
            }

            const ids = props.dataSelect.map(x => x.id).join();
            await api.editMul(ids, data).then(res => {
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
                <Modal isOpen={true} toggle={() => props.close()} className="modal-xl">
                    <ModalHeader toggle={() => props.close()}>Cập nhật nhiều dữ liệu</ModalHeader>
                    <ModalBody>
                        <div>
                            <Table bordered hover className="tb_responsive_desk tb_responsive_mb table_edit_mul">
                                <thead>
                                    < tr >
                                        {
                                            model.map((e, i) =>
                                                !e.isHidden && <th key={i}>{e.text}</th>
                                            )
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.subscription.value || ''} onChange={(e) => handleChange(e, 'subscription')} type="text" name="subscription" id="subscription" disabled={fields.subscription.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'subscription', true)} id="subscriptionCK" onMouseEnter={() => setParentTooltip('subscriptionCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.subscription ? 'feedback_cs' : ''}>{errors.subscription}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.ctsNumber.value || ''} onChange={(e) => handleChange(e, 'ctsNumber')} type="text" name="ctsNumber" id="ctsNumber" disabled={fields.ctsNumber.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'ctsNumber', true)} id="ctsNumberCK" onMouseEnter={() => setParentTooltip('ctsNumberCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.ctsNumber ? 'feedback_cs' : ''}>{errors.ctsNumber}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.email.value || ''} onChange={(e) => handleChange(e, 'email')} type="text" name="email" id="email" disabled={fields.email.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'email', true)} id="emailCK" onMouseEnter={() => setParentTooltip('emailCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.email ? 'feedback_cs' : ''}>{errors.email}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="agencyLevel1"
                                                    selected={fields.agencyLevel1.value}
                                                    onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel1')}
                                                    options={agencyLevel1lst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        agencyLevelChange(value, 1);
                                                        handleChange({ target: { value: [value] } }, 'agencyLevel1')
                                                    }}
                                                    disabled={fields.agencyLevel1.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyLevel1', true, [])} id="agencyLevel1CK" onMouseEnter={() => setParentTooltip('agencyLevel1CK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyLevel1 ? 'feedback_cs' : ''}>{errors.agencyLevel1}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="agencyLevel2"
                                                    selected={fields.agencyLevel2.value}
                                                    onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel2')}
                                                    options={agencyLevel2lst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        agencyLevelChange(value, 2);
                                                        handleChange({ target: { value: [value] } }, 'agencyLevel2')
                                                    }}
                                                    disabled={fields.agencyLevel2.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyLevel2', true, [])} id="agencyLevel2CK" onMouseEnter={() => setParentTooltip('agencyLevel2CK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyLevel2 ? 'feedback_cs' : ''}>{errors.agencyLevel2}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="agencyLevel3"
                                                    selected={fields.agencyLevel3.value}
                                                    onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel3')}
                                                    options={agencyLevel3lst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        agencyLevelChange(value, 3);
                                                        handleChange({ target: { value: [value] } }, 'agencyLevel3')
                                                    }}
                                                    disabled={fields.agencyLevel3.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyLevel3', true, [])} id="agencyLevel3CK" onMouseEnter={() => setParentTooltip('agencyLevel3CK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyLevel3 ? 'feedback_cs' : ''}>{errors.agencyLevel3}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="agencyLevel4"
                                                    selected={fields.agencyLevel4.value}
                                                    onChange={value => value[0] && handleChange({ target: { value: [value[0].label || value[0]] } }, 'agencyLevel4')}
                                                    options={agencyLevel4lst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        agencyLevelChange(value, 4);
                                                        handleChange({ target: { value: [value] } }, 'agencyLevel4')
                                                    }}
                                                    disabled={fields.agencyLevel4.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyLevel4', true, [])} id="agencyLevel4CK" onMouseEnter={() => setParentTooltip('agencyLevel4CK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyLevel4 ? 'feedback_cs' : ''}>{errors.agencyLevel4}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="province"
                                                    labelKey="name"
                                                    selected={fields.province.value}
                                                    onChange={value => value[0] && handleChange({ target: { value } }, 'province')}
                                                    options={provincelst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        const val = value ? [{ id: '', name: value }] : [];
                                                        handleChange({ target: { value: val } }, 'province')
                                                    }}
                                                    disabled={fields.province.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'province', true, [])} id="provinceCK" onMouseEnter={() => setParentTooltip('provinceCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.province ? 'feedback_cs' : ''}>{errors.province}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.reason.value || ''} onChange={(e) => handleChange(e, 'reason')} type="text" name="reason" id="reason" disabled={fields.reason.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'reason', true,)} id="reasonCK" onMouseEnter={() => setParentTooltip('reasonCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.cvUnit.value || ''} onChange={(e) => handleChange(e, 'cvUnit')} type="text" name="cvUnit" id="cvUnit" disabled={fields.cvUnit.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvUnit', true,)} id="cvUnitCK" onMouseEnter={() => setParentTooltip('cvUnitCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.cvUnit ? 'feedback_cs' : ''}>{errors.cvUnit}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.cvDvDateTime.value} onChange={value => handleChange({ target: { value } }, 'cvDvDateTime')}
                                                    dateFormat="dd/MM/yyyy" disabled={fields.cvDvDateTime.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvDvDateTime', true,)} id="cvDvDateTimeCK" onMouseEnter={() => setParentTooltip('cvDvDateTimeCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.cvCucCTSBMTT.value || ''} onChange={(e) => handleChange(e, 'cvCucCTSBMTT')} type="text" name="cvCucCTSBMTT" id="cvCucCTSBMTT" disabled={fields.cvUnit.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvCucCTSBMTT', true,)} id="cvCucCTSBMTTCK" onMouseEnter={() => setParentTooltip('cvCucCTSBMTTCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.cvCucCTSBMTTDateTime.value} onChange={value => handleChange({ target: { value } }, 'cvCucCTSBMTTDateTime')}
                                                    dateFormat="dd/MM/yyyy" disabled={fields.cvCucCTSBMTTDateTime.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvCucCTSBMTTDateTime', true,)} id="cvCucCTSBMTTDateTimeCK" onMouseEnter={() => setParentTooltip('cvCucCTSBMTTDateTimeCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.rollbackDeviceStatus.value || ''} onChange={(e) => handleChange(e, 'rollbackDeviceStatus')} type="select" name="rollbackDeviceStatus" id="rollbackDeviceStatus" disabled={fields.rollbackDeviceStatus.isDelete}>
                                                    <option value="">Chọn trạng thái thu hồi thiết bị</option>
                                                    {
                                                        rollbackDeviceStatuslst.map(e =>
                                                            <option value={e.name} key={e.name}>{e.name}</option>
                                                        )
                                                    }
                                                </Input>
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'rollbackDeviceStatus', true,)} id="rollbackDeviceStatusCK" onMouseEnter={() => setParentTooltip('rollbackDeviceStatusCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.deviceNumber.value || ''} onChange={(e) => handleChange(e, 'deviceNumber')} type="text" name="deviceNumber" id="deviceNumber" disabled={fields.deviceNumber.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'deviceNumber', true,)} id="deviceNumberCK" onMouseEnter={() => setParentTooltip('deviceNumberCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input
                                                    value={fields.contact.value || ''} onChange={(e) => handleChange(e, 'contact')}
                                                    type="text"
                                                    name="contact"
                                                    id="contact"
                                                    placeholder="Đầu mối liên hệ"
                                                    disabled={fields.contact.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'contact', true,)} id="contactCK" onMouseEnter={() => setParentTooltip('contactCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.note.value || ''} onChange={(e) => handleChange(e, 'note')} type="text" name="note" id="note" disabled={fields.note.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'note', true,)} id="noteCK" onMouseEnter={() => setParentTooltip('noteCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        props.dataSelect.map((row, ri) =>
                                            <tr key={ri}>
                                                {model.map((cell, ci) =>
                                                    !cell.isHidden &&
                                                        ci === 0 ?
                                                        <td key={ci}>{ri + 1}</td> :
                                                        cell.field ? <td key={ci}>{row[cell.field]}</td> : null
                                                )}
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </Table >
                        </div>
                        {
                            parentTooltip &&
                            <ToolTip active={!!parentTooltip} parent={`#${parentTooltip}`} position="right" arrow="center">
                                xóa dữ liệu
                           </ToolTip>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={save}>Lưu lại</Button>
                        <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                    </ModalFooter>
                </Modal>
            </CardBody >
        </Card >
    );
}
export default QLTHEDITMULModal;
