import { APIKit as api } from './baseAPI';

export const importExcel = async (obj) => {
    return await api.post(`/allocation-phase/import`, obj);
}
