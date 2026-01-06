import { $api } from "../Headers"

class RoomApi {

    static Create = async (data) => {
        const response = await $api.post(`/room`, data)
        return response;
    }

    static Get = async (id) => {
        const response = await $api.get(`/room/all/${id}`)
        return response;
    }

    static Delete = async (id) => {
        const response = await $api.delete(`/room/${id}`)
        return response;
    }

    static Edit = async (id, data) => {
        const response = await $api.put(`/room/${id}`, data)
        return response;
    }

} export { RoomApi }