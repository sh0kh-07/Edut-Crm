import { $api } from "../Headers"

class CostCategoryApi {
    static Create = async (data) => {
        const response = await $api.post(`/cost-category`, data)
        return response;
    }
    static Get = async (id) => {
        const response = await $api.get(`/cost-category/${id}`)
        return response;
    }
        static GetAll = async (school_id) => {
        const response = await $api.get(`/cost-category/${school_id}`);
        return response;
    }
    static Delete = async (data) => {
        const response = await $api.delete(`/cost-category/${data?.school_id}/${data?.id}`)
        return response;
    }
    
    static Edit = async (id, school_id, data) => {
        const response = await $api.put(`/cost-category/${school_id}/${id}`, data)
        return response;
    }
} export { CostCategoryApi }