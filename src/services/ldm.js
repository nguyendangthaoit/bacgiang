import { APIKit as api } from './baseAPI';


export const quickSearch = async (obj) => {
    return await api.get(`/allocation-phase/quick`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/categories/type`, obj);
}

export const deleteItem = async (code ) => {
    return await api.delete(`/categories/type?id=${code}`);
}

export const getAll = async () => {
    return await api.get(`/categories/type`);
}

export const edit = async (obj) => {
    return await api.put(`/categories/type?code=${obj.code}`, obj);
}