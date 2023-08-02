import React from 'react';
import { formatDateDDMMYY } from '../../constants/helper';
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportExcel = (props) => {
    const data = props.data.map((e, i) => {
        e['stt'] = i + 1;
        return e;
    })
    const model = props.model.filter(x => x.field);
    return (
        <ExcelFile filename={props.name + '_' + formatDateDDMMYY(new Date())}
            element={<a className="dropdown-item" ><i className="fa fa-download" aria-hidden="true"></i>&nbsp; Xuất file excel</a>}
        >
            <ExcelSheet data={data} name={props.name}>
                {
                    model.map((e, i) =>
                        <ExcelColumn key={i} label={e.text} value={e.field} />
                    )
                }
            </ExcelSheet>
        </ExcelFile>
    )
}
export default ExportExcel;