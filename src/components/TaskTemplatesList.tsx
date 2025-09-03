import { useRouter } from "next/navigation";

interface TaskTemplateData {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

interface TaskTemplatesListProps {
  setShowCreateForm: (value: boolean) => void;
  showCreateForm: boolean;
  templates: TaskTemplateData[];
  loadTemplates: () => void;
  handleDeleteTemplate: (taskId: string) => void;
}

const TaskTemplatesList = ({ setShowCreateForm, showCreateForm, templates,
  loadTemplates, handleDeleteTemplate }: TaskTemplatesListProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'New Template'}
        </button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Task Templates ({templates.length})
          </h3>
          <button
            onClick={loadTemplates}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No task templates found.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Create your first task template
            </button>
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
                      <button
                        onClick={() => router.push(`/task-template/${template.id}`)}
                        className={`font-medium text-left hover:underline text-gray-900 hover:text-blue-600`}
                      >
                        {template.title}
                      </button>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        {template.createdAt && (
                          <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTemplate(template.id!)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                    title="Delete task"
                  >
                    🗑️
                  </button>
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
