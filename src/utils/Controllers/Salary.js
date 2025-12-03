import { $api } from "../Headers";

class SalaryApi {
    static GetByMonth = async ({ school_id, year, month, page = 1 }) => {
        const response = await $api.get(
            `/salary/${school_id}/${year}/${month}/page?page=${page}`
        );
        return response;
    };

    static Create = async (data) => {
        const response = await $api.post("/salary", data);
        return response;
    };

    static Update = async ({ school_id, id, data }) => {
        const response = await $api.put(`/salary/${school_id}/${id}`, data);
        return response;
    };

    static Delete = async ({ school_id, id }) => {
        const response = await $api.delete(`/salary/${school_id}/${id}`);
        return response;
    };
}

export { SalaryApi };
