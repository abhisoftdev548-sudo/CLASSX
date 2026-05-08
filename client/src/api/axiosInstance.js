import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

axiosInstance.interceptors.request.use(
    
    (config) => {
        console.log('axios instance request config', config);
        return config;
    },
    (error) => {
        console.log('axios instance request error', error);
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('axios instance response', response);
        return response;
    },
   async (error) => {
        console.log('axios instance response error', error);
        const originalRequest = error.config;

        // Skip if no response (network error) or if already retried
        if(!error.response || originalRequest._retry){
            return Promise.reject(error);
        }

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                // Use raw axios to avoid interceptor loop
               await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/rotate-token`, {
                   withCredentials: true
               });
               return axiosInstance(originalRequest);

            }catch(rotationError){
                console.log('axios instance token rotation error', rotationError);
                return Promise.reject(rotationError);
            }
        }
        
        return Promise.reject(error);
    }
)