'use client';

import React, { createContext, useContext, useState } from "react";
import taskChecklistService from "@/services/task-checklist.service";
import { Checklist } from "@/types";

interface ChecklistContextType {
  checklists: Checklist[];
  setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>;
  fetchChecklists: (taskId: number) => Promise<void>;
  createChecklists: (taskId: number) => Promise<void>;
  updateChecklist: (checklistId: number, checklist: Checklist) => Promise<void>;
  deleteChecklist: (checklistId: number) => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  const fetchChecklists = async (taskId: number) => {
    const res = await taskChecklistService.getTaskChecklists(taskId);
    setChecklists(Array.isArray(res.data) ? res.data : []);
  };

  const createChecklists = async (taskId: number) => {
    const newChecklists = checklists.map(cl => ({ ...cl, taskId }));
    const result = await taskChecklistService.createTaskChecklist(newChecklists);
    if (!result.success) {
      console.error("Error creating checklist:", result.message);
      // Optionally show toast here
    }
  };

  const updateChecklist = async (checklistId: number, checklist: Checklist) => {
    await taskChecklistService.updateTaskChecklist(String(checklistId), checklist);
    // Optionally refetch or update state
  };

  const deleteChecklist = async (checklistId: number) => {
    await taskChecklistService.deleteTaskChecklist(String(checklistId));
    setChecklists(prev => prev.filter(cl => cl.id !== checklistId));
  };

  return (
    <ChecklistContext.Provider
      value={{
        checklists,
        setChecklists,
        fetchChecklists,
        createChecklists,
        updateChecklist,
        deleteChecklist,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklistContext = () => {
  const ctx = useContext(ChecklistContext);
  if (!ctx) throw new Error("useChecklistContext must be used within a ChecklistProvider");
  return ctx;
};