import { APIKit as api } from './baseAPI';


export const quickSearch = async (obj) => {
    return await api.get(`/categories/quick-search`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/categories`, obj);
}
export const edit = async (obj) => {
    return await api.put(`/categories?id=${obj.id}`, obj);
}
export const deleteItem = async (id) => {
    return await api.delete(`/categories?id=${id}`);
}
export const getAll = async (obj) => {
    return await api.get(`/categories`, { params: obj });
}
export const SearchCategories = async (type) => {
    return await api.get(`/categories/search-type?type=${type}&isSearchDefault=false`);
}
