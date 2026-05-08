

export const apiHandler = async (promise) => {
    try{
        const response = await promise;
        console.log("api handler response", response);
        return {response: response.data, error: null}
    }catch(error){
        const message = error.response?.data?.message || error.message || 'An unexpected error occured'
        console.log("api handler error", message);
        return {response: null, error: message}
    }
}
