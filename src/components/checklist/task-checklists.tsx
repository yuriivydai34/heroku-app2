import React from "react";
import { Button } from "@heroui/react";
import { TaskChecklist } from "./task-checklist";
import { useChecklistContext } from "@/context/checklist-context";

export const TaskChecklists: React.FC = () => {
  const { checklists, setChecklists, createChecklists, updateChecklist, deleteChecklist } = useChecklistContext();

  const createChecklist = () => {
    setChecklists((prev) => [...prev, { title: `Checklist ${prev.length + 1}` }]);
  };

  const setChecklistItems = (idx: number, items: any[]) => {
    setChecklists((prev) =>
      prev.map((checklist, i) =>
        i === idx ? { ...checklist, checklistItems: items } : checklist
      )
    );
  };

  return (
    <div>
      <Button variant="light" onPress={createChecklist}>Add Checklist</Button>
      <div id="checklists">
        {checklists.map((checklist, idx) => (
          <div key={idx}>
            Checklist {checklist.title} <Button variant="light" color="danger" onPress={() => {
              setChecklists((prev) => prev.filter((_, i) => i !== idx));
            }}>Delete</Button>
            <TaskChecklist
              checklistItems={checklist.checklistItems ?? []}
              setChecklistItems={(items) => setChecklistItems(idx, items)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};