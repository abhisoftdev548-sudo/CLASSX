import { apiHandler } from "../../../api/apiHandler"
import { axiosInstance } from "../../../api/axiosInstance"


export const classService = {

    create: (data) => {
        return apiHandler(axiosInstance.post('/class/create-class', data))
    },

    getAllClasses: async (category) => {
        return await apiHandler(axiosInstance.get(`/class/get-all-classes?category=${category? category: "created"}`))
    },

    getClass: (enrollmentId) => {
        return apiHandler(axiosInstance.get(`/class/get-class/${enrollmentId}`))
    }
}