export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_NUM_DEFAULT = 1;
export const CATEGORIES = {
    PROVINCE: 'PROVINCE',
    DISTRICT: 'DISTRICT',
    AGENCYLEVELMINISTRY: 'AGENCYLEVELMINISTRY',
    SUPERIORAGENCY: 'SUPERIORAGENCY',
    AGENCYISSUED: 'AGENCYISSUED',
    DOCUMENTSTATUS: 'DOCUMENTSTATUS',
    REQUESTTYPE: 'REQUESTTYPE',
    ROLLBACKDEVICESTATUS: 'ROLLBACKDEVICESTATUS',
    AGENCYLEVEL1: 'AGENCYLEVEL1',
    AGENCYLEVEL2: 'AGENCYLEVEL2',
    AGENCYLEVEL3: 'AGENCYLEVEL3',
    AGENCYLEVEL4: 'AGENCYLEVEL4',
    DOCUMENTTYPE: 'DOCUMENTTYPE',
    CTSTYPE: 'CTSTYPE',
    TBLKTYPE: 'TBLKTYPE',
    TDTTSTATUS: 'TDTTSTATUS',
    ROLLBACKCTSSTATUS: 'ROLLBACKCTSSTATUS',
    EXTENDSTATUS: 'EXTENDSTATUS'
}
export const filterObject = {
    page: PAGE_NUM_DEFAULT,
    page_size: PAGE_SIZE_DEFAULT
}
export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
}
export const MESSAGESERR = {
    field_required: 'Bạn không được để trống.',
    passW_required: 'Mật khẩu phải có ít nhất 6 kí tự, trong đó ít nhất có 1 hoa, 1 thường , 1 số và 1 kí tự đặc biệt',
    passW_confirm_wrong: 'Mật khẩu xác nhận không đúng',
    email_required: 'Email nhập không đúng định dạng (vd: a@gmail.com)',
}
export const CTS_TABS = [
    { tab: '1', name: 'Vòng đời CTS' },
    { tab: '2', name: 'Thông tin mở rộng' }
]