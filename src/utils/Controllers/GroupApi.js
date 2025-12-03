import { $api } from "../Headers"

class GroupApi {
    static Create = async (data) => {
        const response = await $api.post(`/group`, data)
        return response;
    }
    static GetAll = async (id) => {
        const response = await $api.get(`/group/${id}`)
        return response;
    }
    static Get = async (data) => {
        const response = await $api.get(`/group/${data?.school_id}/page?page=${data?.page}`)
        return response;
    }
    static GetById = async (data) => {
        const response = await $api.get(`/group/${data?.school_id}/${data?.id}/payment`)
        return response;
    }
    static Delete = async (data) => {
        const response = await $api.delete(`/group/${data?.school_id}/${data?.id}`)
        return response;
    }
    static Edit = async (school_id, id, data) => {
        const response = await $api.put(`/group/${school_id}/${id}`, data)
        return response;
    }
    static Add = async (data) => {
        const response = await $api.post(`/student-group`, data)
        return response;
    }
    static AddTeacher = async (data) => {
        const response = await $api.post(`/employee-group`, data)
        return response;
    }
    static AddSubject = async (data) => {
        const response = await $api.post(`/employee-subject`, data)
        return response;
    }
    static DeleteSubject = async (id) => {
        const response = await $api.delete(`/employee-subject/${id}`)
        return response;
    }

} export { GroupApi }