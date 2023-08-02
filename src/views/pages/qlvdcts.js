import React, { useState, useEffect } from 'react';
import {
    Card, CardBody, Row,
    Col, Input, Button, Table, CustomInput
} from 'reactstrap';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as api from '../../services/qlvdcts';
import model from '../../constants/table-model/qlvdcts';
import QLVDCTSModal from '../modals/qlvdcts-modal';
import { CATEGORIES, filterObject } from '../../constants/common';
import { toast } from 'react-toastify';
import PaginationPage from '../elements/Pagination';
import swal from 'sweetalert';
import { formatDateDDMMYY } from '../../constants/helper';
import QLVDCTSEXTDTooltip from '../modals/qlvdcts_extend-tooltip';
import useGetCategoriesByType from '../../constants/custom-hook/useGetCategoriesByType';
import { QLVDCTSILTer } from '../../constants/field-modal/qlvdcts';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from "react-datepicker";
import QLVDCTSEDITMULModal from '../modals/qlvdcts-editMul-modal';
import FilterHeadTable from '../elements/FilterHeadTable';
import useGetAgencyLevel from '../../constants/custom-hook/useGetAgencyLevel';
import { showLoad, hideLoad } from "../../constants/loading";
import ExportExcel from "./exportExcel";
const QLVDCTS = () => {

    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [totalElement, setTotalElement] = useState(0);
    const [dataSelect, setDataSelect] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isEditMulModal, setIsEditMulModal] = useState(false);
    const [extendInfo, setExtendInfo] = useState(null);

    // droplist
    const ctsTypelst = useGetCategoriesByType(CATEGORIES.CTSTYPE);
    const tblkTypeslst = useGetCategoriesByType(CATEGORIES.TBLKTYPE);
    const tdttStatuslst = useGetCategoriesByType(CATEGORIES.TDTTSTATUS);
    const rollbackCtsStatuslst = useGetCategoriesByType(CATEGORIES.ROLLBACKCTSSTATUS);
    const extendStatuslst = useGetCategoriesByType(CATEGORIES.EXTENDSTATUS);
    const [agencyLevel1lst, setAgencyLevel1lst] = useState([]);
    const [agencyLevel2lst, setAgencyLevel2lst] = useState([]);
    const [agencyLevel3lst, setAgencyLevel3lst] = useState([]);
    const [agencyLevel4lst, setAgencyLevel4lst] = useState([]);

    // filter
    const [fields, setFields] = useState({ ...QLVDCTSILTer });
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
            agencyLevel1: fieldsT.agencyLevel1[0] || '',
            agencyLevel2: fieldsT.agencyLevel2[0] || '',
            agencyLevel3: fieldsT.agencyLevel3[0] || '',
            agencyLevel4: fieldsT.agencyLevel4[0] || '',
            ...filterObject
        };

        await api.search(obj)
            .then(res => {
                hideLoad();
                if (res.data.code === 1) {
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
            if (res.data.code === 1) {
                setRowData(res.data.data.items);
                //setTotalElement(res.data.data.totalElement);
            }
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
    const handleImport = (e) => {
        const formData = new FormData();
        // Update the formData object 
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append("file", e.target.files[i]);
        }
        // formData.append("file", e.target.files);
        api.importExcel(formData)
            .then(res => {
                if (res.data.code === 1) {
                    toast.success("Cập nhật từ Excel thành công.");
                    search();
                }
            }).catch((error) => {
                toast.warning("Cập nhật từ Excel thất bại.");
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
            text: "Muốn xóa vòng đời này không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code === 1) {
                            toast.success("Xóa vòng đời thành công.");
                            search();
                        }
                    }).catch((error) => {
                        toast.warning("Xóa vòng đời thất bại.");
                        console.log(error);
                    });
                }
            });
    }
    const editItem = (data) => {
        setItemEdit(data)
        setOpenModal(true)
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
    const exportExcel = () => { }

    const onExtendInfo = (data, parentId) => {
        data['parentId'] = parentId;
        setExtendInfo(data);
    }
    const clearSearch = () => {
        let fieldsT = { ...QLVDCTSILTer };
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
            hideLoad()
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
            <Card >
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <Input value={fields.lblkType} onChange={(e) => handleChange(e, 'lblkType')} type="select" name="lblkType" id="lblkType">
                                <option value="">Chọn loại TBLK</option>
                                {
                                    tblkTypeslst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                            {/* <Input type="text"  {...lblkType} placeholder="Chọn loại TBLK" /> */}
                        </Col>

                        <Col md={3}>
                            <Input value={fields.ctsType} onChange={(e) => handleChange(e, 'ctsType')} type="select" name="ctsType" id="ctsType">
                                <option value="">Chọn loại CTS</option>
                                {
                                    ctsTypelst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                            {/* <Input type="text"  {...ctsType} placeholder="Chọn loại CTS" /> */}
                        </Col>

                        <Col md={3}>
                            <DatePicker selected={fields.from} onChange={value => handleChange({ target: { value } }, 'from')} dateFormat="dd/MM/yyyy" placeholderText="Từ ngày" className="form-control" />
                        </Col>
                        <Col md={3}>
                            <DatePicker selected={fields.to} onChange={value => handleChange({ target: { value } }, 'to')} dateFormat="dd/MM/yyyy" placeholderText="Đến ngày" className="form-control" />
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
                            <Input value={fields.rollbackStatus} onChange={(e) => handleChange(e, 'rollbackStatus')} type="select" name="rollbackStatus" id="rollbackStatus">
                                <option value="">Chọn trạng thái thu hồi CTS</option>
                                {
                                    rollbackCtsStatuslst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                            {/* <Input type="text"  {...rollbackStatus} placeholder="Chọn trạng thái thu hồi" /> */}
                        </Col>
                        <Col md={3}>
                            <Input value={fields.extendStatus} onChange={(e) => handleChange(e, 'extendStatus')} type="select" name="extendStatus" id="extendStatus">
                                <option value="">Chọn trạng thái gia hạn</option>
                                {
                                    extendStatuslst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                            {/* <Input type="text"  {...extendStatus} placeholder="Chọn trạng thái gia hạn" /> */}
                        </Col>
                        <Col md={3}>
                            <Input value={fields.TDTTStatus} onChange={(e) => handleChange(e, 'TDTTStatus')} type="select" name="TDTTStatus" id="TDTTStatus">
                                <option value="">Chọn trạng thái TĐTT</option>
                                {
                                    tdttStatuslst.map(e =>
                                        <option value={e.name} key={e.name}>{e.name}</option>
                                    )
                                }
                            </Input>
                            {/* <Input type="text"  {...tdttstatus} placeholder="Chọn trạng thái TĐTT" /> */}
                        </Col>
                        <Col md={3} style={{ textAlign: 'end' }}>
                            <div className="btn-group form-group">
                                <button type="button" className="btn btn-primary px-3" onClick={() => search()}><i className="fa fa-search mr-1" aria-hidden="true"></i>&nbsp;Tìm kiếm</button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu btn_toggle">
                                    {/* <a className="dropdown-item" onClick={addNew}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</a> */}
                                    <a className="dropdown-item" onClick={editMul}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp; Sửa nhiều dữ liệu</a>
                                    <a className="dropdown-item" onClick={deleteMul} ><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều dữ liệu</a>
                                    <a className="dropdown-item" onClick={importExcel}><i className="fa fa-file-excel-o"></i>&nbsp; Cập nhật từ excel</a>
                                    <ExportExcel data={rowData} model={model} name="QLVDCTS" />
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" onClick={clearSearch}><i className="fa fa-refresh"></i>&nbsp; Bỏ tìm kiếm</a>
                                    {/* <a className="dropdown-item" onClick={exportExcel}><i className="fa fa-download" aria-hidden="true"></i>&nbsp; Xuất file excel</a> */}
                                </div>
                                {/* upload excel */}
                                <Input type="file" hidden id="fileInput" onChange={handleImport} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Input type="search" value={fields.keyword} placeholder="Gõ tìm kiếm nhanh:" onChange={(e) => onChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} >
                            {/* <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={deleteMul} disabled={idDeletelst.length === 0}><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều DL</Button>
                                <Button className="mx-1" outline color="primary" onClick={importExcel}><i className="fa fa-file-excel-o"></i>&nbsp; Nhập từ excel</Button>
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
                                <Button className="mx-1" outline color="primary" onClick={search} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp; Tìm kiếm</Button>
                            </div> */}
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
                                            {model.map((cell, ci) => {
                                                if (ci === 0)
                                                    return <td key={ci}>{ri + 1 + (filterObject.page - 1) * filterObject.page_size}</td>
                                                else if (cell.field) {
                                                    if (cell.isExtendInfo)
                                                        return <td key={ci} ><span style={{ cursor: 'pointer' }} id={`extendInfo${ri}`} onMouseEnter={() => onExtendInfo(row['extendInfo'], `extendInfo${ri}`)} onMouseLeave={() => setExtendInfo(null)}>{row[cell.field]}</span></td>
                                                    else
                                                        return <td key={ci}>{row[cell.field]}</td>
                                                }
                                            }
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
                isOpenModal && <QLVDCTSModal close={closeModal} item={itemEdit} />
            }
            {
                extendInfo && <QLVDCTSEXTDTooltip extendInfo={extendInfo} />
            }
            {
                isEditMulModal && <QLVDCTSEDITMULModal close={closeEditMulModal} dataSelect={dataSelect} />
            }

        </div >
    )
}

export default QLVDCTS;