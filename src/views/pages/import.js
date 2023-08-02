import React, { useEffect, useState } from 'react';
import {
    Card, CardBody, Row, Label, Col
} from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import * as api from '../../services/import';
import { toast } from 'react-toastify';
import QLVD from '../../assets/images/432446.svg';
import QLDC from '../../assets/images/432435.svg';
import { NavLink } from 'react-router-dom';
import { showLoad, hideLoad } from "../../constants/loading";
const IMPORT = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });

    // const [message, setMessage] = useState('Xin mời nhập file.');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            handleImport(acceptedFiles);
        }
    }, [acceptedFiles]);

    const handleImport = (files) => {
        showLoad();
        const formData = new FormData();
        // Update the formData object 
        // formData.append("file", { ...file });
        files.map(f => formData.append("file", f));
        api.importExcel(formData)
            .then(res => {
                hideLoad();
                const code = res.data.code;
                const data = res.data.data;
                setMessage({ code, data });
                if (data.every(x => x.success))
                    toast.success("Nhập từ Excel thành công.");
                else {
                    if (code == 2) {
                        const message = res.data.message;
                        setMessage({ code, message });
                    }
                    toast.warning('Nhập file thất bại');
                }
            }).catch((error) => {
                setMessage("Có lỗi khi thực hiện", error);
                hideLoad();
            });
    }
    const _functions = [
        {
            name: "Quản lý đợt cấp",
            desc: "Hỗ trợ quản lý đợt cấp",
            icon: QLDC,
            path: "/qldc"
        },
        {
            name: "Quản lý vòng đời CTS",
            desc: "Hỗ trợ quản lý vòng đời chứng thư số",
            icon: QLVD,
            path: "/qlvdcts"
        }
    ]
    const panel = () => {
        return (
            _functions.map((item, i) => {
                return (
                    <Col md={6} key={i}>
                        <NavLink to={item.path}>
                            <Card>
                                <CardBody className="display-flex">
                                    <img
                                        src={item.icon}
                                        style={{ width: 70, height: 70, padding: '.5rem' }}
                                        alt="react.js"
                                        aria-hidden={true}
                                    />
                                    <div className="m-l">
                                        <h2 className="h4">{item.name}</h2>
                                        <p className="text-muted">
                                            {item.desc}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </NavLink>
                    </Col>
                )
            })
        )
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <Row>
                        <section className="col-12">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p>Kéo thả file vào đây hoặc bấm để chọn.</p>
                            </div>
                        </section>

                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row>
                        <Col md={12} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <Label>Thông báo:</Label>
                            {
                                !message ? 'Xin mời nhập file.' :
                                    (message.code == 1 && message.data) ?
                                        (
                                            message.data.map((m, k) => {
                                                if (m.success) return (
                                                    <div className="alert alert-primary" role="alert" key={k}>
                                                        Nhập file {m.fileName} thành công
                                                    </div>
                                                )
                                                else return (
                                                    <div className="alert alert-warning" role="alert">
                                                        <h5 className="alert-heading">Nhập file {m.fileName} thất bại.</h5>
                                                        <p>{m.reason}</p>
                                                        {
                                                            m.warningData && m.warningData !== [] &&
                                                            (
                                                                <hr /> &&
                                                                m.warningData.map((x, i) =>
                                                                    <p key={i}>{x}</p>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })
                                        )
                                        :
                                        (
                                            <div className="alert alert-danger" role="alert">
                                                <h4 className="alert-heading">Lỗi!</h4>
                                                <p>{message.message}</p>
                                            </div>
                                        )
                            }
                        </Col>

                    </Row>
                    <br />
                    <Row>
                        {panel()}
                    </Row>
                </CardBody>
            </Card>

        </div >
    )
}

export default IMPORT;