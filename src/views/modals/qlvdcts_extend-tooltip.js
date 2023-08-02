import React from 'react';
import { CardBody, Row, Col, FormGroup, Label } from 'reactstrap';
import ToolTip from 'react-portal-tooltip'

const QLVDCTSEXTDTooltip = (props) => {

    return (
        <ToolTip active={true} position="right" arrow="center" parent={`#${props.extendInfo.parentId}`}>
            <CardBody>
                <Row >
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Tên thuê bao:</Label>
                            <Label md={12} >{props.extendInfo.name}</Label>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Ngày sinh:</Label>
                            <Label md={12} >{props.extendInfo.birdDay}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row >
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Số CMT/CCCD/Hộ chiếu:</Label>
                            <Label md={12} >{props.extendInfo.id}</Label>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Ngày cấp:</Label>
                            <Label md={12} >{props.extendInfo.idDate}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row >
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Nơi cấp:</Label>
                            <Label md={12} >{props.extendInfo.idProvince }</Label>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Số Điện thoại:</Label>
                            <Label md={12} >{props.extendInfo.phoneNumber}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row >
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Công văn đề nghị:</Label>
                            <Label md={12} >{props.extendInfo.documentRequest}</Label>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Cơ quan ban hành:</Label>
                            <Label md={12} >{props.extendInfo.agencyCreated}</Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row >
                    <Col md={6}>
                        <FormGroup className="row formGroup_custom">
                            <Label md={12} className="lable-custom">Ngày ban hành:</Label>
                            <Label md={12} >{props.extendInfo.documentCreatedAt}</Label>
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>
        </ToolTip>
    );
}
export default QLVDCTSEXTDTooltip;
