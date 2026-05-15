import { useContext, useCallback, useMemo } from "react"
import { ClassContext } from "../context/ClassContext"
import {classService} from '../api/classServices'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
const useClass = () => {
    const navigate = useNavigate();
    const context = useContext(ClassContext)
    if(!context) throw new Error('useClass must be used within a ClassProvider')

        
        const {setActiveClass, activeClass, setAllJoinedClass, allJoinedClass, setAllCreatedClass, allCreatedClass, loading, setLoading} = context;
  
        const createClass = useCallback(async (data) => {
            try{
                setLoading(true)
                const response = await classService.createClass(data);
                const enrollment = response?.response?.data;
                setActiveClass(enrollment);
                setAllCreatedClass((pre)=>[...pre, enrollment]);
                toast.success(response.message);
                navigate(`/class/${enrollment._id}`);
            }catch(error){
                throw new Error(error)
            }finally{
                setLoading(false)
            }
        }, [navigate, setActiveClass, setAllCreatedClass, setLoading])

        const getAllClasses = useCallback(async ({category}) => {
            try{
                setLoading(true)
               if(category !== "created" && category !== "joined") category = "created"

                const response = await classService.getAllClasses(category);
                const enrollment = response?.response?.data;
                category === "created" ? setAllCreatedClass(enrollment) : setAllJoinedClass(enrollment);
  
               
            }catch(error){
                throw new Error(error)
            }finally{
                setLoading(false)
            }
   
        }, [setAllCreatedClass, setAllJoinedClass, setLoading])

        const getActiveClass = useCallback(async (enrollmentId) => {
            try{
                setLoading(true)
                const response = await classService.getClass(enrollmentId);
                const enrollment = response?.response?.data;
                console.log("getActiveClass response", enrollment);
                setActiveClass(enrollment);
            }catch(error){
                console.log("getActiveClass error", error);
                throw new Error(error)
            }finally{
                setLoading(false)
            }
        }, [setActiveClass, setLoading])

        const joinClass = useCallback(async (data) => {
            try{
            setLoading(true)
            const payload = {joiningCode: data.joinCode};
            if (data.branch) {
              payload.branch = data.branch;
            }
            const response = await classService.joinClass(payload);
            const enrollment = response?.response?.data;
            console.log(response)
            console.log("joinClass response", enrollment);
            if (!enrollment) {
                throw new Error("Failed to join class");
            }
            setAllJoinedClass((pre)=>[...pre, enrollment]);
            setActiveClass(enrollment);
            toast.success(response?.response?.message);
            navigate(`/class/${enrollment._id}`);
                    }catch(error){
            console.log("joinClass error", error);
            toast.error(error.message || "Failed to join class");
            throw new Error(error)
        }finally{

            setLoading(false)
        }
    }, [navigate, setAllJoinedClass, setActiveClass, setLoading])

    const getAllMembers = useCallback(async (classId) => {
        try{
            setLoading(true)
                        const response = await classService.getAllMembers(classId);
            console.log("getAllMembers response", response);
            const members = response?.response?.data;
            return members;
        }catch(error){
            console.log("getAllMembers error", error);
            throw new Error(error)
        }finally{
            setLoading(false)
        }
    }, [setLoading])
        return useMemo(() => ({
            setActiveClass,
            activeClass,
            setAllJoinedClass,
            allJoinedClass,
            setAllCreatedClass,
            allCreatedClass,
            loading,
            setLoading,
            getAllClasses,
            getActiveClass,
            createClass,
            joinClass,
            getAllMembers,
        }), [
            setActiveClass,
            activeClass,
            setAllJoinedClass,
            allJoinedClass,
            setAllCreatedClass,
            allCreatedClass,
            loading,
            setLoading,
            getAllClasses,
            getActiveClass,
            createClass,
            joinClass,
            getAllMembers,
        ])
}

export default useClass;