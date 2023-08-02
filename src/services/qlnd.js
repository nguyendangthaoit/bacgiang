import { APIKit as api } from './baseAPI';


export const search = async (obj) => {
    return await api.get(`/users/search`, { params: obj });
}

export const save = async (obj) => {
    return await api.post(`/users/create`, obj);
}
export const edit = async (obj) => {
    return await api.put(`/users/edit?id=${obj.id}`, obj);
}
export const deleteItem = async (id) => {
    return await api.delete(`/users/delete?id=${id}`);
}
export const getAllRoles = async () => {
    return await api.get(`/users/roles`);
}
export const changePassword = async (obj) => {
    return await api.put(`/users/change-password`, obj);
}
export const resetPassword = async (obj) => {
    return await api.put(`/users/reset-password?id=${obj.id}`, obj);
}