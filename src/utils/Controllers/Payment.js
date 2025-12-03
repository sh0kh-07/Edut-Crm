import { $api } from "../Headers";

class Payment {
    static GetAll = async () => await $api.get(`/payment`);
    static GetBySchool = async (school_id) => await $api.get(`/payment/${school_id}`);
    static GetByYear = async ({ school_id, year, status, page = 1 }) =>
        await $api.get(`/payment/year/${school_id}/${year}/${status}/page?page=${page}`);

    static Delete = async ({ school_id, id }) =>
        await $api.delete(`/payment/${school_id}/${id}`);
    
    static DeleteByYear = async ({ school_id, year, status, id }) =>
        await $api.delete(`/payment/year/${school_id}/${year}/${status}/page/${id}`);
    
    static EditByYear = async ({ school_id, year, status, id, data }) =>
        await $api.put(`/payment/year/${school_id}/${year}/${status}/page/${id}`, data);

    static Create = async (data) => await $api.post(`/payment`, data);
}

export { Payment };
