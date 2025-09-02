import EditTaskForm from './EditTaskForm';

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  userIdCreator: number;
  userIdSupervisor: number;
  usersIdAssociate: number[];
}

interface UserData {
  id: string;
  username: string;
}

interface TaskContentProps {
  task: TaskData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleUpdateTask: (e: React.FormEvent) => void;
  editForm: TaskData;
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    deadline: string;
    userIdCreator: number;
    usersIdAssociate: number[];
    userIdSupervisor: number;
  }>>
  users: UserData[];
  handleToggleComplete: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilesClick: () => void;
  handleDeleteTask: () => void;
}

const TaskContent = ({
  task,
  isEditing,
  setIsEditing,
  handleUpdateTask,
  editForm,
  setEditForm,
  users,
  handleToggleComplete,
  handleFilesClick,
  handleDeleteTask
}: TaskContentProps) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Task'}
        </button>
        {isEditing ? (
          /* Edit Form */
          <EditTaskForm 
            editForm={editForm} setEditForm={setEditForm} users={users} 
            handleUpdateTask={handleUpdateTask} setIsEditing={setIsEditing} 
          />
        ) : (
          /* Task Display */
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                  {task.title}
                </h2>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={handleToggleComplete}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">Mark as completed</label>
              </div>
            </div>

            {task.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {task.deadline && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deadline</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.deadline}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Creator</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {users.find(u => String(u.id) === String(task.userIdCreator))?.username || task.userIdCreator}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Supervisor</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {users.find(u => String(u.id) === String(task.userIdSupervisor))?.username || task.userIdSupervisor}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Associate</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.usersIdAssociate.map(id => users.find(u => String(u.id) === String(id))?.username || id).join(', ')}
                  </dd>
                </div>
                {task.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.createdAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                {task.updatedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                {task.id && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Task ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{task.id}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-t pt-6 flex justify-end space-x-3">
              <button
                onClick={handleFilesClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Files
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskContent;