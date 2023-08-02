
import { useState, useEffect } from 'react';
import * as api from '../../services/dm';
import { toast } from 'react-toastify';
const useGetCategoriesByType = (type) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        SearchCategoriesByType();
    }, []);

    const SearchCategoriesByType = () => {
        api.SearchCategories(type).then(res => {
            if (res.data.code === 1) {
                setData(res.data.data);
            } else
                toast.warning(res.data.message);
        }).catch((error) => {
            toast.warning("Lấy dữ liệu thất bại.");
        });
    }

    return data;
}
export default useGetCategoriesByType;