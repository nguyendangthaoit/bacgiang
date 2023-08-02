
import { useState, useEffect } from 'react';
import * as api from '../../services/dm';
import { toast } from 'react-toastify';
const useGetAgencyLevel = (type) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getAgencyLevel();
    }, []);

    const getAgencyLevel = () => {
        api.SearchCategories(type).then(res => {
            if (res.data.code === 1) {
                // setData(res.data.data);
                setData(['cơ quan hà nộ', 'cơ quan Hưng yên', 'bộ ngoại giao']);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lấy dữ liệu thất bại.");
        });
    }

    return data;
}
export default useGetAgencyLevel;