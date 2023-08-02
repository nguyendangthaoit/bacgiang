import React, { useState, useEffect } from 'react';
import PaginationPage from '../../elements/Pagination';
import model from '../../../constants/table-model/dm';
import { filterObject } from '../../../constants/common';
import * as api from '../../../services/dm';
import * as apiLDM from '../../../services/ldm';
import { toast } from 'react-toastify';
import DMModal from '../../modals/dm-modal';
import swal from 'sweetalert';
import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
    Table,
} from 'reactstrap';
import { showLoad, hideLoad } from "../../../constants/loading";
const DM = () => {

    const [totalElement, setTotalElement] = useState(0);
    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [key, setKey] = useState('');
    const [type, setType] = useState('');
    const [types, setTypes] = useState([]);

    useEffect(() => {
        search();
    }, []);
    useEffect(() => {
        getAllTypes();
    }, []);

    // const getAll = () => {
    //     api.getAll(filterObject).then(res => {
    //         if (res.data.code == 1) {
    //             setRowData(res.data.data.items);
    //             setTotalElement(res.data.data.totalElement);
    //         } else
    //             toast.warning(res.data.message);
    //     }).catch((error) => {
    //         toast.warning("Lấy dữ liệu thất bại.");
    //         console.log(error);
    //     });
    // }
    async function getAllTypes() {
        await apiLDM.getAll().then(res => {
            if (res.data.code == 1) {
                setTypes(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lây dữ liệu loại danh mục thất bại.");
            console.log(error);
        });
    }
    const deleteItem = (id) => {
        swal({
            title: "Bạn có chắc?",
            text: "Muốn xóa danh mục này không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa danh mục thành công.");
                            search();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa danh mục thất bại.");
                        console.log(error);
                    });
                }
            });
    }

    const editItem = (item) => {
        setItemEdit(item);
        setOpenModal(true);
    }

    const addNew = () => {
        setOpenModal(true);
        setItemEdit(null);
    }

    const search = async () => {
        showLoad();
        const obj = {
            key, type,
            ...filterObject
        };

        await api.quickSearch(obj)
            .then(res => {
                hideLoad();
                if (res.data.code == 1) {
                    setRowData(res.data.data);
                    setTotalElement(res.data.totalElement);
                } else
                    toast.warning(res.data.message);
            }).catch((error) => {
                toast.warning("Tìm kiếm thất bại.");
                hideLoad();
                console.log(error);
            });

    }
    const pageChange = (e) => {
        if (filterObject.page !== e) {
            filterObject.page = e;
            search();
        }
    }
    const closeModal = (e) => {
        setOpenModal(false);
        search();
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Row >
                        <Col md={4}>
                            <Input type="search" placeholder="Tìm kiếm" value={key} onChange={(e) => setKey(e.target.value)} />
                        </Col>
                        <Col md={4}>
                            <Input type="select" name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="">Chọn loại danh mục</option>
                                {
                                    types.map(e =>
                                        <option value={e.code} key={e.code}>{e.name}</option>
                                    )
                                }
                            </Input>
                        </Col>
                        {/* <Col md={4}>
                            <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
                                <Button className="mx-1" outline color="primary" onClick={search} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp; Tìm kiếm</Button>
                            </div>
                        </Col> */}
                        <Col md={4} style={{ textAlign: 'end' }}>
                            <div className="btn-group">
                                <button type="button" className="btn btn-primary px-3" onClick={search}><i className="fa fa-search mr-1" aria-hidden="true"></i>&nbsp;Tìm kiếm</button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split px-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu btn_toggle">
                                    <a className="dropdown-item" onClick={addNew}><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</a>
                                </div>
                            </div>
                            {/* <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={deleteMul} disabled={idDeletelst.length === 0}><i className="fa fa-trash-o"></i>&nbsp; Xóa nhiều DL</Button>
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
                                <Button className="mx-1" outline color="primary" onClick={search} ><i className="fa fa-search" aria-hidden="true"></i>&nbsp; Tìm kiếm</Button>
                            </div> */}
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <Table bordered hover className="tb_responsive_mb">
                        <thead>
                            < tr >
                                {
                                    model.map((e, i) =>
                                        <th key={i}>{e.text}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rowData.map((row, ri) =>
                                    <tr key={ri}>
                                        {model.map((cell, ci) => {
                                            if (ci === 0)
                                                return <td key={ci}>{ri + 1 + (filterObject.page - 1) * filterObject.page_size}</td>
                                            else if (cell.field) {
                                                if (cell.isDataBool)
                                                    return <td key={ci}>{row[cell.field] ? 'có' : 'không'}</td>
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
                    <PaginationPage totalElement={totalElement} changePage={(e) => pageChange(e)} />
                </CardBody>
            </Card>
            {
                isOpenModal && <DMModal close={closeModal} item={itemEdit} />
            }
        </div>
    )
}

export default DM;