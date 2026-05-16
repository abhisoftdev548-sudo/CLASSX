import { apiHandler } from './apiHandler'
import { axiosInstance } from './axiosInstance'

export const debugApi = {
  getCookies: () => {
    return apiHandler(axiosInstance.get('/debug/cookies'))
  }
}
