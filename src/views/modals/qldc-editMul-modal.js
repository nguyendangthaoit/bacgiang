import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Table,
    Col, Input, CustomInput, Label, FormFeedback
} from 'reactstrap';
import * as api from '../../services/qldc';
import { formatDateDDMMYY, formatDateYYMMDD, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { QLDCEDITMUL, QLDCVALID } from '../../constants/field-modal/qldc';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
import model from '../../constants/table-model/qldc';
import cloneDeep from 'lodash.clonedeep';
import ToolTip from 'react-portal-tooltip';
const QLDCEDITMULModal = (props) => {

    // droplist
    let provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const requestTypelst = useGetCategoriesByType(CATEGORIES.REQUESTTYPE);
    const documentStatuslst = useGetCategoriesByType(CATEGORIES.DOCUMENTSTATUS);
    let agencyLevelMinistrylst = useGetCategoriesByType(CATEGORIES.AGENCYLEVELMINISTRY);
    const documentTypelst = useGetCategoriesByType(CATEGORIES.DOCUMENTTYPE);

    const [fields, setFields] = useState(cloneDeep(QLDCEDITMUL));
    const [errors, setErrors] = useState({ ...QLDCVALID });
    const [rowData, setRowData] = useState([]);
    const [parentTooltip, setParentTooltip] = useState('');
    useEffect(() => {
        setRowData(props.dataSelect);
    }, [props.dataSelect]);

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
        handleLogic(fieldsT);
        setFields(fieldsT);
        setBindData(field, fieldsT);
    }
    const handleLogic = (fieldsT) => {
        if (fieldsT['cvTakeDate'].value && fieldsT['cvDate'].value) {
            fieldsT.timeArriveDepartment.value = calculateDate(fieldsT['cvTakeDate'].value, fieldsT['cvDate'].value);
            setBindDataForNum('timeArriveDepartment', fieldsT);
        }
        if (fieldsT['transferProductDate'].value && fieldsT['cvTakeDate'].value) {
            fieldsT.timeDepartmentSxCts.value = calculateDate(fieldsT['transferProductDate'].value, fieldsT['cvTakeDate'].value);
            setBindDataForNum('timeDepartmentSxCts', fieldsT);
        }
        if (fieldsT['receiveProductDate'].value && fieldsT['transferProductDate'].value) {
            fieldsT.timeHandoverProduct.value = calculateDate(fieldsT['receiveProductDate'].value, fieldsT['transferProductDate'].value);
            setBindDataForNum('timeHandoverProduct', fieldsT);
        }
        fieldsT.totalTime.value = +fieldsT.timeArriveDepartment.value + +fieldsT.timeDepartmentSxCts.value + +fieldsT.timeHandoverProduct.value;
        setBindDataForNum('totalTime', fieldsT);
    }
    const calculateDate = (dateStr1, dateStr2) => {
        const date1 = (new Date(dateStr1)).getTime();
        const date2 = (new Date(dateStr2)).getTime();
        return (date1 - date2) / (1000 * 3600 * 24);
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
    const setBindDataForNum = (field, fieldsT) => {
        let rowDataT = [...rowData];
        rowDataT = rowDataT.map(x => {
            const value = fieldsT[field].value;
            x[field] = value
            return x;
        });
        setRowData(rowDataT);
    }
    const save = async () => {
        if (handleValidation('', fields)) {

            let obj = { ...fields };
            // const data = [];
            // for (const [key, val] of Object.entries(obj)) {
            //     let { value } = val;
            //     if (val.isDelete)
            //         value = 'Delete';
            //     if ('cvDate,cvTakeDate,transferProductDate,receiveProductDate'.includes(key))
            //         value = formatDateDDMMYY(value);
            //     if ('agencyLevelMinistry,province,requestType'.includes(key))
            //         value = value[0] ? value[0].name : '';
            //     if ('agencyLevel1,agencyLevel2,agencyLevel3,agencyLevel4'.includes(key))
            //         value = value[0];
            //     if (value)
            //         data.push({ field: key, value });
            // }

            const data = {};
            for (const [key, val] of Object.entries(obj)) {
                let { value } = val;
                if ('cvDate,cvTakeDate,transferProductDate,receiveProductDate'.includes(key))
                    value = formatDateDDMMYY(value);
                if ('agencyLevelMinistry,province,requestType'.includes(key))
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
                    toast.success("Cập nhật đợt cấp thành công.");
                } else
                    toast.warning(res.data.message);
            }).catch((error) => {
                toast.warning("Cập nhật đợt cấp thất bại.");
                console.log(error);
            });
        }
    }
    const keyPressPhone = (e) => {
        if (e.charCode < 48 || e.charCode > 57)
            e.preventDefault();
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
                                                <Input value={fields.agencyIssued.value || ''} onChange={(e) => handleChange(e, 'agencyIssued')} type="text" name="agencyIssued" id="agencyIssued" disabled={fields.agencyIssued.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyIssued', true)} id="agencyIssuedCK" onMouseEnter={() => setParentTooltip('agencyIssuedCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyIssued ? 'feedback_cs' : ''}>{errors.agencyIssued}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.cvNumber.value || ''} onChange={(e) => handleChange(e, 'cvNumber')} type="text" name="cvNumber" id="cvNumber" disabled={fields.cvNumber.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvNumber', true)} id="cvNumberCK" onMouseEnter={() => setParentTooltip('cvNumberCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.cvNumber ? 'feedback_cs' : ''}>{errors.cvNumber}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.cvDate.value} onChange={value => handleChange({ target: { value } }, 'cvDate')} dateFormat="dd/MM/yyyy" disabled={fields.cvDate.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvDate', true)} id="cvDateCK" onMouseEnter={() => setParentTooltip('cvDateCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.cvDate ? 'feedback_cs' : ''}>{errors.cvDate}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.requestNumber.value || ''} onChange={(e) => handleChange(e, 'requestNumber')} type="text" name="requestNumber" id="requestNumber" onKeyPress={keyPressPhone} disabled={fields.requestNumber.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'requestNumber', true)} id="requestNumberCK" onMouseEnter={() => setParentTooltip('requestNumberCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.requestNumber ? 'feedback_cs' : ''}>{errors.requestNumber}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.documentType.value || ''} onChange={(e) => handleChange(e, 'documentType')} type="select" name="select" id="documentType" disabled={fields.documentType.isDelete}>
                                                    <option value="">Chọn loại văn bản</option>
                                                    {
                                                        documentTypelst.map(e =>
                                                            <option value={e.name} key={e.name}>{e.name}</option>
                                                        )
                                                    }
                                                </Input>
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'documentType', true)} id="documentTypeCK" onMouseEnter={() => setParentTooltip('documentTypeCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.agencyOwner.value || ''} onChange={(e) => handleChange(e, 'agencyOwner')} type="text" name="agencyOwner" id="agencyOwner" disabled={fields.agencyOwner.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyOwner', true)} id="agencyOwnerCK" onMouseEnter={() => setParentTooltip('agencyOwnerCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.agencyOwner ? 'feedback_cs' : ''}>{errors.agencyOwner}</FormFeedback>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="agencyLevelMinistry"
                                                    labelKey="name"
                                                    selected={fields.agencyLevelMinistry.value}
                                                    onChange={value => value[0] && handleChange({ target: { value } }, 'agencyLevelMinistry')}
                                                    options={agencyLevelMinistrylst}
                                                    placeholder="Chọn cơ quan cấp Bộ/Tỉnh/Thành"
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        const val = value ? [{ id: '', name: value }] : [];
                                                        handleChange({ target: { value: val } }, 'agencyLevelMinistry')
                                                    }}
                                                    disabled={fields.agencyLevelMinistry.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'agencyLevelMinistry', true)} id="agencyLevelMinistryCK" onMouseEnter={() => setParentTooltip('agencyLevelMinistryCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="province"
                                                    labelKey="name"
                                                    selected={fields.province.value}
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
                                                    disabled={fields.province.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'province', true)} id="provinceCK" onMouseEnter={() => setParentTooltip('provinceCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>

                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Typeahead
                                                    id="requestType"
                                                    labelKey="name"
                                                    selected={fields.requestType.value}
                                                    onChange={value => value[0] && handleChange({ target: { value } }, 'requestType')}
                                                    options={requestTypelst}
                                                    emptyLabel={'Không có dữ liệu'}
                                                    className="cs_form-control"
                                                    allowNew
                                                    newSelectionPrefix=""
                                                    onInputChange={value => {
                                                        const val = value ? [{ id: '', name: value }] : [];
                                                        handleChange({ target: { value: val } }, 'requestType')
                                                    }}
                                                    disabled={fields.requestType.isDelete}
                                                />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'requestType', true)} id="requestTypeCK" onMouseEnter={() => setParentTooltip('requestTypeCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.requestType ? 'feedback_cs' : ''}>{errors.requestType}</FormFeedback>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input type="select" value={fields.documentStatus.value || ''} onChange={(e) => handleChange(e, 'documentStatus')} name="documentStatus" id="documentStatus" disabled={fields.documentStatus.isDelete}>
                                                    {
                                                        documentStatuslst.map(e =>
                                                            <option value={e.name} key={e.name}>{e.name}</option>
                                                        )
                                                    }
                                                </Input>
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'documentStatus', true)} id="documentStatusCK" onMouseEnter={() => setParentTooltip('documentStatusCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.numberAllocated.value || ''} onChange={(e) => handleChange(e, 'numberAllocated')} type="text" name="numberAllocated" id="numberAllocated" onKeyPress={keyPressPhone} disabled={fields.numberAllocated.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'numberAllocated', true)} id="numberAllocatedCK" onMouseEnter={() => setParentTooltip('numberAllocatedCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.cvTakeDate.value} onChange={value => handleChange({ target: { value } }, 'cvTakeDate')}
                                                    dateFormat="dd/MM/yyyy" disabled={fields.cvTakeDate.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'cvTakeDate', true)} id="cvTakeDateCK" onMouseEnter={() => setParentTooltip('cvTakeDateCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.transferProductDate.value} onChange={value => handleChange({ target: { value } }, 'transferProductDate')}
                                                    dateFormat="dd/MM/yyyy" disabled={fields.transferProductDate.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'transferProductDate', true)} id="transferProductDateCK" onMouseEnter={() => setParentTooltip('transferProductDateCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <DatePicker selected={fields.receiveProductDate.value} onChange={value => handleChange({ target: { value } }, 'receiveProductDate')}
                                                    dateFormat="dd/MM/yyyy" disabled={fields.receiveProductDate.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'receiveProductDate', true)} id="receiveProductDateCK" onMouseEnter={() => setParentTooltip('receiveProductDateCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input
                                                    value={fields.timeArriveDepartment.value || 0} onChange={(e) => handleChange(e, 'timeArriveDepartment')}
                                                    type="text"
                                                    name="timeArriveDepartment"
                                                    id="timeArriveDepartment"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input
                                                    value={fields.timeDepartmentSxCts.value || 0} onChange={(e) => handleChange(e, 'timeDepartmentSxCts')}
                                                    type="text"
                                                    name="timeDepartmentSxCts"
                                                    id="timeDepartmentSxCts"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input
                                                    value={fields.timeHandoverProduct.value || 0} onChange={(e) => handleChange(e, 'timeHandoverProduct')}
                                                    type="text"
                                                    name="timeHandoverProduct"
                                                    id="timeHandoverProduct"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.totalTime.value || 0} onChange={(e) => handleChange(e, 'totalTime')} type="text" name="totalTime" id="totalTime" disabled />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.note.value || ''} onChange={(e) => handleChange(e, 'note')} type="text" name="note" id="note" disabled={fields.note.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'note', true)} id="noteCK" onMouseEnter={() => setParentTooltip('noteCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td_div">
                                                <Input value={fields.userReceived.value || ''} onChange={(e) => handleChange(e, 'userReceived')} type="text" name="userReceived" id="userReceived" disabled={fields.userReceived.isDelete} />
                                                <Input type="checkbox" onChange={(e) => handleChange(e, 'userReceived', true)} id="userReceivedCK" onMouseEnter={() => setParentTooltip('userReceivedCK')} onMouseLeave={() => setParentTooltip('')} />
                                            </div>
                                            <FormFeedback className={!!errors.userReceived ? 'feedback_cs' : ''}>{errors.userReceived}</FormFeedback>
                                        </td>
                                    </tr>
                                    {
                                        rowData.map((row, ri) =>
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
export default QLDCEDITMULModal;
