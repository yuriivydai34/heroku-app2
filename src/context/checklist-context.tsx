'use client';

import React, { createContext, useContext, useState, useCallback } from "react";
import taskChecklistService from "@/services/task-checklist.service";
import { Checklist } from "@/types";

interface ChecklistContextType {
  checklists: Checklist[];
  setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>;
  fetchChecklists: (taskId: number) => Promise<void>;
  createChecklists: (taskId: number) => Promise<void>;
  updateChecklist: (checklistId: number, checklist: Checklist) => Promise<void>;
  deleteChecklist: (checklistId: number) => Promise<void>;
  saveAllChanges: (taskId: number) => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  const fetchChecklists = useCallback(async (taskId: number) => {
    const res = await taskChecklistService.getTaskChecklists(taskId);
    setChecklists(Array.isArray(res.data) ? res.data : []);
  }, []);

  const createChecklists = useCallback(async (taskId: number) => {
    // Only create checklists that don't have an ID (new checklists)
    const newChecklists = checklists
      .filter(cl => !cl.id)
      .map(cl => ({ ...cl, taskId }));
    
    if (newChecklists.length === 0) {
      return; // No new checklists to create
    }
    
    const result = await taskChecklistService.createTaskChecklist(newChecklists);
    if (!result.success) {
      console.error("Error creating checklist:", result.message);
      // Optionally show toast here
    } else {
      // Refresh the checklists to get the newly created ones with IDs
      await fetchChecklists(taskId);
    }
  }, [checklists, fetchChecklists]);

  const updateChecklist = useCallback(async (checklistId: number, checklist: Checklist) => {
    await taskChecklistService.updateTaskChecklist(String(checklistId), checklist);
    // Optionally refetch or update state
  }, []);

  const deleteChecklist = useCallback(async (checklistId: number) => {
    await taskChecklistService.deleteTaskChecklist(String(checklistId));
    setChecklists(prev => prev.filter(cl => cl.id !== checklistId));
  }, []);

  const saveAllChanges = useCallback(async (taskId: number) => {
    // Create any new checklists (those without IDs)
    await createChecklists(taskId);
    
    // Update existing checklists
    const existingChecklists = checklists.filter(cl => cl.id);
    for (const checklist of existingChecklists) {
      if (checklist.id) {
        await updateChecklist(checklist.id, checklist);
      }
    }
  }, [checklists, createChecklists, updateChecklist]);

  return (
    <ChecklistContext.Provider
      value={{
        checklists,
        setChecklists,
        fetchChecklists,
        createChecklists,
        updateChecklist,
        deleteChecklist,
        saveAllChanges,
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