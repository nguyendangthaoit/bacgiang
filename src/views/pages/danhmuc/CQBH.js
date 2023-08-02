import React, { useState, useEffect } from 'react';

import {
    Button,
    Input,
    Card,
    CardBody,
    Row,
    Col,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

const CQBH = () => {

    const data_mock = [
        { id: 1, name: 'Name 1', note: 'Chú ý 1' },
        { id: 2, name: 'Name 2', note: 'Chú ý 2' },
        { id: 3, name: 'Name 3', note: 'Chú ý 3' },
        { id: 4, name: 'Name 4', note: 'Chú ý 4' }
    ]

    const [data, setData] = useState(data_mock);
    const [isOpenModal, setOpenModal] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);

    const deleteItem = (id) => {
        return;
    }

    const editItem = (item) => {
        return;
    }

    const addNew = () => {
        setOpenModal(true);
    }

    const onChange = () => {

    }

    const modal = (props) => {
        const save = () => {

        }

        return (
            <Modal isOpen={props.modal} toggle={() => props.close()} className="modal-lg">
                <ModalHeader toggle={() => props.close()}>{props.item ? 'Cập nhật' : 'Thêm mới'}</ModalHeader>
                <ModalBody>
                    <Row >
                        {/* <Col md={6}>
                        <FormGroup>
                            <Label for="agencyIssued">Tên cơ quan</Label>
                            <Input value={agencyIssued} onChange={(e) => setagencyIssued(e.target.value)} type="text" name="agencyIssued" id="agencyIssued" placeholder="Cơ quan ban ngành"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="cvNumber">Mô tả</Label>
                            <Input value={cvNumber} onChange={(e) => setcvNumber(e.target.value)} type="text" name="cvNumber" id="cvNumber" placeholder="Số CV" value={cvNumber.value} />
                        </FormGroup>
                    </Col> */}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={save}>Lưu lại.</Button>
                    <Button color="secondary" onClick={() => props.close()}>Hủy bỏ</Button>
                </ModalFooter>
            </Modal>
        )
    }

    return (

        <div>
            <Card>
                <CardBody>
                    <Row className="px-3">
                        <Col xs={6}>
                            <Input type="search" placeholder="Tìm kiếm nhanh:" onChange={(e) => onChange(e)} />
                        </Col>
                        <Col xs={6}>
                            <div className="d-flex flex-row-reverse">
                                <Button className="mx-1" outline color="primary" onClick={addNew} ><i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp; Thêm mới</Button>
                            </div>
                        </Col>
                    </Row>

                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <Row className="p-3">
                        <Table hover responsive striped>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th style={{ textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item, ri) =>
                                        <tr key={ri}>
                                            <td>{item.name}</td>
                                            <td>{item.note}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button class="btn btn-success ml-1" onClick={() => editItem(item)}><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                                                <button class="btn btn-danger ml-1" onClick={() => deleteItem(item.id)}><i class="fa fa-trash" aria-hidden="true"></i></button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table >
                    </Row>
                    <Row className="px-3 py-1 pull-right">
                        <Pagination className="pull-right" aria-label="Page navigation example">
                            <PaginationItem>
                                <PaginationLink previous href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">4</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">5</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink next href="#" />
                            </PaginationItem>
                        </Pagination>
                    </Row>
                </CardBody>
            </Card>

            {
                isOpenModal ? <Modal /> : ''
            }
        </div>
    )
}

export default CQBH;