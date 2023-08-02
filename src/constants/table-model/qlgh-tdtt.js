const model = [
    { field: 'stt', text: 'Stt', enableFilter: false, enableSort: true },
    { field: 'subscription', text: 'Thuê Bao', enableFilter: true, enableSort: true },
    { field: 'ctsCode', text: 'Số Hiệu CTS', enableFilter: true, enableSort: true },
    { field: 'email', text: 'Email', enableFilter: true, enableSort: true },
    { field: 'agencyLevel1', text: 'Tên Cơ Quan Cấp 1', enableFilter: true, enableSort: true },
    { field: 'agencyLevel2', text: 'Tên Cơ Quan Cấp 2', enableFilter: true, enableSort: true },
    { field: 'agencyLevel3', text: 'Tên Cơ Quan Cấp 3', enableFilter: true, enableSort: true },
    { field: 'agencyLevel4', text: 'Tên Cơ Quan Cấp 4', enableFilter: true, enableSort: true },
    { field: 'province', text: 'Tỉnh/Thành', enableFilter: true, enableSort: true },
    { field: 'fileNameInfoChange', text: 'Trường Thông Tin Thay Đổi', enableFilter: true, enableSort: true },
    { field: 'requestType', text: 'Loại Yêu Cầu', enableFilter: true, enableSort: true },
    { field: 'cvRequestCode', text: 'Công CV  Đề Nghị', enableFilter: true, enableSort: true },
    { field: 'cvDateTime', text: 'Ngày CV', enableFilter: true, enableSort: true, type: 'date' },
    { field: 'contact', text: 'Đầu Mối Liên Hệ', enableFilter: true, enableSort: true },
    { field: 'note', text: 'Ghi Chú', enableFilter: true, enableSort: true },
    { field: '', text: 'Hành Động', enableFilter: false, enableSort: true, isHidden: true },
]
export default model;