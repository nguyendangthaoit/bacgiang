
import ErrorPage from './pages/404';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import QLDC from './pages/qldc';
import CQBH from './pages/danhmuc/CQBH';
import QLVDCTS from './pages/qlvdcts';
import LDM from './pages/danhmuc/ldm';
import DM from './pages/danhmuc/dm';
import QLND from './pages/qlnd';
import QLTH from './pages/qlth';
import QLGHTDTT from './pages/qlgh-tdtt';
import IMPORT from './pages/import';
// See React Router documentation for details: https://reacttraining.com/react-router/web/api/Route
const pageList = [
  {
    name: 'Bảng tin',
    path: '/home',
    component: Dashboard,
  },
  {
    name: 'Nhập từ Excel',
    path: '/import',
    component: IMPORT,
  },
  {
    name: 'Quản lý đợt cấp',
    path: '/qldc',
    component: QLDC,
  },
  {
    name: 'Quản lý vòng đời cts',
    path: '/qlvdcts',
    component: QLVDCTS,
  },
  {
    name: 'Quản lý thu hồi',
    path: '/qlth',
    component: QLTH,
  },
  {
    name: 'Quản lý gia hạn TĐTT',
    path: '/qlghtdtt',
    component: QLGHTDTT,
  },
  {
    name: 'Quản lý người dùng',
    path: '/qlnd',
    component: QLND,
  },
  {
    name: 'Đăng xuất',
    path: '/logout',
    component: Logout,
  },
  {
    name: 'Cơ quan ban hành',
    path: '/danhmuc/cqbh',
    component: CQBH,
  },
  {
    name: 'Loại danh mục',
    path: '/danhmuc/ldm',
    component: LDM,
  },
  {
    name: 'Danh mục',
    path: '/danhmuc/dm',
    component: DM,
  },
  {
    name: 'Không tìm thấy',
    component: Dashboard,
  }
];

export default pageList;
