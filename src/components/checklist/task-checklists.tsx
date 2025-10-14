import React from "react";
import { Button, Input } from "@heroui/react";
import { TaskChecklist } from "./task-checklist";
import { useChecklistContext } from "@/context/checklist-context";
import { useTranslations } from 'next-intl';

export const TaskChecklists: React.FC<{ taskId?: string, readOnly?: boolean }> = ({ taskId, readOnly }) => {
  const { checklists, setChecklists, fetchChecklists, createChecklists, updateChecklist, deleteChecklist } = useChecklistContext();
  
  const t = useTranslations('TaskChecklists');

  React.useEffect(() => {
    if (taskId && taskId !== "" && !isNaN(Number(taskId))) {
      fetchChecklists(Number(taskId));
    }
  }, [taskId, fetchChecklists]);

  const createChecklist = () => {
    setChecklists((prev) => [...prev, { title: `Checklist ${prev.length + 1}` }]);
  };

  const handleDeleteChecklist = async (idx: number) => {
    const checklist = checklists[idx];
    
    // If checklist has an ID, it exists in the backend and should be deleted
    if (checklist.id) {
      try {
        await deleteChecklist(checklist.id);
        // The context's deleteChecklist function will handle state update
      } catch (error) {
        console.error("Failed to delete checklist:", error);
        return; // Don't remove from local state if backend deletion failed
      }
    } else {
      // For new checklists without ID, just remove from local state
      setChecklists((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateChecklist = async (idx: number, updatedChecklist: any) => {
    const checklist = checklists[idx];
    
    // Update local state first
    setChecklists((prev) =>
      prev.map((cl, i) =>
        i === idx ? { ...cl, ...updatedChecklist } : cl
      )
    );

    // If checklist has an ID, update it in the backend
    if (checklist.id && taskId) {
      try {
        await updateChecklist(checklist.id, { ...checklist, ...updatedChecklist, taskId: Number(taskId) });
      } catch (error) {
        console.error("Failed to update checklist:", error);
      }
    }
  };

  const setChecklistItems = (idx: number, items: any[]) => {
    const updatedData = { checklistItems: items };
    handleUpdateChecklist(idx, updatedData);
  };

  const handleTitleChange = (idx: number, title: string) => {
    const updatedData = { title };
    handleUpdateChecklist(idx, updatedData);
  };

  return (
    <div>
      {readOnly ? null: (<Button 
        variant="light" 
        onPress={createChecklist}
        >{t('addChecklistButton')}</Button>)}
      <div id="checklists">
        {checklists.map((checklist, idx) => (
          <div key={checklist.id || idx} className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={checklist.title}
                onChange={(e) => handleTitleChange(idx, e.target.value)}
                placeholder={t('checklistTitlePlaceholder')}
                size="sm"
                variant="underlined"
                className="flex-1"
                disabled={readOnly}
              />
              {readOnly ? null: (<Button 
                variant="light" 
                color="danger" 
                size="sm"
                onPress={() => handleDeleteChecklist(idx)}
              >
                {t('deleteButton')}
              </Button>)}
            </div>
            <TaskChecklist
              checklistItems={checklist.checklistItems ?? []}
              setChecklistItems={(items) => setChecklistItems(idx, items)}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  );
};