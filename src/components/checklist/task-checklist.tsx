import { ChecklistItem } from "@/types";
import { Button } from "@heroui/react";
import { useTranslations } from 'next-intl';

type TaskChecklistProps = {
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;
  readOnly?: boolean;
};

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ checklistItems, setChecklistItems, readOnly }) => {
  const t = useTranslations('TaskChecklists');

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
              disabled={readOnly}
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) =>
                item.id !== undefined
                  ? updateItem(item.id, { text: e.target.value })
                  : updateItem(idx, { text: e.target.value }, true)
              }
              style={item.completed ? { textDecoration: 'line-through' } : undefined}
              disabled={readOnly}
            />
            {readOnly ? null: (<Button
              variant="light"
              color="danger"
              onPress={() =>
                item.id !== undefined
                  ? deleteItem(item.id)
                  : setChecklistItems(checklistItems.filter((_, i) => i !== idx))
              }
              title={t('deleteButton')}
              disabled={readOnly}
            >
              🗑️
            </Button>)}
          </li>
        ))}
      </ul>
      {readOnly ? null: (<Button
        variant="light"
        color="default"
        onPress={addChecklist}
        title={t('addChecklistItem')}
      >
        {t('addChecklistItem')}
      </Button>)}
    </div>
  );
};