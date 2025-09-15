import { Button } from '@heroui/react';
import EditTaskTemplateForm from './EditTaskTemplateForm';

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

interface TaskTemplateContentProps {
  template: TaskTemplateData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleUpdateTemplate: (e: React.FormEvent) => void;
  editForm: TaskTemplateData;
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
  }>>
  handleDeleteTemplate: () => void;
}

const TaskTemplateContent = ({
  template,
  isEditing,
  setIsEditing,
  handleUpdateTemplate,
  editForm,
  setEditForm,
  handleDeleteTemplate
}: TaskTemplateContentProps) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isEditing ? 'Скасувати' : 'Редагувати'}
        </Button>
        {isEditing ? (
          /* Edit Form */
          <EditTaskTemplateForm
            editForm={editForm} setEditForm={setEditForm}
            handleUpdateTemplate={handleUpdateTemplate} setIsEditing={setIsEditing}
          />
        ) : (
          /* Task Display */
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className={`text-2xl font-bold text-gray-900`}>
                  {template.title}
                </h2>
              </div>
            </div>

            {template.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Опис</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{template.description}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {template.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Створено</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(template.createdAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                {template.id && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Шаблона</dt>
                    <dd className="mt-1 text-sm text-gray-900">{template.id}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-t pt-6 flex justify-end space-x-3">
              <Button
                onClick={handleDeleteTemplate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Видалити
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTemplateContent;