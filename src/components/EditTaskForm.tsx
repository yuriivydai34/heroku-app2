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
  userIdAssociate: number;
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
    userIdAssociate: number;
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
          Title *
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
          Description
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
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          value={editForm.deadline ? editForm.deadline.slice(0, 10) : ''}
          onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value || "", description: editForm.description ?? "" })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        />
      </div>
      <div>
        <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
          Supervisor
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
          <option value={0}>Select supervisor</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} (ID: {user.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="associate" className="block text-sm font-medium text-gray-700">
          Associate
        </label>
        <select
          id="associate"
          value={editForm.userIdAssociate || 0}
          onChange={(e) => setEditForm({
            ...editForm,
            userIdAssociate: Number(e.target.value),
            description: editForm.description ?? "",
            deadline: editForm.deadline ?? ""
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
        >
          <option value={0}>Select associate</option>
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
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Update Task
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;