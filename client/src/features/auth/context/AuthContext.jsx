import { createContext, useEffect, useState } from "react";
import { authService } from "../api/authServices";


export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const initAuth = async ()=>{
            try{
                setLoading(true)
                const {response, error} = await authService.getUser();
                console.log('AuthContext - API Response:', {response, error});
                
                if(error){
                    console.log('AuthContext - Error in getUser:', error);
                    setIsAuthenticated(false);
                    setUser(null);
                } else if(response?.data){
                    console.log('AuthContext - User data received:', response.data);
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    console.log('AuthContext - No response data found');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }catch(err){
                console.log('AuthContext - Unexpected error:', err);
                setIsAuthenticated(false);
                setUser(null);
            }finally{
                setLoading(false);
                setIsInitialized(true); // Always set initialized
            }
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