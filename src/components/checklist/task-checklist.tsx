import { ChecklistItem } from "@/types";
import { Button } from "@heroui/react";

type TaskChecklistProps = {
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;
};

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ checklistItems, setChecklistItems }) => {
  const addChecklist = () => {
    setChecklistItems([
      ...checklistItems,
      { text: "", completed: false }
    ]);
  };

  const updateItem = (idOrIdx: number, changes: Partial<ChecklistItem>, useIndex = false) => {
    setChecklistItems(
      checklistItems.map((item, idx) =>
        useIndex
          ? idx === idOrIdx
            ? { ...item, ...changes }
            : item
          : item.id === idOrIdx
            ? { ...item, ...changes }
            : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      <ul>
        {checklistItems.map((item, idx) => (
          <li key={item.id ?? idx}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() =>
                item.id !== undefined
                  ? updateItem(item.id, { completed: !item.completed })
                  : updateItem(idx, { completed: !item.completed }, true)
              }
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) =>
                item.id !== undefined
                  ? updateItem(item.id, { text: e.target.value })
                  : updateItem(idx, { text: e.target.value }, true)
              }
            />
            <Button
              variant="light"
              color="danger"
              onPress={() =>
                item.id !== undefined
                  ? deleteItem(item.id)
                  : setChecklistItems(checklistItems.filter((_, i) => i !== idx))
              }
              title="Delete"
            >
              🗑️
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant="light"
        color="default"
        onPress={addChecklist}
        title="Add Checklist Item"
      >
        Add Checklist Item
      </Button>
    </div>
  );
};