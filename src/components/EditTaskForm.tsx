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

interface EditTaskFormProps {
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
  handleUpdateTask: (e: React.FormEvent) => void;
  setIsEditing: (value: boolean) => void;
}

const EditTaskForm = ({
  editForm,
  setEditForm,
  users,
  handleUpdateTask,
  setIsEditing
}: EditTaskFormProps) => {
  return (
    <form onSubmit={handleUpdateTask} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Назва *
        </label>
        <input
          type="text"
          id="title"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value, description: editForm.description ?? "", deadline: editForm.deadline ?? "" })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Опис
        </label>
        <textarea
          id="description"
          value={editForm.description}
          onChange={(e) => setEditForm({
            ...editForm,
            description: e.target.value ?? "",
            deadline: editForm.deadline ?? ""
          })}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        />
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
          Зробити до
        </label>
        <input
          type="datetime-local"
          id="deadline"
          value={editForm.deadline
            ? editForm.deadline.slice(0, 16) // "YYYY-MM-DDTHH:mm"
            : ''}
          onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value || "", description: editForm.description ?? "" })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        />
      </div>
      <div>
        <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
          Наглядач
        </label>
        <select
          id="supervisor"
          value={editForm.userIdSupervisor || 0}
          onChange={(e) => setEditForm({
            ...editForm,
            userIdSupervisor: Number(e.target.value),
            description: editForm.description ?? "",
            deadline: editForm.deadline ?? ""
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          <option value={0}>Оберіть наглядача</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="associate" className="block text-sm font-medium text-gray-700">
          Колега
        </label>
        <select
          id="associate"
          multiple
          value={(editForm.usersIdAssociate ?? []).map(String)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
            setEditForm({
              ...editForm,
              usersIdAssociate: selected, // This will be an array of numbers
              description: editForm.description ?? "",
              deadline: editForm.deadline ?? ""
            });
          }}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Скасувати
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Оновити
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;