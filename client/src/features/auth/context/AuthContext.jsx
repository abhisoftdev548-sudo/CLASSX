import { createContext, useEffect, useRef, useState } from "react";
import { authService } from "../api/authServices";


export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // Prevent multiple simultaneous calls
    const initRef = useRef(false);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(()=>{
        const initAuth = async ()=>{
            if (isFetching || initRef.current) return; // Prevent multiple simultaneous calls
            setIsFetching(true);
            initRef.current = true;

            let retries = 0;
            const maxRetries = 3;
            let error = null;
            let response = null;

            while (retries < maxRetries) {
                try{
                    setLoading(true)
                    const result = await authService.getUser();
                    response = result.response;
                    error = result.error;
                    console.log(response, error);

                    const errorMessage = typeof error === 'string' ? error : String(error || '');
                    const isRateLimit = errorMessage.includes('429');

                    if(error){
                        console.log("error in auth context", error);
                        if (isRateLimit) {
                            console.log("Rate limit detected on auth getUser. Aborting retries.");
                            setIsAuthenticated(false);
                            setUser(null);
                            break;
                        }

                        if (retries < maxRetries - 1) {
                            retries++;
                            const delay = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
                            console.log(`Retrying auth getUser in ${delay}ms... (attempt ${retries + 1}/${maxRetries})`);
                            await sleep(delay);
                            continue;
                        }

                        setIsAuthenticated(false);
                        setUser(null);
                        break;
                    } else if(response){
                        console.log("user set in auth context");
                        setUser(response.data || response);
                        setIsAuthenticated(true);
                        break;
                    } else {
                        console.log("no user data in auth context");
                        setIsAuthenticated(false);
                        setUser(null);
                        break;
                    }
                }catch(err){
                    console.log("error in auth context catch", err);
                    retries++;
                    if (retries < maxRetries) {
                        const delay = Math.pow(2, retries) * 1000;
                        console.log(`Error. Retrying in ${delay}ms... (attempt ${retries + 1}/${maxRetries})`);
                        await sleep(delay);
                    } else {
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                }finally{
                    setLoading(false);
                    if (!isInitialized) {
                        setIsInitialized(true);
                    }
                }
            }
            setIsFetching(false);
        }
        initAuth();
    },[])

    const values = {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isInitialized,
        setIsInitialized,
        loading,
        setLoading
    }
    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}