import { APIKit as api } from './baseAPI';

export const searchAllocationPhase = async (obj) => {
    return await api.post(`/allocation-phase/search?page=${obj.page}&page_size=${obj.page_size}`, obj);
}

export const quickSearch = async (obj) => {
    return await api.get(`/allocation-phase/quick`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/allocation-phase`, obj);
}

export const edit = async (obj) => {
    return await api.put(`/allocation-phase?id=${obj.id}`, obj);
}

export const importExcel = async (obj) => {
    return await api.post(`/allocation-phase/import`, obj);
}

export const deleteItem = async (id) => {
    return await api.delete(`/allocation-phase?ids=${id}`);
}

export const editMul = async (ids, obj) => {
    return await api.put(`/allocation-phase/edit?ids=${ids}`, obj);
}

export const fieldSearch = async (obj) => {
    return await api.get(`/allocation-phase/field`, { params: obj });
}