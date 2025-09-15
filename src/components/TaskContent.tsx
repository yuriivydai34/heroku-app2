import moment from 'moment';
import 'moment/locale/uk'; // Import the Ukrainian locale
import EditTaskForm from './EditTaskForm';
import { Button } from '@heroui/react';

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  active?: boolean;
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
  handleToggleActive: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilesClick: () => void;
  handleDeleteTask: () => void;
}

moment.locale('uk');

const TaskContent = ({
  task,
  isEditing,
  setIsEditing,
  handleUpdateTask,
  editForm,
  setEditForm,
  users,
  handleToggleActive,
  handleFilesClick,
  handleDeleteTask
}: TaskContentProps) => {
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
          <EditTaskForm 
            editForm={editForm} setEditForm={setEditForm} users={users} 
            handleUpdateTask={handleUpdateTask} setIsEditing={setIsEditing} 
          />
        ) : (
          /* Task Display */
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className={`text-2xl font-bold text-gray-900`}>
                  {task.title}
                </h2>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task.active ? 'Активна' : 'Не активна'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.active || false}
                  onChange={handleToggleActive}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">Активна</label>
              </div>
            </div>

            {task.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Опис</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {task.deadline && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Зробити до</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{moment(task.deadline).utc().format('MMMM Do YYYY, h:mm:ss a')}</p>
              </div>
            )}

            {task.deadline && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Лишилось годин до кінця</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{moment(task.deadline).diff(moment(), 'hours')} годин</p>
              </div>
            )}

            <div className="border-t pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Автор</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {users.find(u => String(u.id) === String(task.userIdCreator))?.username || task.userIdCreator}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Наглядач</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {users.find(u => String(u.id) === String(task.userIdSupervisor))?.username || task.userIdSupervisor}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Колега</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {task.usersIdAssociate.map(id => users.find(u => String(u.id) === String(id))?.username || id).join(', ')}
                  </dd>
                </div>
                {task.createdAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Створено</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.createdAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                {task.updatedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Оновлено</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                {task.id && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Задачі</dt>
                    <dd className="mt-1 text-sm text-gray-900">{task.id}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-t pt-6 flex justify-end space-x-3">
              <Button
                onClick={handleFilesClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Файли
              </Button>
              <Button
                onClick={handleDeleteTask}
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

export default TaskContent;