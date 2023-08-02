import React, { useState, useEffect } from 'react';
import PaginationPage from '../../elements/Pagination';
import model from '../../../constants/table-model/ldm';
import { filterObject, PAGE_NUM_DEFAULT } from '../../../constants/common';
import * as api from '../../../services/ldm';
import { toast } from 'react-toastify';
import LDMModal from '../../modals/ldm-modal';
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
const LDM = () => {

    const [rowData, setRowData] = useState([]);
    const [rowDataTemp, setRowDataTemp] = useState([]);
    const [rowDataSource, setrowDataSource] = useState([]);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);

    useEffect(() => {
        getAll();
    }, []);
    const getAll = () => {
        showLoad();
        filterObject.page = PAGE_NUM_DEFAULT;
        api.getAll().then(res => {
            hideLoad();
            if (res.data.code == 1) {
                setrowDataSource(res.data.data)
                setRowDataTemp(res.data.data);
                getDataPaging(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lấy dữ liệu thất bại.");
            hideLoad();
            console.log(error);
        });
    }

    const deleteItem = (id) => {
        swal({
            title: "Bạn có chắc?",
            text: "Muốn xóa loại danh mục này không.",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then((res) => {
                if (res) {
                    api.deleteItem(id).then(res => {
                        if (res.data.code == 1) {
                            toast.success("Xóa thành công.");
                            getAll();
                        } else
                            toast.warning(res.data.message);
                    }).catch((error) => {
                        toast.warning("Xóa thất bại.");
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
    const onChange = (e) => {
        let data = [...rowDataSource];
        if (e.target.value)
            data = data.filter(x => x.code.includes(e.target.value) || x.name.includes(e.target.value));

        setRowDataTemp(data);
        getDataPaging(data);
    }
    const pageChange = (e) => {
        if (filterObject.page !== e) {
            filterObject.page = e;
            getDataPaging();
        }
    }
    const getDataPaging = (rowDataTempT = rowDataTemp) => {
        const data = rowDataTempT.slice((filterObject.page - 1) * filterObject.page_size,
            (filterObject.page - 1) * filterObject.page_size + filterObject.page_size);
        setRowData(data);
    }
    const closeModal = (e) => {
        setOpenModal(false);
        getAll();
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Row >
                        <Col md={6}>
                            <Input type="search" placeholder="Gõ tìm kiếm nhanh:" onChange={(e) => onChange(e)} />
                        </Col>
                        <Col md={6}>
                            <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
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
                                            {/* <Button className="mx-1" size="sm" color="danger" onClick={() => deleteItem(row.code)} title="xóa"><i className="fa fa-trash-o"></i></Button> */}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table >
                    <PaginationPage totalElement={rowDataTemp.length} changePage={(e) => pageChange(e)} />
                </CardBody>
            </Card>
            {
                isOpenModal && <LDMModal close={closeModal} item={itemEdit} />
            }
        </div>
    )
}

export default LDM;