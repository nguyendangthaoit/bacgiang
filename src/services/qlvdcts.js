import { APIKit as api } from './baseAPI';
import * as constants from '../constants/common';



export const search = async (obj) => {
    return await api.post(`/cts/search?page=${obj.page}&page_size=${obj.page_size}`, obj);
}

export const quickSearch = async (obj) => {
    return await api.get(`/cts/quick`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/cts`, obj);
}

export const edit = async (obj) => {
    return await api.put(`/cts?id=${obj.id}`, obj);
}

export const importExcel = async (obj) => {
    return await api.post(`/cts/edit/import`, obj);
}

export const deleteItem = async (id) => {
    return await api.delete(`/cts?ids=${id}`);
}

export const SearchCategories = async (type) => {
    return await api.get(`/categories/search-type?type=${type}&isSearchDefault=false`);
}

export const editExtend = async (idCts, obj) => {
    return await api.put(`/cts/extent?id=${idCts}`, obj);
}

export const editMul = async (ids, obj) => {
    return await api.put(`/cts/edit?ids=${ids}`, obj);
}

export const fieldSearch = async (obj) => {
    return await api.get(`/cts/field`, { params: obj });
}

export const agencyLevel = async (obj) => {
    return await api.get(`/cts/agency-level`, { params: obj });
}
