import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
    Button, Row, Col, Input, FormGroup, Label, FormFeedback,
} from 'reactstrap';
import * as api from '../../services/qlvdcts';
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
import { MESSAGESERR } from '../../constants/common';
import { toast } from 'react-toastify';
import { QLVDCTSEXTD } from '../../constants/field-modal/qlvdcts';
import DatePicker from "react-datepicker";
const QLVDCTSEXTDModal = forwardRef((props, ref) => {


    useEffect(() => {
        if (props.item) {
            let obj = { ...props.item };
            obj.birdDay = formatStrToDate(obj.birdDay || '');
            obj.idDate = formatStrToDate(obj.idDate || '');
            obj.documentCreatedAt = formatStrToDate(obj.documentCreatedAt || '');
            setFields(obj);
        }
    }, [props.item])

    const [fields, setFields] = useState({ ...QLVDCTSEXTD });
    const [errors, setErrors] = useState({ ...QLVDCTSEXTD });

    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, ['id',
            'idDate']);
        setErrors(errorsT);
        return Object.values(errorsT).every(x => !x);
    }
    const validateReqire = (field, fieldsT, errorsT, fiels = []) => {
        fiels.forEach(item => {
            if (field === item || !field) {
                if (!fieldsT[item] || fieldsT[item].length === 0)
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
    useImperativeHandle(ref, () => ({
        async save() {
            if (handleValidation('', fields)) {

                let obj = { ...fields };
                obj.birdDay = formatDateDDMMYY(obj.birdDay);
                obj.idDate = formatDateDDMMYY(obj.idDate);
                obj.documentCreatedAt = formatDateDDMMYY(obj.documentCreatedAt);

                await api.editExtend(props.idCts, obj).then(res => {
                    if (res.data.code == 1) {
                        // props.close();
                        //toast.success("Cập nhật thông tin mở rộng thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Cập nhật thông tin mở rộng thất bại.");
                    console.log(error);
                });
            }
        }

    }));
    // const save = async () => {
    //     if (handleValidation('', fields)) {

    //         let obj = { ...fields };
    //         obj.birdDay = formatDateDDMMYY(obj.birdDay);
    //         obj.idDate = formatDateDDMMYY(obj.idDate);
    //         obj.documentCreatedAt = formatDateDDMMYY(obj.documentCreatedAt);

    //         await api.editExtend(props.idCts, obj).then(res => {
    //             if (res.data.code == 1) {
    //                 props.close();
    //                 toast.success("Cập nhật thông tin mở rộng thành công.");
    //             } else
    //                 toast.warning(res.data.message);
    //         }).catch((error) => {
    //             toast.warning("Cập nhật thông tin mở rộng thất bại.");
    //             console.log(error);
    //         });
    //     }
    // }
    const keyPressPhone = (e) => {
        if (e.charCode < 48 || e.charCode > 57)
            e.preventDefault();
    }
    return (
        <>
            <Row >
                <Col md={6}>
                    <FormGroup>
                        <Label for="name">Tên thuê bao</Label>
                        <Input value={fields.name || ''} onChange={(e) => handleChange(e, 'name')} type="text" name="name" id="name" placeholder="Tên thuê bao" disabled />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="birdDay">Ngày sinh</Label>
                        <DatePicker selected={fields.birdDay} onChange={value => handleChange({ target: { value } }, 'birdDay')} dateFormat="dd/MM/yyyy" placeholderText="Ngày sinh" />
                    </FormGroup>
                </Col>
            </Row>
            <Row >
                <Col md={6}>
                    <FormGroup>
                        <Label for="id" className="required">Số CMT/CCCD/Hộ chiếu</Label>
                        <Input value={fields.id || ''} onChange={(e) => handleChange(e, 'id')} type="text" name="id" id="id" placeholder="Số CMT/CCCD/Hộ chiếu" invalid={!!errors.id} />
                        <FormFeedback style={{ marginTop: '-20px' }} >{errors.id}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="idDate" className="required">Ngày cấp</Label>
                        <DatePicker selected={fields.idDate} onChange={value => handleChange({ target: { value } }, 'idDate')} dateFormat="dd/MM/yyyy" placeholderText="Ngày cấp" />
                        <Input hidden invalid={!!errors.idDate} />
                        <FormFeedback style={{ marginTop: '0px' }} >{errors.idDate}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
            <Row >
                <Col md={6}>
                    <FormGroup>
                        <Label for="idProvince">Nơi cấp</Label>
                        <Input value={fields.idProvince || ''} onChange={(e) => handleChange(e, 'idProvince')} type="text" name="idProvince" id="idProvince" placeholder="Nơi cấp" />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="phoneNumber">Số Điện thoại</Label>
                        <Input value={fields.phoneNumber || ''} onChange={(e) => handleChange(e, 'phoneNumber')} type="text" name="phoneNumber" id="phoneNumber" placeholder="Số điện thoại" onKeyPress={keyPressPhone} />
                    </FormGroup>
                </Col>
            </Row>
            {/* <Row >
                <Col md={6}>
                    <FormGroup>
                        <Label for="documentRequest">Công văn đề nghị</Label>
                        <Input value={fields.documentRequest || ''} onChange={(e) => handleChange(e, 'documentRequest')} type="text" name="documentRequest" id="documentRequest" placeholder="Công văn đề nghị" />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="agencyCreated">Cơ quan ban hành</Label>
                        <Input value={fields.agencyCreated || ''} onChange={(e) => handleChange(e, 'agencyCreated')} type="text" name="agencyCreated" id="agencyCreated" placeholder="Cơ quan ban hành" />
                    </FormGroup>
                </Col>
            </Row> */}
            {/* <Row >
                <Col md={6}>
                    <FormGroup>
                        <Label for="documentCreatedAt">Ngày ban hành</Label>
                        <DatePicker selected={fields.documentCreatedAt} onChange={value => handleChange({ target: { value } }, 'documentCreatedAt')} dateFormat="dd/MM/yyyy" placeholderText="Ngày ban hành" />
                    </FormGroup>
                </Col>

            </Row> */}
            {/* <div style={{ float: 'right' }}>
                <Button color="primary" style={{ marginRight: '.50rem' }} onClick={save}>Lưu lại</Button>
                <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
            </div> */}

        </>
    );
})
export default QLVDCTSEXTDModal;
