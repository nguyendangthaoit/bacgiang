import React, { Component, useState, useEffect } from 'react';
import {
    Card, CardBody, Row,
    Col, Input, Button, Table, CustomInput
} from 'reactstrap';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as api from '../../services/qlth';
import model from '../../constants/table-model/qlth';
import QLTHModal from '../modals/qlth-modal';
import { CATEGORIES, filterObject } from '../../constants/common';
import { toast } from 'react-toastify';
import PaginationPage from '../elements/Pagination';
import swal from 'sweetalert';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { formatDateDDMMYY } from '../../constants/helper';
import { Typeahead } from 'react-bootstrap-typeahead';
import { QLTHFILTer } from '../../constants/field-modal/qlth';
import DatePicker from "react-datepicker";
import QLTHEDITMULModal from '../modals/qlth-editMul-modal';
import FilterHeadTable from '../elements/FilterHeadTable';
import useGetAgencyLevel from '../../constants/custom-hook/useGetAgencyLevel';
import { showLoad, hideLoad } from "../../constants/loading";
import ExportExcel from "./exportExcel";
const QLTH = () => {

    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [totalElement, setTotalElement] = useState(0);
    const [dataSelect, setDataSelect] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isEditMulModal, setIsEditMulModal] = useState(false);
    //droplist
    const provincelst = useGetCategoriesByType(CATEGORIES.PROVINCE);
    const rollbackDeviceStatuslst = useGetCategoriesByType(CATEGORIES.ROLLBACKDEVICESTATUS);
    // const agencyLevel1lst = useGetAgencyLevel(CATEGORIES.EXTENDSTATUS);
    // const agencyLevel2lst = useGetAgencyLevel(CATEGORIES.EXTENDSTATUS);
    // const agencyLevel3lst = useGetAgencyLevel(CATEGORIES.EXTENDSTATUS);
    // const agencyLevel4lst = useGetAgencyLevel(CATEGORIES.EXTENDSTATUS);
    const [agencyLevel1lst, setAgencyLevel1lst] = useState([]);
    const [agencyLevel2lst, setAgencyLevel2lst] = useState([]);
    const [agencyLevel3lst, setAgencyLevel3lst] = useState([]);
    const [agencyLevel4lst, setAgencyLevel4lst] = useState([]);

    // filter
    const [fields, setFields] = useState({ ...QLTHFILTer });
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
            id: '',
            ...fieldsT,
            from: formatDateDDMMYY(fieldsT.from),
            to: formatDateDDMMYY(fieldsT.to),
            province: fieldsT.province[0] ? fieldsT.province[0].name : '',
            agencyLevel1: fieldsT.agencyLevel1[0] || '',
            agencyLevel2: fieldsT.agencyLevel2[0] || '',
            agencyLevel3: fieldsT.agencyLevel3[0] || '',
            agencyLevel4: fieldsT.agencyLevel4[0] || '',
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
                toast.warning("Tìm kiếm thu hồi thất bại.");
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
            text: "Muốn xóa thu hồi không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa thu hồi thành công.");
                            search();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa thu hồi thất bại.");
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
        let fieldsT = { ...QLTHFILTer };
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
        <div>
            <Card>
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <Input value={fields.rollbackDeviceStatus} onChange={(e) => handleChange(e, 'rollbackDeviceStatus')} type="select" name="select" id="rollbackDeviceStatus">
                                <option value="">Chọn trạng thái thu hồi</option>
                                {
                                    rollbackDeviceStatuslst.map(e =>
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
                            <DatePicker selected={fields.from} onChange={value => handleChange({ target: { value } }, 'from')} dateFormat="dd/MM/yyyy" placeholderText="Từ ngày" className="form-control" />
                        </Col>
                        <Col md={3}>
                            <DatePicker selected={fields.to} onChange={value => handleChange({ target: { value } }, 'to')}
                                dateFormat="dd/MM/yyyy" placeholderText="Đến ngày" className="form-control" />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Typeahead
                                id="agencyLevel1"
                                selected={fields.agencyLevel1}
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel1 = [value[0].label || value[0]];
                                    setFields(fieldsT)
                                }}
                                options={agencyLevel1lst}
                                placeholder="Chọn cơ quan cấp 1"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    agencyLevelChange(value, 1);
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel1 = [value];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Typeahead
                                id="agencyLevel2"
                                selected={fields.agencyLevel2}
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel2 = [value[0].label || value[0]];
                                    setFields(fieldsT)
                                }}
                                options={agencyLevel2lst}
                                placeholder="Chọn cơ quan cấp 2"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    agencyLevelChange(value, 2);
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel2 = [value];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Typeahead
                                id="agencyLevel3"
                                selected={fields.agencyLevel3}
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel3 = [value[0].label || value[0]];
                                    setFields(fieldsT)
                                }}
                                options={agencyLevel3lst}
                                placeholder="Chọn cơ quan cấp 3"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    agencyLevelChange(value, 3);
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel3 = [value];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Typeahead
                                id="agencyLevel4"
                                selected={fields.agencyLevel4}
                                onChange={value => {
                                    if (!value[0]) return;
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel4 = [value[0].label || value[0]];
                                    setFields(fieldsT)
                                }}
                                options={agencyLevel4lst}
                                placeholder="Chọn cơ quan cấp 4"
                                emptyLabel={'Không có dữ liệu'}
                                allowNew
                                newSelectionPrefix=""
                                onInputChange={value => {
                                    agencyLevelChange(value, 4);
                                    const fieldsT = { ...fields };
                                    fieldsT.agencyLevel4 = [value];
                                    setFields(fieldsT)
                                }}
                            />
                        </Col>

                    </Row>
                    <Row>
                        <Col md={3}>
                            <Input type="text" value={fields.note} onChange={(e) => handleChange(e, 'note')} placeholder="Ghi chú" />

                        </Col>
                        <Col md={9} style={{ textAlign: 'end' }} >
                            <div className="btn-group form-group">
                                <button type="button" className="btn btn-primary px-3" onClick={() => search()}><i className="fa fa-search mr-1" aria-hidden="true"></i>&nbsp;Tìm kiếm</button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu btn_toggle">
                                    <a className="dropdown-item" onClick={addNew}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</a>
                                    <a className="dropdown-item" onClick={editMul}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp; Sửa nhiều dữ liệu</a>
                                    <a className="dropdown-item" onClick={deleteMul} ><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều dữ liệu</a>
                                    <ExportExcel data={rowData} model={model} name="QLTH" />
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
                isOpenModal && <QLTHModal close={closeModal} item={itemEdit} />
            }
            {
                isEditMulModal && <QLTHEDITMULModal close={closeEditMulModal} dataSelect={dataSelect} />
            }
        </div >
    )
}

export default QLTH;