import { $api } from "../Headers";

class CostApi {
    static Create = async (data) => {
        return await $api.post(`/cost`, data);
    };

    static Get = async ({ school_id, page }) => {
        return await $api.get(`/cost/${school_id}/page?page=${page}`);
    };
   static GetPagination = async ({ school_id, year, month, page = 1 }) => {
    const response = await $api.get(`/cost/${school_id}/${year}/${month}/page?page=${page}`);
    return response;
};

    static GetById = async ({ school_id, id }) => {
        return await $api.get(`/cost/${school_id}/${id}`);
    };

    static Edit = async (school_id, id, data) => {
        return await $api.put(`/cost/${school_id}/${id}`, data);
    };

    static Delete = async ({ school_id, id }) => {
        return await $api.delete(`/cost/${school_id}/${id}`);
    };
}

export { CostApi };
