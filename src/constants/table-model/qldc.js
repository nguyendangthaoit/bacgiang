const model = [
    { field: 'stt', text: 'Stt', enableFilter: false, enableSort: true },
    { field: 'agencyIssued', text: 'Cơ Quan Ban Hành', enableFilter: true, enableSort: true },
    { field: 'cvNumber', text: 'Số CV', enableFilter: true, enableSort: true },
    { field: 'cvDate', text: 'Ngày CV Đơn Vị', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'requestNumber', text: 'Số Lượng Đề Nghị', enableFilter: true, enableSort: true },
    { field: 'documentType', text: 'Loại Văn Bản', enableFilter: true, enableSort: true },
    { field: 'agencyOwner', text: 'Cơ Quan Chủ Quản', enableFilter: true, enableSort: true },
    { field: 'agencyLevelMinistry', text: 'Cơ Quan Cấp Bộ/Tỉnh/Thành', enableFilter: true, enableSort: true },
    { field: 'province', text: 'Tỉnh/Thành', enableFilter: true, enableSort: true },
    { field: 'requestType', text: 'Loại Yêu Cầu', enableFilter: true, enableSort: true },
    { field: 'createdAt', text: 'Ngày Nhập Đợt Cấp', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'documentStatus', text: 'Trạng Thái Hồ Sơ', enableFilter: true, enableSort: true },
    { field: 'numberAllocated', text: 'Số Lượng Thực Cấp', enableFilter: true, enableSort: true },
    { field: 'cvTakeDate', text: 'Ngày Cục Nhận CV', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'transferProductDate', text: 'Ngày Cục Bàn Giao SP', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'receiveProductDate', text: 'Ngày Đơn Vị Nhận SP', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'timeArriveDepartment', text: 'Thời Gian Văn Bản Đến Cục', enableFilter: false, enableSort: true },
    { field: 'timeDepartmentSxCts', text: 'Thời Gian Cục SX CTS', enableFilter: false, enableSort: true },
    { field: 'timeHandoverProduct', text: 'Thời Gian Bàn Giao SP', enableFilter: false, enableSort: true },
    { field: 'totalTime', text: 'Tổng Thời Gian', enableFilter: false, enableSort: true },
    { field: 'note', text: 'Ghi Chú', enableFilter: true, enableSort: true },
    { field: 'userReceived', text: 'Người Tiếp Nhận', enableFilter: true, enableSort: true },
    { field: '', text: 'Hành Động', enableFilter: false, enableSort: true, isHidden: true },
]
export default model;