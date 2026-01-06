import { $api } from "../Headers"

class User {
    static CreateUser = async (data) => {
        const response = await $api.post(`/user`, data)
        return response;
    }
    static GetUsers = async () => {
        const response = await $api.get(`/user`)
        return response;
    }

    static GetUser = async (id) => {
        const response = await $api.get(`/user/${id}`)
        return response;
    }
    static DeleteUser = async (id) => {
        const response = await $api.delete(`/user/${id}`)
        return response;
    }
} export { User }