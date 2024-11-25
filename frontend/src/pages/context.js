import React, { createContext, useState } from 'react';

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
    const [classroomData, setClassroomData] = useState({});

    return (
        <ClassroomContext.Provider value={{ classroomData, setClassroomData }}>
            {children}
        </ClassroomContext.Provider>
    );
};
