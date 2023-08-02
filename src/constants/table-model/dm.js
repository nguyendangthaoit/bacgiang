const model = [
    { field: 'stt', text: 'Stt', enableFilter: false, enableSort: true },
    { field: 'name', text: 'Tên Danh Mục', enableFilter: false, enableSort: true },
    { field: 'categoryTypeName', text: 'Loại Danh Mục', enableFilter: true, enableSort: true },
    { field: 'description', text: 'Miêu Tả', enableFilter: false, enableSort: true },
    { field: 'default', text: 'Mặc Định', isDataBool: true, enableFilter: false, enableSort: true },
    { field: '', text: 'Hành Động', enableFilter: false, enableSort: true },
]
export default model;