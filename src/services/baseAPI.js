import axios from 'axios';
import { toast } from 'react-toastify';
import noUserIcon from '../assets/images/no-user-icon.png';
import Cookies from 'universal-cookie';

// Create axios client, pre-configured with baseURL
const cookies = new Cookies();
export let APIKit = axios.create({
    baseURL: process.env.REACT_APP_BASE_API,
    timeout: 30000,
    validateStatus: (status) => {
        // ignore api exception status
        return true;
    }
});

// Set Session Token in Client to be included in all calls
const setClientToken = token => {
    if (token) {
        APIKit.interceptors.request.use(function (config) {
            config.headers.authorization = `Bearer ${token}`;
            return config;
        });
    }
};

const _token = cookies.get('token');
if(_token) {
    setClientToken(_token);
}

export const login = async (payload, callback) => {
    let result = false;
    await APIKit.post('login', payload)
        .then((res) => {
            const code = res.data.code;
            const message = res.data.message;
            if (code && code !== 1) {
                // false case
                if (callback && typeof callback === 'function') {
                    callback(message);
                }
                result = false;
            }

            const token = res.data.data.token;
            const expireTime = res.data.data.expiredTime;

            cookies.set('token', token);
            cookies.set('expireTime', expireTime);
            res.data.data.userInfo.avatar = res.data.data.userInfo.avatar ? res.data.data.userInfo.avatar : noUserIcon
            cookies.set('userInfo', JSON.stringify(res.data.data.userInfo));

            // localStorage.setItem("token", token);
            // localStorage.setItem("expireTime", expireTime);
            // res.data.data.userInfo.avatar = res.data.data.userInfo.avatar ? res.data.data.userInfo.avatar : noUserIcon
            // localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));

            if(token)
            {
                setClientToken(token);
            }

            result = true;
        })
        .catch((error) => {
            toast.warning("Lỗi hệ thống, vui lòng liên hệ admin!")
            console.log(error);
            result = false;
        })

    return result;
}

export const logout = async () => {
    const token = cookies.get("token");
    await APIKit.delete(`logout?token=${token}`);
    return;
}

export default APIKit;