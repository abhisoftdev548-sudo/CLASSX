import { apiHandler } from "../../../api/apiHandler"
import { axiosInstance } from "../../../api/axiosInstance"


export const classService = {

    createClass: (data) => {
        return apiHandler(axiosInstance.post('/class/create-class', data))
    },

    getAllClasses: async (category) => {
        return await apiHandler(axiosInstance.get(`/class/get-all-classes?category=${category? category: "created"}`))
    },

    getClass: (enrollmentId) => {
        return apiHandler(axiosInstance.get(`/class/get-class/${enrollmentId}`))
    },

    joinClass: (data) => {
        return apiHandler(axiosInstance.post('/class/join-class', data))
    },

    getAllMembers: (classId) => {
        return apiHandler(axiosInstance.get(`/class/get-all-members?classId=${classId}`))
    },

    getAllStudents: (branch) => {
        return apiHandler(axiosInstance.get(`/class/get-all-students?branch=${branch || ''}`))
    }
}