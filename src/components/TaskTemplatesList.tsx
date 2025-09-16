import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const TaskTemplatesList = ({ setShowCreateForm, showCreateForm, templates,
  loadTemplates, handleDeleteTemplate }: TaskTemplatesListProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {showCreateForm ? 'Скасувати' : 'Новий шаблон'}
        </Button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Шаблони задач ({templates.length})
          </h3>
          <Button
            onClick={loadTemplates}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 Оновити
          </Button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Шаблони не знайдені.</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Створіть перший шаблон
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 bg-white border-gray-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">

                    <div className="flex-1">
                      <Button
                        onClick={() => router.push(`/task-template/${template.id}`)}
                        className="bg-gray-400 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Дивитись
                      </Button>
                      <h4 className="text-md font-semibold text-gray-900">
                        {template.title}
                      </h4>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        {template.createdAt && (
                          <span>Створено: {new Date(template.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteTemplate(template.id!)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                    title="Delete task"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTemplatesList;
