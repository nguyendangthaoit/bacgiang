import { APIKit as api } from './baseAPI';


export const search = async (obj) => {
    return await api.post(`/rollback/search?page=${obj.page}&page_size=${obj.page_size}`, obj);
}

export const quickSearch = async (obj) => {
    return await api.get(`/rollback/quick`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/rollback`, obj);
}

export const edit = async (obj) => {
    return await api.put(`/rollback?id=${obj.id}`, obj);
}

export const importExcel = async (obj) => {
    return await api.post(`/rollback/import`, obj);
}

export const deleteItem = async (id) => {
    return await api.delete(`/rollback?ids=${id}`);
}

export const editMul = async (ids, obj) => {
    return await api.put(`/rollback/edit?ids=${ids}`, obj);
}

export const fieldSearch = async (obj) => {
    return await api.get(`/rollback/field`, { params: obj });
}

export const agencyLevel = async (obj) => {
    return await api.get(`/rollback/agency-level`, { params: obj });
}

