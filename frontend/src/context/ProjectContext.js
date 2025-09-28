// src/context/ProjectContext.js
import React, { createContext, useContext } from 'react';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ projectId, children }) => (
  <ProjectContext.Provider value={projectId}>
    {children}
  </ProjectContext.Provider>
);
