import React, { useState, useEffect } from 'react';
import PaginationPage from '../elements/Pagination';
import model from '../../constants/table-model/qlnd';
import { filterObject, ROLES } from '../../constants/common';
import * as api from '../../services/qlnd';
import { toast } from 'react-toastify';
import QLNDModal from '../modals/qlnd-modal';
import RPWModal from '../modals/rpw-modal';
import swal from 'sweetalert';
import { showLoad, hideLoad } from "../../constants/loading";
import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
    Table,
} from 'reactstrap';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const QLND = () => {

    const [totalElement, setTotalElement] = useState(0);
    const [rowData, setRowData] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [isResetPass, setResetPass] = useState(false);
    const [idReset, setIdReset] = useState(null);

    const userInfo = cookies.get("userInfo");

    useEffect(() => {
        search();
    }, []);

    const deleteItem = (id) => {
        swal({
            title: "Bạn có chắc?",
            text: "Muốn xóa người dùng này không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa người dùng thành công.");
                            search();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa người dùng thất bại.");
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
            userName, phone,
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
    const resetPass = (id) => {
        setResetPass(true);
        setIdReset(id);
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Row >
                        <Col md={4}>
                            <Input type="search" placeholder="Tên tài khoản" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </Col>
                        <Col md={4}>
                            <Input type="search" placeholder="Điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                                        {model.map((cell, ci) =>
                                            ci === 0 ?
                                                <td key={ci}>{ri + 1 + (filterObject.page - 1) * filterObject.page_size}</td> :
                                                cell.field ? <td key={ci}>{row[cell.field]}</td> : null
                                        )}
                                        <td style={{ textAlign: 'center' }}>
                                            <Button className="mx-1" size="sm" color="success" onClick={() => editItem(row)} title="sửa"><i className="fa fa-edit"></i></Button>
                                            <Button className="mx-1" size="sm" color="danger" onClick={() => deleteItem(row.id)} title="xóa"><i className="fa fa-trash-o"></i></Button>
                                            {
                                                userInfo && userInfo.role === ROLES.ADMIN &&
                                                <Button className="mx-1" size="sm" color="info" onClick={() => resetPass(row.id)} title="làm mới mật khẩu"><i className="fa fa-retweet"></i></Button>
                                            }
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
                isOpenModal && <QLNDModal close={closeModal} item={itemEdit} />
            }
            {
                isResetPass && <RPWModal close={() => setResetPass(null)} idReset={idReset} />
            }
        </div>
    )
}

export default QLND;