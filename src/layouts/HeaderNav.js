import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Avatar } from '../bg';
import CPWModal from '../views/modals/cpw-modal';
import InforModal from '../views/modals/infor-modal';
import InforEditModal from '../views/modals/infor-edit-modal'
import { Redirect, NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const HeaderNav = () => {
    const [isOpenModal, setOpenModal] = useState(false);
    const [isInforModal, setInforModal] = useState(false);
    const [isInforEditModal, setInforEditModal] = useState(false);
    const userInfo = cookies.get("userInfo");

    const changePass = async () => { setOpenModal(true) }
    const viewInfor = async () => { setInforModal(true) }
    const closeModal = () => { setOpenModal(false); }
    const closeInforModal = () => { setInforModal(false); }
    const editInfor = () => {
        setInforModal(false);
        setInforEditModal(true);
    }
    const closeInforEditModal = () => {
        setInforModal(true);
        setInforEditModal(false);
    }

    const logout = () => {
        return <NavLink to='/logout' activeClassName="active"><DropdownItem>Đăng xuất</DropdownItem></NavLink>
    }

    return (
        <React.Fragment>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>
                    {userInfo && <Avatar size="small" color="white" initials="JS" image={userInfo.avatar} />}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={viewInfor}>Thông tin cá nhân</DropdownItem>
                    <DropdownItem onClick={changePass}>Đổi mật khẩu</DropdownItem>
                    <DropdownItem divider />
                    {logout()}
                </DropdownMenu>
            </UncontrolledDropdown>
            {
                isOpenModal && <CPWModal close={closeModal} />
            }
            {
                isInforModal && <InforModal close={closeInforModal} editInfor={editInfor} />
            }
            {
                isInforEditModal && <InforEditModal close={closeInforEditModal} />
            }
        </React.Fragment>
    );
}
export default HeaderNav;