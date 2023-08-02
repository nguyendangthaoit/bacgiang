import React, { Component, useState, useEffect } from 'react';
import {
    Card, CardBody, Row,
    Col, Input, Button, Table, CustomInput
} from 'reactstrap';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as api from '../../services/qldc';
import model from '../../constants/table-model/qldc';
import QLDCModal from '../modals/qldc-modal';
import { CATEGORIES, filterObject } from '../../constants/common';
import { toast } from 'react-toastify';
import PaginationPage from '../elements/Pagination';
import swal from 'sweetalert';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { formatDateDDMMYY } from '../../constants/helper';
import { Toast } from 'bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { QLDCFILTer } from '../../constants/field-modal/qldc';
import moment from 'moment';
import DatePicker from "react-datepicker";
import QLDCEDITMULModal from '../modals/qldc-editMul-modal';
import FilterHeadTable from '../elements/FilterHeadTable';
import { showLoad, hideLoad } from "../../constants/loading";
import ExportExcel from "./exportExcel";
import QLVDCTSModal from '../modals/qlvdcts-modal';
const QLDC = () => {

    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [totalElement, setTotalElement] = useState(0);
    const [dataSelect, setDataSelect] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isEditMulModal, setIsEditMulModal] = useState(false);
    const [isQLVDCTSOpenModal, setQLVDCTSOpenModal] = useState(false);
    //droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const documentStatuslst = useGetCategoriesByType(CATEGORIES.DOCUMENTSTATUS);
    const agencyIssuedlst = useGetCategoriesByType(CATEGORIES.AGENCYISSUED);
    const superiorAgencylst = useGetCategoriesByType(CATEGORIES.SUPERIORAGENCY);
    const agencyLevelMinistrylst = useGetCategoriesByType(CATEGORIES.AGENCYLEVELMINISTRY);
    const requestTypelst = useGetCategoriesByType(CATEGORIES.REQUESTTYPE);
    // filter
    const [fields, setFields] = useState({ ...QLDCFILTer });

    useEffect(() => {
        search();
    }, []);


    const handleChange = (e, field) => {
        let fieldsT = { ...fields };
        fieldsT[field] = e.target.value;
        setFields(fieldsT);
    }

    const search = async (fieldsT = fields, isLoading = true) => {
        isLoading && showLoad();
        const obj = {
            ...fieldsT,
            from: formatDateDDMMYY(fieldsT.from),
            to: formatDateDDMMYY(fieldsT.to),
            date: formatDateDDMMYY(fieldsT.date),
            province: fieldsT.province[0] ? fieldsT.province[0].name : '',
            agencyLevelMinistry: fieldsT.agencyLevelMinistry[0] ? fieldsT.agencyLevelMinistry[0].name : '',
            requestType: fieldsT.requestType[0] ? fieldsT.requestType[0].name : '',
            ...filterObject
        };
        await api.searchAllocationPhase(obj)
            .then(res => {
                hideLoad();
                if (res.data.code == 1) {
                    setRowData(res.data.data.items);
                    setTotalElement(res.data.data.totalElement);
                } else
                    toast.warning(res.data.message);
            }).catch((error) => {
                toast.warning("Tìm kiếm thất bại.");
                hideLoad();
            });
    }

    const onChange = (e) => {
        // quickSearch({
        //     keyword: e.target.value,
        //     ...filterObject
        // });
        let fieldsT = { ...fields }
        fieldsT.keyword = e.target.value;
        setFields(fieldsT);
        search(fieldsT, false);
    }

    async function quickSearch(obj) {
        await api.quickSearch(obj).then(res => {
            if (res.data.code == 1) {
                setRowData(res.data.data.items);
                //setTotalElement(res.data.data.totalElement);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Tìm kiếm nhanh thất bại.");
            console.log(error);
        });
    }

    const importExcel = (e) => {
        e.preventDefault();
        let input = document.getElementById("fileInput");
        input.click()
    }

    const exportExcel = (e) => {
        e.preventDefault();
        toast.info("Comming soon...!!!");
    }

    const handleImport = (e) => {
        const formData = new FormData();
        // Update the formData object 
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append("file", e.target.files[i]);
        }
        // formData.append("file", e.target.files);
        api.importExcel(formData)
            .then(res => {
                if (res.data.code == 1) {
                    toast.success("Nhập từ Excel thành công.");
                    search();
                } else
                    toast.warning(res.data.message);
            }).catch((error) => {
                toast.warning("Nhập từ Excel thất bại.");
                console.log(error);
            });
    }

    const closeModal = (e) => {
        setOpenModal(false);
        search();
    }
    const deleteItem = (id) => {
        swal({
            title: "Bạn có chắc?",
            text: "Muốn xóa đợt cấp không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa đợt cấp thành công.");
                            search();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa đợt cấp thất bại.");
                        console.log(error);
                    });
                }
            });

    }
    const editItem = (data) => {
        setItemEdit(data);
        setOpenModal(true);
    }
    const addNew = () => {
        setOpenModal(true);
        setItemEdit(null);
    }

    const pageChange = (e) => {
        if (filterObject.page !== e) {
            filterObject.page = e;
            search();
        }
    }
    const selectAll = (e) => {
        if (e.target.checked) {
            setDataSelect([...rowData]);
            setIsSelectAll(true);
        } else {
            setIsSelectAll(false);
            setDataSelect([]);
        }
    }
    const selectRow = (e, item) => {
        if (e.target.checked) {
            const items = [...dataSelect, item];
            setDataSelect(items);
            const check = items.length === rowData.length;
            setIsSelectAll(check);
        } else {
            let items = [...dataSelect];
            items = items.filter(x => x.id !== item.id);
            setDataSelect(items);
            setIsSelectAll(false);
        }
    }
    const deleteMul = () => {
        if (dataSelect.length === 0)
            return toast.warning("Không có dữ liệu nào được chọn.");

        const ids = dataSelect.map(x => x.id).join();
        deleteItem(ids);
    }
    const clearSearch = () => {
        let fieldsT = { ...QLDCFILTer };
        setFields(fieldsT);
        search(fieldsT);
    }
    const editMul = () => {
        if (dataSelect.length === 0)
            return toast.warning("Không có dữ liệu nào được chọn.");
        setIsEditMulModal(true);
    }
    const closeEditMulModal = () => {
        setIsEditMulModal(false);
        setDataSelect([]);
        setIsSelectAll(false);
        search();
    }
    const searchField = (obj) => {
        showLoad();
        obj = {
            ...obj,
            ...filterObject
        }
        api.fieldSearch(obj).then(res => {
            hideLoad();
            if (res.data.code == 1) {
                setRowData(res.data.data.items);
                setTotalElement(res.data.data.totalElement);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Tìm kiếm thất bại.");
            hideLoad();
        });
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <Input value={fields.documentStatus} onChange={(e) => handleChange(e, 'documentStatus')} type="select" name="documentStatus" id="documentStatus">
                                <option value="">Chọn trạng thái hồ sơ</option>
                                {
                                    documentStatuslst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                        </Col>

                        <Col md={3}>
                            {/* <Input
                                type="text"
                                value={moment(fields.date).format('dd/MM/yyyy')} onChange={(e) => handleChange(e, 'date')}
                                name="date"
                                id="date"
                                placeholder="Chọn ngày nhập cấp"
                                onFocus={e => e.currentTarget.type = 'date'}
                                onBlur={e => e.currentTarget.type = 'text'}
                            /> */}
                            <DatePicker selected={fields.date} onChange={value => handleChange({ target: { value } }, 'date')} dateFormat="dd/MM/yyyy" placeholderText="Chọn ngày nhập cấp" className="form-control" />
                        </Col>

                        <Col md={3}>
                            {/* <Input placeholder="Từ ngày"
                                value={fields.from} onChange={(e) => handleChange(e, 'from')}
                                name="from" id="from"
                                type="text"
                                id="from"
                                onFocus={e => e.currentTarget.type = 'date'}
                                onBlur={e => e.currentTarget.type = 'text'} /> */}
                            <DatePicker selected={fields.from} onChange={value => handleChange({ target: { value } }, 'from')}
                                dateFormat="dd/MM/yyyy" placeholderText="Từ ngày" className="form-control" />
                        </Col>
                        <Col md={3}>
                            {/* <Input
                                type="text"
                                value={fields.to} onChange={(e) => handleChange(e, 'to')}
                                name="to"
                                id="to"
                                placeholder="Đến ngày"
                                onFocus={e => e.currentTarget.type = 'date'}
                                onBlur={e => e.currentTarget.type = 'text'}
                            /> */}
                            <DatePicker selected={fields.to} onChange={value => handleChange({ target: { value } }, 'to')}
                                dateFormat="dd/MM/yyyy" placeholderText="Đến ngày" className="form-control" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            {/* <Input type="select" {...agencyIssued} name="select" id="agencyIssued">
                                <option value="">Chọn cơ quan ban hành</option>
                                {
                                    agencyIssuedlst.map(e =>
                                        <option value={e.id} key={e.id}>{e.name}</option>
                                    )
                                }
                            </Input> */}
                            <Input value={fields.agencyIssued} onChange={(e) => handleChange(e, 'agencyIssued')} type="search" name="agencyIssued" id="agencyIssued" placeholder="Cơ quan ban ngành" />
                        </Col>
                        {/* <Col md={3}>
                            <Input type="select" {...superiorAgency} name="select" id="superiorAgency">
                                <option value="">Chọn cơ quan cấp trên</option>
                                {
                                    superiorAgencylst.map(e =>
                                        <option value={e.id} key={e.id}>{e.name}</option>
                                    )
                                }
                            </Input>
                        </Col> */}
                        <Col md={3}>
                            <Typeahead
                                id="requestType"
                                labelKey="name"
                                selected={fields.requestType}
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.requestType = value;
                                    setFields(fieldsT)
                                }}
                                options={requestTypelst}
                                placeholder="Chọn loại yêu cầu"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    const fieldsT = { ...fields };
                                    fieldsT.requestType = [{ id: '', name: value }];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            {/* <Input value={fields.agencyLevelMinistryCode} onChange={(e) => handleChange(e, 'agencyLevelMinistryCode')} type="select" name="agencyLevelMinistryCode" id="agencyLevelMinistryCode">
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
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevelMinistry = [{ id: '', name: value }];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            {/* <Input type="select" {...province} name="select" id="province">
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
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.province = value;
                                    setFields(fieldsT)
                                }}
                                options={provincelst}
                                placeholder="Chọn Tỉnh/Thành"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    const fieldsT = { ...fields };
                                    fieldsT.province = [{ id: '', name: value }];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>

                        <Col md={3}>
                            <Input type="search" value={fields.note} onChange={(e) => handleChange(e, 'note')} placeholder="Ghi chú" />
                        </Col>
                        <Col md={9} style={{ textAlign: 'end' }}>
                            <div className="btn-group form-group">
                                <button type="button" className="btn btn-primary px-3" onClick={() => search()}><i className="fa fa-search mr-1" aria-hidden="true"></i>&nbsp;Tìm kiếm</button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu btn_toggle">
                                    <a className="dropdown-item" onClick={addNew}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</a>
                                    <a className="dropdown-item" onClick={() => setQLVDCTSOpenModal(true)}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới CTS</a>
                                    <a className="dropdown-item" onClick={editMul}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp; Sửa nhiều dữ liệu</a>
                                    <a className="dropdown-item" onClick={deleteMul} ><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều dữ liệu</a>
                                    <ExportExcel data={rowData} model={model} name="QLDC" />
                                    <div className="dropdown-divider"></div>
                                    {/* <a className="dropdown-item" onClick={importExcel}><i className="fa fa-file-excel-o"></i>&nbsp; Nhập từ excel</a> */}
                                    <a className="dropdown-item" onClick={clearSearch}><i className="fa fa-refresh"></i>&nbsp; Bỏ tìm kiếm</a>

                                    {/* <a className="dropdown-item" onClick={exportExcel}><i className="fa fa-download" aria-hidden="true"></i>&nbsp; Xuất file excel</a> */}
                                </div>
                            </div>
                            {/* <div className="d-flex flex-row-reverse">
                                <Button className="mx-1"  color="primary" onClick={deleteMul} disabled={idDeletelst.length === 0}><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều DL</Button>
                                <Button className="mx-1"  color="primary" onClick={importExcel}><i className="fa fa-file-excel-o"></i>&nbsp; Nhập từ excel</Button>
                                <Button className="mx-1"  color="primary" onClick={addNew} >Thêm mới</Button>
                                <Button className="mx-1"  color="primary" onClick={search} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp; Tìm kiếm</Button>
                            </div> */}
                            <Input type="file" hidden id="fileInput" onChange={handleImport} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Input type="search" value={fields.keyword} placeholder="Gõ tìm kiếm nhanh:" onChange={(e) => onChange(e)} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card >
                <CardBody>
                    <div>
                        <Table bordered hover style={{
                            display: 'block', overflowX: 'auto', whiteSpace: 'nowrap'
                        }}>
                            <thead>
                                < tr >
                                    <th><CustomInput type="checkbox" id="dc" value={isSelectAll} checked={isSelectAll} onChange={e => selectAll(e)} /></th>
                                    {
                                        model.map((e, i) =>
                                            <th key={i}>
                                                {e.text} &nbsp;&nbsp;
                                                <FilterHeadTable params={e} onSearch={searchField} onClose={search} />
                                            </th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rowData.map((row, ri) =>
                                        <tr key={ri} onDoubleClick={() => editItem(row)}>
                                            <td> <CustomInput type="checkbox" id={'dc' + ri} checked={dataSelect.some(x => x.id === row.id)} onChange={e => selectRow(e, row)} /></td>
                                            {model.map((cell, ci) =>
                                                ci === 0 ?
                                                    <td key={ci}>{ri + 1 + (filterObject.page - 1) * filterObject.page_size}</td> :
                                                    cell.field ? <td key={ci}>{row[cell.field]}</td> : null
                                            )}
                                            <td style={{ textAlign: 'center' }}>
                                                <Button className="mx-1" size="sm" color="success" onClick={() => editItem(row)} title="sửa"><i className="fa fa-edit"></i></Button>
                                                <Button className="mx-1" size="sm" color="danger" onClick={() => deleteItem(row.id)} title="xóa"><i className="fa fa-trash-o"></i></Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table >
                    </div>
                    <PaginationPage totalElement={totalElement} changePage={(e) => pageChange(e)} />

                </CardBody >
            </Card >
            {
                isOpenModal && <QLDCModal close={closeModal} item={itemEdit} />
            }
            {
                isEditMulModal && <QLDCEDITMULModal close={closeEditMulModal} dataSelect={dataSelect} />
            }
            {
                isQLVDCTSOpenModal && <QLVDCTSModal close={() => setQLVDCTSOpenModal(false)} item={null} />
            }
        </div >
    )
}

export default QLDC;