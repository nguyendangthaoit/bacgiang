import React, { useEffect, useState } from 'react';
import { Button, Col, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import { formatDateDDMMYY, formatStrToDate } from '../../constants/helper';
const FilterHeadTable = (props) => {

    const [keyword, setKeyword] = useState('');

    const renderControl = () => {
        if (props.params.type === 'date')
            return <DatePicker selected={keyword} onChange={value => setKeyword(value)}
                dateFormat="dd/MM/yyyy" className="date_filterHead" placeholderText="Nội dung tìm kiếm" />
        return <Input type="search" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Nội dung tìm kiếm" className="" />

    }
    const search = () => {
        let key = keyword;
        if (props.params.type === 'date')
            key = formatDateDDMMYY(key);
        const obj = {
            keyword: key,
            field: props.params.field
        }
        props.onSearch(obj);
    }
    const close = () => {
        setKeyword('')
        props.onClose();
    }
    return (
        <>
            {
                props.params.enableFilter
                &&
                <div className="btn-group">
                    <i className="fa fa-filter mr-1" aria-hidden="true" data-toggle="dropdown"> </i>
                    <div className="dropdown-menu btn_toggle dropdown-menu_cs">
                        <Col md={12}>
                            {renderControl()}
                        </Col>
                        <Col md={12} className="div_btn_filterHead">
                            <Button color="primary" className="btn-sm" onClick={search}>Tìm</Button>
                            <Button color="secondary" className="btn-sm" onClick={close}>Hủy</Button>
                        </Col>
                    </div>
                </div>
            }
        </>
    )

}
export default FilterHeadTable;
