import { APIKit as api } from './baseAPI';


export const search = async (obj) => {
    return await api.post(`/extent/search?page=${obj.page}&page_size=${obj.page_size}`, obj);
}

export const quickSearch = async (obj) => {
    return await api.get(`/extent/quick`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/extent`, obj);
}

export const edit = async (obj) => {
    return await api.put(`/extent?id=${obj.id}`, obj);
}

export const importExcel = async (obj) => {
    return await api.post(`/extent/import`, obj);
}

export const deleteItem = async (id) => {
    return await api.delete(`/extent?ids=${id}`);
}

export const editMul = async (ids, obj) => {
    return await api.put(`/extent/edit?ids=${ids}`, obj);
}

export const fieldSearch = async (obj) => {
    return await api.get(`/extent/field`, { params: obj });
}

export const agencyLevel = async (obj) => {
    return await api.get(`/extent/agency-level`, { params: obj });
}

