import { useContext } from "react"
import { ClassContext } from "../context/ClassContext"
import {classService} from '../api/classServices'

const useClass = () => {
    
    const context = useContext(ClassContext)
    if(!context) throw new Error('useClass must be used within a ClassProvider')

        
        const {setActiveClass, activeClass, setAllJoinedClass, allJoinedClass, setAllCreatedClass, allCreatedClass, loading, setLoading} = context;
  
        const getAllClasses = async ({category}) => {
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
   
        }

        const getActiveClass = async (enrollmentId) => {
            try{
                setLoading(true)
                const response = await classService.getClass(enrollmentId);
                const enrollment = response?.response?.data;
                setActiveClass(enrollment);
                console.log(response)
                console.log(activeClass)
            }catch(error){
                throw new Error(error)
            }finally{
                setLoading(false)
            }
        }
        return {
            setActiveClass, activeClass, setAllJoinedClass, allJoinedClass, setAllCreatedClass, allCreatedClass, loading, setLoading, getAllClasses, getActiveClass
        }
}

export default useClass;