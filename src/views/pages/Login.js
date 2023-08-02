import React, { useState, useEffect} from 'react';
import '../../assets/css/style.scss';
import '../../assets/css/family.scss';
import logo from '../../assets/images/bg-logo.svg';
import * as api from '../../services/baseAPI';
import { Redirect } from 'react-router-dom';

import {
    UncontrolledAlert,
  } from 'reactstrap';

  import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Login(props){

    const useFormInput = initialValue => {
        const [value, setValue] = useState(initialValue);
       
        const handleChange = e => {
          setValue(e.target.value);
        }
        return {
          value,
          onChange: handleChange
        }
    }

    const username = useFormInput('');
    const password = useFormInput(''); 
    const [loggedIn, setLogin] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(true);
    const onDismiss = () => { setVisible(false); setError(''); };
    
    useEffect(() => {
        const token = cookies.get("token");
        if(token)
            setLogin(true);
    });

    const handleLogin = async () => {
        const payload = {
            userName: username.value,
            password: password.value
        }

        const rs = await api.login(payload, setError);
        setLogin(rs);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
      }

    if(loggedIn)
        return <Redirect to="/home" />
    else
        return (
            <div className="container-fluid conya p-0">
                <div className="side-left">
                    <div className="sid-layy">
                        <div className="row slid-roo">
                            <div className="data-portion">
                                <h2>BG Manage - Quản lý hồ sơ</h2>
                                <p>Mô tả về hệ thống BG manage</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="side-right">
                    <img className="logo mb-3" src={logo} alt="" width="40" height="40"/>
                    
                    <h4 className="mb-5 text-capitalize" style={{color: '#74a1e4'}}>Ứng dụng quản lý công văn</h4>
                    
                    <div className="form-row">
                        <label htmlFor="">Tên đăng nhập</label>
                        <input type="text" {...username} placeholder="Nhập tên đăng nhập" className="form-control form-control-sm" onKeyDown={handleKeyDown}/>
                    </div>
                    
                    <div className="form-row">
                        <label htmlFor="">Mật khẩu</label>
                        <input type="password" {...password} placeholder="Nhập mật khẩu" className="form-control form-control-sm" onKeyDown={handleKeyDown}/>
                    </div>
                    
                    <div className="form-row row skjh">
                        <div className="col-12 pull-right">
                            <span> <a href="#">Quên mật khẩu ?</a></span>
                        </div>
                    </div>

                    <div className="form-row dfr">
                        <button className="btn btn-sm btn-success" onClick={handleLogin}>Đăng nhập</button>
                    </div>

                    {
                        error ? 
                        (
                            <UncontrolledAlert color="danger" toggle={onDismiss}>
                                {error}
                            </UncontrolledAlert>
                        ) : ''
                    }
                    
                    <div className="form-row copyco">
                        <h6 style={{ color: '#74a1e4' }}>Copyright 2020 @ARS</h6> 
                    </div>
                </div>

            </div>   
        )
}


export default Login;