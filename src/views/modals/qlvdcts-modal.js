import React, { useEffect, useState, useRef } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Card,
    CardBody,
    Row,
    Col, Input, FormGroup, Label, FormFeedback, TabContent, TabPane, Nav, NavItem, NavLink,
} from 'reactstrap';
import * as api from '../../services/qlvdcts';
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
import { CATEGORIES, MESSAGESERR, CTS_TABS } from '../../constants/common';
import { toast } from 'react-toastify';
import { QLVDCTS, QLVDCTSVALID } from '../../constants/field-modal/qlvdcts';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { Typeahead } from 'react-bootstrap-typeahead';
import classnames from 'classnames';
import QLVDCTSEXTDModal from './qlvdcts-extend-modal';
import DatePicker from "react-datepicker";
import useGetAgencyLevel from '../../constants/custom-hook/useGetAgencyLevel';
const QLVDCTSModal = (props) => {

    // droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const ctsTypelst = useGetCategoriesByType(CATEGORIES.CTSTYPE);
    const tblkTypeslst = useGetCategoriesByType(CATEGORIES.TBLKTYPE);
    const tdttStatuslst = useGetCategoriesByType(CATEGORIES.TDTTSTATUS);
    const rollbackCtsStatuslst = useGetCategoriesByType(CATEGORIES.ROLLBACKCTSSTATUS);
    const extendStatuslst = useGetCategoriesByType(CATEGORIES.EXTENDSTATUS);
    const [agencyLevel1lst, setAgencyLevel1lst] = useState([]);
    const [agencyLevel2lst, setAgencyLevel2lst] = useState([]);
    const [agencyLevel3lst, setAgencyLevel3lst] = useState([]);
    const [agencyLevel4lst, setAgencyLevel4lst] = useState([]);
    const [extendInfo, setExtendInfo] = useState(props.item ? { ...props.item.extendInfo, idCts: props.item.id } : { idCts: null });
    const inforEl = useRef();
    useEffect(() => {
        if (props.item && provincelst[0]) {

            const existPro = provincelst.some(x => x.name === props.item.province);
            if (!existPro)
                provincelst.push({ id: '', name: props.item.province || '' });
            let obj = { ...props.item };
            obj.createdAt = formatStrToDate(obj.createdAt || '');
            obj.expiredAt = formatStrToDate(obj.expiredAt || '');
            obj.province = provincelst.filter(x => x.name === props.item.province);
            obj.agencyLevel1 = [obj.agencyLevel1 || ''];
            obj.agencyLevel2 = [obj.agencyLevel2 || ''];
            obj.agencyLevel3 = [obj.agencyLevel3 || ''];
            obj.agencyLevel4 = [obj.agencyLevel4 || ''];
            setFields(obj);
        }
    }, [props.item, provincelst])

    const [fields, setFields] = useState({ ...QLVDCTS });
    const [errors, setErrors] = useState({ ...QLVDCTSVALID });

    //tabs
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const handleValidation = (field, fieldsT) => {
        let errorsT = { ...errors };
        if (field)
            errorsT[field] = '';
        validateReqire(field, fieldsT, errorsT, Object.keys({ ...QLVDCTSVALID }));

        // if (field === 'email' && fieldsT['email']) {
        //     const pattern = /[a-zA-Z0-9]+[/\.]?([a-zA-Z0-9]+)?[/\@][a-zA-Z0-9]+[.][a-z]{2,5}/g;
        //     const result = pattern.test(fieldsT['email']);
        //     if (!result) {
        //         errorsT['email'] = MESSAGESERR.email_required;
        //     }
        // }
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
        if (!props.item && field === 'subscription')
            setExtendInfo({ idCts: null, name: e.target.value });

        setFields(fieldsT);
    }
    const save = async () => {
        if (handleValidation('', fields)) {

            let obj = { ...fields };
            obj.createdAt = formatDateDDMMYY(obj.createdAt);
            obj.expiredAt = formatDateDDMMYY(obj.expiredAt);
            obj.province = obj.province[0] ? obj.province[0].name : '';
            obj.agencyLevel1 = obj.agencyLevel1[0];
            obj.agencyLevel2 = obj.agencyLevel2[0];
            obj.agencyLevel3 = obj.agencyLevel3[0];
            obj.agencyLevel4 = obj.agencyLevel4[0];
            if (!props.item)
                await api.save(obj).then(res => {
                    if (res.data.code == 1) {
                        // props.close();
                        toast.success("Thêm mới vòng đời thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Thêm mới vòng đời thất bại.");
                    console.log(error);
                });
            else {
                obj['id'] = props.item.id;
                await api.edit(obj).then(res => {
                    if (res.data.code == 1) {
                        // props.close();
                        toast.success("Cập nhật vòng đời thành công.");
                    } else
                        toast.warning(res.data.message);
                }).catch((error) => {
                    toast.warning("Cập nhật vòng đời thất bại.");
                    console.log(error);
                });
            }
        }
        if (inforEl.current)
            inforEl.current.save();
        props.close();
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
        // <Card>
        //     <CardBody>
        <Modal isOpen={true} toggle={() => props.close()} className="modal-lg">
            <ModalHeader toggle={() => props.close()}>{props.item ? 'Cập nhật' : 'Thêm mới'}</ModalHeader>
            <ModalBody style={{ paddingBottom: 0 }}>
                <Nav tabs>
                    {
                        CTS_TABS.map(e =>
                            <NavItem key={e.tab}>
                                <NavLink
                                    className={classnames({ active: activeTab === e.tab })}
                                    onClick={() => { toggle(e.tab); }} >
                                    {e.name}
                                </NavLink>
                            </NavItem>)
                    }
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId={CTS_TABS[0].tab}>

                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="subscription">Thuê bao</Label>
                                    <Input value={fields.subscription || ''} onChange={(e) => handleChange(e, 'subscription')} type="text" name="subscription" id="subscription" placeholder="Thuê bao" disabled={props.item} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input value={fields.email || ''} onChange={(e) => handleChange(e, 'email')} type="text" name="email" id="email" placeholder="Email" disabled={props.item} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
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
                        </Row>
                        <Row >
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
                        </Row>
                        <Row >
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
                                    <FormFeedback style={{ marginTop: '0px' }}  >{errors.province}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="required" for="position">Chức vụ</Label>
                                    <Input value={fields.position || ''} onChange={(e) => handleChange(e, 'position')} type="text" name="position" id="position" placeholder="Chức vụ" invalid={!!errors.position} />
                                    <FormFeedback style={{ marginTop: '-20px' }} >{errors.position}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="ctsCode">Mã số CTS</Label>
                                    <Input value={fields.ctsCode || ''} onChange={(e) => handleChange(e, 'ctsCode')} type="text" name="ctsCode" id="ctsCode" placeholder="Mã Số CTS" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="subscriptionCode">Mã số TB</Label>
                                    <Input value={fields.subscriptionCode || ''} onChange={(e) => handleChange(e, 'subscriptionCode')} type="text" name="subscriptionCode" id="subscriptionCode" placeholder="Mã số TB" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="createdAt">Ngày cấp</Label>
                                    <DatePicker selected={fields.createdAt} onChange={value => handleChange({ target: { value } }, 'createdAt')} dateFormat="dd/MM/yyyy" placeholderText="Ngày cấp" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="expiredAt">Ngày hết hạn</Label>
                                    <DatePicker selected={fields.expiredAt} onChange={value => handleChange({ target: { value } }, 'expiredAt')} dateFormat="dd/MM/yyyy" placeholderText="Ngày hết hạn" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="ctsType">Loại CTS</Label>
                                    <Input value={fields.ctsType || ''} onChange={(e) => handleChange(e, 'ctsType')} type="select" name="ctsType" id="ctsType">
                                        <option value="">Chọn loại CTS</option>
                                        {
                                            ctsTypelst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="tblkType">Loại TBLK</Label>
                                    <Input value={fields.tblkType || ''} onChange={(e) => handleChange(e, 'tblkType')} type="select" name="tblkType" id="tblkType">
                                        <option value="">Chọn loại TBLK</option>
                                        {
                                            tblkTypeslst.map(e =>
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
                                    <Label for="tdttStatus">Trạng thái TĐTT</Label>
                                    <Input value={fields.tdttStatus || ''} onChange={(e) => handleChange(e, 'tdttStatus')} type="select" name="tdttStatus" id="tdttStatus">
                                        <option value="">Chọn trạng thái TĐTT</option>
                                        {
                                            tdttStatuslst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="rollbackCtsStatus">Trạng thái thu hồi CTS</Label>
                                    <Input value={fields.rollbackCtsStatus || ''} onChange={(e) => handleChange(e, 'rollbackCtsStatus')} type="select" name="rollbackCtsStatus" id="rollbackCtsStatus">
                                        <option value="">Chọn trạng thái thu hồi CTS</option>
                                        {
                                            rollbackCtsStatuslst.map(e =>
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
                                    <Label for="extendStatus">Trạng thái gia hạn</Label>
                                    <Input value={fields.extendStatus || ''} onChange={(e) => handleChange(e, 'extendStatus')} type="select" name="extendStatus" id="extendStatus">
                                        <option value="">Chọn trạng thái gia hạn</option>
                                        {
                                            extendStatuslst.map(e =>
                                                <option value={e.name} key={e.name}>{e.name}</option>
                                            )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="note">Ghi chú</Label>
                                    <Input value={fields.note || ''} onChange={(e) => handleChange(e, 'note')} type="textarea" name="note" id="note" placeholder="Ghí chú" />
                                </FormGroup>
                            </Col>
                        </Row>

                        {/* <div style={{ float: 'right' }}>
                            <Button color="primary" style={{ marginRight: '.50rem' }} onClick={save}>Lưu lại</Button>
                            <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                        </div> */}

                    </TabPane>
                    <TabPane tabId={CTS_TABS[1].tab}>
                        <QLVDCTSEXTDModal item={extendInfo} idCts={extendInfo.idCts} close={() => props.close()} ref={inforEl} />
                    </TabPane>
                </TabContent>
            </ModalBody>
            <ModalFooter style={{ marginTop: '-1rem' }}>
                <div style={{ float: 'right' }}>
                    <Button color="primary" style={{ marginRight: '.50rem' }} onClick={() => save()}>Lưu lại</Button>
                    <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                </div>
            </ModalFooter>
        </Modal >
        //     </CardBody>
        // </Card >
    );
}
export default QLVDCTSModal;
