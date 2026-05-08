import { createContext, useState } from 'react'


export const ClassContext = createContext()

export const ClassProvider = ({children}) => {
    const [activeClass, setActiveClass] = useState(null)
    const [allJoinedClass, setAllJoinedClass] = useState(null)
    const [allCreatedClass, setAllCreatedClass] = useState(null)
    const [loading, setLoading] = useState(false)
    const values = {setActiveClass, activeClass, setAllJoinedClass, allJoinedClass, setAllCreatedClass, allCreatedClass, loading, setLoading}

    
    return (
        <ClassContext.Provider value={values}>
            {children}
        </ClassContext.Provider>
    )
}