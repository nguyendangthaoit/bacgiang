import { ROLES } from './constants/common';
export default {
  top: [
    {
      name: 'Trang chủ',
      url: '/home',
      icon: 'Home',
    },
    {
      name: 'Nhập từ Excel',
      url: '/import',
      icon: 'Upload',
    },
    {
      name: 'Quản lý đợt cấp',
      url: '/qldc',
      icon: 'Folder',
    },
    {
      name: 'Quản lý vòng đời cts',
      url: '/qlvdcts',
      icon: 'LifeBuoy',
    },
    {
      name: 'Quản lý thu hồi',
      url: '/qlth',
      icon: 'Archive',
    },
    {
      name: 'Quản lý gia hạn TĐTT',
      url: '/qlghtdtt',
      icon: 'Clock',
    },
    {
      name: 'Danh mục',
      icon: 'List',
      children: [
        {
          name: 'Loại danh mục',
          url: '/danhmuc/ldm',
        },
        {
          name: 'Danh mục',
          url: '/danhmuc/dm',
        }
      ],
    },
    {
      divider: true,
    },
    {
      name: 'Quản lý người dùng',
      url: '/qlnd',
      icon: 'Users',
      role: [ROLES.ADMIN]
    },
  ],
  bottom: [
    {
      name: 'Đăng xuất',
      url: '/logout',
      icon: 'LogOut',

    },
  ],
};
