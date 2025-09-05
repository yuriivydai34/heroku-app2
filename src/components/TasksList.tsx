import moment from "moment";
import { useRouter } from "next/navigation";

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  usersIdAssociate: number[];
  userIdSupervisor: number;
}

interface UserData {
  id: string;
  username: string;
}

interface TasksListProps {
  setShowCreateForm: (value: boolean) => void;
  showCreateForm: boolean;
  tasks: TaskData[];
  loadTasks: () => void;
  handleDeleteTask: (taskId: string) => void;
  users: UserData[];
}

const TasksList = ({ setShowCreateForm, showCreateForm, tasks, 
  loadTasks, handleDeleteTask, users }: TasksListProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'New Task'}
        </button>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Tasks ({tasks.length})
          </h3>
          <button
            onClick={loadTasks}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 ${task.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <button
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className={`font-medium text-left hover:underline text-gray-900 hover:text-blue-600`}
                      >
                        {task.title}
                      </button>
                      {task.description && (
                        <p className={`mt-1 text-sm ${task.active ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {task.description}
                        </p>
                      )}
                      {task.deadline && (
                        <p className={`mt-1 text-sm ${task.active ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Deadline: {moment(task.deadline).utc().format('MMMM Do YYYY, h:mm:ss a')}
                        </p>
                      )}
                      {task.deadline && (
                        <p className={`mt-1 text-sm ${task.active ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Hours until deadline: {moment(task.deadline).diff(moment(), 'hours')} hours
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        {task.createdAt && (
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        )}
                        {task.userIdCreator && (
                          <span>
                            Created by: {users.find(u => String(u.id) === String(task.userIdCreator))?.username || task.userIdCreator}
                          </span>
                        )}
                        {task.usersIdAssociate && (
                          <span>
                            Assigned to: {task.usersIdAssociate.map(id => users.find(u => String(u.id) === String(id))?.username || id).join(', ')}
                          </span>
                        )}
                        {task.userIdSupervisor && (
                          <span>
                            Supervised by: {users.find(u => String(u.id) === String(task.userIdSupervisor))?.username || task.userIdSupervisor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id!)}
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

export default TasksList;
