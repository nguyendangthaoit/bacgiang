import React, { Component, useState, useEffect } from 'react';
import {
    Card, CardBody, Row,
    Col, Input, Button, Table, CustomInput
} from 'reactstrap';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as api from '../../services/qlgh-tdtt';
import model from '../../constants/table-model/qlgh-tdtt';
import QLGHTDTTModal from '../modals/qlgh-tdtt-modal';
import { CATEGORIES, filterObject } from '../../constants/common';
import { toast } from 'react-toastify';
import PaginationPage from '../elements/Pagination';
import swal from 'sweetalert';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { formatDateDDMMYY } from '../../constants/helper';
import { Typeahead } from 'react-bootstrap-typeahead';
import { QLGHTDTTFILTer } from '../../constants/field-modal/qlgh-tdtt';
import DatePicker from "react-datepicker";
import QLGHTDTTEDITMULModal from '../modals/qlgh-tdtt-editMul-modal';
import FilterHeadTable from '../elements/FilterHeadTable';
import { showLoad, hideLoad } from "../../constants/loading";
import ExportExcel from "./exportExcel";
const QLGHTDTT = () => {

    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [totalElement, setTotalElement] = useState(0);
    const [dataSelect, setDataSelect] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isEditMulModal, setIsEditMulModal] = useState(false);
    //droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const requestTypelst = useGetCategoriesByType(CATEGORIES.REQUESTTYPE);
    // filter
    const [fields, setFields] = useState({ ...QLGHTDTTFILTer });

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
            dateCreated: formatDateDDMMYY(fieldsT.dateCreated),
            province: fieldsT.province[0] ? fieldsT.province[0].name : '',
            ...filterObject
        };
        await api.search(obj)
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
                console.log(error);
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
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Tìm kiếm nhanh thất bại.");
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
            text: "Muốn xóa gia hạn này không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa gia hạn thành công.");
                            search();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa gia hạn thất bại.");
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
        setDataSelect([]);
        setIsSelectAll(false);
    }
    const clearSearch = () => {
        let fieldsT = { ...QLGHTDTTFILTer };
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
            console.log(error);
        });
    }
    return (
        <div>
            <Card >
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <Input value={fields.fieldInfoChange} onChange={(e) => handleChange(e, 'fieldInfoChange')} type="text" placeholder="Chọn trường thông tin thay đổi" />
                        </Col>

                        <Col md={3}>
                            <Input value={fields.note} onChange={(e) => handleChange(e, 'note')} type="text" placeholder="Chọn ghi chú" />
                        </Col>

                        <Col md={3}>
                            <DatePicker selected={fields.from} onChange={value => handleChange({ target: { value } }, 'from')}
                                dateFormat="dd/MM/yyyy" placeholderText="Từ ngày" className="form-control" />
                        </Col>
                        <Col md={3}>
                            <DatePicker selected={fields.to} onChange={value => handleChange({ target: { value } }, 'to')}
                                dateFormat="dd/MM/yyyy" placeholderText="Đến ngày" className="form-control" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Input value={fields.requestType} onChange={(e) => handleChange(e, 'requestType')} type="select" name="requestType" id="requestType">
                                <option value="">Chọn loại yêu cầu</option>
                                {
                                    requestTypelst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                        </Col>
                        <Col md={3}>
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
                        <Col md={3}>
                            <DatePicker selected={fields.dateCreated} onChange={value => handleChange({ target: { value } }, 'dateCreated')}
                                dateFormat="dd/MM/yyyy" placeholderText="Chọn ngày nhập đợt cấp" className="form-control" />
                        </Col>
                        <Col md={3} style={{ textAlign: 'end' }}>
                            <div className="btn-group form-group">
                                <button type="button" className="btn btn-primary px-3" onClick={() => search()}><i className="fa fa-search mr-1" aria-hidden="true"></i>&nbsp;Tìm kiếm</button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu btn_toggle">
                                    <a className="dropdown-item" onClick={addNew}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</a>
                                    <a className="dropdown-item" onClick={editMul}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp; Sửa nhiều dữ liệu</a>
                                    <a className="dropdown-item" onClick={deleteMul} ><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều dữ liệu</a>
                                    <ExportExcel data={rowData} model={model} name="QLGH" />
                                    <a className="dropdown-item" onClick={clearSearch}><i className="fa fa-refresh"></i>&nbsp; Bỏ tìm kiếm</a>
                                </div>
                            </div>
                            {/* <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={deleteMul} disabled={idDeletelst.length === 0}><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều DL</Button>
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
                                <Button className="mx-1" outline color="primary" onClick={search} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp; Tìm kiếm</Button>
                            </div> */}
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
                isOpenModal && <QLGHTDTTModal close={closeModal} item={itemEdit} />
            }
            {
                isEditMulModal && <QLGHTDTTEDITMULModal close={closeEditMulModal} dataSelect={dataSelect} />
            }

        </div >
    )
}

export default QLGHTDTT;