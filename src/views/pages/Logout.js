import React from 'react';
import { Redirect } from 'react-router-dom';
import * as api from '../../services/baseAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Logout(props) {
    cookies.remove('token');
    cookies.remove('expireTime');
    cookies.remove('userInfo');
    return (
        <Redirect to="/login" />
    )
}

export default Logout;